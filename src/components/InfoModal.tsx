import React from 'react';
import { X, Hand, Music, ShieldCheck, Heart } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-stone-900 border border-amber-900/60 rounded-3xl p-6 shadow-2xl text-amber-50 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-amber-800">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-amber-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-amber-950 border border-amber-700/50 text-amber-400">
            <Music className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-amber-300">The Indonesian Angklung</h2>
            <p className="text-xs text-amber-400/80">
              UNESCO Masterpiece of the Oral and Intangible Heritage (2010)
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 text-xs sm:text-sm text-stone-300 leading-relaxed">
          <div className="bg-amber-950/40 border border-amber-900/40 rounded-2xl p-4">
            <h4 className="font-semibold text-amber-300 mb-1 flex items-center space-x-1.5">
              <span>How It Works &amp; Physics</span>
            </h4>
            <p>
              The Angklung originated in West Java (Sundanese culture). It is crafted from tuned
              bamboo tubes suspended loosely within a bamboo frame. The bottom feet of the tubes
              sit inside horizontal slotted troughs. When shaken sideways, the inertial lag causes
              the feet to strike the bamboo walls, creating a crisp collision that excites the
              resonant air columns tuned in octaves.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-amber-300 flex items-center space-x-1.5">
              <Hand className="w-4 h-4 text-amber-400" />
              <span>How to Interact</span>
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-stone-300">
              <li>
                <strong className="text-amber-200">Grab & Shake:</strong> Click and drag or touch
                the top grip handle, then shake left and right vigorously to rattle the tubes!
              </li>
              <li>
                <strong className="text-amber-200">Mobile Phone Gyro:</strong> Tap{' '}
                <em className="text-amber-400">"Enable Phone Shake"</em> to use your real phone
                accelerometer!
              </li>
              <li>
                <strong className="text-amber-200">Kurulung (Tremolo):</strong> Continuous rapid
                tremolo shaking—the quintessential sound of the Angklung ensemble.
              </li>
              <li>
                <strong className="text-amber-200">Centok (Snap Strike):</strong> A sharp single
                flick creating a brisk, staccato woody accent.
              </li>
            </ul>
          </div>

          <div className="bg-stone-950/60 border border-stone-800 rounded-2xl p-4 flex items-start space-x-3">
            <Heart className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-medium text-amber-200 text-xs">Angklung Padaeng & Daeng Soetigna</h5>
              <p className="text-[11px] text-stone-400 mt-0.5">
                In 1938, music educator Daeng Soetigna adapted the traditional pentatonic Sundanese
                angklung to the Western diatonic scale, allowing it to perform both traditional
                Nusantara folk songs and international orchestral music.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-3 border-t border-amber-900/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs transition-colors shadow-lg"
          >
            Start Playing
          </button>
        </div>
      </div>
    </div>
  );
};
