import Link from 'next/link';
import { ExternalLink, AlertCircle } from 'lucide-react';

export default function NMCPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">NMC Standards</h1>
        <p className="text-gray-600">Nursing and Midwifery Council professional standards</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 flex gap-4">
        <AlertCircle className="h-6 w-6 text-blue-700 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900 mb-2">Professional Accountability</h3>
          <p className="text-sm text-blue-800">
            Nurses and midwives are personally accountable to the NMC. Failure to meet the standards can result in suspension or removal from the register, preventing practice.
          </p>
        </div>
      </div>

      <section className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">The Code: Professional Standards</h2>
              <p className="text-sm text-gray-600 mt-2">Nursing and Midwifery practice and behaviour standards</p>
            </div>
            <a
              href="https://www.nmc.org.uk/standards/code/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              View The Code
            </a>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-gray-700">The Code sets out the professional standards that registered nurses and midwives must uphold.</p>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">4 Key Areas:</h3>
              <div className="space-y-3">
                <div className="border-l-4 border-primary bg-gray-50 p-4">
                  <h4 className="font-bold text-gray-900 mb-1">1. Prioritise People</h4>
                  <p className="text-sm text-gray-700">Put people first, listen to them, respect their rights and preferences, and treat them with dignity and compassion.</p>
                </div>
                <div className="border-l-4 border-primary bg-gray-50 p-4">
                  <h4 className="font-bold text-gray-900 mb-1">2. Practice Effectively</h4>
                  <p className="text-sm text-gray-700">Keep skills and knowledge up-to-date, communicate clearly, work within your competence, and maintain accurate records.</p>
                </div>
                <div className="border-l-4 border-primary bg-gray-50 p-4">
                  <h4 className="font-bold text-gray-900 mb-1">3. Preserve Safety</h4>
                  <p className="text-sm text-gray-700">Identify and manage risks, report concerns, use best practice to prevent harm, and protect vulnerable people.</p>
                </div>
                <div className="border-l-4 border-primary bg-gray-50 p-4">
                  <h4 className="font-bold text-gray-900 mb-1">4. Promote Professionalism and Trust</h4>
                  <p className="text-sm text-gray-700">Uphold the reputation of nursing, be honest and trustworthy, avoid conflicts of interest, and maintain professional boundaries.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Registration and Revalidation</h2>
              <p className="text-sm text-gray-600 mt-2">Maintaining NMC registration</p>
            </div>
            <a
              href="https://www.nmc.org.uk/registration/the-nmc-register/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              NMC Register
            </a>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Types of Registration:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Registered Nurse (Adult):</strong> Qualification to care for adults across all healthcare settings</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Registered Nurse (Children):</strong> Specialised nursing for children and young people</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Registered Nurse (Learning Disabilities):</strong> Nursing for individuals with learning disabilities</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Registered Nurse (Mental Health):</strong> Mental health nursing specialisation</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Registered Midwife:</strong> Maternity and childbirth care</li>
              </ul>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-900 mb-2">Revalidation (Mandatory Every 3 Years):</h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                <p className="text-sm text-green-900 font-semibold">To revalidate, nurses must demonstrate:</p>
                <ul className="space-y-2 text-sm text-green-800">
                  <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>450 Hours Practice:</strong> Minimum practising in nursing/midwifery in last 3 years</li>
                  <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>35 Hours CPD:</strong> Continuing Professional Development (study, training)</li>
                  <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>5 Reflective Accounts:</strong> Written reflections on practice</li>
                  <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Confirmation:</strong> Signed by a colleague (confirmee must have known them for 3+ years)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Fitness to Practise</h2>
              <p className="text-sm text-gray-600 mt-2">NMC procedures for misconduct or capability</p>
            </div>
            <a
              href="https://www.nmc.org.uk/standards/fitness-to-practise/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Fitness to Practise
            </a>
          </div>
          <div className="space-y4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Reasons for Investigation:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Misconduct (breach of The Code)</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Poor clinical performance or capability</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Health concerns affecting practice</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Criminal conviction or caution</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Safeguarding concerns</li>
              </ul>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-900 mb-2">Investigation Process:</h3>
              <ol className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-3"><span className="text-primary font-bold">1.</span> Investigation and assessment by case examiner</li>
                <li className="flex gap-3"><span className="text-primary font-bold">2.</span> Decision: No case to answer, or proceed to hearing</li>
                <li className="flex gap-3"><span className="text-primary font-bold">3.</span> Fitness to Practise Committee hearing (if needed)</li>
                <li className="flex gap-3"><span className="text-primary font-bold">4.</span> Outcome: no action, conditions, suspension, or removal from register</li>
              </ol>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
              <h3 className="font-bold text-red-900 mb-2">Possible Sanctions:</h3>
              <ul className="space-y-1 text-sm text-red-800">
                <li>• No action</li>
                <li>• Caution (3-5 years)</li>
                <li>• Conditions on practice (3 years)</li>
                <li>• Suspension from practice (up to 2 years)</li>
                <li>• Removal from register (permanent)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Standards for Pre-Registration Nursing</h2>
              <p className="text-sm text-gray-600 mt-2">Requirements for student nurses</p>
            </div>
            <a
              href="https://www.nmc.org.uk/standards/standards-for-nurses/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Standards
            </a>
          </div>
          <div className="space-y4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Core Requirements:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> 3-year degree-level programme</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> 2,300 hours learning in university</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> 2,300 hours practice placement in healthcare settings</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Supervised learning with registered nurses/midwives</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Final examination and assessment</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Duty of Candour</h2>
              <p className="text-sm text-gray-600 mt-2">Transparency about errors and concerns</p>
            </div>
          </div>
          <div className="space-y4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-bold text-amber-900 mb-2">Key Requirement:</h3>
              <p className="text-sm text-amber-800">If a care error has caused or could cause moderate or severe harm, the registered professional must inform the person and their family, provide support, and apologise.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Elements of Candour:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Acknowledge the error occurred</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Apologise sincerely</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Explain what happened</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Discuss what will be done to prevent recurrence</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Provide ongoing support</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Continuing Professional Development (CPD)</h2>
              <p className="text-sm text-gray-600 mt-2">Maintaining and updating nursing knowledge</p>
            </div>
          </div>
          <div className="space-y4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">CPD Requirements:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Minimum 35 Hours:</strong> Over 3-year revalidation period</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Range of Activities:</strong> Formal training, reading, mentoring, conferences, etc.</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Relevance:</strong> Related to professional practice</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Documentation:</strong> Keep records of CPD completed</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Check NMC Register</h3>
        <p className="text-sm text-gray-700 mb-4">
          Verify if a nurse or midwife is registered and in good standing:
        </p>
        <a
          href="https://www.nmc.org.uk/registration/the-nmc-register/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Search NMC Register
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Topics</h3>
        <div className="grid gap-4">
          <Link href="/legal/cqc" className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-all">
            <p className="font-medium text-gray-900">CQC Regulations</p>
            <p className="text-sm text-gray-600">Care quality standards and inspections</p>
          </Link>
          <Link href="/legal/safeguarding" className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-all">
            <p className="font-medium text-gray-900">Safeguarding</p>
            <p className="text-sm text-gray-600">Professional duty to protect vulnerable people</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
