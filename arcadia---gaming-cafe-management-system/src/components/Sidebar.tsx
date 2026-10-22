import React from 'react';
import {
  LayoutDashboard,
  Users,
  Monitor,
  PlaySquare,
  Award,
  CreditCard,
  BarChart3,
  Database,
  Settings,
  Gamepad2,
  Activity
} from 'lucide-react';
import { useArcadia, ActiveView } from '../context/ArcadiaContext';

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, sessions, pcs } = useArcadia();

  const activeSessionsCount = sessions.filter(s => s.status === 'Active').length;
  const availableRigsCount = pcs.filter(p => p.status === 'Available').length;

  const navItems: { id: ActiveView; label: string; icon: React.ReactNode; badge?: string | number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'customers', label: 'Customers', icon: <Users className="w-4 h-4" /> },
    { id: 'pcs', label: 'Gaming Fleet', icon: <Monitor className="w-4 h-4" />, badge: `${availableRigsCount} Avail`, badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' },
    { id: 'sessions', label: 'Live Sessions', icon: <PlaySquare className="w-4 h-4" />, badge: activeSessionsCount > 0 ? activeSessionsCount : undefined, badgeColor: 'bg-pink-500/20 text-pink-400 border-pink-500/40 animate-pulse' },
    { id: 'memberships', label: 'Memberships', icon: <Award className="w-4 h-4" /> },
    { id: 'payments', label: 'Transactions', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'reports', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-[#0d0f18] border-r border-cyan-500/20 flex flex-col flex-shrink-0 min-h-screen shadow-[4px_0_24px_rgba(0,0,0,0.8)] z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 via-purple-600 to-pink-500 p-[2px] shadow-[0_0_15px_rgba(0,240,255,0.4)]">
            <div className="w-full h-full bg-[#08090e] rounded-[6px] flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="font-gaming text-lg font-black tracking-wider bg-gradient-to-r from-white via-cyan-300 to-purple-400 bg-clip-text text-transparent">
              ARCADIA
            </h1>
            <p className="text-[10px] text-cyan-400/80 font-mono tracking-widest uppercase">Gaming Lounge Ops</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="p-3 flex-1 flex flex-col gap-1.5 overflow-y-auto">
        <div className="px-3 py-1 text-[10px] uppercase font-mono tracking-wider text-slate-500">Café Management</div>
        {navItems.map(item => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-md text-xs font-semibold tracking-wide transition-all duration-200 ${
                isActive
                  ? 'bg-cyan-500/10 text-white border-l-4 border-cyan-400 shadow-[inset_0_0_12px_rgba(0,240,255,0.15)] pl-2.5'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-cyan-400' : 'text-slate-400'}>{item.icon}</span>
                <span className="font-gaming text-[11px] tracking-wider">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded border font-mono ${item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* System Status Tray */}
      <div className="p-3.5 border-t border-white/5 bg-[#090b12]">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] text-slate-300 font-mono font-medium">Rig Network Online</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono font-semibold">100% HEALTH</span>
        </div>
        <div className="text-[10px] text-slate-500 flex items-center justify-between">
          <span>Active Rigs Available</span>
          <span className="text-cyan-400 font-mono font-bold">{availableRigsCount} / {pcs.length}</span>
        </div>
      </div>
    </aside>
  );
};
