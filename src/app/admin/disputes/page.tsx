'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';
import type { NurlySupportTicket } from '@/lib/types';

export default function DisputesPage() {
  const { toast } = useToast();
  const [disputes, setDisputes] = useState<NurlySupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [resolutionText, setResolutionText] = useState('');

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('nursly_support_tickets')
          .select('*')
          .eq('category', 'shift_dispute')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error:', error);
        } else {
          setDisputes((data as NurlySupportTicket[]) || []);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDisputes();
  }, []);

  const openDisputes = disputes.filter((d) => d.status === 'open');
  const resolvedDisputes = disputes.filter((d) => d.status === 'resolved' || d.status === 'closed');

  const handleResolveDispute = async (disputeId: string) => {
    if (!resolutionText.trim()) {
      toast('Please enter a resolution', 'error');
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('nursly_support_tickets')
        .update({
          status: 'resolved',
          resolution: resolutionText,
        })
        .eq('id', disputeId);

      if (error) {
        toast('Failed to resolve dispute', 'error');
      } else {
        setDisputes((prev) =>
          prev.map((d) =>
            d.id === disputeId
              ? { ...d, status: 'resolved', resolution: resolutionText }
              : d
          )
        );
        setResolvingId(null);
        setResolutionText('');
        toast('Dispute resolved successfully', 'success');
      }
    } catch (err) {
      console.error('Error:', err);
      toast('Failed to resolve dispute', 'error');
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shift Disputes</h1>
          <p className="mt-2 text-gray-600">Review and resolve shift disputes</p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-gray-600">Loading disputes...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Shift Disputes</h1>
        <p className="mt-2 text-gray-600">Review and resolve shift disputes</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total disputes</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{disputes.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Open</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{openDisputes.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Resolved</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{resolvedDisputes.length}</p>
          </CardContent>
        </Card>
      </div>

      {openDisputes.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Open Disputes ({openDisputes.length})</h2>
          <div className="space-y-4">
            {openDisputes.map((dispute) => (
              <Card key={dispute.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{dispute.subject}</h3>
                      <p className="mt-1 text-sm text-gray-600">{dispute.description}</p>
                      <div className="mt-2 flex gap-2">
                        <Badge variant="warning" className="capitalize">
                          {dispute.priority}
                        </Badge>
                        <Badge variant="secondary">Open</Badge>
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        Created {formatDate(dispute.created_at)}
                      </p>

                      {resolvingId === dispute.id && (
                        <div className="mt-4 bg-gray-50 p-4 rounded-lg space-y-3">
                          <label className="block text-sm font-medium text-gray-900">
                            Resolution Details
                          </label>
                          <textarea
                            value={resolutionText}
                            onChange={(e) => setResolutionText(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20"
                            rows={3}
                            placeholder="Explain how this dispute was resolved..."
                          />
                          <div className="flex gap-2">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleResolveDispute(dispute.id)}
                            >
                              Submit Resolution
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setResolvingId(null);
                                setResolutionText('');
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {resolvingId !== dispute.id && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setResolvingId(dispute.id)}
                      >
                        Resolve
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {resolvedDisputes.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Resolved ({resolvedDisputes.length})</h2>
          <div className="space-y-4">
            {resolvedDisputes.map((dispute) => (
              <Card key={dispute.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{dispute.subject}</h3>
                      <p className="mt-1 text-sm text-gray-600">{dispute.description}</p>
                      <div className="mt-2">
                        <Badge variant="success">
                          {dispute.status === 'resolved' ? 'Resolved' : 'Closed'}
                        </Badge>
                      </div>
                    </div>
                    {dispute.resolution && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-900">
                          <span className="font-semibold">Resolution:</span> {dispute.resolution}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {disputes.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-lg font-medium text-gray-900">No disputes</p>
            <p className="mt-1 text-gray-600">All shift disputes are resolved</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
