'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Mail, MessageSquare, Clock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function NotificationsPage() {
  const [preferences, setPreferences] = useState({
    shiftAlerts: true,
    bookingUpdates: true,
    paymentNotifications: true,
    complianceReminders: true,
    marketing: false,
  });

  const [quietHours, setQuietHours] = useState({
    enabled: false,
    start: '22:00',
    end: '08:00',
  });

  const [channels, setChannels] = useState({
    inApp: true,
    email: true,
    sms: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadPreferences = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setUserId(user.id);

      const { data, error } = await supabase
        .from('nursly_notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading preferences:', error);
        setLoading(false);
        return;
      }

      if (data) {
        setPreferences({
          shiftAlerts: data.shift_alerts,
          bookingUpdates: data.booking_updates,
          paymentNotifications: data.payment_notifications,
          complianceReminders: data.compliance_reminders,
          marketing: data.marketing,
        });
        setQuietHours({
          enabled: data.quiet_hours_enabled,
          start: data.quiet_hours_start,
          end: data.quiet_hours_end,
        });
        setChannels({
          inApp: data.channel_in_app,
          email: data.channel_email,
          sms: data.channel_sms,
        });
      }

      setLoading(false);
    };

    loadPreferences();
  }, []);

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
    setSaveSuccess(false);
  };

  const handleChannelToggle = (key: keyof typeof channels) => {
    setChannels((prev) => ({ ...prev, [key]: !prev[key] }));
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    if (!userId) return;

    setSaving(true);
    setSaveSuccess(false);

    const supabase = createClient();
    const payload = {
      user_id: userId,
      shift_alerts: preferences.shiftAlerts,
      booking_updates: preferences.bookingUpdates,
      payment_notifications: preferences.paymentNotifications,
      compliance_reminders: preferences.complianceReminders,
      marketing: preferences.marketing,
      quiet_hours_enabled: quietHours.enabled,
      quiet_hours_start: quietHours.start,
      quiet_hours_end: quietHours.end,
      channel_in_app: channels.inApp,
      channel_email: channels.email,
      channel_sms: channels.sms,
    };

    const { error } = await supabase
      .from('nursly_notification_preferences')
      .upsert(payload, { onConflict: 'user_id' });

    if (error) {
      console.error('Error saving preferences:', error);
    } else {
      setSaveSuccess(true);
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notification Preferences</h1>
          <p className="mt-2 text-gray-600">Manage how and when you receive notifications</p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-gray-600">Loading preferences...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Notification Preferences</h1>
        <p className="mt-2 text-gray-600">Manage how and when you receive notifications</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Types
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'shiftAlerts', label: 'Shift Alerts', desc: 'Get notified about new shifts matching your preferences' },
            { key: 'bookingUpdates', label: 'Booking Updates', desc: 'Receive updates on shift bookings and cancellations' },
            { key: 'paymentNotifications', label: 'Payment Notifications', desc: 'Get alerts about payments and invoices' },
            { key: 'complianceReminders', label: 'Compliance Reminders', desc: 'Reminders for document renewals and training' },
            { key: 'marketing', label: 'Marketing Emails', desc: 'Promotional offers and news from Rotawell' },
          ].map((item) => (
            <div key={item.key} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.label}</p>
                <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer ml-4">
                <input
                  type="checkbox"
                  checked={preferences[item.key as keyof typeof preferences]}
                  onChange={() => handleToggle(item.key as keyof typeof preferences)}
                  className="w-5 h-5"
                />
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Quiet Hours
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={quietHours.enabled}
              onChange={(e) => {
                setQuietHours({ ...quietHours, enabled: e.target.checked });
                setSaveSuccess(false);
              }}
              className="w-5 h-5"
            />
            <label className="text-gray-900 font-medium">Enable quiet hours</label>
          </div>

          {quietHours.enabled && (
            <div className="grid gap-4 sm:grid-cols-2 pl-8">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Start Time</label>
                <input
                  type="time"
                  value={quietHours.start}
                  onChange={(e) => {
                    setQuietHours({ ...quietHours, start: e.target.value });
                    setSaveSuccess(false);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">End Time</label>
                <input
                  type="time"
                  value={quietHours.end}
                  onChange={(e) => {
                    setQuietHours({ ...quietHours, end: e.target.value });
                    setSaveSuccess(false);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Notification Channels
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'inApp', label: 'In-App Notifications', icon: Bell },
            { key: 'email', label: 'Email', icon: Mail },
            { key: 'sms', label: 'SMS', icon: MessageSquare },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5 text-gray-600" />
                <p className="font-medium text-gray-900">{item.label}</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={channels[item.key as keyof typeof channels]}
                  onChange={() => handleChannelToggle(item.key as keyof typeof channels)}
                  className="w-5 h-5"
                />
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex items-center gap-4">
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Preferences'}
        </Button>
        {saveSuccess && (
          <span className="text-sm font-medium text-green-600">Preferences saved</span>
        )}
      </div>
    </div>
  );
}
