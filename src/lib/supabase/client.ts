import { UserProfile, ConsultationOffering, OrderRecord, LedgerEntry, ConsultationSession } from '../../types';

// Initial Realistic Sample Data
export const INITIAL_OFFERINGS: ConsultationOffering[] = [
  {
    id: 'off-elena-01',
    title: 'High-Throughput Streaming & Low-Latency Architecture',
    slug: 'low-latency-streaming-architecture',
    consultantName: 'Dr. Elena Rostova',
    consultantTitle: 'Principal Distributed Systems Engineer · Ex-Cloudflare',
    consultantAvatar: '/src/assets/images/consultant_elena_profile_1791836392646.jpg',
    coverImage: '/src/assets/images/hero_streaming_consultation_1791836381252.jpg',
    bio: 'Specialist in WebRTC SFU/MCU media pipelines, QUIC transport protocols, audio-video synchronization, and edge relay scaling under heavy concurrent workloads.',
    category: 'Distributed Systems',
    hourlyRateUsd: 280,
    ratePerMinuteUsd: 4.67,
    rating: 4.98,
    reviewsCount: 142,
    tags: ['WebRTC', 'Media-over-QUIC', 'SFU Topology', 'Sub-100ms Latency'],
    availability: 'Available Now',
    minimumDurationMinutes: 10,
    experienceYears: 12,
  },
  {
    id: 'off-marcus-02',
    title: 'FinTech Ledger Architecture & Stripe Connect Settlement',
    slug: 'fintech-ledger-stripe-connect',
    consultantName: 'Marcus Vance',
    consultantTitle: 'Head of Payments Architecture · Fintech Advisor',
    consultantAvatar: '/src/assets/images/consultant_marcus_profile_1791836403525.jpg',
    bio: 'Advising on idempotent payment webhooks, double-entry financial ledgers, Stripe Connect custom/express onboardings, regulatory escrow, and real-time wallet settlement.',
    category: 'FinTech & Payments',
    hourlyRateUsd: 320,
    ratePerMinuteUsd: 5.33,
    rating: 4.95,
    reviewsCount: 98,
    tags: ['Stripe Connect', 'Double-Entry Ledgers', 'PCI Compliance', 'Instant Payouts'],
    availability: 'Available Now',
    minimumDurationMinutes: 15,
    experienceYears: 14,
  },
  {
    id: 'off-sarah-03',
    title: 'Real-Time Conversational UX & Handoff Strategy',
    slug: 'conversational-ux-handoff',
    consultantName: 'Sarah Chen',
    consultantTitle: 'VP of Product Experience · Real-Time Systems',
    consultantAvatar: '/src/assets/images/consultant_sarah_profile_1791836415633.jpg',
    bio: 'Designing latency-resilient user journeys for audio-first products, session timer psychology, live billing transparency, and seamless human-in-the-loop streaming escalations.',
    category: 'Product & Real-Time UX',
    hourlyRateUsd: 240,
    ratePerMinuteUsd: 4.00,
    rating: 5.0,
    reviewsCount: 86,
    tags: ['Live Video UX', 'Frictionless Billing', 'Voice Ergonomics', 'WCAG AA Design'],
    availability: 'Available Now',
    minimumDurationMinutes: 10,
    experienceYears: 9,
  },
  {
    id: 'off-david-04',
    title: 'Real-Time Multimodal AI & Audio Inference Pipelines',
    slug: 'multimodal-ai-streaming-inference',
    consultantName: 'David K. Aris',
    consultantTitle: 'Senior Applied AI Researcher · Speech & Vision',
    consultantAvatar: '/src/assets/images/consultant_marcus_profile_1791836403525.jpg', // fallback to Marcus's portrait
    bio: 'Architecting streaming speech-to-speech agents, bidirectional audio websockets, VAD (Voice Activity Detection), and turn-taking latency optimizations for conversational apps.',
    category: 'AI & Machine Learning',
    hourlyRateUsd: 350,
    ratePerMinuteUsd: 5.83,
    rating: 4.92,
    reviewsCount: 114,
    tags: ['Live API', 'Bi-directional Audio', 'VAD Calibration', 'Edge GPUs'],
    availability: 'Available Now',
    minimumDurationMinutes: 15,
    experienceYears: 11,
  },
];

