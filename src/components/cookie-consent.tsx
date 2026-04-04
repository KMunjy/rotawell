'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

const CONSENT_KEY = 'rotawell_cookie_consent';

interface ConsentState {
  essential: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  decided: boolean;
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [prefs, setPrefs] = useState({
    functional: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (!stored) {
        // Show after a brief delay so the page loads first
        const t = setTimeout(() => setVisible(true), 1000);
        return () => clearTimeout(t);
      }
    } catch {
      // localStorage not available
    }
  }, []);

  const saveConsent = (consent: Omit<ConsentState, 'essential'>) => {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify({ ...consent, essential: true, decided: true }));
    } catch {
      // ignore
    }
    setVisible(false);
  };

  const handleAcceptAll = () => {
    saveConsent({ functional: true, analytics: true, marketing: true, decided: true });
  };

  const handleRejectAll = () => {
    saveConsent({ functional: false, analytics: false, marketing: false, decided: true });
  };

  const handleSavePrefs = () => {
    saveConsent({ ...prefs, decided: true });
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6">
      <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white shadow-2xl">
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900">We use cookies</h2>
              <p className="mt-1 text-sm text-gray-600">
                We use cookies to operate the platform, remember your preferences, and (with your consent) analyse usage.
                See our{' '}
                <Link href="/legal/privacy" className="text-primary underline hover:no-underline">
                  Privacy Policy
                </Link>{' '}
                for details. This banner is shown in compliance with UK GDPR and POPIA.
              </p>
            </div>
            <button
              onClick={handleRejectAll}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0"
              aria-label="Reject all and close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {showDetails && (
            <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
              {[
                {
                  id: 'essential',
                  label: 'Essential cookies',
                  desc: 'Required for authentication and platform security. Always enabled.',
                  required: true,
                  checked: true,
                },
                {
                  id: 'functional',
                  label: 'Functional cookies',
                  desc: 'Remember your preferences and UI settings.',
                  required: false,
                  checked: prefs.functional,
                },
                {
                  id: 'analytics',
                  label: 'Analytics cookies',
                  desc: 'Help us understand how the platform is used (anonymised).',
                  required: false,
                  checked: prefs.analytics,
                },
                {
                  id: 'marketing',
                  label: 'Marketing cookies',
                  desc: 'Used to deliver relevant communications and adverts.',
                  required: false,
                  checked: prefs.marketing,
                },
              ].map((cookie) => (
                <div key={cookie.id} className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{cookie.label}</p>
                    <p className="text-xs text-gray-500">{cookie.desc}</p>
                  </div>
                  <div className="flex-shrink-0">
                    {cookie.required ? (
                      <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full font-medium">Always on</span>
                    ) : (
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          checked={cookie.checked}
                          onChange={(e) => setPrefs((p) => ({ ...p, [cookie.id]: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="h-5 w-9 rounded-full bg-gray-200 peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-4"></div>
                      </label>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={handleAcceptAll}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
            >
              Accept all
            </button>
            <button
              onClick={handleRejectAll}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Reject non-essential
            </button>
            {showDetails ? (
              <button
                onClick={handleSavePrefs}
                className="rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5"
              >
                Save my preferences
              </button>
            ) : (
              <button
                onClick={() => setShowDetails(true)}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 underline"
              >
                Manage preferences
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
