import React, { useEffect, useState } from 'react';
import { Activity, ShieldCheck, Zap, Users, Terminal } from 'lucide-react';

export default function TelemetryTicker() {
  const [stats, setStats] = useState({
    totalRegistrations: 382,
    collegesRepresented: 48,
    status: 'ONLINE',
  });

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.totalRegistrations) {
          setStats(data);
        }
      })
      .catch(() => {});
  }, []);

  const tickerItems = [
    { icon: ShieldCheck, text: 'SECURE REGISTRATIONS ENCRYPTED // SSL SHA-256' },
    { icon: Users, text: `DELEGATE PASSES ISSUED: ${stats.totalRegistrations}+` },
    { icon: Zap, text: `INTER-COLLEGIATE NODES: ${stats.collegesRepresented}+ UNIVERSITIES` },
    { icon: Terminal, text: 'ARENA CASH POOL: ₹3,50,000+' },
    { icon: Activity, text: 'GATEWAY STATUS: REAL-TIME CONCURRENCY OPTIMIZED' },
    { icon: ShieldCheck, text: 'DDOS & FLOOD SHIELD: ACTIVE' },
    { icon: Zap, text: 'SAPTHAGIRI NPS UNIVERSITY // 27-28 NOV 2026' },
  ];

  return (
    <div className="relative w-full overflow-hidden bg-black/90 border-y border-cyan-400/30 py-2.5 backdrop-blur-md z-20 select-none shadow-[0_0_20px_rgba(0,242,255,0.1)]">
      {/* Scanline line highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

      <div className="flex items-center gap-10 whitespace-nowrap animate-ticker">
        {[...tickerItems, ...tickerItems].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-2.5 font-mono text-[9px] md:text-[10px] tracking-[0.25em] uppercase font-bold italic">
              <Icon size={12} className="text-cyan-400 animate-pulse" />
              <span className="text-white/80">{item.text}</span>
              <span className="text-cyan-400/40 ml-4 font-normal">//</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
