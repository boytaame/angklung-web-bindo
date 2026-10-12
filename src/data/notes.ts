import { NoteInfo } from '../types';

export const DIATONIC_NOTES: NoteInfo[] = [
  {
    name: 'C4',
    solfege: '1 (Do)',
    sundanese: 'Da',
    frequency: 261.63,
    octaveFrequency: 523.25,
    color: '#D97706', // Amber 600
    audioFile: '/angklung_audio/47790002-angklung-d-4-95-279384.mp3',
    playbackRate: 261.63 / 293.66, // ~0.891 (pitched down one whole step)
  },
  {
    name: 'D4',
    solfege: '2 (Re)',
    sundanese: 'Mi',
    frequency: 293.66,
    octaveFrequency: 587.33,
    color: '#EA580C', // Orange 600
    audioFile: '/angklung_audio/47790002-angklung-d-4-95-279384.mp3',
    playbackRate: 1.0,
  },
  {
    name: 'E4',
    solfege: '3 (Mi)',
    sundanese: 'Na',
    frequency: 329.63,
    octaveFrequency: 659.25,
    color: '#CA8A04', // Yellow 600
    audioFile: '/angklung_audio/47790002-angklung-e-4-135-279386.mp3',
    playbackRate: 1.0,
  },
  {
    name: 'F4',
    solfege: '4 (Fa)',
    sundanese: 'Ti',
    frequency: 349.23,
    octaveFrequency: 698.46,
    color: '#16A34A', // Green 600
    audioFile: '/angklung_audio/47790002-angklung-f-4-120-279387.mp3',
    playbackRate: 1.0,
  },
  {
    name: 'G4',
    solfege: '5 (Sol)',
    sundanese: 'La',
    frequency: 392.0,
    octaveFrequency: 783.99,
    color: '#0D9488', // Teal 600
    audioFile: '/angklung_audio/47790002-angklung-g-4-85-279390.mp3',
    playbackRate: 1.0,
  },
  {
    name: 'A4',
    solfege: '6 (La)',
    sundanese: 'Da',
    frequency: 440.0,
    octaveFrequency: 880.0,
    color: '#2563EB', // Blue 600
    audioFile: '/angklung_audio/47790002-angklung-a-4-133-279380.mp3',
    playbackRate: 1.0,
  },
  {
    name: 'B4',
    solfege: '7 (Si)',
    sundanese: 'Mi',
    frequency: 493.88,
    octaveFrequency: 987.77,
    color: '#7C3AED', // Violet 600
    audioFile: '/angklung_audio/47790002-angklung-b-4-97-279381.mp3',
    playbackRate: 1.0,
  },
  {
    name: 'C5',
    solfege: "1' (Do)",
    sundanese: 'Na',
    frequency: 523.25,
    octaveFrequency: 1046.5,
    color: '#DB2777', // Pink 600
    audioFile: '/angklung_audio/47790002-angklung-c-5-87-279382.mp3',
    playbackRate: 1.0,
  },
];
