import React, { useState } from 'react';
import { Award, Plus, Check, Shield, UserCheck, Calendar, DollarSign, X } from 'lucide-react';
import { useArcadia } from '../context/ArcadiaContext';
import { MembershipPlan, PaymentMethod } from '../types';

export const MembershipsView: React.FC = () => {
  const { plans, memberships, customers, createPlan, assignMembership } = useArcadia();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  // Create Plan Form
  const [planName, setPlanName] = useState('');
  const [price, setPrice] = useState('499.00');
  const [validityDays, setValidityDays] = useState('60');
  const [discountPercent, setDiscountPercent] = useState('15.00');
  const [benefits, setBenefits] = useState('');

  // Assign Form
  const [selectedCustomer, setSelectedCustomer] = useState<number>(customers[0]?.customer_id || 1);
  const [selectedPlan, setSelectedPlan] = useState<number>(plans[0]?.plan_id || 1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Card');

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    createPlan({
      plan_name: planName,
      price: parseFloat(price),
      validity_days: parseInt(validityDays, 10),
      discount_percentage: parseFloat(discountPercent),
      benefits,
      is_active: true
    });
    setCreateModalOpen(false);
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    assignMembership(selectedCustomer, selectedPlan, paymentMethod);
    setAssignModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 cyber-card p-5 rounded-lg border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
        <div>
          <h2 className="font-gaming text-sm font-bold text-white tracking-wider flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-400" />
            MEMBERSHIP PLANS & SUBSCRIBER ROSTER
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Flexible gaming passes, tier privileges, and automated hourly discounts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded bg-purple-900/40 hover:bg-purple-800/40 border border-purple-500/40 text-purple-200 font-gaming text-xs font-bold uppercase tracking-wider transition-all"
          >
            + Create Tier
          </button>
          <button
            onClick={() => setAssignModalOpen(true)}
            className="flex-1 sm:flex-none px-4 py-2 rounded bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-gaming font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(168,85,247,0.4)]"
          >
            Assign Subscription
          </button>
        </div>
      </div>

      {/* Membership Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((plan, index) => {
          const isHighest = index === plans.length - 1;
          const subscriberCount = memberships.filter(m => m.plan_id === plan.plan_id && m.status === 'Active').length;

          return (
            <div
              key={plan.plan_id}
              className={`cyber-card p-6 rounded-lg border flex flex-col justify-between relative overflow-hidden ${
                isHighest
                  ? 'border-purple-400/80 shadow-[0_0_25px_rgba(168,85,247,0.25)]'
                  : 'border-cyan-500/30'
              }`}
            >
              {isHighest && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-500 to-pink-500 text-white font-gaming text-[9px] uppercase font-black px-3 py-1 rounded-bl">
                  VIP Champion
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-purple-400" />
                  <h3 className="font-gaming text-base font-bold text-white tracking-wider">{plan.plan_name}</h3>
                </div>

                <div className="flex items-baseline gap-1 my-4">
                  <span className="font-gaming text-3xl font-black text-white">₹{plan.price.toFixed(2)}</span>
                  <span className="text-xs font-mono text-slate-400">/ {plan.validity_days} days</span>
                </div>

                <div className="p-2.5 rounded bg-purple-950/30 border border-purple-500/20 mb-4 font-mono text-xs text-purple-300 flex items-center justify-between">
                  <span>Hourly Session Discount:</span>
                  <span className="font-bold text-sm text-cyan-300">{plan.discount_percentage}% OFF</span>
                </div>

                <div className="space-y-2 text-xs font-mono text-slate-300">
                  <p className="text-[10px] text-slate-400 font-gaming uppercase tracking-wider">Perks & Benefits:</p>
                  <p className="bg-[#08090e] p-2.5 rounded border border-slate-800 leading-relaxed text-slate-300">
                    {plan.benefits || 'Standard member access.'}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">
                  <span className="font-bold text-white">{subscriberCount}</span> active member{subscriberCount !== 1 ? 's' : ''}
                </span>
                <button
                  onClick={() => {
                    setSelectedPlan(plan.plan_id);
                    setAssignModalOpen(true);
                  }}
                  className="px-3 py-1 rounded bg-purple-500/20 hover:bg-purple-500 hover:text-white border border-purple-400 text-purple-300 font-gaming text-[10px] uppercase font-bold tracking-wider transition-all"
                >
                  Assign to Player
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Subscribers Roster Table */}
      <div className="cyber-card rounded-lg border border-purple-500/20 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-purple-400" />
            <h3 className="font-gaming text-xs md:text-sm font-bold text-white tracking-wider uppercase">
              ACTIVE & HISTORICAL SUBSCRIPTION ROSTER ({memberships.length})
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Junction Table: customer_memberships</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-[#0e111c] text-slate-400 font-gaming uppercase text-[10px] tracking-wider border-b border-slate-800">
                <th className="p-3">Sub #</th>
                <th className="p-3">Customer Name</th>
                <th className="p-3">Plan Tier</th>
                <th className="p-3">Discount</th>
                <th className="p-3">Start Date</th>
                <th className="p-3">Expiry Date</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {memberships.map(sub => {
                const customer = customers.find(c => c.customer_id === sub.customer_id);
                const plan = plans.find(p => p.plan_id === sub.plan_id);
                const isActive = sub.status === 'Active' && new Date(sub.end_date) >= new Date();

                return (
                  <tr key={sub.membership_id} className="hover:bg-purple-500/[0.03] transition-colors">
                    <td className="p-3 text-slate-400">#SUB-{sub.membership_id.toString().padStart(3, '0')}</td>
                    <td className="p-3 font-semibold text-white">{customer?.full_name || `Cust #${sub.customer_id}`}</td>
                    <td className="p-3 font-gaming font-bold text-purple-300">{plan?.plan_name}</td>
                    <td className="p-3 text-cyan-400 font-bold">{plan?.discount_percentage}% OFF</td>
                    <td className="p-3 text-slate-400">{sub.start_date}</td>
                    <td className="p-3 text-slate-300">{sub.end_date}</td>
                    <td className="p-3 text-right">
                      <span className={`text-[10px] px-2 py-0.5 rounded border uppercase font-bold ${
                        isActive
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {isActive ? 'Active' : 'Expired'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Plan Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="cyber-card w-full max-w-md p-6 rounded-lg border border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.3)]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="font-gaming text-sm font-bold text-white tracking-wider">CREATE MEMBERSHIP PLAN</h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1 font-gaming text-[10px] uppercase">Plan Name</label>
                <input
                  type="text"
                  required
                  value={planName}
                  onChange={e => setPlanName(e.target.value)}
                  placeholder="e.g. Master Prestige"
                  className="w-full bg-[#08090e] border border-purple-500/30 rounded p-2.5 text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-gaming text-[10px] uppercase">Price (₹)</label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className="w-full bg-[#08090e] border border-purple-500/30 rounded p-2.5 text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-gaming text-[10px] uppercase">Validity (Days)</label>
                  <input
                    type="number"
                    required
                    value={validityDays}
                    onChange={e => setValidityDays(e.target.value)}
                    className="w-full bg-[#08090e] border border-purple-500/30 rounded p-2.5 text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-gaming text-[10px] uppercase">Hourly Session Discount (%)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  required
                  value={discountPercent}
                  onChange={e => setDiscountPercent(e.target.value)}
                  className="w-full bg-[#08090e] border border-purple-500/30 rounded p-2.5 text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-gaming text-[10px] uppercase">Plan Perks & Description</label>
                <textarea
                  rows={2}
                  value={benefits}
                  onChange={e => setBenefits(e.target.value)}
                  placeholder="Free drink, reserved seat, VIP access..."
                  className="w-full bg-[#08090e] border border-purple-500/30 rounded p-2.5 text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-purple-500 hover:bg-purple-400 text-white font-gaming font-bold uppercase tracking-wider"
                >
                  Create Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Membership Modal */}
      {assignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="cyber-card w-full max-w-md p-6 rounded-lg border border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.3)]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="font-gaming text-sm font-bold text-white tracking-wider">ASSIGN MEMBERSHIP TO CUSTOMER</h3>
              <button onClick={() => setAssignModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1 font-gaming text-[10px] uppercase">Select Customer</label>
                <select
                  value={selectedCustomer}
                  onChange={e => setSelectedCustomer(parseInt(e.target.value, 10))}
                  className="w-full bg-[#08090e] border border-purple-500/30 rounded p-2.5 text-white focus:outline-none focus:border-purple-400"
                >
                  {customers.map(c => (
                    <option key={c.customer_id} value={c.customer_id}>
                      {c.full_name} ({c.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-gaming text-[10px] uppercase">Select Membership Plan</label>
                <select
                  value={selectedPlan}
                  onChange={e => setSelectedPlan(parseInt(e.target.value, 10))}
                  className="w-full bg-[#08090e] border border-purple-500/30 rounded p-2.5 text-white focus:outline-none focus:border-purple-400"
                >
                  {plans.map(p => (
                    <option key={p.plan_id} value={p.plan_id}>
                      {p.plan_name} — ₹{p.price.toFixed(2)} ({p.validity_days} days, {p.discount_percentage}% OFF)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-gaming text-[10px] uppercase">Payment Settlement Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Card', 'UPI', 'Cash'] as PaymentMethod[]).map(method => (
                    <button
                      type="button"
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`py-2 rounded font-mono text-xs border text-center transition-all ${
                        paymentMethod === method
                          ? 'bg-purple-500 text-white border-purple-400 font-bold shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                          : 'bg-[#08090e] text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setAssignModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-purple-500 hover:bg-purple-400 text-white font-gaming font-bold uppercase tracking-wider"
                >
                  Confirm & Charge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
