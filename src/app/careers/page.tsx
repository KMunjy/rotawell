'use client';

import { useState } from 'react';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';
import { Briefcase, Users, Zap, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    icon: Briefcase,
    title: 'Meaningful work',
    desc: 'Everything we build has a direct impact on the quality of care delivered across the UK.',
  },
  {
    icon: Users,
    title: 'Small, focused team',
    desc: 'We\u2019re not trying to grow fast for the sake of it. Every hire matters.',
  },
  {
    icon: Zap,
    title: 'Equity & ownership',
    desc: 'Early team members share in Rotawell\u2019s upside as we grow.',
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
        subject: `Career enquiry \u2014 ${form.role}`,
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
    <div className="min-h-screen bg-cream-100">
      <PublicHeader />

      <main>
        {/* Hero */}
        <section className="bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Careers at Rotawell</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Help fix UK social care staffing
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-600">
              We{'\u2019'}re a small team on a big mission\u2014to make care staffing fairer, faster, and better for everyone involved. We{'\u2019'}re growing, but carefully.
            </p>
          </div>
        </section>

        {/* No open positions */}
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border-2 border-primary/20 bg-white p-12 text-center">
              <Briefcase className="mx-auto h-12 w-12 text-primary/40" />
              <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">No open positions right now</h2>
              <p className="mx-auto mt-4 max-w-md leading-relaxed text-gray-600">
                We don{'\u2019'}t have any open roles at the moment, but we{'\u2019'}re always interested in hearing from exceptional people who care about social care.
              </p>
              <p className="mx-auto mt-3 max-w-md text-gray-600">
                Send us your CV and a note about what you{'\u2019'}d like to work on\u2014we keep applications on file and reach out when the right role opens up.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-10 text-center text-2xl font-bold tracking-tight text-gray-900">Why join Rotawell?</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {values.map((v) => (
                <div key={v.title} className="rounded-2xl border border-gray-200/80 p-6 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary">
                    <v.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-semibold tracking-tight text-gray-900">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CV form */}
        <section className="py-16">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Send us your CV</h2>
              <p className="mt-2 text-gray-600">
                Tell us who you are and what you{'\u2019'}d like to work on.
              </p>
            </div>

            {submitted ? (
              <div className="rounded-2xl border border-green-200 bg-green-50 p-10 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
                <h2 className="mt-4 text-2xl font-bold text-gray-900">Application received</h2>
                <p className="mt-3 text-gray-600">
                  Thanks for reaching out. We{'\u2019'}ll be in touch if a suitable role opens up.
                </p>
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
                  <label className="mb-1 block text-sm font-medium text-gray-900">
                    Area of interest <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Select a role type...</option>
                    {roleOptions.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-900">
                    LinkedIn or portfolio URL
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    value={form.linkedin}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-900">
                    Tell us about yourself <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="What have you worked on? What excites you about Rotawell? What would you want to build?"
                  />
                </div>

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    {error}
                  </div>
                )}

                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? 'Sending...' : 'Send application'}
                </Button>
              </form>
            )}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
