'use client';

import { useState } from 'react';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';
import { Button } from '@/components/ui/button';
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
    <div className="min-h-screen bg-cream-100">
      <PublicHeader />

      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Contact info */}
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Get in touch</h1>
            <p className="mt-4 text-lg text-gray-600">
              Have a question or need help? We{'\u2019'}re here. Fill in the form and we{'\u2019'}ll get back to you within one business day.
            </p>

            <div className="mt-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <p className="mt-1 text-sm text-gray-600">hello@rotawell.co.uk</p>
                  <p className="text-sm text-gray-600">support@rotawell.co.uk (support)</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Phone</p>
                  <p className="mt-1 text-sm text-gray-600">Mon\u2013Fri, 9am\u20136pm</p>
                  <p className="text-sm text-gray-600">+44 20 1234 5678</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
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
                <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
                <h2 className="mt-4 text-2xl font-bold text-gray-900">Message sent</h2>
                <p className="mt-3 text-gray-600">
                  Thank you for getting in touch. We{'\u2019'}ll respond within one business day.
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
              <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-gray-200/80 bg-white p-8">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-900">
                      Your name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Jane Smith"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-900">
                      Email address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-900">Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {categories.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-900">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-900">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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

                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? 'Sending...' : 'Send message'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
