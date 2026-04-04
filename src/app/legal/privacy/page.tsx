import Link from 'next/link';

const lastUpdated = '4 April 2026';

export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500">Last updated: {lastUpdated}</p>
        <p className="mt-3 text-gray-600">
          This Privacy Policy explains how Rotawell Ltd (<strong>"Rotawell"</strong>, <strong>"we"</strong>, <strong>"us"</strong>) collects, uses, and protects your personal data.
          It applies to all users of the Rotawell platform, including care workers, care providers, and visitors to our website.
        </p>
        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm text-blue-900">
            <strong>Dual jurisdiction notice:</strong> Rotawell Ltd operates as a UK-registered company serving UK users.
            Our technology operations are partly supported from South Africa, which means we are subject to both the{' '}
            <strong>UK General Data Protection Regulation (UK GDPR)</strong> and the{' '}
            <strong>Protection of Personal Information Act 4 of 2013 (POPIA)</strong> (South Africa).
            This policy covers both jurisdictions.
          </p>
        </div>
      </div>

      {/* 1. Data Controller */}
      <section className="rounded-lg border border-gray-200 bg-white p-6 space-y-3">
        <h2 className="text-xl font-bold text-gray-900">1. Who we are (Data Controller / Responsible Party)</h2>
        <p className="text-sm text-gray-700">
          <strong>UK GDPR:</strong> Rotawell Ltd is the Data Controller for personal data processed in connection with the Rotawell platform.
        </p>
        <p className="text-sm text-gray-700">
          <strong>POPIA:</strong> Rotawell Ltd is the Responsible Party for personal information processed in terms of the Protection of Personal Information Act.
        </p>
        <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-700 space-y-1">
          <p><strong>Registered name:</strong> Rotawell Ltd</p>
          <p><strong>Registered in:</strong> England and Wales</p>
          <p><strong>Contact email:</strong> privacy@rotawell.co.uk</p>
          <p><strong>POPIA Information Officer:</strong> See Section 11 below.</p>
        </div>
      </section>

      {/* 2. Data we collect */}
      <section className="rounded-lg border border-gray-200 bg-white p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-900">2. Personal data we collect</h2>
        <div className="space-y-3">
          {[
            {
              category: 'Account data',
              items: 'Full name, email address, password (hashed), phone number, account creation date, user role.',
            },
            {
              category: 'Professional profile data (care workers)',
              items: 'DBS certificate number and status, NMC PIN, professional qualifications and credentials, employment history, specialties, years of experience, work location preferences.',
            },
            {
              category: 'Organisation data (care providers)',
              items: 'Organisation name and type, billing email, CQC registration, registered address.',
            },
            {
              category: 'Shift and booking data',
              items: 'Shifts applied for, bookings made, shift history, hours worked, earnings.',
            },
            {
              category: 'Payment data',
              items: 'Earnings records, Instant Pay requests and amounts. We do not store full bank account details — bank details are stored in masked form in your browser\'s local storage only.',
            },
            {
              category: 'Communications',
              items: 'Messages submitted via the contact form, support tickets, and career applications.',
            },
            {
              category: 'Technical data',
              items: 'IP address, browser type, device information, cookie identifiers, page visit data.',
            },
          ].map((item) => (
            <div key={item.category} className="border-l-4 border-primary bg-gray-50 p-3">
              <p className="text-sm font-semibold text-gray-900">{item.category}</p>
              <p className="mt-1 text-sm text-gray-700">{item.items}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Legal basis */}
      <section className="rounded-lg border border-gray-200 bg-white p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-900">3. Legal basis for processing (UK GDPR / POPIA)</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p><strong>Contract performance (Article 6(1)(b) UK GDPR / Section 11(1)(a) POPIA):</strong> Processing your account, profile, shift bookings, and earnings is necessary to provide the Rotawell service under our Terms of Service.</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p><strong>Legal obligation (Article 6(1)(c) UK GDPR / Section 11(1)(c) POPIA):</strong> DBS checks, right-to-work verification, and financial record-keeping are required by law.</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p><strong>Legitimate interests (Article 6(1)(f) UK GDPR / Section 11(1)(f) POPIA):</strong> Fraud prevention, platform security, and improving our service.</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p><strong>Consent (Article 6(1)(a) UK GDPR / Section 11(1)(a) POPIA):</strong> Marketing communications and non-essential cookies. You may withdraw consent at any time via your <Link href="/settings/privacy" className="text-primary underline">privacy settings</Link>.</p>
          </div>
        </div>
      </section>

      {/* 4. How we use your data */}
      <section className="rounded-lg border border-gray-200 bg-white p-6 space-y-3">
        <h2 className="text-xl font-bold text-gray-900">4. How we use your personal data</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          {[
            'To create and manage your account',
            'To match care workers with available shifts',
            'To process shift applications, approvals, and cancellations',
            'To calculate and process earnings and Instant Pay requests',
            'To verify professional credentials and DBS status',
            'To issue and manage invoices for care providers',
            'To respond to support tickets and contact form enquiries',
            'To send transactional notifications (bookings, payments, compliance reminders)',
            'To send marketing communications (with consent)',
            'To detect and prevent fraud and abuse',
            'To comply with our legal obligations',
            'To improve the platform through aggregated analytics',
          ].map((use) => (
            <li key={use} className="flex items-start gap-2">
              <span className="text-primary font-bold mt-0.5">•</span>
              {use}
            </li>
          ))}
        </ul>
      </section>

      {/* 5. Sharing */}
      <section className="rounded-lg border border-gray-200 bg-white p-6 space-y-3">
        <h2 className="text-xl font-bold text-gray-900">5. Who we share your data with</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <p>We do not sell your personal data. We share it only in the following circumstances:</p>
          <div className="bg-gray-50 p-3 rounded-lg"><p><strong>Care providers / workers:</strong> When you apply for or fill a shift, relevant profile information is shared between the matched parties to facilitate the booking.</p></div>
          <div className="bg-gray-50 p-3 rounded-lg"><p><strong>Supabase (data processor):</strong> Our database and authentication provider. Servers located in the EU (Frankfurt). Supabase processes data under a Data Processing Agreement compliant with UK GDPR.</p></div>
          <div className="bg-gray-50 p-3 rounded-lg"><p><strong>Payment processors:</strong> Earnings and Instant Pay processing partners where applicable. These are engaged under appropriate data protection agreements.</p></div>
          <div className="bg-gray-50 p-3 rounded-lg"><p><strong>Legal/regulatory bodies:</strong> Where required by law (e.g., HMRC, DBS, CQC, or law enforcement with lawful authority).</p></div>
          <div className="bg-gray-50 p-3 rounded-lg"><p><strong>Safeguarding:</strong> Where we have a duty to refer safeguarding concerns.</p></div>
        </div>
      </section>

      {/* 6. International transfers */}
      <section className="rounded-lg border border-gray-200 bg-white p-6 space-y-3">
        <h2 className="text-xl font-bold text-gray-900">6. International data transfers</h2>
        <p className="text-sm text-gray-700">
          Some of our operational support functions are based in South Africa. When personal data is transferred to or accessed from South Africa, we ensure appropriate safeguards are in place:
        </p>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2"><span className="text-primary font-bold">•</span> Standard Contractual Clauses (SCCs) approved by the UK ICO, where applicable</li>
          <li className="flex items-start gap-2"><span className="text-primary font-bold">•</span> Binding data processing agreements incorporating POPIA requirements</li>
          <li className="flex items-start gap-2"><span className="text-primary font-bold">•</span> Access controls limiting which staff can access which data</li>
        </ul>
      </section>

      {/* 7. Retention */}
      <section className="rounded-lg border border-gray-200 bg-white p-6 space-y-3">
        <h2 className="text-xl font-bold text-gray-900">7. Data retention</h2>
        <div className="space-y-2 text-sm text-gray-700">
          {[
            ['Active account data', 'For the duration of your account, plus 2 years after closure'],
            ['DBS / credential records', '6 years (legal obligation)'],
            ['Financial / earnings records', '7 years (HMRC requirement)'],
            ['Support ticket records', '3 years'],
            ['Marketing consent records', 'Until consent is withdrawn, plus 1 year'],
            ['Technical / log data', '90 days'],
          ].map(([type, period]) => (
            <div key={type} className="flex justify-between border-b border-gray-100 pb-2">
              <span className="font-medium">{type}</span>
              <span className="text-gray-600 text-right max-w-[60%]">{period}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Your rights (GDPR) */}
      <section className="rounded-lg border border-gray-200 bg-white p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-900">8. Your rights under UK GDPR</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ['Right of access', 'Request a copy of all personal data we hold about you (Subject Access Request)'],
            ['Right to rectification', 'Correct inaccurate or incomplete data'],
            ['Right to erasure', 'Request deletion of your data (subject to legal obligations)'],
            ['Right to restriction', 'Limit how we process your data in certain circumstances'],
            ['Right to portability', 'Receive your data in a structured, machine-readable format'],
            ['Right to object', 'Object to processing based on legitimate interests or for direct marketing'],
            ['Rights re: automated decisions', 'Not be subject to solely automated decisions with significant effects'],
            ['Right to withdraw consent', 'Withdraw any consent you have given at any time'],
          ].map(([right, desc]) => (
            <div key={right} className="rounded-lg bg-gray-50 p-3">
              <p className="text-sm font-semibold text-gray-900">{right}</p>
              <p className="mt-1 text-sm text-gray-700">{desc}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-600">
          To exercise your rights, visit your{' '}
          <Link href="/settings/privacy" className="text-primary underline">Privacy Settings</Link> or email{' '}
          <a href="mailto:privacy@rotawell.co.uk" className="text-primary underline">privacy@rotawell.co.uk</a>.
          We will respond within 30 days (UK GDPR) or 30 days (POPIA).
        </p>
        <p className="text-sm text-gray-600">
          If you are unhappy with our response, you have the right to complain to the UK Information Commissioner&apos;s Office (ICO) at{' '}
          <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-primary underline">ico.org.uk</a>.
        </p>
      </section>

      {/* 9. POPIA rights */}
      <section className="rounded-lg border border-gray-200 bg-white p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-900">9. Your rights under POPIA (South Africa)</h2>
        <p className="text-sm text-gray-700">
          If you are a data subject whose personal information is processed in terms of POPIA, you have the following rights:
        </p>
        <ul className="space-y-2 text-sm text-gray-700">
          {[
            'The right to be notified that your personal information is being collected',
            'The right to access your personal information',
            'The right to request the correction or deletion of personal information',
            'The right to object to the processing of your personal information',
            'The right to submit a complaint to the Information Regulator (South Africa)',
          ].map((right) => (
            <li key={right} className="flex items-start gap-2">
              <span className="text-primary font-bold mt-0.5">•</span>
              {right}
            </li>
          ))}
        </ul>
        <p className="text-sm text-gray-600">
          Complaints to the Information Regulator (SA) can be submitted at{' '}
          <a href="https://inforegulator.org.za" target="_blank" rel="noopener noreferrer" className="text-primary underline">inforegulator.org.za</a>.
        </p>
      </section>

      {/* 10. Cookies */}
      <section className="rounded-lg border border-gray-200 bg-white p-6 space-y-3">
        <h2 className="text-xl font-bold text-gray-900">10. Cookies</h2>
        <p className="text-sm text-gray-700">We use the following types of cookies:</p>
        <div className="space-y-2">
          {[
            ['Essential cookies', 'Required for authentication and platform security. Cannot be disabled.', true],
            ['Functional cookies', 'Remember your preferences (e.g., UI settings). Can be disabled.', false],
            ['Analytics cookies', 'Help us understand how the platform is used. Can be disabled.', false],
            ['Marketing cookies', 'Used to deliver relevant communications. Disabled by default — requires consent.', false],
          ].map(([type, desc, required]) => (
            <div key={type as string} className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{type}</p>
                <p className="text-sm text-gray-700">{desc}</p>
              </div>
              {required ? (
                <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">Always on</span>
              ) : (
                <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">Optional</span>
              )}
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-600">
          You can manage your cookie preferences in the cookie banner that appears on first visit, or via your{' '}
          <Link href="/settings/privacy" className="text-primary underline">Privacy Settings</Link>.
        </p>
      </section>

      {/* 11. POPIA Information Officer */}
      <section className="rounded-lg border-2 border-primary/20 bg-primary/5 p-6 space-y-3">
        <h2 className="text-xl font-bold text-gray-900">11. POPIA Information Officer</h2>
        <p className="text-sm text-gray-700">
          In accordance with Section 55 of POPIA, Rotawell has designated an Information Officer responsible for ensuring compliance with POPIA.
        </p>
        <div className="rounded-lg bg-white p-4 text-sm text-gray-700 space-y-1 border border-gray-200">
          <p><strong>Information Officer:</strong> The Directors of Rotawell Ltd</p>
          <p><strong>Contact:</strong> <a href="mailto:privacy@rotawell.co.uk" className="text-primary underline">privacy@rotawell.co.uk</a></p>
          <p><strong>Postal address:</strong> Rotawell Ltd, United Kingdom</p>
        </div>
        <p className="text-sm text-gray-600">
          The Information Officer is responsible for encouraging compliance with POPIA, dealing with requests from data subjects, and working with the Information Regulator.
        </p>
      </section>

      {/* 12. Security */}
      <section className="rounded-lg border border-gray-200 bg-white p-6 space-y-3">
        <h2 className="text-xl font-bold text-gray-900">12. Security</h2>
        <p className="text-sm text-gray-700">
          We implement appropriate technical and organisational measures to protect personal data, including:
        </p>
        <ul className="space-y-1 text-sm text-gray-700">
          <li className="flex items-start gap-2"><span className="text-primary font-bold">•</span> Encryption in transit (TLS) and at rest</li>
          <li className="flex items-start gap-2"><span className="text-primary font-bold">•</span> Row-level security (RLS) in our database ensuring users can only access their own data</li>
          <li className="flex items-start gap-2"><span className="text-primary font-bold">•</span> Multi-factor authentication available for all accounts</li>
          <li className="flex items-start gap-2"><span className="text-primary font-bold">•</span> Access controls and audit logging for admin operations</li>
          <li className="flex items-start gap-2"><span className="text-primary font-bold">•</span> Regular security reviews</li>
        </ul>
        <p className="text-sm text-gray-700">
          In the event of a personal data breach, we will notify the relevant supervisory authority (ICO / Information Regulator) and affected data subjects within the timeframes required by law.
        </p>
      </section>

      {/* 13. Contact */}
      <section className="rounded-lg border border-gray-200 bg-white p-6 space-y-3">
        <h2 className="text-xl font-bold text-gray-900">13. Contact us about privacy</h2>
        <p className="text-sm text-gray-700">
          For any questions about this Privacy Policy, to exercise your data rights, or to submit a complaint, contact us at:
        </p>
        <div className="text-sm text-gray-700">
          <p>Email: <a href="mailto:privacy@rotawell.co.uk" className="text-primary underline">privacy@rotawell.co.uk</a></p>
          <p>Alternatively, use the <Link href="/contact" className="text-primary underline">contact form</Link> on our website (select "General enquiry" and reference data privacy).</p>
        </div>
      </section>

      <p className="text-xs text-gray-400">
        This policy was last reviewed and updated on {lastUpdated}. We will notify registered users of material changes to this policy.
      </p>
    </div>
  );
}
