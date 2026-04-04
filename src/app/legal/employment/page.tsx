import Link from 'next/link';
import { ExternalLink, AlertCircle } from 'lucide-react';

export default function EmploymentLawPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Employment Law</h1>
        <p className="text-gray-600">Rights, protections, and regulations for UK care workers</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 flex gap-4">
        <AlertCircle className="h-6 w-6 text-amber-700 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-amber-900 mb-2">Key Requirement</h3>
          <p className="text-sm text-amber-800">
            All employers must ensure compliance with UK employment law. Violations can result in Employment Tribunal claims, compensation awards, and reputational damage.
          </p>
        </div>
      </div>

      <section className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Employment Rights Act 1996</h2>
              <p className="text-sm text-gray-600 mt-2">Foundational employment protections</p>
            </div>
            <a
              href="https://www.legislation.gov.uk/ukpga/1996/23/contents"
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
              <h3 className="font-semibold text-gray-900 mb-2">Key Rights:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Right not to be unfairly dismissed (after 2 years service)</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Right to a written statement of employment terms within 2 months</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Right to statutory notice periods (1-12 weeks depending on length of service)</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Right to statutory redundancy payments (if eligible)</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Right to statutory sick pay (minimum £111.35/week from Apr 2024)</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Right to statutory maternity/paternity/adoption leave</li>
              </ul>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-900 mb-2">Fair Dismissal Reasons:</h3>
              <p className="text-sm text-gray-700 mb-2">An employer can only fairly dismiss for:</p>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Capability (health, inability to do the job)</li>
                <li>• Conduct (breach of rules, misconduct)</li>
                <li>• Redundancy (genuine business need)</li>
                <li>• Breach of statutory obligation</li>
                <li>• Some other substantial reason (SOSR)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Working Time Regulations 1998</h2>
              <p className="text-sm text-gray-600 mt-2">Maximum working hours and rest entitlements</p>
            </div>
            <a
              href="https://www.legislation.gov.uk/uksi/1998/1833/contents/made"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              View Regulations
            </a>
          </div>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900 font-semibold">Maximum 48 hours per week averaged over 17 weeks (unless opted out)</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Rest Entitlements:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Daily Rest:</strong> Minimum 11 consecutive hours per 24-hour period</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Weekly Rest:</strong> Minimum 1 day per week (Sunday preferred)</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Rest Breaks:</strong> 20 minutes if working over 6 hours</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Annual Leave:</strong> Minimum 5.6 weeks (28 days for full-time)</li>
              </ul>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-900 mb-2">Compensatory Rest:</h3>
              <p className="text-sm text-gray-700">If workers cannot take statutory rest due to business needs, employers must provide adequate rest at another time within the same week.</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">National Minimum Wage Act 1998</h2>
              <p className="text-sm text-gray-600 mt-2">Current rates from April 2024</p>
            </div>
            <a
              href="https://www.gov.uk/national-minimum-wage-rates"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Current Rates
            </a>
          </div>
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold text-green-900">Age 21+:</span>
                <span className="text-green-900">£12.71/hour</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-green-900">Age 18-20:</span>
                <span className="text-green-900">£8.60/hour</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-green-900">Under 18:</span>
                <span className="text-green-900">£5.79/hour</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-green-900">Apprentice:</span>
                <span className="text-green-900">£6.40/hour</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What Counts as Pay:</h3>
              <p className="text-sm text-gray-700 mb-2">Minimum wage includes: basic hourly rate, commission, bonuses, allowances (except accommodation, meals).</p>
              <p className="text-sm text-gray-700"><strong>Does NOT include:</strong> Tips, gratuities, benefits in kind, contributions to pension schemes.</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Agency Workers Regulations 2010</h2>
              <p className="text-sm text-gray-600 mt-2">Equal treatment for temporary and agency staff</p>
            </div>
            <a
              href="https://www.legislation.gov.uk/uksi/2010/93/contents/made"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              View Regulations
            </a>
          </div>
          <div className="space-y-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm text-purple-900 font-semibold">After 12 weeks of continuous assignment, agency workers have equal pay and working conditions rights</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Key Protections:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Basic working conditions equal to permanent staff doing same work</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Pay no less than permanent employees in comparable role</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Access to facilities (rest rooms, meals, transport)</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Same notice periods and termination rules</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Cannot be forced to agree to worse terms to get work</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">IR35 Off-Payroll Working Rules</h2>
              <p className="text-sm text-gray-600 mt-2">Determining employment status for contractors</p>
            </div>
            <a
              href="https://www.gov.uk/guidance/check-employment-status-for-tax"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Check Status Tool
            </a>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What is IR35?</h3>
              <p className="text-sm text-gray-700">IR35 determines if a worker should be treated as an employee for tax purposes, even if they work through a limited company or agency.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Key Factors (Indicative):</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Control — does the hirer control how/when/where work is done?</li>
                <li>• Substitution — can you send a substitute?</li>
                <li>• Mutuality of obligation — guaranteed work?</li>
                <li>• Integration — are you part of the core team?</li>
                <li>• Exclusivity — can you work for others?</li>
              </ul>
            </div>
            <div className="border-t border-gray-200 pt-4 bg-red-50 rounded-lg p-4">
              <h3 className="font-semibold text-red-900 mb-2">Employer Responsibility (Updated Apr 2024):</h3>
              <p className="text-sm text-red-800">Hirers (not contractors) must make the IR35 determination and are responsible for withholding tax/NI if the worker is deemed employed.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Tribunal Claims</h3>
        <div className="space-y-4 text-sm text-gray-700">
          <p>Workers can claim to an Employment Tribunal for unfair dismissal, discrimination, breach of contract, and other violations.</p>
          <ul className="space-y-2">
            <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Time Limit:</strong> Generally 3 months from the action complained of</li>
            <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Compensation:</strong> Can include back pay, notice pay, and damages</li>
            <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Award Limit:</strong> £30,000 cap (unless discrimination or whistleblowing)</li>
            <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Free Help:</strong> ACAS offers free mediation and advice</li>
          </ul>
          <p className="mt-4 pt-4 border-t border-gray-200">
            <a href="https://www.acas.org.uk/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Contact ACAS for free employment rights advice
            </a>
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Protections</h3>
        <div className="grid gap-4">
          <Link href="/legal/safeguarding" className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-all">
            <p className="font-medium text-gray-900">Whistleblowing Protection</p>
            <p className="text-sm text-gray-600">Protection for staff raising concerns about malpractice</p>
          </Link>
          <Link href="/legal/gdpr" className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-all">
            <p className="font-medium text-gray-900">GDPR & Data Protection</p>
            <p className="text-sm text-gray-600">Your personal data rights as a worker</p>
          </Link>
          <Link href="/legal/health-safety" className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-all">
            <p className="font-medium text-gray-900">Health & Safety</p>
            <p className="text-sm text-gray-600">Safe working conditions and risk management</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
