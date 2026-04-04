import Link from 'next/link';
import { ExternalLink, AlertCircle } from 'lucide-react';

export default function SafeguardingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Safeguarding</h1>
        <p className="text-gray-600">Protecting vulnerable people from harm and abuse</p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex gap-4">
        <AlertCircle className="h-6 w-6 text-red-700 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-red-900 mb-2">Safeguarding is Everyone's Responsibility</h3>
          <p className="text-sm text-red-800">
            All care workers must be trained in safeguarding procedures and know how to report concerns. Failure to act can result in harm to vulnerable people and potential prosecution.
          </p>
        </div>
      </div>

      <section className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Care Act 2014</h2>
              <p className="text-sm text-gray-600 mt-2">Section 42 — Safeguarding enquiries</p>
            </div>
            <a
              href="https://www.legislation.gov.uk/ukpga/2014/23/part/1/chapter/2"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              View Act
            </a>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Key Provisions:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Section 42 Enquiry:</strong> Local authorities must investigate if an adult at risk is being abused/neglected</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Safeguarding Board:</strong> Multi-agency Local Safeguarding Adults Board</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Safeguarding Plan:</strong> Personal safeguarding plan if abuse found</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Duty to Report:</strong> Care providers must report concerns to local authority</li>
              </ul>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-900 mb-2">Adult at Risk Definition:</h3>
              <p className="text-sm text-gray-700">An adult aged 18+ who has care and support needs AND is experiencing/at risk of abuse or neglect AND due to those care needs cannot protect themselves.</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">6 Safeguarding Principles</h2>
              <p className="text-sm text-gray-600 mt-2">Framework for safeguarding decisions and actions</p>
            </div>
            <a
              href="https://www.gov.uk/guidance/care-act-2014-part-1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Guidance
            </a>
          </div>
          <div className="space-y-3">
            <div className="border-l-4 border-primary bg-gray-50 p-4">
              <h3 className="font-bold text-gray-900 mb-1">1. EMPOWERMENT</h3>
              <p className="text-sm text-gray-700">People are supported to make their own decisions and give informed consent.</p>
            </div>
            <div className="border-l-4 border-primary bg-gray-50 p-4">
              <h3 className="font-bold text-gray-900 mb-1">2. PREVENTION</h3>
              <p className="text-sm text-gray-700">It is better to prevent harm than to react to it. Proactive safeguarding.</p>
            </div>
            <div className="border-l-4 border-primary bg-gray-50 p-4">
              <h3 className="font-bold text-gray-900 mb-1">3. PROPORTIONALITY</h3>
              <p className="text-sm text-gray-700">Responses proportionate to the risk and person's wishes and circumstances.</p>
            </div>
            <div className="border-l-4 border-primary bg-gray-50 p-4">
              <h3 className="font-bold text-gray-900 mb-1">4. PROTECTION</h3>
              <p className="text-sm text-gray-700">Timely and effective support to protect from harm and neglect.</p>
            </div>
            <div className="border-l-4 border-primary bg-gray-50 p-4">
              <h3 className="font-bold text-gray-900 mb-1">5. PARTNERSHIP</h3>
              <p className="text-sm text-gray-700">Agencies work together with the individual and families to safeguard.</p>
            </div>
            <div className="border-l-4 border-primary bg-gray-50 p-4">
              <h3 className="font-bold text-gray-900 mb-1">6. ACCOUNTABILITY</h3>
              <p className="text-sm text-gray-700">Clear accountability for safeguarding decisions and actions.</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Types of Abuse</h2>
              <p className="text-sm text-gray-600 mt-2">What constitutes abuse in a care setting</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-1">Physical Abuse</h3>
              <p className="text-sm text-gray-700">Hitting, pushing, rough handling, inappropriate restraint, denial of food/drink.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-1">Emotional/Psychological</h3>
              <p className="text-sm text-gray-700">Humiliation, intimidation, threats, controlling behaviour, isolation.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-1">Sexual Abuse</h3>
              <p className="text-sm text-gray-700">Unwanted sexual contact, exposure to sexual material, coercion, sexual harassment.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-1">Financial Abuse</h3>
              <p className="text-sm text-gray-700">Theft, fraud, exploitation of finances, coercion over finances.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-1">Neglect</h3>
              <p className="text-sm text-gray-700">Failure to provide food, medicine, hygiene care, isolation from social activity.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-1">Organisational Abuse</h3>
              <p className="text-sm text-gray-700">Poor care, unsafe practices, policy failures, systemic neglect at institutional level.</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Mental Capacity Act 2005</h2>
              <p className="text-sm text-gray-600 mt-2">Decision-making for those lacking mental capacity</p>
            </div>
            <a
              href="https://www.legislation.gov.uk/ukpga/2005/9/contents"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              View Act
            </a>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">5 Key Principles:</h3>
              <ol className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-3"><span className="text-primary font-bold">1.</span> Assume capacity unless proven otherwise</li>
                <li className="flex gap-3"><span className="text-primary font-bold">2.</span> Support person to make their own decisions</li>
                <li className="flex gap-3"><span className="text-primary font-bold">3.</span> Unwise decisions don't mean lack of capacity</li>
                <li className="flex gap-3"><span className="text-primary font-bold">4.</span> Act in best interests if person lacks capacity</li>
                <li className="flex gap-3"><span className="text-primary font-bold">5.</span> Least restrictive option for any action</li>
              </ol>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-900 mb-2">Capacity Assessment:</h3>
              <p className="text-sm text-gray-700 mb-2">To lack capacity, a person must be unable to:</p>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Understand the information relevant to the decision</li>
                <li>• Retain that information</li>
                <li>• Use or weigh that information as part of making a decision</li>
                <li>• Communicate their decision</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Deprivation of Liberty Safeguards (DoLS)</h2>
              <p className="text-sm text-gray-600 mt-2">Legal authority for restrictions on movement</p>
            </div>
            <a
              href="https://www.gov.uk/government/publications/liberty-protection-safeguards"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Guidance
            </a>
          </div>
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-900"><strong>Note:</strong> DoLS is being phased out and replaced by Liberty Protection Safeguards (LPS) from April 2022.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What is Deprivation of Liberty?</h3>
              <p className="text-sm text-gray-700">Continuous supervision and control of a person AND preventing them from leaving, even without physical restraint.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">When Required:</h3>
              <p className="text-sm text-gray-700">If care home/hospital wants to deprive someone of liberty, they must apply for a DoLS/LPS order from the supervisory body (local authority).</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">Liberty Protection Safeguards (LPS) — New Framework:</h3>
              <ul className="space-y-1 text-sm text-green-800">
                <li>• Applies to anyone over 16 lacking capacity</li>
                <li>• Includes healthcare and community settings (not just care homes)</li>
                <li>• Simpler assessment process</li>
                <li>• Appointment of representative mandatory</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Modern Slavery Act 2015</h2>
              <p className="text-sm text-gray-600 mt-2">Preventing human trafficking and exploitation</p>
            </div>
            <a
              href="https://www.legislation.gov.uk/ukpga/2015/30/contents"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              View Act
            </a>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Scope:</h3>
              <p className="text-sm text-gray-700 mb-3">Covers slavery, servitude, forced labour, and human trafficking in the UK and abroad.</p>
              <h3 className="font-semibold text-gray-900 mb-2">Red Flags in Care Settings:</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Workers unable to leave, controlled by employer</li>
                <li>• Excessive working hours, no days off</li>
                <li>• Poor living conditions, withheld pay</li>
                <li>• Passports held by employer</li>
                <li>• Signs of abuse, malnutrition, poor hygiene</li>
              </ul>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-700">Report concerns to: <a href="tel:08000111700" className="text-primary hover:underline">National Slavery Hotline: 0800 0111700</a></p>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reporting Safeguarding Concerns</h3>
        <div className="space-y-4 text-sm text-gray-700">
          <div className="flex gap-3">
            <span className="text-primary font-bold flex-shrink-0">1.</span>
            <div>
              <p><strong>Internal Route:</strong> Report to manager/safeguarding lead in your organisation</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-primary font-bold flex-shrink-0">2.</span>
            <div>
              <p><strong>Local Authority:</strong> Contact adult safeguarding team if internal route unavailable</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-primary font-bold flex-shrink-0">3.</span>
            <div>
              <p><strong>CQC:</strong> Report ongoing concerns about care quality</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-primary font-bold flex-shrink-0">4.</span>
            <div>
              <p><strong>Police:</strong> If a crime has been committed (emergency: 999)</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-primary font-bold flex-shrink-0">5.</span>
            <div>
              <p><strong>Whistleblowing:</strong> Protected disclosure if raising concerns about malpractice (see Whistleblowing section)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Topics</h3>
        <div className="grid gap-4">
          <Link href="/legal/whistleblowing" className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-all">
            <p className="font-medium text-gray-900">Whistleblowing</p>
            <p className="text-sm text-gray-600">Protection for speaking up about concerns</p>
          </Link>
          <Link href="/legal/cqc" className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-all">
            <p className="font-medium text-gray-900">CQC Regulations</p>
            <p className="text-sm text-gray-600">Care quality standards and inspections</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
