import React, { useState } from 'react';
import { Gamepad2, X, Plus, Sparkles, Monitor, Star } from 'lucide-react';
import { useArcadia } from '../context/ArcadiaContext';
import { RigTier } from '../types';

interface AddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddGameModal: React.FC<AddGameModalProps> = ({ isOpen, onClose }) => {
  const { addGame } = useArcadia();

  const [title, setTitle] = useState('');
  const [publisher, setPublisher] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');
  const [recommendedTier, setRecommendedTier] = useState<RigTier>('Performance');
  const [displayMode, setDisplayMode] = useState('1440p @ 240Hz Ultra');
  const [installedVersion, setInstalledVersion] = useState('Latest Official Release');
  const [rating, setRating] = useState('Teen');
  const [featuresText, setFeaturesText] = useState('Ultra Low Latency LAN, 240Hz Preset, Cloud Save Sync');
  const [themeColor, setThemeColor] = useState('#00f0ff');

  if (!isOpen) return null;

  const colorThemes = [
    { label: 'Cyan', color: '#00f0ff', gradient: 'from-cyan-500/20 via-blue-500/10 to-slate-900' },
    { label: 'Purple', color: '#a855f7', gradient: 'from-purple-600/20 via-indigo-500/10 to-slate-900' },
    { label: 'Pink', color: '#f43f5e', gradient: 'from-rose-500/20 via-pink-500/10 to-slate-900' },
    { label: 'Amber', color: '#f59e0b', gradient: 'from-amber-500/20 via-orange-500/10 to-slate-900' },
    { label: 'Emerald', color: '#10b981', gradient: 'from-emerald-500/20 via-teal-500/10 to-slate-900' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !publisher.trim()) return;

    const selectedTheme = colorThemes.find(t => t.color === themeColor) || colorThemes[0];
    const featuresList = featuresText
      .split(',')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    addGame({
      title: title.trim(),
      publisher: publisher.trim(),
      genre: genre.trim() || 'Esports Action',
      description: description.trim() || `Optimized for competitive low-latency tournament play at Arcadia Lounge.`,
      recommendedTier,
      displayMode: displayMode.trim() || '1440p @ 240Hz High Refresh',
      installedVersion: installedVersion.trim() || 'Latest Season / Patch',
      rating,
      features: featuresList.length > 0 ? featuresList : ['High Refresh Rate Mode', 'Sub-1ms Fiber Routing'],
      bannerGradient: selectedTheme.gradient,
      accentColor: selectedTheme.color
    });

    onClose();
    // Reset form
    setTitle('');
    setPublisher('');
    setGenre('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="cyber-card w-full max-w-xl p-6 sm:p-7 rounded-xl border border-cyan-400 shadow-[0_0_35px_rgba(0,240,255,0.3)] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Gamepad2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-gaming text-base font-bold text-white tracking-wider">
                ADD NEW GAME TO ARCADIA
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Register a newly installed or pre-configured title in the café library
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 mb-1 font-gaming text-[10px] uppercase">
                Game Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. GTA V, EA FC 24, Dota 2"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-[#08090e] border border-cyan-500/30 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-gaming text-[10px] uppercase">
                Publisher / Studio *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rockstar Games, EA Sports, Valve"
                value={publisher}
                onChange={e => setPublisher(e.target.value)}
                className="w-full bg-[#08090e] border border-cyan-500/30 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 mb-1 font-gaming text-[10px] uppercase">
                Genre
              </label>
              <input
                type="text"
                placeholder="e.g. Tactical Hero Shooter, Racing, MOBA"
                value={genre}
                onChange={e => setGenre(e.target.value)}
                className="w-full bg-[#08090e] border border-slate-700 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-gaming text-[10px] uppercase">
                Recommended Rig Tier
              </label>
              <select
                value={recommendedTier}
                onChange={e => setRecommendedTier(e.target.value as RigTier)}
                className="w-full bg-[#08090e] border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="VIP_Ultra">VIP Ultra (RTX 4090)</option>
                <option value="Performance">Performance (RTX 4080 Super)</option>
                <option value="Standard">Standard (RTX 4070)</option>
                <option value="Streaming">Streaming Booth</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-gaming text-[10px] uppercase">
              Description / Performance Note
            </label>
            <textarea
              rows={2}
              placeholder="Highlight gameplay style, DLSS settings, or refresh rate configuration on our stations..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-[#08090e] border border-slate-700 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 mb-1 font-gaming text-[10px] uppercase">
                Target Display Mode
              </label>
              <input
                type="text"
                placeholder="e.g. 1440p @ 240Hz Fast-IPS"
                value={displayMode}
                onChange={e => setDisplayMode(e.target.value)}
                className="w-full bg-[#08090e] border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-gaming text-[10px] uppercase">
                Installed Build
              </label>
              <input
                type="text"
                placeholder="e.g. Patch 2.4 (All DLCs)"
                value={installedVersion}
                onChange={e => setInstalledVersion(e.target.value)}
                className="w-full bg-[#08090e] border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-gaming text-[10px] uppercase">
                Age Rating
              </label>
              <select
                value={rating}
                onChange={e => setRating(e.target.value)}
                className="w-full bg-[#08090e] border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="Teen">Teen</option>
                <option value="Mature 17+">Mature 17+</option>
                <option value="Everyone">Everyone</option>
                <option value="Everyone 10+">Everyone 10+</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-gaming text-[10px] uppercase">
              Key Features (comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Ray Tracing, 240 FPS Locked, Low Ping LAN, Squad Preset"
              value={featuresText}
              onChange={e => setFeaturesText(e.target.value)}
              className="w-full bg-[#08090e] border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Theme Color Selector */}
          <div>
            <label className="block text-slate-300 mb-1.5 font-gaming text-[10px] uppercase">
              Card Color Accent
            </label>
            <div className="flex items-center gap-3">
              {colorThemes.map(t => (
                <button
                  type="button"
                  key={t.color}
                  onClick={() => setThemeColor(t.color)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded border text-xs transition-all ${
                    themeColor === t.color
                      ? 'border-white bg-white/10 font-bold'
                      : 'border-slate-800 hover:border-slate-600 text-slate-400'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }} />
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-gaming font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(0,240,255,0.4)] flex items-center gap-2"
            >
              <Plus className="w-4 h-4 text-black" />
              <span>Add Game to Library</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
