'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { OrbitalHeart } from '@/components/brand/orbital-heart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { CheckCircle, AlertCircle } from 'lucide-react';

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get('role') || 'nurse') as 'nurse' | 'agency_admin';

  const [step, setStep] = useState(1);
  const [role, setRole] = useState<'nurse' | 'agency_admin'>(initialRole);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [consentDataProcessing, setConsentDataProcessing] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Valid email is required';
    }

    if (role === 'agency_admin' && !formData.organizationName.trim()) {
      newErrors.organizationName = 'Organization name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!consentDataProcessing) {
      newErrors.consent = 'You must accept the Terms of Service and Privacy Policy to create an account.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role,
          organizationName: formData.organizationName,
        }),
      });

      const data = await response.json();

      if (response.status === 429) {
        setErrors({ submit: 'Too many registration attempts. Please try again later.' });
        return;
      }

      if (!response.ok) {
        setErrors({ submit: data.error || 'Registration failed. Please try again.' });
        return;
      }

      setStep(3);
    } catch {
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2 justify-center">
              <OrbitalHeart />
              <span className="text-2xl font-bold text-primary">Rotawell</span>
            </Link>
          </div>

          {step === 3 ? (
            <Card>
              <div className="p-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mx-auto">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="mt-4 text-2xl font-bold text-gray-900">Account created!</h1>
                <p className="mt-2 text-gray-600">
                  {role === 'nurse'
                    ? 'Welcome to Rotawell. Complete your profile to start finding shifts.'
                    : 'Welcome to Rotawell. Set up your organization to start posting shifts.'}
                </p>
                <Button
                  onClick={() => router.push(role === 'nurse' ? '/worker/shifts' : '/provider/shifts')}
                  variant="primary"
                  className="mt-6 w-full"
                >
                  Get started
                </Button>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="p-8">
                <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
                <p className="mt-2 text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link href="/login" className="font-medium text-primary hover:underline">
                    Sign in
                  </Link>
                </p>

                <div className="mt-6 flex gap-4">
                  {[
                    { value: 'nurse' as const, label: 'Nurse' },
                    { value: 'agency_admin' as const, label: 'Agency Admin' },
                  ].map((r) => (
                    <button
                      key={r.value}
                      onClick={() => {
                        setRole(r.value);
                        setStep(1);
                      }}
                      className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                        role === r.value
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>

                <div className="mt-6 flex gap-2">
                  {[1, 2].map((s) => (
                    <div
                      key={s}
                      className={`h-1 flex-1 rounded-full ${
                        step >= s ? 'bg-primary' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>

                {errors.submit && (
                  <div className="mt-4 flex gap-3 rounded-lg bg-red-50 p-4">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
                    <p className="text-sm text-red-800">{errors.submit}</p>
                  </div>
                )}

                <form
                  onSubmit={step === 1 ? (e) => {
                    e.preventDefault();
                    handleNext();
                  } : handleSubmit}
                  className="mt-6 space-y-4"
                >
                  {step === 1 ? (
                    <>
                      <Input
                        label="First name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        error={errors.firstName}
                        required
                      />
                      <Input
                        label="Last name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        error={errors.lastName}
                        required
                      />
                      <Input
                        label="Email address"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        error={errors.email}
                        required
                      />
                      {role === 'agency_admin' && (
                        <Input
                          label="Organization name"
                          name="organizationName"
                          value={formData.organizationName}
                          onChange={handleInputChange}
                          error={errors.organizationName}
                          required
                        />
                      )}
                      <Button
                        type="submit"
                        variant="primary"
                        className="w-full mt-6"
                      >
                        Continue
                      </Button>
                    </>
                  ) : (
                    <>
                      <Input
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        error={errors.password}
                        placeholder="At least 8 characters"
                        required
                      />
                      <Input
                        label="Confirm password"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        error={errors.confirmPassword}
                        required
                      />
                      <div className="space-y-3 rounded-lg bg-gray-50 p-4 border border-gray-200">
                        <p className="text-xs font-medium text-gray-700 uppercase tracking-wide">Consent &amp; Privacy</p>
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={consentDataProcessing}
                            onChange={(e) => {
                              setConsentDataProcessing(e.target.checked);
                              setErrors((prev) => ({ ...prev, consent: '' }));
                            }}
                            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary"
                          />
                          <span className="text-xs text-gray-700">
                            I have read and agree to the{' '}
                            <Link href="/legal/terms" className="text-primary underline">Terms of Service</Link>
                            {' '}and{' '}
                            <Link href="/legal/privacy" className="text-primary underline">Privacy Policy</Link>.
                            I consent to Rotawell processing my personal data to provide the platform services.{' '}
                            <strong>(Required)</strong>
                          </span>
                        </label>
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={consentMarketing}
                            onChange={(e) => setConsentMarketing(e.target.checked)}
                            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary"
                          />
                          <span className="text-xs text-gray-700">
                            I would like to receive news, updates, and promotional emails from Rotawell. You can unsubscribe at any time via your{' '}
                            <Link href="/settings/privacy" className="text-primary underline">privacy settings</Link>.{' '}
                            <span className="text-gray-400">(Optional)</span>
                          </span>
                        </label>
                        <p className="text-xs text-gray-400">
                          Your data is protected under UK GDPR and POPIA. See our{' '}
                          <Link href="/legal/privacy" className="underline">Privacy Policy</Link> for details.
                        </p>
                        {errors.consent && (
                          <p className="text-xs text-red-600">{errors.consent}</p>
                        )}
                      </div>
                      <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        disabled={loading}
                      >
                        {loading ? 'Creating account...' : 'Create account'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => setStep(1)}
                      >
                        Back
                      </Button>
                    </>
                  )}
                </form>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function RegisterSkeleton() {
  return (
    <div className="min-h-screen bg-brand-cream flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center">
            <div className="flex items-center gap-2">
              <OrbitalHeart />
              <span className="text-2xl font-bold text-primary">Rotawell</span>
            </div>
          </div>
          <Card>
            <div className="p-8 space-y-6">
              {/* Heading skeleton */}
              <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />

              {/* Tab skeletons */}
              <div className="flex gap-4">
                <div className="h-10 flex-1 animate-pulse rounded-lg bg-gray-200" />
                <div className="h-10 flex-1 animate-pulse rounded-lg bg-gray-200" />
              </div>

              {/* Progress bar skeleton */}
              <div className="flex gap-2">
                <div className="h-1 flex-1 animate-pulse rounded-full bg-gray-200" />
                <div className="h-1 flex-1 animate-pulse rounded-full bg-gray-200" />
              </div>

              {/* Input field skeletons */}
              <div className="space-y-4">
                <div>
                  <div className="h-4 w-20 animate-pulse rounded bg-gray-200 mb-2" />
                  <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200" />
                </div>
                <div>
                  <div className="h-4 w-20 animate-pulse rounded bg-gray-200 mb-2" />
                  <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200" />
                </div>
                <div>
                  <div className="h-4 w-28 animate-pulse rounded bg-gray-200 mb-2" />
                  <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200" />
                </div>
                <div>
                  <div className="h-4 w-32 animate-pulse rounded bg-gray-200 mb-2" />
                  <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200" />
                </div>
              </div>

              {/* Button skeleton */}
              <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200 mt-6" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterSkeleton />}>
      <RegisterContent />
    </Suspense>
  );
}
