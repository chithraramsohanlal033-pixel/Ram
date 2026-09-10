import React, { useState } from 'react';
import { X, Check, Camera, Link, User as UserIcon } from 'lucide-react';
import { User, ThemeConfig } from '../types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSaveProfile: (updated: Partial<User>) => void;
  themeConfig: ThemeConfig;
  isDarkMode: boolean;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveProfile,
  themeConfig,
  isDarkMode,
}) => {
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [username, setUsername] = useState(currentUser.username);
  const [bio, setBio] = useState(currentUser.bio);
  const [website, setWebsite] = useState(currentUser.website || '');
  const [avatar, setAvatar] = useState(currentUser.avatar);

  if (!isOpen) return null;

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      fullName,
      username,
      bio,
      website,
      avatar,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
      <div
        className={`w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border flex flex-col transition-colors ${
          isDarkMode
            ? 'bg-slate-900 border-slate-700 text-slate-100'
            : 'bg-white border-blue-100 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <span className="font-bold text-base">Edit Profile</span>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-5 flex flex-col gap-4">
          {/* Avatar Preview & Selection */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <img
                src={avatar}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover ring-4 ring-blue-500/20"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 right-0 p-1.5 rounded-full bg-blue-600 text-white shadow-md">
                <Camera className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {sampleAvatars.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt="preset"
                  onClick={() => setAvatar(url)}
                  className={`w-8 h-8 rounded-full object-cover cursor-pointer hover:scale-110 transition-transform ${
                    avatar === url ? 'ring-2 ring-blue-500' : 'opacity-70'
                  }`}
                  referrerPolicy="no-referrer"
                />
              ))}
            </div>
          </div>

          {/* Full Name */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-400">Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Username */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-400">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-400">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Website Link */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-400">Website</label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://yoursite.com"
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-6 py-2 rounded-xl font-bold text-xs text-white bg-gradient-to-r ${themeConfig.gradient} shadow-md shadow-blue-500/20`}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
