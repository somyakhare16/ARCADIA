import React from 'react';
import { Printer, X, CheckCircle2, Gamepad2, Shield } from 'lucide-react';
import { useArcadia } from '../context/ArcadiaContext';

export const ReceiptModal: React.FC = () => {
  const { selectedReceiptId, setSelectedReceiptId, payments, sessions, pcs, customers, settings } = useArcadia();

  if (!selectedReceiptId) return null;

  const payment = payments.find(p => p.payment_id === selectedReceiptId);
  if (!payment) return null;

  const customer = customers.find(c => c.customer_id === payment.customer_id);
  const session = payment.session_id ? sessions.find(s => s.session_id === payment.session_id) : null;
  const pc = session ? pcs.find(p => p.pc_id === session.pc_id) : null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm print:p-0 print:bg-white">
      <div className="bg-[#0b0d14] text-slate-100 w-full max-w-md p-6 rounded-lg border border-cyan-400 shadow-[0_0_30px_rgba(0,240,255,0.3)] print:border-none print:shadow-none print:text-black print:bg-white print:max-w-none">
        {/* Header Controls */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4 print:hidden">
          <span className="font-gaming text-xs uppercase font-bold text-cyan-400 flex items-center gap-1.5">
            <Printer className="w-4 h-4" /> OFFICIAL TRANSACTION RECEIPT
          </span>
          <button onClick={() => setSelectedReceiptId(null)} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Paper */}
        <div className="font-mono text-xs space-y-4 bg-[#07080d] p-5 rounded border border-slate-800 print:border-none print:p-0">
          {/* Logo & Cafe Header */}
          <div className="text-center pb-3 border-b border-dashed border-slate-700">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Gamepad2 className="w-5 h-5 text-cyan-400 print:text-black" />
              <h2 className="font-gaming text-lg font-black tracking-wider text-white print:text-black">
                {settings.cafe_name}
              </h2>
            </div>
            <p className="text-[10px] text-slate-400 print:text-gray-600">GAMING LOUNGE & ESPORTS ARENA</p>
            <p className="text-[10px] text-slate-400 print:text-gray-600">{settings.contact_phone} • {settings.contact_email}</p>
          </div>

          {/* Receipt Metadata */}
          <div className="space-y-1.5 text-[11px] pb-3 border-b border-dashed border-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-400 print:text-gray-600">Receipt No:</span>
              <span className="font-bold text-cyan-300 print:text-black">ARC-RCP-{payment.payment_id.toString().padStart(4, '0')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 print:text-gray-600">Date/Time:</span>
              <span className="text-white print:text-black">{payment.payment_time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 print:text-gray-600">Customer:</span>
              <span className="font-bold text-white print:text-black">{customer?.full_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 print:text-gray-600">Contact:</span>
              <span className="text-slate-300 print:text-gray-700">{customer?.phone}</span>
            </div>
          </div>

          {/* Itemized Session Details */}
          {session ? (
            <div className="space-y-1.5 text-[11px] pb-3 border-b border-dashed border-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-400 print:text-gray-600">Gaming Rig:</span>
                <span className="font-bold text-cyan-400 print:text-black">{pc?.pc_number} ({pc?.tier})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 print:text-gray-600">Session Window:</span>
                <span className="text-slate-300 print:text-gray-700">{session.start_time.split(' ')[1]} - {session.end_time?.split(' ')[1] || 'End'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 print:text-gray-600">Duration Billed:</span>
                <span className="font-bold text-amber-300 print:text-black">{session.duration_minutes} Minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 print:text-gray-600">Applied Rate:</span>
                <span className="text-slate-300 print:text-gray-700">₹{session.applied_hourly_rate.toFixed(2)} / hour</span>
              </div>
            </div>
          ) : (
            <div className="py-2 text-[11px] border-b border-dashed border-slate-700 text-slate-300">
              <span>Item: Membership Plan Subscription Fee</span>
            </div>
          )}

          {/* Total & Payment Method */}
          <div className="space-y-2 pt-1">
            <div className="flex justify-between items-center text-sm">
              <span className="font-gaming font-bold text-white print:text-black uppercase">Grand Total:</span>
              <span className="font-gaming text-2xl font-black text-cyan-400 print:text-black">
                ₹{payment.amount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400 print:text-gray-600">Payment Channel:</span>
              <span className="font-bold uppercase text-emerald-400 print:text-black">{payment.payment_method}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400 print:text-gray-600">Status:</span>
              <span className="text-emerald-400 font-bold uppercase">{payment.payment_status}</span>
            </div>
          </div>

          {/* Paid Stamp */}
          <div className="text-center pt-3 border-t border-dashed border-slate-700">
            <div className="inline-block px-4 py-1 rounded border-2 border-emerald-500 text-emerald-400 font-gaming text-xs font-black tracking-widest uppercase rotate-[-3deg] print:border-black print:text-black">
              PAID IN FULL
            </div>
            <p className="text-[10px] text-slate-500 mt-2 print:text-gray-500">
              Thank you for playing at ARCADIA. Game on!
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex justify-end gap-2 mt-4 print:hidden">
          <button
            onClick={() => setSelectedReceiptId(null)}
            className="px-4 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 font-mono text-xs"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-gaming font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,240,255,0.4)]"
          >
            <Printer className="w-4 h-4 text-black" />
            <span>Print Invoice</span>
          </button>
        </div>
      </div>
    </div>
  );
};
