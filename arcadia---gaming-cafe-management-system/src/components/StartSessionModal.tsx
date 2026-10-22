import React, { useState, useEffect } from 'react';
import { PlaySquare, X, Monitor, Users, ShieldCheck, Zap } from 'lucide-react';
import { useArcadia } from '../context/ArcadiaContext';

interface StartSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedPcId?: number;
}

export const StartSessionModal: React.FC<StartSessionModalProps> = ({ isOpen, onClose, preselectedPcId }) => {
  const { customers, pcs, startSession, getCustomerActiveMembership } = useArcadia();

  const availablePcs = pcs.filter(p => p.status === 'Available');

  const [selectedCustomerId, setSelectedCustomerId] = useState<number>(customers[0]?.customer_id || 1);
  const [selectedPcId, setSelectedPcId] = useState<number>(
    preselectedPcId || availablePcs[0]?.pc_id || 1
  );

  useEffect(() => {
    if (preselectedPcId) {
      setSelectedPcId(preselectedPcId);
    } else if (availablePcs.length > 0 && !availablePcs.some(p => p.pc_id === selectedPcId)) {
      setSelectedPcId(availablePcs[0].pc_id);
    }
  }, [preselectedPcId, availablePcs]);

  if (!isOpen) return null;

  const chosenPc = pcs.find(p => p.pc_id === selectedPcId);
  const chosenCustomer = customers.find(c => c.customer_id === selectedCustomerId);
  const activeMembership = chosenCustomer ? getCustomerActiveMembership(chosenCustomer.customer_id) : null;
  const discountPercent = activeMembership?.discountPercentage || 0;

  const baseRate = chosenPc ? chosenPc.hourly_rate : 0;
  const effectiveRate = Number((baseRate * (1 - discountPercent / 100)).toFixed(2));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chosenPc || chosenPc.status !== 'Available') {
      alert('Selected rig is not available.');
      return;
    }
    const res = startSession(selectedCustomerId, selectedPcId);
    if (res.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="cyber-card w-full max-w-lg p-6 rounded-lg border border-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.3)]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <PlaySquare className="w-5 h-5 text-cyan-400" />
            <h3 className="font-gaming text-sm font-bold text-white tracking-wider">
              LAUNCH NEW GAMING RIG SESSION
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {availablePcs.length === 0 ? (
          <div className="text-center py-6">
            <Monitor className="w-10 h-10 text-amber-400 mx-auto mb-2" />
            <p className="text-amber-300 font-mono text-xs font-bold mb-1">ALL RIGS CURRENTLY ENGAGED</p>
            <p className="text-slate-400 text-xs font-mono mb-4">
              There are no available gaming PCs. Conclude an active session to free up a station.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded bg-slate-800 text-white font-mono text-xs"
            >
              Dismiss
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            {/* Customer Picker */}
            <div>
              <label className="block text-slate-400 mb-1 font-gaming text-[10px] uppercase">
                1. Select Player / Customer
              </label>
              <select
                value={selectedCustomerId}
                onChange={e => setSelectedCustomerId(parseInt(e.target.value, 10))}
                className="w-full bg-[#08090e] border border-cyan-500/30 rounded p-2.5 text-white focus:outline-none focus:border-cyan-400"
              >
                {customers.map(c => {
                  const m = getCustomerActiveMembership(c.customer_id);
                  return (
                    <option key={c.customer_id} value={c.customer_id}>
                      {c.full_name} ({c.phone}) {m ? `— [${m.planName} -${m.discountPercentage}%]` : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* PC Picker */}
            <div>
              <label className="block text-slate-400 mb-1 font-gaming text-[10px] uppercase">
                2. Select Available Gaming Rig
              </label>
              <select
                value={selectedPcId}
                onChange={e => setSelectedPcId(parseInt(e.target.value, 10))}
                className="w-full bg-[#08090e] border border-cyan-500/30 rounded p-2.5 text-white focus:outline-none focus:border-cyan-400"
              >
                {availablePcs.map(p => (
                  <option key={p.pc_id} value={p.pc_id}>
                    {p.pc_number} [{p.tier.replace('_', ' ')}] — ₹{p.hourly_rate.toFixed(2)}/hr ({p.specs})
                  </option>
                ))}
              </select>
            </div>

            {/* Real-time Rate Calculation Box */}
            <div className="bg-[#090b14] p-3.5 rounded border border-cyan-500/30 space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Base Rig Rate:</span>
                <span className="text-white">₹{baseRate.toFixed(2)} / hr</span>
              </div>

              {activeMembership ? (
                <div className="flex justify-between text-purple-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {activeMembership.planName} Discount:
                  </span>
                  <span className="font-bold">-{discountPercent}%</span>
                </div>
              ) : (
                <div className="flex justify-between text-slate-500">
                  <span>Membership Discount:</span>
                  <span>None (0%)</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                <span className="font-gaming text-cyan-400 uppercase font-bold text-[11px]">
                  Effective Billing Rate:
                </span>
                <span className="font-gaming text-base font-bold text-cyan-300">
                  ₹{effectiveRate.toFixed(2)} <span className="text-xs text-slate-400 font-mono">/ hr</span>
                </span>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 bg-black/40 p-2.5 rounded border border-slate-800 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                Rig status updates instantaneously to &ldquo;In Use&rdquo; upon session launch and per-minute billing begins automatically.
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-gaming font-bold uppercase tracking-wider shadow-[0_0_12px_rgba(0,240,255,0.4)]"
              >
                Launch & Start Timer
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
