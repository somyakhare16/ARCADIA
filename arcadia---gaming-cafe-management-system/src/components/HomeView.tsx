import React from 'react';
import {
  Monitor,
  Gamepad2,
  Award,
  Clock,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  Users,
  CheckCircle2
} from 'lucide-react';
import { useArcadia } from '../context/ArcadiaContext';

interface HomeViewProps {
  onOpenBooking: (pcId?: number) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onOpenBooking }) => {
  const { games, pcs, plans, settings, setActiveView } = useArcadia();

  const availablePcs = pcs.filter(p => p.status === 'Available');

  return (
    <div className="space-y-20 pb-16">
      {/* 1. Hero Section */}
      <section className="relative pt-6 pb-12 sm:pb-16 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>DOWNTOWN FLAGSHIP ESPORTS LOUNGE</span>
          </div>

          <h1 className="font-gaming text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none text-balance">
            THE NEXT EVOLUTION IN <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
              COMPETITIVE GAMING
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-mono leading-relaxed text-balance">
            Experience tournament-grade liquid-cooled battle stations, 360Hz Alienware displays, and dedicated gigabit symmetric fiber in a premium cyberpunk atmosphere built for players.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onOpenBooking()}
              className="w-full sm:w-auto px-8 py-3.5 rounded bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-gaming font-black text-sm uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(0,240,255,0.5)] hover:scale-105 active:scale-95"
            >
              Reserve a Gaming Station
            </button>
            <button
              onClick={() => setActiveView('games')}
              className="w-full sm:w-auto px-7 py-3.5 rounded bg-[#121524] hover:bg-[#1a1f33] text-white border border-slate-700 hover:border-cyan-500/50 font-gaming font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <Gamepad2 className="w-4 h-4 text-cyan-400" />
              <span>Explore Featured Games</span>
            </button>
          </div>
        </div>

        {/* 4-Item Highlights Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-6xl mx-auto">
          <div className="cyber-card p-4 rounded-lg border border-cyan-500/20 text-center">
            <div className="font-gaming text-2xl font-black text-white">8 BATTLE RIGS</div>
            <p className="text-xs text-slate-400 font-mono mt-1">RTX 4090 & RTX 4080 Super</p>
          </div>
          <div className="cyber-card p-4 rounded-lg border border-purple-500/20 text-center">
            <div className="font-gaming text-2xl font-black text-purple-300">360Hz / 240Hz</div>
            <p className="text-xs text-slate-400 font-mono mt-1">Alienware OLED & Fast-IPS</p>
          </div>
          <div className="cyber-card p-4 rounded-lg border border-pink-500/20 text-center">
            <div className="font-gaming text-2xl font-black text-pink-400">&lt; 1ms JITTER</div>
            <p className="text-xs text-slate-400 font-mono mt-1">1Gbps Symmetric Fiber LAN</p>
          </div>
          <div className="cyber-card p-4 rounded-lg border border-emerald-500/20 text-center">
            <div className="font-gaming text-2xl font-black text-emerald-400">OPEN DAILY</div>
            <p className="text-xs text-slate-400 font-mono mt-1">Late Night Weekend Hours</p>
          </div>
        </div>
      </section>

      {/* 2. Featured Games Section (Four Flagship Games) */}
      <section className="space-y-8 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-cyan-400 font-mono uppercase tracking-widest mb-1">
              <Gamepad2 className="w-4 h-4" />
              <span>Curated Game Library</span>
            </div>
            <h2 className="font-gaming text-2xl sm:text-3xl font-black text-white tracking-wide">
              FEATURED ESPORTS & FLAGSHIP TITLES
            </h2>
            <p className="text-sm text-slate-400 font-mono mt-1">
              Pre-installed, patched, and optimized for ultra-high framerates on all Arcadia battle stations.
            </p>
          </div>
          <button
            onClick={() => setActiveView('games')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-gaming uppercase tracking-wider flex items-center gap-1 shrink-0"
          >
            <span>View All Games</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {games.map(game => (
            <div
              key={game.id}
              className="cyber-card rounded-lg border border-slate-800 hover:border-cyan-500/40 p-6 flex flex-col justify-between transition-all group hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]"
            >
              <div>
                {/* Visual Banner Header */}
                <div className={`p-4 rounded-md bg-gradient-to-r ${game.bannerGradient} border border-white/5 mb-4`}>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-2">
                    <span className="font-bold text-white">{game.publisher}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-black/60 border border-white/10 text-slate-300">
                      {game.rating}
                    </span>
                  </div>
                  <h3 className="font-gaming text-xl font-black text-white group-hover:text-cyan-300 transition-colors">
                    {game.title}
                  </h3>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">{game.genre}</p>
                </div>

                <p className="text-xs text-slate-300 font-mono leading-relaxed mb-4">
                  {game.description}
                </p>

                {/* Display & Version Tags */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-4 bg-[#08090e] p-3 rounded border border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-gaming">Display Target</span>
                    <span className="text-cyan-300 font-semibold">{game.displayMode}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-gaming">Optimal Rig Tier</span>
                    <span className="text-purple-300 font-semibold">{game.recommendedTier.replace('_', ' ')}</span>
                  </div>
                </div>

                {/* Features List */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {game.features.map((feat, fIdx) => (
                    <span
                      key={fIdx}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">
                  {game.installedVersion}
                </span>
                <button
                  onClick={() => onOpenBooking()}
                  className="px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-gaming font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(0,240,255,0.3)]"
                >
                  Play on Station
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Gaming Stations & Hardware Fleet Section */}
      <section className="space-y-8 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-cyan-400 font-mono uppercase tracking-widest mb-1">
              <Monitor className="w-4 h-4" />
              <span>Hardware Fleet</span>
            </div>
            <h2 className="font-gaming text-2xl sm:text-3xl font-black text-white tracking-wide">
              TOURNAMENT BATTLE STATIONS
            </h2>
            <p className="text-sm text-slate-400 font-mono mt-1">
              Currently {availablePcs.length} of {pcs.length} stations available for immediate walk-in or booking.
            </p>
          </div>
          <button
            onClick={() => setActiveView('pcs')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-gaming uppercase tracking-wider flex items-center gap-1 shrink-0"
          >
            <span>View All Rigs</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Top 4 Station Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pcs.slice(0, 4).map(pc => {
            const isAvail = pc.status === 'Available';
            return (
              <div
                key={pc.pc_id}
                className="cyber-card p-5 rounded-lg border border-slate-800 hover:border-cyan-500/40 flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-gaming text-base font-bold text-white">{pc.pc_number}</h4>
                      <span className="text-[10px] font-mono text-purple-400">{pc.tier.replace('_', ' ')}</span>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        isAvail
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                      }`}
                    >
                      {pc.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-mono mb-4 leading-relaxed bg-[#08090e] p-2.5 rounded border border-slate-800">
                    {pc.specs}
                  </p>

                  <div className="flex items-center justify-between text-xs font-mono mb-4">
                    <span className="text-slate-400">Rate:</span>
                    <span className="font-gaming text-sm font-bold text-cyan-400">₹{pc.hourly_rate.toFixed(2)}/hr</span>
                  </div>
                </div>

                <button
                  onClick={() => onOpenBooking(pc.pc_id)}
                  className={`w-full py-2 rounded font-gaming font-bold text-xs uppercase tracking-wider transition-all ${
                    isAvail
                      ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                      : 'bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                  disabled={!isAvail}
                >
                  {isAvail ? 'Book Station' : 'Currently In Use'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Membership Plans Section */}
      <section className="space-y-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs text-purple-400 font-mono uppercase tracking-widest">
            <Award className="w-4 h-4" />
            <span>Café Memberships</span>
          </div>
          <h2 className="font-gaming text-2xl sm:text-3xl font-black text-white tracking-wide">
            TIERED PLAYER PASSES & VIP PERKS
          </h2>
          <p className="text-sm text-slate-400 font-mono">
            Save on every hourly session, enjoy complimentary artisan beverages, and access private booths.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, idx) => {
            const isElite = idx === plans.length - 1;
            return (
              <div
                key={plan.plan_id}
                className={`cyber-card p-6 rounded-lg border flex flex-col justify-between relative overflow-hidden ${
                  isElite
                    ? 'border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.25)]'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {isElite && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-500 to-pink-500 text-white font-gaming text-[9px] uppercase font-black px-3 py-1 rounded-bl">
                    Most Popular
                  </div>
                )}

                <div>
                  <h3 className="font-gaming text-lg font-bold text-white mb-2">{plan.plan_name}</h3>
                  <div className="flex items-baseline gap-1 my-3">
                    <span className="font-gaming text-3xl font-black text-white">₹{plan.price.toFixed(2)}</span>
                    <span className="text-xs font-mono text-slate-400">/ {plan.validity_days} days</span>
                  </div>

                  <div className="p-2.5 rounded bg-purple-950/30 border border-purple-500/20 mb-4 font-mono text-xs text-purple-300 flex items-center justify-between">
                    <span>Hourly Rig Discount:</span>
                    <span className="font-bold text-sm text-cyan-300">{plan.discount_percentage}% OFF</span>
                  </div>

                  <div className="space-y-2 text-xs font-mono text-slate-300 mb-6">
                    <p className="text-[10px] text-slate-400 font-gaming uppercase tracking-wider">Included Benefits:</p>
                    <p className="bg-[#08090e] p-3 rounded border border-slate-800 leading-relaxed">
                      {plan.benefits}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveView('memberships')}
                  className={`w-full py-2.5 rounded font-gaming font-bold text-xs uppercase tracking-wider transition-all ${
                    isElite
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                      : 'bg-[#121524] hover:bg-[#1a1f33] text-white border border-slate-700 hover:border-purple-500/50'
                  }`}
                >
                  Join Membership
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Lounge Amenities & Experience */}
      <section className="cyber-card p-8 rounded-lg border border-cyan-500/20 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <h2 className="font-gaming text-2xl font-black text-white tracking-wide">
            CRAFTED FOR PEAK PERFORMANCE
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Every square foot of Arcadia is engineered for latency-free gaming, comfort, and community.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs font-mono">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-2">
              <Zap className="w-4 h-4" />
            </div>
            <h4 className="font-gaming text-white font-bold text-sm">Fiber LAN Backbone</h4>
            <p className="text-slate-400 leading-relaxed">
              Direct peer connections to major US & global game servers with sub-1ms local router hops.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-2">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="font-gaming text-white font-bold text-sm">Secretlab Ergonomics</h4>
            <p className="text-slate-400 leading-relaxed">
              Titan Evo chairs and heavy-duty magnetic desk mats designed for fatigue-free marathon sessions.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-2">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="font-gaming text-white font-bold text-sm">Artisan Refreshments</h4>
            <p className="text-slate-400 leading-relaxed">
              Cold brew on tap, curated energy blends, gourmet toasties, and gamer-friendly snack options.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2">
              <Users className="w-4 h-4" />
            </div>
            <h4 className="font-gaming text-white font-bold text-sm">Squad Booths</h4>
            <p className="text-slate-400 leading-relaxed">
              5v5 private rooms with dedicated sound isolation for team scrims and weekly LAN tournaments.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Operating Hours & Location Summary */}
      <section className="cyber-card p-8 rounded-lg border border-purple-500/20 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs text-purple-400 font-mono uppercase tracking-widest">
            <Clock className="w-4 h-4" />
            <span>Visit Us Today</span>
          </div>
          <h3 className="font-gaming text-xl font-bold text-white tracking-wide">
            OPEN DAILY • WALK-INS ALWAYS WELCOME
          </h3>
          <p className="text-xs text-slate-300 font-mono">
            {settings.opening_hours || 'Mon – Thu: 10:00 AM – Midnight | Fri – Sun: 10:00 AM – 3:00 AM'}
          </p>
          <p className="text-xs text-slate-400 font-mono flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>{settings.address || 'Arcadia Gaming Lounge, Tech & Gaming District'}</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={() => setActiveView('contact')}
            className="px-5 py-2.5 rounded bg-[#121524] hover:bg-[#1a1f33] text-white border border-slate-700 font-gaming text-xs font-bold uppercase tracking-wider text-center"
          >
            Contact & Directions
          </button>
          <button
            onClick={() => onOpenBooking()}
            className="px-6 py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-gaming text-xs font-bold uppercase tracking-wider text-center shadow-[0_0_15px_rgba(0,240,255,0.4)]"
          >
            Book Station Now
          </button>
        </div>
      </section>
    </div>
  );
};
