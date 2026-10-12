import React from 'react';
import { NoteInfo } from '../types';
import { AngklungInstrument } from './AngklungInstrument';

interface PresentationLandingProps {
  currentNote: NoteInfo;
  onLaunchInteractive: () => void;
}

// Crisp Vector Batik Motif matching Slide 1, 3, 4, 5
const BatikFloralMotif: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => (
  <svg viewBox="0 0 160 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(80, 80)">
      {/* 4 Large Diagonal Petals (Indigo & Gold Batik Pattern) */}
      {[0, 90, 180, 270].map((rot, i) => (
        <g key={i} transform={`rotate(${rot})`}>
          <path
            d="M 0 -70 C 24 -55, 30 -25, 0 0 C -30 -25, -24 -55, 0 -70 Z"
            fill="#264353"
            stroke="#381E13"
            strokeWidth="2.5"
          />
          {/* Inner golden vein and dot details */}
          <path d="M 0 -62 C 14 -48, 16 -24, 0 0" stroke="#E5AF6E" strokeWidth="2" strokeDasharray="2 3" />
          <circle cx="0" cy="-45" r="3" fill="#E5AF6E" />
          <circle cx="0" cy="-30" r="2.5" fill="#E5AF6E" />
        </g>
      ))}

      {/* 4 Cross Petals (Terracotta Red) */}
      {[45, 135, 225, 315].map((rot, i) => (
        <g key={i} transform={`rotate(${rot})`}>
          <path
            d="M 0 -60 C 20 -45, 22 -20, 0 0 C -22 -20, -20 -45, 0 -60 Z"
            fill="#C25438"
            stroke="#381E13"
            strokeWidth="2.5"
          />
          <path d="M 0 -50 L 0 -10" stroke="#FAF6EE" strokeWidth="2" strokeLinecap="round" />
          <circle cx="0" cy="-35" r="2.5" fill="#FAF6EE" />
        </g>
      ))}

      {/* Flower Core Pistil */}
      <circle cx="0" cy="0" r="16" fill="#E5AF6E" stroke="#381E13" strokeWidth="3" />
      <circle cx="0" cy="0" r="10" fill="#381E13" />
      <circle cx="0" cy="0" r="5" fill="#FAF6EE" />
    </g>
  </svg>
);

// Traditional Mega Mendung Cloud Swirl Motif matching Slide 2 & 6
const MegaMendungCloud: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-32 h-16',
  color = '#C25438',
}) => (
  <svg viewBox="0 0 160 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Outer cloud layer */}
    <path
      d="M 10 65 Q 25 35, 50 45 Q 65 20, 95 30 Q 120 10, 145 35 Q 160 55, 135 70 Q 75 75, 10 65 Z"
      fill={color}
      stroke="#381E13"
      strokeWidth="2.5"
    />
    {/* Second nested layer */}
    <path
      d="M 25 60 Q 38 42, 58 50 Q 72 32, 98 40 Q 118 25, 132 45 Q 120 62, 25 60 Z"
      fill="#E5AF6E"
      stroke="#381E13"
      strokeWidth="2"
    />
    {/* Inner core swirl */}
    <path
      d="M 45 56 Q 58 45, 78 50 Q 92 40, 110 46 Q 102 58, 45 56 Z"
      fill="#FAF6EE"
      stroke="#381E13"
      strokeWidth="1.5"
    />
  </svg>
);

