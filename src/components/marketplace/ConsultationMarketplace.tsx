import React, { useState } from 'react';
import { Search, Filter, Video, Clock, Star, Sparkles, X, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ConsultationOffering } from '../../types';

interface MarketplaceProps {
  offerings: ConsultationOffering[];
  onStartSession: (offering: ConsultationOffering) => void;
  userBalance: number;
  onOpenRecharge: () => void;
}

export const ConsultationMarketplace: React.FC<MarketplaceProps> = ({
  offerings,
  onStartSession,
  userBalance,
  onOpenRecharge,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalOffering, setActiveModalOffering] = useState<ConsultationOffering | null>(null);

  const categories = [
    'All',
    'Distributed Systems',
    'FinTech & Payments',
    'Product & Real-Time UX',
    'AI & Machine Learning',
  ];

  const filteredOfferings = offerings.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.consultantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Description */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Specialist Consultation Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Browse verified architects and engineers available for real-time video consultations and live code review.
          </p>
        </div>

        {/* Live balance badge */}
        <div className="flex items-center gap-3">
          <div className="text-right text-xs">
            <span className="text-slate-500">Available Credits:</span>
            <p className="font-mono font-bold text-slate-900 text-sm tabular-nums">
              ${userBalance.toFixed(2)} USD
            </p>
          </div>
          <button
            onClick={onOpenRecharge}
            className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200"
          >
            Add Funds
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Tabs (functional segmented buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by specialty, topic, or engineer..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 placeholder-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Marketplace Grid */}
      {filteredOfferings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOfferings.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 transition-all hover:shadow-md flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-6 space-y-4">
                {/* Consultant Header */}
                <div className="flex items-start gap-3.5">
                  <img
                    src={item.consultantAvatar}
                    alt={item.consultantName}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="font-semibold text-slate-900 text-base leading-tight">
                      {item.consultantName}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {item.consultantTitle}
                    </p>
                    {/* Unboxed metadata with typographic separators */}
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500">
                      <span className="font-semibold text-amber-600">★ {item.rating}</span>
                      <span>·</span>
                      <span>{item.reviewsCount} reviews</span>
                      <span>·</span>
                      <span className="text-emerald-700 font-medium">{item.availability}</span>
                    </div>
                  </div>
                </div>

                {/* Offering Title & Bio */}
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-3 mt-1.5 leading-relaxed">
                    {item.bio}
                  </p>
                </div>

                {/* Unboxed tags */}
                <div className="text-[11px] text-slate-500 flex flex-wrap gap-x-2 gap-y-1 pt-1">
                  {item.tags.map((tag, idx) => (
                    <span key={tag}>
                      {tag}
                      {idx < item.tags.length - 1 && <span className="ml-2 text-slate-300">·</span>}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer: Pricing & Action */}
              <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-slate-500">Metered Billing</p>
                  <p className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                    ${item.ratePerMinuteUsd.toFixed(2)}
                    <span className="text-xs font-normal text-slate-500">/min</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveModalOffering(item)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => onStartSession(item)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Connect</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">No offerings match your search</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            We couldn't find any specialists matching "{searchQuery}" in category "{selectedCategory}". Try clearing your filters or searching for terms like WebRTC, AI, or Ledger.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {activeModalOffering && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={activeModalOffering.consultantAvatar}
                  alt={activeModalOffering.consultantName}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{activeModalOffering.consultantName}</h3>
                  <p className="text-xs text-slate-500">{activeModalOffering.consultantTitle}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <span className="font-semibold text-amber-600">★ {activeModalOffering.rating}</span>
                    <span>·</span>
                    <span>{activeModalOffering.experienceYears} Years Experience</span>
                    <span>·</span>
                    <span className="text-emerald-700 font-medium">{activeModalOffering.availability}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveModalOffering(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-900">{activeModalOffering.title}</h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
                  {activeModalOffering.bio}
                </p>
              </div>

              {/* Technical Areas */}
              <div>
                <h5 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Technical Specialties &amp; Competencies
                </h5>
                <div className="flex flex-wrap gap-2 text-xs">
                  {activeModalOffering.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-mono text-[11px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Session Pricing & Requirements */}
              <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500">Streaming Rate</span>
                  <p className="text-base font-bold text-indigo-900 font-mono tabular-nums">
                    ${activeModalOffering.ratePerMinuteUsd.toFixed(2)} / min
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    ${activeModalOffering.hourlyRateUsd}.00 / hour equivalent
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">Billing Protocol</span>
                  <p className="text-xs font-semibold text-slate-800 mt-1">
                    Continuous Per-Second Ledger
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Balance deducted in real-time as session runs
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>WebRTC direct DTLS-SRTP audio &amp; video negotiation</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setActiveModalOffering(null)}
                className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-900"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const offering = activeModalOffering;
                  setActiveModalOffering(null);
                  onStartSession(offering);
                }}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
              >
                <Video className="w-4 h-4" />
                <span>Initiate WebRTC Consultation</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
