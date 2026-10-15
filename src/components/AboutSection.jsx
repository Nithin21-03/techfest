import React from 'react';
import { MapPin, Calendar, Terminal, Award, RotateCw } from 'lucide-react';
import { festConfig } from '../config/festConfig';
import AboutCanvas from './3d/AboutCanvas';

export default function AboutSection() {
  const { branding } = festConfig;
  const { about } = branding;

  const getVitalIcon = (index) => {
    switch (index) {
      case 0:
        return <MapPin size={18} className="text-cyan-400" />;
      case 1:
        return <Calendar size={18} className="text-cyan-400" />;
      case 2:
        return <Terminal size={18} className="text-cyan-400" />;
      case 3:
      default:
        return <Award size={18} className="text-cyan-400" />;
    }
  };

  return (
    <section
      id="about"
      className="spatial-node relative overflow-hidden"
      aria-label="About Techfest"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-16 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading, Overview, & Tags */}
          <div className="lg:col-span-6 space-y-8 md:space-y-12">
            {/* Tag indicator */}
            <div className="flex items-center gap-4 md:gap-8">
              <span className="text-[8px] md:text-xs font-mono uppercase tracking-[0.5em] md:tracking-[0.8em] text-cyan-400 font-black italic bg-black/60 px-3 py-1 border border-cyan-400/20">
                EVENT OVERVIEW
              </span>
              <div className="h-[1px] flex-grow bg-cyan-400/20" />
            </div>

            {/* Massive Heading */}
            <header>
              <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-[95px] font-technical tracking-widest uppercase leading-[0.9] text-white italic font-black">
                THE <br />
                <span className="text-cyan-400 glitch-text">ZYNTRA '26</span>
              </h2>
            </header>

            {/* Editorial Paragraph */}
            <p className="text-base sm:text-lg md:text-xl font-technical font-bold text-white leading-relaxed italic max-w-4xl tracking-tight bg-black/60 p-6 md:p-8 backdrop-blur-md border-l-4 md:border-l-8 border-cyan-400 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
              {about.description}
            </p>

            {/* Tags Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
              {about.tags.map((tag) => (
                <div
                  key={tag}
                  className="flex flex-col gap-2.5 group bg-black/40 p-3.5 border border-white/10 hover:border-cyan-400 transition-all backdrop-blur-sm"
                >
                  <div className="h-[1.5px] w-full bg-white/20 group-hover:bg-cyan-400 transition-colors shadow-[0_0_8px_rgba(0,242,255,0.4)]" />
                  <span className="text-[9px] md:text-[10px] font-mono font-black uppercase tracking-widest italic text-white group-hover:text-cyan-400 transition-colors">
                    {tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: 3D Holographic Network Globe + Vitals Matrix */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            {/* Interactive 3D Holographic Globe Window */}
            <div className="relative h-[290px] sm:h-[320px] w-full border border-cyan-400/30 bg-black/70 backdrop-blur-xl overflow-hidden shadow-[0_0_30px_rgba(0,242,255,0.15)] group">
              {/* Corner HUD markers */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400 z-10" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400 z-10" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400 z-10" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400 z-10" />

              {/* Status Header Badge */}
              <div className="absolute top-3 left-4 z-10 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[8px] font-mono text-cyan-400 uppercase tracking-widest font-black italic">
                  3D REAL-TIME INTER-COLLEGIATE NEURAL MATRIX
                </span>
              </div>

              {/* Drag Prompt */}
              <div className="absolute bottom-3 right-4 z-10 flex items-center gap-1.5 text-white/50 text-[8px] font-mono uppercase tracking-widest">
                <RotateCw size={10} className="text-cyan-400 animate-spin-slow" />
                <span>DRAG TO ROTATE 3D HOLOGRAM</span>
              </div>

              {/* 3D Canvas */}
              <AboutCanvas />
            </div>

            {/* Vitals Telemetry Box */}
            <div className="border border-white/20 bg-black/80 backdrop-blur-xl p-6 relative overflow-hidden shadow-[0_0_30px_rgba(0,242,255,0.08)]">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {about.vitals.map((vital, idx) => (
                  <div
                    key={vital.label}
                    className="p-3.5 border border-white/10 bg-black/50 hover:border-cyan-400/80 transition-all flex flex-col gap-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-mono text-white/50 uppercase tracking-widest font-bold">
                        {vital.label}
                      </span>
                      {getVitalIcon(idx)}
                    </div>
                    <span className="text-lg sm:text-xl font-impact tracking-wide text-white group-hover:text-cyan-400 transition-colors">
                      {vital.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