// Traditional Sundanese Player Illustration Character matching Slide 1
const SundaneseCharacterIllustration: React.FC<{ className?: string }> = ({ className = 'w-48 h-64' }) => (
  <svg viewBox="0 0 200 280" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Torso / Baju Adat Sunda (Dark Beskap) */}
    <path
      d="M 45 130 C 50 110, 80 105, 100 105 C 120 105, 150 110, 155 130 L 170 250 C 150 260, 50 260, 30 250 Z"
      fill="#2D1910"
      stroke="#381E13"
      strokeWidth="3"
    />
    {/* Batik Kain Samping Sarong with Greenish/Cream geometric motif */}
    <path
      d="M 35 210 L 165 210 L 175 280 L 25 280 Z"
      fill="#3A5A40"
      stroke="#381E13"
      strokeWidth="3"
    />
    {/* Batik pattern dashes on sarong */}
    {[220, 235, 250, 265].map((y) => (
      <g key={y}>
        <line x1="45" y1={y} x2="155" y2={y} stroke="#E5AF6E" strokeWidth="2" strokeDasharray="4 6" />
      </g>
    ))}

    {/* Neck */}
    <rect x="90" y="80" width="20" height="30" fill="#EBB374" stroke="#381E13" strokeWidth="2.5" rx="5" />
    {/* Beskap Collar */}
    <path d="M 85 105 L 100 120 L 115 105" stroke="#E5AF6E" strokeWidth="3" fill="none" />

    {/* Head / Face */}
    <ellipse cx="100" cy="65" rx="32" ry="36" fill="#EBB374" stroke="#381E13" strokeWidth="3" />
    {/* Cheerful Eyes, Smile, Brows */}
    <path d="M 82 62 Q 88 58, 94 62" stroke="#381E13" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M 106 62 Q 112 58, 118 62" stroke="#381E13" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <circle cx="88" cy="65" r="2.5" fill="#381E13" />
    <circle cx="112" cy="65" r="2.5" fill="#381E13" />
    {/* Eyebrows */}
    <path d="M 80 54 Q 88 50, 94 53" stroke="#381E13" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M 106 53 Q 112 50, 120 54" stroke="#381E13" strokeWidth="2" strokeLinecap="round" fill="none" />
    {/* Smile */}
    <path d="M 90 78 Q 100 90, 110 78" stroke="#381E13" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    {/* Rosy Cheeks */}
    <circle cx="80" cy="74" r="5" fill="#C25438" opacity="0.4" />
    <circle cx="120" cy="74" r="5" fill="#C25438" opacity="0.4" />
    {/* Ears */}
    <circle cx="68" cy="65" r="7" fill="#EBB374" stroke="#381E13" strokeWidth="2" />
    <circle cx="132" cy="65" r="7" fill="#EBB374" stroke="#381E13" strokeWidth="2" />

    {/* Traditional Sundanese Headcloth (Iket Sunda / Totopong) */}
    <path
      d="M 68 55 C 68 25, 132 25, 132 55 C 135 60, 140 50, 142 35 C 130 18, 70 18, 58 35 C 60 50, 65 60, 68 55 Z"
      fill="#3A5A40"
      stroke="#381E13"
      strokeWidth="3"
    />
    <path d="M 66 52 Q 100 38, 134 52" stroke="#E5AF6E" strokeWidth="3" fill="none" />
    {/* Iket Front Crest Knot (Merak Ngibing fold) */}
    <path d="M 92 38 L 100 24 L 108 38 Z" fill="#C25438" stroke="#381E13" strokeWidth="2" />

    {/* Arms holding Angklung */}
    <path
      d="M 45 130 Q 30 170, 75 185"
      stroke="#2D1910"
      strokeWidth="20"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M 155 130 Q 170 170, 125 185"
      stroke="#2D1910"
      strokeWidth="20"
      strokeLinecap="round"
      fill="none"
    />
    {/* Hands holding the frame */}
    <circle cx="75" cy="185" r="10" fill="#EBB374" stroke="#381E13" strokeWidth="2.5" />
    <circle cx="125" cy="185" r="10" fill="#EBB374" stroke="#381E13" strokeWidth="2.5" />
  </svg>
);

