'use client';

import { useEffect, useState } from 'react';
import { MetricCard } from '@/components/ui/metric-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Banknote, Zap, Users, AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import type { NurslyInstantPayRequest, InstantPayStatus } from '@/lib/types';

function statusBadgeVariant(status: InstantPayStatus): 'default' | 'success' | 'danger' | 'warning' {
  switch (status) {
    case 'completed': return 'success';
    case 'failed': return 'danger';
    case 'processing': return 'warning';
    default: return 'default';
  }
}

function statusLabel(status: InstantPayStatus): string {
  switch (status) {
    case 'pending': return 'Pending';
    case 'processing': return 'Processing';
    case 'completed': return 'Completed';
    case 'failed': return 'Failed';
  }
}

interface AdminPayRequest extends NurslyInstantPayRequest {
  user?: { full_name: string };
  shift?: { title: string; org_id: string };
}

export default function AdminInstantPayPage() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<AdminPayRequest[]>([]);
  const [filter, setFilter] = useState<'all' | InstantPayStatus>('all');

  const fetchData = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('nursly_instant_pay_requests')
        .select('*, user:nursly_profiles(full_name), shift:nursly_shifts(title, org_id)')
        .order('requested_at', { ascending: false });

      if (data) {
        setRequests(data as AdminPayRequest[]);
      }
    } catch (err) {
      console.error('Error fetching admin instant pay data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleUpdateStatus = async (requestId: string, newStatus: InstantPayStatus) => {
    const supabase = createClient();
    const updatePayload: Record<string, unknown> = { status: newStatus, updated_at: new Date().toISOString() };
    if (newStatus === 'completed' || newStatus === 'failed') {
      updatePayload.processed_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('nursly_instant_pay_requests')
      .update(updatePayload)
      .eq('id', requestId);

    if (!error) {
      fetchData();
    } else {
      console.error('Error updating status:', error);
    }
  };

  // Dev mock data
  const isDev = process.env.NODE_ENV === 'development';
  const mockRequests: AdminPayRequest[] = isDev && requests.length === 0 ? [
    {
      id: '1', user_id: 'u1', shift_id: 's1', amount: 85.00, fee: 2.13, status: 'pending',
      requested_at: '2026-04-04T09:15:00Z', processed_at: undefined,
      created_at: '2026-04-04T09:15:00Z', updated_at: '2026-04-04T09:15:00Z',
      user: { full_name: 'Sarah Johnson' }, shift: { title: 'Night Shift - Care Assistant', org_id: 'org1' },
    },
    {
      id: '2', user_id: 'u2', shift_id: 's2', amount: 120.00, fee: 3.00, status: 'pending',
      requested_at: '2026-04-04T08:30:00Z', processed_at: undefined,
      created_at: '2026-04-04T08:30:00Z', updated_at: '2026-04-04T08:30:00Z',
      user: { full_name: 'James Williams' }, shift: { title: 'Senior Care Assistant', org_id: 'org2' },
    },
    {
      id: '3', user_id: 'u3', shift_id: 's3', amount: 45.00, fee: 1.13, status: 'processing',
      requested_at: '2026-04-03T16:00:00Z', processed_at: undefined,
      created_at: '2026-04-03T16:00:00Z', updated_at: '2026-04-03T17:00:00Z',
      user: { full_name: 'Emily Chen' }, shift: { title: 'Home Care Support Worker', org_id: 'org1' },
    },
    {
      id: '4', user_id: 'u1', shift_id: 's4', amount: 95.00, fee: 2.38, status: 'completed',
      requested_at: '2026-04-02T11:00:00Z', processed_at: '2026-04-02T11:03:00Z',
      created_at: '2026-04-02T11:00:00Z', updated_at: '2026-04-02T11:03:00Z',
      user: { full_name: 'Sarah Johnson' }, shift: { title: 'Dementia Support - Day Shift', org_id: 'org3' },
    },
    {
      id: '5', user_id: 'u4', shift_id: 's5', amount: 60.00, fee: 1.50, status: 'completed',
      requested_at: '2026-04-01T14:20:00Z', processed_at: '2026-04-01T14:22:00Z',
      created_at: '2026-04-01T14:20:00Z', updated_at: '2026-04-01T14:22:00Z',
      user: { full_name: 'Michael Brown' }, shift: { title: 'Night Care Assistant', org_id: 'org2' },
    },
    {
      id: '6', user_id: 'u5', shift_id: 's6', amount: 40.00, fee: 1.00, status: 'failed',
      requested_at: '2026-03-30T09:00:00Z', processed_at: '2026-03-30T09:05:00Z',
      created_at: '2026-03-30T09:00:00Z', updated_at: '2026-03-30T09:05:00Z',
      user: { full_name: 'Lisa Patel' }, shift: { title: 'Weekend Care Shift', org_id: 'org1' },
    },
  ] : [];

  const displayRequests = requests.length > 0 ? requests : mockRequests;
  const filteredRequests = filter === 'all'
    ? displayRequests
    : displayRequests.filter((r) => r.status === filter);

  // Metrics
  const totalFloat = displayRequests
    .filter((r) => r.status === 'pending' || r.status === 'processing')
    .reduce((sum, r) => sum + r.amount, 0);

  const totalAdvanced = displayRequests
    .filter((r) => r.status === 'completed')
    .reduce((sum, r) => sum + r.amount, 0);

  const totalFees = displayRequests
    .filter((r) => r.status === 'completed')
    .reduce((sum, r) => sum + r.fee, 0);

  const pendingCount = displayRequests.filter((r) => r.status === 'pending').length;
  const uniqueUsers = new Set(displayRequests.map((r) => r.user_id)).size;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <Banknote className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold text-gray-900">Instant Pay</h1>
        </div>
        <p className="mt-2 text-gray-600">
          Manage instant pay requests across the platform
        </p>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Current float"
          value={formatCurrency(totalFloat)}
          icon={<AlertTriangle className="h-8 w-8 text-yellow-500" />}
        />
        <MetricCard
          label="Total advanced"
          value={formatCurrency(totalAdvanced)}
          icon={<Banknote className="h-8 w-8 text-green-600" />}
        />
        <MetricCard
          label="Fees earned"
          value={formatCurrency(totalFees)}
          icon={<Zap className="h-8 w-8 text-purple-600" />}
        />
        <MetricCard
          label="Active users"
          value={uniqueUsers}
          icon={<Users className="h-8 w-8 text-blue-600" />}
        />
      </div>

      {/* Pending alert */}
      {pendingCount > 0 && (
        <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4 flex items-center gap-3">
          <Clock className="h-5 w-5 text-yellow-600 flex-shrink-0" />
          <p className="text-sm text-yellow-800">
            <span className="font-semibold">{pendingCount} request{pendingCount !== 1 ? 's' : ''}</span> awaiting review
          </p>
        </div>
      )}

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Requests</CardTitle>
            <div className="flex gap-1">
              {(['all', 'pending', 'processing', 'completed', 'failed'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                    filter === f
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Worker</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Shift</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Fee</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Requested</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">
                      {req.user?.full_name || 'Unknown'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {req.shift?.title || req.shift_id}
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                      {formatCurrency(req.amount)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {formatCurrency(req.fee)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {formatDateTime(req.requested_at)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={statusBadgeVariant(req.status)}>
                        {statusLabel(req.status)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {req.status === 'pending' && (
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateStatus(req.id, 'processing')}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Clock className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateStatus(req.id, 'completed')}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateStatus(req.id, 'failed')}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      {req.status === 'processing' && (
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateStatus(req.id, 'completed')}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateStatus(req.id, 'failed')}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      {(req.status === 'completed' || req.status === 'failed') && (
                        <span className="text-xs text-gray-400">
                          {req.processed_at ? formatDateTime(req.processed_at) : '—'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredRequests.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500">
                      No requests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Float Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Float Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Pending advances</span>
            <span className="font-semibold text-yellow-600">
              {formatCurrency(displayRequests.filter((r) => r.status === 'pending').reduce((s, r) => s + r.amount, 0))}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Processing advances</span>
            <span className="font-semibold text-blue-600">
              {formatCurrency(displayRequests.filter((r) => r.status === 'processing').reduce((s, r) => s + r.amount, 0))}
            </span>
          </div>
          <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
            <span className="font-medium text-gray-900">Total outstanding float</span>
            <span className="text-lg font-bold text-primary">{formatCurrency(totalFloat)}</span>
          </div>
          <p className="text-xs text-gray-500">
            Float represents money advanced to workers that has not yet been recouped from provider pay runs.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
