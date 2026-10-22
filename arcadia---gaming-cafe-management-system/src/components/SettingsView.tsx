import React, { useState } from 'react';
import { Settings, Save, RotateCcw, Database, Shield, Server, CheckCircle2 } from 'lucide-react';
import { useArcadia } from '../context/ArcadiaContext';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, resetDatabaseToDefaults } = useArcadia();

  const [cafeName, setCafeName] = useState(settings.cafe_name);
  const [defaultRate, setDefaultRate] = useState(settings.default_hourly_rate.toString());
  const [contactEmail, setContactEmail] = useState(settings.contact_email);
  const [contactPhone, setContactPhone] = useState(settings.contact_phone);
  const [currencySymbol, setCurrencySymbol] = useState(settings.currency_symbol);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      cafe_name: cafeName,
      default_hourly_rate: parseFloat(defaultRate),
      contact_email: contactEmail,
      contact_phone: contactPhone,
      currency_symbol: currencySymbol
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="cyber-card p-5 rounded-lg border border-cyan-500/30 shadow-[0_0_20px_rgba(0,240,255,0.15)]">
        <h2 className="font-gaming text-sm font-bold text-white tracking-wider flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyan-400" />
          LOUNGE CONFIGURATION & SYSTEM SETTINGS
        </h2>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          Global hourly rates, café branding parameters, and operating contact points
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Form */}
        <div className="lg:col-span-2 cyber-card p-6 rounded-lg border border-cyan-500/20">
          <form onSubmit={handleSave} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-slate-400 mb-1 font-gaming text-[10px] uppercase">
                Gaming Cafe Brand Name
              </label>
              <input
                type="text"
                required
                value={cafeName}
                onChange={e => setCafeName(e.target.value)}
                className="w-full bg-[#08090e] border border-cyan-500/30 rounded p-2.5 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1 font-gaming text-[10px] uppercase">
                  Default Base Hourly Rate (₹)
                </label>
                <input
                  type="number"
                  step="1"
                  required
                  value={defaultRate}
                  onChange={e => setDefaultRate(e.target.value)}
                  className="w-full bg-[#08090e] border border-cyan-500/30 rounded p-2.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-gaming text-[10px] uppercase">
                  Currency Symbol
                </label>
                <input
                  type="text"
                  required
                  value={currencySymbol}
                  onChange={e => setCurrencySymbol(e.target.value)}
                  className="w-full bg-[#08090e] border border-cyan-500/30 rounded p-2.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1 font-gaming text-[10px] uppercase">
                  Operations Contact Email
                </label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  className="w-full bg-[#08090e] border border-cyan-500/30 rounded p-2.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-gaming text-[10px] uppercase">
                  Support Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={contactPhone}
                  onChange={e => setContactPhone(e.target.value)}
                  className="w-full bg-[#08090e] border border-cyan-500/30 rounded p-2.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-gaming font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_12px_rgba(0,240,255,0.4)]"
              >
                <Save className="w-4 h-4 text-black" />
                <span>Save Cafe Settings</span>
              </button>
            </div>
          </form>
        </div>

        {/* System Status & Reset */}
        <div className="space-y-4">
          <div className="cyber-card p-5 rounded-lg border border-purple-500/20 text-xs font-mono">
            <h3 className="font-gaming text-xs font-bold text-white tracking-wider uppercase mb-3 flex items-center gap-2">
              <Server className="w-4 h-4 text-purple-400" />
              SYSTEM INFRASTRUCTURE STATUS
            </h3>
            <div className="space-y-2 text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Database Engine:</span>
                <span className="text-emerald-400 font-bold">MySQL 8.0</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Storage Engine:</span>
                <span className="text-cyan-400 font-bold">InnoDB</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Database Schema:</span>
                <span className="text-white">arcadia_db</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Security & Isolation:</span>
                <span className="text-emerald-400">ACID Compliant</span>
              </div>
            </div>
          </div>

          <div className="cyber-card p-5 rounded-lg border border-pink-500/30">
            <h3 className="font-gaming text-xs font-bold text-white tracking-wider uppercase mb-2 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-pink-400" />
              RELOAD DEFAULT BASELINE
            </h3>
            <p className="text-xs text-slate-400 font-mono mb-4 leading-relaxed">
              Resets all customer profiles, gaming stations, active sessions, and receipts back to the initial sample baseline.
            </p>

            {showResetConfirm ? (
              <div className="space-y-3 p-3 rounded bg-black/60 border border-pink-500/40 text-xs font-mono">
                <p className="text-pink-300 font-bold">
                  Confirm reset? All current changes will be overwritten with the baseline records.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      resetDatabaseToDefaults();
                      setShowResetConfirm(false);
                    }}
                    className="flex-1 py-1.5 rounded bg-pink-600 hover:bg-pink-500 text-white font-gaming font-bold uppercase tracking-wider text-[11px]"
                  >
                    Yes, Reset
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="w-full py-2 px-3 rounded bg-pink-950/60 hover:bg-pink-900 border border-pink-500/40 text-pink-300 font-gaming text-xs font-bold uppercase tracking-wider transition-all"
              >
                Reload Baseline Dataset
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