export const INITIAL_USER: UserProfile = {
  id: 'usr_89502_prod',
  email: 'sameerupwork25@gmail.com',
  name: 'Sameer Patel',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  role: 'client',
  balanceUsd: 240.00,
  autoRechargeEnabled: true,
  autoRechargeThresholdUsd: 35.00,
  autoRechargeAmountUsd: 100.00,
  preferredAudioDevice: 'Default - High Definition Audio',
  preferredVideoDevice: 'Integrated FaceTime HD Camera',
  createdAt: '2026-09-14T08:30:00Z',
};

export const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: 'ord_91823',
    orderNumber: 'ORD-2026-9182',
    offeringId: 'off-elena-01',
    offeringTitle: 'High-Throughput Streaming & Low-Latency Architecture',
    consultantName: 'Dr. Elena Rostova',
    consultantAvatar: '/src/assets/images/consultant_elena_profile_1791836392646.jpg',
    createdAt: '2026-10-10T14:22:00Z',
    durationMinutes: 24,
    amountUsd: 112.08,
    status: 'completed',
    stripePaymentIntentId: 'pi_3Mo9z12498xQle101',
    receiptUrl: '#',
  },
  {
    id: 'ord_90412',
    orderNumber: 'ORD-2026-9041',
    offeringId: 'off-sarah-03',
    offeringTitle: 'Real-Time Conversational UX & Handoff Strategy',
    consultantName: 'Sarah Chen',
    consultantAvatar: '/src/assets/images/consultant_sarah_profile_1791836415633.jpg',
    createdAt: '2026-10-06T11:05:00Z',
    durationMinutes: 18,
    amountUsd: 72.00,
    status: 'completed',
    stripePaymentIntentId: 'pi_3Mo8k88491xXye992',
    receiptUrl: '#',
  },
];

export const INITIAL_LEDGER: LedgerEntry[] = [
  {
    id: 'led_1094',
    createdAt: '2026-10-11T09:15:00Z',
    type: 'account_recharge',
    description: 'Auto-recharge trigger (Mastercard ending in 4242)',
    amountUsd: 100.00,
    balanceAfterUsd: 240.00,
    status: 'settled',
    referenceId: 'ch_3Mo8k88491xXye992',
  },
  {
    id: 'led_1093',
    createdAt: '2026-10-10T14:46:00Z',
    type: 'session_charge',
    description: 'Consultation with Dr. Elena Rostova (24m 00s)',
    amountUsd: -112.08,
    balanceAfterUsd: 140.00,
    status: 'settled',
    referenceId: 'ord_91823',
  },
  {
    id: 'led_1092',
    createdAt: '2026-10-06T11:23:00Z',
    type: 'session_charge',
    description: 'Consultation with Sarah Chen (18m 00s)',
    amountUsd: -72.00,
    balanceAfterUsd: 252.08,
    status: 'settled',
    referenceId: 'ord_90412',
  },
  {
    id: 'led_1091',
    createdAt: '2026-10-01T10:00:00Z',
    type: 'account_recharge',
    description: 'Initial balance funding (Visa ending in 8891)',
    amountUsd: 324.08,
    balanceAfterUsd: 324.08,
    status: 'settled',
    referenceId: 'ch_init_funding_99',
  },
];

class SupabaseService {
  private user: UserProfile = INITIAL_USER;
  private offers: ConsultationOffering[] = INITIAL_OFFERINGS;
  private orders: OrderRecord[] = INITIAL_ORDERS;
  private ledger: LedgerEntry[] = INITIAL_LEDGER;

