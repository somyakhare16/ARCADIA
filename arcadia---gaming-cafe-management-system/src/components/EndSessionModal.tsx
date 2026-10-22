import React, { useState } from 'react';
import { PlaySquare, X, DollarSign, Clock, ShieldCheck, CheckCircle2, Zap } from 'lucide-react';
import { useArcadia } from '../context/ArcadiaContext';
import { PaymentMethod } from '../types';

interface EndSessionModalProps {
  sessionId: number | null;
  onClose: () => void;
}

export const EndSessionModal: React.FC<EndSessionModalProps> = ({ sessionId, onClose }) => {
  const { sessions, pcs, customers, calculateCurrentCost, endSession } = useArcadia();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');

  if (!sessionId) return null;

  const session = sessions.find(s => s.session_id === sessionId);
  if (!session || session.status !== 'Active') return null;

  const pc = pcs.find(p => p.pc_id === session.pc_id);
  const customer = customers.find(c => c.customer_id === session.customer_id);
  const { elapsedMinutes, cost } = calculateCurrentCost(session);

  const handleSettle = (e: React.FormEvent) => {
    e.preventDefault();
    endSession(sessionId, paymentMethod);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="cyber-card w-full max-w-md p-6 rounded-lg border border-pink-500 shadow-[0_0_25px_rgba(244,63,94,0.3)]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-pink-400" />
            <h3 className="font-gaming text-sm font-bold text-white tracking-wider">
              CONCLUDE SESSION & SETTLE PAYMENT
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSettle} className="space-y-4 text-xs font-mono">
          {/* Summary Details */}
          <div className="bg-[#090b14] p-3.5 rounded border border-slate-800 space-y-2">
            <div className="flex justify-between text-slate-400">
              <span>Player:</span>
              <span className="font-bold text-white">{customer?.full_name}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Gaming Rig:</span>
              <span className="text-cyan-400 font-bold">{pc?.pc_number}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Start Time:</span>
              <span className="text-slate-300">{session.start_time}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Effective Hourly Rate:</span>
              <span className="text-slate-300">₹{session.applied_hourly_rate.toFixed(2)}/hr</span>
            </div>
            <div className="flex justify-between text-amber-300 pt-2 border-t border-slate-800 font-bold">
              <span>Session Duration:</span>
              <span>{elapsedMinutes} minutes</span>
            </div>
          </div>

          {/* Amount Due Display */}
          <div className="bg-pink-950/30 p-4 rounded border border-pink-500/40 text-center">
            <span className="text-[10px] text-pink-400 font-gaming uppercase tracking-wider block mb-1">
              Final Amount Due
            </span>
            <div className="font-gaming text-3xl font-black text-white">₹{cost.toFixed(2)}</div>
            <span className="text-[10px] text-slate-400 font-mono">
              Pro-rata: ({elapsedMinutes}m / 60) * ₹{session.applied_hourly_rate.toFixed(2)}
            </span>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-slate-400 mb-1 font-gaming text-[10px] uppercase">
              Select Settlement Channel
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['UPI', 'Card', 'Cash'] as PaymentMethod[]).map(method => (
                <button
                  type="button"
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`py-2 rounded font-mono text-xs border text-center transition-all ${
                    paymentMethod === method
                      ? 'bg-pink-500 text-black border-pink-400 font-bold shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                      : 'bg-[#08090e] text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Settlement Notice */}
          <div className="text-[10px] text-slate-400 bg-black/40 p-2.5 rounded border border-slate-800 flex items-center gap-2">
            <Zap className="w-4 h-4 text-pink-400 shrink-0" />
            <span>
              Finalizing settlement marks this session as complete, issues an official receipt, and returns the station to Available status.
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
              className="px-5 py-1.5 rounded bg-pink-500 hover:bg-pink-400 text-black font-gaming font-bold uppercase tracking-wider shadow-[0_0_12px_rgba(244,63,94,0.4)]"
            >
              Confirm Settle & Print Receipt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
