import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Heart, Send, Eye, Pause, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { Story, User } from '../types';

interface StoryViewerModalProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
  currentUser: User;
  onSendStoryReply: (storyUser: User, text: string) => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  stories,
  initialIndex,
  onClose,
  currentUser,
  onSendStoryReply,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [liked, setLiked] = useState(false);
  const [showFeedback, setShowFeedback] = useState<string | null>(null);

  const currentStory = stories[currentIndex] || stories[0];
  const isCurrentUserStory = currentStory.userId === currentUser.id;

  const handleNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
      setLiked(false);
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
      setLiked(false);
    }
  }, [currentIndex]);

  // Story auto-advance timer
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 2; // ~5 seconds duration
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused, handleNext]);

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, handleNext, handlePrev]);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onSendStoryReply(currentStory.user, replyText);
    setShowFeedback(`Sent to ${currentStory.user.username}`);
    setReplyText('');
    setTimeout(() => setShowFeedback(null), 2500);
  };

  const handleReaction = (emoji: string) => {
    onSendStoryReply(currentStory.user, `Reacted with ${emoji} to your story`);
    setShowFeedback(`Reacted with ${emoji}`);
    setTimeout(() => setShowFeedback(null), 2000);
  };

  return (
    <div
      id="story-viewer-modal"
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-md"
    >
      {/* Navigation Buttons for Desktop */}
      <button
        id="story-prev-arrow"
        onClick={handlePrev}
        disabled={currentIndex === 0}
        className="hidden md:flex absolute left-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <button
        id="story-next-arrow"
        onClick={handleNext}
        className="hidden md:flex absolute right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Story Card Container */}
      <div
        id="story-card"
        className="relative w-full max-w-sm h-full md:h-[88vh] md:max-h-[760px] md:rounded-3xl overflow-hidden bg-slate-900 flex flex-col justify-between shadow-2xl border border-white/10 select-none"
      >
        {/* Story Background Media */}
        <div className="absolute inset-0 z-0">
          <img
            src={currentStory.mediaUrl}
            alt="Story media"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Subtle gradient overlays for header and footer legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80" />
        </div>

        {/* Top Header with Progress Bars & User Info */}
        <div className="relative z-20 p-3 pt-4 flex flex-col gap-2.5">
          {/* Segmented Progress Bars */}
          <div className="flex items-center gap-1.5 w-full">
            {stories.map((s, idx) => (
              <div
                key={s.id}
                className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-blue-400 rounded-full transition-all duration-100"
                  style={{
                    width:
                      idx < currentIndex
                        ? '100%'
                        : idx === currentIndex
                        ? `${progress}%`
                        : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          {/* User Info & Controls */}
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-2.5">
              <img
                src={currentStory.user.avatar}
                alt={currentStory.user.username}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-400"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col text-white leading-tight">
                <span className="text-sm font-semibold flex items-center gap-1.5 drop-shadow-sm">
                  {currentStory.user.username}
                  <span className="text-[10px] font-normal px-1.5 py-0.5 rounded-full bg-blue-600/80 text-white">
                    24h
                  </span>
                </span>
                <span className="text-xs text-white/70">{currentStory.createdAt}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-1.5 text-white/80 hover:text-white rounded-full hover:bg-white/10"
              >
                {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
              </button>
              <button
                id="close-story-btn"
                onClick={onClose}
                className="p-1.5 text-white/80 hover:text-white rounded-full hover:bg-white/10"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Tap zones for Left & Right Skip */}
        <div className="relative z-10 flex-1 flex">
          <div
            className="w-1/2 h-full cursor-pointer"
            onClick={handlePrev}
            title="Previous Story"
          />
          <div
            className="w-1/2 h-full cursor-pointer"
            onClick={handleNext}
            title="Next Story"
          />
        </div>

        {/* Story Text / Caption Overlay if available */}
        {currentStory.textCaption && (
          <div className="relative z-20 px-5 py-3 text-center">
            <p className="text-white text-base font-medium drop-shadow-md bg-black/40 backdrop-blur-sm px-4 py-2 rounded-2xl inline-block border border-white/10">
              {currentStory.textCaption}
            </p>
          </div>
        )}

        {/* Bottom Bar: Reply or Views */}
        <div className="relative z-20 p-4 flex flex-col gap-3">
          {showFeedback && (
            <div className="py-1 px-3 bg-blue-600 text-white text-xs font-semibold rounded-full self-center shadow-lg animate-fade-in">
              {showFeedback}
            </div>
          )}

          {isCurrentUserStory ? (
            <div className="flex items-center justify-between px-3 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md text-white">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Eye className="w-4 h-4 text-blue-400" />
                <span>{currentStory.viewsCount} views</span>
              </div>
              <span className="text-xs text-blue-300">Your Story</span>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {/* Quick reactions */}
              <div className="flex items-center justify-around py-1">
                {['💙', '🔥', '👏', '😍', '😂'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(emoji)}
                    className="text-2xl hover:scale-125 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {/* Reply Input */}
              <form onSubmit={handleSendReply} className="flex items-center gap-2">
                <input
                  id="story-reply-input"
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Send a message to ${currentStory.user.username}...`}
                  className="flex-1 px-4 py-2.5 rounded-full bg-white/15 border border-white/20 text-white placeholder-white/60 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="button"
                  onClick={() => setLiked(!liked)}
                  className={`p-2.5 rounded-full transition-transform active:scale-90 ${
                    liked ? 'text-rose-500 bg-white/20' : 'text-white hover:bg-white/10'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${liked ? 'fill-rose-500 stroke-rose-500' : ''}`} />
                </button>
                {replyText.trim() && (
                  <button
                    type="submit"
                    className="p-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
