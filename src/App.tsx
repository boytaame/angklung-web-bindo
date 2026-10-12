/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DIATONIC_NOTES } from './data/notes';
import { AngklungPhysics, CollisionEvent } from './physics/AngklungPhysics';
import { angklungAudio } from './audio/AngklungSynthesizer';
import { AngklungInstrument } from './components/AngklungInstrument';
import { PresentationLanding } from './components/PresentationLanding';
import { Volume2, VolumeX, ArrowLeft, Zap, Music, ChevronDown, Check } from 'lucide-react';

export interface SongItem {
  id: string;
  title: string;
  subtitle: string;
  path: string;
}

export const AVAILABLE_SONGS: SongItem[] = [
  {
    id: 'on-my-way',
    title: 'On My Way',
    subtitle: 'Alan Walker (Angklung Cover)',
    path: '/angklung_audio/on-my-way-angklung-cover.mp3',
  },
  {
    id: 'indonesia-raya',
    title: 'Indonesia Raya',
    subtitle: 'Angklung & Orchestra',
    path: '/angklung_audio/indonesia-raya.mp3',
  },
];

export default function App() {
  // Page view mode: presentation landing first, interactive stage second
  const [viewMode, setViewMode] = useState<'presentation' | 'interactive'>('presentation');

  // Audio play mode: individual notes vs cover song
  const [playMode, setPlayMode] = useState<'notes' | 'song'>('notes');
  const playModeRef = useRef<'notes' | 'song'>('notes');
  playModeRef.current = playMode;

  // Selected song & dropdown state
  const [selectedSongId, setSelectedSongId] = useState<string>('on-my-way');
  const [isSongDropdownOpen, setIsSongDropdownOpen] = useState<boolean>(false);
  const songProgressMapRef = useRef<Record<string, number>>({});
  const songDropdownRef = useRef<HTMLDivElement | null>(null);
  const activeSong = AVAILABLE_SONGS.find((s) => s.id === selectedSongId) || AVAILABLE_SONGS[0];

  // Song audio state
  const songAudioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayPendingRef = useRef<boolean>(false);
  const playPromiseRef = useRef<Promise<void> | null>(null);
  const lastMotionTimeRef = useRef<number>(0);
  const wasMovingRef = useRef<boolean>(false);
  const [isSongPlaying, setIsSongPlaying] = useState<boolean>(false);
  const [songTime, setSongTime] = useState<number>(0);
  const [songDuration, setSongDuration] = useState<number>(0);

  // Currently selected diatonic note (0 to 7)
  const [currentNoteIndex, setCurrentNoteIndex] = useState<number>(0);
  const currentNote = DIATONIC_NOTES[currentNoteIndex];

  // Sound mute state
  const [isMuted, setIsMuted] = useState(false);

  // Physics animation frame state
  const [frameAngle, setFrameAngle] = useState(0);
  const [handleX, setHandleX] = useState(0);
  const [handleY, setHandleY] = useState(0);
  const [tube1Offset, setTube1Offset] = useState(0);
  const [tube2Offset, setTube2Offset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lastImpactTime, setLastImpactTime] = useState(0);
  const [lastImpactTube, setLastImpactTube] = useState<0 | 1 | null>(null);

  // Physics instance
  const physicsRef = useRef<AngklungPhysics | null>(null);
  const dragStartRef = useRef<{
    clientX: number;
    clientY: number;
    initialHandleX: number;
    initialHandleY: number;
    time: number;
  } | null>(null);
  const lastPointerMoveRef = useRef<{ clientX: number; clientY: number; time: number } | null>(null);
  const pointerVelocityRef = useRef<number>(0);

  const currentNoteRef = useRef(currentNote);
  currentNoteRef.current = currentNote;

  // Safely play song (prevents interruption AbortErrors)
  const playSong = useCallback(() => {
    const audio = songAudioRef.current;
    if (!audio) return;
    if (audio.paused && !isPlayPendingRef.current) {
      isPlayPendingRef.current = true;
      const p = audio.play();
      playPromiseRef.current = p;
      p.then(() => {
        isPlayPendingRef.current = false;
        setIsSongPlaying(true);
      }).catch(() => {
        isPlayPendingRef.current = false;
      });
    }
  }, []);

  // Safely pause song and remember current position
  const pauseSong = useCallback(() => {
    const audio = songAudioRef.current;
    if (!audio) return;
    if (isPlayPendingRef.current && playPromiseRef.current) {
      playPromiseRef.current
        .then(() => {
          if (songAudioRef.current && !songAudioRef.current.paused) {
            songAudioRef.current.pause();
            setIsSongPlaying(false);
          }
        })
        .catch(() => {});
    } else if (!audio.paused) {
      audio.pause();
      setIsSongPlaying(false);
    }
  }, []);

  // Initialize song audio element
  useEffect(() => {
    const initialSong = AVAILABLE_SONGS.find((s) => s.id === selectedSongId) || AVAILABLE_SONGS[0];
    const audio = new Audio(initialSong.path);
    audio.preload = 'auto';
    audio.loop = true;
    audio.muted = isMuted;

    const onTimeUpdate = () => {
      setSongTime(audio.currentTime);
    };
    const onLoadedMetadata = () => {
      setSongDuration(audio.duration || 0);
    };
    const onEnded = () => {
      audio.currentTime = 0;
      setSongTime(0);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('durationchange', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    songAudioRef.current = audio;

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('durationchange', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  // Close song dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (songDropdownRef.current && !songDropdownRef.current.contains(e.target as Node)) {
        setIsSongDropdownOpen(false);
      }
    };
    if (isSongDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSongDropdownOpen]);

  // Handle switching between songs from the dropdown
  const handleSelectSong = useCallback(
    (newSongId: string) => {
      if (newSongId === selectedSongId) {
        setIsSongDropdownOpen(false);
        return;
      }

      const targetSong = AVAILABLE_SONGS.find((s) => s.id === newSongId);
      if (!targetSong) return;

      const audio = songAudioRef.current;
      if (audio) {
        // Save current timestamp of old song
        songProgressMapRef.current[selectedSongId] = audio.currentTime;
        const wasPlaying = !audio.paused || isSongPlaying;

        pauseSong();

        // Switch to new audio track
        audio.src = targetSong.path;
        audio.load();

        // Restore saved timestamp if any
        const savedTime = songProgressMapRef.current[newSongId] || 0;
        audio.currentTime = savedTime;
        setSongTime(savedTime);

        setSelectedSongId(newSongId);
        setIsSongDropdownOpen(false);

        // Resume if angklung was actively moving or playing
        if (wasPlaying || physicsRef.current?.isMoving()) {
          setTimeout(() => {
            playSong();
          }, 80);
        }
      } else {
        setSelectedSongId(newSongId);
        setIsSongDropdownOpen(false);
      }
    },
    [selectedSongId, isSongPlaying, pauseSong, playSong]
  );

  // Sync mute state to song audio
  useEffect(() => {
    if (songAudioRef.current) {
      songAudioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Handle switching between Notes and Song mode
  const handleSetPlayMode = useCallback(
    (mode: 'notes' | 'song') => {
      setPlayMode(mode);
      playModeRef.current = mode;
      angklungAudio.init();

      if (mode === 'notes') {
        pauseSong();
        wasMovingRef.current = false;
      } else {
        angklungAudio.stopShake();
        // If angklung is moving right now, immediately start song from saved position
        if (physicsRef.current?.isMoving()) {
          lastMotionTimeRef.current = performance.now();
          playSong();
          wasMovingRef.current = true;
        }
      }
    },
    [pauseSong, playSong]
  );

  // Listen to hash changes for smooth back/forward navigation
  useEffect(() => {
    const syncHash = () => {
      if (window.location.hash === '#/play' || window.location.hash === '#play') {
        setViewMode('interactive');
      } else {
        setViewMode('presentation');
      }
    };
    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, []);

  const handleLaunchInteractive = useCallback(() => {
    window.location.hash = '#/play';
    setViewMode('interactive');
    angklungAudio.init();
  }, []);

  const handleReturnToPresentation = useCallback(() => {
    window.location.hash = '#/';
    setViewMode('presentation');
    angklungAudio.stopShake();
    pauseSong();
    wasMovingRef.current = false;
  }, [pauseSong]);

  // Initialize physics engine and collision listener
  useEffect(() => {
    // Preload individual note audio files immediately
    angklungAudio.preloadAll();

    const handleCollision = (event: CollisionEvent) => {
      // Only play individual note strikes in 'notes' mode so it doesn't clash with the cover song
      if (playModeRef.current === 'notes') {
        angklungAudio.playStrike(
          currentNoteRef.current,
          event.velocity,
          false,
          event.isLeftHit
        );
      }

      setLastImpactTime(event.time);
      setLastImpactTube(event.tubeIndex);
    };

    const physics = new AngklungPhysics(handleCollision);
    physicsRef.current = physics;

    // Calculate screen boundaries to confine the instrument entirely within the viewport
    const updateBounds = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const margin = 24;
      const halfW = 180 + 20; // 180px half-width + tilt sway allowance
      const topExtent = 260 + 40; // from center to top of suspension cord
      const bottomExtent = 260 + 15; // from center to bottom frame

      const maxRangeX = Math.max(0, w / 2 - halfW - margin);
      const minX = -maxRangeX;
      const maxX = maxRangeX;

      const minY = -Math.max(0, h / 2 - topExtent - margin);
      const maxY = Math.max(0, h / 2 - bottomExtent - margin);

      physics.setBounds(minX, maxX, minY, maxY);
    };

    updateBounds();
    window.addEventListener('resize', updateBounds);

    // Physics Animation Loop
    let lastTime = performance.now();
    let animId: number;

    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      physics.update(dt);

      // Check whether angklung is physically moving
      const isMoving = physics.isMoving();

      if (playModeRef.current === 'song') {
        if (isMoving) {
          lastMotionTimeRef.current = time;
          playSong();
          wasMovingRef.current = true;
        } else {
          // 200ms grace window for smooth continuity during rapid shake direction flips
          if (wasMovingRef.current && time - lastMotionTimeRef.current > 200) {
            pauseSong();
            wasMovingRef.current = false;
          }
        }
      } else {
        // Continuous dynamic shake audio in 'notes' mode
        const shakeIntensity = physics.getCompositeShakeIntensity();
        angklungAudio.setShakeIntensity(shakeIntensity, currentNoteRef.current);
      }

      setFrameAngle(physics.frameAngle);
      setHandleX(physics.handleX);
      setHandleY(physics.handleY);
      setTube1Offset(physics.tube1Offset);
      setTube2Offset(physics.tube2Offset);
      setIsDragging(physics.isDragging);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', updateBounds);
      cancelAnimationFrame(animId);
      angklungAudio.stopShake();
      pauseSong();
    };
  }, [playSong, pauseSong]);

  // Global Keyboard controls in interactive mode
  useEffect(() => {
    if (viewMode !== 'interactive') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      angklungAudio.init();

      // Key S: Toggle between Notes and Song mode
      if (e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSetPlayMode(playModeRef.current === 'notes' ? 'song' : 'notes');
        return;
      }

      // Number keys 1-8 for notes (Do to Do')
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 8) {
        e.preventDefault();
        setCurrentNoteIndex(num - 1);
        if (physicsRef.current) {
          physicsRef.current.triggerCentok(0.85);
        }
        return;
      }

      // Spacebar or K: Kurulung (tremolo shake)
      if (e.code === 'Space' || e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (physicsRef.current) {
          physicsRef.current.triggerKurulung(1800, 1.25);
        }
        return;
      }

      // Left/Right arrow keys or C: Snap Centok
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (physicsRef.current) {
          physicsRef.current.applyImpulse(-320, 0);
        }
        return;
      }
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'c') {
        e.preventDefault();
        if (physicsRef.current) {
          physicsRef.current.applyImpulse(320, 0);
        }
        return;
      }

      // Key M: Mute
      if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setIsMuted(angklungAudio.toggleMute());
        return;
      }

      // Key Escape: Return to presentation
      if (e.key === 'Escape') {
        e.preventDefault();
        handleReturnToPresentation();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, handleReturnToPresentation, handleSetPlayMode]);

  // Screen-wide pointer event handlers to grab, drag, and shake anywhere on screen
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    // Only capture when on the interactive canvas
    if ((e.target as HTMLElement)?.closest('button') || (e.target as HTMLElement)?.closest('nav')) {
      return;
    }
    e.preventDefault();
    angklungAudio.init();

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    const now = performance.now();
    const currentPhysX = physicsRef.current ? physicsRef.current.handleX : 0;
    const currentPhysY = physicsRef.current ? physicsRef.current.handleY : 0;

    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      initialHandleX: currentPhysX,
      initialHandleY: currentPhysY,
      time: now,
    };
    lastPointerMoveRef.current = { clientX: e.clientX, clientY: e.clientY, time: now };
    pointerVelocityRef.current = 0;

    if (physicsRef.current) {
      physicsRef.current.startDrag(currentPhysX, currentPhysY);
    }
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStartRef.current || !physicsRef.current) return;
    const deltaX = e.clientX - dragStartRef.current.clientX;
    const deltaY = e.clientY - dragStartRef.current.clientY;

    const minX = physicsRef.current.minHandleX;
    const maxX = physicsRef.current.maxHandleX;
    const minY = physicsRef.current.minHandleY;
    const maxY = physicsRef.current.maxHandleY;

    let targetX = dragStartRef.current.initialHandleX + deltaX;
    let targetY = dragStartRef.current.initialHandleY + deltaY;

    // Boundary containment: prevent cursor drift past screen borders
    if (targetX < minX) {
      dragStartRef.current.clientX = e.clientX - (minX - dragStartRef.current.initialHandleX);
      targetX = minX;
    } else if (targetX > maxX) {
      dragStartRef.current.clientX = e.clientX - (maxX - dragStartRef.current.initialHandleX);
      targetX = maxX;
    }

    if (targetY < minY) {
      dragStartRef.current.clientY = e.clientY - (minY - dragStartRef.current.initialHandleY);
      targetY = minY;
    } else if (targetY > maxY) {
      dragStartRef.current.clientY = e.clientY - (maxY - dragStartRef.current.initialHandleY);
      targetY = maxY;
    }

    const now = performance.now();
    if (lastPointerMoveRef.current) {
      const dt = (now - lastPointerMoveRef.current.time) / 1000;
      if (dt > 0.005) {
        const dxMove = e.clientX - lastPointerMoveRef.current.clientX;
        const dyMove = e.clientY - lastPointerMoveRef.current.clientY;
        const moveDist = Math.hypot(dxMove, dyMove);
        const speed = moveDist / dt;

        // Detect direction reversals (shaking back and forth)
        const prevVx = pointerVelocityRef.current;
        const currentVx = dxMove / dt;
        pointerVelocityRef.current = currentVx;

        // If user rapidly flips shake direction (whips/shakes instrument)
        if (Math.sign(currentVx) !== Math.sign(prevVx) && Math.abs(currentVx - prevVx) > 180) {
          physicsRef.current.injectShakeImpulse(currentVx, speed);
        } else if (speed > 260) {
          // Continuous active toss
          physicsRef.current.injectShakeImpulse(currentVx, speed * 0.7);
        }

        lastPointerMoveRef.current = { clientX: e.clientX, clientY: e.clientY, time: now };
      }
    }

    // Confined to screen bounds
    physicsRef.current.updateDrag(targetX, targetY);
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const now = performance.now();
    const dragData = dragStartRef.current;
    dragStartRef.current = null;
    lastPointerMoveRef.current = null;

    if (physicsRef.current) {
      physicsRef.current.endDrag();

      if (dragData) {
        const dist = Math.hypot(e.clientX - dragData.clientX, e.clientY - dragData.clientY);
        const duration = now - dragData.time;

        if (dist < 8 && duration < 240) {
          // Quick tap gives a strike
          const direction = Math.random() > 0.5 ? 1 : -1;
          physicsRef.current.applyImpulse(direction * 300, 0);
        } else if (Math.abs(pointerVelocityRef.current) > 80) {
          // Release flick momentum along motion vector
          const flingForce = Math.min(Math.max(pointerVelocityRef.current * 0.35, -400), 400);
          physicsRef.current.applyImpulse(flingForce, 0);
        }
      }
    }

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleNextNote = useCallback(() => {
    angklungAudio.init();
    setCurrentNoteIndex((prev) => (prev + 1) % DIATONIC_NOTES.length);
    if (physicsRef.current) {
      physicsRef.current.triggerCentok(0.85);
    }
  }, []);

  const handleTapInstrument = useCallback(() => {
    angklungAudio.init();
    if (physicsRef.current) {
      const direction = Math.random() > 0.5 ? 1 : -1;
      physicsRef.current.applyImpulse(direction * 300, 0);
    }
  }, []);

  const handleKurulungShake = useCallback(() => {
    angklungAudio.init();
    if (physicsRef.current) {
      physicsRef.current.triggerKurulung(1800, 1.25);
    }
  }, []);

  const handleCentokFlick = useCallback(() => {
    angklungAudio.init();
    if (physicsRef.current) {
      physicsRef.current.triggerCentok(1.0);
    }
  }, []);

  const handleToggleMute = useCallback(() => {
    const muted = angklungAudio.toggleMute();
    setIsMuted(muted);
    if (songAudioRef.current) {
      songAudioRef.current.muted = muted;
    }
  }, []);

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // 1. PRESENTATION LANDING PAGE VIEW (BEFORE INTERACTIVE PLAY)
  if (viewMode === 'presentation') {
    return (
      <PresentationLanding
        currentNote={currentNote}
        onLaunchInteractive={handleLaunchInteractive}
      />
    );
  }

  // 2. REAL INTERACTIVE ANGKLUNG STAGE VIEW
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden select-none touch-none bg-[#2D160D] text-[#FAF6EE]">
      {/* Subtle Warm Canvas Illumination Matching PDF Palette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(74,37,24,0.6)_0%,#1C0E08_90%)]" />

      {/* Screen Boundary Perimeter Frame matching PDF traditional design */}
      <div className="pointer-events-none absolute inset-3 sm:inset-4 md:inset-5 rounded-2xl md:rounded-3xl border-2 border-[#E5AF6E]/40 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]" />
      {/* Decorative Corner Accents */}
      <div className="pointer-events-none absolute top-3 left-3 sm:top-4 sm:left-4 md:top-5 md:left-5 w-5 h-5 border-t-2 border-l-2 border-[#E5AF6E] rounded-tl-lg" />
      <div className="pointer-events-none absolute top-3 right-3 sm:top-4 sm:right-4 md:top-5 md:right-5 w-5 h-5 border-t-2 border-r-2 border-[#E5AF6E] rounded-tr-lg" />
      <div className="pointer-events-none absolute bottom-3 left-3 sm:bottom-4 sm:left-4 md:bottom-5 md:left-5 w-5 h-5 border-b-2 border-l-2 border-[#E5AF6E] rounded-bl-lg" />
      <div className="pointer-events-none absolute bottom-3 right-3 sm:bottom-4 sm:right-4 md:bottom-5 md:right-5 w-5 h-5 border-b-2 border-r-2 border-[#E5AF6E] rounded-br-lg" />

      {/* TOP FLOATING INTERACTIVE TOOLBAR */}
      <header className="absolute top-4 sm:top-5 inset-x-4 sm:inset-x-5 z-50 flex items-center justify-between pointer-events-none gap-2">
        {/* Back to Presentation Button */}
        <button
          onClick={handleReturnToPresentation}
          className="pointer-events-auto flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-full bg-[#381E13]/90 hover:bg-[#C25438] text-[#FAF6EE] text-xs sm:text-sm font-bold border border-[#E5AF6E]/40 shadow-xl transition-all duration-150 hover:scale-105 active:scale-95 shrink-0"
          title="Kembali ke Presentasi (Esc)"
        >
          <ArrowLeft className="w-4 h-4 text-[#E5AF6E]" />
          <span className="hidden md:inline">Kembali ke Presentasi</span>
          <span className="md:hidden">Kembali</span>
        </button>

        {/* CENTER CONTROLS: "Notes/Song" LIGHT SWITCH + ACTIVE MODE DISPLAY */}
        <div className="pointer-events-auto flex flex-col md:flex-row items-center gap-2 max-w-full">
          {/* THE "Notes/Song" LIGHT SWITCH */}
          <div
            className="flex items-center p-1 rounded-full bg-[#180B05] border-2 border-[#E5AF6E]/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_4px_12px_rgba(0,0,0,0.6)] backdrop-blur-md"
            title="Notes/Song: Saklar Mode Suara (Tekan S untuk beralih)"
          >
            {/* Visual Light Switch: Notes position */}
            <button
              type="button"
              onClick={() => handleSetPlayMode('notes')}
              className={`relative flex items-center space-x-1.5 px-3 py-1 sm:py-1.5 rounded-full text-xs font-black transition-all duration-200 select-none ${
                playMode === 'notes'
                  ? 'bg-[#E5AF6E] text-[#2D140B] shadow-[0_0_14px_rgba(229,175,110,0.9),inset_0_1px_2px_rgba(255,255,255,0.4)] scale-105'
                  : 'text-[#FAF6EE]/50 hover:text-[#FAF6EE]'
              }`}
            >
              {/* Illuminated indicator lamp */}
              <span
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  playMode === 'notes'
                    ? 'bg-[#2D140B] shadow-[0_0_6px_rgba(45,20,11,0.8)]'
                    : 'bg-[#FAF6EE]/20'
                }`}
              />
              <span>Notes</span>
            </button>

            {/* Visual Light Switch: Song position */}
            <button
              type="button"
              onClick={() => handleSetPlayMode('song')}
              className={`relative flex items-center space-x-1.5 px-3 py-1 sm:py-1.5 rounded-full text-xs font-black transition-all duration-200 select-none ${
                playMode === 'song'
                  ? 'bg-[#E5AF6E] text-[#2D140B] shadow-[0_0_14px_rgba(229,175,110,0.9),inset_0_1px_2px_rgba(255,255,255,0.4)] scale-105'
                  : 'text-[#FAF6EE]/50 hover:text-[#FAF6EE]'
              }`}
            >
              {/* Illuminated indicator lamp */}
              <span
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  playMode === 'song'
                    ? 'bg-[#2D140B] shadow-[0_0_6px_rgba(45,20,11,0.8)]'
                    : 'bg-[#FAF6EE]/20'
                }`}
              />
              <Music className="w-3.5 h-3.5" />
              <span>Song</span>
            </button>
          </div>

          {/* ACTIVE MODE PANEL: EITHER DIATONIC RACK OR SONG STATUS BAR */}
          {playMode === 'notes' ? (
            /* DIATONIC NOTE TUNER RACK (1 Do s/d 1' Do) */
            <nav className="flex items-center space-x-1 sm:space-x-1.5 p-1 sm:p-1.5 rounded-full bg-[#381E13]/90 border border-[#E5AF6E]/40 shadow-xl backdrop-blur-md">
              {DIATONIC_NOTES.map((n, idx) => {
                const isSelected = idx === currentNoteIndex;
                return (
                  <button
                    key={n.name}
                    onClick={() => {
                      angklungAudio.init();
                      setCurrentNoteIndex(idx);
                      if (physicsRef.current) {
                        physicsRef.current.triggerCentok(0.85);
                      }
                    }}
                    className={`relative px-2 sm:px-2.5 py-1 rounded-full text-xs font-black transition-all ${
                      isSelected
                        ? 'bg-[#E5AF6E] text-[#381E13] shadow-md scale-105'
                        : 'text-[#FAF6EE]/80 hover:text-[#FAF6EE] hover:bg-[#4A2518]'
                    }`}
                    title={`Nada ${n.solfege} (${n.name}) - Tekan angka ${idx + 1}`}
                  >
                    {n.solfege.split(' ')[0]}
                  </button>
                );
              })}
            </nav>
          ) : (
            /* SONG AUDIO PLAYER STATUS DISPLAY WITH INTERACTIVE DROPDOWN */
            <div ref={songDropdownRef} className="relative z-30">
              <button
                type="button"
                onClick={() => setIsSongDropdownOpen((prev) => !prev)}
                className="flex items-center space-x-2 sm:space-x-3 px-3.5 py-1.5 rounded-full bg-[#381E13]/90 hover:bg-[#4A2518] border border-[#E5AF6E]/50 hover:border-[#E5AF6E] shadow-xl backdrop-blur-md text-xs transition-all duration-150 cursor-pointer group text-left"
                title="Pilih Lagu Angklung (Klik untuk ganti lagu)"
              >
                <div className="flex flex-col min-w-0 pr-1">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-[#FAF6EE] truncate max-w-[110px] sm:max-w-[170px] group-hover:text-[#E5AF6E] transition-colors">
                      {activeSong.title}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-[#E5AF6E] transition-transform duration-200 shrink-0 ${
                        isSongDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                  <span className="text-[10px] text-[#FAF6EE]/60 truncate max-w-[110px] sm:max-w-[170px]">
                    {activeSong.subtitle}
                  </span>
                </div>

                {/* Progress time stamp */}
                <span className="font-mono text-[11px] px-2 py-0.5 rounded-full font-bold bg-[#1C0E08] text-[#E5AF6E] border border-[#E5AF6E]/30 shrink-0">
                  {formatTime(songTime)} / {formatTime(songDuration)}
                </span>

                {/* Live motion status indicator */}
                {isSongPlaying ? (
                  <div className="flex items-center space-x-1.5 text-emerald-400 font-bold shrink-0">
                    {/* Animated audio bounce bars */}
                    <div className="flex items-end space-x-0.5 h-3">
                      <span className="w-0.5 h-3 bg-emerald-400 rounded-full animate-bounce" style={{ animationDuration: '450ms' }} />
                      <span className="w-0.5 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDuration: '300ms' }} />
                      <span className="w-0.5 h-3.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDuration: '550ms' }} />
                    </div>
                    <span className="text-[11px] hidden sm:inline">Memutar</span>
                  </div>
                ) : (
                  <span className="text-[11px] text-[#FAF6EE]/60 italic shrink-0 hidden sm:inline">
                    Dijeda
                  </span>
                )}
              </button>

              {/* DROPDOWN MENU */}
              {isSongDropdownOpen && (
                <div className="absolute top-full mt-2 left-0 sm:left-auto sm:right-0 w-64 sm:w-72 bg-[#23120B] border-2 border-[#E5AF6E] rounded-2xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3.5 py-2 border-b border-[#E5AF6E]/20 bg-[#170904] flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#E5AF6E]">
                      Pilih Cover Lagu Angklung
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#381E13] text-[#FAF6EE]/70 font-semibold">
                      {AVAILABLE_SONGS.length} Lagu
                    </span>
                  </div>

                  <div className="p-1.5 space-y-1">
                    {AVAILABLE_SONGS.map((song) => {
                      const isSelected = song.id === selectedSongId;
                      return (
                        <button
                          key={song.id}
                          type="button"
                          onClick={() => handleSelectSong(song.id)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs transition-all ${
                            isSelected
                              ? 'bg-[#E5AF6E] text-[#2D140B] font-bold shadow-md'
                              : 'text-[#FAF6EE] hover:bg-[#381E13] hover:text-[#FAF6EE]'
                          }`}
                        >
                          <div className="flex flex-col min-w-0 pr-2">
                            <span className="font-bold truncate text-[13px]">{song.title}</span>
                            <span className={`text-[11px] truncate ${isSelected ? 'text-[#2D140B]/80' : 'text-[#FAF6EE]/60'}`}>
                              {song.subtitle}
                            </span>
                          </div>
                          {isSelected ? (
                            <div className="w-6 h-6 rounded-full bg-[#2D140B] text-[#E5AF6E] flex items-center justify-center shrink-0">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1C0E08] text-[#FAF6EE]/70 border border-[#E5AF6E]/20 shrink-0">
                              Pilih
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* SOUND CONTROLS & TRADITIONAL PRESETS */}
        <div className="pointer-events-auto flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          {/* Kurulung Shake Preset */}
          <button
            onClick={handleKurulungShake}
            className="flex items-center px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-[#381E13]/90 hover:bg-[#4A2518] text-[#E5AF6E] text-xs font-bold border border-[#E5AF6E]/40 shadow-xl transition-all hover:scale-105 active:scale-95"
            title="Getarkan Angklung (Spasi / K)"
          >
            <span>Kurulung</span>
          </button>

          {/* Centok Snap Preset */}
          <button
            onClick={handleCentokFlick}
            className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full bg-[#381E13]/90 hover:bg-[#4A2518] text-[#E5AF6E] text-xs font-bold border border-[#E5AF6E]/40 shadow-xl transition-all hover:scale-105 active:scale-95"
            title="Sentak Nada Cepat (C / Panah)"
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Centok</span>
          </button>

          {/* Mute Toggle */}
          <button
            onClick={handleToggleMute}
            className="p-1.5 sm:p-2 rounded-full bg-[#381E13]/90 hover:bg-[#4A2518] text-[#FAF6EE] border border-[#E5AF6E]/40 shadow-xl transition-all hover:scale-105 active:scale-95"
            title={isMuted ? 'Nyalakan Suara (M)' : 'Matikan Suara (M)'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-[#E5AF6E]" />}
          </button>
        </div>
      </header>

      {/* MAIN INTERACTIVE CANVAS WITH POINTER EVENT SHAKE PHYSICS */}
      <main
        id="angklung-interactive-viewport"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
      >
        <AngklungInstrument
          note={currentNote}
          frameAngle={frameAngle}
          handleX={handleX}
          handleY={handleY}
          tube1Offset={tube1Offset}
          tube2Offset={tube2Offset}
          slot1Width={physicsRef.current?.slot1Width || 16}
          slot2Width={physicsRef.current?.slot2Width || 19}
          isDragging={isDragging}
          interactive={true}
          lastImpactTime={lastImpactTime}
          lastImpactTube={lastImpactTube}
          onPointerDownHandle={handlePointerDown}
          onPointerMoveContainer={handlePointerMove}
          onPointerUpContainer={handlePointerUp}
          onTapInstrument={handleTapInstrument}
          onNextNote={handleNextNote}
        />
      </main>

      {/* BOTTOM HINT / PLAY INSTRUCTIONS BAR */}
      <footer className="absolute bottom-5 inset-x-5 pointer-events-none flex justify-center">
        <div className="px-4 py-2 rounded-full bg-[#381E13]/85 border border-[#E5AF6E]/30 text-[11px] sm:text-xs text-[#FAF6EE]/80 backdrop-blur-sm shadow-xl flex items-center space-x-2 sm:space-x-4">
          {playMode === 'song' ? (
            <>
              <span className="text-[#E5AF6E] font-bold">Mode Lagu Aktif:</span>
              <span>Goyang atau gerakkan angklung untuk memutar lagu</span>
              <span className="hidden sm:inline">&bull;</span>
              <span className="hidden sm:inline">Menjeda &amp; melanjutkan otomatis dari posisi terakhir</span>
              <span className="hidden sm:inline">&bull;</span>
              <span className="hidden sm:inline">Tombol S: Beralih ke Notes</span>
            </>
          ) : (
            <>
              <span>Goyang cursor / jari untuk membunyikan</span>
              <span className="hidden sm:inline">&bull;</span>
              <span>Angka 1-8: Ganti Nada</span>
              <span className="hidden sm:inline">&bull;</span>
              <span className="hidden sm:inline">Spasi: Kurulung</span>
              <span className="hidden sm:inline">&bull;</span>
              <span className="hidden sm:inline">Tombol S: Mode Lagu (Cover)</span>
            </>
          )}
        </div>
      </footer>
    </div>
  );
}
