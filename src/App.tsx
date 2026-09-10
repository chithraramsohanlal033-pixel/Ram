import React, { useState } from 'react';
import {
  ActiveTab,
  User,
  Post,
  Reel,
  Story,
  Conversation,
  Message,
  AppNotification,
  BlueThemePalette,
} from './types';
import {
  CURRENT_USER,
  INITIAL_USERS,
  INITIAL_POSTS,
  INITIAL_REELS,
  INITIAL_STORIES,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES_MAP,
  INITIAL_NOTIFICATIONS,
  BLUE_THEMES,
} from './data/mockData';
import { Navigation } from './components/Navigation';
import { HomeFeed } from './components/HomeFeed';
import { ReelsView } from './components/ReelsView';
import { ExploreView } from './components/ExploreView';
import { DirectMessagesView } from './components/DirectMessagesView';
import { NotificationsView } from './components/NotificationsView';
import { ProfileView } from './components/ProfileView';
import { StoryViewerModal } from './components/StoryViewerModal';
import { CreateModal } from './components/CreateModal';
import { EditProfileModal } from './components/EditProfileModal';
import { SettingsModal } from './components/SettingsModal';
import { AuthModal } from './components/AuthModal';
import { ShareModal } from './components/ShareModal';
import { PostCard } from './components/PostCard';
import { Toast, ToastData } from './components/Toast';
import { CallModal } from './components/CallModal';
import { X } from 'lucide-react';

