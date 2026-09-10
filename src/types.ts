export interface User {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  bio: string;
  website?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isPrivate: boolean;
  isVerified?: boolean;
  isFollowedByCurrentUser?: boolean;
  isBlocked?: boolean;
  onlineStatus?: 'online' | 'offline' | 'away';
  lastActive?: string;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  text: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
}

export interface Post {
  id: string;
  userId: string;
  user: User;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption: string;
  hashtags: string[];
  location?: string;
  createdAt: string;
  likesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  comments: Comment[];
  shareCount: number;
}

export interface Reel {
  id: string;
  userId: string;
  user: User;
  videoUrl: string;
  posterUrl?: string;
  caption: string;
  musicTitle: string;
  likesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  commentsCount: number;
  comments: Comment[];
  viewsCount: number;
}

export interface Story {
  id: string;
  userId: string;
  user: User;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  textCaption?: string;
  createdAt: string;
  expiresInHours: number;
  seen: boolean;
  viewsCount: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  mediaUrl?: string;
  createdAt: string;
  isRead: boolean;
  reaction?: string;
}

export interface Conversation {
  id: string;
  participant: User;
  lastMessage: Message;
  unreadCount: number;
}

export interface AppNotification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'message';
  actor: User;
  postId?: string;
  postMedia?: string;
  commentText?: string;
  createdAt: string;
  isRead: boolean;
}

export type BlueThemePalette = 'royal' | 'sapphire' | 'cyan' | 'electric';

export interface ThemeConfig {
  id: BlueThemePalette;
  name: string;
  primary: string;
  accent: string;
  gradient: string;
  ring: string;
  badge: string;
}

export type ActiveTab = 'home' | 'search' | 'reels' | 'messages' | 'notifications' | 'profile';
