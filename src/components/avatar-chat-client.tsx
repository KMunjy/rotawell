'use client';

import dynamic from 'next/dynamic';
import { AvatarErrorBoundary } from '@/components/avatar-error-boundary';

const AvatarChat = dynamic(() => import('@/components/avatar-chat'), { ssr: false });

export function AvatarChatClient() {
  return (
    <AvatarErrorBoundary fallbackTitle="AI Assistant temporarily unavailable">
      <AvatarChat />
    </AvatarErrorBoundary>
  );
}
