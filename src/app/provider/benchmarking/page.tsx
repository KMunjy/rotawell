'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency } from '@/lib/utils';

interface BenchmarkItem {
  metric: string;
  yourValue: string;
  platformAverage: string;
  difference: string;
  status: 'above' | 'below';
}

const getStatusIcon = (status: string) => {
  return status === 'above' ? (
    <TrendingUp className="h-5 w-5 text-green-600" />
  ) : (
    <TrendingDown className="h-5 w-5 text-red-600" />
  );
};

export default function BenchmarkingPage() {
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkItem[]>([]);
  const [overallScore, setOverallScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<{ icon: string; color: string; text: string }[]>([]);

  const fetchBenchmarks = useCallback(async () => {
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

      // Fetch org's shifts
      const { data: orgShifts } = await supabase
        .from('nursly_shifts')
        .select('id, status, rate_per_hour, filled_by, created_at, filled_at, start_time, end_time')
        .eq('org_id', orgMember.org_id);

      // Fetch all platform shifts for comparison
      const { data: allShifts } = await supabase
        .from('nursly_shifts')
        .select('id, status, rate_per_hour, filled_by, created_at, filled_at');

      const org = orgShifts || [];
      const platform = allShifts || [];

      // Calculate org metrics
      const orgTotal = org.length;
      const orgCancelled = org.filter((s: any) => s.status === 'cancelled').length;
      const orgNonCancelled = orgTotal - orgCancelled;
      const orgFilled = org.filter((s: any) => ['filled', 'in_progress', 'completed'].includes(s.status)).length;
      const orgFillRate = orgNonCancelled > 0 ? Math.round((orgFilled / orgNonCancelled) * 100) : 0;

      const orgWithRate = org.filter((s: any) => s.rate_per_hour);
      const orgAvgRate = orgWithRate.length > 0
        ? orgWithRate.reduce((sum: number, s: any) => sum + s.rate_per_hour, 0) / orgWithRate.length
        : 0;

      // Time to fill (days between created_at and filled_at)
      const orgFilledWithDates = org.filter((s: any) => s.filled_at && s.created_at);
      const orgAvgTimeToFill = orgFilledWithDates.length > 0
        ? orgFilledWithDates.reduce((sum: number, s: any) => {
            const days = (new Date(s.filled_at).getTime() - new Date(s.created_at).getTime()) / (1000 * 60 * 60 * 24);
            return sum + Math.max(days, 0);
          }, 0) / orgFilledWithDates.length
        : 0;

      // Repeat worker rate
      const orgFilledBy = org.map((s: any) => s.filled_by).filter(Boolean);
      const orgWorkerCounts: Record<string, number> = {};
      for (const id of orgFilledBy) {
        orgWorkerCounts[id] = (orgWorkerCounts[id] || 0) + 1;
      }
      const orgTotalWorkers = Object.keys(orgWorkerCounts).length;
      const orgRepeatWorkers = Object.values(orgWorkerCounts).filter((c) => c > 1).length;
      const orgRepeatRate = orgTotalWorkers > 0 ? Math.round((orgRepeatWorkers / orgTotalWorkers) * 100) : 0;

      // Platform averages
      const platTotal = platform.length;
      const platCancelled = platform.filter((s: any) => s.status === 'cancelled').length;
      const platNonCancelled = platTotal - platCancelled;
      const platFilled = platform.filter((s: any) => ['filled', 'in_progress', 'completed'].includes(s.status)).length;
      const platFillRate = platNonCancelled > 0 ? Math.round((platFilled / platNonCancelled) * 100) : 0;

      const platWithRate = platform.filter((s: any) => s.rate_per_hour);
      const platAvgRate = platWithRate.length > 0
        ? platWithRate.reduce((sum: number, s: any) => sum + s.rate_per_hour, 0) / platWithRate.length
        : 0;

      const platFilledWithDates = platform.filter((s: any) => s.filled_at && s.created_at);
      const platAvgTimeToFill = platFilledWithDates.length > 0
        ? platFilledWithDates.reduce((sum: number, s: any) => {
            const days = (new Date(s.filled_at).getTime() - new Date(s.created_at).getTime()) / (1000 * 60 * 60 * 24);
            return sum + Math.max(days, 0);
          }, 0) / platFilledWithDates.length
        : 0;

      const platFilledBy = platform.map((s: any) => s.filled_by).filter(Boolean);
      const platWorkerCounts: Record<string, number> = {};
      for (const id of platFilledBy) {
        platWorkerCounts[id] = (platWorkerCounts[id] || 0) + 1;
      }
      const platTotalWorkers = Object.keys(platWorkerCounts).length;
      const platRepeatWorkers = Object.values(platWorkerCounts).filter((c) => c > 1).length;
      const platRepeatRate = platTotalWorkers > 0 ? Math.round((platRepeatWorkers / platTotalWorkers) * 100) : 0;

      // Worker satisfaction — no reviews table yet, skip this metric
      const orgSatisfaction = null;
      const platSatisfaction = null;

      // Build benchmark items
      const fillRateDiff = orgFillRate - platFillRate;
      const rateDiff = orgAvgRate - platAvgRate;
      const timeDiff = orgAvgTimeToFill - platAvgTimeToFill;
      const satisfactionDiff = 0; // no reviews table yet
      const repeatDiff = orgRepeatRate - platRepeatRate;

      const items: BenchmarkItem[] = [];

      if (orgTotal > 0) {
        items.push({
          metric: 'Fill Rate',
          yourValue: `${orgFillRate}%`,
          platformAverage: platTotal > 0 ? `${platFillRate}%` : 'N/A',
          difference: `${fillRateDiff >= 0 ? '+' : ''}${fillRateDiff}%`,
          status: fillRateDiff >= 0 ? 'above' : 'below',
        });
      } else {
        items.push({
          metric: 'Fill Rate',
          yourValue: 'N/A',
          platformAverage: platTotal > 0 ? `${platFillRate}%` : 'N/A',
          difference: 'N/A',
          status: 'below',
        });
      }

      items.push({
        metric: 'Avg Hourly Rate',
        yourValue: orgAvgRate > 0 ? formatCurrency(orgAvgRate) : 'N/A',
        platformAverage: platAvgRate > 0 ? formatCurrency(platAvgRate) : 'N/A',
        difference: orgAvgRate > 0 && platAvgRate > 0
          ? `${rateDiff >= 0 ? '+' : ''}${formatCurrency(Math.abs(rateDiff))}`
          : 'N/A',
        status: rateDiff >= 0 ? 'above' : 'below',
      });

      items.push({
        metric: 'Time to Fill',
        yourValue: orgAvgTimeToFill > 0 ? `${orgAvgTimeToFill.toFixed(1)} days` : 'N/A',
        platformAverage: platAvgTimeToFill > 0 ? `${platAvgTimeToFill.toFixed(1)} days` : 'N/A',
        difference: orgAvgTimeToFill > 0 && platAvgTimeToFill > 0
          ? `${timeDiff <= 0 ? '' : '+'}${timeDiff.toFixed(1)} days`
          : 'N/A',
        status: timeDiff <= 0 ? 'above' : 'below', // Lower is better for time to fill
      });

      items.push({
        metric: 'Worker Satisfaction',
        yourValue: 'Coming soon',
        platformAverage: 'Coming soon',
        difference: 'N/A',
        status: 'below',
      });

      items.push({
        metric: 'Repeat Worker Rate',
        yourValue: orgTotalWorkers > 0 ? `${orgRepeatRate}%` : 'N/A',
        platformAverage: platTotalWorkers > 0 ? `${platRepeatRate}%` : 'N/A',
        difference: orgTotalWorkers > 0 && platTotalWorkers > 0
          ? `${repeatDiff >= 0 ? '+' : ''}${repeatDiff}%`
          : 'N/A',
        status: repeatDiff >= 0 ? 'above' : 'below',
      });

      setBenchmarkData(items);

      // Overall score
      const aboveCount = items.filter((i) => i.status === 'above').length;
      const score = items.length > 0 ? Math.round((aboveCount / items.length) * 5 * 10) / 10 : 0;
      setOverallScore(score);

      // Generate insights
      const insightsList: { icon: string; color: string; text: string }[] = [];
      if (orgFillRate > platFillRate) {
        insightsList.push({
          icon: '✓', color: 'text-green-600',
          text: `Your fill rate (${orgFillRate}%) is above platform average, indicating strong shift fulfillment`,
        });
      } else if (orgTotal > 0) {
        insightsList.push({
          icon: '!', color: 'text-yellow-600',
          text: `Your fill rate (${orgFillRate}%) is below platform average (${platFillRate}%) - consider adjusting rates or timing`,
        });
      }
      // Worker satisfaction insights will be added when reviews table is available
      if (orgRepeatRate < platRepeatRate && orgTotalWorkers > 0) {
        insightsList.push({
          icon: '!', color: 'text-yellow-600',
          text: `Repeat worker rate is ${Math.abs(repeatDiff)}% below average - consider retention initiatives`,
        });
      } else if (orgRepeatRate >= platRepeatRate && orgTotalWorkers > 0) {
        insightsList.push({
          icon: '✓', color: 'text-green-600',
          text: `Strong repeat worker rate at ${orgRepeatRate}% - your retention strategy is working`,
        });
      }
      if (insightsList.length === 0) {
        insightsList.push({
          icon: '→', color: 'text-blue-600',
          text: 'Post more shifts to start generating benchmark insights',
        });
      }
      setInsights(insightsList);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBenchmarks();
  }, [fetchBenchmarks]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Performance Benchmarking</h1>
          <p className="mt-2 text-gray-600">How your organization compares to platform averages</p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-gray-600">Loading benchmarks...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const aboveCount = benchmarkData.filter((d) => d.status === 'above').length;
  const performanceLabel = aboveCount >= 4 ? 'Excellent' : aboveCount >= 3 ? 'Good' : aboveCount >= 2 ? 'Average' : 'Needs Improvement';
  const performanceColor = aboveCount >= 3 ? 'text-green-600' : aboveCount >= 2 ? 'text-blue-600' : 'text-yellow-600';
  const borderColor = aboveCount >= 3 ? 'border-green-200 bg-green-50' : aboveCount >= 2 ? 'border-blue-200 bg-blue-50' : 'border-yellow-200 bg-yellow-50';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Performance Benchmarking</h1>
        <p className="mt-2 text-gray-600">How your organization compares to platform averages</p>
      </div>

      <Card className={borderColor}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overall Performance</p>
              <p className={`mt-2 text-3xl font-bold ${performanceColor}`}>{performanceLabel}</p>
              <p className="text-sm text-gray-600 mt-1">
                You&apos;re performing above average in {aboveCount} of {benchmarkData.length} metrics
              </p>
            </div>
            <div className="text-right">
              <p className={`text-5xl font-bold ${performanceColor}`}>
                {overallScore !== null ? overallScore.toFixed(1) : 'N/A'}
              </p>
              <p className="text-sm text-gray-600">out of 5.0</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {benchmarkData.map((item, idx) => (
              <div key={idx} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{item.metric}</h3>
                  <Badge variant={item.status === 'above' ? 'success' : 'warning'}>
                    {item.status === 'above' ? 'Above Average' : 'Below Average'}
                  </Badge>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 text-sm mb-3">
                  <div>
                    <span className="text-gray-600">Your Organization</span>
                    <p className="font-bold text-gray-900">{item.yourValue}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Platform Average</span>
                    <p className="font-bold text-gray-900">{item.platformAverage}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Difference</span>
                    <p
                      className={`font-bold flex items-center gap-1 ${
                        item.status === 'above' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {getStatusIcon(item.status)}
                      {item.difference}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600"
                      style={{
                        width: item.status === 'above' ? '85%' : '60%',
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">Your organization</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {insights.map((insight, idx) => (
              <li key={idx} className="flex gap-3">
                <span className={`font-bold ${insight.color}`}>{insight.icon}</span>
                <span className="text-gray-600">{insight.text}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
