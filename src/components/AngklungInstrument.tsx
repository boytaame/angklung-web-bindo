import React, { useRef, useEffect, useState } from 'react';
import { NoteInfo } from '../types';

interface AngklungInstrumentProps {
  note: NoteInfo;
  frameAngle?: number; // radians
  handleX?: number; // px
  handleY?: number;
  tube1Offset?: number; // px relative to slot center
  tube2Offset?: number;
  slot1Width?: number;
  slot2Width?: number;
  isDragging?: boolean;
  interactive?: boolean; // false = non-interactive showcase preview
  lastImpactTime?: number;
  lastImpactTube?: 0 | 1 | null;
  onPointerDownHandle?: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerMoveContainer?: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerUpContainer?: (e: React.PointerEvent<HTMLDivElement>) => void;
  onTapInstrument?: () => void;
  onNextNote?: () => void;
  onClickPreview?: () => void;
}

export const AngklungInstrument: React.FC<AngklungInstrumentProps> = ({
  note,
  frameAngle = 0,
  handleX = 0,
  handleY = 0,
  tube1Offset = 0,
  tube2Offset = 0,
  slot1Width = 16,
  slot2Width = 19,
  isDragging = false,
  interactive = true,
  lastImpactTime = 0,
  lastImpactTube = null,
  onPointerDownHandle,
  onPointerMoveContainer,
  onPointerUpContainer,
  onTapInstrument,
  onNextNote,
  onClickPreview,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeRipple, setActiveRipple] = useState<{ id: number; x: number; y: number; color: string }[]>([]);

  // Convert frameAngle to degrees for CSS transform
  const deg = (frameAngle * 180) / Math.PI;

  // Visual shockwave ripple on strike (only in interactive mode)
  useEffect(() => {
    if (interactive && lastImpactTime > 0) {
      const isAnak = lastImpactTube === 0;
      const x = isAnak ? 150 + tube1Offset : 230 + tube2Offset;
      const id = Date.now() + Math.random();

      setActiveRipple((prev) => [
        ...prev.slice(-3),
        { id, x, y: 440, color: note.color || '#C25438' },
      ]);

      const timer = setTimeout(() => {
        setActiveRipple((prev) => prev.filter((r) => r.id !== id));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [interactive, lastImpactTime, lastImpactTube, note.color, tube1Offset, tube2Offset]);

  // Subtle tube angular tilt proportional to offset
  const tube1Angle = (tube1Offset / (slot1Width || 16)) * 3.5;
  const tube2Angle = (tube2Offset / (slot2Width || 19)) * 2.8;

  // Solid cartoony palette matching PDF presentation illustrations
  const COLORS = {
    outline: '#381E13', // Bold dark chocolate outline
    bambooMain: '#E8B072', // Warm light bamboo body
    bambooShadow: '#D49553', // Warm cel-shade shadow
    bambooHighlight: '#F3C58F', // Warm light highlight
    bambooPole: '#D99B5B', // Frame pole bamboo
    bambooCavity: '#2D140B', // Dark hollow inner cutout
    rattanTie: '#381E13', // Dark rattan binding
    rattanStitch: '#F4EFE6', // Light rattan twine stitches
    nodeRing: '#381E13', // Bamboo node ring
    accentRed: '#C25438', // Terracotta accent from PDF
  };

  if (!interactive) {
    // PREVIEW MODE: Non-interactive display sitting cleanly inside the showcase
    return (
      <div
        id="angklung-preview-display"
        onClick={onClickPreview}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClickPreview?.();
          }
        }}
        aria-label="Klik untuk memainkan Angklung interaktif"
        className="relative group select-none cursor-pointer flex flex-col items-center justify-center p-4 transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98] focus:outline-none"
      >
        {/* Subtle hover glow ring */}
        <div className="absolute inset-4 rounded-3xl bg-amber-400/10 filter blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Model Container */}
        <div className="relative w-[340px] sm:w-[360px] h-[500px] flex justify-center">
          {/* Top Suspension Cord attached to the handle */}
          <div className="absolute -top-7 w-1 h-7 bg-[#381E13] rounded-full" />

          {/* TOP SUSPENSION HANDLE */}
          <div className="absolute top-0 z-20 w-[180px] h-[40px] -translate-x-1/2 left-1/2 flex flex-col items-center justify-center">
            {/* Top handle Bamboo Grip Bar */}
            <div className="relative w-[150px] h-[16px] rounded-full bg-[#D99B5B] border-[2.5px] border-[#381E13] flex items-center justify-between px-3">
              <div className="w-1.5 h-full bg-[#381E13]" />
              <div className="flex items-center space-x-1">
                <span className="text-[9px] font-extrabold tracking-wider uppercase text-[#381E13]">
                  ANGKLUNG
                </span>
              </div>
              <div className="w-1.5 h-full bg-[#381E13]" />
            </div>
            {/* Rattan suspension loop string */}
            <div className="absolute -top-2.5 w-7 h-3 rounded-t-full border-t-[2.5px] border-l-[2.5px] border-r-[2.5px] border-[#381E13]" />
          </div>

          {/* ANGKLUNG BODY SVG - CARTOONY ART STYLE */}
          <div className="relative w-[340px] sm:w-[360px] h-[480px] origin-top pointer-events-none">
            <svg
              viewBox="0 0 360 480"
              className="w-full h-full drop-shadow-[0_12px_24px_rgba(56,30,19,0.15)]"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* --- OUTER BAMBOO FRAME --- */}
              {/* Tiang Kiri */}
              <rect x="75" y="25" width="13" height="415" rx="6.5" fill={COLORS.bambooPole} stroke={COLORS.outline} strokeWidth="2.5" />
              <rect x="72" y="110" width="19" height="5" rx="2.5" fill={COLORS.nodeRing} />
              <rect x="72" y="235" width="19" height="5" rx="2.5" fill={COLORS.nodeRing} />
              <rect x="72" y="360" width="19" height="5" rx="2.5" fill={COLORS.nodeRing} />

              {/* Tiang Tengah */}
              <rect x="175" y="25" width="12" height="415" rx="6" fill={COLORS.bambooPole} stroke={COLORS.outline} strokeWidth="2.5" />
              <rect x="172" y="110" width="18" height="5" rx="2.5" fill={COLORS.nodeRing} />
              <rect x="172" y="235" width="18" height="5" rx="2.5" fill={COLORS.nodeRing} />
              <rect x="172" y="360" width="18" height="5" rx="2.5" fill={COLORS.nodeRing} />

              {/* Tiang Kanan */}
              <rect x="275" y="25" width="13" height="415" rx="6.5" fill={COLORS.bambooPole} stroke={COLORS.outline} strokeWidth="2.5" />
              <rect x="272" y="110" width="19" height="5" rx="2.5" fill={COLORS.nodeRing} />
              <rect x="272" y="235" width="19" height="5" rx="2.5" fill={COLORS.nodeRing} />
              <rect x="272" y="360" width="19" height="5" rx="2.5" fill={COLORS.nodeRing} />

              {/* Palang Atas */}
              <rect x="60" y="32" width="240" height="14" rx="7" fill={COLORS.bambooPole} stroke={COLORS.outline} strokeWidth="2.5" />

              {/* Palang Tengah */}
              <rect x="60" y="195" width="240" height="12" rx="6" fill={COLORS.bambooPole} stroke={COLORS.outline} strokeWidth="2.5" />

              {/* --- TUBE 1: TABUNG ANAK (Small) --- */}
              <g id="preview-tabung-anak">
                <line x1="125" y1="195" x2="125" y2="225" stroke={COLORS.outline} strokeWidth="2.5" />
                <circle cx="125" cy="225" r="3" fill={COLORS.outline} />

                {/* Sliced top hollow cavity */}
                <path d="M 112 145 C 112 110, 138 110, 138 145 L 138 225 L 112 225 Z" fill={COLORS.bambooCavity} stroke={COLORS.outline} strokeWidth="2.5" />
                {/* Tongue front blade */}
                <path d="M 112 170 Q 125 210 138 170 L 138 145 Q 125 120 112 145 Z" fill={COLORS.bambooMain} stroke={COLORS.outline} strokeWidth="2.5" />

                {/* Main cylinder body */}
                <rect x="111" y="222" width="28" height="200" rx="8" fill={COLORS.bambooMain} stroke={COLORS.outline} strokeWidth="2.5" />
                {/* Clean cel shade stripe */}
                <rect x="113" y="224" width="7" height="196" rx="3.5" fill={COLORS.bambooShadow} />
                {/* Node bands */}
                <rect x="109" y="315" width="32" height="4" rx="2" fill={COLORS.nodeRing} />
                <rect x="109" y="410" width="32" height="4" rx="2" fill={COLORS.nodeRing} />

                {/* Bottom foot peg */}
                <rect x="120" y="420" width="10" height="35" rx="5" fill={COLORS.bambooPole} stroke={COLORS.outline} strokeWidth="2.5" />

                {/* Octave indicator */}
                <rect x="117" y="335" width="16" height="13" rx="3" fill={COLORS.outline} />
                <text x="125" y="345" fill="#F4EFE6" fontSize="8" fontWeight="bold" textAnchor="middle">2×</text>
              </g>

              {/* --- TUBE 2: TABUNG INDUK (Large) --- */}
              <g id="preview-tabung-induk">
                <line x1="225" y1="195" x2="225" y2="215" stroke={COLORS.outline} strokeWidth="2.5" />
                <circle cx="225" cy="215" r="3.5" fill={COLORS.outline} />

                {/* Sliced top hollow cavity */}
                <path d="M 207 90 C 207 55, 243 55, 243 90 L 243 215 L 207 215 Z" fill={COLORS.bambooCavity} stroke={COLORS.outline} strokeWidth="2.5" />
                {/* Tongue front lip */}
                <path d="M 207 125 Q 225 180 243 125 L 243 90 Q 225 62 207 90 Z" fill={COLORS.bambooMain} stroke={COLORS.outline} strokeWidth="2.5" />

                {/* Main cylinder body */}
                <rect x="206" y="212" width="38" height="215" rx="10" fill={COLORS.bambooMain} stroke={COLORS.outline} strokeWidth="2.5" />
                {/* Cel-shade stripe */}
                <rect x="208" y="214" width="9" height="211" rx="4.5" fill={COLORS.bambooShadow} />
                {/* Node bands */}
                <rect x="203" y="295" width="44" height="4.5" rx="2.2" fill={COLORS.nodeRing} />
                <rect x="203" y="385" width="44" height="4.5" rx="2.2" fill={COLORS.nodeRing} />
                <rect x="203" y="420" width="44" height="4.5" rx="2.2" fill={COLORS.nodeRing} />

                {/* Bottom foot peg */}
                <rect x="219" y="426" width="12" height="34" rx="6" fill={COLORS.bambooPole} stroke={COLORS.outline} strokeWidth="2.5" />

                {/* Note Tag */}
                <g transform="translate(225, 330)">
                  <rect x="-18" y="-13" width="36" height="26" rx="5" fill="#FAF6EE" stroke={COLORS.outline} strokeWidth="2" />
                  <text x="0" y="-1" fill={COLORS.outline} fontSize="11" fontWeight="bold" textAnchor="middle">
                    {note.solfege.split(' ')[0]}
                  </text>
                  <text x="0" y="9" fill={COLORS.outline} fontSize="7.5" fontWeight="semibold" textAnchor="middle" opacity="0.8">
                    {note.name}
                  </text>
                </g>
              </g>

              {/* --- BOTTOM BASE TROUGH --- */}
              <rect x="45" y="430" width="270" height="30" rx="15" fill={COLORS.bambooShadow} stroke={COLORS.outline} strokeWidth="3" />
              {/* Highlight strip */}
              <rect x="55" y="433" width="250" height="5" rx="2.5" fill={COLORS.bambooHighlight} opacity="0.6" />

              {/* Cutout slots */}
              <rect x="108" y="438" width="34" height="14" rx="5" fill={COLORS.bambooCavity} stroke={COLORS.outline} strokeWidth="1.5" />
              <rect x="206" y="438" width="38" height="14" rx="5" fill={COLORS.bambooCavity} stroke={COLORS.outline} strokeWidth="1.5" />

              {/* --- RATTAN BINDINGS --- */}
              {/* Top joints */}
              <rect x="71" y="27" width="21" height="24" rx="4" fill={COLORS.rattanTie} stroke={COLORS.outline} strokeWidth="1.5" />
              <line x1="73" y1="29" x2="90" y2="49" stroke={COLORS.rattanStitch} strokeWidth="1.5" />
              <line x1="90" y1="29" x2="73" y2="49" stroke={COLORS.rattanStitch} strokeWidth="1.5" />

              <rect x="171" y="27" width="20" height="24" rx="4" fill={COLORS.rattanTie} stroke={COLORS.outline} strokeWidth="1.5" />
              <line x1="173" y1="29" x2="189" y2="49" stroke={COLORS.rattanStitch} strokeWidth="1.5" />
              <line x1="189" y1="29" x2="173" y2="49" stroke={COLORS.rattanStitch} strokeWidth="1.5" />

              <rect x="271" y="27" width="21" height="24" rx="4" fill={COLORS.rattanTie} stroke={COLORS.outline} strokeWidth="1.5" />
              <line x1="273" y1="29" x2="90" y2="49" stroke={COLORS.rattanStitch} strokeWidth="1.5" />
              <line x1="290" y1="29" x2="273" y2="49" stroke={COLORS.rattanStitch} strokeWidth="1.5" />

              {/* Mid joints */}
              <rect x="71" y="189" width="21" height="24" rx="4" fill={COLORS.rattanTie} stroke={COLORS.outline} strokeWidth="1.5" />
              <line x1="73" y1="191" x2="90" y2="211" stroke={COLORS.rattanStitch} strokeWidth="1.5" />

              <rect x="171" y="189" width="20" height="24" rx="4" fill={COLORS.rattanTie} stroke={COLORS.outline} strokeWidth="1.5" />
              <line x1="173" y1="191" x2="189" y2="211" stroke={COLORS.rattanStitch} strokeWidth="1.5" />

              <rect x="271" y="189" width="21" height="24" rx="4" fill={COLORS.rattanTie} stroke={COLORS.outline} strokeWidth="1.5" />
              <line x1="273" y1="191" x2="290" y2="211" stroke={COLORS.rattanStitch} strokeWidth="1.5" />

              {/* Bottom joints */}
              <rect x="71" y="427" width="21" height="36" rx="5" fill={COLORS.rattanTie} stroke={COLORS.outline} strokeWidth="1.5" />
              <rect x="171" y="427" width="20" height="36" rx="5" fill={COLORS.rattanTie} stroke={COLORS.outline} strokeWidth="1.5" />
              <rect x="271" y="427" width="21" height="36" rx="5" fill={COLORS.rattanTie} stroke={COLORS.outline} strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* Floating Call-to-action button badge */}
        <div className="mt-3 flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#381E13] text-[#F4EFE6] text-sm font-bold shadow-lg group-hover:bg-[#C25438] group-hover:scale-105 transition-all duration-200">
          <svg className="w-4 h-4 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
          </svg>
          <span>Klik untuk Memainkan Angklung</span>
        </div>
      </div>
    );
  }

  // INTERACTIVE MODE: Real interactive Angklung
  return (
    <div
      id="angklung-interactive-stage"
      ref={containerRef}
      onPointerDown={onPointerDownHandle}
      onPointerMove={onPointerMoveContainer}
      onPointerUp={onPointerUpContainer}
      onPointerCancel={onPointerUpContainer}
      className="relative select-none touch-none flex flex-col items-center justify-center cursor-grab active:cursor-grabbing"
    >
      {/* Main Physics Root Container - Can move anywhere on screen within boundaries */}
      <div
        className="relative w-[360px] h-[520px] flex justify-center"
        style={{
          transform: `translate(${handleX}px, ${handleY}px)`,
          transition: isDragging ? 'none' : 'transform 0.05s ease-out',
        }}
      >
        {/* Top Suspension Cord attached to the handle */}
        <div className="absolute -top-10 w-1 h-10 bg-[#381E13] rounded-full" />

        {/* TOP SUSPENSION / PIVOT BEAM & HANDLE */}
        <div
          id="angklung-handle-grabber"
          className={`absolute top-0 z-40 w-[180px] h-[44px] -translate-x-1/2 left-1/2 cursor-grab active:cursor-grabbing flex flex-col items-center justify-center rounded-2xl transition-all duration-150 ${
            isDragging
              ? 'scale-105 drop-shadow-[0_10px_20px_rgba(56,30,19,0.3)]'
              : 'hover:scale-[1.02]'
          }`}
          title="Pegang dan goyang pegangan bambu ini"
        >
          {/* Top handle Bamboo Grip Bar */}
          <div className="relative w-[150px] h-[16px] rounded-full bg-[#D99B5B] border-[2.5px] border-[#381E13] flex items-center justify-between px-3">
            <div className="w-1.5 h-full bg-[#381E13]" />
            <div className="flex items-center space-x-1">
              <span className="text-[10px] font-black tracking-wider uppercase text-[#381E13]">
                PEGANG & GOYANG
              </span>
            </div>
            <div className="w-1.5 h-full bg-[#381E13]" />
          </div>

          {/* Grip tactile dots */}
          <div className="flex space-x-1.5 mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#381E13]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#381E13]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#381E13]" />
          </div>

          {/* Rattan suspension loop string */}
          <div className="absolute -top-3 w-8 h-3 rounded-t-full border-t-[2.5px] border-l-[2.5px] border-r-[2.5px] border-[#381E13]" />
        </div>

        {/* PENDULUM SWAYING ANGKLUNG BODY - CARTOONY MINIMALISTIC ART STYLE */}
        <div
          id="angklung-frame-body"
          onClick={onTapInstrument}
          className="relative w-[360px] h-[500px] origin-top pointer-events-auto"
          style={{
            transform: `rotate(${deg}deg)`,
            transition: isDragging ? 'none' : 'transform 0.04s ease-out',
          }}
        >
          <svg
            viewBox="0 0 360 500"
            className="w-full h-full drop-shadow-[0_20px_30px_rgba(56,30,19,0.25)]"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* ======================================================== */}
            {/* OUTER BAMBOO FRAME (KERANGKA)                            */}
            {/* ======================================================== */}

            {/* 1. Left Vertical Frame Pole (Tiang Kiri) */}
            <rect x="75" y="25" width="13" height="425" rx="6.5" fill={COLORS.bambooPole} stroke={COLORS.outline} strokeWidth="2.5" />
            <rect x="72" y="110" width="19" height="5" rx="2.5" fill={COLORS.nodeRing} />
            <rect x="72" y="240" width="19" height="5" rx="2.5" fill={COLORS.nodeRing} />
            <rect x="72" y="370" width="19" height="5" rx="2.5" fill={COLORS.nodeRing} />

            {/* 2. Middle Vertical Frame Pole (Tiang Tengah) */}
            <rect x="175" y="25" width="12" height="425" rx="6" fill={COLORS.bambooPole} stroke={COLORS.outline} strokeWidth="2.5" />
            <rect x="172" y="110" width="18" height="5" rx="2.5" fill={COLORS.nodeRing} />
            <rect x="172" y="240" width="18" height="5" rx="2.5" fill={COLORS.nodeRing} />
            <rect x="172" y="370" width="18" height="5" rx="2.5" fill={COLORS.nodeRing} />

            {/* 3. Right Vertical Frame Pole (Tiang Kanan) */}
            <rect x="275" y="25" width="13" height="425" rx="6.5" fill={COLORS.bambooPole} stroke={COLORS.outline} strokeWidth="2.5" />
            <rect x="272" y="110" width="19" height="5" rx="2.5" fill={COLORS.nodeRing} />
            <rect x="272" y="240" width="19" height="5" rx="2.5" fill={COLORS.nodeRing} />
            <rect x="272" y="370" width="19" height="5" rx="2.5" fill={COLORS.nodeRing} />

            {/* 4. Top Crossbar (Palang Atas) */}
            <rect x="60" y="32" width="240" height="14" rx="7" fill={COLORS.bambooPole} stroke={COLORS.outline} strokeWidth="2.5" />

            {/* 5. Middle Crossbar (Palang Tengah) */}
            <rect x="60" y="195" width="240" height="12" rx="6" fill={COLORS.bambooPole} stroke={COLORS.outline} strokeWidth="2.5" />

            {/* ======================================================== */}
            {/* VIBRATING SOUND TUBES (TABUNG SUARA)                      */}
            {/* ======================================================== */}

            {/* --- TUBE 1: TABUNG ANAK (Small / High Octave) --- */}
            <g
              transform={`translate(${tube1Offset}, 0) rotate(${tube1Angle} 125 195)`}
              className="transition-transform duration-[16ms]"
            >
              {/* Loose suspension cord */}
              <line x1="125" y1="195" x2="125" y2="230" stroke={COLORS.outline} strokeWidth="2.5" />
              <circle cx="125" cy="230" r="3" fill={COLORS.outline} />

              {/* Sliced carved top resonance tongue (Lidah Tabung Anak) */}
              <path
                d="M 112 145 C 112 110, 138 110, 138 145 L 138 230 L 112 230 Z"
                fill={COLORS.bambooCavity}
                stroke={COLORS.outline}
                strokeWidth="2.5"
              />
              {/* Tongue blade face */}
              <path
                d="M 112 170 Q 125 215 138 170 L 138 145 Q 125 118 112 145 Z"
                fill={COLORS.bambooMain}
                stroke={COLORS.outline}
                strokeWidth="2.5"
              />

              {/* Lower Body Cylinder (Awak Tabung Anak) */}
              <rect x="111" y="225" width="28" height="205" rx="8" fill={COLORS.bambooMain} stroke={COLORS.outline} strokeWidth="2.5" />
              {/* Cel-shade stripe */}
              <rect x="113" y="227" width="7" height="201" rx="3.5" fill={COLORS.bambooShadow} />
              {/* Bamboo node lines */}
              <rect x="109" y="320" width="32" height="4" rx="2" fill={COLORS.nodeRing} />
              <rect x="109" y="415" width="32" height="4" rx="2" fill={COLORS.nodeRing} />

              {/* Bottom Foot (Kaki Tabung Anak) inserting into slot */}
              <rect x="120" y="425" width="10" height="38" rx="4" fill={COLORS.bambooPole} stroke={COLORS.outline} strokeWidth="2.5" />

              {/* Small tube octave indicator */}
              <rect x="116" y="340" width="18" height="14" rx="3" fill={COLORS.outline} />
              <text x="125" y="351" fill="#F4EFE6" fontSize="9" fontWeight="bold" textAnchor="middle">
                2×
              </text>
            </g>

            {/* --- TUBE 2: TABUNG INDUK (Large / Fundamental Pitch) --- */}
            <g
              transform={`translate(${tube2Offset}, 0) rotate(${tube2Angle} 225 195)`}
              className="transition-transform duration-[16ms]"
            >
              {/* Loose suspension cord */}
              <line x1="225" y1="195" x2="225" y2="215" stroke={COLORS.outline} strokeWidth="2.5" />
              <circle cx="225" cy="215" r="3.5" fill={COLORS.outline} />

              {/* Sliced carved top resonance tongue (Lidah Tabung Induk) */}
              <path
                d="M 207 90 C 207 50, 243 50, 243 90 L 243 215 L 207 215 Z"
                fill={COLORS.bambooCavity}
                stroke={COLORS.outline}
                strokeWidth="2.5"
              />
              {/* Carved curved front lip */}
              <path
                d="M 207 125 Q 225 185 243 125 L 243 90 Q 225 58 207 90 Z"
                fill={COLORS.bambooMain}
                stroke={COLORS.outline}
                strokeWidth="2.5"
              />

              {/* Lower Body Cylinder (Awak Tabung Induk) */}
              <rect x="206" y="210" width="38" height="225" rx="10" fill={COLORS.bambooMain} stroke={COLORS.outline} strokeWidth="2.5" />
              {/* Cel-shade stripe */}
              <rect x="208" y="212" width="9" height="221" rx="4.5" fill={COLORS.bambooShadow} />
              {/* Bamboo node lines */}
              <rect x="203" y="295" width="44" height="5" rx="2.5" fill={COLORS.nodeRing} />
              <rect x="203" y="390" width="44" height="5" rx="2.5" fill={COLORS.nodeRing} />
              <rect x="203" y="430" width="44" height="5" rx="2.5" fill={COLORS.nodeRing} />

              {/* Bottom Foot (Kaki Tabung Induk) inserting into base slot */}
              <rect x="219" y="432" width="12" height="36" rx="5" fill={COLORS.bambooPole} stroke={COLORS.outline} strokeWidth="2.5" />

              {/* Authentic Bamboo Carved Pitch Tag (Clickable to switch notes) */}
              <g
                transform="translate(225, 335)"
                onClick={(e) => {
                  e.stopPropagation();
                  onNextNote?.();
                }}
                className="cursor-pointer hover:opacity-90"
              >
                <rect
                  x="-20"
                  y="-14"
                  width="40"
                  height="28"
                  rx="6"
                  fill="#FAF6EE"
                  stroke={COLORS.outline}
                  strokeWidth="2"
                />
                <text x="0" y="-1" fill={COLORS.outline} fontSize="11" fontWeight="bold" textAnchor="middle">
                  {note.solfege.split(' ')[0]}
                </text>
                <text x="0" y="10" fill={COLORS.outline} fontSize="8" fontWeight="medium" textAnchor="middle" opacity="0.8">
                  {note.name}
                </text>
              </g>
            </g>

            {/* ======================================================== */}
            {/* BOTTOM HORIZONTAL TROUGH (TABUNG DASAR)                  */}
            {/* ======================================================== */}
            <rect x="45" y="435" width="270" height="32" rx="14" fill={COLORS.bambooShadow} stroke={COLORS.outline} strokeWidth="2.5" />
            <rect x="55" y="437" width="250" height="5" rx="2.5" fill={COLORS.bambooHighlight} opacity="0.6" />

            {/* Cutout Slot 1 (for Tabung Anak foot) */}
            <rect x={125 - slot1Width - 2} y="443" width={slot1Width * 2 + 4} height="16" rx="5" fill={COLORS.bambooCavity} stroke={COLORS.outline} strokeWidth="1.5" />
            {/* Cutout Slot 2 (for Tabung Induk foot) */}
            <rect x={225 - slot2Width - 2} y="443" width={slot2Width * 2 + 4} height="16" rx="5" fill={COLORS.bambooCavity} stroke={COLORS.outline} strokeWidth="1.5" />

            {/* Foot indicators inside slots */}
            <circle cx={125 + tube1Offset} cy="451" r="5" fill={COLORS.bambooPole} stroke={COLORS.outline} strokeWidth="1.5" />
            <circle cx={225 + tube2Offset} cy="451" r="6" fill={COLORS.bambooPole} stroke={COLORS.outline} strokeWidth="1.5" />

            {/* ======================================================== */}
            {/* RATTAN BINDINGS (TALI ROTAN / IKATAN HITAM)              */}
            {/* ======================================================== */}
            {/* Top joints bindings */}
            <rect x="71" y="27" width="21" height="24" rx="4" fill={COLORS.rattanTie} stroke={COLORS.outline} strokeWidth="1.5" />
            <line x1="73" y1="29" x2="90" y2="49" stroke={COLORS.rattanStitch} strokeWidth="1.5" />
            <line x1="90" y1="29" x2="73" y2="49" stroke={COLORS.rattanStitch} strokeWidth="1.5" />

            <rect x="171" y="27" width="20" height="24" rx="4" fill={COLORS.rattanTie} stroke={COLORS.outline} strokeWidth="1.5" />
            <line x1="173" y1="29" x2="189" y2="49" stroke={COLORS.rattanStitch} strokeWidth="1.5" />
            <line x1="189" y1="29" x2="173" y2="49" stroke={COLORS.rattanStitch} strokeWidth="1.5" />

            <rect x="271" y="27" width="21" height="24" rx="4" fill={COLORS.rattanTie} stroke={COLORS.outline} strokeWidth="1.5" />
            <line x1="273" y1="29" x2="290" y2="49" stroke={COLORS.rattanStitch} strokeWidth="1.5" />
            <line x1="290" y1="29" x2="273" y2="49" stroke={COLORS.rattanStitch} strokeWidth="1.5" />

            {/* Mid joints bindings */}
            <rect x="71" y="189" width="21" height="24" rx="4" fill={COLORS.rattanTie} stroke={COLORS.outline} strokeWidth="1.5" />
            <line x1="73" y1="191" x2="90" y2="211" stroke={COLORS.rattanStitch} strokeWidth="1.5" />

            <rect x="171" y="189" width="20" height="24" rx="4" fill={COLORS.rattanTie} stroke={COLORS.outline} strokeWidth="1.5" />
            <line x1="173" y1="191" x2="189" y2="211" stroke={COLORS.rattanStitch} strokeWidth="1.5" />

            <rect x="271" y="189" width="21" height="24" rx="4" fill={COLORS.rattanTie} stroke={COLORS.outline} strokeWidth="1.5" />
            <line x1="273" y1="191" x2="290" y2="211" stroke={COLORS.rattanStitch} strokeWidth="1.5" />

            {/* Bottom joints bindings */}
            <rect x="71" y="432" width="21" height="38" rx="5" fill={COLORS.rattanTie} stroke={COLORS.outline} strokeWidth="1.5" />
            <rect x="171" y="432" width="20" height="38" rx="5" fill={COLORS.rattanTie} stroke={COLORS.outline} strokeWidth="1.5" />
            <rect x="271" y="432" width="21" height="38" rx="5" fill={COLORS.rattanTie} stroke={COLORS.outline} strokeWidth="1.5" />
          </svg>

          {/* Dynamic Collision Impact Ripples */}
          {activeRipple.map((ripple) => (
            <div
              key={ripple.id}
              className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 rounded-full animate-ping opacity-75"
              style={{
                left: `${ripple.x}px`,
                top: `${ripple.y}px`,
                width: '32px',
                height: '32px',
                borderColor: ripple.color,
                borderWidth: '3px',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
