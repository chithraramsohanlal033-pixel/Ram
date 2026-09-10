import React from 'react';
import { Plus } from 'lucide-react';
import { Story, User, ThemeConfig } from '../types';

interface StoriesBarProps {
  stories: Story[];
  currentUser: User;
  onOpenStory: (storyIndex: number) => void;
  onAddStory: () => void;
  themeConfig: ThemeConfig;
  isDarkMode: boolean;
}

export const StoriesBar: React.FC<StoriesBarProps> = ({
  stories,
  currentUser,
  onOpenStory,
  onAddStory,
  themeConfig,
  isDarkMode,
}) => {
  // Check if current user has an active story
  const currentUserStoryIndex = stories.findIndex((s) => s.userId === currentUser.id);

  return (
    <div
      id="stories-carousel"
      className={`w-full py-4 px-2 overflow-x-auto no-scrollbar border-b flex items-center gap-4 transition-colors ${
        isDarkMode
          ? 'bg-slate-950/40 border-slate-800/80'
          : 'bg-white border-blue-100/60'
      }`}
    >
      {/* Current User Story / Add Story Item */}
      <div className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group">
        <div className="relative">
          <button
            id="current-user-story-btn"
            onClick={() => {
              if (currentUserStoryIndex !== -1) {
                onOpenStory(currentUserStoryIndex);
              } else {
                onAddStory();
              }
            }}
            className={`relative p-0.5 rounded-full transition-transform group-hover:scale-105 ${
              currentUserStoryIndex !== -1
                ? `bg-gradient-to-tr ${themeConfig.gradient}`
                : 'bg-slate-200 dark:bg-slate-800'
            }`}
          >
            <div className="p-0.5 bg-white dark:bg-slate-950 rounded-full">
              <img
                src={currentUser.avatar}
                alt={currentUser.username}
                className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </button>

          {/* Add story badge */}
          <button
            id="add-story-badge-btn"
            onClick={(e) => {
              e.stopPropagation();
              onAddStory();
            }}
            className={`absolute bottom-0 right-0 p-1 rounded-full text-white shadow-md bg-blue-600 hover:bg-blue-700 ring-2 ring-white dark:ring-slate-950 transition-transform hover:scale-110`}
            title="Add Story"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>
        <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate max-w-[70px]">
          Your story
        </span>
      </div>

      {/* Friends Stories */}
      {stories
        .map((story, index) => ({ story, index }))
        .filter(({ story }) => story.userId !== currentUser.id)
        .map(({ story, index }) => (
          <div
            id={`story-item-${story.id}`}
            key={story.id}
            onClick={() => onOpenStory(index)}
            className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group"
          >
            <div
              className={`p-0.5 rounded-full transition-transform group-hover:scale-105 ${
                story.seen
                  ? 'bg-slate-300 dark:bg-slate-700'
                  : `bg-gradient-to-tr ${themeConfig.gradient} shadow-xs`
              }`}
            >
              <div className="p-0.5 bg-white dark:bg-slate-950 rounded-full">
                <img
                  src={story.user.avatar}
                  alt={story.user.username}
                  className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate max-w-[74px]">
              {story.user.username}
            </span>
          </div>
        ))}
    </div>
  );
};
