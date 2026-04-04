'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Search, Trash2, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import type { NurslySavedSearch } from '@/lib/types';

interface SavedSearchWithCount extends NurslySavedSearch {
  matchingShifts: number;
}

export default function SavedSearchesPage() {
  const router = useRouter();
  const [searches, setSearches] = useState<SavedSearchWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    location: '',
    minRate: '',
  });
  const [formSubmitting, setFormSubmitting] = useState(false);

  const fetchSearches = useCallback(async () => {
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
        .from('nursly_saved_searches')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching saved searches:', error);
        setLoading(false);
        return;
      }

      // Count matching shifts for each search
      const searchesWithCounts: SavedSearchWithCount[] = [];
      for (const search of (data || [])) {
        let query = supabase
          .from('nursly_shifts')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'open');

        if (search.specialty) {
          query = query.eq('specialty', search.specialty);
        }
        if (search.min_rate) {
          query = query.gte('rate_per_hour', search.min_rate);
        }

        const { count } = await query;

        searchesWithCounts.push({
          ...search,
          matchingShifts: count || 0,
        });
      }

      setSearches(searchesWithCounts);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSearches();
  }, [fetchSearches]);

  const handleSaveSearch = async () => {
    if (!formData.name.trim()) return;
    setFormSubmitting(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { error } = await supabase.from('nursly_saved_searches').insert({
        user_id: user.id,
        name: formData.name,
        specialty: formData.specialty || null,
        location: formData.location || null,
        min_rate: formData.minRate ? parseFloat(formData.minRate) : null,
        filters: {
          specialty: formData.specialty || null,
          location: formData.location || null,
          min_rate: formData.minRate ? parseFloat(formData.minRate) : null,
        },
      });

      if (error) {
        console.error('Save search error:', error);
      } else {
        setFormData({ name: '', specialty: '', location: '', minRate: '' });
        setShowForm(false);
        await fetchSearches();
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleApplySearch = (search: SavedSearchWithCount) => {
    const params = new URLSearchParams();
    if (search.specialty) params.set('specialty', search.specialty);
    if (search.location) params.set('location', search.location);
    if (search.min_rate) params.set('minRate', String(search.min_rate));
    router.push(`/worker/shifts?${params.toString()}`);
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('nursly_saved_searches')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete error:', error);
      } else {
        setSearches((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Saved Searches</h1>
          <p className="mt-2 text-gray-600">Manage your saved shift search criteria</p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-gray-600">Loading saved searches...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Saved Searches</h1>
        <p className="mt-2 text-gray-600">Manage your saved shift search criteria</p>
      </div>

      <Button
        variant="primary"
        className="flex items-center gap-2"
        onClick={() => setShowForm(!showForm)}
      >
        <Plus className="h-5 w-5" />
        Save Current Search
      </Button>

      {showForm && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-semibold text-gray-900">New Saved Search</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="e.g. Elderly Care - Manchester"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                <select
                  value={formData.specialty}
                  onChange={(e) => setFormData((p) => ({ ...p, specialty: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Any specialty</option>
                  <option value="elderly_care">Elderly Care</option>
                  <option value="dementia">Dementia</option>
                  <option value="community">Community</option>
                  <option value="mental_health">Mental Health</option>
                  <option value="palliative">Palliative</option>
                  <option value="disability">Disability Support</option>
                  <option value="general">General</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="e.g. Manchester"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min rate (per hour)</label>
                <input
                  type="number"
                  step="0.50"
                  value={formData.minRate}
                  onChange={(e) => setFormData((p) => ({ ...p, minRate: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="e.g. 14.50"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveSearch}
                disabled={formSubmitting || !formData.name.trim()}
              >
                {formSubmitting ? 'Saving...' : 'Save Search'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowForm(false);
                  setFormData({ name: '', specialty: '', location: '', minRate: '' });
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {searches.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-lg font-medium text-gray-900">No saved searches</p>
            <p className="mt-1 text-gray-600">Save your search filters to quickly find shifts</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {searches.map((search) => (
            <Card key={search.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{search.name}</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {search.specialty && <Badge variant="secondary">{search.specialty}</Badge>}
                      {search.location && <Badge variant="secondary">{search.location}</Badge>}
                      {search.min_rate && <Badge variant="secondary">{search.min_rate}/hr min</Badge>}
                    </div>
                    <p className="mt-3 text-sm text-gray-600">
                      {search.matchingShifts} matching shifts available
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 sm:items-end">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleApplySearch(search)}
                    >
                      Apply Search
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(search.id)}
                      disabled={deleting === search.id}
                      className="text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      {deleting === search.id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
