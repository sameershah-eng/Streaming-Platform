import React, { useState } from 'react';
import { Search, Filter, Eye, Download, FileText, CheckCircle2, Clock, X, ExternalLink } from 'lucide-react';
import { OrderRecord } from '../../types';

interface OrdersHistoryProps {
  orders: OrderRecord[];
}

export const OrdersHistory: React.FC<OrdersHistoryProps> = ({ orders }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.consultantName.toLowerCase().includes(search.toLowerCase()) ||
      order.offeringTitle.toLowerCase().includes(search.toLowerCase()) ||
      order.stripePaymentIntentId.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleDownloadReceipt = (order: OrderRecord) => {
    const content = `
RECEIPT & AUDIT INVOICE - AURASTREAM
--------------------------------------------------
Order Reference: ${order.orderNumber}
Date: ${new Date(order.createdAt).toLocaleString()}
Client: Sameer Patel (sameerupwork25@gmail.com)
Consultant: ${order.consultantName}
Session: ${order.offeringTitle}

DURATION: ${order.durationMinutes} minutes
TOTAL CHARGED: $${order.amountUsd.toFixed(2)} USD
STATUS: ${order.status.toUpperCase()}
PAYMENT INTENT: ${order.stripePaymentIntentId}

Processor: Stripe Connect Platform
Encryption: WebRTC DTLS-SRTP Audio/Video Stream
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Receipt_${order.orderNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Session &amp; Order History
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Review past video consultations, metered durations, Stripe payment references, and audit receipts.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Status filters */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs">
          {['all', 'completed', 'in_progress', 'refunded'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-md transition-colors capitalize ${
                statusFilter === status
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, consultant, or title..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-medium uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-6">Order Reference</th>
                  <th className="py-3 px-6">Consultant &amp; Offering</th>
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-6">Duration</th>
                  <th className="py-3 px-6 text-right">Amount Charged</th>
                  <th className="py-3 px-6">Payment Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 whitespace-nowrap font-mono font-semibold text-slate-900">
                      {order.orderNumber}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={order.consultantAvatar}
                          alt={order.consultantName}
                          className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-semibold text-slate-900 leading-tight">
                            {order.consultantName}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate max-w-xs mt-0.5">
                            {order.offeringTitle}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-slate-500 text-[11px]">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap font-mono text-slate-700 tabular-nums">
                      {order.durationMinutes} min
                    </td>
                    <td className="py-4 px-6 text-right font-mono font-bold text-slate-900 tabular-nums whitespace-nowrap">
                      ${order.amountUsd.toFixed(2)} USD
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded capitalize">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                          title="View Order Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDownloadReceipt(order)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                          title="Download Receipt"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 text-xs">
            No orders match the current filter criteria.
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-mono text-slate-400">Order Record</span>
                <h3 className="text-lg font-bold text-slate-900">{selectedOrder.orderNumber}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3.5">
                <img
                  src={selectedOrder.consultantAvatar}
                  alt={selectedOrder.consultantName}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">{selectedOrder.consultantName}</h4>
                  <p className="text-slate-500 mt-0.5">{selectedOrder.offeringTitle}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Billed Streaming Duration</span>
                  <p className="font-mono font-bold text-slate-900 text-sm mt-0.5 tabular-nums">
                    {selectedOrder.durationMinutes} minutes
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Settlement Amount</span>
                  <p className="font-mono font-bold text-indigo-900 text-sm mt-0.5 tabular-nums">
                    ${selectedOrder.amountUsd.toFixed(2)} USD
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Stripe PaymentIntent:</span>
                  <span className="text-slate-900">{selectedOrder.stripePaymentIntentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Status:</span>
                  <span className="text-emerald-700 font-semibold capitalize">{selectedOrder.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Ledger Classification:</span>
                  <span className="text-slate-700">Client Debit / Escrow Settled</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => handleDownloadReceipt(selectedOrder)}
                className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Audit Receipt</span>
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
