import React, { useState } from 'react';
import { X, Copy, Check, Send, Search, Download, Loader2 } from 'lucide-react';
import { User, Post, Reel, ThemeConfig } from '../types';
import { downloadMediaFile } from '../utils/downloadHelper';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetItem: Post | Reel | null;
  users: User[];
  onShareToUser: (user: User) => void;
  themeConfig: ThemeConfig;
  isDarkMode: boolean;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  targetItem,
  users,
  onShareToUser,
  themeConfig,
  isDarkMode,
}) => {
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sharedUsers, setSharedUsers] = useState<string[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen || !targetItem) return null;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMedia = async () => {
    if (isDownloading || !targetItem) return;
    const isReel = 'videoUrl' in targetItem;
    const mediaUrl = isReel ? targetItem.videoUrl : targetItem.mediaUrl;
    const ext = isReel || targetItem.mediaType === 'video' ? 'mp4' : 'jpg';
    const filename = `instagram_${isReel ? 'reel' : 'post'}_${targetItem.user.username}_${targetItem.id}.${ext}`;

    setIsDownloading(true);
    await downloadMediaFile(
      mediaUrl,
      filename,
      () => {},
      () => {
        setIsDownloading(false);
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 2500);
      },
      () => {
        setIsDownloading(false);
      }
    );
  };

  const handleSendToFriend = (user: User) => {
    onShareToUser(user);
    setSharedUsers((prev) => [...prev, user.id]);
  };

  const filtered = users.filter((u) =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
      <div
        className={`w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border flex flex-col max-h-[80vh] transition-colors ${
          isDarkMode
            ? 'bg-slate-900 border-slate-700 text-slate-100'
            : 'bg-white border-blue-100 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <span className="font-bold text-base">Share</span>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contacts..."
              className="w-full bg-transparent focus:outline-hidden"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filtered.map((u) => {
            const hasSent = sharedUsers.includes(u.id);
            return (
              <div
                key={u.id}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={u.avatar}
                    alt={u.username}
                    className="w-10 h-10 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold">{u.username}</span>
                    <span className="text-[10px] text-slate-400">{u.fullName}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleSendToFriend(u)}
                  disabled={hasSent}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    hasSent
                      ? 'bg-emerald-500 text-white'
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                >
                  {hasSent ? 'Sent' : 'Send'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Action Footer: Download & Copy Link */}
        <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col sm:flex-row items-center gap-2">
          <button
            id="share-modal-download-btn"
            onClick={handleDownloadMedia}
            disabled={isDownloading}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/50 text-xs font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 flex items-center justify-center gap-2 transition-colors"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                <span>Downloading...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-500">Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Download Media</span>
              </>
            )}
          </button>

          <button
            id="share-modal-copylink-btn"
            onClick={handleCopyLink}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center justify-center gap-2 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-500">Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-blue-500" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
