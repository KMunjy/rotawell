'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface WeekDemand {
  week: string;
  demand: number;
  level: string;
  recommendation: string;
}

interface SpecialtyBreakdown {
  specialty: string;
  demand: number;
  supply: number;
  gap: number;
}

export default function DemandForecastPage() {
  const [demandData, setDemandData] = useState<WeekDemand[]>([]);
  const [specialtyBreakdown, setSpecialtyBreakdown] = useState<SpecialtyBreakdown[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDemand = useCallback(async () => {
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

      const now = new Date();

      // Fetch shifts for the next 4 weeks
      const fourWeeksLater = new Date(now);
      fourWeeksLater.setDate(fourWeeksLater.getDate() + 28);

      const { data: shifts } = await supabase
        .from('nursly_shifts')
        .select('id, specialty, start_time, status')
        .eq('org_id', orgMember.org_id)
        .gte('start_time', now.toISOString())
        .lte('start_time', fourWeeksLater.toISOString());

      // Group shifts by week
      const weekBuckets: Record<number, any[]> = { 0: [], 1: [], 2: [], 3: [] };
      for (const s of (shifts || [])) {
        const shiftDate = new Date((s as any).start_time);
        const diffDays = Math.floor((shiftDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        const weekIdx = Math.min(Math.floor(diffDays / 7), 3);
        if (weekIdx >= 0 && weekIdx <= 3) {
          weekBuckets[weekIdx].push(s);
        }
      }

      const weeklyDemand: WeekDemand[] = [0, 1, 2, 3].map((idx) => {
        const count = weekBuckets[idx].length;
        let level = 'Normal';
        let recommendation = 'Maintain current posting pace';
        if (count >= 20) {
          level = 'High';
          recommendation = 'Consider posting more shifts to meet demand';
        } else if (count <= 5) {
          level = 'Low';
          recommendation = 'Review shift pricing to attract more bookings';
        }
        return {
          week: `Week ${idx + 1}`,
          demand: count,
          level,
          recommendation,
        };
      });

      // Specialty breakdown: demand from shifts, supply from nurse profiles
      const specialtyCounts: Record<string, number> = {};
      for (const s of (shifts || [])) {
        const spec = (s as any).specialty || 'unknown';
        specialtyCounts[spec] = (specialtyCounts[spec] || 0) + 1;
      }

      // Get supply: count active nurses per specialty
      const { data: nurseProfiles } = await supabase
        .from('nursly_nurse_profiles')
        .select('specialties, availability_status');

      const supplyCounts: Record<string, number> = {};
      for (const np of (nurseProfiles || [])) {
        const profile = np as any;
        if (profile.availability_status === 'available' || !profile.availability_status) {
          const specs = profile.specialties || [];
          for (const spec of specs) {
            supplyCounts[spec] = (supplyCounts[spec] || 0) + 1;
          }
        }
      }

      // Combine all specialties
      const allSpecs = new Set([...Object.keys(specialtyCounts), ...Object.keys(supplyCounts)]);
      const breakdown: SpecialtyBreakdown[] = Array.from(allSpecs)
        .filter((s) => s !== 'unknown')
        .map((spec) => {
          const demand = specialtyCounts[spec] || 0;
          const supply = supplyCounts[spec] || 0;
          return {
            specialty: spec.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
            demand,
            supply,
            gap: demand - supply,
          };
        })
        .sort((a, b) => b.demand - a.demand);

      setDemandData(weeklyDemand);
      setSpecialtyBreakdown(breakdown);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDemand();
  }, [fetchDemand]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Demand Forecast</h1>
          <p className="mt-2 text-gray-600">Predicted shift demand for the next 4 weeks</p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-gray-600">Loading demand data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const maxDemand = Math.max(...demandData.map((w) => w.demand), 1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Demand Forecast</h1>
        <p className="mt-2 text-gray-600">Predicted shift demand for the next 4 weeks</p>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Weekly Demand</h2>
        <div className="space-y-3">
          {demandData.length > 0 ? demandData.map((week, idx) => (
            <Card key={idx}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{week.week}</h3>
                    <p className="mt-2 text-sm text-gray-600">{week.recommendation}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-gray-900">{week.demand}</p>
                    <p className="text-xs text-gray-500">expected shifts</p>
                  </div>
                  <Badge
                    variant={
                      week.level === 'High'
                        ? 'danger'
                        : week.level === 'Normal'
                          ? 'secondary'
                          : 'success'
                    }
                    className="ml-4"
                  >
                    {week.level} Demand
                  </Badge>
                </div>
                <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      week.level === 'High' ? 'bg-red-500' : week.level === 'Normal' ? 'bg-blue-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${(week.demand / maxDemand) * 100}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          )) : (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <p className="text-gray-500">No upcoming shift demand data available</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">By Specialty</h2>
        <Card>
          <CardContent className="pt-6">
            {specialtyBreakdown.length > 0 ? (
              <div className="space-y-4">
                {specialtyBreakdown.map((spec, idx) => (
                  <div key={idx} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{spec.specialty}</h4>
                      <Badge variant={spec.gap > 3 ? 'danger' : spec.gap > 0 ? 'warning' : 'success'}>
                        {spec.gap > 0 ? `Gap: +${spec.gap}` : `Covered`}
                      </Badge>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-3 text-sm">
                      <div>
                        <span className="text-gray-600">Demand:</span>
                        <p className="font-semibold text-gray-900">{spec.demand} shifts</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Supply:</span>
                        <p className="font-semibold text-gray-900">{spec.supply} workers</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Gap:</span>
                        <p className={`font-semibold ${spec.gap > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {spec.gap > 0 ? `+${spec.gap}` : `${spec.gap}`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No specialty data available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
