import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Trophy,
  Users,
  Palette,
  Shield,
  Code2,
  Lock,
  Rocket,
  Gem,
  Monitor,
  Utensils,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  Image as ImageIcon,
} from 'lucide-react';
import { festConfig } from '../config/festConfig';
import { soundFX } from '../utils/audioSynth';

export default function ScheduleSection({ onSelectEvent }) {
  const { branding, events } = festConfig;
  const [activeDay, setActiveDay] = useState('ALL');
  const [showPosterModal, setShowPosterModal] = useState(false);

  const getEventById = (id) => events.find((e) => e.id === id);

  const handleEventClick = (eventObj) => {
    if (!eventObj) return;
    soundFX.playCardOpen();
    if (onSelectEvent) {
      onSelectEvent(eventObj);
    }
  };

  return (
    <section
      id="schedule"
      className="spatial-node relative overflow-hidden py-20 md:py-28"
      aria-label="Event Roadmap"
    >
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-radial-gradient from-cyan-950/20 via-black to-black pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 w-full relative z-10">
        {/* =========================================================================
            ROADMAP HEADER (Directly matching Image 2: EVENT ROADMAP)
           ========================================================================= */}
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          {/* Header Pill / Tagline */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] mb-4">
            <Calendar size={14} />
            <span>OFFICIAL TIMELINE PROTOCOL</span>
          </div>

          {/* Main Title: EVENT ROADMAP */}
          <h2 className="text-5xl sm:text-7xl md:text-8xl font-impact tracking-wider uppercase text-white leading-none font-black flex items-center justify-center gap-3">
            <span className="crystal-chrome-text">EVENT ROADMAP</span>
          </h2>

          {/* Tagline: LEARN | BUILD | COMPETE */}
          <div className="flex items-center gap-4 sm:gap-8 mt-3">
            <div className="w-8 sm:w-16 h-[1px] bg-gradient-to-r from-transparent to-cyan-400" />
            <span className="text-xs sm:text-sm font-mono tracking-[0.4em] text-white/90 font-bold uppercase">
              {branding.roadmapMotto || 'LEARN | BUILD | COMPETE'}
            </span>
            <div className="w-8 sm:w-16 h-[1px] bg-gradient-to-l from-transparent to-cyan-400" />
          </div>

          {/* Banner Pill: Two Days Multiple Journeys One Goal! */}
          <div className="mt-5 inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-cyan-400/40 shadow-[0_0_20px_rgba(0,242,255,0.2)]">
            <Sparkles size={14} className="text-cyan-400 animate-pulse" />
            <span className="text-xs sm:text-sm font-technical font-black tracking-widest text-cyan-300 italic uppercase">
              {branding.roadmapSlogan || 'Two Days Multiple Journeys One Goal!'}
            </span>
            <Sparkles size={14} className="text-cyan-400 animate-pulse" />
          </div>

          {/* Controls: Filter Day & View Graphic Poster */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <div className="flex bg-black/80 p-1 rounded-full border border-white/20 backdrop-blur-md">
              {['ALL', 'DAY 1', 'DAY 2'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    soundFX.playClick();
                    setActiveDay(tab);
                  }}
                  className={`px-5 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeDay === tab
                      ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(0,242,255,0.5)] font-black'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                soundFX.playClick();
                setShowPosterModal(true);
              }}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-cyan-400/40 hover:bg-cyan-400/20 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(0,242,255,0.15)]"
            >
              <ImageIcon size={14} />
              <span>OFFICIAL GRAPHIC ROADMAP</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            THE ROADMAP FLOW TRACK (Directly matching Image 2 visual branches)
           ========================================================================= */}
        <div className="space-y-16">
          {/* -----------------------------------------------------------------------
              DAY 1 FLOW
             ----------------------------------------------------------------------- */}
          {(activeDay === 'ALL' || activeDay === 'DAY 1') && (
            <div className="relative p-6 sm:p-10 rounded-2xl bg-black/60 border border-cyan-400/30 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.8)]">
              {/* Day Header Badge */}
              <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-10">
                <div className="flex items-center gap-3">
                  <div className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-impact text-xl sm:text-2xl tracking-widest font-black uppercase shadow-[0_0_20px_rgba(0,242,255,0.4)] flex items-center gap-2">
                    <Calendar size={18} />
                    <span>DAY 1</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-technical font-bold text-white tracking-wider">
                      27 NOVEMBER 2026
                    </span>
                    <span className="text-[9px] font-mono text-cyan-400 tracking-widest uppercase">
                      OPENING, PRESENTATIONS & SECURITY FORENSICS
                    </span>
                  </div>
                </div>

                <span className="hidden sm:inline-block text-[10px] font-mono text-white/50 uppercase tracking-widest">
                  STAGE 01 OF 02
                </span>
              </div>

              {/* Timeline Flow Elements */}
              <div className="flex flex-col items-center gap-6 max-w-4xl mx-auto">
                {/* 1. Inauguration: 9:00 AM – 10:00 AM */}
                <div className="w-full flex flex-col items-center">
                  <div className="px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-[11px] font-mono text-cyan-300 font-bold mb-3 flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,242,255,0.2)]">
                    <Clock size={12} />
                    <span>9:00 AM – 10:00 AM</span>
                  </div>

                  <div
                    onClick={() => handleEventClick(getEventById('inauguration-day1'))}
                    className="roadmap-pill roadmap-pill-blue w-full max-w-md justify-center cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <Users size={18} className="text-white" />
                    </div>
                    <span className="text-base sm:text-lg font-impact tracking-wider uppercase font-black">
                      Inauguration
                    </span>
                    <ChevronRight size={16} className="text-white/60 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Connecting Arrow */}
                <div className="w-[2px] h-6 bg-cyan-400/40 relative">
                  <div className="absolute bottom-0 -left-[3px] w-2 h-2 border-b-2 border-r-2 border-cyan-400 rotate-45" />
                </div>

                {/* 2. Parallel Branch: 10:00 AM – 1:00 PM */}
                <div className="w-full flex flex-col items-center">
                  <div className="px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-[11px] font-mono text-cyan-300 font-bold mb-4 flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,242,255,0.2)]">
                    <Clock size={12} />
                    <span>10:00 AM – 1:00 PM</span>
                  </div>

                  <div className="w-full grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
                    {/* Left: Project / Paper Presentation (Green) */}
                    <div
                      onClick={() => handleEventClick(getEventById('project-paper-presentation'))}
                      className="md:col-span-5 roadmap-pill roadmap-pill-green cursor-pointer group justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                          <Users size={18} className="text-white" />
                        </div>
                        <span className="text-sm sm:text-base font-impact tracking-wider uppercase font-black leading-tight">
                          Project / Paper Presentation
                        </span>
                      </div>
                      <ChevronRight size={16} className="text-white/60 group-hover:translate-x-1 transition-transform shrink-0" />
                    </div>

                    {/* Center: OR Badge with arrows */}
                    <div className="md:col-span-1 flex items-center justify-center gap-2 my-2 md:my-0">
                      <ArrowLeft size={14} className="text-amber-400 hidden md:block" />
                      <div className="roadmap-or-badge">OR</div>
                      <ArrowRight size={14} className="text-amber-400 hidden md:block" />
                    </div>

                    {/* Right: Prompt Detection + Pixel Art (3 Rounds) (Purple) */}
                    <div
                      onClick={() => handleEventClick(getEventById('prompt-detection-pixel-art'))}
                      className="md:col-span-5 roadmap-pill roadmap-pill-purple cursor-pointer group justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                          <Palette size={18} className="text-white" />
                        </div>
                        <span className="text-sm sm:text-base font-impact tracking-wider uppercase font-black leading-tight">
                          Prompt Detection + Pixel Art (3 Rounds)
                        </span>
                      </div>
                      <ChevronRight size={16} className="text-white/60 group-hover:translate-x-1 transition-transform shrink-0" />
                    </div>
                  </div>
                </div>

                {/* Connecting Arrow */}
                <div className="w-[2px] h-6 bg-cyan-400/40 relative">
                  <div className="absolute bottom-0 -left-[3px] w-2 h-2 border-b-2 border-r-2 border-cyan-400 rotate-45" />
                </div>

                {/* 3. Lunch Break: 1:00 PM – 2:00 PM */}
                <div className="w-full flex flex-col items-center">
                  <div className="px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-[11px] font-mono text-cyan-300 font-bold mb-3 flex items-center gap-1.5">
                    <Clock size={12} />
                    <span>1:00 PM – 2:00 PM</span>
                  </div>

                  <div
                    onClick={() => handleEventClick(getEventById('lunch-break-day1'))}
                    className="roadmap-pill roadmap-pill-navy w-full max-w-sm justify-center cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Utensils size={16} className="text-cyan-400" />
                    </div>
                    <span className="text-base sm:text-lg font-impact tracking-wider uppercase font-black text-cyan-300">
                      Lunch Break
                    </span>
                  </div>
                </div>

                {/* Connecting Arrow */}
                <div className="w-[2px] h-6 bg-cyan-400/40 relative">
                  <div className="absolute bottom-0 -left-[3px] w-2 h-2 border-b-2 border-r-2 border-cyan-400 rotate-45" />
                </div>

                {/* 4. Parallel Branch: 2:00 PM – 4:30 PM */}
                <div className="w-full flex flex-col items-center">
                  <div className="px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-[11px] font-mono text-cyan-300 font-bold mb-4 flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,242,255,0.2)]">
                    <Clock size={12} />
                    <span>2:00 PM – 4:30 PM</span>
                  </div>

                  <div className="w-full grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
                    {/* Left: Crime Scene (Orange) */}
                    <div
                      onClick={() => handleEventClick(getEventById('crime-scene'))}
                      className="md:col-span-5 roadmap-pill roadmap-pill-orange cursor-pointer group justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                          <Shield size={18} className="text-white" />
                        </div>
                        <span className="text-sm sm:text-base font-impact tracking-wider uppercase font-black leading-tight">
                          Crime Scene
                        </span>
                      </div>
                      <ChevronRight size={16} className="text-white/60 group-hover:translate-x-1 transition-transform shrink-0" />
                    </div>

                    {/* Center: OR Badge */}
                    <div className="md:col-span-1 flex items-center justify-center gap-2 my-2 md:my-0">
                      <ArrowLeft size={14} className="text-amber-400 hidden md:block" />
                      <div className="roadmap-or-badge">OR</div>
                      <ArrowRight size={14} className="text-amber-400 hidden md:block" />
                    </div>

                    {/* Right: Debugging Competition (Crimson/Magenta) */}
                    <div
                      onClick={() => handleEventClick(getEventById('debugging-competition'))}
                      className="md:col-span-5 roadmap-pill roadmap-pill-crimson cursor-pointer group justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                          <Code2 size={18} className="text-white" />
                        </div>
                        <span className="text-sm sm:text-base font-impact tracking-wider uppercase font-black leading-tight">
                          Debugging Competition
                        </span>
                      </div>
                      <ChevronRight size={16} className="text-white/60 group-hover:translate-x-1 transition-transform shrink-0" />
                    </div>
                  </div>
                </div>

                {/* Connecting Arrow */}
                <div className="w-[2px] h-6 bg-cyan-400/40 relative">
                  <div className="absolute bottom-0 -left-[3px] w-2 h-2 border-b-2 border-r-2 border-cyan-400 rotate-45" />
                </div>

                {/* 5. End of Day 1: 4:30 PM – 5:00 PM */}
                <div className="w-full flex flex-col items-center">
                  <div
                    onClick={() => handleEventClick(getEventById('end-day-1'))}
                    className="roadmap-pill roadmap-pill-navy w-full max-w-sm justify-center cursor-pointer group border-2 border-cyan-400/60 shadow-[0_0_25px_rgba(0,242,255,0.3)]"
                  >
                    <div className="w-8 h-8 rounded-full bg-cyan-400/20 flex items-center justify-center shrink-0">
                      <Trophy size={18} className="text-cyan-400" />
                    </div>
                    <span className="text-base sm:text-xl font-impact tracking-wider uppercase font-black text-cyan-300">
                      END DAY 1
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* -----------------------------------------------------------------------
              DAY 2 FLOW
             ----------------------------------------------------------------------- */}
          {(activeDay === 'ALL' || activeDay === 'DAY 2') && (
            <div className="relative p-6 sm:p-10 rounded-2xl bg-black/60 border border-cyan-400/30 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.8)]">
              {/* Day Header Badge */}
              <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-10">
                <div className="flex items-center gap-3">
                  <div className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-impact text-xl sm:text-2xl tracking-widest font-black uppercase shadow-[0_0_20px_rgba(0,242,255,0.4)] flex items-center gap-2">
                    <Calendar size={18} />
                    <span>DAY 2</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-technical font-bold text-white tracking-wider">
                      28 NOVEMBER 2026
                    </span>
                    <span className="text-[9px] font-mono text-cyan-400 tracking-widest uppercase">
                      ESCAPE ROOM, ADVENTURE & VALEDICTORY
                    </span>
                  </div>
                </div>

                <span className="hidden sm:inline-block text-[10px] font-mono text-white/50 uppercase tracking-widest">
                  STAGE 02 OF 02
                </span>
              </div>

              {/* Timeline Flow Elements */}
              <div className="flex flex-col items-center gap-6 max-w-4xl mx-auto">
                {/* 1. Escape Room: 9:00 AM – 12:00 PM */}
                <div className="w-full flex flex-col items-center">
                  <div className="px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-[11px] font-mono text-cyan-300 font-bold mb-3 flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,242,255,0.2)]">
                    <Clock size={12} />
                    <span>9:00 AM – 12:00 PM</span>
                  </div>

                  <div
                    onClick={() => handleEventClick(getEventById('escape-room'))}
                    className="roadmap-pill roadmap-pill-blue w-full max-w-md justify-center cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <Lock size={18} className="text-white" />
                    </div>
                    <span className="text-base sm:text-lg font-impact tracking-wider uppercase font-black">
                      Escape Room
                    </span>
                    <ChevronRight size={16} className="text-white/60 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Connecting Arrow */}
                <div className="w-[2px] h-6 bg-cyan-400/40 relative">
                  <div className="absolute bottom-0 -left-[3px] w-2 h-2 border-b-2 border-r-2 border-cyan-400 rotate-45" />
                </div>

                {/* 2. Lunch Break: 12:00 PM – 1:00 PM */}
                <div className="w-full flex flex-col items-center">
                  <div className="px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-[11px] font-mono text-cyan-300 font-bold mb-3 flex items-center gap-1.5">
                    <Clock size={12} />
                    <span>12:00 PM – 1:00 PM</span>
                  </div>

                  <div
                    onClick={() => handleEventClick(getEventById('lunch-break-day2'))}
                    className="roadmap-pill roadmap-pill-navy w-full max-w-sm justify-center cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Utensils size={16} className="text-cyan-400" />
                    </div>
                    <span className="text-base sm:text-lg font-impact tracking-wider uppercase font-black text-cyan-300">
                      Lunch Break
                    </span>
                  </div>
                </div>

                {/* Connecting Arrow */}
                <div className="w-[2px] h-6 bg-cyan-400/40 relative">
                  <div className="absolute bottom-0 -left-[3px] w-2 h-2 border-b-2 border-r-2 border-cyan-400 rotate-45" />
                </div>

                {/* 3. Parallel Branch: 1:00 PM – 2:00 PM */}
                <div className="w-full flex flex-col items-center">
                  <div className="px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-[11px] font-mono text-cyan-300 font-bold mb-4 flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,242,255,0.2)]">
                    <Clock size={12} />
                    <span>1:00 PM – 2:00 PM</span>
                  </div>

                  <div className="w-full grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
                    {/* Left: Wikkivace (Green) */}
                    <div
                      onClick={() => handleEventClick(getEventById('wikkivace'))}
                      className="md:col-span-5 roadmap-pill roadmap-pill-green cursor-pointer group justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                          <Trophy size={18} className="text-white" />
                        </div>
                        <span className="text-sm sm:text-base font-impact tracking-wider uppercase font-black leading-tight">
                          Wikkivace
                        </span>
                      </div>
                      <ChevronRight size={16} className="text-white/60 group-hover:translate-x-1 transition-transform shrink-0" />
                    </div>

                    {/* Center: OR Badge */}
                    <div className="md:col-span-1 flex items-center justify-center gap-2 my-2 md:my-0">
                      <ArrowLeft size={14} className="text-amber-400 hidden md:block" />
                      <div className="roadmap-or-badge">OR</div>
                      <ArrowRight size={14} className="text-amber-400 hidden md:block" />
                    </div>

                    {/* Right: Startup Pitch (Purple) */}
                    <div
                      onClick={() => handleEventClick(getEventById('startup-pitch'))}
                      className="md:col-span-5 roadmap-pill roadmap-pill-purple cursor-pointer group justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                          <Rocket size={18} className="text-white" />
                        </div>
                        <span className="text-sm sm:text-base font-impact tracking-wider uppercase font-black leading-tight">
                          Startup Pitch
                        </span>
                      </div>
                      <ChevronRight size={16} className="text-white/60 group-hover:translate-x-1 transition-transform shrink-0" />
                    </div>
                  </div>
                </div>

                {/* Connecting Arrow */}
                <div className="w-[2px] h-6 bg-cyan-400/40 relative">
                  <div className="absolute bottom-0 -left-[3px] w-2 h-2 border-b-2 border-r-2 border-cyan-400 rotate-45" />
                </div>

                {/* 4. Parallel Branch: 2:00 PM – 4:00 PM */}
                <div className="w-full flex flex-col items-center">
                  <div className="px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-[11px] font-mono text-cyan-300 font-bold mb-4 flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,242,255,0.2)]">
                    <Clock size={12} />
                    <span>2:00 PM – 4:00 PM</span>
                  </div>

                  <div className="w-full grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
                    {/* Left: Treasure Hunt (Cyan) */}
                    <div
                      onClick={() => handleEventClick(getEventById('treasure-hunt'))}
                      className="md:col-span-5 roadmap-pill roadmap-pill-cyan cursor-pointer group justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                          <Gem size={18} className="text-white" />
                        </div>
                        <span className="text-sm sm:text-base font-impact tracking-wider uppercase font-black leading-tight">
                          Treasure Hunt
                        </span>
                      </div>
                      <ChevronRight size={16} className="text-white/60 group-hover:translate-x-1 transition-transform shrink-0" />
                    </div>

                    {/* Center: OR Badge */}
                    <div className="md:col-span-1 flex items-center justify-center gap-2 my-2 md:my-0">
                      <ArrowLeft size={14} className="text-amber-400 hidden md:block" />
                      <div className="roadmap-or-badge">OR</div>
                      <ArrowRight size={14} className="text-amber-400 hidden md:block" />
                    </div>

                    {/* Right: UI Competition (Pink) */}
                    <div
                      onClick={() => handleEventClick(getEventById('ui-competition'))}
                      className="md:col-span-5 roadmap-pill roadmap-pill-pink cursor-pointer group justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                          <Monitor size={18} className="text-white" />
                        </div>
                        <span className="text-sm sm:text-base font-impact tracking-wider uppercase font-black leading-tight">
                          UI Competition
                        </span>
                      </div>
                      <ChevronRight size={16} className="text-white/60 group-hover:translate-x-1 transition-transform shrink-0" />
                    </div>
                  </div>
                </div>

                {/* Connecting Arrow */}
                <div className="w-[2px] h-6 bg-cyan-400/40 relative">
                  <div className="absolute bottom-0 -left-[3px] w-2 h-2 border-b-2 border-r-2 border-cyan-400 rotate-45" />
                </div>

                {/* 5. Prize Distribution: 4:00 PM – 5:00 PM */}
                <div className="w-full flex flex-col items-center">
                  <div className="px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-[11px] font-mono text-cyan-300 font-bold mb-3 flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,242,255,0.2)]">
                    <Clock size={12} />
                    <span>4:00 PM – 5:00 PM</span>
                  </div>

                  <div
                    onClick={() => handleEventClick(getEventById('prize-distribution'))}
                    className="roadmap-pill roadmap-pill-navy w-full max-w-md justify-center cursor-pointer group border-2 border-cyan-400 shadow-[0_0_30px_rgba(0,242,255,0.4)]"
                  >
                    <div className="w-8 h-8 rounded-full bg-cyan-400/20 flex items-center justify-center shrink-0">
                      <Trophy size={18} className="text-cyan-400" />
                    </div>
                    <span className="text-base sm:text-lg font-impact tracking-wider uppercase font-black text-cyan-300">
                      Prize Distribution
                    </span>
                    <Sparkles size={16} className="text-cyan-400 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            ROADMAP FOOTER (Directly matching Image 2: Two Days ★ Multiple Journeys ★ One Goal!)
           ========================================================================= */}
        <div className="mt-16 text-center border-t border-white/10 pt-8">
          <p className="text-lg sm:text-2xl md:text-3xl font-impact tracking-[0.2em] text-white uppercase font-black italic flex items-center justify-center gap-3">
            <span>Two Days</span>
            <span className="text-amber-400 text-xl">★</span>
            <span className="text-cyan-400">Multiple Journeys</span>
            <span className="text-amber-400 text-xl">★</span>
            <span>One Goal!</span>
          </p>
          <p className="text-xs font-mono text-white/50 tracking-wider mt-2">
            Click any event card above to review round guidelines, venues, and team entry procedures.
          </p>
        </div>
      </div>

      {/* =========================================================================
          FULL-RESOLUTION GRAPHIC ROADMAP MODAL
         ========================================================================= */}
      {showPosterModal && (
        <div
          className="fixed inset-0 z-[2500] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl"
          onClick={() => setShowPosterModal(false)}
        >
          <div
            className="relative max-w-3xl max-h-[90vh] bg-black border border-cyan-400/50 rounded-xl overflow-hidden shadow-[0_0_60px_rgba(0,242,255,0.3)] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-black/90 border-b border-white/10 flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-400 font-bold tracking-wider">
                OFFICIAL EVENT ROADMAP POSTER
              </span>
              <button
                onClick={() => setShowPosterModal(false)}
                className="text-white hover:text-cyan-400 font-mono text-xs font-bold px-3 py-1 bg-white/10 rounded"
              >
                CLOSE [ESC]
              </button>
            </div>
            <div className="overflow-auto p-2 flex items-center justify-center">
              <img
                src="/event-roadmap.jpg"
                alt="Official Event Roadmap"
                className="max-h-[75vh] w-auto object-contain rounded"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
