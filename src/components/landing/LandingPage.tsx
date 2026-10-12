import React from 'react';
import { ArrowRight, Video, ShieldCheck, Zap, Lock, CreditCard, ChevronRight, Mic, Volume2 } from 'lucide-react';
import { ConsultationOffering } from '../../types';

interface LandingPageProps {
  offerings: ConsultationOffering[];
  onSelectOffering: (offering: ConsultationOffering) => void;
  onExplore: () => void;
  onStartInstantSession: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  offerings,
  onSelectOffering,
  onExplore,
  onStartInstantSession,
}) => {
  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 lg:pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-700 bg-indigo-50/70 border border-indigo-100 rounded-md px-3 py-1">
              <span>Next-Gen WebRTC Media Infrastructure</span>
              <span aria-hidden="true">·</span>
              <span>Sub-100ms Latency</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold text-slate-900 tracking-tight leading-[1.15] text-balance">
              High-Fidelity Real-Time Consultations &amp; Conversational Streaming.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              Connect directly with verified domain specialists over bidirectional audio-video streams.
              Enjoy transparent per-minute billing, cryptographic WebRTC transport, and zero setup friction.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onStartInstantSession}
                className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow-md flex items-center gap-2 group"
              >
                <span>Launch Live Session</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onExplore}
                className="px-6 py-3.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl font-semibold text-sm transition-colors shadow-sm"
              >
                Explore Specialists
              </button>
            </div>

            {/* Architectural Trust Points */}
            <div className="pt-6 border-t border-slate-100 grid grid-cols-3 gap-4 text-xs">
              <div>
                <p className="font-bold text-slate-900 font-mono text-base tabular-nums">&lt; 85ms</p>
                <p className="text-slate-500">Global signaling RTT</p>
              </div>
              <div>
                <p className="font-bold text-slate-900 font-mono text-base tabular-nums">Per-Second</p>
                <p className="text-slate-500">Metered ledger billing</p>
              </div>
              <div>
                <p className="font-bold text-slate-900 font-mono text-base tabular-nums">100% RLS</p>
                <p className="text-slate-500">PostgreSQL data isolation</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual & Interactive Live Preview Card */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-xl bg-slate-900 group">
              <img
                src="/src/assets/images/hero_streaming_consultation_1791836381252.jpg"
                alt="High-end consultation studio"
                className="w-full h-[400px] object-cover opacity-90 transition-transform duration-500 group-hover:scale-102"
                referrerPolicy="no-referrer"
              />

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent pointer-events-none" />

              {/* Live Status Overlay Card */}
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-white/20 shadow-lg text-slate-900">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-900 tracking-wide uppercase">
                      Live Stream Active
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-600 font-mono">1080p60 · 2.8 Mbps</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    <span>Rate: $4.67/min</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center font-bold text-slate-700 text-[10px]">
                      ER
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 leading-none">Dr. Elena Rostova</p>
                      <p className="text-[11px] text-slate-500">Audio input: Active (32dB)</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5 h-4">
                      <span className="w-1 h-3 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1 h-4 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">Audio Synced</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Highlights Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Engineered for Mission-Critical Consultations
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Every layer from signaling to billing enforces cryptographic integrity and real-time reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: WebRTC Streaming */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 transition-shadow hover:shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">
              Dedicated WebRTC SFU Signaling
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Direct peer and selective forwarding unit routing ensures low latency and jitter buffers, supporting real-time speech and interactive debugging.
            </p>
            <div className="pt-2 text-xs font-mono text-indigo-600 font-medium">
              DTLS-SRTP Encryption
            </div>
          </div>

          {/* Card 2: Stripe Connect */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 transition-shadow hover:shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">
              Stripe Connect &amp; Ledger Transparency
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every second of streaming is metered into a double-entry ledger. Automatic wallet recharges protect ongoing calls without mid-session interruption.
            </p>
            <div className="pt-2 text-xs font-mono text-sky-600 font-medium">
              Verified Webhook Idempotency
            </div>
          </div>

          {/* Card 3: Supabase Security */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 transition-shadow hover:shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">
              PostgreSQL Row Level Security
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Strict database isolation policies restrict session data, billing records, and personal identifiers exclusively to authorized user identities.
            </p>
            <div className="pt-2 text-xs font-mono text-emerald-600 font-medium">
              Zero Unauthorized Cross-Reads
            </div>
          </div>
        </div>
      </section>

      {/* Featured Offerings Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Featured Consultation Offerings
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Select an architect to inspect technical specialties and initiate a live video consultation.
            </p>
          </div>
          <button
            onClick={onExplore}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
          >
            <span>View All ({offerings.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offerings.slice(0, 3).map((offering) => (
            <div
              key={offering.id}
              className="rounded-2xl bg-white border border-slate-200 overflow-hidden hover:border-slate-300 transition-all hover:shadow-md flex flex-col justify-between"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <img
                    src={offering.consultantAvatar}
                    alt={offering.consultantName}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm leading-tight">
                      {offering.consultantName}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {offering.consultantTitle}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                      <span className="font-semibold text-amber-600">★ {offering.rating}</span>
                      <span>·</span>
                      <span>{offering.reviewsCount} sessions</span>
                      <span>·</span>
                      <span className="text-emerald-700 font-medium">{offering.availability}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 text-sm line-clamp-2">
                    {offering.title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-3 mt-1.5 leading-relaxed">
                    {offering.bio}
                  </p>
                </div>

                {/* Clean unboxed tags with separator */}
                <div className="text-[11px] text-slate-500 flex flex-wrap gap-x-2 gap-y-1">
                  {offering.tags.map((tag, idx) => (
                    <span key={tag}>
                      {tag}
                      {idx < offering.tags.length - 1 && <span className="ml-2 text-slate-300">·</span>}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">Session Rate</p>
                  <p className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                    ${offering.ratePerMinuteUsd.toFixed(2)}/min
                    <span className="text-xs font-normal text-slate-500 ml-1">
                      (${offering.hourlyRateUsd}/hr)
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => onSelectOffering(offering)}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Start Consultation
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
