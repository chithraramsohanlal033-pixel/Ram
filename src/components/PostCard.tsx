import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  MapPin,
  Check,
  Smile,
  Download,
  Loader2,
} from 'lucide-react';
import { Post, User, ThemeConfig } from '../types';
import { downloadMediaFile } from '../utils/downloadHelper';

interface PostCardProps {
  post: Post;
  currentUser: User;
  onLikeToggle: (postId: string) => void;
  onSaveToggle: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onLikeComment: (postId: string, commentId: string) => void;
  onFollowToggle: (userId: string) => void;
  onOpenShareModal: (post: Post) => void;
  onReportPost: (postId: string) => void;
  onBlockUser: (user: User) => void;
  onShowToast?: (msg: string, type?: 'success' | 'info' | 'warning') => void;
  themeConfig: ThemeConfig;
  isDarkMode: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUser,
  onLikeToggle,
  onSaveToggle,
  onAddComment,
  onLikeComment,
  onFollowToggle,
  onOpenShareModal,
  onReportPost,
  onBlockUser,
  onShowToast,
  themeConfig,
  isDarkMode,
}) => {
  const [commentText, setCommentText] = useState('');
  const [showFullCaption, setShowFullCaption] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Double tap to like
  const handleDoubleTap = () => {
    if (!post.isLiked) {
      onLikeToggle(post.id);
    }
    setShowHeartAnimation(true);
    setTimeout(() => setShowHeartAnimation(false), 800);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(post.id, commentText);
    setCommentText('');
  };

  const handleDownloadPost = async () => {
    if (isDownloading) return;
    const ext = post.mediaType === 'video' ? 'mp4' : 'jpg';
    const filename = `instagram_${post.user.username}_${post.id}.${ext}`;
    
    await downloadMediaFile(
      post.mediaUrl,
      filename,
      () => {
        setIsDownloading(true);
        onShowToast?.('Downloading post media... 📥', 'info');
      },
      () => {
        setIsDownloading(false);
        onShowToast?.('Post downloaded successfully! 💾', 'success');
      },
      () => {
        setIsDownloading(false);
        onShowToast?.('Failed to download post. Please try again.', 'warning');
      }
    );
  };

  const isAuthorCurrentUser = post.userId === currentUser.id;

  return (
    <article
      id={`post-card-${post.id}`}
      className={`w-full rounded-2xl md:rounded-3xl border transition-colors mb-6 overflow-hidden ${
        isDarkMode
          ? 'bg-slate-900/90 border-slate-800/80 text-slate-100'
          : 'bg-white border-blue-100/80 text-slate-900 shadow-xs'
      }`}
    >
      {/* Post Header */}
      <div className="flex items-center justify-between p-3.5 md:p-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-0.5 rounded-full bg-gradient-to-tr ${themeConfig.gradient} shadow-xs cursor-pointer`}
          >
            <div className="p-0.5 bg-white dark:bg-slate-900 rounded-full">
              <img
                src={post.user.avatar}
                alt={post.user.username}
                className="w-10 h-10 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold hover:underline cursor-pointer">
                {post.user.username}
              </span>
              {post.user.isVerified && (
                <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px] font-bold">
                  ✓
                </span>
              )}

              {!isAuthorCurrentUser && (
                <button
                  id={`post-follow-btn-${post.id}`}
                  onClick={() => onFollowToggle(post.userId)}
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full transition-colors ml-1 ${
                    post.user.isFollowedByCurrentUser
                      ? 'text-slate-400 hover:text-rose-500'
                      : 'text-blue-600 dark:text-blue-400 hover:text-blue-700'
                  }`}
                >
                  {post.user.isFollowedByCurrentUser ? 'Following' : '• Follow'}
                </button>
              )}
            </div>

            {post.location && (
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <MapPin className="w-3 h-3 text-blue-500" />
                <span className="truncate max-w-[180px]">{post.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Options Menu Toggle */}
        <div className="relative">
          <button
            id={`post-options-btn-${post.id}`}
            onClick={() => setShowOptionsMenu(!showOptionsMenu)}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {showOptionsMenu && (
            <div
              className={`absolute right-0 top-8 w-44 rounded-xl border shadow-xl z-20 py-1.5 backdrop-blur-md ${
                isDarkMode
                  ? 'bg-slate-900 border-slate-700 text-slate-200'
                  : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  onShowToast?.('Post link copied to clipboard! 📋', 'success');
                  setShowOptionsMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-xs hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center gap-2"
              >
                Copy Post Link
              </button>
              <button
                onClick={() => {
                  onOpenShareModal(post);
                  setShowOptionsMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-xs hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center gap-2"
              >
                Share to Direct
              </button>
              <button
                id={`post-download-option-${post.id}`}
                onClick={() => {
                  handleDownloadPost();
                  setShowOptionsMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-xs hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Media</span>
              </button>
              {!isAuthorCurrentUser && (
                <>
                  <button
                    onClick={() => {
                      onReportPost(post.id);
                      setShowOptionsMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-amber-500 hover:bg-amber-50 dark:hover:bg-slate-800"
                  >
                    Report Post
                  </button>
                  <button
                    onClick={() => {
                      onBlockUser(post.user);
                      setShowOptionsMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800"
                  >
                    Block @{post.user.username}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Media (Image/Video) with Double Tap Support */}
      <div
        id={`post-media-${post.id}`}
        onDoubleClick={handleDoubleTap}
        className="relative w-full aspect-square md:aspect-4/3 bg-slate-950 flex items-center justify-center overflow-hidden cursor-pointer select-none"
      >
        {post.mediaType === 'video' ? (
          <video
            src={post.mediaUrl}
            controls
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={post.mediaUrl}
            alt={post.caption}
            className="w-full h-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        )}

        {/* Double Tap Heart Pop Animation */}
        {showHeartAnimation && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <Heart className="w-24 h-24 text-white fill-rose-500 stroke-rose-500 drop-shadow-2xl animate-ping" />
          </div>
        )}
      </div>

      {/* Post Action Buttons Bar */}
      <div className="p-3.5 md:p-4 pb-2">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-4">
            {/* Like button */}
            <button
              id={`like-btn-${post.id}`}
              onClick={() => onLikeToggle(post.id)}
              className={`transition-transform active:scale-125 ${
                post.isLiked
                  ? 'text-rose-500'
                  : 'text-slate-700 dark:text-slate-300 hover:text-rose-500'
              }`}
            >
              <Heart
                className={`w-6 h-6 transition-all ${
                  post.isLiked ? 'fill-rose-500 stroke-rose-500' : 'stroke-[1.8]'
                }`}
              />
            </button>

            {/* Comment button */}
            <button
              id={`comment-btn-${post.id}`}
              onClick={() => setShowCommentsModal(!showCommentsModal)}
              className="text-slate-700 dark:text-slate-300 hover:text-blue-500 transition-colors"
            >
              <MessageCircle className="w-6 h-6 stroke-[1.8]" />
            </button>

            {/* Share button */}
            <button
              id={`share-btn-${post.id}`}
              onClick={() => onOpenShareModal(post)}
              className="text-slate-700 dark:text-slate-300 hover:text-blue-500 transition-colors"
            >
              <Send className="w-6 h-6 stroke-[1.8]" />
            </button>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Download Media button */}
            <button
              id={`download-btn-${post.id}`}
              onClick={handleDownloadPost}
              disabled={isDownloading}
              title="Download Post"
              className="p-1 rounded-full text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/60 dark:hover:bg-slate-800/60 transition-colors"
            >
              {isDownloading ? (
                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
              ) : (
                <Download className="w-5 h-5 stroke-[1.8]" />
              )}
            </button>

            {/* Bookmark / Save button */}
            <button
              id={`save-btn-${post.id}`}
              onClick={() => onSaveToggle(post.id)}
              className={`p-1 rounded-full transition-colors ${
                post.isSaved
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <Bookmark
                className={`w-5 h-5 ${
                  post.isSaved ? 'fill-blue-600 dark:fill-blue-400 stroke-blue-600' : 'stroke-[1.8]'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Likes Count */}
        <div className="text-sm font-semibold mb-1">
          <span>{post.likesCount.toLocaleString()} likes</span>
        </div>

        {/* Caption & Hashtags */}
        <div className="text-sm mb-2 leading-relaxed">
          <span className="font-bold mr-2 hover:underline cursor-pointer">
            {post.user.username}
          </span>
          <span className="text-slate-700 dark:text-slate-200">
            {showFullCaption || post.caption.length <= 110
              ? post.caption
              : `${post.caption.slice(0, 110)}...`}
          </span>
          {post.caption.length > 110 && !showFullCaption && (
            <button
              onClick={() => setShowFullCaption(true)}
              className="text-xs text-blue-500 font-medium ml-1.5 hover:underline"
            >
              more
            </button>
          )}

          {/* Hashtags */}
          {post.hashtags && post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {post.hashtags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Comments view trigger */}
        {post.comments.length > 0 && (
          <button
            onClick={() => setShowCommentsModal(true)}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 mb-2 block"
          >
            View all {post.comments.length} comments
          </button>
        )}

        {/* Inline recent comments preview */}
        {post.comments.slice(-2).map((comment) => (
          <div key={comment.id} className="flex items-center justify-between text-xs py-0.5">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {comment.username}
              </span>
              <span className="text-slate-600 dark:text-slate-300">{comment.text}</span>
            </div>
            <button
              onClick={() => onLikeComment(post.id, comment.id)}
              className={`p-1 ${comment.isLiked ? 'text-rose-500' : 'text-slate-400'}`}
            >
              <Heart className={`w-3 h-3 ${comment.isLiked ? 'fill-rose-500' : ''}`} />
            </button>
          </div>
        ))}

        {/* Post Timestamp */}
        <div className="text-[11px] text-slate-400 uppercase tracking-wider mt-1.5">
          {post.createdAt}
        </div>
      </div>

      {/* Add Comment Input Bar */}
      <form
        onSubmit={handleCommentSubmit}
        className="flex items-center gap-2 px-4 py-3 border-t border-slate-100 dark:border-slate-800/80"
      >
        <Smile className="w-5 h-5 text-slate-400 hover:text-blue-500 cursor-pointer" />
        <input
          id={`comment-input-${post.id}`}
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a blue comment..."
          className="flex-1 bg-transparent text-xs md:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden"
        />
        {commentText.trim() && (
          <button
            type="submit"
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
          >
            Post
          </button>
        )}
      </form>

      {/* Full Comments Modal Drawer */}
      {showCommentsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end md:items-center justify-center backdrop-blur-xs p-0 md:p-4">
          <div
            className={`w-full max-w-lg rounded-t-3xl md:rounded-3xl max-h-[80vh] flex flex-col overflow-hidden shadow-2xl ${
              isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
              <span className="font-bold text-base">Comments ({post.comments.length})</span>
              <button
                onClick={() => setShowCommentsModal(false)}
                className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800"
              >
                Close
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Post description as original comment */}
              <div className="flex items-start gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <img
                  src={post.user.avatar}
                  alt={post.user.username}
                  className="w-8 h-8 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1">
                  <div className="text-sm">
                    <span className="font-bold mr-1.5">{post.user.username}</span>
                    <span>{post.caption}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">{post.createdAt}</span>
                </div>
              </div>

              {post.comments.map((c) => (
                <div key={c.id} className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={c.userAvatar}
                      alt={c.username}
                      className="w-8 h-8 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="text-sm">
                        <span className="font-bold mr-1.5">{c.username}</span>
                        <span>{c.text}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                        <span>{c.createdAt}</span>
                        <span>{c.likesCount} likes</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onLikeComment(post.id, c.id)}
                    className={`p-1 ${c.isLiked ? 'text-rose-500' : 'text-slate-400'}`}
                  >
                    <Heart className={`w-4 h-4 ${c.isLiked ? 'fill-rose-500' : ''}`} />
                  </button>
                </div>
              ))}
            </div>

            {/* Comment input in modal */}
            <form
              onSubmit={handleCommentSubmit}
              className="flex items-center gap-2 p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
            >
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={`Comment as ${currentUser.username}...`}
                className="flex-1 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </article>
  );
};
