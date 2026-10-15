import React, { useState, useEffect } from 'react';
import { ArrowDown, Download, Sparkles } from 'lucide-react';
import { festConfig } from '../config/festConfig';
import { soundFX } from '../utils/audioSynth';

export default function HeroSection({ onOpenRegister, onOpenBrochure }) {
  const { branding } = festConfig;

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

  const handleScrollToEvents = () => {
    soundFX.playClick();
    const eventsEl = document.getElementById('events');
    if (eventsEl) {
      eventsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-28 md:pt-36 lg:pt-40 pb-16 md:pb-24 overflow-hidden"
      aria-label="Hero section"
    >
      {/* HUD Scanlines overlay */}
      <div className="fixed inset-0 pointer-events-none hud-scanlines z-[40] opacity-10" />

      {/* Left Sci-Fi HUD Coordinates Display (Desktop) */}
      <div className="absolute left-6 lg:left-10 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-10 z-20 pointer-events-none select-none">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">
              SYS COORD
            </span>
            <span className="text-[8px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
              13.065 // 77.502
            </span>
          </div>
          <div className="w-16 h-[1px] bg-white/10" />
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-8 h-8 border border-white/20 rounded-full animate-spin-slow" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_#00f2ff]" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest font-bold">
              SCANNING
            </span>
            <span className="text-[7px] font-mono text-cyan-400/80 uppercase tracking-[0.25em] font-bold">
              NEURAL_LINK_ACTIVE
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1 text-[8px] font-mono text-white/20">
          <span>HOST: SAPTHAGIRI NPS UNIVERSITY</span>
          <span>CAMPUS PROTOCOL: OK</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-16 w-full relative z-20">
        <div className="flex flex-col items-center lg:items-start">
          {/* Status Subtitle Line */}
          <div className="mb-6 md:mb-8 flex items-center gap-4 self-center lg:self-start">
            <div className="w-8 md:w-14 h-[1px] bg-cyan-400/60" />
            <span className="text-[9px] md:text-[11px] font-mono uppercase tracking-[0.3em] sm:tracking-[0.6em] md:tracking-[0.8em] text-white font-black italic whitespace-nowrap">
              {branding.hero.status}
            </span>
          </div>

          {/* Main Title & Hero Banner */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-10 lg:gap-20 w-full">
            {/* Title Block */}
            <div className="flex flex-col items-center lg:items-start flex-shrink-0 w-full lg:w-auto">
              {/* University Sub-Badge Header */}
              <div className="flex items-center justify-center lg:justify-start gap-2.5 mb-3 px-3 py-1 bg-cyan-400/10 border border-cyan-400/30">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.3em] text-cyan-400 font-bold italic">
                  SAPTHAGIRI NPS UNIVERSITY
                </span>
              </div>

              {/* Massive Impact Title: ZYNTRA '26 */}
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[120px] font-impact leading-[0.85] uppercase font-black flex flex-col items-center lg:items-start tracking-wide">
                <span
                  className="text-cyan-400 italic glitch-text"
                  data-text="ZYNTRA"
                >
                  ZYNTRA
                </span>
                <span
                  className="text-cyan-400 italic glitch-text"
                  data-text="'26"
                >
                  '26
                </span>
              </h1>
            </div>

            {/* Right Tagline, Countdown & Actions */}
            <div className="flex flex-col items-center lg:items-start gap-10 md:gap-14 flex-grow max-w-xl">
              {/* Tagline Callout with Cyan Left Border */}
              <div className="space-y-8 w-full">
                <p className="text-base sm:text-lg md:text-xl font-technical tracking-tight text-white leading-relaxed italic border-l-4 border-cyan-400 pl-6 sm:pl-8 font-black text-center lg:text-left bg-black/40 backdrop-blur-md py-3 shadow-[0_0_20px_rgba(0,242,255,0.05)]">
                  {branding.tagline}
                </p>

                {/* Countdown To Ignition */}
                <div className="flex flex-col items-center lg:items-start">
                  <div className="text-[10px] md:text-[11px] font-mono text-white font-black uppercase tracking-[0.5em] mb-4 italic flex items-center gap-3">
                    <span className="w-5 h-[1.5px] bg-cyan-400" />
                    <span>{branding.hero.countdownLabel}</span>
                  </div>

                  <div className="flex gap-4 sm:gap-6 md:gap-10">
                    {[
                      { label: 'DAYS', value: timeLeft.days },
                      { label: 'HOURS', value: timeLeft.hours },
                      { label: 'MINUTES', value: timeLeft.minutes },
                      { label: 'SECONDS', value: timeLeft.seconds },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex flex-col items-center md:items-start group"
                      >
                        <div className="relative">
                          <div className="text-5xl sm:text-6xl md:text-7xl font-impact text-white tracking-tighter leading-none font-black relative z-10">
                            {item.value.toString().padStart(2, '0')}
                          </div>
                          <div className="absolute inset-0 bg-cyan-400/20 blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f2ff]" />
                        </div>
                        <span className="text-[9px] md:text-[10px] font-mono text-white/70 font-black uppercase tracking-[0.4em] mt-3 italic">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 w-full sm:w-auto">
                <button
                  onClick={handleScrollToEvents}
                  className="px-8 py-4 border border-cyan-400/40 bg-cyan-400/10 hover:bg-cyan-400 hover:text-black text-white font-mono text-[10px] font-black uppercase tracking-[0.3em] italic transition-all relative overflow-hidden group shadow-[0_0_20px_rgba(0,242,255,0.15)] flex items-center justify-center gap-2"
                >
                  <span className="absolute top-0 left-0 w-1 h-full bg-cyan-400" />
                  <span className="relative z-10 group-hover:text-black transition-colors">
                    {branding.hero.exploreBtn}
                  </span>
                  <ArrowDown size={14} className="relative z-10 group-hover:translate-y-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => {
                    soundFX.playClick();
                    if (onOpenBrochure) {
                      onOpenBrochure();
                    }
                  }}
                  className="px-8 py-4 border border-white/20 bg-black/60 hover:border-cyan-400 text-white font-mono text-[10px] font-black uppercase tracking-[0.3em] italic transition-all hover:text-cyan-400 backdrop-blur-md flex items-center justify-center gap-2"
                >
                  <Download size={14} />
                  <span>{branding.hero.timelineBtn}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Protocol Info Line with Prominent Big Date */}
          <div className="mt-16 md:mt-24 pt-6 border-t border-white/10 w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/60">
            <div className="flex flex-wrap items-center gap-3 sm:gap-5">
              <span className="text-white/70 font-bold">{branding.hero.location}</span>
              <span className="text-cyan-400/40">//</span>
              <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-md bg-cyan-400/10 border border-cyan-400/50 shadow-[0_0_20px_rgba(0,242,255,0.3)]">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f2ff]" />
                <span className="text-base sm:text-xl font-impact tracking-widest text-cyan-400 uppercase font-black">
                  27 & 28 NOVEMBER 2026
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="tracking-widest uppercase text-white/50 text-[10px]">{branding.hero.protocol}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
