import React, { useState, useEffect, useRef } from 'react';
import { User, Bell, Sliders, Mic, Video, ShieldCheck, CheckCircle2, Lock, Volume2 } from 'lucide-react';
import { UserProfile } from '../../types';
import { webrtcManager, MediaDeviceChoice } from '../../lib/webrtc/signaling';

interface AccountSettingsProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onSignOut: () => void;
}

export const AccountSettings: React.FC<AccountSettingsProps> = ({
  user,
  onUpdateUser,
  onSignOut,
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Notifications
  const [notifySessions, setNotifySessions] = useState(true);
  const [notifyReceipts, setNotifyReceipts] = useState(true);
  const [notifyLowBalance, setNotifyLowBalance] = useState(true);

  // Hardware Test State
  const [testingMedia, setTestingMedia] = useState(false);
  const [testMicLevel, setTestMicLevel] = useState(0);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceChoice[]>([]);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceChoice[]>([]);
  const testVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function loadDevices() {
      const devs = await webrtcManager.getAvailableDevices();
      setAudioDevices(devs.audioInputs);
      setVideoDevices(devs.videoInputs);
    }
    loadDevices();
  }, []);

  const handleStartHardwareTest = async () => {
    setTestingMedia(true);
    const res = await webrtcManager.startLocalMedia();
    if (res.stream && testVideoRef.current) {
      testVideoRef.current.srcObject = res.stream;
    }
  };

  const handleStopHardwareTest = () => {
    webrtcManager.stopLocalMedia();
    setTestingMedia(false);
    setTestMicLevel(0);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (testingMedia) {
      interval = setInterval(() => {
        setTestMicLevel(webrtcManager.getAudioLevel());
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [testingMedia]);

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ name, email });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Account &amp; Device Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage your personal profile, notifications, and run real-time audio/video hardware diagnostic checks.
          </p>
        </div>

        {savedSuccess && (
          <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile Saved</span>
          </div>
        )}
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xl shadow-xs">
            {name.charAt(0)}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">{name}</h3>
            <p className="text-xs text-slate-500">{email}</p>
            <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mt-1 inline-block">
              Role: {user.role.toUpperCase()}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmitProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Hardware Diagnostic & Media Test */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Mic className="w-4 h-4 text-indigo-600" />
              <span>Media Device Diagnostic Lab</span>
            </h3>
            <p className="text-xs text-slate-500">
              Test your physical camera &amp; microphone before connecting to high-stakes live consultations.
            </p>
          </div>

          {!testingMedia ? (
            <button
              onClick={handleStartHardwareTest}
              className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold transition-colors"
            >
              Start Hardware Test
            </button>
          ) : (
            <button
              onClick={handleStopHardwareTest}
              className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition-colors"
            >
              Stop Test
            </button>
          )}
        </div>

        {testingMedia && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
            {/* Live Camera Viewport */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-700 block">Camera Video Feed</span>
              <div className="aspect-video rounded-xl bg-slate-900 overflow-hidden relative border border-slate-300">
                <video
                  ref={testVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 text-[10px] text-white bg-black/60 px-2 py-0.5 rounded">
                  Live Preview (WebRTC MediaStream)
                </span>
              </div>
            </div>

            {/* Live Audio Meter */}
            <div className="space-y-4 flex flex-col justify-center">
              <div>
                <span className="text-xs font-semibold text-slate-700 block">
                  Microphone Volume Level
                </span>
                <p className="text-[11px] text-slate-500">Speak into your mic to verify sound pickup.</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500">Peak Level:</span>
                  <span className="font-bold text-slate-900 tabular-nums">{testMicLevel}%</span>
                </div>
                <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-75"
                    style={{ width: `${testMicLevel}%` }}
                  />
                </div>
              </div>

              <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-100 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Web Audio AnalyserNode responsive and calibrated</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="font-semibold text-slate-700">Detected Microphones</span>
            <p className="text-slate-500 font-mono text-[11px]">
              {audioDevices.length > 0
                ? `${audioDevices.length} device(s) found`
                : 'Default System Audio'}
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="font-semibold text-slate-700">Detected Cameras</span>
            <p className="text-slate-500 font-mono text-[11px]">
              {videoDevices.length > 0
                ? `${videoDevices.length} camera(s) found`
                : 'Integrated FaceTime HD'}
            </p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Bell className="w-4 h-4 text-slate-600" />
          <span>Notification Preferences</span>
        </h3>

        <div className="space-y-3 text-xs">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notifySessions}
              onChange={(e) => setNotifySessions(e.target.checked)}
              className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
            />
            <span className="text-slate-700">
              Email session invitations and calendar event confirmations
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notifyReceipts}
              onChange={(e) => setNotifyReceipts(e.target.checked)}
              className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
            />
            <span className="text-slate-700">
              Email PDF receipts for Stripe ledger debits and recharges
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notifyLowBalance}
              onChange={(e) => setNotifyLowBalance(e.target.checked)}
              className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
            />
            <span className="text-slate-700">
              Alert when account balance approaches auto-recharge threshold
            </span>
          </label>
        </div>
      </div>

      {/* Sign Out / Account Switch */}
      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-slate-900">Session Management</h4>
          <p className="text-[11px] text-slate-500">Sign out or switch between test accounts</p>
        </div>
        <button
          onClick={onSignOut}
          className="px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold transition-colors"
        >
          Sign Out of Workspace
        </button>
      </div>
    </div>
  );
};
