import React from 'react';
import { DIATONIC_NOTES } from '../data/notes';
import {
  Volume2,
  VolumeX,
  Zap,
  Activity,
  Info,
} from 'lucide-react';

interface ControlsProps {
  currentNoteIndex: number;
  onSelectNote: (index: number) => void;
  onKurulung: () => void;
  onCentok: () => void;
  onTohok: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  volume: number;
  onChangeVolume: (vol: number) => void;
  onOpenInfo: () => void;
  shakeIntensity?: number;
}

export const Controls: React.FC<ControlsProps> = ({
  currentNoteIndex,
  onSelectNote,
  onKurulung,
  onCentok,
  onTohok,
  isMuted,
  onToggleMute,
  volume,
  onChangeVolume,
  onOpenInfo,
  shakeIntensity = 0,
}) => {
  return (
    <div className="w-full flex flex-col space-y-4">
      {/* 1. NOTE SELECTOR / RACK */}
      <div className="bg-stone-900/70 border border-amber-900/40 rounded-2xl p-3 sm:p-4 shadow-xl backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
              Angklung Tuning / Scale
            </span>
            <span className="text-[11px] text-stone-400">
              (Daeng Soetigna Diatonic Padaeng)
            </span>
          </div>
          <button
            onClick={onOpenInfo}
            className="p-1 rounded-full text-amber-400 hover:text-amber-200 hover:bg-amber-950/60 transition-colors"
            title="Angklung History & How to Play"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {/* 8 Note Buttons with Keyboard numbers 1-8 */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {DIATONIC_NOTES.map((note, index) => {
            const isSelected = currentNoteIndex === index;
            return (
              <button
                key={note.name}
                onClick={() => onSelectNote(index)}
                className={`relative flex flex-col items-center py-2 px-1 rounded-xl transition-all duration-150 ${
                  isSelected
                    ? 'bg-gradient-to-b from-amber-500 to-amber-700 text-stone-950 ring-2 ring-amber-300 font-bold shadow-lg scale-105'
                    : 'bg-stone-950/60 hover:bg-amber-950/40 text-amber-100/90 border border-amber-900/30 hover:border-amber-700/50'
                }`}
              >
                {/* Keyboard shortcut badge */}
                <span className="absolute top-1 right-1 text-[9px] font-mono px-1 rounded bg-black/40 text-amber-300/80">
                  {index + 1}
                </span>

                {/* Note color pip */}
                <div
                  className="w-1.5 h-1.5 rounded-full mb-1"
                  style={{ backgroundColor: note.color }}
                />
                <span className="text-sm sm:text-base font-extrabold leading-tight">
                  {note.solfege.split(' ')[0]}
                </span>
                <span className="text-[10px] opacity-80 uppercase tracking-tighter">
                  {note.name}
                </span>
                <span className="text-[9px] italic opacity-65">{note.sundanese}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. PLAY TECHNIQUES & ACTIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Kurulung (Tremolo Shake) */}
        <button
          id="btn-kurulung"
          onClick={onKurulung}
          className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold shadow-md hover:shadow-lg hover:shadow-amber-500/20 active:scale-95 transition-all text-sm"
        >
          <Activity className="w-4 h-4" />
          <span>Kurulung (Tremolo) [Space]</span>
        </button>

        {/* Centok (Snap Strike) */}
        <button
          id="btn-centok"
          onClick={onCentok}
          className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-stone-800 hover:bg-stone-700/80 text-amber-200 border border-amber-800/40 font-semibold shadow hover:shadow-md active:scale-95 transition-all text-sm"
        >
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Centok (Snap) [C / ← →]</span>
        </button>

        {/* Tohok (Muted Strike) */}
        <button
          id="btn-tohok"
          onClick={onTohok}
          className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-stone-800 hover:bg-stone-700/80 text-amber-200 border border-amber-800/40 font-semibold shadow hover:shadow-md active:scale-95 transition-all text-sm"
        >
          <span>Tohok (Muted) [T]</span>
        </button>
      </div>

      {/* 3. AUDIO SETTINGS */}
      <div className="bg-stone-900/60 border border-amber-900/30 rounded-2xl p-3.5 flex flex-col gap-3 text-xs text-amber-100">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Volume & Mute Controls */}
          <div className="flex items-center space-x-3 ml-auto">
            <button
              onClick={onToggleMute}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 transition-colors"
              title={isMuted ? 'Unmute (Key: M)' : 'Mute (Key: M)'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <div className="flex items-center space-x-2 w-24 sm:w-32">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Live Shake Intensity Meter */}
        <div className="w-full flex items-center space-x-2.5 pt-1 border-t border-amber-900/20">
          <span className="text-[11px] text-stone-400 whitespace-nowrap">
            Shake Intensity:
          </span>
          <div className="w-full h-2 rounded-full bg-stone-950 overflow-hidden border border-stone-800 relative">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 transition-all duration-75"
              style={{ width: `${Math.round(shakeIntensity * 100)}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-amber-300 w-8 text-right">
            {Math.round(shakeIntensity * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};
