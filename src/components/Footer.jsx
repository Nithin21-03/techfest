import React from 'react';
import { ExternalLink, Lock } from 'lucide-react';
import InstagramIcon from './icons/InstagramIcon';
import { festConfig } from '../config/festConfig';

export default function Footer({ onNavigateAdmin }) {
  const { branding } = festConfig;

  return (
    <footer
      className="w-full py-12 md:py-16 px-6 md:px-16 border-t border-white/10 bg-black/80 backdrop-blur-3xl relative z-20"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
        {/* Left: Crest and Festival Identifier */}
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-center md:text-left">
          <div className="w-10 h-10 md:w-12 md:h-12 border border-cyan-400/50 bg-black flex items-center justify-center relative overflow-hidden shadow-[0_0_15px_rgba(0,242,255,0.25)] shrink-0">
            <svg viewBox="0 0 100 100" className="w-7 h-7 object-contain">
              <polygon points="50,5 95,28 95,72 50,95 5,72 5,28" fill="#020202" stroke="#00f2ff" strokeWidth="6" />
              <path d="M30,30 L70,30 L30,70 L70,70" fill="none" stroke="#00f2ff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="50" cy="50" r="6" fill="#00f2ff" />
            </svg>
          </div>
          <div className="flex flex-col gap-1 md:gap-2">
            <div className="text-[8px] md:text-[10px] font-mono tracking-[0.25em] md:tracking-[0.4em] text-white/60 uppercase font-black italic">
              {branding.name} // {branding.tagline}
            </div>
            <div className="text-[8px] md:text-[9px] font-mono tracking-[0.1em] md:tracking-[0.2em] text-white/30 uppercase">
              {branding.copyright}
            </div>
          </div>
        </div>

        {/* Right: Instagram Social Link, Admin Portal, Protocol & Status */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8">
          {/* Official Instagram Profile */}
          <a
            href={branding.contact.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-1.5 border border-cyan-400/40 bg-cyan-400/10 hover:bg-cyan-400 hover:text-black text-cyan-400 rounded transition-all shadow-[0_0_15px_rgba(0,242,255,0.2)] group cursor-pointer"
            title="Follow ZYNTRA on Instagram"
          >
            <InstagramIcon size={14} className="group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase">
              {branding.contact.instagramHandle}
            </span>
            <ExternalLink size={10} className="opacity-70" />
          </a>

          {/* Admin Command Center Link */}
          <button
            onClick={() => {
              if (onNavigateAdmin) onNavigateAdmin();
              else {
                window.location.hash = '#admin';
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-mono text-white/40 hover:text-cyan-400 border border-white/10 hover:border-cyan-400/40 bg-white/[0.02] hover:bg-cyan-400/10 rounded transition-all uppercase tracking-widest cursor-pointer"
            title="Organizers & Admin Portal"
          >
            <Lock size={11} />
            <span>Admin</span>
          </button>

          <div className="w-[1px] h-6 md:h-8 bg-white/10 hidden sm:block" />

          <div className="flex flex-col items-end">
            <span className="text-[7px] md:text-[8px] font-mono text-cyan-400/70 uppercase tracking-widest leading-none mb-1">
              Protocol
            </span>
            <span className="text-[9px] md:text-[10px] font-mono text-white/60 uppercase tracking-widest font-bold">
              {branding.protocolVersion}
            </span>
          </div>

          <div className="w-[1px] h-6 md:h-8 bg-white/10 hidden sm:block" />

          <div className="flex flex-col items-end">
            <span className="text-[7px] md:text-[8px] font-mono text-white/30 uppercase tracking-widest leading-none mb-1">
              Status
            </span>
            <span className="text-[9px] md:text-[10px] font-mono text-cyan-400 uppercase tracking-widest animate-pulse font-bold">
              Link Established
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
