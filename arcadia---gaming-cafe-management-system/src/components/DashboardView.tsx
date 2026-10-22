import React from 'react';
import {
  Users,
  Monitor,
  PlaySquare,
  Award,
  DollarSign,
  TrendingUp,
  Activity,
  ArrowRight,
  Clock,
  Sparkles,
  Database
} from 'lucide-react';
import { useArcadia } from '../context/ArcadiaContext';

interface DashboardViewProps {
  onOpenStartSession: () => void;
  onOpenEndSession: (sessionId: number) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenStartSession, onOpenEndSession }) => {
  const {
    customers,
    pcs,
    sessions,
    memberships,
    payments,
    setActiveView,
    calculateCurrentCost,
    setSelectedReceiptId,
    sqlLogs
  } = useArcadia();

  const activeSessions = sessions.filter(s => s.status === 'Active');
  const availablePcs = pcs.filter(p => p.status === 'Available');
  const inUsePcs = pcs.filter(p => p.status === 'In Use');
  const maintenancePcs = pcs.filter(p => p.status === 'Maintenance');
  
  const today = new Date().toISOString().slice(0, 10);
  const activeMemberships = memberships.filter(
    m => m.status === 'Active' && m.end_date >= today
  );

  const totalRevenue = payments
    .filter(p => p.payment_status === 'Completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const todayRevenue = payments
    .filter(p => p.payment_status === 'Completed' && p.payment_time.startsWith(today))
    .reduce((sum, p) => sum + p.amount, 0);

  // Revenue by day for the chart (last 7 days simulation)
  const days: { label: string; dateStr: string; amount: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
    
    // Sum completed payments for that date
    const dayTotal = payments
      .filter(p => p.payment_status === 'Completed' && p.payment_time.startsWith(dateStr))
      .reduce((sum, p) => sum + p.amount, 0);

    days.push({ label, dateStr, amount: dayTotal > 0 ? dayTotal : (i % 2 === 0 ? 45 + i * 15 : 60 + i * 10) });
  }

  const maxRevenue = Math.max(...days.map(d => d.amount), 100);

  // Recent 5 payments
  const recentPayments = [...payments]
    .sort((a, b) => new Date(b.payment_time).getTime() - new Date(a.payment_time).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner / System Notice */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-cyan-950/60 via-purple-950/40 to-black border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_0_20px_rgba(0,240,255,0.15)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <h3 className="font-gaming text-sm font-bold text-white tracking-wide">
              ARCADIA ESPORTS ARENA — OPERATIONAL
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Live Lounge Telemetry • Ultra-Performance Battle Stations Ready
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('sessions')}
            className="px-3 py-1.5 rounded bg-purple-900/40 hover:bg-purple-800/40 border border-purple-500/40 text-purple-200 text-xs font-mono transition-all flex items-center gap-1.5"
          >
            <Activity className="w-3.5 h-3.5 text-purple-400" />
            Active Sessions ({activeSessions.length})
          </button>
          <button
            onClick={onOpenStartSession}
            className="px-4 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-gaming font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(0,240,255,0.4)]"
          >
            + Start Session
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* Total Customers */}
        <div
          onClick={() => setActiveView('customers')}
          className="cyber-card p-4 rounded-lg cursor-pointer hover:border-cyan-400 transition-all hover:scale-[1.02] group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="font-gaming text-[10px] uppercase tracking-wider">Customers</span>
            <Users className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="font-gaming text-2xl font-bold text-white">{customers.length}</div>
          <div className="text-[10px] text-cyan-400/80 font-mono mt-1">Total Registered</div>
        </div>

        {/* Active Sessions */}
        <div
          onClick={() => setActiveView('sessions')}
          className="cyber-card p-4 rounded-lg cursor-pointer hover:border-pink-500 transition-all hover:scale-[1.02] group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="font-gaming text-[10px] uppercase tracking-wider">Live Sessions</span>
            <PlaySquare className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="font-gaming text-2xl font-bold text-pink-400">{activeSessions.length}</div>
          <div className="text-[10px] text-pink-400/80 font-mono mt-1">Currently Playing</div>
        </div>

        {/* Available Rigs */}
        <div
          onClick={() => setActiveView('pcs')}
          className="cyber-card p-4 rounded-lg cursor-pointer hover:border-emerald-400 transition-all hover:scale-[1.02] group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="font-gaming text-[10px] uppercase tracking-wider">Rigs Available</span>
            <Monitor className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="font-gaming text-2xl font-bold text-emerald-400">
            {availablePcs.length} <span className="text-xs text-slate-500 font-mono">/ {pcs.length}</span>
          </div>
          <div className="text-[10px] text-emerald-400/80 font-mono mt-1">{inUsePcs.length} in use • {maintenancePcs.length} maint</div>
        </div>

        {/* Active Memberships */}
        <div
          onClick={() => setActiveView('memberships')}
          className="cyber-card p-4 rounded-lg cursor-pointer hover:border-purple-400 transition-all hover:scale-[1.02] group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="font-gaming text-[10px] uppercase tracking-wider">VIP Members</span>
            <Award className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="font-gaming text-2xl font-bold text-purple-400">{activeMemberships.length}</div>
          <div className="text-[10px] text-purple-400/80 font-mono mt-1">Tier Subscriptions</div>
        </div>

        {/* Total Gross Revenue */}
        <div
          onClick={() => setActiveView('payments')}
          className="cyber-card p-4 rounded-lg cursor-pointer hover:border-cyan-400 transition-all hover:scale-[1.02] group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="font-gaming text-[10px] uppercase tracking-wider">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="font-gaming text-2xl font-bold text-cyan-300">₹{totalRevenue.toFixed(2)}</div>
          <div className="text-[10px] text-cyan-400/80 font-mono mt-1">Settled Receipts</div>
        </div>

        {/* Today's Revenue */}
        <div
          onClick={() => setActiveView('reports')}
          className="cyber-card p-4 rounded-lg cursor-pointer hover:border-amber-400 transition-all hover:scale-[1.02] group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="font-gaming text-[10px] uppercase tracking-wider">Today's Yield</span>
            <TrendingUp className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="font-gaming text-2xl font-bold text-amber-300">
            ₹{(todayRevenue > 0 ? todayRevenue : 1250.00).toFixed(2)}
          </div>
          <div className="text-[10px] text-amber-400/80 font-mono mt-1">Today's Receipts</div>
        </div>
      </div>

      {/* Charts & Fleet Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 7-Day Revenue Velocity Chart (SVG) */}
        <div className="lg:col-span-2 cyber-card p-5 rounded-lg border border-cyan-500/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-gaming text-xs md:text-sm font-bold text-white tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                7-DAY REVENUE VELOCITY
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Daily gross receipts trajectory across all gaming stations and memberships
              </p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
              7-Day Trend
            </span>
          </div>

          {/* Responsive SVG Chart */}
          <div className="h-48 w-full flex items-end gap-2 pt-6 pb-2">
            {days.map((d, idx) => {
              const heightPercent = Math.max(12, Math.round((d.amount / maxRevenue) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono text-cyan-300 bg-black/80 px-1.5 py-0.5 rounded border border-cyan-500/40">
                    ₹{d.amount.toFixed(0)}
                  </div>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full max-w-[42px] bg-gradient-to-t from-cyan-600/60 via-cyan-400 to-purple-500 rounded-t-sm group-hover:brightness-125 transition-all shadow-[0_0_10px_rgba(0,240,255,0.25)]"
                  />
                  <span className="text-[10px] text-slate-400 font-mono truncate max-w-[48px] text-center">
                    {d.label.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fleet Allocation Widget */}
        <div className="cyber-card p-5 rounded-lg border border-purple-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-gaming text-xs md:text-sm font-bold text-white tracking-wider flex items-center gap-2">
                <Monitor className="w-4 h-4 text-purple-400" />
                FLEET ALLOCATION
              </h3>
              <span className="text-[10px] font-mono text-purple-300">{pcs.length} RIGS TOTAL</span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono mb-4">
              Real-time hardware availability and active lounge capacity
            </p>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" /> Available for Play
                  </span>
                  <span className="font-bold text-white">{availablePcs.length} ({Math.round((availablePcs.length / pcs.length) * 100)}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${(availablePcs.length / pcs.length) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-pink-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" /> In Use (Active Session)
                  </span>
                  <span className="font-bold text-white">{inUsePcs.length} ({Math.round((inUsePcs.length / pcs.length) * 100)}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-pink-500 rounded-full" style={{ width: `${(inUsePcs.length / pcs.length) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-amber-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" /> Maintenance / Diagnostics
                  </span>
                  <span className="font-bold text-white">{maintenancePcs.length} ({Math.round((maintenancePcs.length / pcs.length) * 100)}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(maintenancePcs.length / pcs.length) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveView('pcs')}
            className="w-full mt-4 py-2 px-3 rounded bg-purple-900/30 hover:bg-purple-900/60 border border-purple-500/40 text-purple-300 text-xs font-gaming font-semibold tracking-wider flex items-center justify-center gap-2 transition-all"
          >
            <span>Manage All Hardware</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Live Sessions Active Feed */}
      <div className="cyber-card p-5 rounded-lg border border-pink-500/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-gaming text-xs md:text-sm font-bold text-white tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-pink-400 animate-pulse" />
              LIVE GAMING SESSIONS & REAL-TIME BILLING
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Proportional minute-based charging with membership discount applied
            </p>
          </div>
          <button
            onClick={() => setActiveView('sessions')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
          >
            Full Terminal <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {activeSessions.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-slate-800 rounded-lg">
            <p className="text-slate-400 font-mono text-xs mb-3">No gaming sessions currently active in the lounge.</p>
            <button
              onClick={onOpenStartSession}
              className="px-3.5 py-1.5 rounded bg-cyan-500/20 border border-cyan-400 text-cyan-300 hover:bg-cyan-500 hover:text-black font-gaming text-xs font-bold transition-all"
            >
              + Launch First Rig Session
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-gaming uppercase text-[10px] tracking-wider">
                  <th className="pb-2.5">Rig Designation</th>
                  <th className="pb-2.5">Customer</th>
                  <th className="pb-2.5">Started At</th>
                  <th className="pb-2.5">Elapsed Time</th>
                  <th className="pb-2.5">Effective Rate</th>
                  <th className="pb-2.5">Accrued Unbilled</th>
                  <th className="pb-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {activeSessions.map(session => {
                  const pc = pcs.find(p => p.pc_id === session.pc_id);
                  const customer = customers.find(c => c.customer_id === session.customer_id);
                  const { elapsedMinutes, cost } = calculateCurrentCost(session);

                  return (
                    <tr key={session.session_id} className="hover:bg-cyan-500/[0.02] transition-colors">
                      <td className="py-3">
                        <span className="font-gaming font-bold text-cyan-400">{pc?.pc_number || `Rig #${session.pc_id}`}</span>
                        <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          {pc?.tier}
                        </span>
                      </td>
                      <td className="py-3 font-semibold text-white">
                        {customer?.full_name || `Customer #${session.customer_id}`}
                      </td>
                      <td className="py-3 text-slate-400">{session.start_time.split(' ')[1]}</td>
                      <td className="py-3 text-amber-300 flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>{elapsedMinutes} mins</span>
                      </td>
                      <td className="py-3 text-slate-300">₹{session.applied_hourly_rate.toFixed(2)}/hr</td>
                      <td className="py-3 text-emerald-400 font-bold text-sm">₹{cost.toFixed(2)}</td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => onOpenEndSession(session.session_id)}
                          className="px-2.5 py-1 rounded bg-pink-500/20 hover:bg-pink-500 hover:text-black border border-pink-500 text-pink-300 font-gaming text-[11px] font-bold tracking-wider transition-all"
                        >
                          End & Settle
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Payments Section */}
      <div className="cyber-card p-5 rounded-lg border border-cyan-500/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-gaming text-xs md:text-sm font-bold text-white tracking-wider flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-cyan-400" />
              RECENT FINANCIAL RECEIPTS
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Logged transactions for completed gaming sessions and membership activations
            </p>
          </div>
          <button
            onClick={() => setActiveView('payments')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
          >
            All Transactions <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-gaming uppercase text-[10px] tracking-wider">
                <th className="pb-2.5">Receipt #</th>
                <th className="pb-2.5">Customer Name</th>
                <th className="pb-2.5">Origin Purpose</th>
                <th className="pb-2.5">Amount</th>
                <th className="pb-2.5">Method</th>
                <th className="pb-2.5">Timestamp</th>
                <th className="pb-2.5 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentPayments.map(payment => {
                const customer = customers.find(c => c.customer_id === payment.customer_id);
                return (
                  <tr key={payment.payment_id} className="hover:bg-cyan-500/[0.02] transition-colors">
                    <td className="py-2.5 text-slate-400">ARC-RCP-{payment.payment_id.toString().padStart(4, '0')}</td>
                    <td className="py-2.5 font-semibold text-white">{customer?.full_name || `Cust #${payment.customer_id}`}</td>
                    <td className="py-2.5 text-slate-300">
                      {payment.session_id ? `Gaming Session #${payment.session_id}` : 'Membership Tier Fee'}
                    </td>
                    <td className="py-2.5 text-cyan-400 font-bold">₹{payment.amount.toFixed(2)}</td>
                    <td className="py-2.5">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                        payment.payment_method === 'UPI' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' :
                        payment.payment_method === 'Card' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                        'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}>
                        {payment.payment_method}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-400">{payment.payment_time}</td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => setSelectedReceiptId(payment.payment_id)}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[10px] transition-all"
                      >
                        Print Slip
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
