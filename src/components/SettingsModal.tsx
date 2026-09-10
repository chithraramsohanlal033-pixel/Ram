import React, { useState } from 'react';
import {
  X,
  Shield,
  Lock,
  EyeOff,
  Palette,
  Bell,
  LogOut,
  Check,
  UserX,
  Smartphone,
  Key,
} from 'lucide-react';
import { User, ThemeConfig, BlueThemePalette } from '../types';
import { BLUE_THEMES } from '../data/mockData';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onTogglePrivateAccount: () => void;
  blockedUsers: User[];
  onUnblockUser: (userId: string) => void;
  currentThemeKey: BlueThemePalette;
  onSelectTheme: (palette: BlueThemePalette) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onLogout: () => void;
  themeConfig: ThemeConfig;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onTogglePrivateAccount,
  blockedUsers,
  onUnblockUser,
  currentThemeKey,
  onSelectTheme,
  isDarkMode,
  setIsDarkMode,
  onLogout,
  themeConfig,
}) => {
  const [activeSection, setActiveSection] = useState<'privacy' | 'theme' | 'notifications'>('privacy');
  const [notifLikes, setNotifLikes] = useState(true);
  const [notifComments, setNotifComments] = useState(true);
  const [notifMessages, setNotifMessages] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
      <div
        className={`w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border flex flex-col max-h-[85vh] transition-colors ${
          isDarkMode
            ? 'bg-slate-900 border-slate-700 text-slate-100'
            : 'bg-white border-blue-100 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-500" />
            <span className="font-bold text-base md:text-lg">Settings & Security</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
          <button
            onClick={() => setActiveSection('privacy')}
            className={`flex-1 py-3 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition-colors ${
              activeSection === 'privacy'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-400'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Privacy & Safety</span>
          </button>

          <button
            onClick={() => setActiveSection('theme')}
            className={`flex-1 py-3 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition-colors ${
              activeSection === 'theme'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-400'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Blue Design</span>
          </button>

          <button
            onClick={() => setActiveSection('notifications')}
            className={`flex-1 py-3 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition-colors ${
              activeSection === 'notifications'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-400'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Notifications</span>
          </button>
        </div>

        {/* Section Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Privacy & Safety */}
          {activeSection === 'privacy' && (
            <div className="flex flex-col gap-5">
              {/* Private Account Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">Private Account</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
                      When your account is private, only people you approve can see your photos, reels, and stories.
                    </span>
                  </div>
                </div>
                <button
                  onClick={onTogglePrivateAccount}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                    currentUser.isPrivate ? 'bg-blue-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow-md" />
                </button>
              </div>

              {/* Two-Factor Authentication Status */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-emerald-500" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">Two-Factor Authentication</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Enabled via SMS & Authenticator
                    </span>
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                  Active
                </span>
              </div>

              {/* Blocked Accounts List */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <UserX className="w-3.5 h-3.5 text-rose-500" />
                    <span>Blocked Accounts ({blockedUsers.length})</span>
                  </span>
                </div>

                {blockedUsers.length === 0 ? (
                  <div className="p-4 rounded-xl text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40">
                    You haven't blocked any accounts.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                    {blockedUsers.map((b) => (
                      <div key={b.id} className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={b.avatar}
                            alt={b.username}
                            className="w-8 h-8 rounded-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex flex-col">
                            <span className="text-xs font-bold">{b.username}</span>
                            <span className="text-[10px] text-slate-400">{b.fullName}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => onUnblockUser(b.id)}
                          className="text-xs font-semibold text-rose-500 hover:underline px-2 py-1"
                        >
                          Unblock
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Blue Design Customizer */}
          {activeSection === 'theme' && (
            <div className="flex flex-col gap-5">
              {/* Light / Dark Mode Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                <div className="flex flex-col">
                  <span className="text-sm font-bold">App Appearance</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Switch between crisp light mode and deep night blue.
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-700 p-1 rounded-xl">
                  <button
                    onClick={() => setIsDarkMode(false)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      !isDarkMode ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400'
                    }`}
                  >
                    Light
                  </button>
                  <button
                    onClick={() => setIsDarkMode(true)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      isDarkMode ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Dark
                  </button>
                </div>
              </div>

              {/* Blue Palette Selector */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Select Blue Accent Shade
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.values(BLUE_THEMES).map((theme) => {
                    const isSelected = currentThemeKey === theme.id;
                    return (
                      <div
                        key={theme.id}
                        onClick={() => onSelectTheme(theme.id as BlueThemePalette)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/50 dark:bg-blue-950/30'
                            : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${theme.gradient} shadow-md`}
                          />
                          <div className="flex flex-col">
                            <span className="text-xs font-bold">{theme.name}</span>
                            <span className="text-[10px] text-slate-400">Accent {theme.id}</span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Notifications Preferences */}
          {activeSection === 'notifications' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <div className="flex flex-col">
                  <span className="text-xs font-bold">Likes & Reactions</span>
                  <span className="text-[11px] text-slate-400">When someone likes your photos or reels</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifLikes}
                  onChange={(e) => setNotifLikes(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <div className="flex flex-col">
                  <span className="text-xs font-bold">Comments</span>
                  <span className="text-[11px] text-slate-400">When someone comments on your posts</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifComments}
                  onChange={(e) => setNotifComments(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <div className="flex flex-col">
                  <span className="text-xs font-bold">Direct Messages</span>
                  <span className="text-[11px] text-slate-400">Alerts for incoming chat messages</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifMessages}
                  onChange={(e) => setNotifMessages(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer / Logout */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={onLogout}
            className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/20"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
