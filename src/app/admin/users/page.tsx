'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import type { NurslyProfile, NurslyNurseProfile, NurslyOrgMember, NurslyOrganisation } from '@/lib/types';

const PAGE_SIZE = 20;

interface UserDetail {
  nurseProfile?: NurslyNurseProfile | null;
  orgMember?: NurslyOrgMember | null;
  organisation?: NurslyOrganisation | null;
}

interface CountStats {
  total: number;
  active: number;
  pending: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<NurslyProfile[]>([]);
  const [stats, setStats] = useState<CountStats>({ total: 0, active: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<Record<string, UserDetail>>({});
  const [detailLoading, setDetailLoading] = useState<string | null>(null);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const fetchUsers = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const supabase = createClient();

      // Fetch counts separately (once covers all users, not just current page)
      const [totalRes, activeRes, pendingRes, listRes] = await Promise.all([
        supabase.from('nursly_profiles').select('*', { count: 'exact', head: true }),
        supabase.from('nursly_profiles').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('nursly_profiles').select('*', { count: 'exact', head: true }).eq('status', 'pending_verification'),
        supabase
          .from('nursly_profiles')
          .select('*')
          .order('created_at', { ascending: false })
          .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1),
      ]);

      if (listRes.error) {
        console.error('Error:', listRes.error);
      } else {
        setUsers((listRes.data as NurslyProfile[]) || []);
        setTotalCount(totalRes.count ?? 0);
        setStats({
          total: totalRes.count ?? 0,
          active: activeRes.count ?? 0,
          pending: pendingRes.count ?? 0,
        });
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(currentPage);
    setExpandedUserId(null);
  }, [currentPage, fetchUsers]);

  const handleView = async (user: NurslyProfile) => {
    if (expandedUserId === user.id) {
      setExpandedUserId(null);
      return;
    }

    setExpandedUserId(user.id);

    if (userDetails[user.id]) return;

    setDetailLoading(user.id);
    const supabase = createClient();
    const detail: UserDetail = {};

    try {
      if (user.role === 'nurse') {
        const { data } = await supabase
          .from('nursly_nurse_profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        detail.nurseProfile = data as NurslyNurseProfile | null;
      } else if (user.role === 'agency_admin' || user.role === 'agency_staff') {
        const { data: memberData } = await supabase
          .from('nursly_org_members')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        detail.orgMember = memberData as NurslyOrgMember | null;

        if (detail.orgMember?.org_id) {
          const { data: orgData } = await supabase
            .from('nursly_organisations')
            .select('*')
            .eq('id', detail.orgMember.org_id)
            .maybeSingle();
          detail.organisation = orgData as NurslyOrganisation | null;
        }
      }

      setUserDetails((prev) => ({ ...prev, [user.id]: detail }));
    } catch (err) {
      console.error('Error fetching user details:', err);
    } finally {
      setDetailLoading(null);
    }
  };

  const statusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending_verification':
        return 'warning';
      case 'suspended':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="mt-2 text-gray-600">Manage platform users and permissions</p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-gray-600">Loading users...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="mt-2 text-gray-600">Manage platform users and permissions</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total users</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Active</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{stats.active}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Pending verification</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{stats.pending}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Users</CardTitle>
            {totalCount > 0 && (
              <p className="text-sm text-gray-500">
                {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, totalCount)} of {totalCount}
              </p>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <>
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">{user.full_name}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 capitalize">{user.role}</td>
                      <td className="py-3 px-4 text-sm">
                        <Badge variant={statusBadgeVariant(user.status)}>
                          {user.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(user)}
                        >
                          {expandedUserId === user.id ? 'Close' : 'View'}
                        </Button>
                      </td>
                    </tr>
                    {expandedUserId === user.id && (
                      <tr key={`${user.id}-details`} className="border-b border-gray-100 bg-gray-50">
                        <td colSpan={4} className="px-4 py-4">
                          {detailLoading === user.id ? (
                            <p className="text-sm text-gray-500">Loading details...</p>
                          ) : (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                              <div>
                                <p className="text-xs font-medium text-gray-500 uppercase">Status</p>
                                <p className="mt-1 text-sm text-gray-900">{user.status}</p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-500 uppercase">Role</p>
                                <p className="mt-1 text-sm text-gray-900 capitalize">{user.role}</p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-500 uppercase">Created</p>
                                <p className="mt-1 text-sm text-gray-900">
                                  {new Date(user.created_at).toLocaleDateString()}
                                </p>
                              </div>

                              {user.role === 'nurse' && userDetails[user.id]?.nurseProfile && (
                                <>
                                  <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase">NMC PIN</p>
                                    <p className="mt-1 text-sm text-gray-900">
                                      {userDetails[user.id].nurseProfile!.nmc_pin || 'Not provided'}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase">Location</p>
                                    <p className="mt-1 text-sm text-gray-900">
                                      {userDetails[user.id].nurseProfile!.location_city || 'Not set'}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase">Specialties</p>
                                    <p className="mt-1 text-sm text-gray-900">
                                      {userDetails[user.id].nurseProfile!.specialties?.join(', ') || 'None'}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase">Experience</p>
                                    <p className="mt-1 text-sm text-gray-900">
                                      {userDetails[user.id].nurseProfile!.years_experience != null
                                        ? `${userDetails[user.id].nurseProfile!.years_experience} years`
                                        : 'Not provided'}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase">Onboarding</p>
                                    <p className="mt-1 text-sm text-gray-900">
                                      {userDetails[user.id].nurseProfile!.onboarding_complete ? 'Complete' : 'Incomplete'}
                                    </p>
                                  </div>
                                </>
                              )}

                              {(user.role === 'agency_admin' || user.role === 'agency_staff') && userDetails[user.id]?.organisation && (
                                <>
                                  <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase">Organisation</p>
                                    <p className="mt-1 text-sm text-gray-900">
                                      {userDetails[user.id].organisation!.name}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase">Org Type</p>
                                    <p className="mt-1 text-sm text-gray-900 capitalize">
                                      {userDetails[user.id].organisation!.type.replace(/_/g, ' ')}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase">Org Status</p>
                                    <p className="mt-1 text-sm text-gray-900">
                                      {userDetails[user.id].organisation!.status}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase">Org Role</p>
                                    <p className="mt-1 text-sm text-gray-900 capitalize">
                                      {userDetails[user.id].orgMember!.org_role}
                                    </p>
                                  </div>
                                </>
                              )}

                              {user.role === 'nurse' && !userDetails[user.id]?.nurseProfile && (
                                <div className="sm:col-span-2 lg:col-span-3">
                                  <p className="text-sm text-gray-500">No additional nurse profile data found.</p>
                                </div>
                              )}

                              {(user.role === 'agency_admin' || user.role === 'agency_staff') && !userDetails[user.id]?.organisation && (
                                <div className="sm:col-span-2 lg:col-span-3">
                                  <p className="text-sm text-gray-500">No organisation membership found.</p>
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                ))}
                {users.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-sm text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1 || loading}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || loading}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
