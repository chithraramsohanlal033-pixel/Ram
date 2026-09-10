import React, { useState } from 'react';
import { Layers, Mail, Lock, User as UserIcon, ArrowRight, Check } from 'lucide-react';
import { User, ThemeConfig } from '../types';
import { CosmicLogo } from './CosmicLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: Partial<User>) => void;
  themeConfig: ThemeConfig;
  isDarkMode: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  themeConfig,
  isDarkMode,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('arjun@azure.social');
  const [password, setPassword] = useState('••••••••');
  const [username, setUsername] = useState('arjun_azure');
  const [fullName, setFullName] = useState('Arjun Mehta');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'forgot') {
      setStatusMessage('Password reset link sent to your email!');
      setTimeout(() => {
        setStatusMessage(null);
        setAuthMode('login');
      }, 2500);
      return;
    }

    onLogin({
      username: username.toLowerCase().replace(/\s+/g, '_'),
      fullName,
    });
    onClose();
  };

  const handleDemoLogin = (type: 'creator' | 'photographer' | 'developer') => {
    if (type === 'creator') {
      onLogin({
        username: 'arjun_azure',
        fullName: 'Arjun Mehta',
      });
    } else if (type === 'photographer') {
      onLogin({
        username: 'priya_visuals',
        fullName: 'Priya Sharma',
      });
    } else {
      onLogin({
        username: 'rohit_tech',
        fullName: 'Rohit Verma',
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-md">
      <div
        className={`w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border flex flex-col transition-colors ${
          isDarkMode
            ? 'bg-slate-900 border-slate-700 text-slate-100'
            : 'bg-white border-blue-100 text-slate-900'
        }`}
      >
        {/* Top Brand Banner */}
        <div className="p-6 text-center flex flex-col items-center gap-2 border-b border-slate-100 dark:border-slate-800">
          <CosmicLogo size="lg" className="mb-1" />
          <h2
            style={{ fontFamily: "'Grand Hotel', cursive, sans-serif" }}
            className="text-3xl font-normal tracking-wide text-slate-900 dark:text-white leading-tight"
          >
            Instagram
          </h2>
          <span className="text-[10px] text-blue-500 font-semibold tracking-wider uppercase -mt-2">
            Cosmic Blue Edition
          </span>
          <p className="text-xs text-slate-400">
            {authMode === 'login' && 'Sign in to connect with friends and explore in cosmic blue'}
            {authMode === 'signup' && 'Create your account to start sharing photos, reels & stories'}
            {authMode === 'forgot' && 'Enter your email to receive a password reset link'}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {statusMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{statusMessage}</span>
            </div>
          )}

          {authMode === 'signup' && (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-400">Full Name</label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Maya Patel"
                    className="w-full bg-transparent text-sm focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-400">Username</label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                  <span className="text-sm text-slate-400">@</span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="maya_patel"
                    className="w-full bg-transparent text-sm focus:outline-hidden"
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-400">Email Address</label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800">
              <Mail className="w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-transparent text-sm focus:outline-hidden"
              />
            </div>
          </div>

          {authMode !== 'forgot' && (
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-400">Password</label>
                {authMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setAuthMode('forgot')}
                    className="text-[11px] text-blue-500 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                <Lock className="w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-sm focus:outline-hidden"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className={`w-full py-3 rounded-xl font-bold text-xs text-white shadow-md bg-gradient-to-r ${themeConfig.gradient} hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2`}
          >
            <span>
              {authMode === 'login' && 'Sign In to Instagram'}
              {authMode === 'signup' && 'Create Account'}
              {authMode === 'forgot' && 'Send Reset Link'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Quick Demo Switchers */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            <span className="text-[11px] font-semibold text-slate-400 text-center uppercase tracking-wider">
              Quick One-Click Demo Logins
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('creator')}
                className="px-2 py-1.5 rounded-lg bg-blue-50 dark:bg-slate-800 hover:bg-blue-100 text-[11px] font-semibold text-blue-600 dark:text-blue-400 transition-colors truncate"
              >
                Arjun (Creator)
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('photographer')}
                className="px-2 py-1.5 rounded-lg bg-blue-50 dark:bg-slate-800 hover:bg-blue-100 text-[11px] font-semibold text-blue-600 dark:text-blue-400 transition-colors truncate"
              >
                Priya (Photo)
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('developer')}
                className="px-2 py-1.5 rounded-lg bg-blue-50 dark:bg-slate-800 hover:bg-blue-100 text-[11px] font-semibold text-blue-600 dark:text-blue-400 transition-colors truncate"
              >
                Rohit (Tech)
              </button>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="text-center text-xs text-slate-500 pt-1">
            {authMode === 'login' && (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Sign Up
                </button>
              </span>
            )}
            {authMode === 'signup' && (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Log In
                </button>
              </span>
            )}
            {authMode === 'forgot' && (
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Back to Log In
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
