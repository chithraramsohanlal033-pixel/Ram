import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Send,
  Image as ImageIcon,
  Smile,
  Heart,
  Phone,
  Video,
  Info,
  Check,
  CheckCheck,
  ArrowLeft,
} from 'lucide-react';
import { Conversation, Message, User, ThemeConfig } from '../types';

interface DirectMessagesViewProps {
  conversations: Conversation[];
  messagesMap: Record<string, Message[]>;
  currentUser: User;
  onSendMessage: (conversationId: string, text: string, mediaUrl?: string) => void;
  onAddReaction: (conversationId: string, messageId: string, emoji: string) => void;
  onStartCall?: (participant: User, type: 'voice' | 'video') => void;
  themeConfig: ThemeConfig;
  isDarkMode: boolean;
}

export const DirectMessagesView: React.FC<DirectMessagesViewProps> = ({
  conversations,
  messagesMap,
  currentUser,
  onSendMessage,
  onAddReaction,
  onStartCall,
  themeConfig,
  isDarkMode,
}) => {
  const [activeConvId, setActiveConvId] = useState<string>(
    conversations[0]?.id || ''
  );
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeConversation = conversations.find((c) => c.id === activeConvId);
  const currentMessages = messagesMap[activeConvId] || [];

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, isTyping]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageInput.trim() || !activeConvId) return;

    const textToSend = messageInput;
    setMessageInput('');
    onSendMessage(activeConvId, textToSend);

    // Simulate friend typing and responding
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const responses = [
          'That sounds wonderful! 💙',
          'Love this perspective!',
          'Totally agree with you on this.',
          'Let me check and share with the group!',
          'Awesome, thanks for the update! ✨',
        ];
        const randomResp = responses[Math.floor(Math.random() * responses.length)];
        onSendMessage(activeConvId, randomResp);
      }, 1500);
    }, 800);
  };

  const handleSendSamplePhoto = (photoUrl: string) => {
    if (!activeConvId) return;
    onSendMessage(activeConvId, 'Shared a snapshot with you 📸', photoUrl);
    setShowPhotoPicker(false);
  };

  const filteredConversations = conversations.filter(
    (c) =>
      c.participant.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.participant.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      id="direct-messages-container"
      className="w-full max-w-5xl mx-auto h-[calc(100vh-80px)] md:h-[calc(100vh-40px)] py-2 md:py-6 px-2 md:px-6"
    >
      <div
        className={`w-full h-full rounded-3xl border overflow-hidden flex transition-colors shadow-lg ${
          isDarkMode
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-blue-100 text-slate-900'
        }`}
      >
        {/* Left Panel: Conversations List */}
        <div
          className={`w-full md:w-80 lg:w-96 flex flex-col border-r ${
            isDarkMode ? 'border-slate-800 bg-slate-950/50' : 'border-blue-100/80 bg-slate-50/50'
          } ${mobileShowChat ? 'hidden md:flex' : 'flex'}`}
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base md:text-lg">Direct Messages</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 font-semibold">
                {conversations.length}
              </span>
            </div>
          </div>

          {/* Search Contacts */}
          <div className="p-3">
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${
                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-blue-100'
              }`}
            >
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chats..."
                className="w-full bg-transparent text-xs focus:outline-hidden"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50">
            {filteredConversations.map((conv) => {
              const isSelected = conv.id === activeConvId;
              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    setActiveConvId(conv.id);
                    setMobileShowChat(true);
                  }}
                  className={`flex items-center gap-3 p-3.5 cursor-pointer transition-colors ${
                    isSelected
                      ? isDarkMode
                        ? 'bg-blue-600/15 border-l-4 border-blue-500'
                        : 'bg-blue-50/80 border-l-4 border-blue-600'
                      : isDarkMode
                      ? 'hover:bg-slate-900'
                      : 'hover:bg-slate-100/70'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={conv.participant.avatar}
                      alt={conv.participant.username}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/20"
                      referrerPolicy="no-referrer"
                    />
                    {conv.participant.onlineStatus === 'online' && (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold truncate">
                        {conv.participant.username}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {conv.lastMessage.createdAt}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
                        {conv.lastMessage.senderId === currentUser.id ? 'You: ' : ''}
                        {conv.lastMessage.text || 'Media attachment'}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel: Chat Thread View */}
        {activeConversation ? (
          <div
            className={`flex-1 flex flex-col h-full ${
              !mobileShowChat ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* Chat Top Header */}
            <div className="p-3.5 md:p-4 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileShowChat(false)}
                  className="md:hidden p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="relative">
                  <img
                    src={activeConversation.participant.avatar}
                    alt={activeConversation.participant.username}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/30"
                    referrerPolicy="no-referrer"
                  />
                  {activeConversation.participant.onlineStatus === 'online' && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold flex items-center gap-1.5">
                    {activeConversation.participant.fullName}
                    {activeConversation.participant.isVerified && (
                      <span className="text-blue-500 text-xs">✓</span>
                    )}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    @{activeConversation.participant.username} •{' '}
                    {activeConversation.participant.onlineStatus === 'online'
                      ? 'Active now'
                      : 'Offline'}
                  </span>
                </div>
              </div>

              {/* Chat action icons */}
              <div className="flex items-center gap-1">
                <button
                  id="dm-voice-call-btn"
                  title="Voice Call"
                  onClick={() => onStartCall?.(activeConversation.participant, 'voice')}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                >
                  <Phone className="w-4 h-4 text-blue-500" />
                </button>
                <button
                  id="dm-video-call-btn"
                  title="Video Call"
                  onClick={() => onStartCall?.(activeConversation.participant, 'video')}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                >
                  <Video className="w-4 h-4 text-blue-500" />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Top Contact Intro Card */}
              <div className="flex flex-col items-center justify-center p-6 text-center border-b border-slate-100 dark:border-slate-800/80 mb-4">
                <img
                  src={activeConversation.participant.avatar}
                  alt={activeConversation.participant.username}
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-blue-500/20 mb-2"
                  referrerPolicy="no-referrer"
                />
                <span className="text-base font-bold">
                  {activeConversation.participant.fullName}
                </span>
                <span className="text-xs text-slate-400">
                  @{activeConversation.participant.username} • {activeConversation.participant.followersCount.toLocaleString()} followers
                </span>
                <span className="text-xs text-slate-500 max-w-xs mt-1">
                  {activeConversation.participant.bio}
                </span>
              </div>

              {/* Message bubbles */}
              {currentMessages.map((msg) => {
                const isSentByMe = msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isSentByMe ? 'items-end' : 'items-start'} group`}
                  >
                    <div className="flex items-end gap-1.5 max-w-[80%] md:max-w-[70%]">
                      {!isSentByMe && (
                        <img
                          src={activeConversation.participant.avatar}
                          alt="avatar"
                          className="w-6 h-6 rounded-full object-cover flex-shrink-0 mb-1"
                          referrerPolicy="no-referrer"
                        />
                      )}

                      <div className="flex flex-col">
                        {/* Media image if present */}
                        {msg.mediaUrl && (
                          <div className="rounded-2xl overflow-hidden mb-1.5 max-w-xs border border-white/20 shadow-md">
                            <img
                              src={msg.mediaUrl}
                              alt="attachment"
                              className="w-full h-auto object-cover max-h-60"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}

                        {/* Text bubble */}
                        {msg.text && (
                          <div
                            className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                              isSentByMe
                                ? `bg-gradient-to-r ${themeConfig.gradient} text-white rounded-br-xs shadow-xs`
                                : isDarkMode
                                ? 'bg-slate-800 text-slate-100 rounded-bl-xs'
                                : 'bg-slate-100 text-slate-900 rounded-bl-xs'
                            }`}
                          >
                            {msg.text}
                          </div>
                        )}

                        {/* Reaction badge if applied */}
                        {msg.reaction && (
                          <span className="self-end -mt-2 mr-2 px-1.5 py-0.5 rounded-full text-xs bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700">
                            {msg.reaction}
                          </span>
                        )}
                      </div>

                      {/* Quick Reaction Button on Hover */}
                      <button
                        onClick={() => onAddReaction(activeConvId, msg.id, '❤️')}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-opacity"
                        title="React ❤️"
                      >
                        <Heart className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 px-1">
                      <span>{msg.createdAt}</span>
                      {isSentByMe && (
                        <span>
                          {msg.isRead ? (
                            <CheckCheck className="w-3 h-3 text-blue-500" />
                          ) : (
                            <Check className="w-3 h-3" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Typing simulation */}
              {isTyping && (
                <div className="flex items-center gap-2 text-slate-400 text-xs py-1">
                  <img
                    src={activeConversation.participant.avatar}
                    alt="typing"
                    className="w-6 h-6 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="px-3 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Photo Picker Drawer */}
            {showPhotoPicker && (
              <div className="p-3 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center gap-3 overflow-x-auto">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  Choose Photo:
                </span>
                {[
                  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
                ].map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt="sample"
                    onClick={() => handleSendSamplePhoto(url)}
                    className="w-14 h-14 rounded-xl object-cover cursor-pointer hover:scale-105 border-2 border-blue-500 transition-transform flex-shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>
            )}

            {/* Bottom Input Field */}
            <form
              onSubmit={handleSend}
              className="p-3 md:p-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center gap-2"
            >
              <button
                type="button"
                onClick={() => setShowPhotoPicker(!showPhotoPicker)}
                className={`p-2 rounded-full transition-colors ${
                  showPhotoPicker
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="Send Photo"
              >
                <ImageIcon className="w-5 h-5" />
              </button>

              <input
                id="dm-message-input"
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={`Message ${activeConversation.participant.username}...`}
                className="flex-1 px-4 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
              />

              <button
                type="button"
                onClick={() => {
                  setMessageInput((prev) => prev + ' 💙 ');
                }}
                className="p-2 text-blue-500 hover:scale-110 transition-transform"
                title="Blue Heart"
              >
                <Heart className="w-5 h-5 fill-blue-500" />
              </button>

              <button
                type="submit"
                disabled={!messageInput.trim()}
                className={`p-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 transition-all ${
                  messageInput.trim() ? 'scale-105 shadow-md shadow-blue-500/30' : ''
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 hidden md:flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <span className="text-base font-bold text-slate-700 dark:text-slate-300">
              Select a Conversation
            </span>
            <span className="text-xs text-slate-400 mt-1">
              Connect with friends in private one-to-one blue chats
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
