import React from 'react';
import {
  Home,
  Compass,
  Film,
  MessageCircle,
  Heart,
  PlusSquare,
  User as UserIcon,
  Settings,
  Sun,
  Moon,
  Shield,
  Layers,
} from 'lucide-react';
import { ActiveTab, User, ThemeConfig, BlueThemePalette } from '../types';
import { CosmicLogo } from './CosmicLogo';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: User;
  unreadMessagesCount: number;
  unreadNotificationsCount: number;
  openCreateModal: () => void;
  openSettingsModal: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  themeConfig: ThemeConfig;
  currentThemeKey?: BlueThemePalette;
  onSelectTheme?: (theme: BlueThemePalette) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  unreadMessagesCount,
  unreadNotificationsCount,
  openCreateModal,
  openSettingsModal,
  isDarkMode,
  setIsDarkMode,
  themeConfig,
  currentThemeKey = 'royal',
  onSelectTheme,
}) => {
  const navItems = [
    { id: 'home' as ActiveTab, label: 'Home', icon: Home },
    { id: 'search' as ActiveTab, label: 'Explore', icon: Compass },
    { id: 'reels' as ActiveTab, label: 'Reels', icon: Film },
    {
      id: 'messages' as ActiveTab,
      label: 'Messages',
      icon: MessageCircle,
      badge: unreadMessagesCount,
    },
    {
      id: 'notifications' as ActiveTab,
      label: 'Notifications',
      icon: Heart,
      badge: unreadNotificationsCount,
    },
    { id: 'profile' as ActiveTab, label: 'Profile', icon: UserIcon },
  ];

  const blueSwatches: { id: BlueThemePalette; name: string; bg: string }[] = [
    { id: 'royal', name: 'Royal Cobalt', bg: 'bg-blue-600' },
    { id: 'sapphire', name: 'Deep Sapphire', bg: 'bg-sky-600' },
    { id: 'cyan', name: 'Ocean Azure', bg: 'bg-cyan-600' },
    { id: 'electric', name: 'Electric Blue', bg: 'bg-indigo-600' },
  ];

  return (
    <>
      {/* Desktop & Tablet Sidebar */}
      <aside
        id="desktop-sidebar"
        className={`hidden md:flex flex-col justify-between w-64 lg:w-72 h-screen sticky top-0 border-r px-4 py-6 z-30 transition-colors ${
          isDarkMode
            ? 'bg-slate-950/95 border-slate-800 text-slate-100'
            : 'bg-white/95 border-blue-100/80 text-slate-800'
        } backdrop-blur-md`}
      >
        <div className="flex flex-col gap-6">
          {/* Logo & Brand Identity */}
          <div
            id="brand-header"
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 px-3 py-2 cursor-pointer group"
          >
            <CosmicLogo size="md" />
            <div className="flex flex-col">
              <span
                style={{ fontFamily: "'Grand Hotel', cursive, sans-serif" }}
                className="text-2xl font-normal tracking-wide text-slate-900 dark:text-white leading-tight"
              >
                Instagram
              </span>
              <span className="text-[10px] text-blue-500 font-semibold tracking-wider uppercase">
                Blue Edition
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav id="desktop-nav" className="flex flex-col gap-1.5 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  id={`nav-item-${item.id}`}
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-xl font-medium transition-all ${
                    isActive
                      ? isDarkMode
                        ? 'bg-blue-600/20 text-blue-400 font-semibold shadow-inner'
                        : 'bg-blue-50 text-blue-600 font-semibold shadow-xs'
                      : isDarkMode
                      ? 'text-slate-300 hover:bg-slate-900 hover:text-white'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {item.id === 'profile' ? (
                      <div
                        className={`w-7 h-7 rounded-full overflow-hidden ring-2 ${
                          isActive ? 'ring-blue-500' : 'ring-transparent'
                        }`}
                      >
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.username}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      <div className="relative">
                        <Icon
                          className={`w-5 h-5 transition-transform ${
                            isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                          }`}
                        />
                        {item.badge && item.badge > 0 ? (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-950 animate-pulse" />
                        ) : null}
                      </div>
                    )}
                    <span className="text-sm">{item.label}</span>
                  </div>

                  {item.badge && item.badge > 0 ? (
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-rose-500 text-white shadow-xs">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}

            {/* Create Post Action Button */}
            <button
              id="desktop-create-button"
              onClick={openCreateModal}
              className={`mt-3 flex items-center justify-center gap-2.5 w-full py-3.5 px-4 rounded-xl text-white font-semibold text-sm shadow-md transition-all active:scale-[0.98] bg-gradient-to-r ${themeConfig.gradient} hover:opacity-95 shadow-blue-500/25`}
            >
              <PlusSquare className="w-5 h-5" />
              <span>Create Post</span>
            </button>
          </nav>
        </div>

        {/* Bottom Actions: Theme Toggle & Settings */}
        <div className="flex flex-col gap-2 pt-4 border-t border-slate-200/50 dark:border-slate-800">
          {/* Quick Blue Shades Switcher */}
          {onSelectTheme && (
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-blue-50/70 dark:bg-slate-900/70 border border-blue-100 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-blue-900/80 dark:text-blue-300">Blue Theme</span>
              <div className="flex items-center gap-1.5">
                {blueSwatches.map((swatch) => (
                  <button
                    key={swatch.id}
                    title={swatch.name}
                    onClick={() => onSelectTheme(swatch.id)}
                    className={`w-4 h-4 rounded-full ${swatch.bg} transition-all ${
                      currentThemeKey === swatch.id
                        ? 'scale-125 ring-2 ring-white dark:ring-slate-950 shadow-md ring-offset-1 ring-offset-blue-500'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          <button
            id="desktop-theme-toggle"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-sm transition-colors ${
              isDarkMode
                ? 'text-slate-300 hover:bg-slate-900'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              {isDarkMode ? <Moon className="w-4 h-4 text-blue-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {isDarkMode ? 'Dark' : 'Light'}
            </span>
          </button>

          <button
            id="desktop-settings-button"
            onClick={openSettingsModal}
            className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm transition-colors ${
              isDarkMode
                ? 'text-slate-300 hover:bg-slate-900'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings & Privacy</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header
        id="mobile-header"
        className={`md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 border-b backdrop-blur-md transition-colors ${
          isDarkMode
            ? 'bg-slate-950/90 border-slate-800 text-slate-100'
            : 'bg-white/90 border-blue-100 text-slate-900'
        }`}
      >
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <CosmicLogo size="sm" />
          <span
            style={{ fontFamily: "'Grand Hotel', cursive, sans-serif" }}
            className="text-2xl font-normal tracking-wide text-slate-900 dark:text-white"
          >
            Instagram
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onSelectTheme && (
            <div className="flex items-center gap-1 p-1 rounded-full bg-slate-100 dark:bg-slate-900 mr-1">
              {blueSwatches.map((swatch) => (
                <button
                  key={swatch.id}
                  title={swatch.name}
                  onClick={() => onSelectTheme(swatch.id)}
                  className={`w-3 h-3 rounded-full ${swatch.bg} transition-all ${
                    currentThemeKey === swatch.id
                      ? 'scale-125 ring-1.5 ring-blue-500'
                      : 'opacity-50'
                  }`}
                />
              ))}
            </div>
          )}

          <button
            id="mobile-notifs-btn"
            onClick={() => setActiveTab('notifications')}
            className={`relative p-2 rounded-full transition-colors ${
              activeTab === 'notifications'
                ? 'text-blue-500 bg-blue-50 dark:bg-blue-950/40'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <Heart className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
            )}
          </button>

          <button
            id="mobile-messages-btn"
            onClick={() => setActiveTab('messages')}
            className={`relative p-2 rounded-full transition-colors ${
              activeTab === 'messages'
                ? 'text-blue-500 bg-blue-50 dark:bg-blue-950/40'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            {unreadMessagesCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        id="mobile-bottom-nav"
        className={`md:hidden fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around py-2.5 px-3 border-t backdrop-blur-lg transition-colors ${
          isDarkMode
            ? 'bg-slate-950/95 border-slate-800 text-slate-100'
            : 'bg-white/95 border-slate-200 text-slate-800'
        }`}
      >
        <button
          id="mobile-nav-home"
          onClick={() => setActiveTab('home')}
          className={`p-2 rounded-xl transition-all ${
            activeTab === 'home' ? 'text-blue-600 scale-110' : 'text-slate-500'
          }`}
        >
          <Home className="w-6 h-6 stroke-[2]" />
        </button>

        <button
          id="mobile-nav-search"
          onClick={() => setActiveTab('search')}
          className={`p-2 rounded-xl transition-all ${
            activeTab === 'search' ? 'text-blue-600 scale-110' : 'text-slate-500'
          }`}
        >
          <Compass className="w-6 h-6 stroke-[2]" />
        </button>

        <button
          id="mobile-nav-create"
          onClick={openCreateModal}
          className={`p-2 rounded-2xl bg-gradient-to-tr ${themeConfig.gradient} text-white shadow-md shadow-blue-500/30 active:scale-95`}
        >
          <PlusSquare className="w-6 h-6" />
        </button>

        <button
          id="mobile-nav-reels"
          onClick={() => setActiveTab('reels')}
          className={`p-2 rounded-xl transition-all ${
            activeTab === 'reels' ? 'text-blue-600 scale-110' : 'text-slate-500'
          }`}
        >
          <Film className="w-6 h-6 stroke-[2]" />
        </button>

        <button
          id="mobile-nav-profile"
          onClick={() => setActiveTab('profile')}
          className={`p-1.5 rounded-full transition-all ${
            activeTab === 'profile' ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.username}
            className="w-6 h-6 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        </button>
      </nav>
    </>
  );
};
