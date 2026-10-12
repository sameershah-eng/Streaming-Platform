import React, { useState } from 'react';
import { X, Eye, EyeOff, Lock, Mail, ShieldCheck, CheckCircle2, User, ArrowRight } from 'lucide-react';
import { UserProfile, UserRole } from '../../types';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (user: Partial<UserProfile>) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLogin }) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('client');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleDemoSignIn = (demoEmail: string, demoName: string, demoRole: UserRole) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin({
        email: demoEmail,
        name: demoName,
        role: demoRole,
      });
      onClose();
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (mode === 'reset') {
      if (!email || !email.includes('@')) {
        setErrorMsg('Please enter a valid email address.');
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setResetSent(true);
      }, 600);
      return;
    }

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid corporate or personal email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin({
        email,
        name: fullName || email.split('@')[0],
        role,
      });
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-6 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {mode === 'signin' && 'Sign In to Workspace'}
              {mode === 'signup' && 'Create AuraStream Account'}
              {mode === 'reset' && 'Reset Workspace Password'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {mode === 'signin' && 'Access real-time consultations, orders, and ledger'}
              {mode === 'signup' && 'Join as a client or specialist consultant'}
              {mode === 'reset' && 'We will send a secure password recovery link'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Fast-Switch Buttons */}
        <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-indigo-900">
            <span>Prototype Fast Logins:</span>
            <span className="font-mono text-[10px] text-indigo-600">Simulated Auth</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleDemoSignIn('sameerupwork25@gmail.com', 'Sameer Patel', 'client')}
              className="px-2.5 py-1.5 bg-white border border-indigo-200 text-indigo-900 rounded-lg hover:bg-indigo-50 font-medium text-left truncate transition-colors"
            >
              Client (Sameer Patel)
            </button>
            <button
              type="button"
              onClick={() => handleDemoSignIn('admin@aurastream.io', 'Alex Mercer (Admin)', 'admin')}
              className="px-2.5 py-1.5 bg-white border border-indigo-200 text-indigo-900 rounded-lg hover:bg-indigo-50 font-medium text-left truncate transition-colors"
            >
              Admin (Alex Mercer)
            </button>
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {errorMsg}
          </div>
        )}

        {/* Password reset confirmed state */}
        {resetSent ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-bold text-slate-900">Recovery Email Dispatched</h4>
            <p className="text-xs text-slate-500">
              We have sent instructions to <span className="font-semibold text-slate-900">{email}</span>.
            </p>
            <button
              onClick={() => {
                setResetSent(false);
                setMode('signin');
              }}
              className="text-xs font-semibold text-indigo-600 hover:underline pt-2 block mx-auto"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Sameer Patel"
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
              </div>
            </div>

            {mode !== 'reset' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">Password</label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => setMode('reset')}
                      className="text-[11px] text-indigo-600 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full pl-9 pr-9 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating with Supabase Auth...</span>
              ) : (
                <>
                  <span>
                    {mode === 'signin' && 'Sign In'}
                    {mode === 'signup' && 'Create Account'}
                    {mode === 'reset' && 'Send Password Reset Link'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Bottom Mode Switch */}
        <div className="pt-2 border-t border-slate-100 text-center text-xs text-slate-500">
          {mode === 'signin' && (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => setMode('signup')}
                className="font-semibold text-indigo-600 hover:underline"
              >
                Sign up
              </button>
            </p>
          )}

          {mode === 'signup' && (
            <p>
              Already registered?{' '}
              <button
                onClick={() => setMode('signin')}
                className="font-semibold text-indigo-600 hover:underline"
              >
                Sign in
              </button>
            </p>
          )}

          {mode === 'reset' && !resetSent && (
            <button
              onClick={() => setMode('signin')}
              className="font-semibold text-slate-700 hover:underline text-xs"
            >
              Back to Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
