export interface NoteInfo {
  name: string; // e.g., "C4"
  solfege: string; // e.g., "1 (Do)"
  sundanese: string; // e.g., "Da"
  frequency: number; // Hz (fundamental)
  octaveFrequency: number; // Hz (anak tube = 2x)
  color: string;
  audioFile: string; // Path to real angklung sample in /angklung_audio/
  playbackRate?: number; // Base playback rate (e.g. 1.0 or pitched for C4)
}

export interface PhysicsState {
  frameAngle: number; // radians
  frameAngleVel: number;
  frameX: number; // px offset from rest
  frameY: number;
  handleX: number; // current top handle position
  handleY: number;
  tube1Offset: number; // px relative to slot center (-slotWidth to +slotWidth)
  tube1Vel: number;
  tube2Offset: number;
  tube2Vel: number;
  isDragging: boolean;
  lastShakeIntensity: number;
  lastImpactVelocity: number;
  lastImpactTime: number;
  impactCount: number;
}

export type PlayStyle = 'free' | 'kurulung' | 'centok' | 'tohok';

export interface SongNote {
  noteIndex: number; // index in diatonic scale (0-7)
  duration: number; // ms
  pauseAfter: number; // ms
  lyric?: string;
}

export interface Song {
  id: string;
  title: string;
  origin: string;
  description: string;
  notes: SongNote[];
}
