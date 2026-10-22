import React from 'react';
import { PlaySquare, Terminal, Database, Bell } from 'lucide-react';
import { useArcadia } from '../context/ArcadiaContext';

interface HeaderProps {
  onOpenStartSession: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenStartSession }) => {
  const { activeView, setActiveView, sessions, payments, pcs } = useArcadia();

  const activeSessions = sessions.filter(s => s.status === 'Active');
  const availableRigs = pcs.filter(p => p.status === 'Available');
  const totalRevenue = payments
    .filter(p => p.payment_status === 'Completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const getPageTitle = () => {
    switch (activeView) {
      case 'dashboard': return 'Operations Dashboard';
      case 'customers': return 'Customer Directory & Profiles';
      case 'pcs': return 'Gaming Rig Fleet Manager';
      case 'sessions': return 'Live Playing Sessions & Billing';
      case 'memberships': return 'Membership Plans & Subscriptions';
      case 'payments': return 'Financial Receipts Ledger';
      case 'reports': return 'Café Analytics & Revenue';
      case 'settings': return 'Lounge Configuration & Settings';
      default: return 'Arcadia Management';
    }
  };

  return (
    <header className="h-16 bg-[#0c0e17]/90 backdrop-blur-md border-b border-cyan-500/20 px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="font-gaming text-sm md:text-base font-bold text-white tracking-wider flex items-center gap-2">
            <span className="text-cyan-400">/</span> {getPageTitle()}
          </h2>
          <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
            {activeSessions.length} active session{activeSessions.length !== 1 ? 's' : ''} • {availableRigs.length} rig{availableRigs.length !== 1 ? 's' : ''} available
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Total Revenue Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-mono text-xs">
          <span className="text-[10px] text-slate-400 uppercase font-gaming">Gross:</span>
          <span className="font-bold text-cyan-400">₹{totalRevenue.toFixed(2)}</span>
        </div>

        {/* Quick Launch Session Button */}
        <button
          onClick={onOpenStartSession}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-gaming font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:scale-105 active:scale-95"
        >
          <PlaySquare className="w-4 h-4 text-black" />
          <span>Launch Rig</span>
        </button>
      </div>
    </header>
  );
};
