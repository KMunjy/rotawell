import Link from 'next/link';
import { ExternalLink, AlertCircle } from 'lucide-react';

export default function RightToWorkPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Right to Work</h1>
        <p className="text-gray-600">Immigration checks and employment verification</p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex gap-4">
        <AlertCircle className="h-6 w-6 text-red-700 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-red-900 mb-2">Critical Employer Responsibility</h3>
          <p className="text-sm text-red-800">
            Employers MUST conduct right to work checks before employment starts. Failure to do so or knowingly employing someone without right to work incurs penalties up to £60,000 per worker (from Feb 2024).
          </p>
        </div>
      </div>

      <section className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Immigration, Asylum and Nationality Act 2006</h2>
              <p className="text-sm text-gray-600 mt-2">Legal framework for employment checks</p>
            </div>
            <a
              href="https://www.legislation.gov.uk/ukpga/2006/13/contents"
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
              <h3 className="font-semibold text-gray-900 mb-2">Section 15 — Offence of Employing Illegal Entrants:</h3>
              <p className="text-sm text-gray-700">It is illegal for an employer to knowingly employ someone who does not have the right to work in the UK.</p>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-900 mb-2">Section 15A — Potential High Earners:</h3>
              <p className="text-sm text-gray-700">Since June 2024, individuals without right to work who earned £10,000+ in the previous tax year may face civil action by the state.</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
              <h3 className="font-bold text-red-900 mb-2">Penalties for Knowingly Employing Illegal Workers:</h3>
              <ul className="space-y-1 text-sm text-red-800">
                <li>• Up to £60,000 per worker (from Feb 2024)</li>
                <li>• Up to 5 years imprisonment (in serious cases)</li>
                <li>• Director liability (personal responsibility)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Right to Work Checks: Overview</h2>
              <p className="text-sm text-gray-600 mt-2">When and how to verify employment eligibility</p>
            </div>
            <a
              href="https://www.gov.uk/guidance/right-to-work-checks"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Gov.UK Guidance
            </a>
          </div>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-blue-900 mb-2">Timing:</h3>
              <p className="text-sm text-blue-800">Right to work checks MUST be completed BEFORE employment begins. You cannot legally employ someone until verified.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Two Types of Checks:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-3"><span className="text-primary font-bold">1.</span> <strong>List A Check:</strong> One-off evidence check (documents prove permanent right to work)</li>
                <li className="flex gap-3"><span className="text-primary font-bold">2.</span> <strong>List B Check:</strong> Initial evidence + periodic rechecks (ongoing right to work verification)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">List A Documents (Permanent Right to Work)</h2>
              <p className="text-sm text-gray-600 mt-2">Original documents showing ongoing right to work</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-1">UK/EEA/Swiss Citizens:</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• UK passport (valid or expired within last 3 years)</li>
                <li>• EEA/Swiss passport</li>
                <li>• Biometric residence document/card (UK, EEA, Switzerland)</li>
                <li>• National ID card (EU/EEA/Switzerland)</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-1">Other Nationalities (Settled Status):</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Immigrant status marked in passport as "SETTLED"</li>
                <li>• Refugee status document (Home Office letter)</li>
                <li>• Right of abode document</li>
                <li>• Certificate of registration/naturalisation</li>
                <li>• Indefinite leave to enter/remain</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">List B Documents (Ongoing Checks)</h2>
              <p className="text-sm text-gray-600 mt-2">Documents requiring periodic re-checking</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-1">Common List B Documents:</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Visa or BRP card with valid expiry date</li>
                <li>• Family residence permit</li>
                <li>• Visitor's passport with UK entry stamp</li>
                <li>• Certificate of entitlement</li>
                <li>• UK residence permit (for EEA after transition period)</li>
              </ul>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-bold text-amber-900 mb-2">Important:</h3>
              <p className="text-sm text-amber-800">List B documents require re-checking every 12 months (or before expiry if sooner). You must re-verify the person still has right to work.</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Digital Right to Work Checks</h2>
              <p className="text-sm text-gray-600 mt-2">Online verification via GOV.UK (from June 2024)</p>
            </div>
            <a
              href="https://www.gov.uk/right-to-work"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Digital Check Tool
            </a>
          </div>
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-bold text-green-900 mb-2">New Requirement:</h3>
              <p className="text-sm text-green-800">From June 2024, employers can use digital checks via GOV.UK instead of physical documents (for eligible workers).</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Eligible for Digital Check:</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• UK and Irish citizens</li>
                <li>• Visa holders in UK immigration system</li>
                <li>• Some EEA citizens with Family Residence Permits</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How Digital Checks Work:</h3>
              <ol className="space-y-1 text-sm text-gray-700">
                <li>1. Worker provides their UK National Insurance Number (NINO)</li>
                <li>2. Employer checks GOV.UK digital status online</li>
                <li>3. Status confirmed in real-time</li>
                <li>4. No documents need to be seen in person</li>
              </ol>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-700"><strong>Note:</strong> Digital checks cannot replace physical document checks for all cases. Some workers still need to provide documents.</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Employer Responsibilities</h2>
              <p className="text-sm text-gray-600 mt-2">What employers must do to comply</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <h3 className="font-bold text-blue-900">Conduct Checks Before Work Starts:</h3>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Check physical documents in person (usually)</li>
                <li>• For digital checks: use GOV.UK online system</li>
                <li>• Keep copies/records of documents seen</li>
              </ul>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <h3 className="font-bold text-blue-900">Keep Records:</h3>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Save copies of documents checked</li>
                <li>• Keep for at least 2 years after employment ends</li>
                <li>• Document which check was done (List A/B)</li>
                <li>• Record date check completed</li>
              </ul>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
              <h3 className="font-bold text-amber-900">Ongoing Responsibility (List B):</h3>
              <ul className="space-y-1 text-sm text-amber-800">
                <li>• Re-check every 12 months (or before expiry)</li>
                <li>• Monitor changes in visa/permit status</li>
                <li>• Stop employing if right to work expires</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Defences Against Penalties</h2>
              <p className="text-sm text-gray-600 mt-2">How employers can protect themselves from fines</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-bold text-green-900 mb-2">Statutory Defence:</h3>
              <p className="text-sm text-green-800">Employers can avoid penalties if they can prove they:</p>
              <ul className="space-y-1 text-sm text-green-800 mt-2">
                <li>• Carried out prescribed checks</li>
                <li>• Made reasonable checks (documents appeared genuine)</li>
                <li>• Kept records of the checks</li>
                <li>• Had no reasonable grounds to believe person lacked right to work</li>
              </ul>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
              <h3 className="font-bold text-amber-900">Important:</h3>
              <p className="text-sm text-amber-800">Simply checking documents is not enough if they are forged. You must exercise "reasonable checks" — e.g., comparing photos to the person, checking holographic elements.</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Sponsoring Workers (Visas)</h2>
              <p className="text-sm text-gray-600 mt-2">Employing workers who need visa sponsorship</p>
            </div>
            <a
              href="https://www.gov.uk/hire-a-health-and-social-care-worker"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Health & Social Care Route
            </a>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Sponsor Licence Required:</h3>
              <p className="text-sm text-gray-700">Care providers wanting to hire workers from outside UK/EEA must obtain a Sponsor Licence from UKVI.</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-bold text-green-900 mb-2">Health and Social Care Worker Visa (from Feb 2024):</h3>
              <ul className="space-y-1 text-sm text-green-800">
                <li>• £284 visa fee (reduced from £719)</li>
                <li>• Extended 3-year visa duration</li>
                <li>• Pathway to indefinite leave to remain</li>
                <li>• Covers nurses, care workers, therapists</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reporting Illegal Working</h3>
        <p className="text-sm text-gray-700 mb-4">If you suspect someone is working illegally:</p>
        <a
          href="https://www.gov.uk/report-illegal-working"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
        >
          Report to Home Office
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Topics</h3>
        <div className="grid gap-4">
          <Link href="/legal/employment" className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-all">
            <p className="font-medium text-gray-900">Employment Law</p>
            <p className="text-sm text-gray-600">Rights and protections for workers</p>
          </Link>
          <Link href="/legal/cqc" className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-all">
            <p className="font-medium text-gray-900">CQC Regulations</p>
            <p className="text-sm text-gray-600">Safe recruitment and staffing standards</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
