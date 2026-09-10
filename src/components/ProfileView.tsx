import React, { useState } from 'react';
import {
  Grid,
  Film,
  Bookmark,
  UserCheck,
  Settings,
  Edit3,
  ExternalLink,
  Shield,
  Heart,
  MessageCircle,
  Plus,
  X,
} from 'lucide-react';
import { User, Post, Reel, ThemeConfig } from '../types';

interface ProfileViewProps {
  user: User;
  currentUser: User;
  userPosts: Post[];
  userReels: Reel[];
  savedPosts: Post[];
  onFollowToggle: (userId: string) => void;
  onOpenEditProfile: () => void;
  onOpenSettings: () => void;
  onSelectPost: (post: Post) => void;
  themeConfig: ThemeConfig;
  isDarkMode: boolean;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  currentUser,
  userPosts,
  userReels,
  savedPosts,
  onFollowToggle,
  onOpenEditProfile,
  onOpenSettings,
  onSelectPost,
  themeConfig,
  isDarkMode,
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'saved'>('posts');
  const [activeHighlight, setActiveHighlight] = useState<{ title: string; image: string } | null>(null);
  const isMe = user.id === currentUser.id;

  const highlights = [
    { title: 'Travel ✈️', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80' },
    { title: 'Tech 💻', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80' },
    { title: 'Blue 🌊', image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&auto=format&fit=crop&q=80' },
    { title: 'Design 🎨', image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80' },
  ];

  return (
    <div
      id="profile-view"
      className="w-full max-w-4xl mx-auto px-4 py-4 md:py-8 flex flex-col gap-6"
    >
      {/* Profile Header Block */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 pb-6 border-b border-slate-200 dark:border-slate-800">
        {/* Avatar with Gradient Ring */}
        <div className="relative">
          <div
            className={`p-1 rounded-full bg-gradient-to-tr ${themeConfig.gradient} shadow-lg shadow-blue-500/20`}
          >
            <div className="p-1 bg-white dark:bg-slate-950 rounded-full">
              <img
                src={user.avatar}
                alt={user.username}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          {user.isPrivate && (
            <span
              title="Private Account"
              className="absolute bottom-1 right-1 p-1.5 bg-slate-800 text-white rounded-full ring-2 ring-white dark:ring-slate-950 shadow-md"
            >
              <Shield className="w-4 h-4 text-blue-400" />
            </span>
          )}
        </div>

        {/* User Details & Actions */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-3.5">
          {/* Username & Action Buttons */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-1.5">
              {user.username}
              {user.isVerified && (
                <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold">
                  ✓
                </span>
              )}
            </h1>

            {isMe ? (
              <div className="flex items-center gap-2">
                <button
                  id="profile-edit-btn"
                  onClick={onOpenEditProfile}
                  className="px-4 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5 text-blue-500" />
                  <span>Edit Profile</span>
                </button>
                <button
                  id="profile-settings-btn"
                  onClick={onOpenSettings}
                  className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
                  title="Settings & Privacy"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onFollowToggle(user.id)}
                  className={`px-5 py-1.5 rounded-xl font-semibold text-xs shadow-xs transition-all ${
                    user.isFollowedByCurrentUser
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25'
                  }`}
                >
                  {user.isFollowedByCurrentUser ? 'Following' : 'Follow'}
                </button>
                <button
                  onClick={() => alert(`Direct Message started with @${user.username}`)}
                  className="px-4 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Message
                </button>
              </div>
            )}
          </div>

          {/* Stats: Posts, Followers, Following */}
          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="font-bold text-slate-900 dark:text-slate-100 mr-1">
                {userPosts.length}
              </span>
              <span className="text-slate-500 dark:text-slate-400">posts</span>
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-slate-100 mr-1">
                {user.followersCount.toLocaleString()}
              </span>
              <span className="text-slate-500 dark:text-slate-400">followers</span>
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-slate-100 mr-1">
                {user.followingCount.toLocaleString()}
              </span>
              <span className="text-slate-500 dark:text-slate-400">following</span>
            </div>
          </div>

          {/* Bio & Link */}
          <div className="flex flex-col text-xs md:text-sm max-w-md">
            <span className="font-bold text-slate-900 dark:text-slate-100">
              {user.fullName}
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-0.5">
              {user.bio}
            </p>
            {user.website && (
              <a
                href={user.website}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1 mt-1 hover:underline text-xs"
              >
                <ExternalLink className="w-3 h-3" />
                <span>{user.website.replace('https://', '')}</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Story Highlights Circles */}
      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-2">
        {highlights.map((h, i) => (
          <div
            key={i}
            id={`highlight-${i}`}
            onClick={() => setActiveHighlight(h)}
            className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group"
          >
            <div className="p-0.5 rounded-full border-2 border-slate-200 dark:border-slate-700 group-hover:border-blue-500 transition-colors">
              <div className="p-0.5 bg-white dark:bg-slate-950 rounded-full">
                <img
                  src={h.image}
                  alt={h.title}
                  className="w-14 h-14 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              {h.title}
            </span>
          </div>
        ))}
      </div>

      {/* Profile Navigation Tabs (Posts / Reels / Saved) */}
      <div className="flex items-center justify-center border-t border-slate-200 dark:border-slate-800 mt-2">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center gap-2 py-3 px-6 text-xs font-bold uppercase tracking-wider transition-colors border-t-2 ${
            activeTab === 'posts'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Posts ({userPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reels')}
          className={`flex items-center gap-2 py-3 px-6 text-xs font-bold uppercase tracking-wider transition-colors border-t-2 ${
            activeTab === 'reels'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Reels ({userReels.length})</span>
        </button>

        {isMe && (
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-2 py-3 px-6 text-xs font-bold uppercase tracking-wider transition-colors border-t-2 ${
              activeTab === 'saved'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved ({savedPosts.length})</span>
          </button>
        )}
      </div>

      {/* Tab Content 3-Column Grid */}
      {activeTab === 'posts' && (
        <div className="grid grid-cols-3 gap-1 md:gap-4">
          {userPosts.length === 0 ? (
            <div className="col-span-3 py-12 text-center text-slate-400">
              No posts published yet.
            </div>
          ) : (
            userPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => onSelectPost(post)}
                className="group relative aspect-square bg-slate-900 rounded-lg md:rounded-2xl overflow-hidden cursor-pointer shadow-xs"
              >
                <img
                  src={post.mediaUrl}
                  alt={post.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-bold text-xs md:text-sm">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 fill-white" />
                    <span>{post.likesCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>{post.comments.length}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'reels' && (
        <div className="grid grid-cols-3 gap-1 md:gap-4">
          {userReels.length === 0 ? (
            <div className="col-span-3 py-12 text-center text-slate-400">
              No reels shared yet.
            </div>
          ) : (
            userReels.map((reel) => (
              <div
                key={reel.id}
                className="group relative aspect-[9/16] bg-slate-900 rounded-lg md:rounded-2xl overflow-hidden cursor-pointer shadow-xs"
              >
                <video
                  src={reel.videoUrl}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs font-semibold drop-shadow-md">
                  <Film className="w-3.5 h-3.5" />
                  <span>{reel.viewsCount.toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="grid grid-cols-3 gap-1 md:gap-4">
          {savedPosts.length === 0 ? (
            <div className="col-span-3 py-12 text-center text-slate-400">
              No saved posts yet. Save posts you want to revisit.
            </div>
          ) : (
            savedPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => onSelectPost(post)}
                className="group relative aspect-square bg-slate-900 rounded-lg md:rounded-2xl overflow-hidden cursor-pointer shadow-xs"
              >
                <img
                  src={post.mediaUrl}
                  alt={post.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))
          )}
        </div>
      )}
      {/* Active Highlight Story Modal */}
      {activeHighlight && (
        <div
          id="profile-highlight-modal"
          onClick={() => setActiveHighlight(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm h-[600px] rounded-3xl overflow-hidden bg-slate-950 flex flex-col justify-between shadow-2xl border border-blue-500/30"
          >
            {/* Top Bar with Story Progress Bar & User Info */}
            <div className="relative z-10 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden mb-3">
                <div className="h-full bg-blue-500 w-full animate-pulse" />
              </div>
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2.5">
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold">{user.username}</span>
                    <span className="text-[10px] text-blue-300 font-semibold">{activeHighlight.title}</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveHighlight(null)}
                  className="p-1 rounded-full bg-black/40 hover:bg-black/70 text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main Image */}
            <div className="absolute inset-0 z-0">
              <img
                src={activeHighlight.image}
                alt={activeHighlight.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Bottom Caption Pill */}
            <div className="relative z-10 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-center">
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-600/70 backdrop-blur-md text-white font-semibold text-xs border border-blue-400/40">
                {activeHighlight.title}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
