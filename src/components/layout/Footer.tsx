import React from 'react';
import { Video, ShieldCheck, Database, CreditCard, Radio } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="border-t border-slate-200 bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Video className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 text-base">AuraStream</span>
              <span className="text-xs text-slate-500 font-mono">v1.2 MVP</span>
            </div>
            <p className="text-xs text-slate-500 max-w-md leading-relaxed">
              Real-time conversational streaming and video consultation platform. Built with WebRTC media transport,
              PostgreSQL Row Level Security, and Stripe Connect escrow workflows.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
              <div className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-indigo-600" />
                <span>WebRTC SFU Ready</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-sky-600" />
                <span>Supabase PostgreSQL + RLS</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-slate-700" />
                <span>Stripe Connect Billing</span>
              </div>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button
                  onClick={() => onSelectTab('marketplace')}
                  className="hover:text-indigo-600 transition-colors"
                >
                  Consultation Marketplace
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('dashboard')}
                  className="hover:text-indigo-600 transition-colors"
                >
                  Executive Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('billing')}
                  className="hover:text-indigo-600 transition-colors"
                >
                  Ledger & Transactions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('orders')}
                  className="hover:text-indigo-600 transition-colors"
                >
                  Session History
                </button>
              </li>
            </ul>
          </div>

          {/* Architecture & Verification */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
              Architecture & QA
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button
                  onClick={() => onSelectTab('operations')}
                  className="hover:text-indigo-600 transition-colors flex items-center gap-1"
                >
                  <span>Operations Console</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('account')}
                  className="hover:text-indigo-600 transition-colors"
                >
                  Audio/Video Hardware Test
                </button>
              </li>
              <li className="text-slate-400">
                <span>Migration: 001_initial_schema.sql</span>
              </li>
              <li className="flex items-center gap-1 text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Strict Client Data Masking</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© 2026 AuraStream Platform. Production MVP Architecture.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-500">Security: Encrypted WebRTC DTLS-SRTP</span>
            <span>·</span>
            <span className="text-slate-500">Idempotent Stripe Webhooks</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
