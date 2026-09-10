import React, { useState, useMemo } from 'react';
import { Search, Heart, MessageCircle, X, Hash, User as UserIcon, Download, Loader2 } from 'lucide-react';
import { User, Post, ThemeConfig } from '../types';
import { EXPLORE_CATEGORIES, EXPLORE_POSTS } from '../data/mockData';
import { downloadMediaFile } from '../utils/downloadHelper';

interface ExploreViewProps {
  users: User[];
  posts: Post[];
  onSelectUser: (user: User) => void;
  onSelectPost: (post: Post) => void;
  themeConfig: ThemeConfig;
  isDarkMode: boolean;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  users,
  posts,
  onSelectUser,
  onSelectPost,
  themeConfig,
  isDarkMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('For You');
  const [previewMedia, setPreviewMedia] = useState<{
    url: string;
    likes: number;
    comments: number;
    tag?: string;
  } | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadExploreMedia = async () => {
    if (!previewMedia || isDownloading) return;
    setIsDownloading(true);
    const filename = `instagram_explore_${Date.now()}.jpg`;
    await downloadMediaFile(
      previewMedia.url,
      filename,
      () => {},
      () => setIsDownloading(false),
      () => setIsDownloading(false)
    );
  };

  // Filtered users matching search
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().replace('@', '');
    return users.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.fullName.toLowerCase().includes(q) ||
        u.bio.toLowerCase().includes(q)
    );
  }, [searchQuery, users]);

  // Filtered hashtags matching search
  const matchingHashtags = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().replace('#', '');
    const tags = ['azure', 'oceanvibes', 'techvibes', 'design', 'travelgram', 'bluemood', 'coding', 'minimalism'];
    return tags.filter((t) => t.includes(q));
  }, [searchQuery]);

  // Filtered posts matching search or active category
  const filteredExplorePosts = useMemo(() => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return EXPLORE_POSTS.filter((p) => p.tag?.toLowerCase().includes(q));
    }
    if (selectedCategory === 'For You') return EXPLORE_POSTS;
    return EXPLORE_POSTS.filter((p) => p.tag === selectedCategory);
  }, [searchQuery, selectedCategory]);

  return (
    <div
      id="explore-view"
      className="w-full max-w-5xl mx-auto px-3 md:px-6 py-4 md:py-8 flex flex-col gap-6"
    >
      {/* Search Input Bar */}
      <div className="relative w-full max-w-xl mx-auto">
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${
            isDarkMode
              ? 'bg-slate-900 border-slate-700 text-slate-100 focus-within:border-blue-500'
              : 'bg-white border-blue-200 text-slate-800 shadow-xs focus-within:border-blue-500'
          }`}
        >
          <Search className="w-5 h-5 text-blue-500 flex-shrink-0" />
          <input
            id="explore-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users, hashtags (#ocean), or topics..."
            className="w-full bg-transparent text-sm focus:outline-hidden placeholder-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Live Search Results Dropdown */}
        {searchQuery.trim() && (
          <div
            className={`absolute top-14 left-0 right-0 z-30 rounded-2xl border shadow-xl overflow-hidden max-h-96 overflow-y-auto ${
              isDarkMode
                ? 'bg-slate-900 border-slate-700 text-slate-100'
                : 'bg-white border-blue-100 text-slate-800'
            }`}
          >
            {/* Users section */}
            {filteredUsers.length > 0 && (
              <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2 flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-blue-500" />
                  <span>Accounts</span>
                </div>
                {filteredUsers.map((u) => (
                  <div
                    key={u.id}
                    onClick={() => {
                      onSelectUser(u);
                      setSearchQuery('');
                    }}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                  >
                    <img
                      src={u.avatar}
                      alt={u.username}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-blue-500/30"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold flex items-center gap-1">
                        {u.username}
                        {u.isVerified && (
                          <span className="text-blue-500 text-xs">✓</span>
                        )}
                      </span>
                      <span className="text-xs text-slate-400">{u.fullName}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Hashtags section */}
            {matchingHashtags.length > 0 && (
              <div className="p-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-blue-500" />
                  <span>Hashtags</span>
                </div>
                {matchingHashtags.map((tag) => (
                  <div
                    key={tag}
                    onClick={() => setSearchQuery(`#${tag}`)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        #
                      </div>
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        #{tag}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">Trending on Instagram</span>
                  </div>
                ))}
              </div>
            )}

            {filteredUsers.length === 0 && matchingHashtags.length === 0 && (
              <div className="p-6 text-center text-sm text-slate-400">
                No accounts or tags found matching "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {EXPLORE_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? `bg-gradient-to-r ${themeConfig.gradient} text-white shadow-md shadow-blue-500/20 scale-105`
                : isDarkMode
                ? 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                : 'bg-white border border-blue-100 text-slate-600 hover:bg-blue-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Posts & Media */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-4">
        {filteredExplorePosts.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => setPreviewMedia({
              url: item.mediaUrl,
              likes: item.likesCount,
              comments: item.commentsCount,
              tag: item.tag,
            })}
            className={`group relative aspect-square rounded-2xl md:rounded-3xl overflow-hidden bg-slate-900 cursor-pointer shadow-xs ${
              idx % 5 === 0 ? 'col-span-2 row-span-2 sm:col-span-1 sm:row-span-1' : ''
            }`}
          >
            <img
              src={item.mediaUrl}
              alt="Explore media"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              referrerPolicy="no-referrer"
            />

            {/* Hover overlay with like & comment counts */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold text-sm backdrop-blur-xs">
              <div className="flex items-center gap-1.5">
                <Heart className="w-5 h-5 fill-white" />
                <span>{item.likesCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>{item.commentsCount}</span>
              </div>
            </div>

            {/* Tag chip at bottom */}
            {item.tag && (
              <span className="absolute bottom-2 left-2 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-md text-white text-[10px] font-semibold">
                {item.tag}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Media Detail Lightbox Modal */}
      {previewMedia && (
        <div
          onClick={() => setPreviewMedia(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
          >
            <button
              onClick={() => setPreviewMedia(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/80"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewMedia.url}
              alt="Preview"
              className="w-full max-h-[70vh] object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="p-4 flex items-center justify-between text-white bg-slate-950">
              <div className="flex items-center gap-4 text-sm font-semibold">
                <span className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                  {previewMedia.likes.toLocaleString()} likes
                </span>
                <span className="flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-blue-400" />
                  {previewMedia.comments} comments
                </span>
              </div>
              <div className="flex items-center gap-3">
                {previewMedia.tag && (
                  <span className="text-xs text-blue-400 font-semibold">
                    {previewMedia.tag}
                  </span>
                )}
                <button
                  id="explore-download-btn"
                  onClick={handleDownloadExploreMedia}
                  disabled={isDownloading}
                  title="Download Media"
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  {isDownloading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
