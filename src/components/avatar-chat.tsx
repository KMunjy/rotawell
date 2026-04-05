'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Send, Loader2, MessageSquare, X, AlertCircle, Clock } from 'lucide-react';
import { AVATAR_CONFIG } from '@/lib/avatar-config';

type ChatState = 'idle' | 'connecting' | 'connected' | 'error';

interface AvatarChatProps {
  compact?: boolean;
}

// SDK types — avoids `any` on the avatar ref
interface AvatarInstance {
  on: (event: string, callback: (event: any) => void) => void;
  createStartAvatar: (config: Record<string, unknown>) => Promise<void>;
  stopAvatar: () => Promise<void>;
  speak: (config: { text: string; taskType: string }) => Promise<void>;
  startVoiceChat: (config: Record<string, unknown>) => Promise<void>;
  closeVoiceChat: () => Promise<void>;
}

const SESSION_TIMEOUT_MS = AVATAR_CONFIG.sessionTimeoutMs;
const WARNING_BEFORE_MS = AVATAR_CONFIG.warningBeforeMs;

export default function AvatarChat({ compact = false }: AvatarChatProps) {
  const [state, setState] = useState<ChatState>('idle');
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState('');
  const [micEnabled, setMicEnabled] = useState(false);
  const [sdkMissing, setSdkMissing] = useState(false);
  const [sending, setSending] = useState(false);
  const [timeoutWarning, setTimeoutWarning] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const avatarRef = useRef<AvatarInstance | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const avatarId = AVATAR_CONFIG.avatarId;

  // Session timeout management
  const clearTimers = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);
    timeoutRef.current = null;
    warningRef.current = null;
    setTimeoutWarning(false);
  }, []);

  const resetInactivityTimer = useCallback(() => {
    clearTimers();
    // Show warning 2 min before timeout
    warningRef.current = setTimeout(() => {
      setTimeoutWarning(true);
    }, SESSION_TIMEOUT_MS - WARNING_BEFORE_MS);
    // Auto-disconnect at timeout
    timeoutRef.current = setTimeout(() => {
      setTimeoutWarning(false);
      // End session due to inactivity
      if (avatarRef.current) {
        avatarRef.current.stopAvatar().catch(() => {});
        avatarRef.current = null;
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t: MediaStreamTrack) => t.stop());
        mediaStreamRef.current = null;
      }
      if (videoRef.current) videoRef.current.srcObject = null;
      setState('idle');
      setMicEnabled(false);
      setError('Session ended due to inactivity. Start a new conversation to continue.');
      setState('error');
    }, SESSION_TIMEOUT_MS);
  }, [clearTimers]);

  const getToken = async (): Promise<string> => {
    const res = await fetch('/api/heygen/token', { method: 'POST' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to get token');
    return data.token;
  };

  const startSession = useCallback(async () => {
    setState('connecting');
    setError('');
    setTimeoutWarning(false);

    try {
      const token = await getToken();

      let StreamingAvatar: any;
      let AvatarQuality: any;
      let StreamingEvents: any;

      try {
        const sdk = await import('@heygen/streaming-avatar');
        StreamingAvatar = sdk.default;
        AvatarQuality = sdk.AvatarQuality;
        StreamingEvents = sdk.StreamingEvents;
      } catch {
        setSdkMissing(true);
        setState('error');
        setError('SDK not installed. Run: npm install @heygen/streaming-avatar');
        return;
      }

      const avatar: AvatarInstance = new StreamingAvatar({ token });
      avatarRef.current = avatar;

      avatar.on(StreamingEvents.STREAM_READY, (event: any) => {
        if (videoRef.current && event.detail) {
          videoRef.current.srcObject = event.detail;
          videoRef.current.play().catch(() => {});
        }
        setState('connected');
        resetInactivityTimer();
      });

      avatar.on(StreamingEvents.STREAM_DISCONNECTED, () => {
        clearTimers();
        setState('idle');
        if (videoRef.current) videoRef.current.srcObject = null;
      });

      await avatar.createStartAvatar({
        quality: AvatarQuality?.High || 'high',
        avatarName: avatarId,
        language: 'en',
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to start avatar session';
      console.error('Avatar start error:', err);
      setState('error');
      setError(message);
    }
  }, [avatarId, resetInactivityTimer, clearTimers]);

  const endSession = useCallback(async () => {
    clearTimers();
    try {
      if (avatarRef.current) {
        await avatarRef.current.stopAvatar();
        avatarRef.current = null;
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t: MediaStreamTrack) => t.stop());
        mediaStreamRef.current = null;
      }
    } catch (err) {
      console.error('Error ending session:', err);
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setState('idle');
    setMicEnabled(false);
  }, [clearTimers]);

  const sendMessage = useCallback(async () => {
    if (!message.trim() || !avatarRef.current || sending) return;
    setSending(true);
    try {
      await avatarRef.current.speak({
        text: message.trim(),
        taskType: 'talk',
      });
      setMessage('');
      resetInactivityTimer();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Failed to send message';
      console.error('Speak error:', err);
      setError(errMsg);
    } finally {
      setSending(false);
    }
  }, [message, sending, resetInactivityTimer]);

  const toggleMic = useCallback(async () => {
    if (!avatarRef.current) return;

    if (micEnabled) {
      try {
        await avatarRef.current.closeVoiceChat();
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((t: MediaStreamTrack) => t.stop());
          mediaStreamRef.current = null;
        }
      } catch { /* swallow close errors */ }
      setMicEnabled(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
        await avatarRef.current.startVoiceChat({ useSilencePrompt: false });
        setMicEnabled(true);
        resetInactivityTimer();
      } catch {
        setError('Microphone access denied');
      }
    }
  }, [micEnabled, resetInactivityTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimers();
      if (avatarRef.current) {
        avatarRef.current.stopAvatar().catch(() => {});
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t: MediaStreamTrack) => t.stop());
      }
    };
  }, [clearTimers]);

  const containerClass = compact
    ? 'flex flex-col h-full'
    : 'flex flex-col rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden max-w-2xl mx-auto';

  if (sdkMissing) {
    return (
      <div className={`${containerClass} items-center justify-center p-8`} role="alert">
        <AlertCircle className="h-12 w-12 text-[#E8705A] mb-4" aria-hidden="true" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">SDK Setup Required</h3>
        <p className="text-gray-600 text-center text-sm mb-4">
          To enable the AI avatar assistant, install the HeyGen SDK:
        </p>
        <code className="bg-gray-100 px-4 py-2 rounded-lg text-sm text-[#0A7E72] font-mono">
          npm install @heygen/streaming-avatar
        </code>
        <p className="text-gray-500 text-xs mt-4 text-center">
          You also need a HEYGEN_API_KEY in your environment variables.
        </p>
      </div>
    );
  }

  return (
    <div className={containerClass} role="region" aria-label="AI Care Assistant">
      {/* Live status announcements for screen readers */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {state === 'connecting' && 'Connecting to AI assistant...'}
        {state === 'connected' && 'Connected. You can now type or speak.'}
        {state === 'error' && `Error: ${error}`}
        {timeoutWarning && 'Session will end in 2 minutes due to inactivity. Send a message to stay connected.'}
      </div>

      {/* Video area */}
      <div className={`relative bg-gray-900 ${compact ? 'flex-1 min-h-0' : 'aspect-video'}`}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="h-full w-full object-cover"
          aria-label="AI assistant video stream"
        />

        {state === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#0A7E72]/90 to-[#0A7E72]/70">
            <div className="mb-6 rounded-full bg-white/20 p-6">
              <MessageSquare className="h-10 w-10 text-white" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {compact ? 'AI Assistant' : 'Rotawell AI Care Assistant'}
            </h3>
            <p className="text-white/80 text-sm mb-6 text-center px-4 max-w-sm">
              Ask about care shifts, staffing, compliance, or how Rotawell works.
            </p>
            <button
              onClick={startSession}
              className="rounded-full bg-[#E8705A] px-8 py-3 text-white font-medium hover:bg-[#d4614d] transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0A7E72]"
              aria-label="Start conversation with AI assistant"
            >
              Start Conversation
            </button>
          </div>
        )}

        {state === 'connecting' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0A7E72]/80">
            <Loader2 className="h-10 w-10 text-white animate-spin mb-4" aria-hidden="true" />
            <p className="text-white font-medium">Connecting to assistant...</p>
          </div>
        )}

        {state === 'error' && !sdkMissing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 px-4" role="alert">
            <AlertCircle className="h-10 w-10 text-[#E8705A] mb-4" aria-hidden="true" />
            <p className="text-white text-center text-sm mb-4">{error}</p>
            <button
              onClick={startSession}
              className="rounded-full bg-[#E8705A] px-6 py-2 text-white text-sm font-medium hover:bg-[#d4614d] transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Retry connecting to AI assistant"
            >
              Try Again
            </button>
          </div>
        )}

        {state === 'connected' && (
          <>
            <button
              onClick={endSession}
              className="absolute top-3 right-3 rounded-full bg-red-500/80 p-2 text-white hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="End conversation"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>

            {/* Timeout warning banner */}
            {timeoutWarning && (
              <div className="absolute top-3 left-3 right-14 bg-amber-500/90 text-white text-xs px-3 py-2 rounded-lg flex items-center gap-2" role="alert">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                <span>Session ending in 2 min — send a message to stay connected</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Controls */}
      {state === 'connected' && (
        <div className="border-t border-gray-200 bg-white p-3">
          <div className="flex items-center gap-2" role="toolbar" aria-label="Chat controls">
            <button
              onClick={toggleMic}
              className={`rounded-full p-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0A7E72] ${
                micEnabled
                  ? 'bg-[#E8705A] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              aria-label={micEnabled ? 'Mute microphone' : 'Enable microphone'}
              aria-pressed={micEnabled}
            >
              {micEnabled ? <Mic className="h-5 w-5" aria-hidden="true" /> : <MicOff className="h-5 w-5" aria-hidden="true" />}
            </button>
            <label htmlFor="avatar-chat-input" className="sr-only">Type a message</label>
            <input
              id="avatar-chat-input"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Type a message..."
              disabled={sending}
              className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:border-[#0A7E72] focus:outline-none focus:ring-1 focus:ring-[#0A7E72] disabled:opacity-50"
              aria-label="Message input"
            />
            <button
              onClick={sendMessage}
              disabled={!message.trim() || sending}
              className="rounded-full bg-[#0A7E72] p-2.5 text-white hover:bg-[#096b61] transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#0A7E72] focus:ring-offset-2"
              aria-label={sending ? 'Sending message...' : 'Send message'}
            >
              {sending ? (
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              ) : (
                <Send className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
          {micEnabled && (
            <p className="text-xs text-[#0A7E72] mt-2 text-center" aria-live="polite">
              Microphone active — speak naturally
            </p>
          )}
        </div>
      )}
    </div>
  );
}
