import React, { useState } from 'react';
import { CreditCard, Search, DollarSign, Printer, Filter, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useArcadia } from '../context/ArcadiaContext';
import { PaymentMethod } from '../types';

export const PaymentsView: React.FC = () => {
  const { payments, customers, sessions, setSelectedReceiptId } = useArcadia();
  const [search, setSearch] = useState('');
  const [filterMethod, setFilterMethod] = useState<string>('ALL');

  const filteredPayments = payments
    .filter(p => filterMethod === 'ALL' || p.payment_method === filterMethod)
    .filter(p => {
      const cust = customers.find(c => c.customer_id === p.customer_id);
      const query = search.toLowerCase();
      return (
        p.payment_id.toString().includes(query) ||
        cust?.full_name.toLowerCase().includes(query) ||
        p.payment_method.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => new Date(b.payment_time).getTime() - new Date(a.payment_time).getTime());

  const totalVolume = filteredPayments
    .filter(p => p.payment_status === 'Completed')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 cyber-card p-5 rounded-lg border border-cyan-500/30 shadow-[0_0_20px_rgba(0,240,255,0.15)]">
        <div>
          <h2 className="font-gaming text-sm font-bold text-white tracking-wider flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-cyan-400" />
            FINANCIAL TRANSACTION JOURNAL & RECEIPTS
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Audit trail of gaming session settlements and membership fee receipts
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono text-xs">
            <span className="text-[10px] text-slate-400 uppercase font-gaming mr-1.5">Settled Volume:</span>
            <span className="font-bold text-cyan-400 text-sm">₹{totalVolume.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 cyber-card p-4 rounded-lg border border-cyan-500/20">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search receipt #, customer name, method..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#08090e] border border-cyan-500/30 rounded pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-1.5 font-gaming text-xs">
          <span className="text-slate-400 text-[10px] uppercase font-mono mr-1">Method:</span>
          {['ALL', 'Cash', 'Card', 'UPI'].map(method => (
            <button
              key={method}
              onClick={() => setFilterMethod(method)}
              className={`px-3 py-1.5 rounded text-[11px] transition-all ${
                filterMethod === method
                  ? 'bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {method}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction Table */}
      <div className="cyber-card rounded-lg border border-cyan-500/20 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-gaming text-xs md:text-sm font-bold text-white tracking-wider uppercase">
            PAYMENT LEDGER ENTRIES ({filteredPayments.length})
          </h3>
          <span className="text-[11px] font-mono text-slate-400">Table: payments</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-[#0e111c] text-slate-400 font-gaming uppercase text-[10px] tracking-wider border-b border-slate-800">
                <th className="p-3">Receipt Code</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Source / Reason</th>
                <th className="p-3">Method</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3 text-right">Invoice Slip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-slate-500">
                    No payment records match the current filter.
                  </td>
                </tr>
              ) : (
                filteredPayments.map(p => {
                  const customer = customers.find(c => c.customer_id === p.customer_id);
                  const session = p.session_id ? sessions.find(s => s.session_id === p.session_id) : null;

                  return (
                    <tr key={p.payment_id} className="hover:bg-cyan-500/[0.03] transition-colors">
                      <td className="p-3 text-cyan-400 font-bold">ARC-RCP-{p.payment_id.toString().padStart(4, '0')}</td>
                      <td className="p-3 font-semibold text-white">{customer?.full_name || `Cust #${p.customer_id}`}</td>
                      <td className="p-3 text-slate-300">
                        {session ? (
                          <span className="text-pink-300">Gaming Session #{session.session_id} ({session.duration_minutes}m)</span>
                        ) : (
                          <span className="text-purple-300">Membership Tier Fee</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded border uppercase font-bold ${
                          p.payment_method === 'UPI' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' :
                          p.payment_method === 'Card' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                          'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}>
                          {p.payment_method}
                        </span>
                      </td>
                      <td className="p-3 font-gaming text-sm font-bold text-cyan-300">₹{p.amount.toFixed(2)}</td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold uppercase">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          {p.payment_status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">{p.payment_time}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setSelectedReceiptId(p.payment_id)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-[10px] font-gaming uppercase tracking-wider inline-flex items-center gap-1 transition-all"
                        >
                          <Printer className="w-3 h-3 text-cyan-400" />
                          <span>Print</span>
                        </button>
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
