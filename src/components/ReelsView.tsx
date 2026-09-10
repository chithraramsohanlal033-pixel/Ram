import React, { useState, useRef, useEffect } from 'react';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Music,
  ChevronUp,
  ChevronDown,
  Plus,
  Download,
  Loader2,
} from 'lucide-react';
import { Reel, User, ThemeConfig } from '../types';
import { downloadMediaFile } from '../utils/downloadHelper';

interface ReelsViewProps {
  reels: Reel[];
  currentUser: User;
  onLikeToggle: (reelId: string) => void;
  onSaveToggle: (reelId: string) => void;
  onAddComment: (reelId: string, text: string) => void;
  onFollowToggle: (userId: string) => void;
  onOpenShareModal: (reel: Reel) => void;
  onOpenUploadReel: () => void;
  onShowToast?: (msg: string, type?: 'success' | 'info' | 'warning') => void;
  themeConfig: ThemeConfig;
  isDarkMode: boolean;
}

export const ReelsView: React.FC<ReelsViewProps> = ({
  reels,
  currentUser,
  onLikeToggle,
  onSaveToggle,
  onAddComment,
  onFollowToggle,
  onOpenShareModal,
  onOpenUploadReel,
  onShowToast,
  themeConfig,
  isDarkMode,
}) => {
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const currentReel = reels[activeReelIndex] || reels[0];

  const handleDownloadReel = async () => {
    if (isDownloading || !currentReel) return;
    const filename = `instagram_reel_${currentReel.user.username}_${currentReel.id}.mp4`;
    await downloadMediaFile(
      currentReel.videoUrl,
      filename,
      () => {
        setIsDownloading(true);
        onShowToast?.('Downloading reel video... 📥', 'info');
      },
      () => {
        setIsDownloading(false);
        onShowToast?.('Reel video saved to downloads! 🎥', 'success');
      },
      () => {
        setIsDownloading(false);
        onShowToast?.('Failed to download reel video.', 'warning');
      }
    );
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Auto-play might be blocked without user gesture
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  }, [activeReelIndex]);

  const handleVideoClick = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleNext = () => {
    if (activeReelIndex < reels.length - 1) {
      setActiveReelIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeReelIndex > 0) {
      setActiveReelIndex((prev) => prev - 1);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(currentReel.id, commentText);
    setCommentText('');
  };

  return (
    <div
      id="reels-container"
      className="relative flex items-center justify-center w-full min-h-[calc(100vh-60px)] md:min-h-screen py-2 md:py-4 select-none"
    >
      {/* Upload Reel Floating Action */}
      <button
        onClick={onOpenUploadReel}
        className={`hidden md:flex items-center gap-2 absolute top-6 right-8 px-4 py-2 rounded-full font-semibold text-xs text-white shadow-lg z-20 bg-gradient-to-r ${themeConfig.gradient} hover:scale-105 transition-transform`}
      >
        <Plus className="w-4 h-4 stroke-[3]" />
        <span>Post Reel</span>
      </button>

      {/* Vertical Navigation Buttons for Desktop */}
      <div className="hidden md:flex flex-col gap-3 absolute right-6 md:right-16 top-1/2 -translate-y-1/2 z-20">
        <button
          onClick={handlePrev}
          disabled={activeReelIndex === 0}
          className="p-3 rounded-full bg-slate-800/80 text-white disabled:opacity-20 hover:bg-slate-700 transition-all shadow-md"
          title="Previous Reel"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <span className="text-xs font-mono text-center text-slate-400">
          {activeReelIndex + 1}/{reels.length}
        </span>
        <button
          onClick={handleNext}
          disabled={activeReelIndex === reels.length - 1}
          className="p-3 rounded-full bg-slate-800/80 text-white disabled:opacity-20 hover:bg-slate-700 transition-all shadow-md"
          title="Next Reel"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Reel Card */}
      <div
        id={`reel-card-${currentReel.id}`}
        className="relative w-full max-w-sm h-[78vh] md:h-[84vh] md:max-h-[780px] rounded-3xl overflow-hidden bg-black shadow-2xl flex items-center justify-center border border-white/10"
      >
        {/* Video Element */}
        <video
          ref={videoRef}
          src={currentReel.videoUrl}
          poster={currentReel.posterUrl}
          loop
          playsInline
          muted={isMuted}
          onClick={handleVideoClick}
          className="w-full h-full object-cover cursor-pointer"
        />

        {/* Play/Pause overlay indicator when clicked */}
        {!isPlaying && (
          <div
            onClick={handleVideoClick}
            className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer pointer-events-none"
          >
            <div className="p-4 rounded-full bg-black/60 text-white">
              <Play className="w-10 h-10 fill-white" />
            </div>
          </div>
        )}

        {/* Top Control Bar: Audio Mute */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Bottom Details (User info, caption, audio ticker) */}
        <div className="absolute bottom-0 left-0 right-14 p-4 pb-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 flex flex-col gap-2.5">
          {/* User Info & Follow Button */}
          <div className="flex items-center gap-2.5">
            <img
              src={currentReel.user.avatar}
              alt={currentReel.user.username}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-400"
              referrerPolicy="no-referrer"
            />
            <span className="text-sm font-bold text-white drop-shadow-sm">
              {currentReel.user.username}
            </span>

            {currentReel.userId !== currentUser.id && (
              <button
                onClick={() => onFollowToggle(currentReel.userId)}
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border transition-all ${
                  currentReel.user.isFollowedByCurrentUser
                    ? 'border-white/30 text-white/80'
                    : 'bg-blue-600 border-transparent text-white hover:bg-blue-500'
                }`}
              >
                {currentReel.user.isFollowedByCurrentUser ? 'Following' : 'Follow'}
              </button>
            )}
          </div>

          {/* Caption */}
          <p className="text-xs md:text-sm text-white/90 line-clamp-2 leading-relaxed">
            {currentReel.caption}
          </p>

          {/* Audio Ticker Marquee */}
          <div className="flex items-center gap-2 text-xs text-blue-200">
            <Music className="w-3.5 h-3.5 flex-shrink-0 animate-bounce" />
            <span className="truncate max-w-[220px] font-medium">{currentReel.musicTitle}</span>
          </div>
        </div>

        {/* Right Vertical Action Bar (Like, Comment, Share, Save) */}
        <div className="absolute right-3 bottom-8 flex flex-col items-center gap-4 z-10">
          {/* Like */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => onLikeToggle(currentReel.id)}
              className={`p-2 rounded-full bg-black/40 backdrop-blur-md transition-transform active:scale-125 ${
                currentReel.isLiked ? 'text-rose-500' : 'text-white'
              }`}
            >
              <Heart
                className={`w-6 h-6 ${
                  currentReel.isLiked ? 'fill-rose-500 stroke-rose-500' : ''
                }`}
              />
            </button>
            <span className="text-[11px] font-semibold text-white">
              {currentReel.likesCount.toLocaleString()}
            </span>
          </div>

          {/* Comments */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => setShowComments(true)}
              className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:text-blue-400 transition-colors"
            >
              <MessageCircle className="w-6 h-6" />
            </button>
            <span className="text-[11px] font-semibold text-white">
              {currentReel.commentsCount}
            </span>
          </div>

          {/* Share */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => onOpenShareModal(currentReel)}
              className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:text-blue-400 transition-colors"
            >
              <Send className="w-6 h-6" />
            </button>
            <span className="text-[11px] font-semibold text-white">Share</span>
          </div>

          {/* Save */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => onSaveToggle(currentReel.id)}
              className={`p-2 rounded-full bg-black/40 backdrop-blur-md transition-colors ${
                currentReel.isSaved ? 'text-blue-400' : 'text-white'
              }`}
            >
              <Bookmark
                className={`w-6 h-6 ${
                  currentReel.isSaved ? 'fill-blue-400 stroke-blue-400' : ''
                }`}
              />
            </button>
            <span className="text-[11px] font-semibold text-white">Save</span>
          </div>

          {/* Download Reel Video */}
          <div className="flex flex-col items-center gap-1">
            <button
              id={`download-reel-btn-${currentReel.id}`}
              onClick={handleDownloadReel}
              disabled={isDownloading}
              title="Download Reel Video"
              className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:text-blue-400 transition-transform active:scale-110"
            >
              {isDownloading ? (
                <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
              ) : (
                <Download className="w-6 h-6" />
              )}
            </button>
            <span className="text-[11px] font-semibold text-white">Download</span>
          </div>

          {/* Rotating vinyl music disc */}
          <div className="w-8 h-8 rounded-full border-2 border-white/40 p-0.5 mt-2 animate-spin duration-3000">
            <img
              src={currentReel.user.avatar}
              alt="audio"
              className="w-full h-full rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Comments Drawer Modal */}
        {showComments && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-30 flex flex-col justify-between p-4 rounded-3xl animate-slide-up">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-white font-bold text-sm">
                Comments ({currentReel.comments.length})
              </span>
              <button
                onClick={() => setShowComments(false)}
                className="text-xs text-white/70 px-2 py-1 rounded-full bg-white/10"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-3">
              {currentReel.comments.length === 0 ? (
                <div className="text-center text-white/50 text-xs py-8">
                  No comments yet. Be the first to comment!
                </div>
              ) : (
                currentReel.comments.map((c) => (
                  <div key={c.id} className="flex items-start gap-2.5 text-xs text-white">
                    <img
                      src={c.userAvatar}
                      alt={c.username}
                      className="w-7 h-7 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1">
                      <span className="font-bold mr-1">{c.username}</span>
                      <span className="text-white/80">{c.text}</span>
                      <div className="text-[10px] text-white/40 mt-0.5">{c.createdAt}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 pt-2 border-t border-white/10">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment to reel..."
                className="flex-1 px-3 py-2 rounded-full bg-white/15 text-white text-xs placeholder-white/50 focus:outline-hidden focus:ring-1 focus:ring-blue-400"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-3 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold disabled:opacity-50"
              >
                Post
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
