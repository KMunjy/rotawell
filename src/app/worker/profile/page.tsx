'use client';

import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Edit2, Save } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { NurslyProfile, NurslyNurseProfile } from '@/lib/types';

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<NurslyProfile | null>(null);
  const [nurseProfile, setNurseProfile] = useState<NurslyNurseProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [shiftsCompleted, setShiftsCompleted] = useState(0);
  const [hoursWorked, setHoursWorked] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    locationCity: '',
    locationPostcode: '',
    specialties: [] as string[],
    yearsExperience: 0,
    preferredRadius: 25,
  });


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        setUserId(user.id);

        const { data: profileData } = await supabase
          .from('nursly_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileData) {
          setProfile(profileData as NurslyProfile);
          // Check if there's an existing avatar
          if ((profileData as any).avatar_url) {
            setAvatarUrl((profileData as any).avatar_url);
          }
        }

        const { data: nurseData } = await supabase
          .from('nursly_nurse_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (nurseData) {
          setNurseProfile(nurseData as NurslyNurseProfile);
          setFormData({
            fullName: profileData?.full_name || '',
            phone: nurseData.phone_number || '',
            locationCity: nurseData.location_city || '',
            locationPostcode: nurseData.location_postcode || '',
            specialties: nurseData.specialties || [],
            yearsExperience: nurseData.years_experience || 0,
            preferredRadius: nurseData.preferred_radius_km || 25,
          });
        }

        // Fetch real shift stats
        const { data: completedShifts } = await supabase
          .from('nursly_shifts')
          .select('start_time, end_time, break_minutes')
          .eq('filled_by', user.id)
          .eq('status', 'completed');

        if (completedShifts) {
          setShiftsCompleted(completedShifts.length);
          const totalHours = completedShifts.reduce((sum, s) => {
            const hours = (new Date(s.end_time).getTime() - new Date(s.start_time).getTime()) / (1000 * 60 * 60);
            const breakHours = (s.break_minutes || 0) / 60;
            return sum + Math.max(hours - breakHours, 0);
          }, 0);
          setHoursWorked(Math.round(totalHours));
        }
      } catch {
        // Silently handle — loading state is cleared in finally
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { error } = await supabase
        .from('nursly_nurse_profiles')
        .update({
          phone_number: formData.phone,
          location_city: formData.locationCity,
          location_postcode: formData.locationPostcode,
          specialties: formData.specialties,
          years_experience: formData.yearsExperience,
          preferred_radius_km: formData.preferredRadius,
        })
        .eq('id', user.id);

      if (!error) {
        setEditing(false);
      }
      // Profile update errors are surfaced via the UI — no raw error logging
    } catch {
      // Silently handle
    }
  };

  const handleAvatarClick = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    // Validate MIME type (don't trust file extension alone)
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimeTypes.includes(file.type)) {
      alert('Only JPEG, PNG, GIF, and WebP images are allowed.');
      if (avatarInputRef.current) avatarInputRef.current.value = '';
      return;
    }

    // Validate file size: max 5 MB
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      alert('Image must be smaller than 5 MB.');
      if (avatarInputRef.current) avatarInputRef.current.value = '';
      return;
    }

    setUploadingAvatar(true);
    try {
      const supabase = createClient();
      // Derive extension from validated MIME type, not filename
      const mimeToExt: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/gif': 'gif',
        'image/webp': 'webp',
      };
      const ext = mimeToExt[file.type] ?? 'jpg';
      const storagePath = `${userId}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(storagePath, file, { upsert: true });

      if (uploadError) {
        setUploadingAvatar(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(storagePath);

      if (urlData?.publicUrl) {
        // Append cache-buster to force refresh
        setAvatarUrl(`${urlData.publicUrl}?t=${Date.now()}`);
      }
    } catch {
      // Upload error — state is cleaned up in finally
    } finally {
      setUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Professional Profile</h1>
          <p className="mt-2 text-gray-600">Manage your profile and specializations</p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-gray-600">Loading profile...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const displayName = profile?.full_name || 'User';
  const displaySpecialties = formData.specialties;

  return (
    <div className="space-y-8">
      <input
        ref={avatarInputRef}
        type="file"
        onChange={handleAvatarSelect}
        className="hidden"
        accept=".jpg,.jpeg,.png,.gif,.webp"
      />
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Professional Profile</h1>
        <p className="mt-2 text-gray-600">Manage your profile and specializations</p>
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Personal Information</CardTitle>
          <Button
            variant={editing ? 'primary' : 'outline'}
            size="sm"
            onClick={() => (editing ? handleSave() : setEditing(true))}
            className="flex items-center gap-2"
          >
            {editing ? (
              <>
                <Save className="h-4 w-4" />
                Save
              </>
            ) : (
              <>
                <Edit2 className="h-4 w-4" />
                Edit
              </>
            )}
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-end gap-4">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
                {displayName.charAt(0)}
              </div>
            )}
            {editing && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAvatarClick}
                disabled={uploadingAvatar}
              >
                {uploadingAvatar ? 'Uploading...' : 'Change photo'}
              </Button>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Full name"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              disabled={!editing}
            />
            <Input
              label="Phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!editing}
            />
            <Input
              label="City"
              name="locationCity"
              value={formData.locationCity}
              onChange={handleInputChange}
              disabled={!editing}
            />
            <Input
              label="Postcode"
              name="locationPostcode"
              value={formData.locationPostcode}
              onChange={handleInputChange}
              disabled={!editing}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Professional Details</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditing(!editing)}
            className="flex items-center gap-2"
          >
            <Edit2 className="h-4 w-4" />
            {editing ? 'Cancel' : 'Edit'}
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Years of experience"
              type="number"
              name="yearsExperience"
              value={formData.yearsExperience}
              onChange={handleInputChange}
              disabled={!editing}
            />
            <Input
              label="Preferred radius (km)"
              type="number"
              name="preferredRadius"
              value={formData.preferredRadius}
              onChange={handleInputChange}
              disabled={!editing}
            />
          </div>
          <div className="pt-2">
            <p className="text-sm text-gray-600">
              {formData.yearsExperience} years of experience with a preferred working radius of {formData.preferredRadius} km.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Specializations</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Your specializations</h3>
              <div className="flex flex-wrap gap-2">
                {displaySpecialties.map((spec) => (
                  <Badge key={spec} variant="default" className="flex items-center gap-2 px-3 py-1.5">
                    {spec}
                    {editing && (
                      <button
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            specialties: prev.specialties.filter((s) => s !== spec),
                          }))
                        }
                        className="ml-1 text-lg font-bold"
                      >
                        x
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            {editing && (
              <div className="pt-4 border-t border-gray-200">
                <h3 className="font-medium text-gray-900 mb-3">Add specialization</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Elderly care',
                    'Dementia care',
                    'Disability support',
                    'Mental health',
                    'Rehabilitation',
                    'Wound care',
                    'Catheter care',
                    'Diabetes management',
                  ].map((spec) => (
                    <button
                      key={spec}
                      onClick={() => {
                        if (!formData.specialties.includes(spec)) {
                          setFormData((prev) => ({
                            ...prev,
                            specialties: [...prev.specialties, spec],
                          }));
                        }
                      }}
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:border-primary hover:text-primary transition-colors"
                    >
                      + {spec}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-lg font-bold text-gray-900">{shiftsCompleted}</p>
            <p className="text-sm text-gray-600">Shifts completed</p>
          </div>

          <div>
            <p className="text-lg font-bold text-gray-900">{hoursWorked}h</p>
            <p className="text-sm text-gray-600">Hours worked</p>
          </div>

          <div className="sm:col-span-2">
            <p className="text-sm text-gray-500">Ratings and acceptance rate coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
