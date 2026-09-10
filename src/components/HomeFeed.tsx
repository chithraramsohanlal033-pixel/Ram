import React from 'react';
import { StoriesBar } from './StoriesBar';
import { PostCard } from './PostCard';
import { Story, Post, User, ThemeConfig } from '../types';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface HomeFeedProps {
  stories: Story[];
  posts: Post[];
  suggestedUsers: User[];
  currentUser: User;
  onOpenStory: (index: number) => void;
  onAddStory: () => void;
  onLikeToggle: (postId: string) => void;
  onSaveToggle: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onLikeComment: (postId: string, commentId: string) => void;
  onFollowToggle: (userId: string) => void;
  onOpenShareModal: (post: Post) => void;
  onReportPost: (postId: string) => void;
  onBlockUser: (user: User) => void;
  onSelectUser: (user: User) => void;
  onShowToast?: (msg: string, type?: 'success' | 'info' | 'warning') => void;
  themeConfig: ThemeConfig;
  isDarkMode: boolean;
}

export const HomeFeed: React.FC<HomeFeedProps> = ({
  stories,
  posts,
  suggestedUsers,
  currentUser,
  onOpenStory,
  onAddStory,
  onLikeToggle,
  onSaveToggle,
  onAddComment,
  onLikeComment,
  onFollowToggle,
  onOpenShareModal,
  onReportPost,
  onBlockUser,
  onSelectUser,
  onShowToast,
  themeConfig,
  isDarkMode,
}) => {
  return (
    <div className="flex justify-center w-full min-h-screen py-2 md:py-6 px-0 md:px-4">
      {/* Center Feed Column */}
      <div className="w-full max-w-[500px] lg:max-w-[560px] flex flex-col">
        {/* Stories Bar */}
        <div className="mb-4 rounded-2xl overflow-hidden shadow-xs">
          <StoriesBar
            stories={stories}
            currentUser={currentUser}
            onOpenStory={onOpenStory}
            onAddStory={onAddStory}
            themeConfig={themeConfig}
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Posts List */}
        <div className="flex flex-col">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUser={currentUser}
              onLikeToggle={onLikeToggle}
              onSaveToggle={onSaveToggle}
              onAddComment={onAddComment}
              onLikeComment={onLikeComment}
              onFollowToggle={onFollowToggle}
              onOpenShareModal={onOpenShareModal}
              onReportPost={onReportPost}
              onBlockUser={onBlockUser}
              onShowToast={onShowToast}
              themeConfig={themeConfig}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>

        {/* End of Feed Message */}
        <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="text-base font-semibold text-slate-700 dark:text-slate-300">
            You're all caught up!
          </span>
          <span className="text-xs text-slate-400 mt-1 max-w-xs">
            You have seen all new posts from the last 3 days in your Instagram network.
          </span>
        </div>
      </div>

      {/* Right Desktop Suggestions Sidebar */}
      <div className="hidden xl:flex flex-col w-80 pl-8 pt-4 gap-6">
        {/* Current User Summary Card */}
        <div
          id="user-summary-card"
          className={`flex items-center justify-between p-3.5 rounded-2xl border transition-colors ${
            isDarkMode
              ? 'bg-slate-900/60 border-slate-800'
              : 'bg-white border-blue-100/80 shadow-xs'
          }`}
        >
          <div
            onClick={() => onSelectUser(currentUser)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.username}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-500 transition-colors">
                {currentUser.username}
              </span>
              <span className="text-xs text-slate-400 truncate max-w-[130px]">
                {currentUser.fullName}
              </span>
            </div>
          </div>
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
            Online
          </span>
        </div>

        {/* Suggestions For You */}
        <div
          className={`p-4 rounded-2xl border transition-colors ${
            isDarkMode
              ? 'bg-slate-900/60 border-slate-800'
              : 'bg-white border-blue-100/80 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Suggested For You
            </span>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
              See All
            </span>
          </div>

          <div className="flex flex-col gap-3.5">
            {suggestedUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between gap-2">
                <div
                  onClick={() => onSelectUser(user)}
                  className="flex items-center gap-2.5 cursor-pointer min-w-0"
                >
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate hover:underline">
                      {user.username}
                    </span>
                    <span className="text-[11px] text-slate-400 truncate">
                      {user.followersCount > 1000
                        ? `${(user.followersCount / 1000).toFixed(1)}k followers`
                        : `${user.followersCount} followers`}
                    </span>
                  </div>
                </div>

                <button
                  id={`suggested-follow-${user.id}`}
                  onClick={() => onFollowToggle(user.id)}
                  className={`text-xs font-semibold px-3 py-1 rounded-full transition-all flex-shrink-0 ${
                    user.isFollowedByCurrentUser
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                  }`}
                >
                  {user.isFollowedByCurrentUser ? 'Following' : 'Follow'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Brand Footer */}
        <div className="px-2 text-[11px] text-slate-400 leading-relaxed flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-blue-500 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Instagram Security & Privacy Verified</span>
          </div>
          <div className="flex flex-wrap gap-x-2 gap-y-1">
            <span className="hover:underline cursor-pointer">About</span> •
            <span className="hover:underline cursor-pointer">Help</span> •
            <span className="hover:underline cursor-pointer">Press</span> •
            <span className="hover:underline cursor-pointer">API</span> •
            <span className="hover:underline cursor-pointer">Privacy</span> •
            <span className="hover:underline cursor-pointer">Terms</span>
          </div>
          <span>© 2026 INSTAGRAM • BLUE EDITION</span>
        </div>
      </div>
    </div>
  );
};
