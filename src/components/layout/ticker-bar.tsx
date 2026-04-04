'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export function TickerBar() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  const tickerContent = `🔴 NHS vacancies hit 112,000 — Apr 2026 · 💷 National Living Wage rises to £12.71/hr · ⚕️ 1,200 new nurses registered this week · 🏥 CQC rates 84% of care homes as Good or Outstanding · 📋 New Right to Work digital checks go live · 🚨 Winter staffing surge: 40% more shifts posted · ✅ Rotawell: 3,200+ verified professionals`;

  return (
    <>
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .ticker-content {
          animation: scroll 45s linear infinite;
          white-space: nowrap;
          display: inline-block;
        }

        .ticker-container:hover .ticker-content {
          animation-play-state: paused;
        }
      `}</style>

      <div className="fixed bottom-0 left-0 right-0 z-30 lg:bottom-0 mb-16 lg:mb-0 bg-[#1A6B5A] text-white h-8 flex items-center overflow-hidden">
        <div className="ticker-container flex items-center w-full h-full px-4">
          <div className="ticker-content text-xs font-medium">
            {tickerContent}
          </div>
          <div className="ticker-content text-xs font-medium ml-8">
            {tickerContent}
          </div>
        </div>

        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded transition-colors flex-shrink-0"
          aria-label="Close ticker"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </>
  );
}
