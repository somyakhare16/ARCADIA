import React, { useState } from 'react';
import { Gamepad2, Menu, X, LayoutDashboard, Monitor } from 'lucide-react';
import { useArcadia, ActiveView } from '../context/ArcadiaContext';

interface CommercialNavbarProps {
  onOpenBooking: () => void;
  onOpenPortal?: () => void;
}

export const CommercialNavbar: React.FC<CommercialNavbarProps> = ({ onOpenBooking, onOpenPortal }) => {
  const { activeView, setActiveView, pcs, sessions } = useArcadia();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const availableCount = pcs.filter(p => p.status === 'Available').length;
  const activeSessionsCount = sessions.filter(s => s.status === 'Active').length;

  const navLinks: { id: ActiveView; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'games', label: 'Games' },
    { id: 'pcs', label: 'Gaming PCs' },
    { id: 'memberships', label: 'Memberships' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (view: ActiveView) => {
    setActiveView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#08090e]/95 backdrop-blur-md border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group whitespace-nowrap shrink-0 focus:outline-none"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 via-purple-600 to-pink-500 p-[2px] shadow-[0_0_20px_rgba(0,240,255,0.4)] group-hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] transition-all">
              <div className="w-full h-full bg-[#08090e] rounded-[6px] flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="font-gaming text-xl font-black tracking-wider text-white group-hover:text-cyan-300 transition-colors">
                ARCADIA
              </span>
              <span className="block text-[10px] text-slate-400 font-mono tracking-widest uppercase">
                Gaming Café & Lounge
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-gaming tracking-wide">
            {navLinks.map(link => {
              const isActive = activeView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                    isActive
                      ? 'text-cyan-400 border-b-2 border-cyan-400 font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            {/* Player Portal / My Account */}
            {onOpenPortal && (
              <button
                onClick={onOpenPortal}
                className="flex items-center gap-1.5 px-3 py-2 rounded text-xs font-mono transition-all border bg-[#0e111d] border-cyan-500/30 text-cyan-300 hover:bg-cyan-950/40 hover:border-cyan-400"
                title="View your member pass, bookings, and receipts"
              >
                <span className="font-gaming text-[11px] whitespace-nowrap">Player Portal</span>
              </button>
            )}

            {/* Lounge Operations / Management Portal button */}
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded text-xs font-mono transition-all border ${
                activeView === 'dashboard' || activeView === 'customers' || activeView === 'sessions' || activeView === 'payments' || activeView === 'settings'
                  ? 'bg-purple-900/40 text-purple-200 border-purple-500/60 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                  : 'bg-[#121524] text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
              title="Open Café Management Dashboard"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-purple-400" />
              <span className="font-gaming text-[11px] whitespace-nowrap">Café Dashboard</span>
              {activeSessionsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded bg-pink-500/20 text-pink-400 border border-pink-500/30 text-[10px]">
                  {activeSessionsCount}
                </span>
              )}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenBooking}
              className="px-4 py-2 rounded bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-gaming font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              Reserve Station
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            {onOpenPortal && (
              <button
                onClick={onOpenPortal}
                className="px-2.5 py-1.5 rounded bg-purple-900/50 text-purple-200 border border-purple-500/40 font-gaming text-[11px] uppercase"
              >
                Pass
              </button>
            )}
            <button
              onClick={onOpenBooking}
              className="px-3 py-1.5 rounded bg-cyan-400 text-black font-gaming font-bold text-xs uppercase"
            >
              Book
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#090b14] px-4 py-4 space-y-2">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`w-full text-left px-3 py-2.5 rounded font-gaming text-sm ${
                activeView === link.id ? 'bg-cyan-500/10 text-cyan-400 font-bold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('dashboard')}
              className="w-full text-left px-3 py-2.5 rounded font-gaming text-sm bg-purple-900/30 text-purple-300 border border-purple-500/30 flex items-center justify-between"
            >
              <span>Café Management Dashboard</span>
              {activeSessionsCount > 0 && (
                <span className="text-xs px-2 py-0.5 rounded bg-pink-500/20 text-pink-300">
                  {activeSessionsCount} in session
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
