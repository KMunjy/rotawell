'use client';

import { useEffect, useState, useCallback } from 'react';
import { MapPin, Clock, DollarSign, AlertCircle, CheckCircle, Clock3, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { NurslyShift } from '@/lib/types';

interface BookingWithShift extends NurslyShift {
  org?: { name: string };
  location?: { name: string; city: string };
}

export default function BookingsPage() {
  const [activeBookings, setActiveBookings] = useState<BookingWithShift[]>([]);
  const [completedBookings, setCompletedBookings] = useState<BookingWithShift[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [messagingId, setMessagingId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: active, error: activeError } = await supabase
        .from('nursly_shifts')
        .select(`
          *,
          org:nursly_organisations(name),
          location:nursly_org_locations(name, city)
        `)
        .eq('filled_by', user.id)
        .in('status', ['filled', 'in_progress']);

      if (!activeError && active) {
        setActiveBookings((active as BookingWithShift[]) || []);
      }

      const { data: completed, error: completedError } = await supabase
        .from('nursly_shifts')
        .select(`
          *,
          org:nursly_organisations(name),
          location:nursly_org_locations(name, city)
        `)
        .eq('filled_by', user.id)
        .in('status', ['completed', 'cancelled'])
        .order('updated_at', { ascending: false });

      if (!completedError && completed) {
        setCompletedBookings((completed as BookingWithShift[]) || []);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleClockIn = async (shiftId: string) => {
    setActionLoading(shiftId);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('nursly_shifts')
        .update({ status: 'in_progress', updated_at: new Date().toISOString() })
        .eq('id', shiftId);

      if (error) {
        console.error('Clock in error:', error);
      } else {
        setSuccessMessage('Clocked in successfully');
        setTimeout(() => setSuccessMessage(null), 3000);
        await fetchBookings();
      }
    } catch (err) {
      console.error('Error clocking in:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleClockOut = async (shiftId: string) => {
    setActionLoading(shiftId);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('nursly_shifts')
        .update({ status: 'completed', updated_at: new Date().toISOString() })
        .eq('id', shiftId);

      if (error) {
        console.error('Clock out error:', error);
      } else {
        setSuccessMessage('Clocked out successfully');
        setTimeout(() => setSuccessMessage(null), 3000);
        await fetchBookings();
      }
    } catch (err) {
      console.error('Error clocking out:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendMessage = async (booking: BookingWithShift) => {
    if (!messageText.trim()) return;
    setSendingMessage(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from('nursly_notifications').insert({
        recipient_id: booking.posted_by,
        event_type: 'message',
        channel: 'in_app',
        status: 'pending',
        payload: { message: messageText, shift_id: booking.id, shift_title: booking.title },
      });

      if (error) {
        console.error('Send message error:', error);
      } else {
        setSuccessMessage('Message sent to provider');
        setTimeout(() => setSuccessMessage(null), 3000);
        setMessageText('');
        setMessagingId(null);
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSendingMessage(false);
    }
  };

  const toggleDetails = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case 'in_progress':
        return <Clock3 className="h-5 w-5 text-blue-600" />;
      case 'filled':
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      default:
        return null;
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'filled':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'In Progress';
      case 'filled':
        return 'Confirmed';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const calculateHours = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="mt-2 text-gray-600">Track your confirmed and completed shifts</p>
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
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <p className="mt-2 text-gray-600">Track your confirmed and completed shifts</p>
      </div>

      {successMessage && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {successMessage}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Active Shifts ({activeBookings.length})</h2>
          {activeBookings.length > 0 ? (
            <div className="space-y-4">
              {activeBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">{statusIcon(booking.status)}</div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">{booking.title}</h3>
                            <p className="mt-1 text-sm text-gray-600">{booking.org?.name}</p>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-2 sm:grid-cols-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            {booking.location?.city || 'Unknown location'}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <DollarSign className="h-4 w-4" />
                            {formatCurrency(booking.rate_per_hour)}/hour
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            {new Date(booking.start_time).toLocaleTimeString('en-GB', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}{' '}
                            -{' '}
                            {new Date(booking.end_time).toLocaleTimeString('en-GB', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>

                        <div className="mt-4">
                          <Badge className={statusColor(booking.status)}>
                            {statusLabel(booking.status)}
                          </Badge>
                        </div>

                        {expandedId === booking.id && (
                          <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm space-y-2">
                            <p><span className="font-medium">Start:</span> {new Date(booking.start_time).toLocaleString('en-GB')}</p>
                            <p><span className="font-medium">End:</span> {new Date(booking.end_time).toLocaleString('en-GB')}</p>
                            <p><span className="font-medium">Rate:</span> {formatCurrency(booking.rate_per_hour)}/hour</p>
                            <p><span className="font-medium">Location:</span> {booking.location?.name || 'N/A'}, {booking.location?.city || 'N/A'}</p>
                            {booking.notes && <p><span className="font-medium">Notes:</span> {booking.notes}</p>}
                          </div>
                        )}

                        {messagingId === booking.id && (
                          <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-3">
                            <textarea
                              value={messageText}
                              onChange={(e) => setMessageText(e.target.value)}
                              placeholder="Type your message to the provider..."
                              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                              rows={3}
                            />
                            <div className="flex gap-2">
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleSendMessage(booking)}
                                disabled={sendingMessage || !messageText.trim()}
                                className="flex items-center gap-2"
                              >
                                <Send className="h-4 w-4" />
                                {sendingMessage ? 'Sending...' : 'Send'}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => { setMessagingId(null); setMessageText(''); }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 sm:items-end">
                        {booking.status === 'in_progress' ? (
                          <>
                            <Button
                              variant="primary"
                              onClick={() => handleClockOut(booking.id)}
                              disabled={actionLoading === booking.id}
                            >
                              {actionLoading === booking.id ? 'Processing...' : 'Clock out'}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setMessagingId(messagingId === booking.id ? null : booking.id);
                                setMessageText('');
                              }}
                            >
                              Message provider
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="primary"
                              onClick={() => handleClockIn(booking.id)}
                              disabled={actionLoading === booking.id}
                            >
                              {actionLoading === booking.id ? 'Processing...' : 'Clock in'}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleDetails(booking.id)}
                            >
                              {expandedId === booking.id ? 'Hide details' : 'View details'}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <p className="text-gray-600">No active bookings yet</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Completed Shifts ({completedBookings.length})</h2>
          {completedBookings.length > 0 ? (
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
                          <p className="text-sm text-gray-600">{booking.org?.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(booking.rate_per_hour * hours)}
                          </p>
                          <p className="text-xs text-gray-500">Completed {formatDate(booking.updated_at)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <p className="text-gray-600">No completed shifts yet</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
