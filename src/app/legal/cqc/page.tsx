import Link from 'next/link';
import { ExternalLink, AlertCircle } from 'lucide-react';

export default function CQCPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">CQC Regulations</h1>
        <p className="text-gray-600">Care quality standards and inspection framework</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 flex gap-4">
        <AlertCircle className="h-6 w-6 text-blue-700 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900 mb-2">Regulatory Authority</h3>
          <p className="text-sm text-blue-800">
            The Care Quality Commission (CQC) is the independent regulator of health and social care in England. Providers must be registered and inspected regularly.
          </p>
        </div>
      </div>

      <section className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Health and Social Care Act 2008 (Regulated Activities) Regulations 2014</h2>
              <p className="text-sm text-gray-600 mt-2">Fundamental regulations for all care providers</p>
            </div>
            <a
              href="https://www.legislation.gov.uk/uksi/2014/2936/contents/made"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              View Regulations
            </a>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Core Requirements:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Person-centred care planning and delivery</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Safe recruitment and DBS checks for staff</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Safeguarding procedures and training</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Health and safety risk assessments</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Infection prevention and control measures</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Medicines management and prescribing</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Complaints procedures and records</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Governance and quality systems</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">5 Key Questions Framework</h2>
              <p className="text-sm text-gray-600 mt-2">CQC assessment structure for all inspections</p>
            </div>
            <a
              href="https://www.cqc.org.uk/guidance-providers/key-question-prompts"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              CQC Framework
            </a>
          </div>
          <div className="space-y-4">
            <div className="border-l-4 border-primary bg-gray-50 p-4">
              <h3 className="font-bold text-gray-900 mb-2">1. SAFE</h3>
              <p className="text-sm text-gray-700">How well are people protected from abuse, neglect, and avoidable harm? Systems in place to manage risks, safeguard vulnerable people, and ensure safe working practices.</p>
            </div>
            <div className="border-l-4 border-primary bg-gray-50 p-4">
              <h3 className="font-bold text-gray-900 mb-2">2. EFFECTIVE</h3>
              <p className="text-sm text-gray-700">Do people's care, treatment, and support achieve good outcomes? Is care based on evidence, assessed, monitored, and reviewed regularly?</p>
            </div>
            <div className="border-l-4 border-primary bg-gray-50 p-4">
              <h3 className="font-bold text-gray-900 mb-2">3. CARING</h3>
              <p className="text-sm text-gray-700">Is care delivered with compassion and dignity? Are people treated with respect, their preferences respected, and emotional support provided?</p>
            </div>
            <div className="border-l-4 border-primary bg-gray-50 p-4">
              <h3 className="font-bold text-gray-900 mb-2">4. RESPONSIVE</h3>
              <p className="text-sm text-gray-700">Are services organized and delivered in a way that meets people's needs? Are individual preferences, choices, and independence supported?</p>
            </div>
            <div className="border-l-4 border-primary bg-gray-50 p-4">
              <h3 className="font-bold text-gray-900 mb-2">5. WELL-LED</h3>
              <p className="text-sm text-gray-700">Is the organization led and managed effectively? Is there a clear vision, strategy, and culture of continuous improvement?</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">CQC Registration</h2>
              <p className="text-sm text-gray-600 mt-2">Who must register and key requirements</p>
            </div>
            <a
              href="https://www.cqc.org.uk/guidance-regulation/registration"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Registration Guide
            </a>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Regulated Activities Requiring Registration:</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Accommodation for persons with learning disabilities or mental health conditions</li>
                <li>• Care homes (residential and nursing)</li>
                <li>• Community care and domiciliary care services</li>
                <li>• Healthcare services (clinics, practices)</li>
                <li>• Hospital services</li>
                <li>• Specialist centres (diagnostic imaging, hearing aids, etc.)</li>
              </ul>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-900 mb-2">Registration Process:</h3>
              <ol className="space-y-1 text-sm text-gray-700">
                <li>1. Notify CQC before providing regulated activity</li>
                <li>2. Complete application (online, through CHCR)</li>
                <li>3. Provide information about the provider and key personnel</li>
                <li>4. CQC assesses against fundamental standards</li>
                <li>5. Approve and grant conditions, or refuse registration</li>
              </ol>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-amber-900"><strong>Penalty:</strong> Operating without registration is illegal. Fines up to £3,000 per day (care homes) and potential criminal prosecution.</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">CQC Inspection and Ratings</h2>
              <p className="text-sm text-gray-600 mt-2">How providers are assessed and rated</p>
            </div>
            <a
              href="https://www.cqc.org.uk/guidance-providers/how-we-inspect"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Inspection Process
            </a>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Inspection Types:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Key Inspections (unannounced):</strong> Full inspection against all 5 key questions</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Focused Inspections:</strong> Targeted inspections of specific areas of concern</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Announced Inspections:</strong> Usually at end of 12-month notice period</li>
              </ul>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-green-200">
                <span className="font-bold text-green-900">OUTSTANDING</span>
                <span className="text-sm text-green-800">Consistently exceeds standards</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-green-200">
                <span className="font-bold text-blue-900">GOOD</span>
                <span className="text-sm text-blue-800">Meets standards consistently</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-yellow-200">
                <span className="font-bold text-yellow-900">REQUIRES IMPROVEMENT</span>
                <span className="text-sm text-yellow-800">Does not meet standards consistently</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-red-900">INADEQUATE</span>
                <span className="text-sm text-red-800">Serious concerns; regulatory action</span>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-900 mb-2">Inspection Frequency:</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Outstanding: Every 3+ years</li>
                <li>• Good: Every 2-3 years</li>
                <li>• Requires Improvement: Within 6-12 months (with conditions)</li>
                <li>• Inadequate: Immediate follow-up with conditions</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Regulatory Enforcement</h3>
        <div className="space-y-4 text-sm text-gray-700">
          <p>CQC can take enforcement action if standards are not met:</p>
          <ul className="space-y-2">
            <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Conditions:</strong> Additional requirements on registration</li>
            <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Warnings:</strong> Notice to address non-compliance within timeframe</li>
            <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Suspension/Cancellation:</strong> Removal from register</li>
            <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Prosecutions:</strong> Criminal action for serious breaches</li>
          </ul>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Find CQC Ratings</h3>
        <p className="text-sm text-gray-700 mb-4">
          Search CQC's public database to find ratings and inspection reports for any registered provider:
        </p>
        <a
          href="https://www.cqc.org.uk/about-us/our-key-documents-and-policies/public-register"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Search CQC Public Register
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Topics</h3>
        <div className="grid gap-4">
          <Link href="/legal/safeguarding" className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-all">
            <p className="font-medium text-gray-900">Safeguarding</p>
            <p className="text-sm text-gray-600">Duty of care and protection of vulnerable people</p>
          </Link>
          <Link href="/legal/health-safety" className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-all">
            <p className="font-medium text-gray-900">Health & Safety</p>
            <p className="text-sm text-gray-600">Workplace safety and risk management</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
