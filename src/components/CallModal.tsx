import React, { useState, useEffect } from 'react';
import {
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  RotateCcw,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { User, ThemeConfig } from '../types';

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  participant: User | null;
  callType: 'voice' | 'video';
  themeConfig: ThemeConfig;
  isDarkMode: boolean;
}

export const CallModal: React.FC<CallModalProps> = ({
  isOpen,
  onClose,
  participant,
  callType,
  themeConfig,
  isDarkMode,
}) => {
  const [callStatus, setCallStatus] = useState<'ringing' | 'connected'>('ringing');
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  // Status transitions from ringing to connected after 2.5 seconds
  useEffect(() => {
    if (!isOpen) {
      setCallStatus('ringing');
      setSeconds(0);
      return;
    }

    setCallStatus('ringing');
    setSeconds(0);

    const ringTimer = setTimeout(() => {
      setCallStatus('connected');
    }, 2400);

    return () => clearTimeout(ringTimer);
  }, [isOpen]);

  // Duration timer while connected
  useEffect(() => {
    if (callStatus !== 'connected') return;

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [callStatus]);

  if (!isOpen || !participant) return null;

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      id="instagram-call-overlay"
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-lg flex items-center justify-center p-4 select-none"
    >
      <div className="relative w-full max-w-sm md:max-w-md h-[560px] rounded-3xl overflow-hidden shadow-2xl border border-blue-500/30 flex flex-col justify-between p-6 bg-radial from-slate-900 via-slate-950 to-black text-white">
        {/* Background glow circle */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />

        {/* Top bar: Call type & duration */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
            <span className="text-xs font-bold tracking-wider uppercase text-blue-400">
              {callType === 'video' ? 'Instagram Video' : 'Instagram Audio'}
            </span>
          </div>
          <span className="text-xs font-mono text-slate-300">
            {callStatus === 'ringing' ? 'Ringing...' : formatTimer(seconds)}
          </span>
        </div>

        {/* Center: Participant Avatar / Video Preview */}
        <div className="relative z-10 flex flex-col items-center justify-center gap-4 my-auto">
          {callType === 'video' && !isVideoOff && callStatus === 'connected' ? (
            <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-blue-400/30 shadow-xl bg-slate-900">
              <img
                src={participant.avatar}
                alt={participant.username}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {/* Miniature self video pip */}
              <div className="absolute bottom-3 right-3 w-20 h-28 rounded-xl overflow-hidden border-2 border-white shadow-md bg-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
                  alt="You"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          ) : (
            <div className="relative flex flex-col items-center">
              {/* Pulsing ring during ringing */}
              {callStatus === 'ringing' && (
                <div className="absolute inset-0 rounded-full bg-blue-500/30 animate-ping scale-150" />
              )}
              <div className="relative p-1 rounded-full bg-gradient-to-tr from-blue-600 to-sky-400 shadow-xl shadow-blue-500/30">
                <img
                  src={participant.avatar}
                  alt={participant.username}
                  className="w-28 h-28 rounded-full object-cover ring-4 ring-slate-900"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          )}

          <div className="text-center">
            <h3 className="text-xl font-bold text-white tracking-tight">
              {participant.fullName}
            </h3>
            <p className="text-xs text-blue-400 font-medium">@{participant.username}</p>
            <p className="text-xs text-slate-400 mt-1">
              {callStatus === 'ringing' ? 'Contacting user...' : 'Connected with end-to-end security'}
            </p>
          </div>

          {/* Sound waves visualization */}
          {callStatus === 'connected' && (
            <div className="flex items-center gap-1 h-6">
              {[40, 70, 30, 90, 60, 100, 50, 80, 45, 65].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-blue-500 rounded-full transition-all duration-300 animate-pulse"
                  style={{
                    height: `${isMuted ? 8 : h}%`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bottom controls: Mic, Video, Speaker, End Call */}
        <div className="relative z-10 flex items-center justify-center gap-4 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3.5 rounded-full transition-all ${
              isMuted
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
            title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {callType === 'video' && (
            <button
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`p-3.5 rounded-full transition-all ${
                isVideoOff
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
              title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
            >
              {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>
          )}

          <button
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className={`p-3.5 rounded-full transition-all ${
              !isSpeakerOn
                ? 'bg-slate-800/60 text-slate-500'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
            title="Speaker"
          >
            {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* End Call Button */}
          <button
            onClick={onClose}
            className="p-4 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/40 transition-transform active:scale-95"
            title="End Call"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
