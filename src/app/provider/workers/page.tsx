'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';
import type { NurslyNurseProfile, NurslyProfile } from '@/lib/types';

interface Worker extends NurslyProfile {
  nurse_profile?: NurslyNurseProfile;
  shifts_completed?: number;
  rating?: number;
}

const PAGE_SIZE = 20;

export default function WorkersPage() {
  const { toast } = useToast();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [messagingId, setMessagingId] = useState<string | null>(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageSentId, setMessageSentId] = useState<string | null>(null);
  const [activeThisWeek, setActiveThisWeek] = useState(0);
  const [repeatWorkers, setRepeatWorkers] = useState(0);
  const [page, setPage] = useState(0);
  const [totalWorkers, setTotalWorkers] = useState(0);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        const { data: orgMember, error: orgError } = await supabase
          .from('nursly_org_members')
          .select('org_id')
          .eq('user_id', user.id)
          .single();

        if (orgError || !orgMember) {
          toast('Could not find your organisation', 'error');
          setLoading(false);
          return;
        }

        // All filled shifts for this org
        const { data: allFilledShifts, error: shiftsError } = await supabase
          .from('nursly_shifts')
          .select('filled_by, start_time')
          .eq('org_id', orgMember.org_id)
          .not('filled_by', 'is', null);

        if (shiftsError) {
          toast('Failed to load worker data', 'error');
          setLoading(false);
          return;
        }

        const filledShifts = allFilledShifts || [];

        // Count shifts per worker (for repeat workers: 2+)
        const workerShiftCounts: Record<string, number> = {};
        for (const s of filledShifts) {
          if (s.filled_by) {
            workerShiftCounts[s.filled_by] = (workerShiftCounts[s.filled_by] || 0) + 1;
          }
        }
        const repeatCount = Object.values(workerShiftCounts).filter((c) => c >= 2).length;
        setRepeatWorkers(repeatCount);

        // Active this week: distinct workers with shifts in last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const activeIds = new Set(
          filledShifts
            .filter((s) => s.start_time && new Date(s.start_time) >= sevenDaysAgo)
            .map((s) => s.filled_by)
        );
        setActiveThisWeek(activeIds.size);

        // Get unique nurse IDs (paginated)
        const allNurseIds = [...new Set(filledShifts.map((s) => s.filled_by).filter(Boolean))];
        setTotalWorkers(allNurseIds.length);

        const pageIds = allNurseIds.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

        if (pageIds.length > 0) {
          const { data: nurses, error: nursesError } = await supabase
            .from('nursly_profiles')
            .select(`
              *,
              nurse_profile:nursly_nurse_profiles(*)
            `)
            .in('id', pageIds);

          if (nursesError) {
            toast('Failed to load worker profiles', 'error');
          } else if (nurses) {
            setWorkers(nurses as Worker[]);
          }
        } else {
          setWorkers([]);
        }
      } catch (err) {
        console.error('Error:', err);
        toast('An unexpected error occurred', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, [page]);

  const handleSendMessage = async (worker: Worker) => {
    if (!messageText.trim()) return;

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
        recipient_id: worker.id,
        payload: {
          message: messageText.trim(),
          sender_id: user.id,
          sender_name: 'Provider',
        },
      });

      if (error) {
        toast('Failed to send message', 'error');
        return;
      }

      setMessageText('');
      setMessageSentId(worker.id);
      toast('Message sent', 'success');
      setTimeout(() => {
        setMessageSentId(null);
        setMessagingId(null);
      }, 2000);
    } catch (err) {
      console.error('Error:', err);
      toast('Failed to send message', 'error');
    } finally {
      setSendingMessage(false);
    }
  };

  const totalPages = Math.ceil(totalWorkers / PAGE_SIZE);

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nurses & Workers</h1>
          <p className="mt-2 text-gray-600">View nurses who have worked with you</p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-gray-600">Loading workers...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Nurses & Workers</h1>
        <p className="mt-2 text-gray-600">View nurses who have worked with you</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total workers</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{totalWorkers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Active this week</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{activeThisWeek}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Repeat workers</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{repeatWorkers}</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {workers.map((worker) => (
          <Card key={worker.id}>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                        {worker.full_name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{worker.full_name}</h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {worker.nurse_profile?.specialties?.map((spec: string) => (
                            <Badge key={spec} variant="secondary">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Award className="h-4 w-4" />
                        Shifts completed: {worker.shifts_completed || 0}
                      </div>
                      {worker.rating && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Star className="h-4 w-4 text-yellow-500" />
                          Rating: {worker.rating}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:items-end">
                    <Button
                      variant="primary"
                      onClick={() => setExpandedId(expandedId === worker.id ? null : worker.id)}
                    >
                      {expandedId === worker.id ? 'Hide Profile' : 'View Profile'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setMessagingId(messagingId === worker.id ? null : worker.id)}
                    >
                      Message
                    </Button>
                  </div>
                </div>

                {expandedId === worker.id && (
                  <div className="border-t pt-4 space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Full Profile</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p><strong>Name:</strong> {worker.full_name}</p>
                        <p><strong>Status:</strong> {worker.status}</p>
                        {worker.nurse_profile?.specialties && (
                          <p><strong>Specialties:</strong> {worker.nurse_profile.specialties.join(', ')}</p>
                        )}
                        {worker.nurse_profile?.years_experience != null && (
                          <p><strong>Experience:</strong> {worker.nurse_profile.years_experience} years</p>
                        )}
                        <p><strong>Member since:</strong> {new Date(worker.created_at).toLocaleDateString('en-GB')}</p>
                      </div>
                    </div>
                  </div>
                )}

                {messagingId === worker.id && (
                  <div className="border-t pt-4 space-y-3">
                    {messageSentId === worker.id ? (
                      <p className="text-sm font-medium text-green-600">Message sent</p>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Send Message
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
                            onClick={() => handleSendMessage(worker)}
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
        ))}
      </div>

      {totalWorkers === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-lg font-medium text-gray-900">No workers yet</p>
            <p className="mt-1 text-gray-600">Workers will appear here after they complete shifts for your organisation</p>
          </CardContent>
        </Card>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Page {page + 1} of {totalPages} ({totalWorkers} total)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="flex items-center gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
