import React, { useEffect } from 'react';
import { X, Download, FileText, CheckCircle, Sparkles } from 'lucide-react';
import { festConfig } from '../config/festConfig';
import { soundFX } from '../utils/audioSynth';

export default function BrochureModal({ onClose, onOpenRegister }) {
  const { branding, events } = festConfig;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleDownloadHandbook = () => {
    soundFX.playWarp();
    const handbookContent = `=====================================================
ZYNTRA '26 — NEURAL HORIZONS
Sapthagiri NPS University, Bengaluru
Official Festival Brochure & Competitions Rulebook
=====================================================

Dates: ${branding.hero.dates}
Venue: Sapthagiri NPS University Campus, Hesaraghatta Main Road, Bengaluru - 560057
Host: Sapthagiri NPS University
Website: https://www.sapthagiri.edu.in/
Contact: ${branding.contact.email}

-----------------------------------------------------
ARENAS & PRIZE MATRIX (OVER ₹3,50,000+ TOTAL POOL)
-----------------------------------------------------
${events
  .map(
    (e, i) => `
[${i + 1}] ${e.name}
    - Category: ${e.category}
    - Department: ${e.department}
    - Prize: ${e.prize}
    - Team Size: ${e.teamSize}
    - Venue: ${e.venue}
    - Time: ${e.date} at ${e.start_time}
    - Brief: ${e.summary}
`
  )
  .join('\n')}

-----------------------------------------------------
GENERAL CODE OF CONDUCT:
-----------------------------------------------------
1. Eligibility: All bona fide undergraduate and postgraduate students from recognized colleges and universities.
2. Registration: Completely free. Digital passes issued upon verification.
3. Hardware: Bring personal laptops and necessary hardware chargers. High-speed WiFi and power will be provided.
4. Identification: College ID / USN mandatory at campus entry gate.

=====================================================
© 2026 // ZYNTRA COMMITTEE // SAPTHAGIRI NPS UNIVERSITY
=====================================================
`;

    const blob = new Blob([handbookContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "ZYNTRA_2026_SAPTHAGIRI_NPS_UNIVERSITY_BROCHURE.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-6"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
        onClick={() => {
          soundFX.playCardClose();
          onClose();
        }}
      />

      {/* Floating Close Button */}
      <button
        onClick={() => {
          soundFX.playCardClose();
          onClose();
        }}
        className="fixed top-4 right-4 md:top-8 md:right-8 w-11 h-11 flex items-center justify-center bg-white/5 border border-white/20 text-white hover:bg-cyan-400 hover:text-black transition-all z-[2100] rounded-full group"
        aria-label="Close Modal"
      >
        <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-[#0a0a0a] border border-white/20 overflow-hidden shadow-[0_0_80px_rgba(0,242,255,0.2)] rounded-xl z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-white/10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest font-black italic">
              // OFFICIAL FESTIVAL DOCUMENTS
            </span>
            <h3 className="text-2xl sm:text-3xl font-impact uppercase text-white tracking-wide">
              FESTIVAL BROCHURE & RULEBOOK
            </h3>
          </div>
          <FileText size={32} className="text-cyan-400 shrink-0 opacity-80" />
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 custom-scrollbar">
          <p className="text-xs sm:text-sm font-mono text-white/80 leading-relaxed italic">
            Download the official rulebook and competition guidelines for{' '}
            <span className="text-cyan-400 font-bold">ZYNTRA '26 at Sapthagiri NPS University</span>.
            Includes comprehensive track problem statements, eligibility criteria, judging rubrics, and campus schedules.
          </p>

          <div className="space-y-3 p-4 bg-black/80 border border-white/10">
            <div className="flex items-center gap-2 text-xs font-mono text-white/90">
              <CheckCircle size={14} className="text-cyan-400" />
              <span>Full rules for CodeNova 36H Hackathon, RoboWars & all arenas</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-white/90">
              <CheckCircle size={14} className="text-cyan-400" />
              <span>₹3,50,000+ Prize pool breakdown & disbursement criteria</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-white/90">
              <CheckCircle size={14} className="text-cyan-400" />
              <span>Sapthagiri NPS University campus navigation & entry gate protocols</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-white/90">
              <CheckCircle size={14} className="text-cyan-400" />
              <span>Coordinator contact directory for all academic departments</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 md:p-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-end gap-3 bg-black/40">
          <button
            onClick={handleDownloadHandbook}
            className="w-full sm:w-auto px-6 py-3 bg-cyan-400 text-black font-mono text-[10px] font-black uppercase tracking-[0.2em] italic hover:bg-white transition-all shadow-[0_0_20px_rgba(0,242,255,0.3)] flex items-center justify-center gap-2"
          >
            <Download size={14} />
            <span>DOWNLOAD BROCHURE (.TXT)</span>
          </button>
          <button
            onClick={() => {
              soundFX.playWarp();
              onClose();
              onOpenRegister();
            }}
            className="w-full sm:w-auto px-6 py-3 border border-white/20 text-white font-mono text-[10px] font-bold uppercase tracking-[0.2em] italic hover:border-cyan-400 hover:text-cyan-400 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles size={14} />
            <span>GET FEST PASS</span>
          </button>
        </div>
      </div>
    </div>
  );
}
