import React, { useState } from 'react';
import {
  Wallet,
  CreditCard,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  AlertCircle,
  Lock,
} from 'lucide-react';
import { UserProfile, LedgerEntry } from '../../types';

interface BillingViewProps {
  user: UserProfile;
  ledger: LedgerEntry[];
  onOpenRecharge: () => void;
  onUpdateAutoRecharge: (enabled: boolean, threshold: number, amount: number) => void;
}

export const BillingView: React.FC<BillingViewProps> = ({
  user,
  ledger,
  onOpenRecharge,
  onUpdateAutoRecharge,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [autoRechargeEnabled, setAutoRechargeEnabled] = useState(user.autoRechargeEnabled);
  const [threshold, setThreshold] = useState(user.autoRechargeThresholdUsd);
  const [rechargeAmt, setRechargeAmt] = useState(user.autoRechargeAmountUsd);
  const [showAutoConsentSaved, setShowAutoConsentSaved] = useState(false);

  const handleSaveAutoRecharge = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAutoRecharge(autoRechargeEnabled, threshold, rechargeAmt);
    setShowAutoConsentSaved(true);
    setTimeout(() => setShowAutoConsentSaved(false), 3000);
  };

  const filteredLedger = ledger.filter((entry) => {
    if (filterType === 'all') return true;
    if (filterType === 'recharge') return entry.type === 'account_recharge';
    if (filterType === 'charges') return entry.type === 'session_charge';
    return true;
  });

  const exportLedgerCsv = () => {
    const headers = ['ID', 'Date', 'Type', 'Description', 'Amount USD', 'Balance After USD', 'Status', 'Reference ID'];
    const rows = filteredLedger.map((e) => [
      e.id,
      e.createdAt,
      e.type,
      `"${e.description.replace(/"/g, '""')}"`,
      e.amountUsd.toFixed(2),
      e.balanceAfterUsd.toFixed(2),
      e.status,
      e.referenceId,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AuraStream_Ledger_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Billing &amp; Ledger Transparency
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Real-time metered streaming charges, double-entry ledger audits, and Stripe Connect payment workflows.
          </p>
        </div>

        <button
          onClick={onOpenRecharge}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Consultation Credits</span>
        </button>
      </div>

      {/* Top Cards: Balance & Saved Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balance Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Account Credit Balance
            </span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Wallet className="w-4 h-4" />
            </div>
          </div>

          <div>
            <p className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
              ${user.balanceUsd.toFixed(2)}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Available for real-time consultation streaming
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Auto-Recharge:</span>
            <span
              className={`font-semibold ${
                user.autoRechargeEnabled ? 'text-emerald-700' : 'text-slate-400'
              }`}
            >
              {user.autoRechargeEnabled ? 'Active (Auto-topup)' : 'Disabled'}
            </span>
          </div>
        </div>

        {/* Payment Methods Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Payment Methods (Stripe Vault)
            </span>
            <CreditCard className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-2">
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-5 rounded bg-slate-800 text-[10px] text-white flex items-center justify-center font-bold">
                  VISA
                </div>
                <div>
                  <p className="font-semibold text-slate-900">•••• 8891</p>
                  <p className="text-[10px] text-slate-400">Exp 08/29 · Default</p>
                </div>
              </div>
              <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                Verified
              </span>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-5 rounded bg-amber-600 text-[10px] text-white flex items-center justify-center font-bold">
                  MC
                </div>
                <div>
                  <p className="font-semibold text-slate-900">•••• 4242</p>
                  <p className="text-[10px] text-slate-400">Exp 11/28 · Secondary</p>
                </div>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Backup</span>
            </div>
          </div>
        </div>

        {/* Security & Escrow Guarantee */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-700 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Stripe Connect Escrow</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">Metered Ledger Protection</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Charges are strictly debited per recorded second of audio-video connection. Specialists receive automatic payouts via Stripe Connect express transfers once sessions terminate.
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 text-[11px] text-slate-500 flex items-center gap-1.5 font-mono">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Server-side secret verification only</span>
          </div>
        </div>
      </div>

      {/* Auto-Recharge Explicit Consent Setting Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Automatic Wallet Recharge Settings
            </h3>
            <p className="text-xs text-slate-500">
              Guarantees ongoing WebRTC video calls aren't abruptly terminated when balances run low.
            </p>
          </div>

          {showAutoConsentSaved && (
            <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-md flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Consent &amp; thresholds updated</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSaveAutoRecharge} className="space-y-5">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="autoRechargeCheck"
              checked={autoRechargeEnabled}
              onChange={(e) => setAutoRechargeEnabled(e.target.checked)}
              className="mt-1 h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
            />
            <label htmlFor="autoRechargeCheck" className="text-xs text-slate-700 leading-relaxed cursor-pointer">
              <span className="font-semibold text-slate-900 block">
                Enable authorized automatic recharge
              </span>
              I authorize AuraStream to automatically debit my saved Stripe payment method when my account balance falls below the specified threshold during active consultations.
            </label>
          </div>

          {autoRechargeEnabled && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600 font-medium">Recharge Trigger Threshold:</span>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">
                    ${threshold.toFixed(2)} USD
                  </span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="100"
                  step="5"
                  value={threshold}
                  onChange={(e) => setThreshold(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <p className="text-[11px] text-slate-400">
                  Top-up triggers when balance drops below this amount
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600 font-medium">Recharge Amount:</span>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">
                    ${rechargeAmt.toFixed(2)} USD
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="300"
                  step="25"
                  value={rechargeAmt}
                  onChange={(e) => setRechargeAmt(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <p className="text-[11px] text-slate-400">
                  Amount added per automatic transaction
                </p>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
          >
            Save Auto-Recharge Preferences
          </button>
        </form>
      </div>

      {/* Double-Entry Transaction Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Double-Entry Financial Ledger</h3>
            <p className="text-xs text-slate-500">
              Immutable log of every deposit, live consultation charge, and payout
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter buttons */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  filterType === 'all'
                    ? 'bg-white text-slate-900 font-medium shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('recharge')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  filterType === 'recharge'
                    ? 'bg-white text-slate-900 font-medium shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Recharges
              </button>
              <button
                onClick={() => setFilterType('charges')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  filterType === 'charges'
                    ? 'bg-white text-slate-900 font-medium shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Consultations
              </button>
            </div>

            <button
              onClick={exportLedgerCsv}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
              title="Download Ledger CSV"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-medium uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-6">Timestamp</th>
                <th className="py-3 px-6">Description</th>
                <th className="py-3 px-6">Type</th>
                <th className="py-3 px-6 text-right">Amount</th>
                <th className="py-3 px-6 text-right">Balance After</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Reference ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLedger.map((entry) => {
                const isPositive = entry.amountUsd > 0;
                return (
                  <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-6 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                      {new Date(entry.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-6 font-medium text-slate-900">
                      {entry.description}
                    </td>
                    <td className="py-3.5 px-6 whitespace-nowrap text-slate-500">
                      {entry.type === 'account_recharge' ? 'Recharge' : 'Session Debit'}
                    </td>
                    <td
                      className={`py-3.5 px-6 text-right font-mono font-bold whitespace-nowrap tabular-nums ${
                        isPositive ? 'text-emerald-600' : 'text-slate-900'
                      }`}
                    >
                      {isPositive ? `+$${entry.amountUsd.toFixed(2)}` : `-$${Math.abs(entry.amountUsd).toFixed(2)}`}
                    </td>
                    <td className="py-3.5 px-6 text-right font-mono text-slate-900 tabular-nums whitespace-nowrap">
                      ${entry.balanceAfterUsd.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-6 whitespace-nowrap">
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {entry.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 whitespace-nowrap font-mono text-[11px] text-slate-400">
                      {entry.referenceId}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
