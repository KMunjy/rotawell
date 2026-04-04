'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface SkillsGapRow {
  specialty: string;
  shiftsPosted: number;
  workersAvailable: number;
  gap: number;
  status: 'critical' | 'amber' | 'green';
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'critical':
      return 'bg-red-100 text-red-800';
    case 'amber':
      return 'bg-yellow-100 text-yellow-800';
    case 'green':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'critical':
      return 'Critical Gap';
    case 'amber':
      return 'Moderate Gap';
    case 'green':
      return 'Covered';
    default:
      return status;
  }
};

function formatSpecialty(s: string): string {
  return s
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function SkillsGapAnalysisPage() {
  const [skillsGapData, setSkillsGapData] = useState<SkillsGapRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      try {
        // Shifts posted: count shifts grouped by specialty where status in active states
        const { data: shifts } = await supabase
          .from('nursly_shifts')
          .select('specialty, status')
          .in('status', ['open', 'filled', 'in_progress']);

        // Workers available: nurse profiles with their specialties
        const { data: nurses } = await supabase
          .from('nursly_nurse_profiles')
          .select('specialties');

        // Count shifts by specialty
        const shiftsBySpecialty: Record<string, number> = {};
        if (shifts) {
          for (const s of shifts) {
            shiftsBySpecialty[s.specialty] = (shiftsBySpecialty[s.specialty] || 0) + 1;
          }
        }

        // Count workers by specialty (a nurse can have multiple specialties)
        const workersBySpecialty: Record<string, number> = {};
        if (nurses) {
          for (const n of nurses) {
            if (n.specialties && Array.isArray(n.specialties)) {
              for (const spec of n.specialties) {
                workersBySpecialty[spec] = (workersBySpecialty[spec] || 0) + 1;
              }
            }
          }
        }

        // Merge all specialties
        const allSpecialties = new Set([
          ...Object.keys(shiftsBySpecialty),
          ...Object.keys(workersBySpecialty),
        ]);

        const rows: SkillsGapRow[] = Array.from(allSpecialties).map((specialty) => {
          const shiftsPosted = shiftsBySpecialty[specialty] || 0;
          const workersAvailable = workersBySpecialty[specialty] || 0;
          const gap = shiftsPosted - workersAvailable;

          let status: 'critical' | 'amber' | 'green';
          if (gap > 10) {
            status = 'critical';
          } else if (gap > 3) {
            status = 'amber';
          } else {
            status = 'green';
          }

          return {
            specialty: formatSpecialty(specialty),
            shiftsPosted,
            workersAvailable,
            gap,
            status,
          };
        });

        // Sort: critical first, then amber, then green, then by gap descending
        rows.sort((a, b) => {
          const order = { critical: 0, amber: 1, green: 2 };
          if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
          return b.gap - a.gap;
        });

        setSkillsGapData(rows);
      } catch (err) {
        console.error('Error fetching skills gap data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const criticalCount = skillsGapData.filter((s) => s.status === 'critical').length;
  const totalGap = skillsGapData.reduce((sum, s) => sum + (s.gap > 0 ? s.gap : 0), 0);

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Skills Gap Analysis</h1>
          <p className="mt-2 text-gray-600">Identify supply/demand gaps in specialties</p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-gray-600">Loading skills gap data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Build recommendations from data
  const recommendations: { color: string; text: string }[] = [];
  const criticalItems = skillsGapData.filter((s) => s.status === 'critical');
  const amberItems = skillsGapData.filter((s) => s.status === 'amber');
  const greenItems = skillsGapData.filter((s) => s.status === 'green');

  for (const item of criticalItems.slice(0, 2)) {
    recommendations.push({
      color: 'text-red-600',
      text: `Increase recruitment efforts for ${item.specialty} - critical shortage of ${item.gap} workers`,
    });
  }
  for (const item of amberItems.slice(0, 1)) {
    recommendations.push({
      color: 'text-yellow-600',
      text: `Review ${item.specialty} worker compensation - ${item.gap} worker gap`,
    });
  }
  if (greenItems.length > 0) {
    recommendations.push({
      color: 'text-green-600',
      text: `Maintain current recruitment for covered specialties - ${greenItems.length} well covered`,
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Skills Gap Analysis</h1>
        <p className="mt-2 text-gray-600">Identify supply/demand gaps in specialties</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className={criticalCount > 0 ? 'border-red-200 bg-red-50' : ''}>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Critical Gaps</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{criticalCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Gap Shifts</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{totalGap}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Specialties Analyzed</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{skillsGapData.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Skills Gap by Specialty</CardTitle>
        </CardHeader>
        <CardContent>
          {skillsGapData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Specialty</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Shifts Posted</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Workers Available</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Gap</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {skillsGapData.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{item.specialty}</td>
                      <td className="py-3 px-4 text-gray-600">{item.shiftsPosted}</td>
                      <td className="py-3 px-4 text-gray-600">{item.workersAvailable}</td>
                      <td className={`py-3 px-4 font-semibold ${item.gap > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {item.gap > 0 ? `+${item.gap}` : item.gap}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(item.status)}>
                          {getStatusLabel(item.status)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500 py-4">No shift or worker data available to analyze.</p>
          )}
        </CardContent>
      </Card>

      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recommendations.map((rec, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className={`font-bold ${rec.color}`}>{idx + 1}.</span>
                  <span className="text-gray-600">{rec.text}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
