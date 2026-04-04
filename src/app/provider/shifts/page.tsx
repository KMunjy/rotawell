'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, DollarSign, Users, Trash2, Edit2, Plus, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function ShiftsPage() {
  const router = useRouter();
  const [shifts, setShifts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingShiftId, setEditingShiftId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    specialty: 'elderly_care',
    band: 'healthcare_assistant',
    start_time: '',
    end_time: '',
    rate_per_hour: '',
    notes: '',
  });

  const resetForm = () => {
    setFormData({
      title: '',
      specialty: 'elderly_care',
      band: 'healthcare_assistant',
      start_time: '',
      end_time: '',
      rate_per_hour: '',
      notes: '',
    });
    setEditingShiftId(null);
  };

  const fetchShifts = useCallback(async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: orgMember } = await supabase
        .from('nursly_org_members')
        .select('org_id')
        .eq('user_id', user.id)
        .single();

      if (!orgMember) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('nursly_shifts')
        .select(`
          *,
          location:nursly_org_locations(name, city)
        `)
        .eq('org_id', orgMember.org_id)
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Error fetching shifts:', error);
        setShifts([]);
      } else {
        setShifts((data as any[]) || []);
      }
    } catch (err) {
      console.error('Error:', err);
      setShifts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShifts();
  }, [fetchShifts]);

  const openShifts = shifts.filter((s) => s.status === 'open');
  const filledShifts = shifts.filter((s) => s.status === 'filled' || s.status === 'in_progress');

  const handleDelete = async (id: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('nursly_shifts')
        .update({ status: 'cancelled' })
        .eq('id', id);

      if (error) {
        console.error('Failed to delete shift:', error);
      } else {
        await fetchShifts();
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleEditClick = (shift: any) => {
    setEditingShiftId(shift.id);
    setFormData({
      title: shift.title || '',
      specialty: shift.specialty || 'elderly_care',
      band: shift.band || 'healthcare_assistant',
      start_time: shift.start_time ? shift.start_time.slice(0, 16) : '',
      end_time: shift.end_time ? shift.end_time.slice(0, 16) : '',
      rate_per_hour: shift.rate_per_hour?.toString() || '',
      notes: shift.notes || '',
    });
    setShowModal(true);
  };

  const handlePostShift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.start_time || !formData.end_time || !formData.rate_per_hour) {
      return;
    }

    setSubmitting(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: orgMember } = await supabase
        .from('nursly_org_members')
        .select('org_id')
        .eq('user_id', user.id)
        .single();

      if (!orgMember) return;

      // Get a location for this org
      const { data: locations } = await supabase
        .from('nursly_org_locations')
        .select('id')
        .eq('org_id', orgMember.org_id)
        .limit(1);

      const locationId = locations?.[0]?.id || null;

      const shiftPayload = {
        title: formData.title,
        specialty: formData.specialty,
        band: formData.band,
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString(),
        rate_per_hour: parseFloat(formData.rate_per_hour),
        notes: formData.notes || null,
        org_id: orgMember.org_id,
        posted_by: user.id,
        location_id: locationId,
        status: 'open',
        break_minutes: 30,
        rate_is_negotiable: false,
        required_credentials: [],
      };

      if (editingShiftId) {
        // Update existing shift
        const { error } = await supabase
          .from('nursly_shifts')
          .update({
            title: shiftPayload.title,
            specialty: shiftPayload.specialty,
            band: shiftPayload.band,
            start_time: shiftPayload.start_time,
            end_time: shiftPayload.end_time,
            rate_per_hour: shiftPayload.rate_per_hour,
            notes: shiftPayload.notes,
          })
          .eq('id', editingShiftId);

        if (error) {
          console.error('Failed to update shift:', error);
          return;
        }
      } else {
        // Insert new shift
        const { error } = await supabase
          .from('nursly_shifts')
          .insert(shiftPayload);

        if (error) {
          console.error('Failed to post shift:', error);
          return;
        }
      }

      setShowModal(false);
      resetForm();
      await fetchShifts();
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Shifts</h1>
            <p className="mt-2 text-gray-600">Post and manage your care shifts</p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={() => { resetForm(); setShowModal(true); }}
            className="flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Post new shift
          </Button>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-gray-600">Loading shifts...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>{editingShiftId ? 'Edit Shift' : 'Post New Shift'}</CardTitle>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePostShift} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Shift Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20"
                    placeholder="e.g., Senior Care Assistant - Dementia Support"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Specialty
                    </label>
                    <select
                      value={formData.specialty}
                      onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20"
                    >
                      <option value="elderly_care">Elderly Care</option>
                      <option value="community">Community Care</option>
                      <option value="dementia">Dementia</option>
                      <option value="mental_health">Mental Health</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Band</label>
                    <select
                      value={formData.band}
                      onChange={(e) => setFormData({ ...formData, band: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20"
                    >
                      <option value="healthcare_assistant">Healthcare Assistant</option>
                      <option value="support_worker">Support Worker</option>
                      <option value="nurse">Nurse</option>
                      <option value="registered_nurse">Registered Nurse</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Start Time
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.start_time}
                      onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      End Time
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.end_time}
                      onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Rate per hour (£)
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={formData.rate_per_hour}
                    onChange={(e) => setFormData({ ...formData, rate_per_hour: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20"
                    placeholder="14.50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20"
                    rows={3}
                    placeholder="Any additional details about the shift..."
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="primary" type="submit" disabled={submitting}>
                    {submitting ? 'Saving...' : editingShiftId ? 'Update Shift' : 'Post Shift'}
                  </Button>
                  <Button variant="outline" onClick={() => { setShowModal(false); resetForm(); }}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Shifts</h1>
            <p className="mt-2 text-gray-600">Post and manage your care shifts</p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={() => { resetForm(); setShowModal(true); }}
            className="flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Post new shift
          </Button>
        </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total shifts posted</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{shifts.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Open positions</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{openShifts.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Filled shifts</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{filledShifts.length}</p>
          </CardContent>
        </Card>
      </div>

      {openShifts.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Open Positions ({openShifts.length})</h2>
          <div className="space-y-4">
            {openShifts.map((shift) => (
              <Card key={shift.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{shift.title}</h3>
                          <p className="mt-1 text-sm text-gray-600">
                            {shift.location?.city || 'Unknown location'}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-2 sm:grid-cols-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          {formatDate(shift.start_time)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <DollarSign className="h-4 w-4" />
                          {formatCurrency(shift.rate_per_hour)}/hour
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="h-4 w-4" />0 applicants
                        </div>
                      </div>

                      <div className="mt-4">
                        <Badge variant="success">Open</Badge>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:items-end">
                      <Button
                        variant="primary"
                        onClick={() => router.push(`/provider/applicants?shift_id=${shift.id}`)}
                      >
                        View applicants
                      </Button>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => handleEditClick(shift)}
                        >
                          <Edit2 className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1 text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(shift.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {filledShifts.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Filled Positions ({filledShifts.length})</h2>
          <div className="space-y-4">
            {filledShifts.map((shift) => (
              <Card key={shift.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{shift.title}</h3>
                          <p className="mt-1 text-sm text-gray-600">
                            {shift.location?.city || 'Unknown location'}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-2 sm:grid-cols-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          {formatDate(shift.start_time)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <DollarSign className="h-4 w-4" />
                          {formatCurrency(shift.rate_per_hour)}/hour
                        </div>
                      </div>

                      <div className="mt-4">
                        <Badge variant="success">
                          {shift.status === 'in_progress' ? 'In Progress' : 'Filled'}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:items-end">
                      <Button variant="primary">View booking</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {shifts.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-lg font-medium text-gray-900">No shifts yet</p>
            <p className="mt-1 text-gray-600">Post your first shift to get started</p>
          </CardContent>
        </Card>
      )}
      </div>
    </>
  );
}
