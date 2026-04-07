'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Download, Trash2, Bell, CheckCircle, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

const CONSENT_KEY = 'rotawell_cookie_consent';

interface CookiePrefs {
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface ConsentRecord {
  dataProcessing: boolean;
  marketing: boolean;
}

export default function PrivacySettingsPage() {
  const [cookiePrefs, setCookiePrefs] = useState<CookiePrefs>({
    functional: true,
    analytics: false,
    marketing: false,
  });
  const [cookieSaved, setCookieSaved] = useState(false);

  const [consentRecord, setConsentRecord] = useState<ConsentRecord>({
    dataProcessing: true,
    marketing: false,
  });

  const [exportRequested, setExportRequested] = useState(false);
  const [deletionRequested, setDeletionRequested] = useState(false);
  const [deletionConfirm, setDeletionConfirm] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setCookiePrefs({
          functional: parsed.functional ?? true,
          analytics: parsed.analytics ?? false,
          marketing: parsed.marketing ?? false,
        });
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSaveCookiePrefs = async () => {
    try {
      // Save to localStorage
      localStorage.setItem(
        CONSENT_KEY,
        JSON.stringify({ ...cookiePrefs, essential: true, decided: true })
      );

      // Save to Supabase
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await supabase.from('nursly_notification_preferences').upsert({
          user_id: user.id,
          category: 'privacy',
          data_processing_consent: cookiePrefs.functional,
          marketing_consent: cookiePrefs.marketing,
          updated_at: new Date().toISOString(),
        });
      }

      setCookieSaved(true);
      setTimeout(() => setCookieSaved(false), 2000);
    } catch (err) {
      console.error('Error saving preferences:', err);
    }
  };

  const handleRequestExport = async () => {
    setActionLoading(true);
    setActionError(null);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setActionError('You must be signed in to request a data export.');
        return;
      }

      // Submit a support ticket as the export request mechanism
      const { error } = await supabase.from('nursly_support_tickets').insert({
        ticket_ref: `EXPORT-${Date.now()}`,
        name: user.email ?? 'Account holder',
        email: user.email ?? '',
        category: 'data_request',
        subject: 'Data export request (Subject Access Request)',
        description: `User ID: ${user.id}\n\nThis is an automated Subject Access Request (SAR) / data portability request submitted by the account holder via their Privacy Settings. Please process this request within 30 days as required by UK GDPR / POPIA.`,
        priority: 'p2',
        status: 'open',
      });

