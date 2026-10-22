import React, { useState } from 'react';
import { ArcadiaProvider, useArcadia, ActiveView } from './context/ArcadiaContext';
import { CommercialNavbar } from './components/CommercialNavbar';
import { CommercialFooter } from './components/CommercialFooter';
import { HomeView } from './components/HomeView';
import { GamesView } from './components/GamesView';
import { AboutView } from './components/AboutView';
import { ContactView } from './components/ContactView';
import { DashboardView } from './components/DashboardView';
import { CustomersView } from './components/CustomersView';
import { PcsView } from './components/PcsView';
import { SessionsView } from './components/SessionsView';
import { MembershipsView } from './components/MembershipsView';
import { PaymentsView } from './components/PaymentsView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { StartSessionModal } from './components/StartSessionModal';
import { EndSessionModal } from './components/EndSessionModal';
import { ReceiptModal } from './components/ReceiptModal';
import { CustomerPortalModal } from './components/CustomerPortalModal';
import { NotificationToast } from './components/NotificationToast';
import {
  LayoutDashboard,
  Users,
  Monitor,
  PlaySquare,
  Award,
  CreditCard,
  BarChart3,
  Settings,
  ArrowLeft
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeView, setActiveView, sessions, pcs } = useArcadia();
  const [startSessionOpen, setStartSessionOpen] = useState(false);
  const [endSessionId, setEndSessionId] = useState<number | null>(null);
  const [preselectedPcId, setPreselectedPcId] = useState<number | undefined>(undefined);
  const [customerPortalOpen, setCustomerPortalOpen] = useState(false);

  const handleOpenStart = (pcId?: number) => {
    setPreselectedPcId(pcId);
    setStartSessionOpen(true);
  };

  const handleOpenEnd = (sessionId: number) => {
    setEndSessionId(sessionId);
  };

  // Determine if active view is an operational management screen
  const isManagementView = [
    'dashboard',
    'customers',
    'sessions',
    'payments',
    'reports',
    'settings'
  ].includes(activeView);

  const managementNav: { id: ActiveView; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
    { id: 'customers', label: 'Customers', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'sessions', label: 'Live Sessions', icon: <PlaySquare className="w-3.5 h-3.5" /> },
    { id: 'pcs', label: 'Hardware Fleet', icon: <Monitor className="w-3.5 h-3.5" /> },
    { id: 'payments', label: 'Receipts Ledger', icon: <CreditCard className="w-3.5 h-3.5" /> },
    { id: 'reports', label: 'Financial Audit', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: 'settings', label: 'Lounge Settings', icon: <Settings className="w-3.5 h-3.5" /> },
  ];

  const activeSessionsCount = sessions.filter(s => s.status === 'Active').length;
  const availableRigsCount = pcs.filter(p => p.status === 'Available').length;

  return (
    <div className="min-h-screen bg-[#08090e] text-[#f1f5f9] flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Commercial Navigation Bar */}
      <CommercialNavbar
        onOpenBooking={() => handleOpenStart()}
        onOpenPortal={() => setCustomerPortalOpen(true)}
      />

      {/* Staff / Café Operations Sub-Header when inside management views */}
      {isManagementView && (
        <div className="bg-[#0c0e18] border-b border-purple-500/30 sticky top-20 z-30 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveView('home')}
                className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Storefront</span>
              </button>
              <span className="text-slate-600">|</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-gaming text-xs font-bold text-white uppercase tracking-wider">
                  Café Operations Terminal
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/40 text-purple-300 hidden md:inline">
                  {activeSessionsCount} Active • {availableRigsCount} Rigs Avail
                </span>
              </div>
            </div>

            {/* Management Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs font-gaming">
              {managementNav.map(tab => {
                const isActive = activeView === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveView(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all whitespace-nowrap text-[11px] ${
                      isActive
                        ? 'bg-purple-600 text-white font-bold shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeView === 'home' && (
          <HomeView
            onOpenBooking={pcId => handleOpenStart(pcId)}
          />
        )}

        {activeView === 'games' && (
          <GamesView
            onOpenBooking={() => handleOpenStart()}
          />
        )}

        {activeView === 'about' && (
          <AboutView
            onOpenBooking={() => handleOpenStart()}
          />
        )}

        {activeView === 'contact' && <ContactView />}

        {activeView === 'pcs' && (
          <div>
            <div className="mb-6">
              <h2 className="font-gaming text-2xl font-bold text-white tracking-wider">
                BATTLE STATION FLEET & RIG STATUS
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Explore our tournament-grade rigs, hardware specs, live availability, and reserve your station
              </p>
            </div>
            <PcsView onOpenStartSessionForPc={pcId => handleOpenStart(pcId)} />
          </div>
        )}

        {activeView === 'memberships' && (
          <div>
            <div className="mb-6">
              <h2 className="font-gaming text-2xl font-bold text-white tracking-wider">
                MEMBERSHIP PLANS & VIP PASSES
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Unlock exclusive hourly discounts, tournament scrim priority, and premium player lounge benefits
              </p>
            </div>
            <MembershipsView />
          </div>
        )}

        {activeView === 'dashboard' && (
          <DashboardView
            onOpenStartSession={() => handleOpenStart()}
            onOpenEndSession={handleOpenEnd}
          />
        )}

        {activeView === 'customers' && <CustomersView />}

        {activeView === 'sessions' && (
          <SessionsView
            onOpenStartSession={() => handleOpenStart()}
            onOpenEndSession={handleOpenEnd}
          />
        )}

        {activeView === 'payments' && <PaymentsView />}

        {activeView === 'reports' && <ReportsView />}

        {activeView === 'settings' && <SettingsView />}
      </main>

      {/* Commercial Business Footer */}
      <CommercialFooter />

      {/* Interactive Modals */}
      <StartSessionModal
        isOpen={startSessionOpen}
        onClose={() => {
          setStartSessionOpen(false);
          setPreselectedPcId(undefined);
        }}
        preselectedPcId={preselectedPcId}
      />

      <EndSessionModal
        sessionId={endSessionId}
        onClose={() => setEndSessionId(null)}
      />

      <ReceiptModal />

      <CustomerPortalModal
        isOpen={customerPortalOpen}
        onClose={() => setCustomerPortalOpen(false)}
        onOpenBooking={() => {
          setCustomerPortalOpen(false);
          handleOpenStart();
        }}
      />

      <NotificationToast />
    </div>
  );
};

export default function App() {
  return (
    <ArcadiaProvider>
      <MainLayout />
    </ArcadiaProvider>
  );
}
