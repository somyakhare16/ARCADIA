import React from 'react';
import { Gamepad2, ShieldCheck, Zap, Users, Trophy, Coffee, ArrowRight } from 'lucide-react';
import { useArcadia } from '../context/ArcadiaContext';

interface AboutViewProps {
  onOpenBooking?: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onOpenBooking }) => {
  const { setActiveView } = useArcadia();

  return (
    <div className="space-y-12 pb-16 max-w-5xl mx-auto">
      {/* Hero Banner */}
      <div className="cyber-card p-8 rounded-xl border border-cyan-500/30 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
          <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>ESTABLISHED FOR COMPETITIVE PLAYERS</span>
        </div>
        <h1 className="font-gaming text-3xl sm:text-4xl font-black text-white tracking-wide">
          WELCOME TO ARCADIA GAMING CAFÉ
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 font-mono leading-relaxed">
          Arcadia was created to bridge the gap between casual gaming and professional esports environments. We believe that hardware, network latency, ergonomics, and atmosphere directly impact your performance.
        </p>
      </div>

      {/* Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="cyber-card p-6 rounded-lg border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-2">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-gaming text-base font-bold text-white">Zero Compromise Hardware</h3>
          <p className="text-xs text-slate-400 font-mono leading-relaxed">
            Every rig in our lounge is equipped with top-tier Intel i9 or AMD Ryzen 7 7800X3D processors, paired with NVIDIA GeForce RTX 40-Series GPUs and 360Hz Alienware OLED panels.
          </p>
        </div>

        <div className="cyber-card p-6 rounded-lg border border-purple-500/30 space-y-3">
          <div className="w-10 h-10 rounded bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-2">
            <Trophy className="w-5 h-5" />
          </div>
          <h3 className="font-gaming text-base font-bold text-white">Tournaments & Scrims</h3>
          <p className="text-xs text-slate-400 font-mono leading-relaxed">
            We host weekly Friday Night Valorant brackets, weekend Counter-Strike 2 scrims, and community battle royale showdowns with local cash prize pools.
          </p>
        </div>

        <div className="cyber-card p-6 rounded-lg border border-pink-500/30 space-y-3">
          <div className="w-10 h-10 rounded bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-2">
            <Coffee className="w-5 h-5" />
          </div>
          <h3 className="font-gaming text-base font-bold text-white">Artisan Lounge Fuel</h3>
          <p className="text-xs text-slate-400 font-mono leading-relaxed">
            Fuel your marathon gaming sessions with cold brew nitro on tap, imported energy sodas, toasted Paninis, and healthy protein bowls prepared fresh.
          </p>
        </div>
      </div>

      {/* Facility Specifications */}
      <div className="cyber-card p-8 rounded-lg border border-slate-800 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h2 className="font-gaming text-xl font-bold text-white tracking-wider">
            FACILITY SPECIFICATIONS & STANDARDS
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Engineered from ground up to deliver a tournament-standard arena
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="bg-[#08090e] p-4 rounded border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-gaming uppercase font-bold text-[11px]">Symmetric Gigabit WAN</span>
            <p className="text-slate-300">Redundant fiber lines with sub-1ms routing to Chicago, Dallas, and Northern Virginia servers.</p>
          </div>

          <div className="bg-[#08090e] p-4 rounded border border-slate-800 space-y-1">
            <span className="text-purple-400 font-gaming uppercase font-bold text-[11px]">Peripheral Cleanliness Policy</span>
            <p className="text-slate-300">Keyboards, optical mice, and leatherette earcups are sanitized between every customer session.</p>
          </div>

          <div className="bg-[#08090e] p-4 rounded border border-slate-800 space-y-1">
            <span className="text-pink-400 font-gaming uppercase font-bold text-[11px]">Acoustic & Climate Control</span>
            <p className="text-slate-300">Dedicated soundproofing baffles and dual redundant HVAC keeping the floor at a brisk 68°F (20°C).</p>
          </div>

          <div className="bg-[#08090e] p-4 rounded border border-slate-800 space-y-1">
            <span className="text-emerald-400 font-gaming uppercase font-bold text-[11px]">VIP & Streaming Booth</span>
            <p className="text-slate-300">Private broadcast booth equipped with Shure SM7B broadcast mic, Elgato 4K60 Pro, and dual PCs.</p>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-slate-400 font-mono">
            Ready to experience Arcadia in person? Walk in or book online.
          </span>
          <button
            onClick={() => setActiveView('pcs')}
            className="px-6 py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-gaming font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.4)]"
          >
            <span>View Battle Stations</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </div>
      </div>
    </div>
  );
};
