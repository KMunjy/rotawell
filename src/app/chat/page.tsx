import { Metadata } from 'next';
import { AvatarChatClient } from '@/components/avatar-chat-client';

export const metadata: Metadata = {
  title: 'AI Care Assistant | Rotawell',
  description: 'Talk to our AI assistant about care staffing, shift booking, and how Rotawell works.',
};

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#0A7E72] mb-3">AI Care Assistant</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Have questions about care staffing, shift booking, or how Rotawell works?
            Talk to our AI assistant — available 24/7 to help care workers and providers.
          </p>
        </div>
        <AvatarChatClient />
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            Powered by AI. For urgent matters, contact us directly at support@rotawell.care
          </p>
        </div>
      </div>
    </main>
  );
}
