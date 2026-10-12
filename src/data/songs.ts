import { Song } from '../types';

export const TRADITIONAL_SONGS: Song[] = [
  {
    id: 'burung-kakak-tua',
    title: 'Burung Kakak Tua',
    origin: 'Maluku / Nusantara',
    description: 'A famous Indonesian folk melody played with bright, joyful angklung shakes.',
    notes: [
      { noteIndex: 2, duration: 400, pauseAfter: 100, lyric: 'Bu-' }, // E
      { noteIndex: 2, duration: 400, pauseAfter: 100, lyric: 'rung' }, // E
      { noteIndex: 4, duration: 500, pauseAfter: 150, lyric: 'ka-' }, // G
      { noteIndex: 4, duration: 500, pauseAfter: 200, lyric: 'kak' }, // G
      { noteIndex: 2, duration: 600, pauseAfter: 250, lyric: 'tu-' }, // E
      { noteIndex: 1, duration: 700, pauseAfter: 400, lyric: 'a' }, // D
      { noteIndex: 3, duration: 400, pauseAfter: 100, lyric: 'hing-' }, // F
      { noteIndex: 3, duration: 400, pauseAfter: 100, lyric: 'gap' }, // F
      { noteIndex: 5, duration: 500, pauseAfter: 150, lyric: 'di' }, // A
      { noteIndex: 4, duration: 500, pauseAfter: 200, lyric: 'jen-' }, // G
      { noteIndex: 3, duration: 600, pauseAfter: 250, lyric: 'de-' }, // F
      { noteIndex: 2, duration: 700, pauseAfter: 400, lyric: 'la' }, // E
      { noteIndex: 2, duration: 400, pauseAfter: 100, lyric: 'ne-' }, // E
      { noteIndex: 2, duration: 400, pauseAfter: 100, lyric: 'nek' }, // E
      { noteIndex: 4, duration: 500, pauseAfter: 150, lyric: 'su-' }, // G
      { noteIndex: 4, duration: 500, pauseAfter: 200, lyric: 'dah' }, // G
      { noteIndex: 2, duration: 600, pauseAfter: 250, lyric: 'tu-' }, // E
      { noteIndex: 1, duration: 700, pauseAfter: 400, lyric: 'a' }, // D
      { noteIndex: 0, duration: 400, pauseAfter: 100, lyric: 'gi-' }, // C
      { noteIndex: 1, duration: 400, pauseAfter: 100, lyric: 'gi-' }, // D
      { noteIndex: 2, duration: 500, pauseAfter: 150, lyric: 'nya' }, // E
      { noteIndex: 1, duration: 500, pauseAfter: 200, lyric: 'ting-' }, // D
      { noteIndex: 2, duration: 600, pauseAfter: 200, lyric: 'gal' }, // E
      { noteIndex: 0, duration: 900, pauseAfter: 600, lyric: 'dua' }, // C
    ],
  },
  {
    id: 'manuk-dadali',
    title: 'Manuk Dadali',
    origin: 'West Java (Sunda)',
    description: 'Iconic Sundanese song composed by Sambas Mangundikarta, celebrating the noble garuda bird.',
    notes: [
      { noteIndex: 4, duration: 400, pauseAfter: 120, lyric: 'Mesat' }, // G
      { noteIndex: 5, duration: 400, pauseAfter: 120, lyric: 'ngapung' }, // A
      { noteIndex: 7, duration: 500, pauseAfter: 200, lyric: 'luhur' }, // C5
      { noteIndex: 5, duration: 400, pauseAfter: 150, lyric: 'jauh' }, // A
      { noteIndex: 4, duration: 600, pauseAfter: 300, lyric: 'di awang' }, // G
      { noteIndex: 5, duration: 400, pauseAfter: 120, lyric: 'Meber-' }, // A
      { noteIndex: 4, duration: 400, pauseAfter: 120, lyric: 'keun' }, // G
      { noteIndex: 2, duration: 500, pauseAfter: 200, lyric: 'jan-' }, // E
      { noteIndex: 1, duration: 500, pauseAfter: 200, lyric: 'jang-' }, // D
      { noteIndex: 0, duration: 700, pauseAfter: 400, lyric: 'na' }, // C
    ],
  },
  {
    id: 'gundul-pacul',
    title: 'Gundul Gundul Pacul',
    origin: 'Central Java',
    description: 'Playful traditional Javanese song with rhythmic syncopation.',
    notes: [
      { noteIndex: 0, duration: 400, pauseAfter: 150, lyric: 'Gun-' }, // C
      { noteIndex: 2, duration: 400, pauseAfter: 150, lyric: 'dul' }, // E
      { noteIndex: 0, duration: 400, pauseAfter: 150, lyric: 'gun-' }, // C
      { noteIndex: 2, duration: 400, pauseAfter: 200, lyric: 'dul' }, // E
      { noteIndex: 3, duration: 400, pauseAfter: 150, lyric: 'pa-' }, // F
      { noteIndex: 4, duration: 600, pauseAfter: 300, lyric: 'cul' }, // G
      { noteIndex: 4, duration: 600, pauseAfter: 300, lyric: 'cul' }, // G
      { noteIndex: 5, duration: 400, pauseAfter: 150, lyric: 'gem-' }, // A
      { noteIndex: 4, duration: 400, pauseAfter: 150, lyric: 'be-' }, // G
      { noteIndex: 3, duration: 400, pauseAfter: 150, lyric: 'le-' }, // F
      { noteIndex: 2, duration: 400, pauseAfter: 150, lyric: 'ngan' }, // E
      { noteIndex: 0, duration: 600, pauseAfter: 300, lyric: '' }, // C
    ],
  },
];
