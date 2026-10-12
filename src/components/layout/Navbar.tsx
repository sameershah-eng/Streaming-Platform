import React from 'react';
import { Video, ShieldCheck, Wallet, User, LogOut, Sparkles, SlidersHorizontal } from 'lucide-react';
import { UserProfile } from '../../types';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  user: UserProfile;
  onOpenAuth: () => void;
  onOpenRecharge: () => void;
  isRoomActive: boolean;
  onReturnToRoom?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  user,
  onOpenAuth,
  onOpenRecharge,
  isRoomActive,
  onReturnToRoom,
}) => {
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

  const navLinks = [
    { id: 'marketplace', label: 'Consultations' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'billing', label: 'Billing & Ledger' },
    { id: 'orders', label: 'Orders' },
    { id: 'operations', label: 'Operations' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectTab('landing')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 block leading-tight">
                AuraStream
              </span>
              <span className="text-[11px] text-slate-500 font-medium block">
                Real-Time Consultations
              </span>
            </div>
          </button>

          {isRoomActive && onReturnToRoom && (
            <button
              onClick={onReturnToRoom}
              className="ml-2 px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md hover:bg-emerald-100 transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Room In Progress
            </button>
          )}
        </div>

        {/* Zone 2: Navigation Links (single-line, clean typography) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onSelectTab(link.id)}
                className={`transition-colors whitespace-nowrap py-1 relative ${
                  isActive
                    ? 'text-indigo-600 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Account & Primary CTA */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Balance display pill button */}
          <button
            onClick={onOpenRecharge}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-colors text-xs font-medium text-slate-700"
            title="Click to add funds via Stripe"
          >
            <Wallet className="w-3.5 h-3.5 text-indigo-600" />
            <span>Balance:</span>
            <span className="font-mono font-semibold text-slate-900 tabular-nums">
              ${user.balanceUsd.toFixed(2)}
            </span>
          </button>

          {/* User Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors text-xs font-medium text-slate-800 bg-white"
            >
              <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center text-slate-700 text-[11px] font-bold">
                {user.name.charAt(0)}
              </div>
              <span className="hidden sm:inline max-w-[110px] truncate">{user.name}</span>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-200 shadow-lg py-1.5 text-xs text-slate-700 z-50">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="font-semibold text-slate-900 truncate">{user.name}</p>
                  <p className="text-slate-500 text-[11px] truncate">{user.email}</p>
                  <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-500">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Role: {user.role}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    onSelectTab('account');
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                  Account & Device Settings
                </button>

                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    onOpenRecharge();
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                >
                  <Wallet className="w-3.5 h-3.5 text-slate-400" />
                  Billing & Stripe Recharge
                </button>

                <div className="border-t border-slate-100 my-1"></div>

                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-rose-600 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Switch Account / Demo Sign In
                </button>
              </div>
            )}
          </div>

          {/* Primary CTA */}
          <button
            onClick={() => onSelectTab('marketplace')}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Explore Consultations</span>
          </button>
        </div>
      </div>
    </header>
  );
};
