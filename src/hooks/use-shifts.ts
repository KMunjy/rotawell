import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { NurslyShift } from '@/lib/types';

interface UseShiftsOptions {
  status?: string;
  orgId?: string;
  filledBy?: string;
  limit?: number;
}

interface ShiftWithDetails extends NurslyShift {
  org?: { name: string };
  location?: { name: string; city: string };
}

export function useShifts(options?: UseShiftsOptions) {
  const [shifts, setShifts] = useState<ShiftWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getShifts = async () => {
      try {
        const supabase = createClient();
        let query = supabase
          .from('nursly_shifts')
          .select(
            `
            *,
            org:nursly_organisations(name),
            location:nursly_org_locations(name, city)
          `
          );

        if (options?.status) {
          query = query.eq('status', options.status);
        }

        if (options?.orgId) {
          query = query.eq('org_id', options.orgId);
        }

        if (options?.filledBy) {
          query = query.eq('filled_by', options.filledBy);
        }

        if (options?.limit) {
          query = query.limit(options.limit);
        }

        const { data, error: shiftError } = await query;

        if (shiftError) {
          setError(shiftError);
          setLoading(false);
          return;
        }

        setShifts((data as ShiftWithDetails[]) || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    getShifts();
  }, [options?.status, options?.orgId, options?.filledBy, options?.limit]);

  return { shifts, loading, error };
}
