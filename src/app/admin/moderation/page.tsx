'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Flag, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { NurslyModerationFlag } from '@/lib/types';

const severityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'bg-red-100 text-red-800';
    case 'high':
      return 'bg-orange-100 text-orange-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const typeLabel = (type: string) => {
  switch (type) {
    case 'profile_review':
      return 'Profile Review';
    case 'review_abuse':
      return 'Review Abuse';
    case 'message_content':
      return 'Message Content';
    case 'rate_manipulation':
      return 'Rate Manipulation';
    default:
      return type;
  }
};

export default function ModerationPage() {
  const [flags, setFlags] = useState<NurslyModerationFlag[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFlags = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('nursly_moderation_flags')
      .select('*')
      .order('flagged_at', { ascending: false });

    if (error) {
      console.error('Error fetching flags:', error);
      setLoading(false);
      return;
    }

    setFlags((data as NurslyModerationFlag[]) || []);

    setLoading(false);
  };

  useEffect(() => {
    fetchFlags();
  }, []);

  const pendingFlags = flags.filter((f) => f.status === 'pending');
  const criticalFlags = flags.filter((f) => f.severity === 'critical' && f.status === 'pending');

  const handleApprove = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('nursly_moderation_flags')
      .update({
        status: 'reviewed',
        action_taken: 'Approved',
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error('Error approving flag:', error);
      return;
    }

    await fetchFlags();
  };

  const handleRemove = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('nursly_moderation_flags')
      .update({
        status: 'resolved',
        action_taken: 'Content removed',
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error('Error removing flag:', error);
      return;
    }

    await fetchFlags();
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Moderation</h1>
          <p className="mt-2 text-gray-600">Review and moderate user-generated content</p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-gray-600">Loading moderation flags...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Content Moderation</h1>
        <p className="mt-2 text-gray-600">Review and moderate user-generated content</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className={criticalFlags.length > 0 ? 'border-red-200 bg-red-50' : ''}>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Critical flags</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{criticalFlags.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Pending review</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{pendingFlags.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Reviewed</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {flags.filter((f) => f.status === 'reviewed' || f.status === 'resolved').length}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {flags.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Flag className="h-12 w-12 text-gray-300" />
              <p className="mt-4 text-lg font-medium text-gray-900">No moderation flags</p>
              <p className="mt-1 text-gray-600">There are no content flags to review at this time</p>
            </CardContent>
          </Card>
        )}
        {flags.map((flag) => (
          <Card key={flag.id}>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {flag.severity === 'critical' ? (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      ) : (
                        <Flag className="h-5 w-5 text-orange-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{typeLabel(flag.flag_type)}</h3>
                      <p className="mt-1 text-sm text-gray-600">User: {flag.flagged_user || 'Unknown'}</p>
                      <p className="mt-2 text-sm font-medium text-gray-900">{flag.issue}</p>
                      <p className="mt-1 text-sm text-gray-600">{flag.reason}</p>
                      {(flag.status === 'reviewed' || flag.status === 'resolved') && flag.action_taken && (
                        <p className="mt-2 text-sm text-green-600">Action: {flag.action_taken}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge className={severityColor(flag.severity)}>
                      {flag.severity.charAt(0).toUpperCase() + flag.severity.slice(1)}
                    </Badge>
                    {flag.status === 'pending' ? (
                      <Badge variant="warning">Pending</Badge>
                    ) : flag.status === 'resolved' ? (
                      <Badge variant="danger">Resolved</Badge>
                    ) : (
                      <Badge variant="success">Reviewed</Badge>
                    )}
                  </div>
                </div>

                {flag.status === 'pending' && (
                  <div className="flex flex-col gap-2 sm:items-end">
                    <Button
                      variant="primary"
                      onClick={() => handleApprove(flag.id)}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      className="flex items-center gap-2"
                      onClick={() => handleRemove(flag.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                )}
                {(flag.status === 'reviewed' || flag.status === 'resolved') && (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