export default function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [currentThemeKey, setCurrentThemeKey] = useState<BlueThemePalette>('royal');
  const themeConfig = BLUE_THEMES[currentThemeKey] || BLUE_THEMES.royal;

  // Primary Data State
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [reels, setReels] = useState<Reel[]>(INITIAL_REELS);
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(INITIAL_MESSAGES_MAP);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [blockedUsers, setBlockedUsers] = useState<User[]>([]);

  // Modals
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [shareTarget, setShareTarget] = useState<Post | Reel | null>(null);
  const [inspectPost, setInspectPost] = useState<Post | null>(null);
  const [viewedUser, setViewedUser] = useState<User | null>(null);
  const [toast, setToast] = useState<ToastData | null>(null);
  const [activeCall, setActiveCall] = useState<{
    isOpen: boolean;
    participant: User | null;
    callType: 'voice' | 'video';
  }>({
    isOpen: false,
    participant: null,
    callType: 'voice',
  });

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setToast({ id: `${Date.now()}`, message, type });
  };

  // Unread Counts
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  // Post Actions
  const handleLikePostToggle = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newIsLiked = !p.isLiked;
          return {
            ...p,
            isLiked: newIsLiked,
            likesCount: newIsLiked ? p.likesCount + 1 : p.likesCount - 1,
          };
        }
        return p;
      })
    );
  };

  const handleSavePostToggle = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, isSaved: !p.isSaved } : p))
    );
  };

  const handleAddComment = (postId: string, text: string) => {
    const newComment = {
      id: `c_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatar,
      text,
      createdAt: 'Just now',
      likesCount: 0,
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...p.comments, newComment],
          };
        }
        return p;
      })
    );
  };

  const handleLikeComment = (postId: string, commentId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: p.comments.map((c) => {
              if (c.id === commentId) {
                const isLiked = !c.isLiked;
                return {
                  ...c,
                  isLiked,
                  likesCount: isLiked ? c.likesCount + 1 : c.likesCount - 1,
                };
              }
              return c;
            }),
          };
        }
        return p;
      })
    );
  };

  // Follow / Unfollow User Action
  const handleFollowToggle = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const isFollowed = !u.isFollowedByCurrentUser;
          return {
            ...u,
            isFollowedByCurrentUser: isFollowed,
            followersCount: isFollowed ? u.followersCount + 1 : u.followersCount - 1,
          };
        }
        return u;
      })
    );

    // Also update post user reference
    setPosts((prev) =>
      prev.map((p) => {
        if (p.userId === userId) {
          const isFollowed = !p.user.isFollowedByCurrentUser;
          return {
            ...p,
            user: {
              ...p.user,
              isFollowedByCurrentUser: isFollowed,
            },
          };
        }
        return p;
      })
    );

    // Update current user following count
    setCurrentUser((prev) => {
      const targetUser = users.find((u) => u.id === userId);
      const isNowFollowing = !targetUser?.isFollowedByCurrentUser;
      return {
        ...prev,
        followingCount: isNowFollowing ? prev.followingCount + 1 : Math.max(0, prev.followingCount - 1),
      };
    });
  };

  // Reel Actions
  const handleLikeReelToggle = (reelId: string) => {
    setReels((prev) =>
      prev.map((r) => {
        if (r.id === reelId) {
          const newIsLiked = !r.isLiked;
          return {
            ...r,
            isLiked: newIsLiked,
            likesCount: newIsLiked ? r.likesCount + 1 : r.likesCount - 1,
          };
        }
        return r;
      })
    );
  };

  const handleSaveReelToggle = (reelId: string) => {
    setReels((prev) =>
      prev.map((r) => (r.id === reelId ? { ...r, isSaved: !r.isSaved } : r))
    );
  };

  const handleAddReelComment = (reelId: string, text: string) => {
    const newComment = {
      id: `rc_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatar,
      text,
      createdAt: 'Just now',
      likesCount: 0,
    };

    setReels((prev) =>
      prev.map((r) => {
        if (r.id === reelId) {
          return {
            ...r,
            comments: [...r.comments, newComment],
            commentsCount: r.commentsCount + 1,
          };
        }
        return r;
      })
    );
  };

  // Message Actions
  const handleSendMessage = (conversationId: string, text: string, mediaUrl?: string) => {
    const newMessage: Message = {
      id: `m_${Date.now()}`,
      senderId: currentUser.id,
      receiverId: 'partner',
      text,
      mediaUrl,
      createdAt: 'Just now',
      isRead: true,
    };

    setMessagesMap((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage],
    }));

    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              lastMessage: newMessage,
            }
          : c
      )
    );
  };

  const handleAddReaction = (conversationId: string, messageId: string, emoji: string) => {
    setMessagesMap((prev) => ({
      ...prev,
      [conversationId]: (prev[conversationId] || []).map((m) =>
        m.id === messageId ? { ...m, reaction: emoji } : m
      ),
    }));
  };

  // Story Reply Action (connects Story directly to DMs!)
  const handleSendStoryReply = (storyUser: User, text: string) => {
    let targetConv = conversations.find((c) => c.participant.id === storyUser.id);
    if (!targetConv) {
      targetConv = {
        id: `conv_${Date.now()}`,
        participant: storyUser,
        lastMessage: {
          id: `m_${Date.now()}`,
          senderId: currentUser.id,
          receiverId: storyUser.id,
          text: `Story reply: "${text}"`,
          createdAt: 'Just now',
          isRead: true,
        },
        unreadCount: 0,
      };
      setConversations((prev) => [targetConv!, ...prev]);
    }

    handleSendMessage(targetConv.id, `Story reply: "${text}"`);
  };

  // Publish New Content
  const handlePublishPost = (data: {
    mediaUrl: string;
    mediaType: 'image' | 'video';
    caption: string;
    hashtags: string[];
    location?: string;
  }) => {
    const newPost: Post = {
      id: `post_${Date.now()}`,
      userId: currentUser.id,
      user: currentUser,
      mediaUrl: data.mediaUrl,
      mediaType: data.mediaType,
      caption: data.caption,
      hashtags: data.hashtags,
      location: data.location,
      createdAt: 'Just now',
      likesCount: 1,
      isLiked: true,
      isSaved: false,
      shareCount: 0,
      comments: [],
    };

    setPosts((prev) => [newPost, ...prev]);
    setCurrentUser((prev) => ({ ...prev, postsCount: prev.postsCount + 1 }));
    setActiveTab('home');
  };

  const handlePublishReel = (data: {
    videoUrl: string;
    caption: string;
    musicTitle: string;
  }) => {
    const newReel: Reel = {
      id: `reel_${Date.now()}`,
      userId: currentUser.id,
      user: currentUser,
      videoUrl: data.videoUrl,
      caption: data.caption,
      musicTitle: data.musicTitle,
      likesCount: 1,
      isLiked: true,
      isSaved: false,
      commentsCount: 0,
      comments: [],
      viewsCount: 1,
    };

    setReels((prev) => [newReel, ...prev]);
    setActiveTab('reels');
  };

  const handlePublishStory = (data: {
    mediaUrl: string;
    mediaType: 'image' | 'video';
    textCaption?: string;
  }) => {
    const newStory: Story = {
      id: `story_${Date.now()}`,
      userId: currentUser.id,
      user: currentUser,
      mediaUrl: data.mediaUrl,
      mediaType: data.mediaType,
      textCaption: data.textCaption,
      createdAt: 'Just now',
      expiresInHours: 24,
      seen: false,
      viewsCount: 1,
    };

    setStories((prev) => [newStory, ...prev]);
    setActiveTab('home');
  };

  // Security: Block & Report
  const handleBlockUser = (userToBlock: User) => {
    setBlockedUsers((prev) => [...prev, userToBlock]);
    // Filter posts by this user from feed
    setPosts((prev) => prev.filter((p) => p.userId !== userToBlock.id));
    showToast(`@${userToBlock.username} has been blocked.`, 'warning');
  };

  const handleUnblockUser = (userId: string) => {
    setBlockedUsers((prev) => prev.filter((u) => u.id !== userId));
    showToast(`User has been unblocked.`, 'info');
  };

  const handleReportPost = (postId: string) => {
    showToast(`Post reported for review. Thank you for keeping Instagram safe. 🛡️`, 'info');
  };

  // Mark all notifications as read
  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Saved Posts list
  const savedPostsList = posts.filter((p) => p.isSaved);
  const myPostsList = posts.filter((p) => p.userId === currentUser.id);
  const myReelsList = reels.filter((r) => r.userId === currentUser.id);

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-[#f7faff] text-slate-900'
      }`}
    >
      <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto">
        {/* Navigation (Sidebar on desktop, Top & Bottom bars on mobile) */}
        <Navigation
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setViewedUser(null);
            setActiveTab(tab);
          }}
          currentUser={currentUser}
          unreadMessagesCount={unreadMessagesCount}
          unreadNotificationsCount={unreadNotificationsCount}
          openCreateModal={() => setIsCreateModalOpen(true)}
          openSettingsModal={() => setIsSettingsOpen(true)}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          themeConfig={themeConfig}
          currentThemeKey={currentThemeKey}
          onSelectTheme={(themeKey) => setCurrentThemeKey(themeKey)}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 min-w-0 pb-20 md:pb-6">
          {/* External user profile view if selected */}
          {viewedUser ? (
            <ProfileView
              user={viewedUser}
              currentUser={currentUser}
              userPosts={posts.filter((p) => p.userId === viewedUser.id)}
              userReels={reels.filter((r) => r.userId === viewedUser.id)}
              savedPosts={[]}
              onFollowToggle={handleFollowToggle}
              onOpenEditProfile={() => setIsEditProfileOpen(true)}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onSelectPost={(post) => setInspectPost(post)}
              themeConfig={themeConfig}
              isDarkMode={isDarkMode}
            />
          ) : (
            <>
              {activeTab === 'home' && (
                <HomeFeed
                  stories={stories}
                  posts={posts}
                  suggestedUsers={users}
                  currentUser={currentUser}
                  onOpenStory={(idx) => {
                    setActiveStoryIndex(idx);
                    setIsStoryViewerOpen(true);
                  }}
                  onAddStory={() => setIsCreateModalOpen(true)}
                  onLikeToggle={handleLikePostToggle}
                  onSaveToggle={handleSavePostToggle}
                  onAddComment={handleAddComment}
                  onLikeComment={handleLikeComment}
                  onFollowToggle={handleFollowToggle}
                  onOpenShareModal={(post) => setShareTarget(post)}
                  onReportPost={handleReportPost}
                  onBlockUser={handleBlockUser}
                  onSelectUser={(u) => setViewedUser(u)}
                  onShowToast={showToast}
                  themeConfig={themeConfig}
                  isDarkMode={isDarkMode}
                />
              )}

              {activeTab === 'search' && (
                <ExploreView
                  users={users}
                  posts={posts}
                  onSelectUser={(u) => setViewedUser(u)}
                  onSelectPost={(post) => setInspectPost(post)}
                  themeConfig={themeConfig}
                  isDarkMode={isDarkMode}
                />
              )}

              {activeTab === 'reels' && (
                <ReelsView
                  reels={reels}
                  currentUser={currentUser}
                  onLikeToggle={handleLikeReelToggle}
                  onSaveToggle={handleSaveReelToggle}
                  onAddComment={handleAddReelComment}
                  onFollowToggle={handleFollowToggle}
                  onOpenShareModal={(reel) => setShareTarget(reel)}
                  onOpenUploadReel={() => setIsCreateModalOpen(true)}
                  onShowToast={showToast}
                  themeConfig={themeConfig}
                  isDarkMode={isDarkMode}
                />
              )}

              {activeTab === 'messages' && (
                <DirectMessagesView
                  conversations={conversations}
                  messagesMap={messagesMap}
                  currentUser={currentUser}
                  onSendMessage={handleSendMessage}
                  onAddReaction={handleAddReaction}
                  onStartCall={(participant, type) =>
                    setActiveCall({ isOpen: true, participant, callType: type })
                  }
                  themeConfig={themeConfig}
                  isDarkMode={isDarkMode}
                />
              )}

              {activeTab === 'notifications' && (
                <NotificationsView
                  notifications={notifications}
                  onFollowToggle={handleFollowToggle}
                  onMarkAllAsRead={handleMarkAllNotificationsAsRead}
                  onSelectUser={(u) => setViewedUser(u)}
                  themeConfig={themeConfig}
                  isDarkMode={isDarkMode}
                />
              )}

              {activeTab === 'profile' && (
                <ProfileView
                  user={currentUser}
                  currentUser={currentUser}
                  userPosts={myPostsList}
                  userReels={myReelsList}
                  savedPosts={savedPostsList}
                  onFollowToggle={handleFollowToggle}
                  onOpenEditProfile={() => setIsEditProfileOpen(true)}
                  onOpenSettings={() => setIsSettingsOpen(true)}
                  onSelectPost={(post) => setInspectPost(post)}
                  themeConfig={themeConfig}
                  isDarkMode={isDarkMode}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Story Viewer Modal */}
      {isStoryViewerOpen && (
        <StoryViewerModal
          stories={stories}
          initialIndex={activeStoryIndex}
          onClose={() => setIsStoryViewerOpen(false)}
          currentUser={currentUser}
          onSendStoryReply={handleSendStoryReply}
        />
      )}

      {/* Create New Modal (Post, Reel, Story) */}
      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        currentUser={currentUser}
        onPublishPost={handlePublishPost}
        onPublishReel={handlePublishReel}
        onPublishStory={handlePublishStory}
        themeConfig={themeConfig}
        isDarkMode={isDarkMode}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        currentUser={currentUser}
        onSaveProfile={(updated) => setCurrentUser((prev) => ({ ...prev, ...updated }))}
        themeConfig={themeConfig}
        isDarkMode={isDarkMode}
      />

      {/* Settings & Privacy Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentUser={currentUser}
        onTogglePrivateAccount={() =>
          setCurrentUser((prev) => ({ ...prev, isPrivate: !prev.isPrivate }))
        }
        blockedUsers={blockedUsers}
        onUnblockUser={handleUnblockUser}
        currentThemeKey={currentThemeKey}
        onSelectTheme={(themeKey) => setCurrentThemeKey(themeKey)}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onLogout={() => setIsAuthOpen(true)}
        themeConfig={themeConfig}
      />

      {/* Auth & Switch Account Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={(authData) => {
          setCurrentUser((prev) => ({
            ...prev,
            username: authData.username || prev.username,
            fullName: authData.fullName || prev.fullName,
          }));
        }}
        themeConfig={themeConfig}
        isDarkMode={isDarkMode}
      />

      {/* Share to Direct / Friends Modal */}
      <ShareModal
        isOpen={!!shareTarget}
        onClose={() => setShareTarget(null)}
        targetItem={shareTarget}
        users={users}
        onShareToUser={(u) => {
          showToast(`Post shared to @${u.username} in Direct! 📬`, 'success');
          setShareTarget(null);
        }}
        themeConfig={themeConfig}
        isDarkMode={isDarkMode}
      />

      {/* Post Inspect Modal from Profile or Explore */}
      {inspectPost && (
        <div
          onClick={() => setInspectPost(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 md:p-6 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => setInspectPost(null)}
              className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/60 text-white hover:bg-black/80"
            >
              <X className="w-5 h-5" />
            </button>
            <PostCard
              post={inspectPost}
              currentUser={currentUser}
              onLikeToggle={handleLikePostToggle}
              onSaveToggle={handleSavePostToggle}
              onAddComment={handleAddComment}
              onLikeComment={handleLikeComment}
              onFollowToggle={handleFollowToggle}
              onOpenShareModal={(p) => setShareTarget(p)}
              onReportPost={handleReportPost}
              onBlockUser={handleBlockUser}
              onShowToast={showToast}
              themeConfig={themeConfig}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      )}

      {/* Direct Calling Simulation Modal */}
      <CallModal
        isOpen={activeCall.isOpen}
        onClose={() =>
          setActiveCall((prev) => ({ ...prev, isOpen: false, participant: null }))
        }
        participant={activeCall.participant}
        callType={activeCall.callType}
        themeConfig={themeConfig}
        isDarkMode={isDarkMode}
      />

      {/* Global In-App Toast Notification */}
      <Toast
        toast={toast}
        onClose={() => setToast(null)}
        themeConfig={themeConfig}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
