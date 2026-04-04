'use client';

import { useState } from 'react';
import Link from 'next/link';
import { OrbitalHeart } from '@/components/brand/orbital-heart';
import { Mail, Phone, MapPin, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

type Category = 'general' | 'support' | 'billing' | 'provider_enquiry' | 'worker_enquiry' | 'partnership';

const categories: { value: Category; label: string }[] = [
  { value: 'general', label: 'General enquiry' },
  { value: 'support', label: 'Technical support' },
  { value: 'billing', label: 'Billing & payments' },
  { value: 'worker_enquiry', label: 'Care worker enquiry' },
  { value: 'provider_enquiry', label: 'Care provider enquiry' },
  { value: 'partnership', label: 'Partnership opportunity' },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    category: 'general' as Category,
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();

      const ticketRef = `CONTACT-${Date.now()}`;

      const { error: dbError } = await supabase.from('nursly_support_tickets').insert({
        ticket_ref: ticketRef,
        name: form.name.trim(),
        email: form.email.trim(),
        category: form.category,
        subject: form.subject.trim(),
        description: form.message.trim(),
        priority: 'p3',
        status: 'open',
      });

      if (dbError) {
        console.error('Submit error:', dbError);
        setError('Failed to send your message. Please try again or email us directly.');
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <Link href="/" className="flex items-center gap-2">
              <OrbitalHeart />
              <span className="text-2xl font-bold text-primary">Rotawell</span>
            </Link>
            <div className="flex gap-4">
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">Sign in</Link>
              <Link href="/register" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
                Get started
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Contact info */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Get in touch</h1>
            <p className="mt-4 text-lg text-gray-600">
              Have a question or need help? We're here. Fill in the form and we'll get back to you within one business day.
            </p>

            <div className="mt-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <p className="mt-1 text-sm text-gray-600">hello@rotawell.co.uk</p>
                  <p className="text-sm text-gray-600">support@rotawell.co.uk (support)</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Phone</p>
                  <p className="mt-1 text-sm text-gray-600">Mon–Fri, 9am–6pm</p>
                  <p className="text-sm text-gray-600">+44 20 1234 5678</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Registered address</p>
                  <p className="mt-1 text-sm text-gray-600">
                    Rotawell Ltd<br />
                    United Kingdom
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="rounded-2xl border border-green-200 bg-green-50 p-10 text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                <h2 className="mt-4 text-2xl font-bold text-gray-900">Message sent</h2>
                <p className="mt-3 text-gray-600">
                  Thank you for getting in touch. We'll respond within one business day.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: '', email: '', category: 'general', subject: '', message: '' });
                  }}
                  className="mt-6 text-sm font-medium text-primary hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white p-8 space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Your name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20"
                      placeholder="Jane Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Email address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20"
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20"
                  >
                    {categories.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20"
                    placeholder="Tell us more about your enquiry..."
                  />
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-600">
                  <strong>Privacy notice:</strong> The information you submit in this form will be used to respond to your enquiry and stored as a support record in accordance with our{' '}
                  <a href="/legal/privacy" className="text-primary underline">Privacy Policy</a>.
                  We process this data under the legal basis of legitimate interests (UK GDPR Article 6(1)(f) / POPIA Section 11(1)(f)).
                  You may request deletion of this record at any time by contacting{' '}
                  <a href="mailto:privacy@rotawell.co.uk" className="text-primary underline">privacy@rotawell.co.uk</a>.
                </div>

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
                >
                  {submitting ? 'Sending...' : 'Send message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-xs text-gray-400">
              <a href="/legal/privacy" className="hover:text-gray-600">Privacy Policy</a>
              <a href="/legal/gdpr" className="hover:text-gray-600">GDPR & Data</a>
              <a href="/about" className="hover:text-gray-600">About</a>
              <a href="/careers" className="hover:text-gray-600">Careers</a>
            </div>
            <p className="text-xs text-gray-400">
              POPIA Information Officer: <a href="mailto:privacy@rotawell.co.uk" className="hover:text-gray-600">privacy@rotawell.co.uk</a>
            </p>
            <p className="text-sm text-gray-500">
              Copyright © {new Date().getFullYear()} Rotawell Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
