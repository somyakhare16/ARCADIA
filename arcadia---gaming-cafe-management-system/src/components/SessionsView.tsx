import React, { useState } from 'react';
import { PlaySquare, Clock, DollarSign, CheckCircle, Search, AlertTriangle, Monitor, Users } from 'lucide-react';
import { useArcadia } from '../context/ArcadiaContext';

interface SessionsViewProps {
  onOpenStartSession: () => void;
  onOpenEndSession: (sessionId: number) => void;
}

export const SessionsView: React.FC<SessionsViewProps> = ({ onOpenStartSession, onOpenEndSession }) => {
  const { sessions, customers, pcs, calculateCurrentCost, setSelectedReceiptId, payments } = useArcadia();
  const [historySearch, setHistorySearch] = useState('');

  const activeSessions = sessions.filter(s => s.status === 'Active');
  const completedSessions = sessions
    .filter(s => s.status === 'Completed')
    .filter(s => {
      const cust = customers.find(c => c.customer_id === s.customer_id);
      const pc = pcs.find(p => p.pc_id === s.pc_id);
      const query = historySearch.toLowerCase();
      return (
        s.session_id.toString().includes(query) ||
        cust?.full_name.toLowerCase().includes(query) ||
        pc?.pc_number.toLowerCase().includes(query)
      );
    });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 cyber-card p-5 rounded-lg border border-pink-500/30 shadow-[0_0_20px_rgba(244,63,94,0.15)]">
        <div>
          <h2 className="font-gaming text-sm font-bold text-white tracking-wider flex items-center gap-2">
            <PlaySquare className="w-5 h-5 text-pink-400" />
            LIVE GAMING SESSIONS & REAL-TIME BILLING ENGINE
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Proportional minute-based charging • Membership discounts applied at session start
          </p>
        </div>

        <button
          onClick={onOpenStartSession}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-gaming font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(0,240,255,0.4)]"
        >
          <PlaySquare className="w-4 h-4 text-black" />
          <span>+ Launch New Session</span>
        </button>
      </div>

      {/* Active Sessions Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-gaming text-xs font-bold text-white tracking-wider uppercase flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-400 animate-ping" />
            Currently Active Gaming Rigs ({activeSessions.length})
          </h3>
          <span className="text-[11px] font-mono text-emerald-400">Live Station Status</span>
        </div>

        {activeSessions.length === 0 ? (
          <div className="cyber-card p-8 rounded-lg border border-dashed border-slate-800 text-center">
            <Monitor className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-400 font-mono text-xs mb-3">No active sessions are running right now.</p>
            <button
              onClick={onOpenStartSession}
              className="px-4 py-2 rounded bg-cyan-500/20 hover:bg-cyan-500 hover:text-black border border-cyan-400 text-cyan-300 font-gaming text-xs font-bold uppercase tracking-wider transition-all"
            >
              Start First Rig Session
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeSessions.map(session => {
              const pc = pcs.find(p => p.pc_id === session.pc_id);
              const customer = customers.find(c => c.customer_id === session.customer_id);
              const { elapsedMinutes, cost } = calculateCurrentCost(session);

              return (
                <div
                  key={session.session_id}
                  className="cyber-card p-5 rounded-lg border border-pink-500/50 shadow-[0_0_20px_rgba(244,63,94,0.2)] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-3 pb-3 border-b border-slate-800">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400">SESSION #{session.session_id}</span>
                        <h4 className="font-gaming text-lg font-bold text-white flex items-center gap-2">
                          <Monitor className="w-4 h-4 text-cyan-400" />
                          {pc?.pc_number}
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/40 uppercase font-bold animate-pulse">
                        Active Playing
                      </span>
                    </div>

                    <div className="space-y-2.5 text-xs font-mono mb-4">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-cyan-400" /> Player:
                        </span>
                        <span className="font-bold text-white">{customer?.full_name}</span>
                      </div>

                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-400" /> Start Time:
                        </span>
                        <span className="text-slate-300">{session.start_time.split(' ')[1]}</span>
                      </div>

                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-400">Applied Rate:</span>
                        <span className="text-slate-300">₹{session.applied_hourly_rate.toFixed(2)} / hr</span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 bg-[#070910] p-2 rounded">
                        <span className="text-amber-300 font-bold flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> Elapsed:
                        </span>
                        <span className="font-gaming text-sm font-bold text-amber-300">{elapsedMinutes} MINS</span>
                      </div>

                      <div className="flex items-center justify-between bg-emerald-950/20 p-2.5 rounded border border-emerald-500/30">
                        <span className="text-emerald-400 font-gaming text-[11px] uppercase tracking-wider">
                          Accrued Subtotal:
                        </span>
                        <span className="font-gaming text-lg font-bold text-emerald-400">₹{cost.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenEndSession(session.session_id)}
                    className="w-full py-2 px-3 rounded bg-pink-500 hover:bg-pink-400 text-black font-gaming font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(244,63,94,0.4)] flex items-center justify-center gap-2"
                  >
                    <span>Conclude Session & Settle Bill</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed Sessions Log */}
      <div className="cyber-card rounded-lg border border-cyan-500/20 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-gaming text-xs md:text-sm font-bold text-white tracking-wider uppercase">
              SESSION HISTORY LOG ({completedSessions.length})
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Historical records with durations, applied discount rates, and settled amounts
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search session, customer, rig..."
              value={historySearch}
              onChange={e => setHistorySearch(e.target.value)}
              className="w-full bg-[#08090e] border border-cyan-500/30 rounded pl-8 pr-3 py-1.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-[#0e111c] text-slate-400 font-gaming uppercase text-[10px] tracking-wider border-b border-slate-800">
                <th className="p-3">Session #</th>
                <th className="p-3">Player</th>
                <th className="p-3">Rig Tag</th>
                <th className="p-3">Start Time</th>
                <th className="p-3">End Time</th>
                <th className="p-3">Duration</th>
                <th className="p-3">Rate</th>
                <th className="p-3">Total Charged</th>
                <th className="p-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {completedSessions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-6 text-center text-slate-500">
                    No completed sessions found.
                  </td>
                </tr>
              ) : (
                completedSessions.map(session => {
                  const pc = pcs.find(p => p.pc_id === session.pc_id);
                  const customer = customers.find(c => c.customer_id === session.customer_id);
                  const matchingPayment = payments.find(p => p.session_id === session.session_id);

                  return (
                    <tr key={session.session_id} className="hover:bg-cyan-500/[0.03] transition-colors">
                      <td className="p-3 text-slate-400">#{session.session_id}</td>
                      <td className="p-3 font-semibold text-white">{customer?.full_name || `Cust #${session.customer_id}`}</td>
                      <td className="p-3 text-cyan-400 font-bold">{pc?.pc_number || `Rig #${session.pc_id}`}</td>
                      <td className="p-3 text-slate-400">{session.start_time}</td>
                      <td className="p-3 text-slate-400">{session.end_time || '—'}</td>
                      <td className="p-3 text-amber-300 font-bold">{session.duration_minutes} mins</td>
                      <td className="p-3 text-slate-300">₹{session.applied_hourly_rate.toFixed(2)}/hr</td>
                      <td className="p-3 text-emerald-400 font-bold">₹{session.total_amount.toFixed(2)}</td>
                      <td className="p-3 text-right">
                        {matchingPayment ? (
                          <button
                            onClick={() => setSelectedReceiptId(matchingPayment.payment_id)}
                            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-[10px]"
                          >
                            Receipt #{matchingPayment.payment_id}
                          </button>
                        ) : (
                          <span className="text-slate-500 text-[10px]">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
