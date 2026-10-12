export type UserRole = 'client' | 'consultant' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  role: UserRole;
  balanceUsd: number;
  autoRechargeEnabled: boolean;
  autoRechargeThresholdUsd: number;
  autoRechargeAmountUsd: number;
  preferredAudioDevice?: string;
  preferredVideoDevice?: string;
  createdAt: string;
}

export interface ConsultationOffering {
  id: string;
  title: string;
  slug: string;
  consultantName: string;
  consultantTitle: string;
  consultantAvatar: string;
  coverImage?: string;
  bio: string;
  category: 'AI & Machine Learning' | 'Distributed Systems' | 'FinTech & Payments' | 'Product & Real-Time UX' | 'WebRTC Infrastructure';
  hourlyRateUsd: number;
  ratePerMinuteUsd: number;
  rating: number;
  reviewsCount: number;
  tags: string[];
  availability: 'Available Now' | 'In Consultation' | 'Scheduled Only';
  minimumDurationMinutes: number;
  experienceYears: number;
}

export type WebRTCConnectionState = 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'failed';

export interface ConsultationSession {
  sessionId: string;
  offeringId: string;
  offering: ConsultationOffering;
  userId: string;
  status: 'initializing' | 'active' | 'paused' | 'completed' | 'terminated';
  connectionState: WebRTCConnectionState;
  startedAt: string;
  endedAt?: string;
  durationSeconds: number;
  currentCostUsd: number;
  signalingLatencyMs: number;
  packetLossPercent: number;
  iceConnectionState: string;
  notes: string[];
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  offeringId: string;
  offeringTitle: string;
  consultantName: string;
  consultantAvatar: string;
  createdAt: string;
  durationMinutes: number;
  amountUsd: number;
  status: 'completed' | 'in_progress' | 'refunded' | 'failed';
  stripePaymentIntentId: string;
  receiptUrl?: string;
}

export interface LedgerEntry {
  id: string;
  createdAt: string;
  type: 'session_charge' | 'account_recharge' | 'refund' | 'payout_transfer';
  description: string;
  amountUsd: number;
  balanceAfterUsd: number;
  status: 'settled' | 'pending' | 'failed';
  referenceId: string;
}

export interface WebhookLogEvent {
  id: string;
  eventType: string;
  source: 'stripe' | 'webrtc_signaling' | 'supabase_auth';
  timestamp: string;
  status: 'processed' | 'pending' | 'retried';
  payloadSummary: string;
}
