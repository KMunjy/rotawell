import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { UserProfile, NurslyNurseProfile, WorkerProfile, ProviderProfile } from '@/lib/types';

export function useUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [workerProfile, setWorkerProfile] = useState<NurslyNurseProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (!authUser) {
          setUser(null);
          setWorkerProfile(null);
          setLoading(false);
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('nursly_profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (profileError) {
          setError(profileError);
          setLoading(false);
          return;
        }

        const userProfile: UserProfile = {
          ...profile,
          email: authUser.email,
        };

        setUser(userProfile);

        // If user is a nurse, also fetch nurse-specific profile
        if (profile.role === 'nurse') {
          const { data: nurseData } = await supabase
            .from('nursly_nurse_profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();

          if (nurseData) {
            setWorkerProfile(nurseData);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  return { user, workerProfile, loading, error };
}
