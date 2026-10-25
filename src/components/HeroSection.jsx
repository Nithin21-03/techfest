import React, { useState, useEffect } from 'react';
import {
  ArrowDown,
  Download,
  Sparkles,
  Code2,
  Lightbulb,
  FileText,
  Gem,
  Calendar,
  MapPin,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { festConfig } from '../config/festConfig';
import { soundFX } from '../utils/audioSynth';

export default function HeroSection({ onOpenRegister, onOpenBrochure }) {
  const { branding, corePillars } = festConfig;

  // Countdown timer logic
  const calculateTimeRemaining = () => {
    const target = new Date(branding.targetDate).getTime();
    const now = new Date().getTime();
    const diff = target - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeRemaining());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeRemaining());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleScrollToSchedule = () => {
    soundFX.playClick();
    const scheduleEl = document.getElementById('schedule');
    if (scheduleEl) {
      if (window.__lenis) {
        window.__lenis.scrollTo(scheduleEl, { offset: -60, duration: 1.0 });
      } else {
        scheduleEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleScrollToEvents = () => {
    soundFX.playClick();
    const eventsEl = document.getElementById('events');
    if (eventsEl) {
      if (window.__lenis) {
        window.__lenis.scrollTo(eventsEl, { offset: -60, duration: 1.0 });
      } else {
        eventsEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const getPillarIcon = (name) => {
    switch (name) {
      case 'Code2':
        return <Code2 className="w-6 h-6 text-cyan-400" />;
      case 'Lightbulb':
        return <Lightbulb className="w-6 h-6 text-emerald-400" />;
      case 'FileText':
        return <FileText className="w-6 h-6 text-sky-400" />;
      case 'Gem':
      default:
        return <Gem className="w-6 h-6 text-amber-400" />;
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-28 md:pt-36 lg:pt-38 pb-16 md:pb-24 overflow-hidden"
      aria-label="Hero section"
    >
      {/* Subtle edge vignette (Leaves center 100% crystal-clear for the 3D canvas) */}
      <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(2,2,2,0.85)_100%)]" />

      {/* Sci-Fi HUD Coordinates Display (Desktop Left) */}
      <div className="absolute left-6 lg:left-10 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-10 z-20 pointer-events-none select-none">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest font-bold">
              SYS COORD
            </span>
            <span className="text-[8px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
              13.065° N // 77.502° E
            </span>
          </div>
          <div className="w-20 h-[1px] bg-cyan-400/30" />
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-9 h-9 border border-cyan-400/40 rounded-full animate-spin-slow" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_#00f2ff]" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-mono text-white/50 uppercase tracking-widest font-bold">
              PROTOCOL
            </span>
            <span className="text-[8px] font-mono text-cyan-400 uppercase tracking-[0.25em] font-black">
              NEW_DIMENSION_ACTIVE
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1 text-[8px] font-mono text-white/30">
          <span>HOST: SAPTHAGIRI NPS UNIVERSITY</span>
          <span>CAMPUS STATUS: LAUNCH READY</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-16 w-full relative z-20">
        <div className="flex flex-col items-center">
          {/* Top Header Bar from Poster (University Brand + Ultimate Tech Fest Awaits) */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 sm:mb-12 pb-4 border-b border-white/10 backdrop-blur-md bg-black/30 px-4 sm:px-6 py-2.5 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            {/* Left: University Crest & Motto */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-cyan-400/10 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_12px_rgba(0,242,255,0.3)]">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-technical font-black tracking-widest text-white uppercase leading-none">
                  SAPTHAGIRI NPS UNIVERSITY
                </span>
                <span className="text-[8px] sm:text-[9px] font-mono tracking-[0.25em] text-cyan-400 font-bold mt-1">
                  DREAM | LEARN | BUILD
                </span>
              </div>
            </div>

            {/* Right: The Ultimate Tech Fest Awaits */}
            <div className="flex items-center gap-2 px-3 py-1 bg-cyan-400/10 border border-cyan-400/30 rounded">
              <span className="text-cyan-400 text-xs animate-pulse">✦</span>
              <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.25em] text-white font-bold uppercase">
                THE ULTIMATE TECH FEST AWAITS
              </span>
              <span className="text-cyan-400 text-xs animate-pulse">✦</span>
            </div>
          </div>

          {/* Main Title Block: ZYNTRA'26 // THE NEW DIMENSION */}
          <div className="relative text-center my-4 sm:my-8 group flex flex-col items-center">
            {/* Decorative Orbital Ring behind the logo */}
            <div
              className="orbit-ring w-[280px] sm:w-[480px] md:w-[650px] lg:w-[820px] h-[75px] sm:h-[130px] md:h-[180px] lg:h-[220px] -rotate-12 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-70"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(0, 242, 255, 0.08) 0%, transparent 70%)',
              }}
            />

            {/* Huge Crystalline Ice-Blue Chrome Title: ZYNTRA'26 */}
            <div className="relative z-10 flex items-center justify-center">
              <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[145px] font-impact leading-[0.88] uppercase font-black tracking-tight crystal-chrome-text select-none">
                ZYNTRA'26
              </h1>
              {/* Starburst Cross Sparkle */}
              <div className="absolute top-2 right-4 sm:top-6 sm:right-10 pointer-events-none animate-pulse">
                <span className="text-2xl sm:text-4xl text-cyan-300 drop-shadow-[0_0_15px_#00f2ff]">✦</span>
              </div>
            </div>

            {/* Subtitle: THE NEW DIMENSION (Matching Poster) */}
            <div className="mt-2 sm:mt-4 flex items-center justify-center gap-3 sm:gap-6 relative z-10">
              <div className="w-8 sm:w-16 h-[1.5px] bg-gradient-to-r from-transparent to-cyan-400" />
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 text-sm sm:text-lg animate-pulse">✦</span>
                <span className="text-sm sm:text-xl md:text-2xl font-impact tracking-[0.35em] text-white uppercase font-black drop-shadow-[0_0_12px_rgba(0,242,255,0.6)]">
                  THE NEW DIMENSION
                </span>
                <span className="text-cyan-400 text-sm sm:text-lg animate-pulse">✦</span>
              </div>
              <div className="w-8 sm:w-16 h-[1.5px] bg-gradient-to-l from-transparent to-cyan-400" />
            </div>
          </div>

          {/* 4 Core Arenas / HUD Pillars (Directly from Image 1) */}
          <div className="w-full max-w-4xl my-8 sm:my-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {corePillars.map((pillar) => (
                <div
                  key={pillar.id}
                  onClick={() => {
                    soundFX.playCardOpen();
                    if (pillar.id === 'project-presentation') {
                      onOpenRegister();
                    } else {
                      handleScrollToEvents();
                    }
                  }}
                  className="group cursor-pointer p-4 rounded-xl bg-black/60 border border-cyan-400/25 hover:border-cyan-400 transition-all duration-300 flex flex-col items-center text-center backdrop-blur-xl shadow-[0_0_25px_rgba(0,0,0,0.6)] hover:shadow-[0_0_30px_rgba(0,242,255,0.25)] hover:-translate-y-1"
                >
                  {/* Glowing Circular HUD Reticle */}
                  <div className="hud-pillar-circle mb-3 group-hover:scale-110 transition-transform duration-300">
                    {getPillarIcon(pillar.iconName)}
                  </div>

                  {/* Title */}
                  <span className="text-xs sm:text-sm font-impact tracking-wider uppercase text-white group-hover:text-cyan-400 transition-colors">
                    {pillar.title}
                  </span>

                  <span className="text-[9px] font-mono text-white/50 tracking-wider mt-1 line-clamp-1 italic">
                    {pillar.description}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Official Tagline: EXPLORE ✦ INNOVATE ✦ CREATE */}
          <div className="flex items-center justify-center gap-3 sm:gap-6 py-2 px-6 rounded-full bg-cyan-400/10 border border-cyan-400/30 backdrop-blur-md mb-8 sm:mb-12 shadow-[0_0_20px_rgba(0,242,255,0.15)]">
            <span className="text-[10px] sm:text-xs font-mono font-black uppercase tracking-[0.3em] text-white">
              EXPLORE
            </span>
            <span className="text-cyan-400 text-xs">✦</span>
            <span className="text-[10px] sm:text-xs font-mono font-black uppercase tracking-[0.3em] text-cyan-400">
              INNOVATE
            </span>
            <span className="text-cyan-400 text-xs">✦</span>
            <span className="text-[10px] sm:text-xs font-mono font-black uppercase tracking-[0.3em] text-white">
              CREATE
            </span>
          </div>

          {/* Countdown & Action Buttons */}
          <div className="w-full max-w-2xl flex flex-col items-center gap-8 mb-10">
            {/* Countdown Grid */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-white/60 mb-3 font-bold">
                LAUNCH IGNITION COUNTDOWN
              </span>
              <div className="flex items-center gap-4 sm:gap-8">
                {[
                  { label: 'DAYS', value: timeLeft.days },
                  { label: 'HOURS', value: timeLeft.hours },
                  { label: 'MINUTES', value: timeLeft.minutes },
                  { label: 'SECONDS', value: timeLeft.seconds },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center">
                    <div className="text-3xl sm:text-5xl font-impact text-cyan-400 tracking-tight font-black leading-none drop-shadow-[0_0_10px_rgba(0,242,255,0.5)]">
                      {item.value.toString().padStart(2, '0')}
                    </div>
                    <span className="text-[8px] sm:text-[9px] font-mono text-white/50 tracking-widest mt-1">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={handleScrollToSchedule}
                className="px-8 py-4 bg-cyan-400 hover:bg-white text-black font-mono text-xs font-black uppercase tracking-[0.25em] italic transition-all shadow-[0_0_25px_rgba(0,242,255,0.4)] hover:shadow-[0_0_35px_rgba(255,255,255,0.6)] flex items-center gap-2 cursor-pointer rounded-sm"
              >
                <span>{branding.hero.exploreBtn}</span>
                <ArrowDown size={14} />
              </button>

              <button
                onClick={() => {
                  soundFX.playClick();
                  onOpenRegister();
                }}
                className="px-8 py-4 bg-white/10 hover:bg-cyan-400/20 border border-cyan-400/50 text-cyan-400 hover:text-white font-mono text-xs font-black uppercase tracking-[0.25em] italic transition-all backdrop-blur-md flex items-center gap-2 cursor-pointer rounded-sm shadow-[0_0_20px_rgba(0,242,255,0.15)]"
              >
                <Sparkles size={14} />
                <span>REGISTER TEAM</span>
              </button>

              <button
                onClick={() => {
                  soundFX.playClick();
                  onOpenBrochure();
                }}
                className="px-6 py-4 border border-white/20 bg-black/60 hover:border-cyan-400 text-white hover:text-cyan-400 font-mono text-xs font-bold uppercase tracking-[0.2em] italic transition-all backdrop-blur-md flex items-center gap-2 cursor-pointer rounded-sm"
              >
                <Download size={14} />
                <span>BROCHURE</span>
              </button>
            </div>
          </div>

          {/* Bottom Badge: [ 📅 NOVEMBER 2026 ] and [ 📍 SAPTHAGIRI NPS UNIVERSITY ] (Directly from Image 1) */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10 text-xs font-mono">
            {/* Cyber HUD Pill: NOVEMBER 2026 */}
            <div className="flex items-center gap-3 px-6 py-2.5 rounded-full bg-cyan-400/10 border border-cyan-400/40 shadow-[0_0_20px_rgba(0,242,255,0.25)]">
              <Calendar size={15} className="text-cyan-400 animate-pulse" />
              <span className="font-impact text-base sm:text-lg tracking-widest text-cyan-300 uppercase font-black">
                27 & 28 NOVEMBER 2026
              </span>
            </div>

            {/* Location Badge */}
            <div className="flex items-center gap-2 text-white/80 font-mono text-xs tracking-wider">
              <MapPin size={14} className="text-cyan-400" />
              <span>SAPTHAGIRI NPS UNIVERSITY, BENGALURU</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
