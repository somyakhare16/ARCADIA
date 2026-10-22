import React from 'react';
import { Gamepad2, Clock, MapPin, Phone, Mail } from 'lucide-react';
import { useArcadia, ActiveView } from '../context/ArcadiaContext';

export const CommercialFooter: React.FC = () => {
  const { settings, setActiveView } = useArcadia();

  const handleNav = (view: ActiveView) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-cyan-500/20 bg-[#07080d] text-slate-400 font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-cyan-400 via-purple-600 to-pink-500 p-[2px]">
                <div className="w-full h-full bg-[#08090e] rounded-[4px] flex items-center justify-center">
                  <Gamepad2 className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="font-gaming text-lg font-black tracking-wider text-white">ARCADIA</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Downtown premier competitive esports lounge and gaming café. High-refresh OLED battle stations, fiber networks, and community tournaments.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-gaming text-xs font-bold text-white uppercase tracking-wider">
              Lounge Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-cyan-400 transition-colors">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('games')} className="hover:text-cyan-400 transition-colors">
                  Featured Games Library
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('pcs')} className="hover:text-cyan-400 transition-colors">
                  Gaming PCs & Reservations
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('memberships')} className="hover:text-cyan-400 transition-colors">
                  Membership Tiers & Perks
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-cyan-400 transition-colors">
                  About Our Facility
                </button>
              </li>
            </ul>
          </div>

          {/* Hours & Schedule */}
          <div className="space-y-3">
            <h4 className="font-gaming text-xs font-bold text-white uppercase tracking-wider">
              Hours of Operation
            </h4>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Mon – Thu:</span>
                <span className="text-white">10:00 AM – Midnight</span>
              </div>
              <div className="flex justify-between">
                <span>Fri – Sun:</span>
                <span className="text-white">10:00 AM – 3:00 AM</span>
              </div>
            </div>
            <p className="text-[11px] text-cyan-400/80 pt-1">Walk-in gaming stations available daily.</p>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="font-gaming text-xs font-bold text-white uppercase tracking-wider">
              Café Information
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{settings.contact_phone || '+91 98765 43210'}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>{settings.contact_email || 'ops@arcadiaesports.com'}</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                <span>{settings.address || 'Downtown Tech & Gaming District'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-500">
            &copy; {new Date().getFullYear()} {settings.cafe_name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => handleNav('contact')} className="hover:text-white transition-colors">
              Terms of Play
            </button>
            <span aria-hidden="true">&middot;</span>
            <button onClick={() => handleNav('contact')} className="hover:text-white transition-colors">
              Privacy Policy
            </button>
            <span aria-hidden="true">&middot;</span>
            <button onClick={() => handleNav('dashboard')} className="hover:text-cyan-400 transition-colors">
              Staff Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