      if (error) {
        setActionError('Failed to submit your request. Please email privacy@rotawell.co.uk directly.');
      } else {
        setExportRequested(true);
      }
    } catch (err) {
      setActionError('An error occurred. Please email privacy@rotawell.co.uk directly.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestDeletion = async () => {
    if (deletionConfirm !== 'DELETE MY ACCOUNT') {
      setActionError('Please type DELETE MY ACCOUNT exactly to confirm.');
      return;
    }

    setActionLoading(true);
    setActionError(null);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setActionError('You must be signed in to request account deletion.');
        return;
      }

      const { error } = await supabase.from('nursly_support_tickets').insert({
        ticket_ref: `DELETE-${Date.now()}`,
        name: user.email ?? 'Account holder',
        email: user.email ?? '',
        category: 'data_request',
        subject: 'Account deletion request (Right to Erasure)',
        description: `User ID: ${user.id}\n\nThis is an automated Right to Erasure / account deletion request submitted by the account holder via their Privacy Settings.\n\nNote: Some data may be retained where required by legal obligations (e.g., financial records per HMRC requirements). Please process within 30 days.`,
        priority: 'p2',
        status: 'open',
      });

      if (error) {
        setActionError('Failed to submit your request. Please email privacy@rotawell.co.uk directly.');
      } else {
        setDeletionRequested(true);
      }
    } catch (err) {
      setActionError('An error occurred. Please email privacy@rotawell.co.uk directly.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Privacy & Data Rights</h1>
        <p className="mt-2 text-gray-600">
          Manage your consent, cookies, and exercise your rights under UK GDPR and POPIA.
        </p>
      </div>

      {/* Cookie preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Cookie Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Control which cookies are active on your account. Essential cookies are always required for the platform to function.
          </p>
          <div className="space-y-4">
            {[
              {
                id: 'essential',
                label: 'Essential cookies',
                desc: 'Required for authentication and platform security.',
                required: true,
                value: true,
              },
              {
                id: 'functional',
                label: 'Functional cookies',
                desc: 'Remember your preferences and UI settings.',
                required: false,
                value: cookiePrefs.functional,
              },
              {
                id: 'analytics',
                label: 'Analytics cookies',
                desc: 'Help us understand how the platform is used (anonymised data only).',
                required: false,
                value: cookiePrefs.analytics,
              },
              {
                id: 'marketing',
                label: 'Marketing cookies',
                desc: 'Used to deliver relevant communications and adverts.',
                required: false,
                value: cookiePrefs.marketing,
              },
            ].map((cookie) => (
              <div key={cookie.id} className="flex items-start justify-between gap-4 rounded-lg border border-gray-100 p-4">
                <div>
                  <p className="font-medium text-gray-900">{cookie.label}</p>
                  <p className="text-sm text-gray-500 mt-1">{cookie.desc}</p>
                </div>
                {cookie.required ? (
                  <span className="text-xs text-green-700 bg-green-100 px-3 py-1 rounded-full font-medium flex-shrink-0">Always on</span>
                ) : (
                  <label className="relative inline-flex cursor-pointer items-center flex-shrink-0 mt-1">
                    <input
                      type="checkbox"
                      checked={cookie.value}
                      onChange={(e) => setCookiePrefs((p) => ({ ...p, [cookie.id]: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-5"></div>
                  </label>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="primary" size="sm" onClick={handleSaveCookiePrefs}>
              Save preferences
            </Button>
            {cookieSaved && (
              <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                Saved
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Marketing consent */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Communication Consent
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Manage your consent for marketing communications. You will always receive essential transactional messages (booking confirmations, payment notifications, compliance alerts) regardless of these settings.
          </p>
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-gray-900">Marketing emails</p>
                <p className="text-sm text-gray-500 mt-1">News, product updates, and occasional promotions from Rotawell.</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center flex-shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={consentRecord.marketing}
                  onChange={(e) => setConsentRecord((p) => ({ ...p, marketing: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-5"></div>
              </label>
            </div>
          </div>
          <p className="text-xs text-gray-400">
            You can also manage notifications in your{' '}
            <Link href="/settings/notifications" className="text-primary underline">notification settings</Link>.
          </p>
        </CardContent>
      </Card>

      {/* Data export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Request Data Export (Subject Access Request)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Under UK GDPR (Article 15) and POPIA (Section 23), you have the right to request a copy of all personal data we hold about you.
            We will respond within <strong>30 days</strong>.
          </p>
          {exportRequested ? (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-800">
                Your data export request has been received. We will contact you at your registered email address within 30 days.
              </p>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={handleRequestExport}
              disabled={actionLoading}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Request my data
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Account deletion */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <Trash2 className="h-5 w-5" />
            Request Account Deletion (Right to Erasure)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> Account deletion is permanent. Some data may be retained where required by law (e.g., financial records for 7 years per HMRC requirements, DBS records for 6 years). We will inform you of any data retained and the legal basis for retention.
            </p>
          </div>

          {deletionRequested ? (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-800">
                Your deletion request has been submitted. We will contact you within 30 days to confirm the actions taken.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Type <span className="font-mono bg-gray-100 px-1 rounded">DELETE MY ACCOUNT</span> to confirm
                </label>
                <input
                  type="text"
                  value={deletionConfirm}
                  onChange={(e) => {
                    setDeletionConfirm(e.target.value);
                    setActionError(null);
                  }}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-20"
                  placeholder="DELETE MY ACCOUNT"
                />
              </div>
              {actionError && (
                <p className="text-sm text-red-600">{actionError}</p>
              )}
              <Button
                variant="outline"
                onClick={handleRequestDeletion}
                disabled={actionLoading || deletionConfirm !== 'DELETE MY ACCOUNT'}
                className="flex items-center gap-2 border-red-300 text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                Submit deletion request
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Links */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Further information</h3>
        <ul className="space-y-2 text-sm">
          <li>
            <Link href="/legal/privacy" className="text-primary underline hover:no-underline">
              Full Privacy Policy (GDPR & POPIA)
            </Link>
          </li>
          <li>
            <Link href="/legal/gdpr" className="text-primary underline hover:no-underline">
              GDPR & Data Protection guide
            </Link>
          </li>
          <li>
            <a href="mailto:privacy@rotawell.co.uk" className="text-primary underline hover:no-underline">
              Contact our privacy team: privacy@rotawell.co.uk
            </a>
          </li>
          <li>
            <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:no-underline">
              Information Commissioner&apos;s Office (UK) â ico.org.uk
            </a>
          </li>
          <li>
            <a href="https://inforegulator.org.za" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:no-underline">
              Information Regulator (South Africa) â inforegulator.org.za
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