  constructor() {
    // Restore from localStorage if available
    try {
      const savedUser = localStorage.getItem('aurastream_user');
      if (savedUser) this.user = JSON.parse(savedUser);
      const savedOrders = localStorage.getItem('aurastream_orders');
      if (savedOrders) this.orders = JSON.parse(savedOrders);
      const savedLedger = localStorage.getItem('aurastream_ledger');
      if (savedLedger) this.ledger = JSON.parse(savedLedger);
    } catch {
      // Ignore
    }
  }

  private persist() {
    try {
      localStorage.setItem('aurastream_user', JSON.stringify(this.user));
      localStorage.setItem('aurastream_orders', JSON.stringify(this.orders));
      localStorage.setItem('aurastream_ledger', JSON.stringify(this.ledger));
    } catch {
      // Ignore
    }
  }

  public getProfile(): UserProfile {
    return { ...this.user };
  }

  public updateProfile(updates: Partial<UserProfile>): UserProfile {
    this.user = { ...this.user, ...updates };
    this.persist();
    return { ...this.user };
  }

  public getOfferings(): ConsultationOffering[] {
    return [...this.offers];
  }

  public getOfferingById(id: string): ConsultationOffering | undefined {
    return this.offers.find((o) => o.id === id);
  }

  public getOrders(): OrderRecord[] {
    return [...this.orders];
  }

  public getLedger(): LedgerEntry[] {
    return [...this.ledger];
  }

  public rechargeBalance(amount: number, description: string): { user: UserProfile; ledgerEntry: LedgerEntry } {
    const newBalance = Number((this.user.balanceUsd + amount).toFixed(2));
    this.user.balanceUsd = newBalance;
    const entry: LedgerEntry = {
      id: `led_${Date.now()}`,
      createdAt: new Date().toISOString(),
      type: 'account_recharge',
      description,
      amountUsd: amount,
      balanceAfterUsd: newBalance,
      status: 'settled',
      referenceId: `ch_mock_${Date.now()}`,
    };
    this.ledger.unshift(entry);
    this.persist();
    return { user: { ...this.user }, ledgerEntry: entry };
  }

  public recordCompletedSession(session: ConsultationSession): { order: OrderRecord; ledgerEntry: LedgerEntry } {
    const amount = Number(session.currentCostUsd.toFixed(2));
    const newBalance = Number(Math.max(0, this.user.balanceUsd - amount).toFixed(2));
    this.user.balanceUsd = newBalance;

    const order: OrderRecord = {
      id: `ord_${Date.now()}`,
      orderNumber: `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      offeringId: session.offering.id,
      offeringTitle: session.offering.title,
      consultantName: session.offering.consultantName,
      consultantAvatar: session.offering.consultantAvatar,
      createdAt: session.startedAt,
      durationMinutes: Math.ceil(session.durationSeconds / 60),
      amountUsd: amount,
      status: 'completed',
      stripePaymentIntentId: `pi_live_${Date.now()}`,
      receiptUrl: '#',
    };
    this.orders.unshift(order);

    const minutes = Math.floor(session.durationSeconds / 60);
    const seconds = session.durationSeconds % 60;
    const timeStr = `${minutes}m ${seconds.toString().padStart(2, '0')}s`;

    const ledgerEntry: LedgerEntry = {
      id: `led_${Date.now()}`,
      createdAt: new Date().toISOString(),
      type: 'session_charge',
      description: `Consultation with ${session.offering.consultantName} (${timeStr})`,
      amountUsd: -amount,
      balanceAfterUsd: newBalance,
      status: 'settled',
      referenceId: order.id,
    };
    this.ledger.unshift(ledgerEntry);

    // Auto-recharge check
    if (this.user.autoRechargeEnabled && newBalance < this.user.autoRechargeThresholdUsd) {
      this.rechargeBalance(
        this.user.autoRechargeAmountUsd,
        `Auto-recharge trigger: balance fell below $${this.user.autoRechargeThresholdUsd.toFixed(2)}`
      );
    }

    this.persist();
    return { order, ledgerEntry };
  }
}

export const dbService = new SupabaseService();
