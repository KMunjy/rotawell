'use client';

import { useState, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi there! I'm Rotawell's AI assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const ticketRef = useRef<string | null>(null);
  const ticketCreated = useRef(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageText = input;
    setInput('');
    setLoading(true);

    const supabase = createClient();

    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Please log in first to use the support chat. You can sign in from the login page.',
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setLoading(false);
      return;
    }

    if (!ticketCreated.current) {
      // First user message: create a support ticket
      const ref = `CHAT-${Date.now()}`;
      const { error } = await supabase
        .from('nursly_support_tickets')
        .insert({
          ticket_ref: ref,
          category: 'other',
          subject: messageText.slice(0, 100),
          description: messageText,
          priority: 'p4',
          status: 'open',
          user_id: user.id,
        });

      if (error) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Sorry, there was an error creating your support ticket. Please try again.',
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setLoading(false);
        return;
      }

      ticketRef.current = ref;
      ticketCreated.current = true;

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Your support ticket has been created. A team member will respond within 24 hours. Ticket ref: ${ref}`,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } else {
      // Subsequent messages: show helpful auto-response
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Your message has been noted on ticket ${ticketRef.current}. A team member will review it and get back to you within 24 hours. If this is urgent, please call our support line.`,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }

    setLoading(false);
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-20 right-4 z-50 flex h-96 w-full max-w-sm flex-col rounded-lg border border-gray-200 bg-white shadow-xl sm:bottom-24">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
            <h3 className="font-semibold text-gray-900">Rotawell Assistant</h3>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg p-1 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 px-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-xs rounded-lg px-4 py-2 text-sm',
                    message.role === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-900'
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 max-w-xs rounded-lg px-4 py-2">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-full bg-gray-400 animate-pulse" />
                    <div className="h-2 w-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="h-2 w-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 px-4 py-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="rounded-lg bg-primary p-2 text-white hover:bg-opacity-90 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 right-4 z-40 rounded-full bg-primary p-4 text-white shadow-lg hover:bg-opacity-90"
        aria-label="Open chat"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </>
  );
}
