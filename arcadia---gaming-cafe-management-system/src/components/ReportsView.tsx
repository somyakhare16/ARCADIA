import React, { useState } from 'react';
import { BarChart3, Database, Calendar, Download, Play, CheckCircle2, TrendingUp, Monitor } from 'lucide-react';
import { useArcadia } from '../context/ArcadiaContext';

export const ReportsView: React.FC = () => {
  const { payments, pcs, sessions } = useArcadia();

  // Date filters
  const [startDate, setStartDate] = useState('2025-04-01');
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));

  // Cursor procedure execution result
  const [cursorOutput, setCursorOutput] = useState<{
    totalRevenue: number;
    transactionCount: number;
    cashVolume: number;
    cardVolume: number;
    upiVolume: number;
    executedAt: string;
  } | null>(null);

  // Group payments by date
  const dateMap: { [date: string]: { count: number; total: number } } = {};
  payments
    .filter(p => p.payment_status === 'Completed')
    .forEach(p => {
      const date = p.payment_time.split(' ')[0];
      if (!dateMap[date]) dateMap[date] = { count: 0, total: 0 };
      dateMap[date].count += 1;
      dateMap[date].total += p.amount;
    });

  const dailyReport = Object.entries(dateMap)
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Payment method breakdown
  const methodMap: { [method: string]: { count: number; total: number } } = {
    Cash: { count: 0, total: 0 },
    Card: { count: 0, total: 0 },
    UPI: { count: 0, total: 0 }
  };
  payments
    .filter(p => p.payment_status === 'Completed')
    .forEach(p => {
      if (methodMap[p.payment_method]) {
        methodMap[p.payment_method].count += 1;
        methodMap[p.payment_method].total += p.amount;
      }
    });

  // Rig utilization
  const rigReport = pcs.map(pc => {
    const pcSessions = sessions.filter(s => s.pc_id === pc.pc_id && s.status === 'Completed');
    const totalMins = pcSessions.reduce((sum, s) => sum + s.duration_minutes, 0);
    const totalYield = pcSessions.reduce((sum, s) => sum + s.total_amount, 0);
    return {
      pc_number: pc.pc_number,
      tier: pc.tier,
      rate: pc.hourly_rate,
      sessionCount: pcSessions.length,
      hoursPlayed: (totalMins / 60).toFixed(1),
      revenue: totalYield
    };
  }).sort((a, b) => b.revenue - a.revenue);

  // Run Stored Procedure Cursor Simulation
  const handleRunCursor = () => {
    const qualified = payments.filter(
      p => p.payment_status === 'Completed' &&
      p.payment_time.slice(0, 10) >= startDate &&
      p.payment_time.slice(0, 10) <= endDate
    );

    let cash = 0;
    let card = 0;
    let upi = 0;
    let total = 0;

    // Emulating the FETCH loop of the cursor row-by-row
    qualified.forEach(p => {
      total += p.amount;
      if (p.payment_method === 'Cash') cash += p.amount;
      if (p.payment_method === 'Card') card += p.amount;
      if (p.payment_method === 'UPI') upi += p.amount;
    });

    setCursorOutput({
      totalRevenue: total,
      transactionCount: qualified.length,
      cashVolume: cash,
      cardVolume: card,
      upiVolume: upi,
      executedAt: new Date().toLocaleTimeString()
    });
  };

  // CSV Export for Daily Revenue Report
  const handleExportCsv = () => {
    const headers = 'Date,Transactions,TotalRevenue\n';
    const rows = dailyReport.map(r => `${r.date},${r.count},${r.total.toFixed(2)}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arcadia_revenue_report_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 cyber-card p-5 rounded-lg border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
        <div>
          <h2 className="font-gaming text-sm font-bold text-white tracking-wider flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            REVENUE INTELLIGENCE & FINANCIAL AUDIT
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Daily transaction velocity, payment channel performance, and rig utilization analytics
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center justify-center gap-2 px-3.5 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-gaming font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(0,240,255,0.4)]"
        >
          <Download className="w-4 h-4 text-black" />
          <span>Export Daily CSV</span>
        </button>
      </div>

      {/* Financial Audit Showcase */}
      <div className="cyber-card p-5 rounded-lg border border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <h3 className="font-gaming text-sm font-bold text-white tracking-wider uppercase">
                FINANCIAL AUDIT & REVENUE RECONCILIATION
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Automated multi-channel ledger verification across customizable date intervals
            </p>
          </div>

          {/* Date Range Selector */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block font-gaming uppercase">From Date</span>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="bg-[#08090e] border border-purple-500/30 rounded px-2.5 py-1 text-white focus:outline-none focus:border-purple-400"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-gaming uppercase">To Date</span>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="bg-[#08090e] border border-purple-500/30 rounded px-2.5 py-1 text-white focus:outline-none focus:border-purple-400"
              />
            </div>
            <button
              onClick={handleRunCursor}
              className="mt-4 px-4 py-1.5 rounded bg-purple-500 hover:bg-purple-400 text-white font-gaming text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(168,85,247,0.4)]"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Audit</span>
            </button>
          </div>
        </div>

        {/* Audit Results */}
        {cursorOutput ? (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 pt-2">
            <div className="bg-[#090b14] p-3 rounded border border-purple-500/30">
              <span className="text-[10px] text-slate-400 font-gaming uppercase tracking-wider block">Audited Revenue</span>
              <span className="font-gaming text-xl font-bold text-cyan-300">₹{cursorOutput.totalRevenue.toFixed(2)}</span>
            </div>
            <div className="bg-[#090b14] p-3 rounded border border-purple-500/30">
              <span className="text-[10px] text-slate-400 font-gaming uppercase tracking-wider block">Audited Records</span>
              <span className="font-gaming text-xl font-bold text-white">{cursorOutput.transactionCount} receipts</span>
            </div>
            <div className="bg-[#090b14] p-3 rounded border border-emerald-500/30">
              <span className="text-[10px] text-emerald-400 font-gaming uppercase tracking-wider block">Cash Yield</span>
              <span className="font-gaming text-xl font-bold text-emerald-300">₹{cursorOutput.cashVolume.toFixed(2)}</span>
            </div>
            <div className="bg-[#090b14] p-3 rounded border border-purple-500/30">
              <span className="text-[10px] text-purple-400 font-gaming uppercase tracking-wider block">Card Yield</span>
              <span className="font-gaming text-xl font-bold text-purple-300">₹{cursorOutput.cardVolume.toFixed(2)}</span>
            </div>
            <div className="bg-[#090b14] p-3 rounded border border-cyan-500/30">
              <span className="text-[10px] text-cyan-400 font-gaming uppercase tracking-wider block">UPI Yield</span>
              <span className="font-gaming text-xl font-bold text-cyan-300">₹{cursorOutput.upiVolume.toFixed(2)}</span>
            </div>
          </div>
        ) : (
          <div className="text-xs font-mono text-slate-400 bg-[#080a12] p-3 rounded border border-slate-800 flex items-center justify-between">
            <span>Select a date range and click &ldquo;Run Audit&rdquo; to generate a ledger audit summary.</span>
            <button
              onClick={handleRunCursor}
              className="text-purple-400 hover:text-purple-300 underline font-gaming text-[10px] uppercase"
            >
              Run Audit Now
            </button>
          </div>
        )}
      </div>

      {/* Daily Revenue Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 cyber-card rounded-lg border border-cyan-500/20 overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-gaming text-xs md:text-sm font-bold text-white tracking-wider uppercase">
                DAILY REVENUE SUMMARY
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Settlement dates, volume counts, average ticket, and daily gross earnings
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-[#0e111c] text-slate-400 font-gaming uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <th className="p-3">Settlement Date</th>
                  <th className="p-3">Transactions</th>
                  <th className="p-3">Avg Ticket</th>
                  <th className="p-3 text-right">Daily Yield</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {dailyReport.map(r => (
                  <tr key={r.date} className="hover:bg-cyan-500/[0.03]">
                    <td className="p-3 font-semibold text-white">{r.date}</td>
                    <td className="p-3 text-slate-300">{r.count} payments</td>
                    <td className="p-3 text-slate-400">₹{(r.total / r.count).toFixed(2)}</td>
                    <td className="p-3 text-right font-gaming font-bold text-cyan-300 text-sm">
                      ₹{r.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Methods Breakdown */}
        <div className="cyber-card p-5 rounded-lg border border-cyan-500/20 flex flex-col justify-between">
          <div>
            <h3 className="font-gaming text-xs md:text-sm font-bold text-white tracking-wider uppercase mb-1">
              REVENUE BY PAYMENT METHOD
            </h3>
            <p className="text-[11px] text-slate-400 font-mono mb-4">
              Breakdown across UPI, Card, and Cash channels
            </p>

            <div className="space-y-4">
              {Object.entries(methodMap).map(([method, data]) => {
                const totalAll = Object.values(methodMap).reduce((sum, m) => sum + m.total, 0) || 1;
                const percent = Math.round((data.total / totalAll) * 100);

                return (
                  <div key={method} className="bg-[#090b14] p-3 rounded border border-slate-800">
                    <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                      <span className="font-bold text-white font-gaming">{method}</span>
                      <span className="text-cyan-400 font-bold">₹{data.total.toFixed(2)} ({percent}%)</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mb-1">
                      <div
                        className={`h-full rounded-full ${
                          method === 'UPI' ? 'bg-cyan-400' : method === 'Card' ? 'bg-purple-500' : 'bg-emerald-400'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{data.count} transactions settled</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Fleet Utilization Analysis */}
      <div className="cyber-card rounded-lg border border-purple-500/20 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-gaming text-xs md:text-sm font-bold text-white tracking-wider uppercase">
              GAMING RIG FLEET UTILIZATION
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Hardware yield ranking • Measures utilization hours against gross earnings
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-[#0e111c] text-slate-400 font-gaming uppercase text-[10px] tracking-wider border-b border-slate-800">
                <th className="p-3">Rig Tag</th>
                <th className="p-3">Hardware Tier</th>
                <th className="p-3">Base Rate</th>
                <th className="p-3">Completed Sessions</th>
                <th className="p-3">Total Hours Played</th>
                <th className="p-3 text-right">Lifetime Yield</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {rigReport.map(r => (
                <tr key={r.pc_number} className="hover:bg-purple-500/[0.03]">
                  <td className="p-3 font-bold text-cyan-400 font-gaming">{r.pc_number}</td>
                  <td className="p-3 text-slate-300">{r.tier.replace('_', ' ')}</td>
                  <td className="p-3 text-slate-400">₹{r.rate.toFixed(2)}/hr</td>
                  <td className="p-3 text-white font-semibold">{r.sessionCount} sessions</td>
                  <td className="p-3 text-amber-300 font-bold">{r.hoursPlayed} hrs</td>
                  <td className="p-3 text-right font-gaming font-bold text-emerald-400 text-sm">
                    ₹{r.revenue.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
