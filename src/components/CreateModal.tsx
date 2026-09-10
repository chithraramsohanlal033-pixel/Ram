import React, { useState } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Film,
  Sparkles,
  MapPin,
  Hash,
  Layers,
  Check,
} from 'lucide-react';
import { User, ThemeConfig } from '../types';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onPublishPost: (data: {
    mediaUrl: string;
    mediaType: 'image' | 'video';
    caption: string;
    hashtags: string[];
    location?: string;
  }) => void;
  onPublishReel: (data: {
    videoUrl: string;
    caption: string;
    musicTitle: string;
  }) => void;
  onPublishStory: (data: {
    mediaUrl: string;
    mediaType: 'image' | 'video';
    textCaption?: string;
  }) => void;
  themeConfig: ThemeConfig;
  isDarkMode: boolean;
}

export const CreateModal: React.FC<CreateModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onPublishPost,
  onPublishReel,
  onPublishStory,
  themeConfig,
  isDarkMode,
}) => {
  const [contentType, setContentType] = useState<'post' | 'reel' | 'story'>('post');
  const [mediaUrl, setMediaUrl] = useState(
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1080&auto=format&fit=crop&q=80'
  );
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('#azure #bluevibes');
  const [location, setLocation] = useState('Santorini, Greece');
  const [musicTitle, setMusicTitle] = useState('Azure Waves - Original Audio');
  const [selectedFilter, setSelectedFilter] = useState<'normal' | 'azure' | 'cobalt' | 'mono'>('normal');

  if (!isOpen) return null;

  // Curated photo/video presets for easy one-click testing
  const presets = [
    {
      label: 'Ocean Beach',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1080&auto=format&fit=crop&q=80',
      type: 'image' as const,
    },
    {
      label: 'Tech Workspace',
      url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1080&auto=format&fit=crop&q=80',
      type: 'image' as const,
    },
    {
      label: 'Glacial Mountain',
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1080&auto=format&fit=crop&q=80',
      type: 'image' as const,
    },
    {
      label: 'Abstract Blue',
      url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1080&auto=format&fit=crop&q=80',
      type: 'image' as const,
    },
    {
      label: 'Ocean Waves Video',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-waves-crashing-on-a-rocky-beach-43187-large.mp4',
      type: 'video' as const,
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setMediaUrl(objectUrl);
    }
  };

  const handlePublish = () => {
    if (contentType === 'post') {
      const tagsArray = hashtags
        .split(' ')
        .map((t) => (t.startsWith('#') ? t : `#${t}`))
        .filter((t) => t.length > 1);

      onPublishPost({
        mediaUrl,
        mediaType: mediaUrl.endsWith('.mp4') ? 'video' : 'image',
        caption: caption || 'Moments captured in cosmic blue ✨🌊',
        hashtags: tagsArray,
        location,
      });
    } else if (contentType === 'reel') {
      onPublishReel({
        videoUrl: mediaUrl.endsWith('.mp4')
          ? mediaUrl
          : 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-waves-crashing-on-a-rocky-beach-43187-large.mp4',
        caption: caption || 'Rhythm of the deep ocean 🌊🎧',
        musicTitle: musicTitle || 'Instagram Cosmic Waves - Original Audio',
      });
    } else if (contentType === 'story') {
      onPublishStory({
        mediaUrl,
        mediaType: 'image',
        textCaption: caption || 'Daily Instagram Story ✨',
      });
    }

    onClose();
  };

  return (
    <div
      id="create-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-3 md:p-6 backdrop-blur-xs"
    >
      <div
        id="create-modal-card"
        className={`w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border flex flex-col max-h-[90vh] transition-colors ${
          isDarkMode
            ? 'bg-slate-900 border-slate-700 text-slate-100'
            : 'bg-white border-blue-100 text-slate-900'
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base md:text-lg">Create New</span>
            {/* Content Type Selector Pills */}
            <div className="flex items-center gap-1 ml-3 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {(['post', 'reel', 'story'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setContentType(type)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                    contentType === type
                      ? `bg-blue-600 text-white shadow-xs`
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Media Preview & Presets */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Media Preview
            </span>
            <div
              className={`relative aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-700 flex items-center justify-center ${
                selectedFilter === 'azure'
                  ? 'brightness-105 hue-rotate-15 contrast-105'
                  : selectedFilter === 'cobalt'
                  ? 'saturate-150 contrast-110'
                  : selectedFilter === 'mono'
                  ? 'grayscale'
                  : ''
              }`}
            >
              {mediaUrl.endsWith('.mp4') ? (
                <video
                  src={mediaUrl}
                  controls
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={mediaUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>

            {/* Filter buttons */}
            <div className="flex items-center justify-between gap-2 pt-1">
              {[
                { id: 'normal', name: 'Normal' },
                { id: 'azure', name: 'Azure Tint' },
                { id: 'cobalt', name: 'Cobalt Pop' },
                { id: 'mono', name: 'Monochrome' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFilter(f.id as any)}
                  className={`flex-1 py-1 text-[11px] font-semibold rounded-lg border transition-all ${
                    selectedFilter === f.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                      : 'border-slate-200 dark:border-slate-800 text-slate-400'
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>

            {/* Upload or Preset Selection */}
            <div className="flex flex-col gap-2 pt-2">
              <label className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl border-2 border-dashed border-blue-400/60 hover:border-blue-500 text-blue-600 dark:text-blue-400 text-xs font-semibold cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                <span>Upload from Device</span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Quick Presets */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {presets.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setMediaUrl(p.url)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 text-slate-700 dark:text-slate-300 whitespace-nowrap transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Metadata & Caption */}
          <div className="flex flex-col gap-4">
            {/* User header preview */}
            <div className="flex items-center gap-2.5">
              <img
                src={currentUser.avatar}
                alt={currentUser.username}
                className="w-8 h-8 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="text-xs font-bold">{currentUser.username}</span>
            </div>

            {/* Caption Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {contentType === 'story' ? 'Story Text' : 'Caption'}
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder={
                  contentType === 'story'
                    ? 'What is happening right now? (24h visible)'
                    : 'Write a caption that inspires...'
                }
                rows={3}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Hashtags (for post & reel) */}
            {contentType !== 'story' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Hash className="w-3 h-3 text-blue-500" />
                  <span>Hashtags</span>
                </label>
                <input
                  type="text"
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  placeholder="#azure #travel #tech"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Location (for posts) */}
            {contentType === 'post' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-blue-500" />
                  <span>Location</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Santorini, Greece"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Audio Title (for reels) */}
            {contentType === 'reel' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Audio Track
                </label>
                <input
                  type="text"
                  value={musicTitle}
                  onChange={(e) => setMusicTitle(e.target.value)}
                  placeholder="Audio track title..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer / Publish Action */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Visible to {currentUser.isPrivate ? 'Approved Followers' : 'Everyone on Instagram'}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              onClick={handlePublish}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs text-white shadow-lg bg-gradient-to-r ${themeConfig.gradient} hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5`}
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Share {contentType}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
