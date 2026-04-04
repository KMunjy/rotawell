'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';
import type { NurslyTrainingProgress } from '@/lib/types';

const defaultModules = [
  {
    module_id: 'mod-health-safety',
    module_name: 'Health & Safety in Care',
    description: 'Learn essential health and safety procedures in care settings',
    duration_minutes: 120,
    mandatory: true,
    status: 'not_started' as const,
    progress: 0,
  },
  {
    module_id: 'mod-data-protection',
    module_name: 'Data Protection & Privacy',
    description: 'Understand GDPR and data protection responsibilities',
    duration_minutes: 90,
    mandatory: true,
    status: 'not_started' as const,
    progress: 0,
  },
  {
    module_id: 'mod-safeguarding',
    module_name: 'Safeguarding Adults',
    description: 'Identify and respond to safeguarding concerns',
    duration_minutes: 150,
    mandatory: true,
    status: 'not_started' as const,
    progress: 0,
  },
  {
    module_id: 'mod-dementia-care',
    module_name: 'Dementia Care Excellence',
    description: 'Advanced techniques for supporting people with dementia',
    duration_minutes: 180,
    mandatory: false,
    status: 'not_started' as const,
    progress: 0,
  },
  {
    module_id: 'mod-palliative-care',
    module_name: 'Palliative Care Basics',
    description: 'End-of-life care and emotional support',
    duration_minutes: 120,
    mandatory: false,
    status: 'not_started' as const,
    progress: 0,
  },
];

export default function TrainingPage() {
  const { toast } = useToast();
  const [modules, setModules] = useState<NurslyTrainingProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchModules = useCallback(async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('nursly_training_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        toast('Failed to load training modules', 'error');
        setLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        // Seed default modules
        const seeds = defaultModules.map((m) => ({
          user_id: user.id,
          module_id: m.module_id,
          module_name: m.module_name,
          description: m.description,
          duration_minutes: m.duration_minutes,
          mandatory: m.mandatory,
          status: m.status,
          progress: m.progress,
        }));

        const { data: inserted, error: insertError } = await supabase
          .from('nursly_training_progress')
          .insert(seeds)
          .select();

        if (insertError) {
          console.error('Error seeding training modules:', insertError);
        } else if (inserted) {
          setModules(inserted as NurslyTrainingProgress[]);
        }
      } else {
        setModules(data as NurslyTrainingProgress[]);
      }
    } catch (err) {
      console.error('Error:', err);
      toast('Failed to load training modules', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  const mandatoryModules = modules.filter((m) => m.mandatory);
  const optionalModules = modules.filter((m) => !m.mandatory);

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Training & Development</h1>
          <p className="mt-2 text-gray-600">Complete mandatory training and develop your skills</p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-gray-600">Loading training modules...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderModule = (mod: NurslyTrainingProgress) => (
    <Card key={mod.id}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="mt-1">
              <BookOpen className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{mod.module_name}</h3>
              <p className="mt-1 text-sm text-gray-600">{mod.description}</p>
              <p className="mt-2 text-xs text-gray-500">
                <Clock className="h-3 w-3 inline mr-1" />
                {Math.round(mod.duration_minutes / 60)} hours
              </p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <Badge variant="secondary">Content coming soon</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Training & Development</h1>
        <p className="mt-2 text-gray-600">Complete mandatory training and develop your skills</p>
      </div>

      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <p className="text-sm font-medium text-blue-900">
            Training module content is coming soon. The modules below will become interactive once the content is ready.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Mandatory modules</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{mandatoryModules.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Optional modules</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{optionalModules.length}</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Mandatory Training</h2>
        <div className="space-y-4">
          {mandatoryModules.map(renderModule)}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Professional Development</h2>
        <div className="space-y-4">
          {optionalModules.map(renderModule)}
        </div>
      </div>
    </div>
  );
}
