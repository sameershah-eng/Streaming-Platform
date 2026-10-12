import React from 'react';
import {
  Wallet,
  Video,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  CreditCard,
  Plus,
  Sparkles,
  CheckCircle2,
  Calendar,
  Radio,
} from 'lucide-react';
import { UserProfile, ConsultationOffering, OrderRecord, LedgerEntry } from '../../types';

interface DashboardProps {
  user: UserProfile;
  offerings: ConsultationOffering[];
  orders: OrderRecord[];
  ledger: LedgerEntry[];
  onStartSession: (offering: ConsultationOffering) => void;
  onOpenRecharge: () => void;
  onViewOrders: () => void;
  onViewBilling: () => void;
}

export const UserDashboard: React.FC<DashboardProps> = ({
  user,
  offerings,
  orders,
  ledger,
  onStartSession,
  onOpenRecharge,
  onViewOrders,
  onViewBilling,
}) => {
  const totalSpent = orders.reduce((sum, ord) => sum + ord.amountUsd, 0);
  const totalMinutes = orders.reduce((sum, ord) => sum + ord.durationMinutes, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700">
            <span>Client Workspace</span>
            <span aria-hidden="true">·</span>
            <span>Identity: {user.email}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Welcome back, {user.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            You have active streaming entitlements. Browse available architects or check your metered ledger activity.
          </p>
        </div>

        {/* Quick Action Button Group */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenRecharge}
            className="px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-600" />
            <span>Add Funds via Stripe</span>
          </button>

          <button
            onClick={() => onStartSession(offerings[0])}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors shadow-sm"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Instant Consultation</span>
          </button>
        </div>
      </div>

      {/* KPI & Balance Grid (Tabular Numerals) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Balance */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Available Balance</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            ${user.balanceUsd.toFixed(2)}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Auto-recharge enabled ($100.00)</span>
          </div>
        </div>

        {/* Card 2: Total Spent */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Historical Spend</span>
            <div className="p-2 rounded-lg bg-sky-50 text-sky-600">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            ${totalSpent.toFixed(2)}
          </p>
          <div className="text-[11px] text-slate-500">
            Across {orders.length} completed sessions
          </div>
        </div>

        {/* Card 3: Consultation Time */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Streaming Minutes</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {totalMinutes} min
          </p>
          <div className="text-[11px] text-slate-500">
            Average: {orders.length > 0 ? Math.round(totalMinutes / orders.length) : 0} min / session
          </div>
        </div>

        {/* Card 4: WebRTC Signaling Status */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Signaling Bridge</span>
            <div className="p-2 rounded-lg bg-violet-50 text-violet-600">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            Online
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>SFU Edge Relay Ready</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Sessions & Quick Connect */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Consultation Orders */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Completed Sessions</h2>
              <p className="text-xs text-slate-500">Historical records settled via Stripe Connect</p>
            </div>
            <button
              onClick={onViewOrders}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {orders.map((order) => (
              <div key={order.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={order.consultantAvatar}
                    alt={order.consultantName}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 leading-tight">
                      {order.consultantName}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate max-w-[200px] sm:max-w-xs mt-0.5">
                      {order.offeringTitle}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      <span>·</span>
                      <span className="font-mono">{order.durationMinutes} minutes</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-bold text-slate-900 font-mono tabular-nums">
                    ${order.amountUsd.toFixed(2)}
                  </p>
                  <span className="text-[10px] text-emerald-700 font-medium">Settled</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Recommended Specialist Fast-Connect */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Online Specialists</h2>
              <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Live Now
              </span>
            </div>

            <div className="space-y-3">
              {offerings.slice(0, 2).map((offering) => (
                <div
                  key={offering.id}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors flex items-center justify-between gap-3 bg-slate-50/50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={offering.consultantAvatar}
                      alt={offering.consultantName}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        {offering.consultantName}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">{offering.category}</p>
                      <p className="text-[11px] font-mono text-slate-700 tabular-nums font-semibold mt-0.5">
                        ${offering.ratePerMinuteUsd.toFixed(2)}/min
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onStartSession(offering)}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shrink-0 transition-colors"
                  >
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Need a custom appointment?</span>
            <button onClick={onViewOrders} className="text-indigo-600 font-semibold hover:underline">
              Schedule Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
