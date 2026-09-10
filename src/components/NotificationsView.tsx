import React, { useState } from 'react';
import { Heart, MessageCircle, UserPlus, Check, Bell } from 'lucide-react';
import { AppNotification, User, ThemeConfig } from '../types';

interface NotificationsViewProps {
  notifications: AppNotification[];
  onFollowToggle: (userId: string) => void;
  onMarkAllAsRead: () => void;
  onSelectUser: (user: User) => void;
  themeConfig: ThemeConfig;
  isDarkMode: boolean;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onFollowToggle,
  onMarkAllAsRead,
  onSelectUser,
  themeConfig,
  isDarkMode,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'like' | 'comment' | 'follow'>('all');

  const filteredNotifications = notifications.filter((notif) => {
    if (activeFilter === 'all') return true;
    return notif.type === activeFilter;
  });

  return (
    <div
      id="notifications-view"
      className="w-full max-w-2xl mx-auto px-4 py-4 md:py-8 flex flex-col gap-4"
    >
      {/* Header with Title and Mark As Read */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Notifications</h1>
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 font-semibold">
            {notifications.filter((n) => !n.isRead).length} new
          </span>
        </div>

        <button
          onClick={onMarkAllAsRead}
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Mark all as read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {[
          { id: 'all', label: 'All Activity' },
          { id: 'like', label: 'Likes ❤️' },
          { id: 'comment', label: 'Comments 💬' },
          { id: 'follow', label: 'Follows 👤' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === tab.id
                ? `bg-gradient-to-r ${themeConfig.gradient} text-white shadow-xs`
                : isDarkMode
                ? 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                : 'bg-slate-100 text-slate-600 hover:bg-blue-50 border border-slate-200/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div
        className={`rounded-2xl border overflow-hidden divide-y transition-colors ${
          isDarkMode
            ? 'bg-slate-900/80 border-slate-800 divide-slate-800'
            : 'bg-white border-blue-100/80 divide-slate-100 shadow-xs'
        }`}
      >
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center">
            <Bell className="w-8 h-8 text-blue-400 mb-2 opacity-60" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No notifications yet
            </span>
            <span className="text-xs text-slate-400 mt-0.5">
              When friends like, comment or follow you, you'll see them here.
            </span>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`flex items-center justify-between p-3.5 md:p-4 gap-3 transition-colors ${
                !notif.isRead
                  ? isDarkMode
                    ? 'bg-blue-950/20'
                    : 'bg-blue-50/40'
                  : ''
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Actor Avatar with Type Badge */}
                <div className="relative flex-shrink-0">
                  <img
                    src={notif.actor.avatar}
                    alt={notif.actor.username}
                    onClick={() => onSelectUser(notif.actor)}
                    className="w-11 h-11 rounded-full object-cover cursor-pointer ring-1 ring-blue-500/20"
                    referrerPolicy="no-referrer"
                  />
                  <div
                    className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] shadow-xs ${
                      notif.type === 'like'
                        ? 'bg-rose-500'
                        : notif.type === 'comment'
                        ? 'bg-blue-500'
                        : 'bg-sky-500'
                    }`}
                  >
                    {notif.type === 'like' && <Heart className="w-3 h-3 fill-white" />}
                    {notif.type === 'comment' && <MessageCircle className="w-3 h-3 fill-white" />}
                    {notif.type === 'follow' && <UserPlus className="w-3 h-3" />}
                  </div>
                </div>

                {/* Notification Text */}
                <div className="flex flex-col min-w-0 text-xs md:text-sm">
                  <div className="leading-snug">
                    <span
                      onClick={() => onSelectUser(notif.actor)}
                      className="font-bold hover:underline cursor-pointer mr-1"
                    >
                      {notif.actor.username}
                    </span>
                    <span className="text-slate-600 dark:text-slate-300">
                      {notif.type === 'like' && 'liked your post.'}
                      {notif.type === 'comment' && `commented: "${notif.commentText || ''}"`}
                      {notif.type === 'follow' && 'started following you.'}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5">{notif.createdAt}</span>
                </div>
              </div>

              {/* Action: Post Thumbnail or Follow Back */}
              <div className="flex-shrink-0">
                {notif.type === 'follow' ? (
                  <button
                    onClick={() => onFollowToggle(notif.actor.id)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                      notif.actor.isFollowedByCurrentUser
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                    }`}
                  >
                    {notif.actor.isFollowedByCurrentUser ? 'Following' : 'Follow Back'}
                  </button>
                ) : notif.postMedia ? (
                  <img
                    src={notif.postMedia}
                    alt="post thumbnail"
                    className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                    referrerPolicy="no-referrer"
                  />
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
