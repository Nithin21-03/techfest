import React from 'react';
import { Mail, Globe, MapPin, Send, ExternalLink, Sparkles } from 'lucide-react';
import InstagramIcon from './icons/InstagramIcon';
import { festConfig } from '../config/festConfig';
import { soundFX } from '../utils/audioSynth';

export default function VenueContactSection({ onOpenRegister }) {
  const { branding } = festConfig;
  const { contact } = branding;

  return (
    <section
      id="contact"
      className="spatial-node py-24 md:py-36 relative overflow-hidden bg-black/90 border-t border-white/10"
      aria-label="Comm Line Synthesis"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-16 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Coordinates & Direct Comms */}
          <div className="lg:col-span-6 space-y-8 md:space-y-12">
            <div>
              <div className="flex items-center gap-4 md:gap-8 mb-4">
                <span className="text-[8px] md:text-xs font-mono uppercase tracking-[0.5em] md:tracking-[0.8em] text-cyan-400 font-black italic bg-black/60 px-3 py-1 border border-cyan-400/20">
                  COMM LINK // ENLISTMENT
                </span>
                <div className="h-[1px] flex-grow bg-cyan-400/20" />
              </div>

              <h2 className="text-4xl sm:text-6xl md:text-7xl font-impact tracking-wider uppercase leading-[0.95] text-white">
                DIRECT FREQUENCY <br />
                <span className="text-cyan-400 italic">TRANSMISSION</span>
              </h2>
            </div>

            <div className="space-y-6">
              {/* Direct Mail & Official Links */}
              <div className="bg-black/70 p-6 md:p-8 backdrop-blur-md border-l-4 md:border-l-8 border-cyan-400 shadow-[0_0_30px_rgba(0,0,0,0.8)] space-y-4">
                <div>
                  <p className="text-cyan-400 text-[10px] md:text-xs uppercase tracking-[0.4em] mb-2 font-mono font-bold flex items-center gap-2 italic">
                    <Mail size={14} className="text-cyan-400" />
                    Festival Neural Host
                  </p>
                  <div className="flex flex-col gap-1">
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-lg sm:text-2xl font-mono text-white hover:text-cyan-400 transition-all break-all font-black tracking-tight italic"
                    >
                      {contact.email}
                    </a>
                    {contact.alternateEmail && (
                      <a
                        href={`mailto:${contact.alternateEmail}`}
                        className="text-xs sm:text-sm font-mono text-white/60 hover:text-cyan-400 transition-all break-all tracking-wide"
                      >
                        Alt: {contact.alternateEmail}
                      </a>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-4">
                  {/* Official Instagram Page */}
                  <a
                    href={contact.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-cyan-400/10 border border-cyan-400/40 text-cyan-400 hover:bg-cyan-400 hover:text-black font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,242,255,0.2)] group cursor-pointer"
                  >
                    <InstagramIcon size={14} className="group-hover:scale-110 transition-transform" />
                    <span>INSTAGRAM: {contact.instagramHandle}</span>
                    <ExternalLink size={12} />
                  </a>

                  {/* University Portal */}
                  <a
                    href={contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-white/70 hover:text-cyan-400 transition-colors font-bold"
                  >
                    <Globe size={13} className="text-cyan-400" />
                    <span>www.sapthagiri.edu.in</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
              </div>

              {/* Coordinates Block */}
              <div className="bg-black/70 p-6 md:p-8 backdrop-blur-md border-l-4 md:border-l-8 border-cyan-400 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                <p className="text-cyan-400 text-[10px] md:text-xs uppercase tracking-[0.4em] mb-3 font-mono font-bold flex items-center gap-2 italic">
                  <MapPin size={14} className="text-cyan-400" />
                  Geo Coordinates
                </p>
                <p className="text-sm sm:text-base font-mono text-white/80 leading-relaxed italic whitespace-pre-line font-medium">
                  {contact.location}
                </p>
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
                  <a
                    href={contact.directions}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-mono text-cyan-400 hover:text-white uppercase tracking-widest font-black flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>OPEN IN GOOGLE MAPS</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Fast Dispatch Registration Card */}
          <div className="lg:col-span-6 border border-white/20 bg-black/90 backdrop-blur-2xl p-8 md:p-12 relative shadow-[0_0_50px_rgba(0,242,255,0.15)] flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400" />
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                  // IMMEDIATE ENTRY PROTOCOL
                </span>
              </div>

              <h3 className="text-3xl sm:text-4xl font-impact uppercase text-white tracking-wide">
                CLAIM YOUR FESTIVAL ACCESS
              </h3>

              <p className="text-xs sm:text-sm font-mono text-white/70 leading-relaxed italic">
                All collegiate participants receive free verified festival passes, entry into all open
                arenas, workshop certifications, and eligible cash prize brackets.
              </p>

              <div className="p-4 bg-white/[0.02] border border-white/10 font-mono text-xs text-white/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span>REGISTRATION FEE:</span>
                  <span className="text-cyan-400 font-bold">100% FREE</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>ELIGIBILITY:</span>
                  <span className="text-white font-bold">UG / PG STUDENTS</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>DATES:</span>
                  <span className="text-cyan-400 font-bold">27 - 28 NOVEMBER 2026</span>
                </div>
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-white/10">
              <button
                onClick={() => {
                  soundFX.playWarp();
                  onOpenRegister();
                }}
                className="w-full py-4 bg-cyan-400 hover:bg-white text-black font-mono text-xs font-black uppercase tracking-[0.3em] italic transition-all shadow-[0_0_25px_rgba(0,242,255,0.4)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles size={16} />
                <span>INITIALIZE PASS DISPATCH</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
