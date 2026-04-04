'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, FileCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';

interface CredentialStats {
  type: string;
  verified: number;
  pending: number;
  expired: number;
  total: number;
}

interface PendingCredential {
  id: string;
  nurse_id: string;
  type: string;
  document_key: string | null;
  expiry_date: string | null;
  reference_number: string | null;
  status: string;
  created_at: string;
  worker_name: string | null;
}

export default function CompliancePage() {
  const { toast } = useToast();
  const [stats, setStats] = useState<CredentialStats[]>([]);
  const [pending, setPending] = useState<PendingCredential[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const supabase = createClient();

      // Fetch all credentials for stats
      const { data: allCreds, error: statsError } = await supabase
        .from('nursly_credentials')
        .select('type, status');

      if (statsError) {
        console.error('Error fetching stats:', statsError);
      } else {
        const credentialMap = new Map<string, CredentialStats>();
        (allCreds as any[]).forEach((cred: any) => {
          if (!credentialMap.has(cred.type)) {
            credentialMap.set(cred.type, {
              type: cred.type,
              verified: 0,
              pending: 0,
              expired: 0,
              total: 0,
            });
          }
          const stat = credentialMap.get(cred.type)!;
          if (cred.status === 'verified') stat.verified++;
          else if (cred.status === 'pending') stat.pending++;
          else if (cred.status === 'expired') stat.expired++;
          stat.total++;
        });
        setStats(Array.from(credentialMap.values()));
      }

      // Fetch pending credentials with worker names
      const { data: pendingCreds, error: pendingError } = await supabase
        .from('nursly_credentials')
        .select('id, nurse_id, type, document_key, expiry_date, reference_number, status, created_at')
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      if (pendingError) {
        console.error('Error fetching pending credentials:', pendingError);
      } else if (pendingCreds && pendingCreds.length > 0) {
        // Fetch worker names from nursly_profiles
        const nurseIds = [...new Set((pendingCreds as any[]).map((c: any) => c.nurse_id))];
        const { data: profiles } = await supabase
          .from('nursly_profiles')
          .select('id, full_name')
          .in('id', nurseIds);

        const nameMap: Record<string, string> = {};
        if (profiles) {
          (profiles as any[]).forEach((p: any) => {
            nameMap[p.id] = p.full_name;
          });
        }

        setPending(
          (pendingCreds as any[]).map((c: any) => ({
            ...c,
            worker_name: nameMap[c.nurse_id] ?? null,
          }))
        );
      } else {
        setPending([]);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleApprove = async (credentialId: string) => {
    setActionLoading(credentialId);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('nursly_credentials')
        .update({
          status: 'verified',
          verified_by: user?.id ?? null,
          verified_at: new Date().toISOString(),
        })
        .eq('id', credentialId);

      if (error) {
        toast('Failed to approve credential', 'error');
      } else {
        toast('Credential approved', 'success');
        setPending((prev) => prev.filter((c) => c.id !== credentialId));
        setStats((prev) =>
          prev.map((s) => ({
            ...s,
            verified: s.pending > 0 ? s.verified + (pending.find((c) => c.id === credentialId)?.type === s.type ? 1 : 0) : s.verified,
            pending: s.pending > 0 ? s.pending - (pending.find((c) => c.id === credentialId)?.type === s.type ? 1 : 0) : s.pending,
          }))
        );
        // Refresh stats to get accurate counts
        fetchData();
      }
    } catch (err) {
      console.error('Error:', err);
      toast('Failed to approve credential', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (credentialId: string) => {
    setActionLoading(credentialId);
    try {
      const supabase = createClient();

      const { error } = await supabase
        .from('nursly_credentials')
        .update({
          status: 'rejected',
          rejection_reason: 'Rejected by admin',
        })
        .eq('id', credentialId);

      if (error) {
        toast('Failed to reject credential', 'error');
      } else {
        toast('Credential rejected', 'success');
        setPending((prev) => prev.filter((c) => c.id !== credentialId));
        fetchData();
      }
    } catch (err) {
      console.error('Error:', err);
      toast('Failed to reject credential', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Compliance Dashboard</h1>
          <p className="mt-2 text-gray-600">Monitor and manage credential verification</p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-gray-600">Loading compliance data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Compliance Dashboard</h1>
        <p className="mt-2 text-gray-600">Monitor and manage credential verification</p>
      </div>

      {/* Pending approvals */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pending Approvals</CardTitle>
            {pending.length > 0 && (
              <Badge variant="warning">{pending.length} pending</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {pending.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileCheck className="h-12 w-12 text-gray-300" />
              <p className="mt-4 text-gray-500">No credentials awaiting review.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Worker</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Credential Type</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Reference</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Expiry</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Submitted</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map((cred) => (
                    <tr key={cred.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {cred.worker_name ?? <span className="text-gray-400 italic">Unknown</span>}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 capitalize">
                        {cred.type.replace(/_/g, ' ')}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {cred.reference_number ?? '—'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {cred.expiry_date
                          ? new Date(cred.expiry_date).toLocaleDateString('en-GB')
                          : '—'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(cred.created_at).toLocaleDateString('en-GB')}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleApprove(cred.id)}
                            disabled={actionLoading === cred.id}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50 flex items-center gap-1"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReject(cred.id)}
                            disabled={actionLoading === cred.id}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-1"
                          >
                            <XCircle className="h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats summary */}
      <Card>
        <CardHeader>
          <CardTitle>Credential Verification Status</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">No credential data yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Credential Type</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Verified</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Pending</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Expired</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map((stat) => (
                    <tr key={stat.type} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900 capitalize">{stat.type.replace(/_/g, ' ')}</td>
                      <td className="py-3 px-4 text-sm">
                        <Badge variant="success">{stat.verified}</Badge>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <Badge variant="warning">{stat.pending}</Badge>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <Badge variant="danger">{stat.expired}</Badge>
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-gray-900">{stat.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
