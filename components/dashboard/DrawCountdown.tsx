'use client';

// Client-side countdown — runs in the user's browser so the timezone is always
// the user's local time, not the server's (which differs between Vercel UTC and local IST).
import { useState, useEffect } from 'react';

export default function DrawCountdown() {
  const [diffDays, setDiffDays] = useState<number | null>(null);
  const [monthLabel, setMonthLabel] = useState('');

  useEffect(() => {
    const now = new Date();
    // Last day of the current month at 23:59:59 in the user's local timezone
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const diffTime = endOfMonth.getTime() - now.getTime();
    const days = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    setDiffDays(days);
    setMonthLabel(endOfMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
  }, []);

  return (
    <div className="bg-white/[0.01] border border-green-500/20 rounded-[3rem] p-12 shadow-[0_0_50px_rgba(16,185,129,0.03)] flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative group">
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/[0.05] rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none group-hover:bg-green-500/[0.08] transition-all duration-1000" />

      <div className="relative z-10 w-full text-center md:text-left space-y-6">
        <div className="space-y-1">
          <span className="text-[10px] font-black tracking-[0.4em] text-green-500 uppercase">Operational Window</span>
          <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none">
            {monthLabel || <span className="opacity-0">Placeholder</span>}
          </h2>
        </div>
        <p className="text-white/30 font-bold text-lg max-w-md mx-auto md:mx-0">
          Ensure precisely <span className="text-white">5 high-fidelity scores</span> are properly synchronized onto your nodes before the cut-off correctly.
        </p>
      </div>

      <div className="relative z-10 shrink-0 flex flex-col items-center justify-center bg-neutral-950 border border-white/10 rounded-[2.5rem] w-40 h-40 md:w-48 md:h-48 shadow-2xl">
        <span className="text-6xl md:text-7xl font-black text-white tracking-tighter mb-1">
          {diffDays !== null ? diffDays : '—'}
        </span>
        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Days Left</span>
      </div>
    </div>
  );
}
