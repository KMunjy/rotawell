'use client';

import { useState } from 'react';
import Link from 'next/link';
import { OrbitalHeart } from '@/components/brand/orbital-heart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        setError('Something went wrong. Please try again.');
        return;
      }

      setSubmitted(true);
    } catch {
      setError('An error occurred. Please try again.');
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

          <Card>
            <div className="p-8">
              {submitted ? (
                <>
                  <div className="flex flex-col items-center text-center">
                    <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900">Check your email</h1>
                    <p className="mt-2 text-sm text-gray-600">
                      Check your email for reset instructions. We sent a password reset link to{' '}
                      <span className="font-medium text-gray-900">{email}</span>.
                    </p>
                  </div>

                  <div className="mt-6">
                    <Link href="/login">
                      <Button variant="primary" className="w-full">
                        Back to sign in
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-gray-900">Reset your password</h1>
                  <p className="mt-2 text-sm text-gray-600">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>

                  {error && (
                    <div className="mt-4 flex gap-3 rounded-lg bg-red-50 p-4">
                      <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <Input
                      label="Email address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />

                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? 'Sending...' : 'Send reset link'}
                    </Button>
                  </form>

                  <div className="mt-6 text-center">
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to sign in
                    </Link>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
