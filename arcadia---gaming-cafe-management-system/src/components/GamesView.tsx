import React, { useState } from 'react';
import { Gamepad2, Monitor, CheckCircle2, Star, Sparkles, ArrowRight, Plus, Cpu, Trash2, X, AlertTriangle } from 'lucide-react';
import { useArcadia } from '../context/ArcadiaContext';
import { AddGameModal } from './AddGameModal';
import { FeaturedGame } from '../types';

interface GamesViewProps {
  onOpenBooking: () => void;
}

export const GamesView: React.FC<GamesViewProps> = ({ onOpenBooking }) => {
  const { games, pcs, setActiveView, deleteGame } = useArcadia();
  const [addGameOpen, setAddGameOpen] = useState(false);
  const [gameToDelete, setGameToDelete] = useState<FeaturedGame | null>(null);

  return (
    <div className="space-y-10 pb-16 max-w-6xl mx-auto">
      {/* Header */}
      <div className="cyber-card p-6 sm:p-7 rounded-lg border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-1">
            <Gamepad2 className="w-4 h-4" />
            <span>Curated Game Library ({games.length} Titles)</span>
          </div>
          <h1 className="font-gaming text-2xl sm:text-3xl font-black text-white tracking-wide">
            PRE-INSTALLED FLAGSHIP GAMES
          </h1>
          <p className="text-sm text-slate-300 font-mono mt-1 max-w-2xl">
            Every battle station at Arcadia comes pre-configured with direct gigabit server routing, patched game files, and ultra-high refresh rate optimization.
          </p>
        </div>

        <button
          onClick={() => setAddGameOpen(true)}
          className="px-5 py-2.5 rounded bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-gaming font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)] flex items-center gap-2 shrink-0 self-stretch sm:self-auto justify-center"
        >
          <Plus className="w-4 h-4 text-black" />
          <span>Add New Game</span>
        </button>
      </div>

      {/* Games Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {games.map(game => {
          const compatibleRigs = pcs.filter(p => p.status === 'Available');

          return (
            <div
              key={game.id}
              className="cyber-card rounded-xl border border-slate-800 hover:border-cyan-500/40 p-6 flex flex-col justify-between transition-all group hover:shadow-[0_0_25px_rgba(0,240,255,0.2)] relative"
            >
              <div>
                {/* Visual Title Header */}
                <div className={`p-5 rounded-lg bg-gradient-to-r ${game.bannerGradient} border border-white/5 mb-5`}>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-2">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      {game.publisher}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] px-2.5 py-0.5 rounded bg-black/70 border border-white/10 text-slate-200">
                        {game.rating}
                      </span>
                      {games.length > 4 && (
                        <button
                          onClick={() => setGameToDelete(game)}
                          className="p-1 rounded bg-black/60 hover:bg-pink-900/60 text-slate-400 hover:text-pink-300 transition-colors"
                          title="Remove Game from Library"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <h2 className="font-gaming text-2xl font-black text-white group-hover:text-cyan-300 transition-colors">
                    {game.title}
                  </h2>
                  <p className="text-xs font-mono text-slate-300 mt-1">{game.genre}</p>
                </div>

                <p className="text-sm text-slate-300 font-mono leading-relaxed mb-6">
                  {game.description}
                </p>

                {/* Technical Performance Specs */}
                <div className="space-y-3 mb-6 bg-[#08090e] p-4 rounded-lg border border-slate-800 text-xs font-mono">
                  <div className="flex justify-between items-center text-slate-300 border-b border-slate-800/80 pb-2">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Monitor className="w-3.5 h-3.5 text-cyan-400" /> Target Display Mode:
                    </span>
                    <span className="font-bold text-cyan-300">{game.displayMode}</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-300 border-b border-slate-800/80 pb-2">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-purple-400" /> Recommended Hardware:
                    </span>
                    <span className="font-bold text-purple-300">{game.recommendedTier.replace('_', ' ')} Stations</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-slate-400">Current Build:</span>
                    <span className="text-slate-200">{game.installedVersion}</span>
                  </div>
                </div>

                {/* Features & Enhancements */}
                <div className="space-y-2 mb-6">
                  <h4 className="font-gaming text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Arcadia Lounge Enhancements:
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    {game.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-slate-300 bg-slate-900/60 p-2 rounded border border-slate-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="text-[11px] truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">
                  {compatibleRigs.length} Rigs Available Now
                </span>
                <button
                  onClick={onOpenBooking}
                  className="px-5 py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-gaming font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(0,240,255,0.4)]"
                >
                  Book Station for This Game
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Suggest a Title Banner */}
      <div className="cyber-card p-6 rounded-lg border border-purple-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-gaming text-base font-bold text-white tracking-wide">
            LOOKING FOR A SPECIFIC STEAM, EPIC, OR RIOT TITLE?
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            You can sign in with your own Steam, Epic Games, or Battle.net accounts on any Arcadia battle station with instant cloud library sync, or add new titles directly to our library.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setAddGameOpen(true)}
            className="px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-gaming text-xs font-bold uppercase tracking-wider"
          >
            + Add Game
          </button>
          <button
            onClick={() => setActiveView('pcs')}
            className="px-4 py-2 rounded bg-purple-900/40 hover:bg-purple-800/40 border border-purple-500/40 text-purple-200 font-gaming text-xs font-bold uppercase tracking-wider"
          >
            Check PC Specs
          </button>
        </div>
      </div>

      {/* Add Game Modal */}
      <AddGameModal
        isOpen={addGameOpen}
        onClose={() => setAddGameOpen(false)}
      />

      {/* Delete Game Confirmation Modal */}
      {gameToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="cyber-card w-full max-w-md p-6 rounded-lg border border-pink-500 shadow-[0_0_30px_rgba(244,63,94,0.35)]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-pink-400" />
                <h3 className="font-gaming text-sm font-bold text-white tracking-wider uppercase">
                  REMOVE GAME TITLE
                </h3>
              </div>
              <button onClick={() => setGameToDelete(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <p className="text-slate-300 leading-relaxed">
                Are you sure you want to remove <span className="text-cyan-400 font-bold">&ldquo;{gameToDelete.title}&rdquo;</span> from the Arcadia library?
              </p>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setGameToDelete(null)}
                  className="px-4 py-2 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 font-mono text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const id = gameToDelete.id;
                    setGameToDelete(null);
                    deleteGame(id);
                  }}
                  className="px-5 py-2 rounded bg-pink-600 hover:bg-pink-500 text-white font-gaming font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(244,63,94,0.4)] flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Confirm Remove</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
