import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';
import { useArcadia } from '../context/ArcadiaContext';

export const ContactView: React.FC = () => {
  const { settings, notify } = useArcadia();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [inquiryType, setInquiryType] = useState('Station Booking / Booth Reservation');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
    notify('Thank you! Your inquiry has been received. Our team will get back to you shortly.', 'success');
  };

  return (
    <div className="space-y-12 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="cyber-card p-8 rounded-xl border border-cyan-500/30 text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs text-cyan-400 font-mono uppercase tracking-widest">
          <MapPin className="w-4 h-4" />
          <span>Location & Contact</span>
        </div>
        <h1 className="font-gaming text-3xl sm:text-4xl font-black text-white tracking-wide">
          VISIT OR REACH OUT TO ARCADIA
        </h1>
        <p className="max-w-2xl mx-auto text-sm text-slate-300 font-mono leading-relaxed">
          Have questions about booth bookings, private squad lock-ins, or hardware configurations? We&apos;re here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Cards */}
        <div className="space-y-4 font-mono text-xs">
          <div className="cyber-card p-5 rounded-lg border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-gaming font-bold text-sm">
              <Clock className="w-4 h-4" />
              <span>Hours of Operation</span>
            </div>
            <p className="text-white font-semibold">
              {settings.opening_hours || 'Mon – Thu: 10:00 AM – Midnight\nFri – Sun: 10:00 AM – 3:00 AM'}
            </p>
            <p className="text-slate-400 text-[11px]">Walk-ins welcome all day. Weekend booking recommended.</p>
          </div>

          <div className="cyber-card p-5 rounded-lg border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-gaming font-bold text-sm">
              <Phone className="w-4 h-4" />
              <span>Direct Phone</span>
            </div>
            <p className="text-white font-semibold">{settings.contact_phone || '+91 98765 43210'}</p>
            <p className="text-slate-400 text-[11px]">Front desk line for quick availability checks.</p>
          </div>

          <div className="cyber-card p-5 rounded-lg border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-pink-400 font-gaming font-bold text-sm">
              <Mail className="w-4 h-4" />
              <span>Email Support</span>
            </div>
            <p className="text-white font-semibold">{settings.contact_email || 'ops@arcadiaesports.com'}</p>
            <p className="text-slate-400 text-[11px]">For tournament inquiries and private lounge rentals.</p>
          </div>

          <div className="cyber-card p-5 rounded-lg border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-gaming font-bold text-sm">
              <MapPin className="w-4 h-4" />
              <span>Café Location</span>
            </div>
            <p className="text-white font-semibold">
              {settings.address || 'Arcadia Gaming Lounge, Tech & Gaming District'}
            </p>
            <p className="text-slate-400 text-[11px]">Central Downtown access with validated parking.</p>
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="lg:col-span-2 cyber-card p-8 rounded-lg border border-cyan-500/20">
          <h3 className="font-gaming text-lg font-bold text-white tracking-wider mb-2 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            SEND A DIRECT INQUIRY OR BOOTH REQUEST
          </h3>
          <p className="text-xs text-slate-400 font-mono mb-6">
            Fill out the form below and our lounge concierge will confirm your request.
          </p>

          {submitted ? (
            <div className="p-8 text-center bg-cyan-950/20 border border-cyan-500/40 rounded-lg space-y-3 font-mono">
              <CheckCircle2 className="w-12 h-12 text-cyan-400 mx-auto animate-bounce" />
              <h4 className="font-gaming text-lg font-bold text-white">INQUIRY RECEIVED</h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Thank you, {name}! We have received your inquiry regarding &ldquo;{inquiryType}&rdquo; and will respond to {email} within a few hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setMessage('');
                }}
                className="mt-4 px-4 py-2 rounded bg-cyan-500 text-black font-gaming font-bold text-xs uppercase"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-gaming text-[10px] uppercase">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Marcus Vance"
                    className="w-full bg-[#08090e] border border-cyan-500/30 rounded p-2.5 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-gaming text-[10px] uppercase">
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="marcus@domain.com"
                    className="w-full bg-[#08090e] border border-cyan-500/30 rounded p-2.5 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-gaming text-[10px] uppercase">
                  Inquiry Topic
                </label>
                <select
                  value={inquiryType}
                  onChange={e => setInquiryType(e.target.value)}
                  className="w-full bg-[#08090e] border border-cyan-500/30 rounded p-2.5 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="Station Booking / Booth Reservation">Station Booking / Private Squad Booth</option>
                  <option value="Tournament Enrollment">Friday Night Tournament Enrollment</option>
                  <option value="Membership Question">Membership Tier Benefits & Discounts</option>
                  <option value="Private Event Lock-In">Private Birthday or Corporate Gaming Event</option>
                  <option value="General Question">General Café Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-gaming text-[10px] uppercase">
                  Your Message or Reservation Details
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Provide party size, preferred station tier, date, and any specific game titles..."
                  className="w-full bg-[#08090e] border border-cyan-500/30 rounded p-2.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-gaming font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_12px_rgba(0,240,255,0.4)]"
                >
                  <Send className="w-4 h-4 text-black" />
                  <span>Submit Inquiry</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="cyber-card p-8 rounded-lg border border-slate-800 space-y-6">
        <div className="border-b border-slate-800 pb-3 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-purple-400" />
          <h3 className="font-gaming text-lg font-bold text-white tracking-wider">
            FREQUENTLY ASKED QUESTIONS
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
          <div className="space-y-1">
            <h4 className="font-gaming text-cyan-300 font-bold text-[12px]">Can I bring my own mouse, keyboard, or headset?</h4>
            <p className="text-slate-400 leading-relaxed">
              Yes! All stations provide front-access high-speed USB 3.2 hubs. You are free to plug in your own peripherals or use our tournament-grade optical equipment.
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="font-gaming text-cyan-300 font-bold text-[12px]">How does session billing work?</h4>
            <p className="text-slate-400 leading-relaxed">
              Sessions are calculated proportionally to the exact minutes you play. Active members automatically receive discounts (5% to 25% off) directly on their bill.
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="font-gaming text-cyan-300 font-bold text-[12px]">Can I sign in to my personal Steam or Riot accounts?</h4>
            <p className="text-slate-400 leading-relaxed">
              Yes. All stations run deep-freeze security wipes upon session completion, ensuring all user credentials and private files are safely wiped.
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="font-gaming text-cyan-300 font-bold text-[12px]">Do you serve food and beverages?</h4>
            <p className="text-slate-400 leading-relaxed">
              Yes! We offer a full café menu featuring cold brew nitro, artisan toasted sandwiches, energy drinks, and snacks that can be ordered right to your station.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
