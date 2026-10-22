import React, { useState } from 'react';
import { Monitor, Plus, Wrench, CheckCircle2, PlaySquare, Edit2, Trash2, X, AlertTriangle } from 'lucide-react';
import { useArcadia } from '../context/ArcadiaContext';
import { GamingPC, RigTier, RigStatus } from '../types';

interface PcsViewProps {
  onOpenStartSessionForPc?: (pcId: number) => void;
}

export const PcsView: React.FC<PcsViewProps> = ({ onOpenStartSessionForPc }) => {
  const { pcs, addPC, updatePC, deletePC, togglePcStatus, sessions } = useArcadia();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPc, setEditingPc] = useState<GamingPC | null>(null);
  const [pcToDelete, setPcToDelete] = useState<GamingPC | null>(null);
  const [filterTier, setFilterTier] = useState<string>('ALL');

  // Form State
  const [pcNumber, setPcNumber] = useState('');
  const [specs, setSpecs] = useState('');
  const [tier, setTier] = useState<RigTier>('Standard');
  const [hourlyRate, setHourlyRate] = useState('120.00');
  const [status, setStatus] = useState<RigStatus>('Available');

  const filteredPcs = pcs.filter(p => filterTier === 'ALL' || p.tier === filterTier);

  const handleOpenAdd = () => {
    setEditingPc(null);
    setPcNumber(`RIG-${(pcs.length + 1).toString().padStart(2, '0')}-STD`);
    setSpecs('Intel Core i5-14600KF, RTX 4070 12GB, 32GB DDR5, 180Hz Fast-IPS');
    setTier('Standard');
    setHourlyRate('120.00');
    setStatus('Available');
    setModalOpen(true);
  };

  const handleOpenEdit = (pc: GamingPC) => {
    setEditingPc(pc);
    setPcNumber(pc.pc_number);
    setSpecs(pc.specs);
    setTier(pc.tier);
    setHourlyRate(pc.hourly_rate.toString());
    setStatus(pc.status);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rate = parseFloat(hourlyRate);
    if (isNaN(rate) || rate < 0) return;

    if (editingPc) {
      updatePC(editingPc.pc_id, {
        pc_number: pcNumber,
        specs,
        tier,
        hourly_rate: rate,
        status
      });
    } else {
      addPC({
        pc_number: pcNumber,
        specs,
        tier,
        hourly_rate: rate,
        status,
        purchase_date: new Date().toISOString().slice(0, 10)
      });
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 cyber-card p-4 rounded-lg border border-cyan-500/20">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 font-gaming text-xs">
          <span className="text-slate-400 text-[10px] uppercase font-mono mr-1">Tier:</span>
          {['ALL', 'VIP_Ultra', 'Performance', 'Standard', 'Streaming'].map(t => (
            <button
              key={t}
              onClick={() => setFilterTier(t)}
              className={`px-3 py-1.5 rounded transition-all text-[11px] ${
                filterTier === t
                  ? 'bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-gaming font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(0,240,255,0.4)]"
        >
          <Plus className="w-4 h-4 text-black" />
          <span>Commission Rig</span>
        </button>
      </div>

      {/* Rigs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredPcs.map(pc => {
          const isAvailable = pc.status === 'Available';
          const isInUse = pc.status === 'In Use';
          const isMaintenance = pc.status === 'Maintenance';
          const currentSession = sessions.find(s => s.pc_id === pc.pc_id && s.status === 'Active');

          return (
            <div
              key={pc.pc_id}
              className={`cyber-card p-5 rounded-lg border transition-all flex flex-col justify-between ${
                isInUse
                  ? 'border-pink-500/50 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                  : isAvailable
                  ? 'border-emerald-500/40 hover:border-emerald-400'
                  : 'border-amber-500/40'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-gaming text-base font-bold text-white tracking-wider flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-cyan-400" />
                      {pc.pc_number}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-purple-300 border border-purple-500/30">
                      {pc.tier.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Status Indicator */}
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold border ${
                      isAvailable
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : isInUse
                        ? 'bg-pink-500/20 text-pink-300 border-pink-500/40 animate-pulse'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    {pc.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-mono mb-4 leading-relaxed bg-[#080a10] p-2.5 rounded border border-slate-800/80">
                  {pc.specs}
                </p>

                <div className="flex items-center justify-between text-xs font-mono mb-4">
                  <span className="text-slate-400">Rate:</span>
                  <span className="text-cyan-400 font-bold text-sm">₹{pc.hourly_rate.toFixed(2)}/hr</span>
                </div>

                {isInUse && currentSession && (
                  <div className="text-[11px] font-mono text-pink-300 bg-pink-950/30 p-2 rounded border border-pink-500/30 mb-3">
                    Active Session #{currentSession.session_id} • Started {currentSession.start_time.split(' ')[1]}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(pc)}
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="Edit Rig Config"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setPcToDelete(pc)}
                    className="p-1.5 rounded bg-pink-950/60 hover:bg-pink-900 text-pink-300 border border-pink-500/30 transition-all hover:scale-105"
                    title="Decommission Rig"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => togglePcStatus(pc.pc_id, isMaintenance ? 'Available' : 'Maintenance')}
                    className={`p-1.5 rounded border ${
                      isMaintenance
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500/30'
                        : 'bg-amber-950 text-amber-300 border-amber-500/30'
                    }`}
                    title={isMaintenance ? 'Restore to Available' : 'Send to Maintenance'}
                  >
                    <Wrench className="w-3.5 h-3.5" />
                  </button>
                </div>

                {isAvailable && onOpenStartSessionForPc && (
                  <button
                    onClick={() => onOpenStartSessionForPc(pc.pc_id)}
                    className="px-2.5 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-gaming text-[10px] font-bold tracking-wider uppercase transition-all"
                  >
                    Launch Rig
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Rig Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="cyber-card w-full max-w-md p-6 rounded-lg border border-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.3)]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="font-gaming text-sm font-bold text-white tracking-wider">
                {editingPc ? 'RECONFIGURE GAMING RIG' : 'COMMISSION NEW GAMING RIG'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1 font-gaming text-[10px] uppercase">Rig Designation / Tag</label>
                <input
                  type="text"
                  required
                  value={pcNumber}
                  onChange={e => setPcNumber(e.target.value)}
                  placeholder="RIG-09-VIP"
                  className="w-full bg-[#08090e] border border-cyan-500/30 rounded p-2.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-gaming text-[10px] uppercase">Hardware Specifications</label>
                <textarea
                  required
                  rows={3}
                  value={specs}
                  onChange={e => setSpecs(e.target.value)}
                  placeholder="CPU, GPU, RAM, Monitor refresh rate..."
                  className="w-full bg-[#08090e] border border-cyan-500/30 rounded p-2.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-gaming text-[10px] uppercase">Hardware Tier</label>
                  <select
                    value={tier}
                    onChange={e => setTier(e.target.value as RigTier)}
                    className="w-full bg-[#08090e] border border-cyan-500/30 rounded p-2.5 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Performance">Performance</option>
                    <option value="VIP_Ultra">VIP Ultra</option>
                    <option value="Streaming">Streaming Dual-PC</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-gaming text-[10px] uppercase">Hourly Rate (₹)</label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={hourlyRate}
                    onChange={e => setHourlyRate(e.target.value)}
                    className="w-full bg-[#08090e] border border-cyan-500/30 rounded p-2.5 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-gaming text-[10px] uppercase">Initial Status</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as RigStatus)}
                  className="w-full bg-[#08090e] border border-cyan-500/30 rounded p-2.5 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="Available">Available</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-gaming font-bold uppercase tracking-wider"
                >
                  {editingPc ? 'Update Rig' : 'Save & Commission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Decommission PC Confirmation Modal */}
      {pcToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="cyber-card w-full max-w-md p-6 rounded-lg border border-pink-500 shadow-[0_0_30px_rgba(244,63,94,0.35)]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-pink-400" />
                <h3 className="font-gaming text-sm font-bold text-white tracking-wider uppercase">
                  DECOMMISSION GAMING RIG
                </h3>
              </div>
              <button onClick={() => setPcToDelete(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <p className="text-slate-300 leading-relaxed">
                Are you sure you want to decommission battle station <span className="text-cyan-400 font-bold">{pcToDelete.pc_number}</span> from the active café fleet?
              </p>

              <div className="bg-[#090b14] p-3 rounded border border-slate-800 space-y-1.5 text-[11px] text-slate-400">
                <div>Tier: <span className="text-purple-300 font-bold">{pcToDelete.tier.replace('_', ' ')}</span></div>
                <div>Specs: <span className="text-slate-300">{pcToDelete.specs}</span></div>
                <div>Hourly Rate: <span className="text-cyan-400 font-bold">₹{pcToDelete.hourly_rate.toFixed(2)}/hr</span></div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setPcToDelete(null)}
                  className="px-4 py-2 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 font-mono text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const id = pcToDelete.pc_id;
                    setPcToDelete(null);
                    deletePC(id);
                  }}
                  className="px-5 py-2 rounded bg-pink-600 hover:bg-pink-500 text-white font-gaming font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(244,63,94,0.4)] flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Confirm Decommission</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
