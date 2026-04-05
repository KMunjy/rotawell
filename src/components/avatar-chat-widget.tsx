'use client';

import { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import { AvatarErrorBoundary } from '@/components/avatar-error-boundary';

const AvatarChat = dynamic(() => import('@/components/avatar-chat'), { ssr: false });

export function AvatarChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#0A7E72] text-white shadow-lg hover:bg-[#096b61] transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-[#0A7E72] focus:ring-offset-2"
          aria-label="Open AI Assistant"
        >
          <MessageSquare className="h-6 w-6" aria-hidden="true" />
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full bg-[#0A7E72] animate-ping opacity-20" aria-hidden="true" />
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[380px] h-[520px] rounded-2xl bg-white shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300"
          role="dialog"
          aria-label="AI Assistant Chat"
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-[#0A7E72] px-4 py-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-white" aria-hidden="true" />
              <span className="text-white font-medium text-sm">Rotawell AI Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-white/80 hover:text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {/* Avatar area */}
          <div className="flex-1 min-h-0">
            <AvatarErrorBoundary fallbackTitle="Assistant unavailable">
              <AvatarChat compact />
            </AvatarErrorBoundary>
          </div>
        </div>
      )}
    </>
  );
}
