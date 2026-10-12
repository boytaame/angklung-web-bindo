import React, { useState, useEffect, useRef } from 'react';
import { TRADITIONAL_SONGS } from '../data/songs';
import { DIATONIC_NOTES } from '../data/notes';
import { Song, NoteInfo } from '../types';
import { Play, Pause, RotateCcw, Music } from 'lucide-react';

interface SongGuideProps {
  currentNoteIndex: number;
  onSelectNote: (index: number) => void;
  onTriggerShake: () => void;
}

export const SongGuide: React.FC<SongGuideProps> = ({
  currentNoteIndex,
  onSelectNote,
  onTriggerShake,
}) => {
  const [selectedSong, setSelectedSong] = useState<Song>(TRADITIONAL_SONGS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const playTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Stop playback when component unmounts
  useEffect(() => {
    return () => {
      if (playTimeoutRef.current) clearTimeout(playTimeoutRef.current);
    };
  }, []);

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentStep(-1);
    if (playTimeoutRef.current) clearTimeout(playTimeoutRef.current);
  };

  const handlePlaySong = () => {
    if (isPlaying) {
      handleStop();
      return;
    }

    setIsPlaying(true);
    let step = 0;

    const playNext = () => {
      if (step >= selectedSong.notes.length) {
        handleStop();
        return;
      }

      setCurrentStep(step);
      const noteItem = selectedSong.notes[step];
      onSelectNote(noteItem.noteIndex);
      onTriggerShake();

      step++;
      const nextDelay = noteItem.duration + noteItem.pauseAfter;
      playTimeoutRef.current = setTimeout(playNext, nextDelay);
    };

    playNext();
  };

  const handleSelectSong = (song: Song) => {
    handleStop();
    setSelectedSong(song);
  };

  return (
    <div className="w-full bg-stone-900/60 border border-amber-900/40 rounded-2xl p-4 sm:p-5 text-amber-50 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Music className="w-4 h-4 text-amber-400" />
          <h3 className="font-semibold text-sm sm:text-base text-amber-200">
            Nusantara Folk Melodies (Lagu Daerah)
          </h3>
        </div>
        <div className="flex items-center space-x-1.5">
          <button
            onClick={handlePlaySong}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isPlaying
                ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/20'
                : 'bg-amber-800/60 hover:bg-amber-700/70 text-amber-100 border border-amber-600/40'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause Auto-Play</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Auto-Perform Melody</span>
              </>
            )}
          </button>

          {isPlaying && (
            <button
              onClick={handleStop}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Song Selector Pills */}
      <div className="flex flex-wrap gap-2 mb-3">
        {TRADITIONAL_SONGS.map((song) => {
          const isSel = selectedSong.id === song.id;
          return (
            <button
              key={song.id}
              onClick={() => handleSelectSong(song)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                isSel
                  ? 'bg-amber-600 text-stone-950 font-bold shadow-md'
                  : 'bg-stone-800/80 hover:bg-stone-800 text-amber-200/80 border border-amber-900/30'
              }`}
            >
              {song.title} <span className="opacity-70 text-[10px]">({song.origin})</span>
            </button>
          );
        })}
      </div>

      {/* Song Lyric & Visual Note Sequence Flow */}
      <div className="relative overflow-x-auto py-2 px-1 scrollbar-thin scrollbar-thumb-amber-700">
        <div className="flex items-center space-x-2 min-w-max">
          {selectedSong.notes.map((noteItem, idx) => {
            const noteObj: NoteInfo = DIATONIC_NOTES[noteItem.noteIndex] || DIATONIC_NOTES[0];
            const isCurrent = currentStep === idx;
            const isTargetNote = currentNoteIndex === noteItem.noteIndex;

            return (
              <div
                key={idx}
                onClick={() => {
                  onSelectNote(noteItem.noteIndex);
                  onTriggerShake();
                }}
                className={`cursor-pointer flex flex-col items-center justify-center px-2.5 py-1.5 rounded-xl border transition-all duration-150 ${
                  isCurrent
                    ? 'scale-110 bg-amber-400 text-stone-950 border-amber-200 ring-2 ring-amber-300 font-bold shadow-lg shadow-amber-400/30'
                    : isTargetNote
                    ? 'bg-amber-950/70 border-amber-500/60 text-amber-200'
                    : 'bg-stone-950/50 border-stone-800 text-stone-300 hover:border-amber-700/50'
                }`}
              >
                <span className="text-[10px] uppercase font-mono opacity-80">{noteObj.name}</span>
                <span className="text-xs font-bold">{noteObj.solfege.split(' ')[0]}</span>
                {noteItem.lyric && (
                  <span className="text-[10px] mt-0.5 tracking-tight font-medium text-amber-300/90 whitespace-nowrap">
                    {noteItem.lyric}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