export const PresentationLanding: React.FC<PresentationLandingProps> = ({
  currentNote,
  onLaunchInteractive,
}) => {
  return (
    <div className="min-h-screen bg-[#381E13] text-[#381E13] selection:bg-[#C25438] selection:text-[#FAF6EE] flex flex-col items-center">
      {/* TOP PRESENTATION NAVIGATION BAR */}
      <header className="sticky top-0 z-50 w-full bg-[#381E13]/95 backdrop-blur-md border-b border-[#4A2518] px-4 py-3 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="w-3 h-3 rounded-full bg-[#E5AF6E]" />
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-[#FAF6EE]">
              Angklung
            </h1>
            <span className="hidden sm:inline text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#4A2518] text-[#E5AF6E]">
              Warisan Budaya Pasundan
            </span>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-5">
            <nav className="hidden md:flex items-center space-x-4 text-xs font-semibold text-[#FAF6EE]/80">
              <a href="#slide-1" className="hover:text-[#E5AF6E] transition-colors">Pengenalan</a>
              <a href="#slide-2" className="hover:text-[#E5AF6E] transition-colors">Pembuatan</a>
              <a href="#slide-3" className="hover:text-[#E5AF6E] transition-colors">Akar Budaya</a>
              <a href="#slide-4" className="hover:text-[#E5AF6E] transition-colors">Keistimewaan</a>
              <a href="#slide-5" className="hover:text-[#E5AF6E] transition-colors">Pelestarian</a>
              <a href="#slide-6" className="hover:text-[#E5AF6E] transition-colors">Mendunia</a>
            </nav>

            <button
              onClick={onLaunchInteractive}
              className="flex items-center space-x-2 px-4 py-2 rounded-full bg-[#E5AF6E] hover:bg-[#C25438] text-[#381E13] hover:text-[#FAF6EE] text-xs sm:text-sm font-extrabold shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <span>Mainkan Angklung</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN PRESENTATION CONTENT CONTAINER */}
      <main className="w-full max-w-5xl px-3 sm:px-6 py-8 space-y-12 sm:space-y-16">

        {/* ======================================================== */}
        {/* SLIDE 1: COVER / HERO SECTION                            */}
        {/* ======================================================== */}
        <section
          id="slide-1"
          className="relative bg-[#FAF6EE] rounded-3xl p-6 sm:p-12 shadow-2xl overflow-hidden border-[3px] border-[#381E13]"
        >
          {/* Top Right Batik Motif */}
          <div className="absolute -top-4 -right-4 pointer-events-none opacity-90">
            <BatikFloralMotif className="w-36 h-36 sm:w-48 sm:h-48" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left: Traditional Sundanese Character Illustration */}
            <div className="md:col-span-4 flex flex-col items-center justify-center">
              <SundaneseCharacterIllustration className="w-44 sm:w-56 h-auto drop-shadow-lg" />
            </div>

            {/* Right: Title & Subtitle Matching Slide 1 */}
            <div className="md:col-span-8 flex flex-col items-center md:items-start text-center md:text-left space-y-4">

              <h2 className="text-5xl sm:text-7xl font-black text-[#264353] tracking-tight leading-none drop-shadow-sm">
                Angklung
              </h2>

              <div className="inline-block px-5 py-2.5 rounded-full bg-[#381E13] text-[#FAF6EE] text-sm sm:text-lg font-bold shadow-md">
                Warisan Budaya Lokal yang Mendunia
              </div>

              <p className="text-xs sm:text-sm text-[#381E13]/70 max-w-md pt-2">
                Eksplorasi warisan seni tradisional bambu khas Sunda yang sarat makna harmoni, kerjasama, dan keindahan nada.
              </p>
            </div>
          </div>
        </section>


        {/* ======================================================== */}
        {/* SLIDE 2: MENGENAL ANGKLUNG & CARA PEMBUATAN              */}
        {/* ======================================================== */}
        <section
          id="slide-2"
          className="relative bg-[#FAF6EE] rounded-3xl p-6 sm:p-10 shadow-2xl border-[3px] border-[#381E13] overflow-hidden"
        >
          {/* Mega Mendung top-left cloud */}
          <div className="absolute top-2 left-2 pointer-events-none opacity-80">
            <MegaMendungCloud className="w-24 sm:w-32 h-auto" color="#C25438" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">
            {/* Left: Mengenal Angklung */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div>
                <h3 className="text-4xl sm:text-5xl font-black text-[#264353] leading-tight mb-4">
                  Mengenal<br />Angklung
                </h3>
                <p className="text-sm sm:text-base text-[#381E13] leading-relaxed font-medium">
                  Angklung adalah alat musik tradisional dari bambu yang berasal dari Tatar Pasundan yang dibunyikan dengan cara digoyangkan untuk menghasilkan berbagai nada.
                </p>
              </div>

              {/* Bottom decorative motif */}
              <div className="flex justify-start pt-4">
                <BatikFloralMotif className="w-24 h-24" />
              </div>
            </div>

            {/* Right: Cara Pembuatan Angklung (Dark Card matching Slide 2) */}
            <div className="lg:col-span-7 bg-[#381E13] text-[#FAF6EE] rounded-2xl p-6 sm:p-8 space-y-6 shadow-inner">
              <h4 className="text-xl sm:text-2xl font-black text-[#E5AF6E] tracking-tight">
                Cara Pembuatan Angklung:
              </h4>

              <div className="space-y-5">
                {/* Step 1 */}
                <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                  <div className="shrink-0 inline-block px-3.5 py-1.5 rounded-full bg-[#FAF6EE] text-[#381E13] text-xs font-bold self-start">
                    Pemilihan Bambu
                  </div>
                  <p className="text-xs sm:text-sm text-[#FAF6EE]/90 leading-relaxed">
                    Bambu yang digunakan untuk membuat angklung dipilih berdasarkan usia, kualitas, dan kondisi bambu agar menghasilkan suara yang baik dan tahan lama.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                  <div className="shrink-0 inline-block px-3.5 py-1.5 rounded-full bg-[#FAF6EE] text-[#381E13] text-xs font-bold self-start">
                    Pembentukan &amp; Perakitan
                  </div>
                  <p className="text-xs sm:text-sm text-[#FAF6EE]/90 leading-relaxed">
                    Bagian-bagian bambu yang dibentuk adalah tabung suara untuk menghasilkan nada, kerangka tabung untuk menopang tabung bambu dan dasar yang menjadi penyangga utama angklung.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                  <div className="shrink-0 inline-block px-3.5 py-1.5 rounded-full bg-[#FAF6EE] text-[#381E13] text-xs font-bold self-start">
                    Penyeteman
                  </div>
                  <p className="text-xs sm:text-sm text-[#FAF6EE]/90 leading-relaxed">
                    Proses penyeteman angklung dengan meniup bagian bawah tabung bambu dan bandingkan bunyi dengan alat tuner, dan penyesuaian nada dilakukan dengan memotong atau menyerut.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ======================================================== */}
        {/* SLIDE 3: AKAR BUDAYA ANGKLUNG                            */}
        {/* ======================================================== */}
        <section
          id="slide-3"
          className="relative bg-[#FAF6EE] rounded-3xl p-6 sm:p-10 shadow-2xl border-[3px] border-[#381E13] overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Title & History Text */}
            <div className="md:col-span-6 space-y-4">
              <h3 className="text-4xl sm:text-5xl font-black text-[#264353] leading-tight">
                Akar<br />Budaya<br />Angklung
              </h3>

              <p className="text-sm sm:text-base text-[#381E13] leading-relaxed font-medium pt-2">
                Angklung berasal dari Tatar Pasundan memiliki akar yang kuat dalam kehidupan budaya masyarakatnya. Dalam perkembangannya, angklung digunakan dalam berbagai kegiatan masyarakat baik untuk pendidikan, pertunjukan seni, hingga kegiatan kebudayaan.
              </p>

              <p className="text-xs sm:text-sm text-[#381E13]/85 leading-relaxed font-medium">
                Dari sebuah tradisi lokal, angklung kemudian dikenal semakin luas sebagai salah satu identitas budaya Indonesia yang diakui UNESCO sebagai Karya Agung Warisan Budaya Lisan dan Nonbendawi Manusia.
              </p>
            </div>

            {/* Stylized Bamboo Instrument Array Graphic */}
            <div className="md:col-span-6 relative flex flex-col items-center justify-center p-6 bg-[#381E13] rounded-2xl border-2 border-[#4A2518]">
              {/* Batik ornament accent */}
              <div className="absolute top-2 right-2 pointer-events-none">
                <BatikFloralMotif className="w-20 h-20 opacity-90" />
              </div>

              {/* Vector array of multiple diatonic bamboo tubes */}
              <div className="flex items-end justify-center space-x-2.5 sm:space-x-3.5 py-6">
                {[
                  { h: 70, note: '1' },
                  { h: 90, note: '2' },
                  { h: 110, note: '3' },
                  { h: 130, note: '4' },
                  { h: 150, note: '5' },
                  { h: 170, note: '6' },
                  { h: 190, note: '7' },
                  { h: 210, note: "1'" },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div
                      className="w-4 sm:w-5 bg-[#E5AF6E] border-2 border-[#FAF6EE] rounded-t-lg relative"
                      style={{ height: `${item.h}px` }}
                    >
                      <div className="absolute top-2 left-0 right-0 h-1 bg-[#381E13]/40" />
                    </div>
                    <span className="text-[10px] font-bold text-[#E5AF6E] mt-1.5">{item.note}</span>
                  </div>
                ))}
              </div>

              <span className="text-xs font-semibold text-[#FAF6EE]/80 text-center tracking-wide">
                Susunan Nada Angklung Diatonis Padaeng (1 Do s/d 1&apos; Do Tinggi)
              </span>
            </div>
          </div>
        </section>


        {/* ======================================================== */}
        {/* SLIDE 4: KEISTIMEWAAN ANGKLUNG                           */}
        {/* ======================================================== */}
        <section
          id="slide-4"
          className="relative bg-[#FAF6EE] rounded-3xl p-6 sm:p-10 shadow-2xl border-[3px] border-[#381E13] overflow-hidden"
        >
          {/* Header */}
          <div className="mb-6">
            <h3 className="text-4xl sm:text-5xl font-black text-[#264353] leading-tight">
              Keistimewaan Angklung
            </h3>
            <p className="text-sm sm:text-base font-semibold text-[#381E13]/80 mt-1">
              Apa yang Membuat Angklung Istimewa dan Unik?
            </p>
          </div>

          {/* 4 Pillars Card (Dark Chocolate matching Slide 4) */}
          <div className="relative bg-[#381E13] rounded-2xl p-6 sm:p-8 text-[#FAF6EE] shadow-inner">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* 01 */}
              <div className="flex items-start space-x-4">
                <span className="shrink-0 w-10 h-10 rounded-full bg-[#E5AF6E] text-[#381E13] font-black text-base flex items-center justify-center shadow">
                  01
                </span>
                <p className="text-xs sm:text-sm text-[#FAF6EE]/95 leading-relaxed font-medium">
                  Terbuat dari bambu, bahan alami yang dekat dengan kehidupan masyarakat.
                </p>
              </div>

              {/* 03 */}
              <div className="flex items-start space-x-4">
                <span className="shrink-0 w-10 h-10 rounded-full bg-[#E5AF6E] text-[#381E13] font-black text-base flex items-center justify-center shadow">
                  03
                </span>
                <p className="text-xs sm:text-sm text-[#FAF6EE]/95 leading-relaxed font-medium">
                  Pertunjukan angklung membutuhkan keterlibatan banyak pemain dan kerjasama.
                </p>
              </div>

              {/* 02 */}
              <div className="flex items-start space-x-4">
                <span className="shrink-0 w-10 h-10 rounded-full bg-[#E5AF6E] text-[#381E13] font-black text-base flex items-center justify-center shadow">
                  02
                </span>
                <p className="text-xs sm:text-sm text-[#FAF6EE]/95 leading-relaxed font-medium">
                  Satu angklung menghasilkan nada tertentu yang menjadi bagian dari sebuah harmoni.
                </p>
              </div>

              {/* 04 */}
              <div className="flex items-start space-x-4">
                <span className="shrink-0 w-10 h-10 rounded-full bg-[#E5AF6E] text-[#381E13] font-black text-base flex items-center justify-center shadow">
                  04
                </span>
                <p className="text-xs sm:text-sm text-[#FAF6EE]/95 leading-relaxed font-medium">
                  Angklung mengajarkan kebersamaan, karena tidak ada satu pemain yang dapat menciptakan keseluruhan harmoni sendirian.
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* ======================================================== */}
        {/* SLIDE 5: PERLUNYA MELESTARIKAN ANGKLUNG                  */}
        {/* ======================================================== */}
        <section
          id="slide-5"
          className="relative bg-[#FAF6EE] rounded-3xl p-6 sm:p-10 shadow-2xl border-[3px] border-[#381E13] overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-4xl sm:text-5xl font-black text-[#264353] leading-tight">
                Perlunya<br />Melestarikan<br />Angklung
              </h3>

              <p className="text-xs sm:text-sm text-[#381E13] leading-relaxed font-medium pt-2">
                Mengapa perlu melestarikan budaya? Karena budaya adalah identitas. Di tengah dunia yang semakin terhubung, budaya menjadi bagian penting dari identitas sebuah bangsa. Melestarikan angklung berarti menjaga:
              </p>

              <div className="pt-2">
                <BatikFloralMotif className="w-20 h-20" />
              </div>
            </div>

            {/* Right: 4 Pillars Dark Card matching Slide 5 */}
            <div className="lg:col-span-7 bg-[#381E13] text-[#FAF6EE] rounded-2xl p-6 sm:p-8 space-y-5 shadow-inner">
              <div className="space-y-4">
                {/* Sejarah */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4">
                  <span className="shrink-0 inline-block px-4 py-1 rounded-full bg-[#FAF6EE] text-[#381E13] text-xs font-bold self-start">
                    Sejarah
                  </span>
                  <p className="text-xs sm:text-sm text-[#FAF6EE]/90 font-medium">
                    Cerita dan perjalanan budaya yang telah diwariskan.
                  </p>
                </div>

                {/* Keterampilan */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4">
                  <span className="shrink-0 inline-block px-4 py-1 rounded-full bg-[#FAF6EE] text-[#381E13] text-xs font-bold self-start">
                    Keterampilan
                  </span>
                  <p className="text-xs sm:text-sm text-[#FAF6EE]/90 font-medium">
                    Pengetahuan dan kemampuan membuat serta memainkan angklung.
                  </p>
                </div>

                {/* Nilai */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4">
                  <span className="shrink-0 inline-block px-4 py-1 rounded-full bg-[#FAF6EE] text-[#381E13] text-xs font-bold self-start">
                    Nilai
                  </span>
                  <p className="text-xs sm:text-sm text-[#FAF6EE]/90 font-medium">
                    Kebersamaan, kerja sama, dan harmoni.
                  </p>
                </div>

                {/* Identitas */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4">
                  <span className="shrink-0 inline-block px-4 py-1 rounded-full bg-[#FAF6EE] text-[#381E13] text-xs font-bold self-start">
                    Identitas
                  </span>
                  <p className="text-xs sm:text-sm text-[#FAF6EE]/90 font-medium">
                    Salah satu kekayaan budaya yang menjadi bagian dari Indonesia.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ======================================================== */}
        {/* SLIDE 6: ANGKLUNG MENDUNIA                               */}
        {/* ======================================================== */}
        <section
          id="slide-6"
          className="relative bg-[#FAF6EE] rounded-3xl p-6 sm:p-10 shadow-2xl border-[3px] border-[#381E13] overflow-hidden"
        >
          {/* Top-right & bottom-left Mega Mendung cloud motifs matching Slide 6 */}
          <div className="absolute top-2 right-2 pointer-events-none opacity-80">
            <MegaMendungCloud className="w-28 sm:w-36 h-auto" color="#E5AF6E" />
          </div>
          <div className="absolute bottom-2 left-2 pointer-events-none opacity-80">
            <MegaMendungCloud className="w-28 sm:w-36 h-auto" color="#C25438" />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6 py-4">
            <h3 className="text-4xl sm:text-6xl font-black text-[#264353] tracking-tight">
              Angklung Mendunia
            </h3>

            <p className="text-sm sm:text-base text-[#381E13] leading-relaxed font-medium">
              Angklung telah melampaui batas daerah dan generasi. Kini, angklung dikenal sebagai salah satu warisan budaya Indonesia dan diperkenalkan melalui pendidikan, pertunjukan, komunitas, festival, serta pertukaran budaya dunia.
            </p>

            <div className="p-4 sm:p-6 bg-[#381E13] text-[#FAF6EE] rounded-2xl shadow-lg space-y-2">
              <p className="text-sm sm:text-base font-bold text-[#E5AF6E]">
                Mari mengenalkan angklung kepada dunia sebagai warisan budaya Indonesia.
              </p>
              <p className="text-xs sm:text-sm font-semibold tracking-wide text-[#FAF6EE]/90">
                Saatnya dunia mendengar suara musik Indonesia
              </p>
            </div>
          </div>
        </section>


        {/* ======================================================== */}
        {/* BOTTOM SHOWCASE: NON-INTERACTIVE ANGKLUNG PREVIEW        */}
        {/* ======================================================== */}
        <section
          id="preview-showcase"
          className="relative bg-gradient-to-b from-[#2D160D] to-[#1C0E08] rounded-3xl p-6 sm:p-12 shadow-2xl border-[3px] border-[#E5AF6E]/60 text-[#FAF6EE] text-center overflow-hidden flex flex-col items-center"
        >
          {/* Subtle background ornamentation */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full filter blur-3xl pointer-events-none" />

          {/* Section Heading & Invitation */}
          <div className="max-w-xl mx-auto space-y-2 mb-6 relative z-10">
            <span className="inline-block px-3 py-1 rounded-full bg-[#E5AF6E] text-[#381E13] text-xs font-black uppercase tracking-wider">
              Pratinjau / Preview Alat Musik
            </span>
            <h3 className="text-3xl sm:text-4xl font-black text-[#FAF6EE] tracking-tight">
              Eksplorasi Angklung Interaktif
            </h3>
            <p className="text-xs sm:text-sm text-[#FAF6EE]/80 leading-relaxed">
              Di bawah ini adalah pratinjau model angklung bambu. Klik pada model angklung untuk masuk ke simulator interaktif penuh, di mana Anda dapat menggoyangkan, membunyikan, dan memainkan berbagai nada bambu secara leluasa.
            </p>
          </div>

          {/* THE EXACT SAME ANGKLUNG MODEL COMPONENT IN PREVIEW MODE (NON-INTERACTIVE) */}
          <div className="relative z-10 w-full flex flex-col items-center justify-center">
            <AngklungInstrument
              note={currentNote}
              interactive={false}
              onClickPreview={onLaunchInteractive}
            />
          </div>

          {/* Explicit CTA button below preview */}
          <div className="mt-4 relative z-10">
            <button
              onClick={onLaunchInteractive}
              className="inline-flex items-center space-x-3 px-8 py-3.5 rounded-full bg-[#E5AF6E] hover:bg-[#C25438] text-[#381E13] hover:text-[#FAF6EE] text-base font-black shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <span>Buka Simulator Interaktif</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <p className="text-[11px] text-[#FAF6EE]/60 mt-2">
              Dapat digerakkan, digoyang, dan dipelajari dengan suara rekaman bambu asli
            </p>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="w-full bg-[#26130B] border-t border-[#381E13] py-8 text-center text-xs text-[#FAF6EE]/60">
        <p className="font-semibold text-[#FAF6EE]/80">
          Presentasi Angklung &copy; 2026 &bull; Dibuat oleh Filbert, Kevin, dan Michael
        </p>
        <p className="text-[11px] text-[#FAF6EE]/50 mt-1">
          Warisan Budaya Lokal Pasundan yang Mendunia &bull; UNESCO Intangible Cultural Heritage
        </p>
      </footer>
    </div>
  );
};
