import React from 'react';
import { GraduationCap, Cpu, Code2, Terminal, Database, Zap, Bot, Cog } from 'lucide-react';
import { festConfig } from '../config/festConfig';

export default function SponsorsSection() {
  const { logos } = festConfig;

  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'GraduationCap':
        return <GraduationCap size={28} className="text-cyan-400" />;
      case 'Cpu':
        return <Cpu size={28} className="text-cyan-400" />;
      case 'Code2':
        return <Code2 size={28} className="text-cyan-400" />;
      case 'Terminal':
        return <Terminal size={28} className="text-cyan-400" />;
      case 'Database':
        return <Database size={28} className="text-cyan-400" />;
      case 'Zap':
        return <Zap size={28} className="text-cyan-400" />;
      case 'Bot':
        return <Bot size={28} className="text-cyan-400" />;
      case 'Cog':
      default:
        return <Cog size={28} className="text-cyan-400" />;
    }
  };

  return (
    <section
      id="logos"
      className="spatial-node relative overflow-hidden"
      aria-label="Organization logos and partners"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-16 w-full relative z-10">
        {/* Section Header */}
        <div className="mb-14 md:mb-20">
          <div className="flex items-center gap-4 md:gap-8 mb-6 md:mb-10">
            <span className="text-[8px] md:text-xs font-mono uppercase tracking-[0.5em] md:tracking-[0.8em] text-cyan-400 font-black italic bg-black/60 px-3 py-1 border border-cyan-400/20">
              OUR PARTNERS
            </span>
            <div className="h-[1px] flex-grow bg-cyan-400/20" />
          </div>

          <h2 className="text-4xl sm:text-6xl md:text-8xl lg:text-[100px] font-technical tracking-widest uppercase leading-[0.9] text-white italic font-black">
            ORGANIZATION <br />
            <span className="text-cyan-400">& DEPARTMENTS.</span>
          </h2>
        </div>

        {/* Partners & Department Logos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 md:gap-8">
          {logos.map((logo, idx) => (
            <div
              key={idx}
              className="p-8 border border-white/15 bg-black/70 backdrop-blur-xl hover:border-cyan-400 transition-all duration-300 flex flex-col items-center text-center justify-between gap-5 group relative shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
            >
              <div className="w-16 h-16 border border-white/10 bg-white/[0.02] flex items-center justify-center group-hover:border-cyan-400 group-hover:bg-cyan-400/10 transition-all">
                {renderIcon(logo.icon)}
              </div>

              <div className="space-y-1">
                <span className="text-[8px] font-mono text-cyan-400/80 uppercase tracking-widest font-black italic">
                  {logo.badge}
                </span>
                <h4 className="text-sm font-mono font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {logo.name}
                </h4>
              </div>

              {/* Hover Corner Brackets */}
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-transparent group-hover:border-cyan-400 transition-all" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-transparent group-hover:border-cyan-400 transition-all" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
