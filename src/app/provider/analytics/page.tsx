'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricCard } from '@/components/ui/metric-card';
import { BarChart3, Users, Calendar, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

interface AnalyticsData {
  totalShifts: number;
  completedShifts: number;
  openShifts: number;
  cancelledShifts: number;
  filledShifts: number;
  uniqueWorkers: number;
  fillRate: number;
  avgRate: number;
  completionBreakdown: { name: string; value: number; color: string }[];
  topRoles: { role: string; shifts: number; avgRate: number }[];
  monthlyCosts: { month: string; amount: number; workers: number }[];
  returnRate: number;
  completionRate: number;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) { setLoading(false); return; }

      const { data: orgMember } = await supabase
        .from('nursly_org_members')
        .select('org_id')
        .eq('user_id', user.id)
        .single();

      if (!orgMember) { setLoading(false); return; }

      // Fetch all shifts for this org
      const { data: shifts, error } = await supabase
        .from('nursly_shifts')
        .select('id, status, specialty, rate_per_hour, filled_by, start_time, end_time, created_at, filled_at')
        .eq('org_id', orgMember.org_id);

      if (error || !shifts) {
        console.error('Error fetching analytics:', error);
        setLoading(false);
        return;
      }

      const totalShifts = shifts.length;
      const completedShifts = shifts.filter((s: any) => s.status === 'completed').length;
      const openShifts = shifts.filter((s: any) => s.status === 'open').length;
      const cancelledShifts = shifts.filter((s: any) => s.status === 'cancelled').length;
      const filledShifts = shifts.filter((s: any) => s.status === 'filled' || s.status === 'in_progress').length;

      const filledByIds = shifts.map((s: any) => s.filled_by).filter(Boolean);
      const uniqueWorkers = new Set(filledByIds).size;

      const nonCancelled = totalShifts - cancelledShifts;
      const fillRate = nonCancelled > 0 ? Math.round(((completedShifts + filledShifts) / nonCancelled) * 100) : 0;

      const completedWithRate = shifts.filter((s: any) => s.status === 'completed' && s.rate_per_hour);
      const avgRate = completedWithRate.length > 0
        ? completedWithRate.reduce((sum: number, s: any) => sum + (s.rate_per_hour || 0), 0) / completedWithRate.length
        : 0;

      // Completion breakdown (percentages)
      const completedPct = totalShifts > 0 ? Math.round((completedShifts / totalShifts) * 100) : 0;
      const pendingPct = totalShifts > 0 ? Math.round(((openShifts + filledShifts) / totalShifts) * 100) : 0;
      const cancelledPct = totalShifts > 0 ? Math.round((cancelledShifts / totalShifts) * 100) : 0;

      // Top roles by specialty
      const specialtyMap: Record<string, { count: number; totalRate: number }> = {};
      for (const s of shifts) {
        const spec = (s as any).specialty || 'unknown';
        if (!specialtyMap[spec]) specialtyMap[spec] = { count: 0, totalRate: 0 };
        specialtyMap[spec].count++;
        specialtyMap[spec].totalRate += (s as any).rate_per_hour || 0;
      }
      const topRoles = Object.entries(specialtyMap)
        .map(([role, d]) => ({
          role: role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          shifts: d.count,
          avgRate: d.count > 0 ? d.totalRate / d.count : 0,
        }))
        .sort((a, b) => b.shifts - a.shifts)
        .slice(0, 5);

      // Monthly costs
      const monthMap: Record<string, { amount: number; workerSet: Set<string> }> = {};
      for (const s of shifts) {
        if (!(s as any).start_time || !(s as any).end_time) continue;
        const start = new Date((s as any).start_time);
        const end = new Date((s as any).end_time);
        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        const monthKey = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}`;
        if (!monthMap[monthKey]) monthMap[monthKey] = { amount: 0, workerSet: new Set() };
        monthMap[monthKey].amount += ((s as any).rate_per_hour || 0) * Math.max(hours, 0);
        if ((s as any).filled_by) monthMap[monthKey].workerSet.add((s as any).filled_by);
      }
      const monthlyCosts = Object.entries(monthMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-6)
        .map(([key, d]) => {
          const [year, month] = key.split('-');
          const date = new Date(parseInt(year), parseInt(month) - 1);
          return {
            month: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            amount: Math.round(d.amount * 100) / 100,
            workers: d.workerSet.size,
          };
        });

      // Worker retention (repeat workers)
      const workerShiftCount: Record<string, number> = {};
      for (const id of filledByIds) {
        workerShiftCount[id] = (workerShiftCount[id] || 0) + 1;
      }
      const totalWorkers = Object.keys(workerShiftCount).length;
      const repeatWorkers = Object.values(workerShiftCount).filter((c) => c > 1).length;
      const returnRate = totalWorkers > 0 ? Math.round((repeatWorkers / totalWorkers) * 100) : 0;

      const completionRate = totalShifts > 0 ? Math.round((completedShifts / totalShifts) * 100) : 0;

      setData({
        totalShifts,
        completedShifts,
        openShifts,
        cancelledShifts,
        filledShifts,
        uniqueWorkers,
        fillRate,
        avgRate,
        completionBreakdown: [
          { name: 'Completed', value: completedPct, color: 'bg-green-500' },
          { name: 'Pending', value: pendingPct, color: 'bg-yellow-500' },
          { name: 'Cancelled', value: cancelledPct, color: 'bg-red-500' },
        ],
        topRoles,
        monthlyCosts,
        returnRate,
        completionRate,
      });
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-2 text-gray-600">Track your staffing performance and trends</p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-gray-600">Loading analytics...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const d = data || {
    totalShifts: 0, fillRate: 0, uniqueWorkers: 0, avgRate: 0,
    completionBreakdown: [], topRoles: [], monthlyCosts: [],
    returnRate: 0, completionRate: 0, completedShifts: 0,
  };

  const maxMonthlyCost = d.monthlyCosts.length > 0
    ? Math.max(...d.monthlyCosts.map((m) => m.amount), 1)
    : 1;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-2 text-gray-600">Track your staffing performance and trends</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total shifts posted"
          value={String(d.totalShifts)}
          icon={<Calendar className="h-8 w-8 text-blue-600" />}
        />
        <MetricCard
          label="Fill rate"
          value={`${d.fillRate}%`}
          icon={<TrendingUp className="h-8 w-8 text-green-600" />}
        />
        <MetricCard
          label="Active workers"
          value={String(d.uniqueWorkers)}
          icon={<Users className="h-8 w-8 text-purple-600" />}
        />
        <MetricCard
          label="Average hourly rate"
          value={d.avgRate > 0 ? formatCurrency(d.avgRate) : 'N/A'}
          icon={<AlertCircle className="h-8 w-8 text-orange-600" />}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Shift completion rate (Last 30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {d.completionBreakdown.length > 0 ? d.completionBreakdown.map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                    <span className="text-sm font-semibold text-gray-900">{item.value}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              )) : (
                <p className="text-sm text-gray-500">No shift data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top performing roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {d.topRoles.length > 0 ? d.topRoles.map((item) => (
                <div key={item.role} className="flex items-start justify-between border-b border-gray-200 pb-4 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{item.role}</p>
                    <p className="text-xs text-gray-500">{item.shifts} shifts | avg {formatCurrency(item.avgRate)}/hr</p>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-gray-500">No role data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly costs (Last 6 months)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {d.monthlyCosts.length > 0 ? d.monthlyCosts.map((item) => (
              <div key={item.month}>
                <div className="flex justify-between mb-2">
                  <div>
                    <span className="text-sm font-medium text-gray-700">{item.month}</span>
                    <p className="text-xs text-gray-500">{item.workers} workers</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{formatCurrency(item.amount)}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${(item.amount / maxMonthlyCost) * 100}%` }}
                  />
                </div>
              </div>
            )) : (
              <p className="text-sm text-gray-500">No cost data available</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Worker retention</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <p className="text-3xl font-bold text-gray-900">{d.returnRate > 0 ? `${d.returnRate}%` : 'N/A'}</p>
              <p className="text-sm text-gray-600">Return rate</p>
              <p className="text-xs text-green-600 mt-1">Workers who book again</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{d.avgRate > 0 ? formatCurrency(d.avgRate) + '/hr' : 'N/A'}</p>
              <p className="text-sm text-gray-600">Avg rate</p>
              <p className="text-xs text-blue-600 mt-1">Average hourly rate paid</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{d.completionRate > 0 ? `${d.completionRate}%` : 'N/A'}</p>
              <p className="text-sm text-gray-600">Completion rate</p>
              <p className="text-xs text-orange-600 mt-1">Shifts that reach completion</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
