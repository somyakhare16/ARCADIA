import React, { useState } from 'react';
import { User, X, ShieldCheck, Clock, CreditCard, Monitor, Plus, CheckCircle2, Ticket } from 'lucide-react';
import { useArcadia } from '../context/ArcadiaContext';

interface CustomerPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: () => void;
}

export const CustomerPortalModal: React.FC<CustomerPortalModalProps> = ({ isOpen, onClose, onOpenBooking }) => {
  const {
    customers,
    addCustomer,
    sessions,
    pcs,
    payments,
    getCustomerActiveMembership,
    calculateCurrentCost,
    setSelectedReceiptId
  } = useArcadia();

  const [selectedCustomerId, setSelectedCustomerId] = useState<number>(customers[0]?.customer_id || 1);
  const [isRegistering, setIsRegistering] = useState(false);

  // New registration form
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');

  if (!isOpen) return null;

  const currentCustomer = customers.find(c => c.customer_id === selectedCustomerId) || customers[0];
  const activeMembership = currentCustomer ? getCustomerActiveMembership(currentCustomer.customer_id) : null;
  const activeSession = currentCustomer ? sessions.find(s => s.customer_id === currentCustomer.customer_id && s.status === 'Active') : null;
  const activePc = activeSession ? pcs.find(p => p.pc_id === activeSession.pc_id) : null;
  const { elapsedMinutes, cost } = activeSession ? calculateCurrentCost(activeSession) : { elapsedMinutes: 0, cost: 0 };

  const customerPayments = currentCustomer
    ? payments
        .filter(p => p.customer_id === currentCustomer.customer_id)
        .sort((a, b) => new Date(b.payment_time).getTime() - new Date(a.payment_time).getTime())
    : [];

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;
    addCustomer({
      full_name: newName.trim(),
      phone: newPhone.trim(),
      email: newEmail.trim() || `${newName.toLowerCase().replace(/\s+/g, '')}@example.com`
    });
    setIsRegistering(false);
    setNewName('');
    setNewPhone('');
    setNewEmail('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="cyber-card w-full max-w-2xl p-6 sm:p-7 rounded-xl border border-cyan-400/50 shadow-[0_0_35px_rgba(0,240,255,0.25)] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-gaming text-base font-bold text-white tracking-wider">
                PLAYER PORTAL & MEMBER PASS
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Manage your gaming sessions, VIP membership pass, and receipts
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Player Selector / Switcher */}
        <div className="bg-[#090b14] p-4 rounded-lg border border-slate-800 mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex-1">
            <label className="block text-[10px] uppercase font-gaming text-slate-400 mb-1">
              Active Player Profile
            </label>
            <select
              value={selectedCustomerId}
              onChange={e => setSelectedCustomerId(parseInt(e.target.value, 10))}
              className="w-full bg-[#0d101d] border border-cyan-500/30 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
            >
              {customers.map(c => (
                <option key={c.customer_id} value={c.customer_id}>
                  {c.full_name} ({c.phone})
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="px-3.5 py-2 rounded bg-purple-900/30 hover:bg-purple-900/50 border border-purple-500/40 text-purple-300 font-gaming text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all self-end sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isRegistering ? 'Cancel' : 'New Gamer Sign Up'}</span>
          </button>
        </div>

        {/* Quick Registration Form */}
        {isRegistering && (
          <form onSubmit={handleRegister} className="bg-purple-950/20 border border-purple-500/30 rounded-lg p-4 mb-6 space-y-3 font-mono text-xs">
            <h4 className="font-gaming text-xs font-bold text-purple-300 uppercase tracking-wider">
              Register New Gamer Account
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full bg-[#08090e] border border-slate-700 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 00000"
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                  className="w-full bg-[#08090e] border border-slate-700 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Email (Optional)</label>
                <input
                  type="email"
                  placeholder="alex@example.com"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  className="w-full bg-[#08090e] border border-slate-700 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsRegistering(false)}
                className="px-3 py-1 rounded bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-gaming font-bold uppercase text-[11px]"
              >
                Complete Registration
              </button>
            </div>
          </form>
        )}

        {/* Member Status & Active Session Cards */}
        {currentCustomer && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Membership Card */}
              <div className="p-4 rounded-lg bg-gradient-to-br from-[#121424] to-[#0a0c16] border border-purple-500/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-gaming text-purple-400 tracking-wider">
                      Membership Pass
                    </span>
                    {activeMembership ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                        ACTIVE VIP
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        STANDARD GUEST
                      </span>
                    )}
                  </div>
                  <h4 className="font-gaming text-lg font-bold text-white mb-1">
                    {activeMembership ? activeMembership.planName : 'No Active Subscription'}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono">
                    {activeMembership
                      ? `Enjoying ${activeMembership.discountPercentage}% discount on all gaming rigs`
                      : 'Join a membership tier to unlock up to 30% hourly discount and tournament priority.'}
                  </p>
                </div>
                {activeMembership ? (
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Expires:</span>
                    <span className="text-purple-300 font-bold">{activeMembership.membership.end_date}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenBooking();
                    }}
                    className="mt-4 py-1.5 px-3 rounded bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 font-gaming text-xs font-bold uppercase transition-all"
                  >
                    View Membership Plans
                  </button>
                )}
              </div>

              {/* Active Session Card */}
              <div className="p-4 rounded-lg bg-gradient-to-br from-[#121424] to-[#0a0c16] border border-cyan-500/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-gaming text-cyan-400 tracking-wider">
                      Live Gaming Station
                    </span>
                    {activeSession ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-500/20 text-pink-400 border border-pink-500/40 animate-pulse">
                        PLAYING NOW
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                        READY TO PLAY
                      </span>
                    )}
                  </div>

                  {activeSession ? (
                    <div>
                      <h4 className="font-gaming text-lg font-bold text-white mb-1 flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-cyan-400" />
                        {activePc?.pc_number} ({activePc?.tier.replace('_', ' ')})
                      </h4>
                      <div className="text-xs font-mono text-slate-300 space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Elapsed Time:</span>
                          <span className="text-amber-300 font-bold">{elapsedMinutes} mins</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Current Total:</span>
                          <span className="text-emerald-400 font-bold">₹{cost.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4 className="font-gaming text-base font-bold text-white mb-1">No Active Session</h4>
                      <p className="text-xs text-slate-400 font-mono">
                        Ready to drop in? Book an ultra-performance PC with zero wait time.
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  {activeSession ? (
                    <span className="text-xs text-slate-400 font-mono block text-center">
                      Session started at {activeSession.start_time.split(' ')[1]}
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenBooking();
                      }}
                      className="w-full py-1.5 px-3 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-gaming text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(0,240,255,0.3)]"
                    >
                      Book a Station Now
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Receipt & Payment History */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-gaming text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-cyan-400" />
                  Your Receipts & Transaction History
                </h4>
                <span className="text-[11px] font-mono text-slate-400">{customerPayments.length} transactions</span>
              </div>

              {customerPayments.length === 0 ? (
                <div className="p-4 rounded bg-[#090b14] border border-slate-800 text-center font-mono text-xs text-slate-500">
                  No payment history on file for this account.
                </div>
              ) : (
                <div className="overflow-x-auto rounded border border-slate-800">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#0e111d] text-slate-400 font-gaming uppercase text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="p-2.5">Receipt #</th>
                        <th className="p-2.5">Date</th>
                        <th className="p-2.5">Item</th>
                        <th className="p-2.5">Channel</th>
                        <th className="p-2.5">Amount</th>
                        <th className="p-2.5 text-right">Slip</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-[#090b14]">
                      {customerPayments.map(p => (
                        <tr key={p.payment_id} className="hover:bg-cyan-500/[0.02]">
                          <td className="p-2.5 text-slate-400">ARC-RCP-{p.payment_id.toString().padStart(4, '0')}</td>
                          <td className="p-2.5 text-slate-300">{p.payment_time}</td>
                          <td className="p-2.5 text-white">
                            {p.session_id ? `Gaming Session #${p.session_id}` : 'Membership Plan'}
                          </td>
                          <td className="p-2.5 text-slate-300">{p.payment_method}</td>
                          <td className="p-2.5 text-cyan-400 font-bold">₹{p.amount.toFixed(2)}</td>
                          <td className="p-2.5 text-right">
                            <button
                              onClick={() => {
                                setSelectedReceiptId(p.payment_id);
                              }}
                              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px]"
                            >
                              Print Slip
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
