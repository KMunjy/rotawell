import { ExternalLink, AlertCircle, Shield, Phone } from 'lucide-react';

export default function WhistleblowingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Whistleblowing</h1>
        <p className="text-gray-600">Protection for speaking up about concerns and malpractice in care settings</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
        <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <p className="font-semibold mb-1">Your legal right to speak up</p>
          <p>UK law protects workers who report wrongdoing. You cannot be dismissed or penalised for making a protected disclosure in good faith.</p>
        </div>
      </div>

      <section className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Public Interest Disclosure Act 1998</h2>
            <p className="text-sm text-gray-600 mt-1">The primary legislation protecting whistleblowers in the UK</p>
          </div>
          <a href="https://www.legislation.gov.uk/ukpga/1998/23/contents" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm">
            <ExternalLink className="h-4 w-4" />
            View Act
          </a>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Key Protections</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-3"><span className="text-primary font-bold">•</span> Protection from unfair dismissal for making protected disclosures</li>
            <li className="flex gap-3"><span className="text-primary font-bold">•</span> Protection from victimisation, harassment, demotion, or other detriment</li>
            <li className="flex gap-3"><span className="text-primary font-bold">•</span> Right to compensation at Employment Tribunal if penalised</li>
            <li className="flex gap-3"><span className="text-primary font-bold">•</span> No qualifying period of employment required</li>
            <li className="flex gap-3"><span className="text-primary font-bold">•</span> Applies to employees, agency workers, NHS staff, and contractors</li>
          </ul>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h3 className="font-semibold text-gray-900 mb-2">What Counts as a Protected Disclosure?</h3>
          <p className="text-sm text-gray-700 mb-3">A disclosure of information that the worker reasonably believes shows one or more of:</p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-3"><span className="text-primary font-bold">•</span> A criminal offence has been, is being, or is likely to be committed</li>
            <li className="flex gap-3"><span className="text-primary font-bold">•</span> A person has failed, is failing, or is likely to fail to comply with a legal obligation</li>
            <li className="flex gap-3"><span className="text-primary font-bold">•</span> A miscarriage of justice has occurred or is likely to occur</li>
            <li className="flex gap-3"><span className="text-primary font-bold">•</span> The health or safety of any individual has been, is, or is likely to be endangered</li>
            <li className="flex gap-3"><span className="text-primary font-bold">•</span> The environment has been, is being, or is likely to be damaged</li>
            <li className="flex gap-3"><span className="text-primary font-bold">•</span> Information tending to show any of the above has been, is being, or is likely to be deliberately concealed</li>
          </ul>
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Care-Specific Whistleblowing Concerns</h2>
        <p className="text-sm text-gray-600">Common issues that should be reported in healthcare and care settings</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Patient/Resident Safety', items: ['Neglect or abuse of residents', 'Medication errors being concealed', 'Unsafe staffing levels', 'Failure to follow care plans'] },
            { title: 'Professional Misconduct', items: ['Staff working without valid registration', 'Falsified qualifications or DBS checks', 'Impaired practice (substance misuse)', 'Failure to report safeguarding concerns'] },
            { title: 'Organisational Failures', items: ['Falsified CQC inspection records', 'Financial fraud or misappropriation', 'Covering up serious incidents', 'Bullying and harassment culture'] },
            { title: 'Regulatory Breaches', items: ['GDPR violations with patient data', 'Health and Safety failures', 'Breach of infection control protocols', 'Non-compliance with CQC regulations'] },
          ].map((cat) => (
            <div key={cat.title} className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{cat.title}</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                {cat.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-accent">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Freedom to Speak Up Guardian</h2>
        <p className="text-sm text-gray-700">Following the Francis Report (2015) into Mid Staffordshire NHS Foundation Trust, every NHS organisation is required to appoint a Freedom to Speak Up Guardian. Many care organisations have followed suit.</p>
        <div className="bg-primary/5 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">The Guardian&apos;s Role</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-3"><Shield className="h-4 w-4 text-primary shrink-0 mt-0.5" /> Provide confidential advice and support to staff raising concerns</li>
            <li className="flex gap-3"><Shield className="h-4 w-4 text-primary shrink-0 mt-0.5" /> Ensure concerns are properly investigated</li>
            <li className="flex gap-3"><Shield className="h-4 w-4 text-primary shrink-0 mt-0.5" /> Escalate matters when local resolution fails</li>
            <li className="flex gap-3"><Shield className="h-4 w-4 text-primary shrink-0 mt-0.5" /> Report to the board on speaking up culture</li>
          </ul>
        </div>
        <a href="https://nationalguardian.org.uk/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
          <ExternalLink className="h-4 w-4" />
          National Guardian&apos;s Office
        </a>
      </section>

      <section className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">How to Raise a Concern</h2>
        <div className="space-y-3">
          {[
            { step: '1', title: 'Raise internally first', desc: 'Speak to your line manager, Freedom to Speak Up Guardian, or use your employer\'s whistleblowing policy. Most concerns should be raised internally first.' },
            { step: '2', title: 'Prescribed persons', desc: 'If internal routes fail or are inappropriate, raise with a "prescribed person" — CQC for care quality, NMC for nursing concerns, HSE for health and safety.' },
            { step: '3', title: 'CQC direct reporting', desc: 'Contact CQC directly at 03000 616161 or whistleblowing@cqc.org.uk. CQC has a legal obligation to follow up on all concerns about registered services.' },
            { step: '4', title: 'External disclosure', desc: 'As a last resort, wider disclosure (e.g. to media) may be protected if the concern is exceptionally serious and other routes have been exhausted.' },
          ].map((s) => (
            <div key={s.step} className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0">{s.step}</div>
              <div>
                <h3 className="font-semibold text-gray-900">{s.title}</h3>
                <p className="text-sm text-gray-700">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Key Contacts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { org: 'CQC Whistleblowing', phone: '03000 616161', email: 'whistleblowing@cqc.org.uk', url: 'https://www.cqc.org.uk/contact-us/report-concern/report-concern-about-service-or-provider' },
            { org: 'NMC (nursing concerns)', phone: '020 7333 9333', email: 'fitness-to-practise@nmc-uk.org', url: 'https://www.nmc.org.uk/concerns-nurses-midwives/concerns-about-nurses-midwives/' },
            { org: 'Protect (whistleblowing charity)', phone: '020 3117 2520', email: 'whistle@protect-advice.org.uk', url: 'https://protect-advice.org.uk/' },
            { org: 'Health and Safety Executive', phone: '0300 003 1647', email: '', url: 'https://www.hse.gov.uk/contact/concerns.htm' },
          ].map((c) => (
            <div key={c.org} className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{c.org}</h3>
              <div className="space-y-1 text-sm text-gray-700">
                <p className="flex items-center gap-2"><Phone className="h-3 w-3" /> {c.phone}</p>
                {c.email && <p className="text-primary">{c.email}</p>}
                <a href={c.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                  <ExternalLink className="h-3 w-3" /> Website
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-sm text-gray-700">
        <p className="font-semibold text-gray-900 mb-1">Disclaimer</p>
        <p>This page provides general guidance only and does not constitute legal advice. For specific legal questions about whistleblowing, consult a qualified employment lawyer or contact the free helpline at Protect (formerly Public Concern at Work).</p>
      </div>
    </div>
  );
}
