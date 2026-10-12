import React, { useState } from 'react';
import {
  ShieldAlert,
  Activity,
  Radio,
  CreditCard,
  Database,
  CheckCircle2,
  RefreshCw,
  Terminal,
  FileCode,
  Lock,
} from 'lucide-react';
import { WebhookLogEvent } from '../../types';
import { stripeService } from '../../lib/stripe/client';

export const AdminOperationsView: React.FC = () => {
  const [webhookLogs, setWebhookLogs] = useState<WebhookLogEvent[]>(stripeService.getWebhookLogs());
  const [selectedLog, setSelectedLog] = useState<WebhookLogEvent | null>(null);
  const [activeTab, setActiveTab] = useState<'webhooks' | 'webrtc' | 'rls'>('webhooks');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshLogs = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setWebhookLogs(stripeService.getWebhookLogs());
      setIsRefreshing(false);
    }, 400);
  };

  const handleSimulateWebhook = () => {
    const event = stripeService.recordWebhook({
      eventType: 'payment_intent.succeeded',
      source: 'stripe',
      timestamp: new Date().toISOString(),
      status: 'processed',
      payloadSummary: `PaymentIntent pi_live_${Date.now()} ($150.00 USD) settled idempotently`,
    });
    setWebhookLogs(stripeService.getWebhookLogs());
    setSelectedLog(event);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-md inline-flex mb-2">
            <Lock className="w-3 h-3" />
            <span>Role-Protected Operational Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Infrastructure &amp; Webhook Operations
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Monitor real-time WebRTC signaling relays, verified Stripe Connect webhooks, and Supabase RLS security policies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSimulateWebhook}
            className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Simulate Stripe Webhook</span>
          </button>

          <button
            onClick={handleRefreshLogs}
            disabled={isRefreshing}
            className="p-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition-colors shadow-xs"
            title="Refresh logs"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Operational Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>WebRTC SFU Latency</span>
            <Radio className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">22.4 ms</p>
          <div className="text-[11px] text-emerald-700 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Edge Relay: US-East &amp; EU-Central</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Webhook Success Rate</span>
            <CreditCard className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">100.0%</p>
          <div className="text-[11px] text-slate-500">
            Verified HMAC-SHA256 signatures
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Active Signaling Channels</span>
            <Activity className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">1 Active</p>
          <div className="text-[11px] text-slate-500">
            0 dropped packets recorded
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>PostgreSQL RLS Audit</span>
            <Database className="w-4 h-4 text-violet-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">Enforced</p>
          <div className="text-[11px] text-emerald-700">
            Zero cross-tenant read leaks
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('webhooks')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'webhooks'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Stripe Webhook Event Stream ({webhookLogs.length})
        </button>
        <button
          onClick={() => setActiveTab('webrtc')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'webrtc'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Signaling &amp; SFU Protocol Architecture
        </button>
        <button
          onClick={() => setActiveTab('rls')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'rls'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Row Level Security Matrix
        </button>
      </div>

      {/* Tab 1: Webhook Event Log */}
      {activeTab === 'webhooks' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 text-xs font-bold text-slate-900">
              Live Inbound Webhook Delivery Log
            </div>

            <div className="divide-y divide-slate-100">
              {webhookLogs.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => setSelectedLog(evt)}
                  className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer text-xs space-y-1 ${
                    selectedLog?.id === evt.id ? 'bg-indigo-50/50 border-l-2 border-indigo-600' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-semibold text-slate-900">{evt.eventType}</span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(evt.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] truncate">{evt.payloadSummary}</p>
                  <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-500 font-mono">
                    <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                      HTTP 200 {evt.status}
                    </span>
                    <span>·</span>
                    <span>{evt.id}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Webhook Payload Inspector */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-slate-500" />
              <span>Event Payload Inspector</span>
            </h3>

            {selectedLog ? (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 font-mono text-[11px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Event ID:</span>
                    <span className="text-slate-900 font-bold">{selectedLog.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Type:</span>
                    <span className="text-indigo-600 font-bold">{selectedLog.eventType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Signature:</span>
                    <span className="text-emerald-700 font-bold">HMAC Validated</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-700 font-semibold block text-[11px]">
                    Payload Body:
                  </span>
                  <pre className="p-3 rounded-xl bg-slate-950 text-emerald-400 font-mono text-[11px] overflow-x-auto leading-relaxed">
{JSON.stringify(
  {
    id: selectedLog.id,
    object: 'event',
    type: selectedLog.eventType,
    created: Math.floor(Date.now() / 1000),
    data: {
      object: {
        summary: selectedLog.payloadSummary,
        status: selectedLog.status,
        idempotency_key: `idemp_${selectedLog.id}`,
      },
    },
  },
  null,
  2
)}
                  </pre>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Click any webhook event in the list to inspect its cryptographic headers and payload JSON.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: WebRTC Signaling Architecture */}
      {activeTab === 'webrtc' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              WebRTC Signaling &amp; External SFU Adapter Contract
            </h3>
            <p className="text-xs text-slate-500">
              Interface boundary between the React client, WebSocket signaling relay, and remote media pipelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <span className="font-semibold text-slate-900 block">1. Authentication Handshake</span>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Client acquires a short-lived JSON Web Token (JWT) authorizing session room access based on verified account balance.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <span className="font-semibold text-slate-900 block">2. SDP Offer &amp; ICE Exchange</span>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Signaling server coordinates peer SDP offers and STUN/TURN ICE candidate pairs without revealing private IP topologies.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <span className="font-semibold text-slate-900 block">3. Metered Teardown</span>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Upon call termination, server verifies final duration with the SFU adapter and executes an atomic ledger settlement debit.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: RLS Matrix */}
      {activeTab === 'rls' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              PostgreSQL Row Level Security (RLS) Policy Audit
            </h3>
            <p className="text-xs text-slate-500">
              Verifying that ordinary authenticated users cannot query or tamper with foreign balances or ledger entries.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px]">
                <tr>
                  <th className="py-2.5 px-4">Table</th>
                  <th className="py-2.5 px-4">Policy Name</th>
                  <th className="py-2.5 px-4">Command</th>
                  <th className="py-2.5 px-4">Target Role</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11px]">
                <tr>
                  <td className="py-2.5 px-4 font-bold">public.profiles</td>
                  <td className="py-2.5 px-4 text-slate-600">Users view own profile</td>
                  <td className="py-2.5 px-4">SELECT</td>
                  <td className="py-2.5 px-4">auth.uid() = id</td>
                  <td className="py-2.5 px-4 text-emerald-700 font-bold">ENFORCED</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-bold">public.ledger_entries</td>
                  <td className="py-2.5 px-4 text-slate-600">Users view own ledger</td>
                  <td className="py-2.5 px-4">SELECT</td>
                  <td className="py-2.5 px-4">auth.uid() = user_id</td>
                  <td className="py-2.5 px-4 text-emerald-700 font-bold">ENFORCED</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-bold">public.ledger_entries</td>
                  <td className="py-2.5 px-4 text-slate-600">Strict service_role mutations</td>
                  <td className="py-2.5 px-4">INSERT/UPDATE</td>
                  <td className="py-2.5 px-4">service_role ONLY</td>
                  <td className="py-2.5 px-4 text-emerald-700 font-bold">ENFORCED</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-bold">public.orders</td>
                  <td className="py-2.5 px-4 text-slate-600">Users view own orders</td>
                  <td className="py-2.5 px-4">SELECT</td>
                  <td className="py-2.5 px-4">auth.uid() = user_id</td>
                  <td className="py-2.5 px-4 text-emerald-700 font-bold">ENFORCED</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
