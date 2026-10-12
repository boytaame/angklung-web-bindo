/**
 * Authentic Indonesian Bamboo Angklung Audio Engine
 * Uses real recorded samples of Sundanese Angklung (diatonic scale)
 * Provides:
 * - Dynamic continuous shake audio (Kurulung tremolo) modulated by cursor/thumb tossing velocity
 * - Transient acoustic strikes (Centok & Tohok) on bamboo collisions and directional jerks
 * - Zero-latency pre-decoded Web Audio buffers
 * - Seamless pitch preservation and subtle organic micro-variations
 */

import { NoteInfo } from '../types';
import { DIATONIC_NOTES } from '../data/notes';

export class AngklungAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private dynamicsCompressor: DynamicsCompressorNode | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.9;

  // Cached decoded AudioBuffers keyed by audioFile path
  private bufferCache: Map<string, AudioBuffer> = new Map();
  private loadingPromises: Map<string, Promise<AudioBuffer | null>> = new Map();

  // Active continuous shake loop state
  private activeShakeLoop: AudioBufferSourceNode | null = null;
  private activeShakeGain: GainNode | null = null;
  private activeShakeNote: NoteInfo | null = null;
  private currentShakeIntensity: number = 0;
  private lastShakeUpdateTime: number = 0;

  constructor() {
    // Start preloading files immediately in the background
    if (typeof window !== 'undefined') {
      this.preloadAll();
    }
  }

  public init() {
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();

      // Dynamics compressor prevents harsh digital clipping during vigorous rapid shaking
      this.dynamicsCompressor = this.ctx.createDynamicsCompressor();
      this.dynamicsCompressor.threshold.setValueAtTime(-14, this.ctx.currentTime);
      this.dynamicsCompressor.knee.setValueAtTime(6, this.ctx.currentTime);
      this.dynamicsCompressor.ratio.setValueAtTime(6, this.ctx.currentTime);
      this.dynamicsCompressor.attack.setValueAtTime(0.002, this.ctx.currentTime);
      this.dynamicsCompressor.release.setValueAtTime(0.08, this.ctx.currentTime);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

      this.dynamicsCompressor.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      // Re-trigger decoding if any pending buffers were fetched before AudioContext was ready
      this.preloadAll();
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  private async loadBuffer(url: string): Promise<AudioBuffer | null> {
    if (this.bufferCache.has(url)) {
      return this.bufferCache.get(url)!;
    }
    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url)!;
    }

    const promise = (async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to load ${url}: ${response.status}`);
        }
        const arrayBuffer = await response.arrayBuffer();

        // If context not initialized yet, temporarily create offline or hold arrayBuffer
        if (!this.ctx) {
          const AudioContextClass =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          this.ctx = new AudioContextClass();
        }

        const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
        this.bufferCache.set(url, audioBuffer);
        return audioBuffer;
      } catch (err) {
        console.warn(`Angklung audio load error for ${url}:`, err);
        return null;
      }
    })();

    this.loadingPromises.set(url, promise);
    return promise;
  }

  public preloadAll() {
    for (const note of DIATONIC_NOTES) {
      if (note.audioFile) {
        this.loadBuffer(note.audioFile);
      }
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(
        this.isMuted ? 0 : this.volume,
        this.ctx.currentTime,
        0.02
      );
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(
        this.isMuted ? 0 : this.volume,
        this.ctx.currentTime,
        0.02
      );
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Continuous Shake (Kurulung):
   * Modulates authentic angklung shake noise while being tossed around,
   * dragged, flicked, or shaken via mobile accelerometer.
   * @param intensity Normalized shake strength (0.0 to 1.0)
   * @param note Active musical note
   */
  public setShakeIntensity(intensity: number, note: NoteInfo) {
    this.init();
    if (!this.ctx || !this.dynamicsCompressor || this.isMuted) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;
    const clampedIntensity = Math.min(Math.max(intensity, 0), 1.0);
    this.currentShakeIntensity = clampedIntensity;
    this.lastShakeUpdateTime = performance.now();

    const buffer = this.bufferCache.get(note.audioFile);
    const baseRate = note.playbackRate ?? 1.0;

    // If shake loop is not running and intensity > 0.04, start it
    if (clampedIntensity > 0.04) {
      if (
        !this.activeShakeLoop ||
        !this.activeShakeGain ||
        this.activeShakeNote?.name !== note.name
      ) {
        this.startShakeLoop(note, clampedIntensity, buffer, baseRate);
      } else {
        // Modulate volume and playback rate with shake velocity
        const effectiveGain = Math.pow(clampedIntensity, 0.72) * 0.95;
        this.activeShakeGain.gain.setTargetAtTime(effectiveGain, now, 0.03);

        // Faster shakes subtly speed up bamboo rattle tempo (+/- 8%)
        const rateMod = baseRate * (0.95 + clampedIntensity * 0.12);
        this.activeShakeLoop.playbackRate.setTargetAtTime(rateMod, now, 0.04);
      }
    } else {
      // Quiet down or stop
      if (this.activeShakeGain) {
        this.activeShakeGain.gain.setTargetAtTime(0, now, 0.08);
      }
    }
  }

  private startShakeLoop(
    note: NoteInfo,
    initialIntensity: number,
    buffer: AudioBuffer | undefined,
    baseRate: number
  ) {
    if (!this.ctx || !this.dynamicsCompressor) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Clean up previous loop if note changed
    if (this.activeShakeLoop) {
      try {
        this.activeShakeLoop.stop(now + 0.08);
      } catch {
        // ignore
      }
      this.activeShakeLoop = null;
    }

    if (!buffer) {
      // Buffer not yet cached, fallback to synthesizer shake
      this.playSyntheticShake(note.frequency, initialIntensity);
      return;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    // Loop over the authentic rattle segment
    source.loopStart = 0.05;
    source.loopEnd = Math.min(buffer.duration - 0.1, 1.6);
    source.playbackRate.setValueAtTime(
      baseRate * (0.95 + initialIntensity * 0.12),
      now
    );

    const gainNode = ctx.createGain();
    const effectiveGain = Math.pow(initialIntensity, 0.72) * 0.95;
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(effectiveGain, now + 0.03);

    // Warm bamboo acoustic filter
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(14000, now);

    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.dynamicsCompressor);

    source.start(now);

    this.activeShakeLoop = source;
    this.activeShakeGain = gainNode;
    this.activeShakeNote = note;
  }

  public stopShake() {
    if (this.activeShakeGain && this.ctx) {
      this.activeShakeGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.06);
    }
  }

  /**
   * One-Shot Bamboo Strike (Centok / Collision Strike):
   * Plays a crisp bamboo impact and singing ring using real recorded sample.
   * @param note Target note (or frequency number for backwards compatibility)
   * @param velocity Strike strength (0.05 to 1.0)
   * @param isMutedStrike Shortened Tohok decay
   * @param isLeftHit Timbre/spatial variance (slot wall impact side)
   */
  public playStrike(
    noteOrFreq: NoteInfo | number,
    velocity: number = 0.5,
    isMutedStrike: boolean = false,
    isLeftHit: boolean = true
  ) {
    this.init();
    if (!this.ctx || !this.dynamicsCompressor || this.isMuted) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;
    const clampedVel = Math.min(Math.max(velocity, 0.08), 1.0);
    const effectiveGain = Math.pow(clampedVel, 0.75);

    // Resolve NoteInfo
    let note: NoteInfo;
    if (typeof noteOrFreq === 'number') {
      const match = DIATONIC_NOTES.find(
        (n) => Math.abs(n.frequency - noteOrFreq) < 5
      );
      note = match || DIATONIC_NOTES[0];
    } else {
      note = noteOrFreq;
    }

    const buffer = this.bufferCache.get(note.audioFile);
    if (!buffer) {
      // Fallback synthetic strike while file is buffering
      this.playSyntheticStrike(note.frequency, clampedVel, isMutedStrike, isLeftHit);
      return;
    }

    // 1. Real Bamboo Sample Playback
    const source = ctx.createBufferSource();
    source.buffer = buffer;

    // Base playback rate with micro detuning (organic handmade acoustic variance)
    const baseRate = note.playbackRate ?? 1.0;
    const microDetune = (Math.random() * 14 - 7) / 100; // +/- 7 cents
    source.playbackRate.setValueAtTime(baseRate, now);
    source.detune.setValueAtTime(microDetune * 100, now);

    // Random start offset between strike transients (0, 0.06s, 0.12s) to prevent repetitive phase
    const startOffsets = [0.0, 0.04, 0.09];
    const offset = startOffsets[Math.floor(Math.random() * startOffsets.length)];

    const strikeGain = ctx.createGain();
    strikeGain.gain.setValueAtTime(0.001, now);
    strikeGain.gain.linearRampToValueAtTime(effectiveGain * 0.9, now + 0.006);

    const decayDuration = isMutedStrike ? 0.22 : 0.85;
    strikeGain.gain.exponentialRampToValueAtTime(0.001, now + decayDuration);

    // Panning & acoustic body resonance
    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    if (panner) {
      panner.pan.setValueAtTime(isLeftHit ? -0.15 : 0.15, now);
      source.connect(strikeGain);
      strikeGain.connect(panner);
      panner.connect(this.dynamicsCompressor);
    } else {
      source.connect(strikeGain);
      strikeGain.connect(this.dynamicsCompressor);
    }

    source.start(now, offset);
    source.stop(now + decayDuration + 0.05);

    // 2. High-impact woody click exciter (bamboo foot hitting slot wood)
    if (clampedVel > 0.3) {
      this.playWoodClackTransient(clampedVel, isLeftHit, now);
    }
  }

  private playWoodClackTransient(velocity: number, isLeftHit: boolean, now: number) {
    if (!this.ctx || !this.dynamicsCompressor) return;
    const ctx = this.ctx;

    // Very short high-frequency noise burst for crisp bamboo contact
    const bufSize = Math.floor(ctx.sampleRate * 0.02);
    const noiseBuffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.003));
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(isLeftHit ? 2400 : 2800, now);
    filter.Q.setValueAtTime(3.0, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(velocity * 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(this.dynamicsCompressor);

    noiseSource.start(now);
    noiseSource.stop(now + 0.025);
  }

  // --- Fallback Synthesizer for when network buffers are loading ---
  private playSyntheticShake(freq: number, intensity: number) {
    if (!this.ctx || !this.dynamicsCompressor) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(intensity * 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain);
    gain.connect(this.dynamicsCompressor);
    osc.start(now);
    osc.stop(now + 0.13);
  }

  private playSyntheticStrike(
    freq: number,
    velocity: number,
    isMuted: boolean,
    isLeftHit: boolean
  ) {
    if (!this.ctx || !this.dynamicsCompressor) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    const dur = isMuted ? 0.12 : 0.45;
    gain.gain.setValueAtTime(velocity * 0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    osc.connect(gain);
    gain.connect(this.dynamicsCompressor);
    osc.start(now);
    osc.stop(now + dur + 0.02);
    this.playWoodClackTransient(velocity, isLeftHit, now);
  }
}

export const angklungAudio = new AngklungAudioEngine();
