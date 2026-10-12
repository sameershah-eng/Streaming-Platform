/**
 * External Video-Rendering Provider Adapter Interface
 * Compatible with modern WebRTC SFUs (LiveKit, Agora, Daily.co, AWS Chime, or custom server-side MCU)
 */

export interface VideoProviderConfig {
  providerName: 'livekit' | 'agora' | 'daily' | 'custom_sfu';
  serverUrl: string;
  turnServers: RTCIceServer[];
  tokenExpirySeconds: number;
}

export interface ProviderSessionToken {
  token: string;
  roomName: string;
  participantIdentity: string;
  expiresAt: string;
  iceServers: RTCIceServer[];
}

export interface VideoProviderAdapter {
  initialize(config: VideoProviderConfig): Promise<void>;
  requestSessionToken(userId: string, offeringId: string): Promise<ProviderSessionToken>;
  connectRoom(token: string): Promise<MediaStream | null>;
  disconnectRoom(): Promise<void>;
  getMetrics(): Promise<{ latencyMs: number; jitterMs: number; packetsLost: number; bitRateKbps: number }>;
}

export class MockProductionProviderAdapter implements VideoProviderAdapter {
  private config: VideoProviderConfig = {
    providerName: 'livekit',
    serverUrl: 'wss://streaming-sfu.aurastream.internal',
    turnServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:global.stun.twilio.com:3478' },
    ],
    tokenExpirySeconds: 7200,
  };

  async initialize(config: VideoProviderConfig): Promise<void> {
    this.config = config;
  }

  async requestSessionToken(userId: string, offeringId: string): Promise<ProviderSessionToken> {
    return {
      token: `jwt_sfu_${userId}_${offeringId}_${Date.now()}`,
      roomName: `room_${offeringId}_${Date.now()}`,
      participantIdentity: userId,
      expiresAt: new Date(Date.now() + 7200 * 1000).toISOString(),
      iceServers: this.config.turnServers,
    };
  }

  async connectRoom(_token: string): Promise<MediaStream | null> {
    // In production, this binds to the actual provider's WebRTC peer connection
    return null;
  }

  async disconnectRoom(): Promise<void> {
    // Clean up peer connections
  }

  async getMetrics(): Promise<{ latencyMs: number; jitterMs: number; packetsLost: number; bitRateKbps: number }> {
    return {
      latencyMs: Math.floor(22 + Math.random() * 12),
      jitterMs: Math.floor(2 + Math.random() * 4),
      packetsLost: 0,
      bitRateKbps: Math.floor(2400 + Math.random() * 200),
    };
  }
}

export const defaultProviderAdapter = new MockProductionProviderAdapter();
