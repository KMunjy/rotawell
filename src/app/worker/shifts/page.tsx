'use client';

import { useEffect, useState } from 'react';
import { MapPin, Clock, DollarSign, Search, Filter, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';
import type { NurslyShift } from '@/lib/types';

interface ShiftWithDetails extends NurslyShift {
  org?: { name: string };
  location?: { name: string; city: string };
}

const PAGE_SIZE = 20;

export default function ShiftsPage() {
  const { toast } = useToast();
  const [shifts, setShifts] = useState<ShiftWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [savedShifts, setSavedShifts] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({
    specialty: '',
    minRate: 0,
  });

  const toggleSaveShift = (shiftId: string) => {
    setSavedShifts((prev) =>
      prev.includes(shiftId) ? prev.filter((id) => id !== shiftId) : [...prev, shiftId]
    );
  };

  const isSaved = (shiftId: string) => savedShifts.includes(shiftId);

  useEffect(() => {
    const fetchShifts = async () => {
      setLoading(true);
      try {
        const supabase = createClient();

        let query = supabase
          .from('nursly_shifts')
          .select(`
            *,
            org:nursly_organisations(name),
            location:nursly_org_locations(name, city)
          `, { count: 'exact' })
          .eq('status', 'open')
          .order('start_time', { ascending: true })
          .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

        if (filters.specialty) {
          query = query.eq('specialty', filters.specialty);
        }
        if (filters.minRate > 0) {
          query = query.gte('rate_per_hour', filters.minRate);
        }

        const { data, error, count } = await query;

        if (error) {
          toast('Failed to load shifts', 'error');
        } else {
          setShifts((data as ShiftWithDetails[]) || []);
          setTotalCount(count || 0);
        }
      } catch (err) {
        console.error('Error:', err);
        toast('Failed to load shifts', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchShifts();
  }, [page, filters]);

  const filteredShifts = shifts.filter((shift) => {
    if (!searchTerm) return true;
    return (
      shift.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shift.org?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shift.location?.city.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const handleApply = async (shiftId: string) => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast('You must be logged in to apply', 'error');
        return;
      }

      const { error } = await supabase
        .from('nursly_shift_applications')
        .insert({
          shift_id: shiftId,
          nurse_id: user.id,
          status: 'pending',
        });

      if (error) {
        toast('Failed to apply for shift', 'error');
      } else {
        toast('Successfully applied for shift', 'success');
      }
    } catch (err) {
      console.error('Error:', err);
      toast('Failed to apply for shift', 'error');
    }
  };

  const handleFilterApply = () => {
    setPage(0);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Available Shifts</h1>
        <p className="mt-2 text-gray-600">Find and apply for shifts that match your skills and availability</p>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Search by title, provider, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Button
          variant="outline"
          onClick={() => setFilterOpen(!filterOpen)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      {filterOpen && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-900 block mb-2">Specialty</label>
                <select
                  value={filters.specialty}
                  onChange={(e) => setFilters({ ...filters, specialty: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20"
                >
                  <option value="">All specialties</option>
                  <option value="elderly_care">Elderly Care</option>
                  <option value="community">Community Care</option>
                  <option value="dementia">Dementia</option>
                  <option value="mental_health">Mental Health</option>
                </select>
              </div>
              <Input
                label="Minimum hourly rate (£)"
                type="number"
                value={filters.minRate}
                onChange={(e) => setFilters({ ...filters, minRate: Number(e.target.value) })}
              />
            </div>
            <Button variant="primary" size="sm" onClick={handleFilterApply} className="mt-4">
              Apply Filters
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <p className="text-gray-600">Loading shifts...</p>
            </CardContent>
          </Card>
        ) : filteredShifts.length > 0 ? (
          <>
            {filteredShifts.map((shift) => (
              <Card key={shift.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{shift.title}</h3>
                      <p className="mt-1 text-sm text-gray-600">{shift.org?.name}</p>

                      <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          {shift.location?.city || 'Location not specified'}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          {new Date(shift.start_time).toLocaleTimeString('en-GB', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}{' '}
                          -{' '}
                          {new Date(shift.end_time).toLocaleTimeString('en-GB', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <DollarSign className="h-4 w-4" />
                          {formatCurrency(shift.rate_per_hour)}/hour
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <Badge variant="secondary">{shift.specialty}</Badge>
                        <Badge variant="secondary">{shift.band}</Badge>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:items-end">
                      <Button variant="primary" onClick={() => handleApply(shift.id)}>
                        Apply now
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSaveShift(shift.id)}
                        className="flex items-center gap-2"
                      >
                        <Heart
                          className={`h-4 w-4 ${isSaved(shift.id) ? 'fill-red-500 text-red-500' : ''}`}
                        />
                        {isSaved(shift.id) ? 'Saved' : 'Save'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-gray-600">
                  Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, totalCount)} of {totalCount} shifts
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Search className="h-12 w-12 text-gray-300" />
              <p className="mt-4 text-lg font-medium text-gray-900">No shifts available</p>
              <p className="mt-1 text-gray-600">Check back soon — new shifts are posted regularly</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
