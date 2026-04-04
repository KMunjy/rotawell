'use client';

import { useEffect, useState } from 'react';
import { MapPin, Clock, DollarSign, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { NurslyShift } from '@/lib/types';

interface BookingWithDetails extends NurslyShift {
  location?: { name: string; city: string };
  filled_nurse?: { full_name: string };
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [messagingId, setMessagingId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageSentId, setMessageSentId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        const { data: orgMember } = await supabase
          .from('nursly_org_members')
          .select('org_id')
          .eq('user_id', user.id)
          .single();

        if (!orgMember) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('nursly_shifts')
          .select(`
            *,
            location:nursly_org_locations(name, city),
            filled_nurse:nursly_profiles(full_name)
          `)
          .eq('org_id', orgMember.org_id)
          .in('status', ['filled', 'in_progress', 'completed'])
          .order('start_time', { ascending: false });

        if (error) {
          console.error('Error fetching bookings:', error);
        } else {
          setBookings((data as BookingWithDetails[]) || []);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const activeBookings = bookings.filter((b) => b.status === 'filled' || b.status === 'in_progress');
  const completedBookings = bookings.filter((b) => b.status === 'completed');

  const calculateHours = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  };

  const handleSendMessage = async (booking: BookingWithDetails) => {
    if (!messageText.trim() || !booking.filled_by) return;

    setSendingMessage(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { error } = await supabase.from('nursly_notifications').insert({
        event_type: 'message',
        channel: 'in_app',
        recipient_id: booking.filled_by,
        payload: {
          message: messageText.trim(),
          sender_id: user.id,
          sender_name: 'Provider',
          shift_id: booking.id,
          shift_title: booking.title,
        },
      });

      if (error) {
        console.error('Failed to send message:', error);
        return;
      }

      setMessageText('');
      setMessageSentId(booking.id);
      setTimeout(() => {
        setMessageSentId(null);
        setMessagingId(null);
      }, 2000);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
          <p className="mt-2 text-gray-600">Track your shift bookings</p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-gray-600">Loading bookings...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
        <p className="mt-2 text-gray-600">Track your shift bookings</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total bookings</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{bookings.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Active shifts</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{activeBookings.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{completedBookings.length}</p>
          </CardContent>
        </Card>
      </div>

      {activeBookings.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Active Shifts ({activeBookings.length})</h2>
          <div className="space-y-4">
            {activeBookings.map((booking) => {
              const hours = calculateHours(booking.start_time, booking.end_time);
              return (
                <Card key={booking.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{booking.title}</h3>
                          <p className="mt-1 text-sm text-gray-600">
                            Worker: {booking.filled_nurse?.full_name}
                          </p>

                          <div className="mt-4 grid gap-2 sm:grid-cols-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="h-4 w-4" />
                              {booking.location?.city || 'Unknown'}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="h-4 w-4" />
                              {hours.toFixed(1)} hours
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <DollarSign className="h-4 w-4" />
                              {formatCurrency(booking.rate_per_hour * hours)}
                            </div>
                          </div>

                          <div className="mt-4">
                            <Badge
                              variant={booking.status === 'in_progress' ? 'warning' : 'success'}
                            >
                              {booking.status === 'in_progress' ? 'In Progress' : 'Confirmed'}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 sm:items-end">
                          <Button
                            variant="primary"
                            onClick={() => setExpandedId(expandedId === booking.id ? null : booking.id)}
                          >
                            {expandedId === booking.id ? 'Hide Details' : 'View Details'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setMessagingId(messagingId === booking.id ? null : booking.id)}
                          >
                            Message worker
                          </Button>
                        </div>
                      </div>

                      {expandedId === booking.id && (
                        <div className="border-t pt-4 space-y-3">
                          <h4 className="font-semibold text-gray-900">Shift Details</h4>
                          <div className="grid gap-3 text-sm">
                            <div>
                              <p className="text-gray-600">Start Time</p>
                              <p className="font-medium text-gray-900">
                                {new Date(booking.start_time).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">End Time</p>
                              <p className="font-medium text-gray-900">
                                {new Date(booking.end_time).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Worker</p>
                              <p className="font-medium text-gray-900">{booking.filled_nurse?.full_name}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Duration & Cost</p>
                              <p className="font-medium text-gray-900">
                                {hours.toFixed(1)} hours @ {formatCurrency(booking.rate_per_hour)}/hr = {formatCurrency(booking.rate_per_hour * hours)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {messagingId === booking.id && (
                        <div className="border-t pt-4 space-y-3">
                          {messageSentId === booking.id ? (
                            <p className="text-sm font-medium text-green-600">Message sent</p>
                          ) : (
                            <div>
                              <label className="block text-sm font-medium text-gray-900 mb-2">
                                Message to {booking.filled_nurse?.full_name}
                              </label>
                              <textarea
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20"
                                rows={3}
                                placeholder="Type your message..."
                              />
                              <div className="mt-2 flex gap-2">
                                <Button
                                  variant="primary"
                                  size="sm"
                                  disabled={sendingMessage || !messageText.trim()}
                                  onClick={() => handleSendMessage(booking)}
                                >
                                  {sendingMessage ? 'Sending...' : 'Send'}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setMessageText('');
                                    setMessagingId(null);
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {completedBookings.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Completed Shifts ({completedBookings.length})</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {completedBookings.map((booking) => {
                  const hours = calculateHours(booking.start_time, booking.end_time);
                  return (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between border-b border-gray-200 pb-4 last:border-0"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{booking.title}</p>
                        <p className="text-sm text-gray-600">{booking.filled_nurse?.full_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(booking.rate_per_hour * hours)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Completed {formatDate(booking.updated_at)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {bookings.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="h-12 w-12 text-gray-300" />
            <p className="mt-4 text-lg font-medium text-gray-900">No bookings yet</p>
            <p className="mt-1 text-gray-600">Bookings will appear here after nurses accept shifts</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
