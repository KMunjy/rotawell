'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';
import type { NurslyShiftApplication } from '@/lib/types';

interface ApplicationWithDetails extends NurslyShiftApplication {
  shift?: { title: string };
  nurse?: { full_name: string };
}

const PAGE_SIZE = 20;

export default function ApplicantsPage() {
  const { toast } = useToast();
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        // Get the user's org_id from nursly_org_members
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

        // Get shifts for this org using the correct org_id
        const { data: shifts, error: shiftsError } = await supabase
          .from('nursly_shifts')
          .select('id')
          .eq('org_id', orgMember.org_id);

        if (shiftsError) {
          toast('Failed to load shifts', 'error');
          setLoading(false);
          return;
        }

        if (!shifts || shifts.length === 0) {
          setApplications([]);
          setTotalCount(0);
          setLoading(false);
          return;
        }

        const shiftIds = shifts.map((s: any) => s.id);

        // Get total count for pagination
        const { count } = await supabase
          .from('nursly_shift_applications')
          .select('*', { count: 'exact', head: true })
          .in('shift_id', shiftIds);

        setTotalCount(count || 0);

        // Get paginated applications
        const { data, error } = await supabase
          .from('nursly_shift_applications')
          .select(`
            *,
            shift:nursly_shifts(title),
            nurse:nursly_profiles(full_name)
          `)
          .in('shift_id', shiftIds)
          .order('applied_at', { ascending: false })
          .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

        if (error) {
          toast('Failed to load applications', 'error');
        } else {
          setApplications((data as ApplicationWithDetails[]) || []);
        }
      } catch (err) {
        console.error('Error:', err);
        toast('An unexpected error occurred', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [page]);

  const pendingApps = applications.filter((a) => a.status === 'pending');
  const reviewedApps = applications.filter((a) => a.status !== 'pending');
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const handleApprove = async (appId: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('nursly_shift_applications')
        .update({ status: 'selected' })
        .eq('id', appId);

      if (error) {
        toast('Failed to approve application', 'error');
      } else {
        setApplications((prev) =>
          prev.map((a) => (a.id === appId ? { ...a, status: 'selected' } : a))
        );
        toast('Application approved', 'success');
      }
    } catch (err) {
      console.error('Error:', err);
      toast('Failed to approve application', 'error');
    }
  };

  const handleReject = async (appId: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('nursly_shift_applications')
        .update({ status: 'rejected' })
        .eq('id', appId);

      if (error) {
        toast('Failed to reject application', 'error');
      } else {
        setApplications((prev) =>
          prev.map((a) => (a.id === appId ? { ...a, status: 'rejected' } : a))
        );
        toast('Application rejected', 'success');
      }
    } catch (err) {
      console.error('Error:', err);
      toast('Failed to reject application', 'error');
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
          <p className="mt-2 text-gray-600">Review and manage shift applications</p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-gray-600">Loading applications...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
        <p className="mt-2 text-gray-600">Review and manage shift applications</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total applications</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{totalCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Pending review (this page)</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{pendingApps.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Reviewed (this page)</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{reviewedApps.length}</p>
          </CardContent>
        </Card>
      </div>

      {pendingApps.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Pending Review ({pendingApps.length})</h2>
          <div className="space-y-4">
            {pendingApps.map((app) => (
              <Card key={app.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{app.shift?.title}</h3>
                      <p className="mt-1 text-sm text-gray-600">Applicant: {app.nurse?.full_name}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        Applied {formatDate(app.applied_at)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApprove(app.id)}
                        className="flex items-center gap-1"
                      >
                        <Check className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(app.id)}
                        className="flex items-center gap-1 text-red-600"
                      >
                        <X className="h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {reviewedApps.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Reviewed ({reviewedApps.length})</h2>
          <div className="space-y-4">
            {reviewedApps.map((app) => (
              <Card key={app.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{app.shift?.title}</h3>
                      <p className="mt-1 text-sm text-gray-600">Applicant: {app.nurse?.full_name}</p>
                      <p className="mt-2">
                        <Badge
                          variant={
                            app.status === 'selected'
                              ? 'success'
                              : app.status === 'rejected'
                                ? 'danger'
                                : 'secondary'
                          }
                        >
                          {app.status === 'selected'
                            ? 'Approved'
                            : app.status === 'rejected'
                              ? 'Rejected'
                              : app.status}
                        </Badge>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {applications.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Clock className="h-12 w-12 text-gray-300" />
            <p className="mt-4 text-lg font-medium text-gray-900">No applications yet</p>
            <p className="mt-1 text-gray-600">Applications will appear here when nurses apply for your shifts</p>
          </CardContent>
        </Card>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Page {page + 1} of {totalPages} ({totalCount} total)
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
