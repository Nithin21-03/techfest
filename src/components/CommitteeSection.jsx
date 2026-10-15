import React, { useState } from 'react';
import { Filter, Phone, Mail, Award, Users } from 'lucide-react';
import { festConfig } from '../config/festConfig';
import { soundFX } from '../utils/audioSynth';
import CyberTiltCard from './CyberTiltCard';

export default function CommitteeSection() {
  const { committee } = festConfig;
  const [activeFilter, setActiveFilter] = useState('All');

  const filterTabs = [
    { id: 'All', label: 'ALL' },
    { id: 'FEST Coordinators', label: 'FEST COORDINATORS' },
    { id: 'Core team', label: 'CORE TEAM' },
    { id: 'Dept coordinator', label: 'DEPARTMENTAL' },
  ];

  const filteredMembers = committee.filter((m) => {
    if (activeFilter === 'All') return true;
    return m.team.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <section
      id="committee"
      className="spatial-node relative overflow-hidden"
      aria-label="Organizing committee"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-16 w-full relative z-10">
        {/* Section Header */}
        <div className="flex items-center gap-4 md:gap-8 mb-8 md:mb-12">
          <span className="text-[8px] md:text-xs font-mono uppercase tracking-[0.5em] md:tracking-[0.8em] text-cyan-400 font-black italic bg-black/60 px-3 py-1 border border-cyan-400/20">
            ORGANIZING NODES
          </span>
          <div className="h-[1px] flex-grow bg-cyan-400/20" />
        </div>

        <header className="mb-12 md:mb-16">
          <h2 className="text-4xl sm:text-6xl md:text-8xl lg:text-[100px] font-technical tracking-widest uppercase leading-[0.9] text-white italic font-black">
            TECHFEST <br />
            <span className="text-cyan-400">COMMITTEE.</span>
          </h2>
        </header>

        {/* Filter Pills */}
        <div className="mb-12 md:mb-16 flex flex-wrap gap-2 md:gap-3 items-center bg-black/80 border border-white/20 p-2 md:p-3 max-w-full backdrop-blur-md">
          <div className="px-3 py-2 flex items-center gap-2 border-r border-white/20 mr-2 shrink-0">
            <Filter size={14} className="text-cyan-400" />
            <span className="text-[9px] md:text-xs font-mono text-white uppercase tracking-widest font-bold">
              FILTER
            </span>
          </div>

          {filterTabs.map((tab) => {
            const active = activeFilter.toLowerCase() === tab.id.toLowerCase();
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundFX.playClick();
                  setActiveFilter(tab.id);
                }}
                className={`px-4 md:px-6 py-2.5 font-mono text-[9px] md:text-[11px] tracking-widest uppercase italic transition-all font-bold ${
                  active
                    ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(0,242,255,0.4)]'
                    : 'text-white/70 hover:text-cyan-400 hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Member Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredMembers.map((member) => (
            <CyberTiltCard
              key={member.id}
              className="p-8 border border-white/15 bg-black/70 backdrop-blur-2xl hover:border-cyan-400 transition-all duration-300 group relative flex flex-col justify-between shadow-[0_4px_25px_rgba(0,0,0,0.7)]"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest font-black italic bg-cyan-400/10 px-2.5 py-1 border border-cyan-400/30">
                    {member.role}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-impact uppercase text-white group-hover:text-cyan-400 transition-colors tracking-wide leading-tight">
                    {member.name}
                  </h3>
                  <p className="text-xs font-mono text-white/50 mt-1 italic">
                    {member.department}
                  </p>
                </div>
              </div>

              {/* Contact metadata */}
              <div className="pt-6 mt-6 border-t border-white/10 flex flex-col gap-2 font-mono text-[11px]">
                {member.phone && (
                  <a
                    href={`tel:${member.phone}`}
                    className="text-white/70 hover:text-cyan-400 transition-colors flex items-center gap-2"
                  >
                    <Phone size={12} className="text-cyan-400" />
                    <span>{member.phone}</span>
                  </a>
                )}
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="text-white/50 hover:text-cyan-400 transition-colors flex items-center gap-2 truncate"
                  >
                    <Mail size={12} className="text-cyan-400" />
                    <span className="truncate">{member.email}</span>
                  </a>
                )}
              </div>

              {/* Corner Accents on Hover */}
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-transparent group-hover:border-cyan-400 transition-all" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-transparent group-hover:border-cyan-400 transition-all" />
            </CyberTiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
