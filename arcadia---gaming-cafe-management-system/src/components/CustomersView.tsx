import React, { useState } from 'react';
import { Users, Search, Plus, Edit2, Trash2, ShieldCheck, Gamepad2, CreditCard, X, AlertTriangle } from 'lucide-react';
import { useArcadia } from '../context/ArcadiaContext';
import { Customer } from '../types';

export const CustomersView: React.FC = () => {
  const {
    customers,
    sessions,
    payments,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerActiveMembership
  } = useArcadia();

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [selectedCustomerDetails, setSelectedCustomerDetails] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const filteredCustomers = customers.filter(c =>
    c.full_name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFullName('');
    setPhone('');
    setEmail('');
    setModalOpen(true);
  };

  const handleOpenEdit = (c: Customer) => {
    setEditingCustomer(c);
    setFullName(c.full_name);
    setPhone(c.phone);
    setEmail(c.email);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
      updateCustomer(editingCustomer.customer_id, { full_name: fullName, phone, email });
    } else {
      addCustomer({ full_name: fullName, phone, email });
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 cyber-card p-4 rounded-lg border border-cyan-500/20">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customer name, phone, or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#08090e] border border-cyan-500/30 rounded pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-gaming font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(0,240,255,0.4)]"
        >
          <Plus className="w-4 h-4 text-black" />
          <span>Enroll Customer</span>
        </button>
      </div>

      {/* Customers Table */}
      <div className="cyber-card rounded-lg border border-cyan-500/20 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            <h3 className="font-gaming text-xs md:text-sm font-bold text-white tracking-wider uppercase">
              REGISTERED CUSTOMER PROFILES ({filteredCustomers.length})
            </h3>
          </div>
          <span className="text-[11px] font-mono text-cyan-400">Active Membership Roster</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-[#0e111c] text-slate-400 font-gaming uppercase text-[10px] tracking-wider border-b border-slate-800">
                <th className="p-3">ID</th>
                <th className="p-3">Full Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Email</th>
                <th className="p-3">Active Membership</th>
                <th className="p-3">Total Spent</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-400">
                    No customer records matched your query.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(c => {
                  const membership = getCustomerActiveMembership(c.customer_id);
                  const totalSpent = payments
                    .filter(p => p.customer_id === c.customer_id && p.payment_status === 'Completed')
                    .reduce((sum, p) => sum + p.amount, 0);

                  return (
                    <tr key={c.customer_id} className="hover:bg-cyan-500/[0.03] transition-colors">
                      <td className="p-3 text-slate-400">#{c.customer_id}</td>
                      <td className="p-3">
                        <button
                          onClick={() => setSelectedCustomerDetails(c)}
                          className="font-bold text-white hover:text-cyan-400 transition-colors text-left"
                        >
                          {c.full_name}
                        </button>
                      </td>
                      <td className="p-3 text-slate-300">{c.phone}</td>
                      <td className="p-3 text-slate-400">{c.email}</td>
                      <td className="p-3">
                        {membership ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px]">
                            <ShieldCheck className="w-3 h-3 text-purple-400" />
                            {membership.planName} (-{membership.discountPercentage}%)
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[10px]">Standard / None</span>
                        )}
                      </td>
                      <td className="p-3 font-bold text-cyan-400">₹{totalSpent.toFixed(2)}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedCustomerDetails(c)}
                            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                            title="View History"
                          >
                            <Gamepad2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(c)}
                            className="p-1.5 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/30"
                            title="Edit Profile"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setCustomerToDelete(c)}
                            className="p-1.5 rounded bg-pink-950 hover:bg-pink-900 text-pink-300 border border-pink-500/30 transition-all hover:scale-105"
                            title="Delete Customer Profile"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="cyber-card w-full max-w-md p-6 rounded-lg border border-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.3)]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="font-gaming text-sm font-bold text-white tracking-wider">
                {editingCustomer ? 'EDIT CUSTOMER PROFILE' : 'ENROLL NEW CUSTOMER'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1 font-gaming text-[10px] uppercase">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Marcus Vance"
                  className="w-full bg-[#08090e] border border-cyan-500/30 rounded p-2.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-gaming text-[10px] uppercase">Phone Number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#08090e] border border-cyan-500/30 rounded p-2.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-gaming text-[10px] uppercase">Email Address (Unique)</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="customer@domain.com"
                  className="w-full bg-[#08090e] border border-cyan-500/30 rounded p-2.5 text-white focus:outline-none focus:border-cyan-400"
                />
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
                  {editingCustomer ? 'Update Profile' : 'Save Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Details & History Modal */}
      {selectedCustomerDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="cyber-card w-full max-w-2xl p-6 rounded-lg border border-purple-500/40 shadow-[0_0_25px_rgba(168,85,247,0.3)]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div>
                <h3 className="font-gaming text-base font-bold text-white tracking-wider">
                  {selectedCustomerDetails.full_name}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Customer ID #{selectedCustomerDetails.customer_id} • Enrolled {selectedCustomerDetails.created_at}
                </p>
              </div>
              <button onClick={() => setSelectedCustomerDetails(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Quick Contact & Membership Bar */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-[#090b12] p-3 rounded border border-slate-800">
                <div>
                  <span className="text-slate-400">Phone:</span> <span className="text-white">{selectedCustomerDetails.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400">Email:</span> <span className="text-white">{selectedCustomerDetails.email}</span>
                </div>
                <div>
                  <span className="text-slate-400">Membership:</span>{' '}
                  <span className="text-purple-400 font-bold">
                    {getCustomerActiveMembership(selectedCustomerDetails.customer_id)?.planName || 'None (Standard)'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Lifetime Spent:</span>{' '}
                  <span className="text-cyan-400 font-bold">
                    ₹{payments
                      .filter(p => p.customer_id === selectedCustomerDetails.customer_id && p.payment_status === 'Completed')
                      .reduce((sum, p) => sum + p.amount, 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Past Sessions for this customer */}
              <div>
                <h4 className="font-gaming text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Completed Gaming Sessions
                </h4>
                <div className="max-h-56 overflow-y-auto rounded border border-slate-800 text-xs font-mono">
                  {sessions.filter(s => s.customer_id === selectedCustomerDetails.customer_id).length === 0 ? (
                    <div className="p-4 text-center text-slate-500">No session history on record for this customer.</div>
                  ) : (
                    <table className="w-full text-left">
                      <thead className="bg-slate-900 text-slate-400 text-[10px] font-gaming uppercase">
                        <tr>
                          <th className="p-2">Session</th>
                          <th className="p-2">Rig</th>
                          <th className="p-2">Duration</th>
                          <th className="p-2">Total Paid</th>
                          <th className="p-2">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {sessions
                          .filter(s => s.customer_id === selectedCustomerDetails.customer_id)
                          .map(s => (
                            <tr key={s.session_id}>
                              <td className="p-2 text-slate-400">#{s.session_id}</td>
                              <td className="p-2 text-cyan-400 font-bold">Rig #{s.pc_id}</td>
                              <td className="p-2 text-amber-300">{s.duration_minutes}m</td>
                              <td className="p-2 text-emerald-400 font-bold">₹{s.total_amount.toFixed(2)}</td>
                              <td className="p-2 text-slate-400">{s.start_time.split(' ')[0]}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  const target = selectedCustomerDetails;
                  setSelectedCustomerDetails(null);
                  setCustomerToDelete(target);
                }}
                className="px-3.5 py-1.5 rounded bg-pink-950/60 hover:bg-pink-900 text-pink-300 border border-pink-500/30 text-xs font-mono flex items-center gap-1.5 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete This Profile</span>
              </button>

              <button
                onClick={() => setSelectedCustomerDetails(null)}
                className="px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {customerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="cyber-card w-full max-w-md p-6 rounded-lg border border-pink-500 shadow-[0_0_35px_rgba(244,63,94,0.35)]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-pink-400" />
                <h3 className="font-gaming text-sm font-bold text-white tracking-wider uppercase">
                  DELETE CUSTOMER RECORD
                </h3>
              </div>
              <button
                onClick={() => setCustomerToDelete(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <p className="text-slate-300 leading-relaxed">
                Are you sure you want to delete customer <span className="text-white font-bold">&ldquo;{customerToDelete.full_name}&rdquo;</span> (ID #{customerToDelete.customer_id})?
              </p>

              <div className="bg-[#090b14] p-3 rounded border border-slate-800 space-y-1.5 text-[11px] text-slate-400">
                <div className="flex justify-between">
                  <span>Phone Number:</span>
                  <span className="text-slate-200 font-bold">{customerToDelete.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span>Email Address:</span>
                  <span className="text-slate-200">{customerToDelete.email}</span>
                </div>
                <div className="flex justify-between">
                  <span>Member Since:</span>
                  <span className="text-slate-200">{customerToDelete.created_at}</span>
                </div>
              </div>

              <div className="text-[11px] text-pink-300 bg-pink-950/30 p-2.5 rounded border border-pink-500/30 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                <span>
                  Notice: In line with DBMS foreign key constraints (ON DELETE CASCADE), deleting this customer profile will also remove their associated membership passes and session transaction history.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCustomerToDelete(null)}
                  className="px-4 py-2 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 font-mono text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const id = customerToDelete.customer_id;
                    setCustomerToDelete(null);
                    deleteCustomer(id);
                  }}
                  className="px-5 py-2 rounded bg-pink-600 hover:bg-pink-500 text-white font-gaming font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(244,63,94,0.4)] flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Confirm Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
