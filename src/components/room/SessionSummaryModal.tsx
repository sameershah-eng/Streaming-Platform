import React from 'react';
import { CheckCircle2, Download, Clock, DollarSign, ArrowRight, FileText } from 'lucide-react';
import { ConsultationSession, OrderRecord } from '../../types';

interface SessionSummaryModalProps {
  session: ConsultationSession;
  order: OrderRecord;
  remainingBalance: number;
  onClose: () => void;
  onGoToOrders: () => void;
}

export const SessionSummaryModal: React.FC<SessionSummaryModalProps> = ({
  session,
  order,
  remainingBalance,
  onClose,
  onGoToOrders,
}) => {
  const m = Math.floor(session.durationSeconds / 60);
  const s = session.durationSeconds % 60;
  const timeFormatted = `${m}m ${s.toString().padStart(2, '0')}s`;

  const handleDownloadReceipt = () => {
    const content = `
AURASTREAM CONSULTATION RECEIPT & SUMMARY
------------------------------------------------
Order Reference: ${order.orderNumber}
Date: ${new Date().toLocaleString()}
Specialist: ${session.offering.consultantName}
Category: ${session.offering.category}

SESSION DURATION: ${timeFormatted} (${order.durationMinutes} billed min)
RATE: $${session.offering.ratePerMinuteUsd.toFixed(2)}/min
TOTAL CHARGED: $${order.amountUsd.toFixed(2)} USD
REMAINING BALANCE: $${remainingBalance.toFixed(2)} USD

SESSION NOTES:
${session.notes.map((n, i) => `${i + 1}. ${n}`).join('\n')}

Stripe Payment Intent ID: ${order.stripePaymentIntentId}
Secured under WebRTC DTLS-SRTP & PostgreSQL RLS
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${order.orderNumber}_summary.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-6 animate-in fade-in zoom-in-95">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Consultation Completed</h2>
          <p className="text-xs text-slate-500">
            Your real-time session has closed cleanly. The final amount was settled in your ledger.
          </p>
        </div>

        {/* Consultant & Order Details */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3.5">
          <img
            src={session.offering.consultantAvatar}
            alt={session.offering.consultantName}
            className="w-12 h-12 rounded-xl object-cover border border-slate-200"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-slate-900 text-sm truncate">
              {session.offering.consultantName}
            </h4>
            <p className="text-xs text-slate-500 truncate">{session.offering.title}</p>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5">{order.orderNumber}</p>
          </div>
        </div>

        {/* Financial and Duration Metrics */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Duration</span>
            <span className="font-mono font-bold text-slate-900 text-sm tabular-nums">
              {timeFormatted}
            </span>
          </div>

          <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
            <span className="text-[11px] text-indigo-700 block">Total Settled</span>
            <span className="font-mono font-bold text-indigo-900 text-sm tabular-nums">
              ${order.amountUsd.toFixed(2)}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 block">New Balance</span>
            <span className="font-mono font-bold text-slate-900 text-sm tabular-nums">
              ${remainingBalance.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Session Notes Preview */}
        {session.notes.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Session Notes ({session.notes.length})</span>
            </div>
            <div className="max-h-24 overflow-y-auto p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1">
              {session.notes.map((n, idx) => (
                <p key={idx}>• {n}</p>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadReceipt}
              className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Download Receipt</span>
            </button>

            <button
              onClick={onGoToOrders}
              className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>View in Orders</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
          >
            Done &amp; Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
