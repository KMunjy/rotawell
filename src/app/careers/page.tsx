'use client';

import { useState } from 'react';
import Link from 'next/link';
import { OrbitalHeart } from '@/components/brand/orbital-heart';
import { Briefcase, Users, Zap, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const roleOptions = [
  'Software Engineer (Frontend)',
  'Software Engineer (Backend)',
  'Full Stack Engineer',
  'Product Designer',
  'Product Manager',
  'Operations / Care Sector Expert',
  'Sales / Business Development',
  'Customer Success',
  'Other',
];

const values = [
  {
    icon: <Briefcase className="h-6 w-6" />,
    title: 'Meaningful work',
    desc: 'Everything we build has a direct impact on the quality of care delivered across the UK.',
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: 'Small, focused team',
    desc: "We're not trying to grow fast for the sake of it. Every hire matters.",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: 'Equity & ownership',
    desc: 'Early team members share in Rotawell\'s upside as we grow.',
  },
];

export default function CareersPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: '',
    linkedin: '',
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
    if (!form.name.trim() || !form.email.trim() || !form.role || !form.message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();
      const ticketRef = `CAREER-${Date.now()}`;

      const description = [
        `Role interest: ${form.role}`,
        form.linkedin ? `LinkedIn/Portfolio: ${form.linkedin}` : null,
        '',
        form.message,
      ]
        .filter((l) => l !== null)
        .join('\n');

      const { error: dbError } = await supabase.from('nursly_support_tickets').insert({
        ticket_ref: ticketRef,
        name: form.name.trim(),
        email: form.email.trim(),
        category: 'career_application',
        subject: `Career enquiry — ${form.role}`,
        description,
        priority: 'p3',
        status: 'open',
      });

      if (dbError) {
        console.error('Submit error:', dbError);
        setError('Failed to send your application. Please try again or email us directly.');
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

      <main>
        {/* Hero */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm font-medium text-primary uppercase tracking-wider">Careers at Rotawell</p>
            <h1 className="mt-4 text-5xl font-bold text-gray-900">
              Help fix UK social care staffing
            </h1>
            <p className="mt-6 text-xl text-gray-600 leading-relaxed">
              We're a small team on a big mission — to make care staffing fairer, faster, and better for everyone involved. We're growing, but carefully.
            </p>
          </div>
        </section>

        {/* No open positions */}
        <section className="py-16 bg-brand-cream">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border-2 border-primary/20 bg-white p-12 text-center">
              <Briefcase className="h-12 w-12 text-primary/40 mx-auto" />
              <h2 className="mt-6 text-2xl font-bold text-gray-900">No open positions right now</h2>
              <p className="mt-4 text-gray-600 max-w-md mx-auto leading-relaxed">
                We don't have any open roles at the moment, but we're always interested in hearing from exceptional people who care about social care.
              </p>
              <p className="mt-3 text-gray-600 max-w-md mx-auto">
                Send us your CV and a note about what you'd like to work on — we keep applications on file and reach out when the right role opens up.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Why join Rotawell?</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {values.map((v) => (
                <div key={v.title} className="rounded-xl border border-gray-200 p-6 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {v.icon}
                  </div>
                  <h3 className="mt-4 font-semibold text-gray-900">{v.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CV form */}
        <section className="py-16 bg-brand-cream">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900">Send us your CV</h2>
              <p className="mt-2 text-gray-600">
                Tell us who you are and what you'd like to work on.
              </p>
            </div>

            {submitted ? (
              <div className="rounded-2xl border border-green-200 bg-green-50 p-10 text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                <h2 className="mt-4 text-2xl font-bold text-gray-900">Application received</h2>
                <p className="mt-3 text-gray-600">
                  Thanks for reaching out. We'll be in touch if a suitable role opens up.
                </p>
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
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Area of interest <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20"
                  >
                    <option value="">Select a role type...</option>
                    {roleOptions.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    LinkedIn or portfolio URL
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    value={form.linkedin}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Tell us about yourself <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20"
                    placeholder="What have you worked on? What excites you about Rotawell? What would you want to build?"
                  />
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
                  {submitting ? 'Sending...' : 'Send application'}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-xs text-gray-400">
              <a href="/legal/privacy" className="hover:text-gray-600">Privacy Policy</a>
              <a href="/legal/gdpr" className="hover:text-gray-600">GDPR & Data</a>
              <a href="/contact" className="hover:text-gray-600">Contact</a>
              <a href="/about" className="hover:text-gray-600">About</a>
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
