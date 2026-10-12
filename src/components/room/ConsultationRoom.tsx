import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  PhoneOff,
  Maximize2,
  Minimize2,
  Settings,
  ShieldCheck,
  Radio,
  FileText,
  Clock,
  Send,
  MessageSquare,
  Sparkles,
  Wifi,
  ChevronRight,
  ChevronLeft,
  Volume2,
} from 'lucide-react';
import { ConsultationOffering, ConsultationSession, WebRTCConnectionState } from '../../types';
import { webrtcManager, MediaDeviceChoice } from '../../lib/webrtc/signaling';
import { defaultProviderAdapter } from '../../lib/webrtc/providerAdapter';

interface ConsultationRoomProps {
  offering: ConsultationOffering;
  onEndSession: (session: ConsultationSession) => void;
  userBalance: number;
}

export const ConsultationRoom: React.FC<ConsultationRoomProps> = ({
  offering,
  onEndSession,
  userBalance,
}) => {
  // State
  const [connectionState, setConnectionState] = useState<WebRTCConnectionState>('connecting');
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showDeviceSettings, setShowDeviceSettings] = useState(false);
  const [activeSideTab, setActiveSideTab] = useState<'notes' | 'billing' | 'telemetry'>('notes');
  const [sidePanelOpen, setSidePanelOpen] = useState(true);
  const [mediaPermissionDenied, setMediaPermissionDenied] = useState(false);

  // Audio level meter
  const [localAudioLevel, setLocalAudioLevel] = useState(0);
  const [remoteAudioLevel, setRemoteAudioLevel] = useState(45);

  // Devices
  const [availableAudioDevices, setAvailableAudioDevices] = useState<MediaDeviceChoice[]>([]);
  const [availableVideoDevices, setAvailableVideoDevices] = useState<MediaDeviceChoice[]>([]);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>('');
  const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>('');

  // In-session notes / chat
  const [notes, setNotes] = useState<string[]>([
    'Session initiated under WebRTC DTLS-SRTP secure channel.',
    `Specialist: ${offering.consultantName} (${offering.category})`,
    'Agenda: Live architecture assessment and scaling recommendations.',
  ]);
  const [newNoteInput, setNewNoteInput] = useState('');

  // Refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const roomContainerRef = useRef<HTMLDivElement>(null);
  const sessionStartTimeRef = useRef<string>(new Date().toISOString());

  // Current session running cost ($)
  const currentCost = Number(((durationSeconds / 60) * offering.ratePerMinuteUsd).toFixed(2));
  const remainingEstimatedBalance = Math.max(0, Number((userBalance - currentCost).toFixed(2)));

  // Setup WebRTC local media and connection lifecycle
  useEffect(() => {
    let isMounted = true;

    async function initMedia() {
      // Enumerate devices
      const devices = await webrtcManager.getAvailableDevices();
      if (isMounted) {
        setAvailableAudioDevices(devices.audioInputs);
        setAvailableVideoDevices(devices.videoInputs);
        if (devices.audioInputs.length > 0) setSelectedAudioDevice(devices.audioInputs[0].deviceId);
        if (devices.videoInputs.length > 0) setSelectedVideoDevice(devices.videoInputs[0].deviceId);
      }

      // Start local media stream
      const res = await webrtcManager.startLocalMedia();
      if (!isMounted) return;

      if (res.stream && localVideoRef.current) {
        localVideoRef.current.srcObject = res.stream;
        setMediaPermissionDenied(false);
      } else {
        setMediaPermissionDenied(true);
      }

      // Simulate realistic signaling handshake
      setConnectionState('connecting');
      setTimeout(() => {
        if (!isMounted) return;
        setConnectionState('connected');
      }, 1400);
    }

    initMedia();

    return () => {
      isMounted = false;
      webrtcManager.stopLocalMedia();
    };
  }, []);

  // Duration timer
  useEffect(() => {
    if (connectionState !== 'connected') return;
    const interval = setInterval(() => {
      setDurationSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [connectionState]);

  // Audio level poller for local mic and simulated remote speaking
  useEffect(() => {
    const audioInterval = setInterval(() => {
      if (isMicOn) {
        const level = webrtcManager.getAudioLevel();
        setLocalAudioLevel(level);
      } else {
        setLocalAudioLevel(0);
      }

      // Simulate natural speech rhythm for remote consultant
      if (connectionState === 'connected') {
        const speechWave = Math.sin(Date.now() / 300) * 35 + 40;
        setRemoteAudioLevel(Math.max(10, Math.min(85, Math.round(speechWave))));
      }
    }, 150);

    return () => clearInterval(audioInterval);
  }, [isMicOn, connectionState]);

  // Format timer mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Toggle Handlers
  const handleToggleMic = () => {
    const nextState = !isMicOn;
    webrtcManager.toggleAudio(nextState);
    setIsMicOn(nextState);
  };

  const handleToggleVideo = () => {
    const nextState = !isVideoOn;
    webrtcManager.toggleVideo(nextState);
    setIsVideoOn(nextState);
  };

  const handleToggleFullscreen = () => {
    if (!roomContainerRef.current) return;
    if (!isFullscreen) {
      if (roomContainerRef.current.requestFullscreen) {
        roomContainerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const handleDeviceChange = async (audioId?: string, videoId?: string) => {
    webrtcManager.stopLocalMedia();
    const res = await webrtcManager.startLocalMedia(audioId || selectedAudioDevice, videoId || selectedVideoDevice);
    if (res.stream && localVideoRef.current) {
      localVideoRef.current.srcObject = res.stream;
      setMediaPermissionDenied(false);
    }
    setShowDeviceSettings(false);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteInput.trim()) return;
    setNotes((prev) => [...prev, newNoteInput.trim()]);
    setNewNoteInput('');
  };

  const handleConfirmEnd = () => {
    webrtcManager.stopLocalMedia();
    const finalSession: ConsultationSession = {
      sessionId: `ses_${Date.now()}`,
      offeringId: offering.id,
      offering,
      userId: 'usr_89502_prod',
      status: 'completed',
      connectionState: 'disconnected',
      startedAt: sessionStartTimeRef.current,
      endedAt: new Date().toISOString(),
      durationSeconds,
      currentCostUsd: currentCost,
      signalingLatencyMs: 24,
      packetLossPercent: 0,
      iceConnectionState: 'completed',
      notes,
    };
    onEndSession(finalSession);
  };

  return (
    <div
      ref={roomContainerRef}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col h-[calc(100vh-5rem)] min-h-[650px]"
    >
      {/* Room Header Strip */}
      <div className="bg-white rounded-xl border border-slate-200 px-4 py-2.5 mb-3 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                connectionState === 'connected'
                  ? 'bg-emerald-500 animate-pulse'
                  : connectionState === 'connecting'
                  ? 'bg-amber-500 animate-ping'
                  : 'bg-rose-500'
              }`}
            />
            <span className="text-xs font-bold text-slate-900 tracking-wide">
              {connectionState === 'connected'
                ? 'WebRTC Live Session'
                : connectionState === 'connecting'
                ? 'Negotiating Peer Connection...'
                : 'Session Disconnected'}
            </span>
          </div>

          <span className="text-slate-300">|</span>

          {/* Unboxed session metadata */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600">
            <span className="font-medium text-slate-900">{offering.consultantName}</span>
            <span>·</span>
            <span className="text-slate-500">{offering.category}</span>
          </div>
        </div>

        {/* Live Timer and Ledger Rate */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 font-mono text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span className="font-semibold text-slate-900 tabular-nums">
              {formatTime(durationSeconds)}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 font-mono text-slate-700 bg-indigo-50/70 border border-indigo-100 px-2.5 py-1 rounded-md">
            <span className="text-slate-500 text-[11px]">Accrued:</span>
            <span className="font-bold text-indigo-900 tabular-nums">
              ${currentCost.toFixed(2)} USD
            </span>
          </div>

          <button
            onClick={() => setSidePanelOpen(!sidePanelOpen)}
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 transition-colors"
            title="Toggle session details panel"
          >
            {sidePanelOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Body: Video Stream Grid + Side Drawer */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0">
        {/* Video Canvas Container */}
        <div
          className={`${
            sidePanelOpen ? 'lg:col-span-8 xl:col-span-9' : 'lg:col-span-12'
          } relative rounded-2xl bg-slate-950 overflow-hidden border border-slate-800 flex flex-col justify-between`}
        >
          {/* Main Stage: Remote Participant Video Simulation */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <img
              src={offering.consultantAvatar}
              alt={offering.consultantName}
              className="w-full h-full object-cover filter brightness-95"
              referrerPolicy="no-referrer"
            />

            {/* Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none" />

            {/* Remote Consultant Status Badge (Top-Left) */}
            <div className="absolute top-4 left-4 flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md border border-white/10 text-white text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-medium">{offering.consultantName}</span>
              <span className="text-slate-400">·</span>
              <div className="flex items-center gap-1 text-[11px] text-slate-300">
                <Volume2 className="w-3 h-3 text-sky-400" />
                <span>Audio Stream Active</span>
                <span className="font-mono text-emerald-400 tabular-nums">({remoteAudioLevel}%)</span>
              </div>
            </div>

            {/* Remote Audio Waveform Visualizer */}
            <div className="absolute top-4 right-4 flex items-center gap-0.5 h-5 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
              <span
                className="w-1 bg-sky-400 rounded-full transition-all duration-150"
                style={{ height: `${Math.max(4, remoteAudioLevel * 0.18)}px` }}
              />
              <span
                className="w-1 bg-sky-400 rounded-full transition-all duration-150"
                style={{ height: `${Math.max(4, remoteAudioLevel * 0.24)}px` }}
              />
              <span
                className="w-1 bg-sky-400 rounded-full transition-all duration-150"
                style={{ height: `${Math.max(4, remoteAudioLevel * 0.14)}px` }}
              />
              <span
                className="w-1 bg-sky-400 rounded-full transition-all duration-150"
                style={{ height: `${Math.max(4, remoteAudioLevel * 0.2)}px` }}
              />
              <span className="ml-1 text-[10px] text-slate-300 font-mono">1080p60</span>
            </div>

            {/* Local Participant Tile (Picture-in-Picture) */}
            <div className="absolute bottom-20 right-4 w-44 sm:w-52 aspect-video rounded-xl overflow-hidden border-2 border-white/20 bg-slate-900 shadow-2xl z-20">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${!isVideoOn || mediaPermissionDenied ? 'hidden' : 'block'}`}
              />

              {(!isVideoOn || mediaPermissionDenied) && (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-400 text-xs p-2 text-center">
                  <VideoOff className="w-5 h-5 mb-1 text-slate-500" />
                  <span>{mediaPermissionDenied ? 'Camera permission disabled' : 'Camera off'}</span>
                </div>
              )}

              {/* Local Participant Overlay */}
              <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-[10px] text-white bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
                <span className="truncate">You (Client)</span>
                <div className="flex items-center gap-1">
                  {isMicOn ? (
                    <span className="text-emerald-400 font-mono">{localAudioLevel}%</span>
                  ) : (
                    <MicOff className="w-2.5 h-2.5 text-rose-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Explicit Demo Mode Indicator (brief compliance requirement) */}
            <div className="absolute bottom-20 left-4 text-[11px] text-slate-300 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
              <span>Signaling Bridge: SFU Mock Protocol · Real Local Camera/Mic Active</span>
            </div>
          </div>

          {/* Bottom In-Room Control Dock */}
          <div className="relative z-30 p-3 bg-slate-900/90 backdrop-blur-lg border-t border-slate-800 flex items-center justify-between">
            {/* Left: Telemetry & Quality */}
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono text-slate-300">Optimal (24ms)</span>
              </div>
              <span className="hidden sm:inline text-slate-600">·</span>
              <span className="hidden sm:inline font-mono text-[11px]">Loss: 0%</span>
            </div>

            {/* Center: Essential Call Controls */}
            <div className="flex items-center gap-2">
              {/* Mic toggle */}
              <button
                onClick={handleToggleMic}
                className={`p-3 rounded-xl transition-all shadow-sm ${
                  isMicOn
                    ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    : 'bg-rose-600 hover:bg-rose-700 text-white'
                }`}
                title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
              >
                {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>

              {/* Camera toggle */}
              <button
                onClick={handleToggleVideo}
                className={`p-3 rounded-xl transition-all shadow-sm ${
                  isVideoOn
                    ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    : 'bg-rose-600 hover:bg-rose-700 text-white'
                }`}
                title={isVideoOn ? 'Disable Camera' : 'Enable Camera'}
              >
                {isVideoOn ? <VideoIcon className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </button>

              {/* Device settings */}
              <button
                onClick={() => setShowDeviceSettings(true)}
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors"
                title="Audio and Video Settings"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* Fullscreen */}
              <button
                onClick={handleToggleFullscreen}
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* End Consultation Button */}
              <button
                onClick={() => setShowEndConfirm(true)}
                className="ml-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
              >
                <PhoneOff className="w-4 h-4" />
                <span>End Consultation</span>
              </button>
            </div>

            {/* Right: Balance ticker */}
            <div className="hidden sm:block text-right text-xs">
              <span className="text-slate-400 text-[11px]">Available:</span>
              <p className="font-mono text-white font-semibold tabular-nums">
                ${remainingEstimatedBalance.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Side Panel: In-Session Notes, Billing Ticker & Signaling Telemetry */}
        {sidePanelOpen && (
          <div className="lg:col-span-4 xl:col-span-3 bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between shadow-xs">
            {/* Panel Tabs (Segmented Button Control) */}
            <div className="p-2 border-b border-slate-100 flex items-center gap-1 bg-slate-50/70">
              <button
                onClick={() => setActiveSideTab('notes')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  activeSideTab === 'notes'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Notes ({notes.length})</span>
              </button>
              <button
                onClick={() => setActiveSideTab('billing')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  activeSideTab === 'billing'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Ledger Tally</span>
              </button>
              <button
                onClick={() => setActiveSideTab('telemetry')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  activeSideTab === 'telemetry'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Network</span>
              </button>
            </div>

            {/* Panel Content Area */}
            <div className="p-4 flex-1 overflow-y-auto space-y-4">
              {activeSideTab === 'notes' && (
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-slate-900 flex items-center justify-between">
                    <span>Collaborative Session Notes</span>
                    <span className="text-[11px] text-slate-400 font-normal">Autosaved</span>
                  </div>

                  <div className="space-y-2">
                    {notes.map((note, index) => (
                      <div
                        key={index}
                        className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed"
                      >
                        {note}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSideTab === 'billing' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <span className="text-xs font-semibold text-slate-900 block">
                      Live Metered Session Cost
                    </span>

                    <div className="flex justify-between items-baseline text-xs">
                      <span className="text-slate-500">Duration</span>
                      <span className="font-mono font-bold text-slate-900 tabular-nums">
                        {formatTime(durationSeconds)} ({Math.ceil(durationSeconds / 60)} billed min)
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline text-xs">
                      <span className="text-slate-500">Rate</span>
                      <span className="font-mono text-slate-900 tabular-nums">
                        ${offering.ratePerMinuteUsd.toFixed(2)}/min
                      </span>
                    </div>

                    <div className="border-t border-slate-200 pt-2 flex justify-between items-baseline text-sm">
                      <span className="font-semibold text-slate-900">Total Accrued</span>
                      <span className="font-mono font-bold text-indigo-600 tabular-nums text-base">
                        ${currentCost.toFixed(2)} USD
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-800 space-y-1">
                    <p className="font-semibold">Auto-Recharge Protection Active</p>
                    <p className="text-[11px] leading-relaxed">
                      If credits drop below $35.00, $100.00 will be added automatically to guarantee zero call interruption.
                    </p>
                  </div>
                </div>
              )}

              {activeSideTab === 'telemetry' && (
                <div className="space-y-3 text-xs">
                  <span className="font-semibold text-slate-900 block">
                    WebRTC Peer &amp; SFU Metrics
                  </span>

                  <div className="space-y-2 font-mono">
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex justify-between">
                      <span className="text-slate-500">Signaling RTT:</span>
                      <span className="font-bold text-emerald-700 tabular-nums">24 ms</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex justify-between">
                      <span className="text-slate-500">Jitter:</span>
                      <span className="text-slate-900 tabular-nums">3.2 ms</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex justify-between">
                      <span className="text-slate-500">Packet Loss:</span>
                      <span className="text-slate-900 tabular-nums">0.00 %</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex justify-between">
                      <span className="text-slate-500">Audio Codec:</span>
                      <span className="text-slate-900">Opus 48kHz Stereo</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex justify-between">
                      <span className="text-slate-500">Video Transport:</span>
                      <span className="text-slate-900">H.264 High Profile</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Note input form at bottom of notes tab */}
            {activeSideTab === 'notes' && (
              <form onSubmit={handleAddNote} className="p-3 border-t border-slate-100 flex gap-2">
                <input
                  type="text"
                  value={newNoteInput}
                  onChange={(e) => setNewNoteInput(e.target.value)}
                  placeholder="Record key architectural insight..."
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-xs font-medium"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      {/* End Session Confirmation Modal */}
      {showEndConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900">End Consultation Session?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your WebRTC stream with <span className="font-semibold text-slate-900">{offering.consultantName}</span> will terminate immediately.
              The final billing duration of <span className="font-mono font-bold text-slate-900 tabular-nums">{formatTime(durationSeconds)}</span> will be deducted from your account.
            </p>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between text-xs">
              <span className="text-slate-500">Total charge:</span>
              <span className="font-mono font-bold text-slate-900 tabular-nums text-sm">
                ${currentCost.toFixed(2)} USD
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowEndConfirm(false)}
                className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-900"
              >
                Resume Call
              </button>
              <button
                onClick={handleConfirmEnd}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Confirm &amp; Disconnect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Device Selection & Audio Test Modal */}
      {showDeviceSettings && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900">Media Device Settings</h3>

            {/* Audio Input Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Microphone</label>
              <select
                value={selectedAudioDevice}
                onChange={(e) => setSelectedAudioDevice(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
              >
                {availableAudioDevices.length > 0 ? (
                  availableAudioDevices.map((d) => (
                    <option key={d.deviceId} value={d.deviceId}>
                      {d.label}
                    </option>
                  ))
                ) : (
                  <option value="">Default System Microphone</option>
                )}
              </select>

              {/* Real-time volume meter preview */}
              <div className="pt-2">
                <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                  <span>Input Volume Meter:</span>
                  <span className="font-mono tabular-nums">{localAudioLevel}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-100"
                    style={{ width: `${localAudioLevel}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Video Input Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Camera</label>
              <select
                value={selectedVideoDevice}
                onChange={(e) => setSelectedVideoDevice(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
              >
                {availableVideoDevices.length > 0 ? (
                  availableVideoDevices.map((d) => (
                    <option key={d.deviceId} value={d.deviceId}>
                      {d.label}
                    </option>
                  ))
                ) : (
                  <option value="">Integrated Camera / FaceTime HD</option>
                )}
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDeviceSettings(false)}
                className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeviceChange(selectedAudioDevice, selectedVideoDevice)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Apply Devices
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
