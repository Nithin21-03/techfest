import React, { useState, useEffect } from 'react';
import { X, Download, FileText, CheckCircle, Sparkles, Image as ImageIcon, Calendar } from 'lucide-react';
import { festConfig } from '../config/festConfig';
import { soundFX } from '../utils/audioSynth';

export default function BrochureModal({ onClose, onOpenRegister }) {
  const { branding, events } = festConfig;
  const [activeTab, setActiveTab] = useState('posters'); // 'posters' | 'rulebook'
  const [activePoster, setActivePoster] = useState('theme'); // 'theme' | 'roadmap'

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleDownloadHandbook = () => {
    soundFX.playWarp();
    const handbookContent = `=====================================================
ZYNTRA '26 — THE NEW DIMENSION
Sapthagiri NPS University, Bengaluru
Motto: DREAM | LEARN | BUILD // Explore ✦ Innovate ✦ Create
Official Festival Brochure & Competitions Rulebook
=====================================================

Dates: 27 & 28 NOVEMBER 2026
Venue: Dr. APJ Abdul Kalam Auditorium, Sapthagiri NPS University, Bengaluru - 560057
Host: Sapthagiri NPS University
Website: https://www.sapthagiri.edu.in/
Contact: ${branding.contact.email}

-----------------------------------------------------
ROADMAP ARENAS & COMPETITION TIMELINES
-----------------------------------------------------
DAY 1 (27 Nov 2026):
[1] Inauguration (9:00 AM – 10:00 AM)
[2] Project / Paper Presentation OR Prompt Detection + Pixel Art (3 Rounds) (10:00 AM – 1:00 PM)
[3] Lunch Break (1:00 PM – 2:00 PM)
[4] Crime Scene Forensics OR Debugging Competition (2:00 PM – 4:30 PM)
[5] END DAY 1 (4:30 PM – 5:00 PM)

DAY 2 (28 Nov 2026):
[1] Escape Room (9:00 AM – 12:00 PM)
[2] Lunch Break (12:00 PM – 1:00 PM)
[3] Wikkivace OR Startup Pitch (1:00 PM – 2:00 PM)
[4] Treasure Hunt OR UI Competition (2:00 PM – 4:00 PM)
[5] Prize Distribution & Grand Valedictory (4:00 PM – 5:00 PM)

-----------------------------------------------------
EVENT DETAILS & PRIZES
-----------------------------------------------------
${events
  .map(
    (e, i) => `
[${i + 1}] ${e.name}
    - Category: ${e.category}
    - Department: ${e.department}
    - Prize Pool: ${e.prize}
    - Team Size: ${e.teamSize}
    - Venue: ${e.venue}
    - Schedule: ${e.date} (${e.time_slot || e.start_time})
    - Summary: ${e.summary}
`
  )
  .join('\n')}

-----------------------------------------------------
GENERAL CODE OF CONDUCT:
-----------------------------------------------------
1. Eligibility: All bona fide undergraduate and postgraduate students from recognized colleges and universities.
2. Registration: Digital passes issued upon verification.
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
    link.download = "ZYNTRA_2026_THE_NEW_DIMENSION_BROCHURE.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPoster = (src, filename) => {
    soundFX.playWarp();
    const link = document.createElement('a');
    link.href = src;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        className="fixed top-4 right-4 md:top-8 md:right-8 w-11 h-11 flex items-center justify-center bg-white/5 border border-white/20 text-white hover:bg-cyan-400 hover:text-black transition-all z-[2100] rounded-full group cursor-pointer"
        aria-label="Close Modal"
      >
        <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-[#0a0a0a] border border-cyan-400/30 overflow-hidden shadow-[0_0_80px_rgba(0,242,255,0.25)] rounded-2xl z-10 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-black/50">
          <div className="space-y-1">
            <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest font-black italic">
              // OFFICIAL FESTIVAL MEDIA & DOCUMENTS
            </span>
            <h3 className="text-2xl sm:text-3xl font-impact uppercase text-white tracking-wide">
              ZYNTRA '26 OFFICIAL BROCHURE & POSTERS
            </h3>
          </div>

          {/* Tab Selector */}
          <div className="flex bg-black/80 p-1 rounded-lg border border-white/20">
            <button
              onClick={() => {
                soundFX.playClick();
                setActiveTab('posters');
              }}
              className={`px-4 py-1.5 rounded text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                activeTab === 'posters'
                  ? 'bg-cyan-400 text-black font-black'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Posters
            </button>
            <button
              onClick={() => {
                soundFX.playClick();
                setActiveTab('rulebook');
              }}
              className={`px-4 py-1.5 rounded text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                activeTab === 'rulebook'
                  ? 'bg-cyan-400 text-black font-black'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Rulebook
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 custom-scrollbar flex-grow">
          {activeTab === 'posters' ? (
            <div className="space-y-6">
              {/* Poster Subtabs */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    soundFX.playClick();
                    setActivePoster('theme');
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer border ${
                    activePoster === 'theme'
                      ? 'bg-cyan-400/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,242,255,0.3)]'
                      : 'border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  Theme Poster (The New Dimension)
                </button>
                <button
                  onClick={() => {
                    soundFX.playClick();
                    setActivePoster('roadmap');
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer border ${
                    activePoster === 'roadmap'
                      ? 'bg-cyan-400/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,242,255,0.3)]'
                      : 'border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  Event Roadmap (Two Days One Goal)
                </button>
              </div>

              {/* Active Poster Display */}
              <div className="relative rounded-xl overflow-hidden border border-white/20 bg-black/90 p-2 flex flex-col items-center justify-center max-h-[50vh]">
                {activePoster === 'theme' ? (
                  <img
                    src="/poster-theme.jpg"
                    alt="ZYNTRA '26 Official Theme Poster"
                    className="max-h-[46vh] w-auto object-contain rounded"
                  />
                ) : (
                  <img
                    src="/event-roadmap.jpg"
                    alt="ZYNTRA '26 Official Event Roadmap"
                    className="max-h-[46vh] w-auto object-contain rounded"
                  />
                )}
              </div>

              {/* Poster Download Action */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-white/60">
                  {activePoster === 'theme'
                    ? 'High-Resolution Official Theme Poster (Sapthagiri NPS University)'
                    : 'Official Flowchart Timeline (Learn | Build | Compete)'}
                </span>

                <button
                  onClick={() =>
                    handleDownloadPoster(
                      activePoster === 'theme' ? '/poster-theme.jpg' : '/event-roadmap.jpg',
                      activePoster === 'theme'
                        ? 'ZYNTRA_2026_THEME_POSTER.jpg'
                        : 'ZYNTRA_2026_EVENT_ROADMAP.jpg'
                    )
                  }
                  className="px-5 py-2.5 bg-cyan-400 hover:bg-white text-black font-mono text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 rounded cursor-pointer shadow-[0_0_15px_rgba(0,242,255,0.3)]"
                >
                  <Download size={14} />
                  <span>Download Image</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-xs sm:text-sm font-mono text-white/80 leading-relaxed italic">
                Official rules and competition guidelines for{' '}
                <span className="text-cyan-400 font-bold">ZYNTRA '26 at Sapthagiri NPS University</span>.
                Includes problem statements, evaluation rubrics, team composition guidelines, and cash prize criteria.
              </p>

              <div className="space-y-3 p-5 bg-black/80 border border-white/10 rounded-xl">
                <div className="flex items-center gap-2.5 text-xs font-mono text-white/90">
                  <CheckCircle size={15} className="text-cyan-400 shrink-0" />
                  <span>Full rules for Project & Paper Presentations, Prompt Detection & Pixel Art</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-mono text-white/90">
                  <CheckCircle size={15} className="text-cyan-400 shrink-0" />
                  <span>Crime Scene Forensics, Debugging Competition & Escape Room logistics</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-mono text-white/90">
                  <CheckCircle size={15} className="text-cyan-400 shrink-0" />
                  <span>Wikkivace speedrun regulations & Startup Pitch evaluation rubrics</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-mono text-white/90">
                  <CheckCircle size={15} className="text-cyan-400 shrink-0" />
                  <span>Campus Tech Treasure Hunt & UI Competition briefing</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-mono text-white/90">
                  <CheckCircle size={15} className="text-cyan-400 shrink-0" />
                  <span>₹3,50,000+ Prize pool breakdown & verified certificates of merit</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-6 md:p-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 bg-black/60">
          <button
            onClick={handleDownloadHandbook}
            className="w-full sm:w-auto px-6 py-3 bg-cyan-400 text-black font-mono text-xs font-black uppercase tracking-[0.2em] italic hover:bg-white transition-all shadow-[0_0_20px_rgba(0,242,255,0.3)] flex items-center justify-center gap-2 rounded cursor-pointer"
          >
            <Download size={14} />
            <span>DOWNLOAD COMPLETE RULEBOOK (.TXT)</span>
          </button>

          <button
            onClick={() => {
              soundFX.playWarp();
              onClose();
              onOpenRegister();
            }}
            className="w-full sm:w-auto px-6 py-3 border border-cyan-400/50 bg-cyan-400/10 text-cyan-300 font-mono text-xs font-bold uppercase tracking-[0.2em] italic hover:border-cyan-400 hover:text-white hover:bg-cyan-400/20 transition-all flex items-center justify-center gap-2 rounded cursor-pointer"
          >
            <Sparkles size={14} />
            <span>CLAIM FEST PASS</span>
          </button>
        </div>
      </div>
    </div>
  );
}
