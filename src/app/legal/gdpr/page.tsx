import Link from 'next/link';
import { ExternalLink, AlertCircle } from 'lucide-react';

export default function GDPRPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">GDPR & Data Protection</h1>
        <p className="text-gray-600">Protecting personal and health data rights</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 flex gap-4">
        <AlertCircle className="h-6 w-6 text-blue-700 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900 mb-2">Data Protection is a Legal Requirement</h3>
          <p className="text-sm text-blue-800">
            All care providers must comply with UK GDPR. Breaches can result in fines up to £20 million or 4% of annual global turnover, whichever is higher, plus individual rights claims.
          </p>
        </div>
      </div>

      <section className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">UK GDPR</h2>
              <p className="text-sm text-gray-600 mt-2">General Data Protection Regulation (retained EU law)</p>
            </div>
            <a
              href="https://www.legislation.gov.uk/eur/2016/679/contents"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Full Regulation
            </a>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Scope:</h3>
              <p className="text-sm text-gray-700">Applies to all organisations processing personal data of UK residents, regardless of location.</p>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-900 mb-2">Key Concepts:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Personal Data:</strong> Any information about an identified/identifiable individual</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Data Controller:</strong> Determines purposes and means of processing</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Data Processor:</strong> Processes data on behalf of controller</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Data Subject:</strong> The individual whose data is processed</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Data Protection Principles</h2>
              <p className="text-sm text-gray-600 mt-2">Core requirements for lawful data processing</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="border-l-4 border-primary bg-gray-50 p-4">
              <h3 className="font-bold text-gray-900 mb-1">1. Lawfulness, Fairness, Transparency</h3>
              <p className="text-sm text-gray-700">Processing must be lawful with a valid basis. Must be fair to the individual and transparent about how data is used.</p>
            </div>
            <div className="border-l-4 border-primary bg-gray-50 p-4">
              <h3 className="font-bold text-gray-900 mb-1">2. Purpose Limitation</h3>
              <p className="text-sm text-gray-700">Data must be collected for specified, explicit purposes and not reused incompatibly.</p>
            </div>
            <div className="border-l-4 border-primary bg-gray-50 p-4">
              <h3 className="font-bold text-gray-900 mb-1">3. Data Minimization</h3>
              <p className="text-sm text-gray-700">Only collect data that is necessary, relevant, and not excessive for the purpose.</p>
            </div>
            <div className="border-l-4 border-primary bg-gray-50 p-4">
              <h3 className="font-bold text-gray-900 mb-1">4. Accuracy</h3>
              <p className="text-sm text-gray-700">Keep data accurate and up-to-date. Take reasonable steps to correct inaccurate data.</p>
            </div>
            <div className="border-l-4 border-primary bg-gray-50 p-4">
              <h3 className="font-bold text-gray-900 mb-1">5. Storage Limitation</h3>
              <p className="text-sm text-gray-700">Keep data no longer than necessary. Regular deletion and anonymization of old data.</p>
            </div>
            <div className="border-l-4 border-primary bg-gray-50 p-4">
              <h3 className="font-bold text-gray-900 mb-1">6. Integrity and Confidentiality</h3>
              <p className="text-sm text-gray-700">Secure processing against unauthorised access, loss, or damage.</p>
            </div>
            <div className="border-l-4 border-primary bg-gray-50 p-4">
              <h3 className="font-bold text-gray-900 mb-1">7. Accountability</h3>
              <p className="text-sm text-gray-700">Document compliance. Demonstrate adherence to all principles.</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Lawful Basis for Processing</h2>
              <p className="text-sm text-gray-600 mt-2">Why organisations can process personal data</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-1">1. Consent</h3>
              <p className="text-sm text-gray-700">Clear, specific consent given for the purpose. Can be withdrawn anytime.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-1">2. Contract</h3>
              <p className="text-sm text-gray-700">Processing necessary to perform a contract with the individual.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-1">3. Legal Obligation</h3>
              <p className="text-sm text-gray-700">Required by law (e.g., tax, safeguarding, health and safety).</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-1">4. Vital Interests</h3>
              <p className="text-sm text-gray-700">Necessary to protect vital interests (life-or-death situations).</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-1">5. Public Task</h3>
              <p className="text-sm text-gray-700">Required for public task or official authority.</p>
            </div>
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <h3 className="font-bold text-green-900 mb-1">6. Legitimate Interests</h3>
              <p className="text-sm text-green-800">Organisation's interests do not override individual rights. Requires balance test.</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Special Category Data (Health Data)</h2>
              <p className="text-sm text-gray-600 mt-2">Article 9 — Extra protection for sensitive data</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-900"><strong>Article 9 Restriction:</strong> Health data processing is generally prohibited UNLESS one of the special conditions applies.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Permitted Grounds for Health Data:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Explicit Consent:</strong> Clear written consent for health data processing</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Employment Law:</strong> Where required for employment/social security obligations</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Vital Interests:</strong> Necessary to protect life/health in emergencies</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Healthcare/Treatment:</strong> Necessary for healthcare provision by professionals</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Legal Claim:</strong> Necessary for legal claims/defence</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Data Protection Act 2018</h2>
              <p className="text-sm text-gray-600 mt-2">UK supplementary regulations</p>
            </div>
            <a
              href="https://www.legislation.gov.uk/ukpga/2018/12/contents"
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
              <h3 className="font-semibold text-gray-900 mb-2">Key Areas:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Health Data:</strong> Additional safeguards for processing health information</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Genetic Data:</strong> Special protections for genetic information</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Biometric Data:</strong> Restrictions on face recognition and identification</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Immigration Enforcement:</strong> Data sharing with immigration authorities</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Caldicott Principles (Health Data Governance)</h2>
              <p className="text-sm text-gray-600 mt-2">8 principles for confidential health information</p>
            </div>
            <a
              href="https://www.gov.uk/guidance/caldicott-principles"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Guidance
            </a>
          </div>
          <div className="space-y-2 text-sm text-gray-700">
            <p><strong>1.</strong> Justify the purpose of using confidential information</p>
            <p><strong>2.</strong> Don't use personal information unless absolutely necessary</p>
            <p><strong>3.</strong> Use identifiable information only when anonymous data won't do</p>
            <p><strong>4.</strong> Access is on strict "need to know" basis</p>
            <p><strong>5.</strong> Everyone handling data has understood their obligations</p>
            <p><strong>6.</strong> Understand and comply with the law</p>
            <p><strong>7.</strong> The approach is regularly reviewed</p>
            <p><strong>8.</strong> Ensure information quality and secure data handling</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Individual Rights</h2>
              <p className="text-sm text-gray-600 mt-2">What people can do regarding their data</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-1">Right of Access (Subject Access Request)</h3>
              <p className="text-sm text-gray-700">Individuals can request a copy of their personal data. Organisations have 30 days to respond (free, unless request is manifestly unfounded).</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-1">Right to Rectification</h3>
              <p className="text-sm text-gray-700">Correct inaccurate or incomplete personal data.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-1">Right to Erasure ("Right to be Forgotten")</h3>
              <p className="text-sm text-gray-700">Request deletion of personal data (with exceptions for legal obligations).</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-1">Right to Restrict Processing</h3>
              <p className="text-sm text-gray-700">Ask organisation to limit how they use data in certain circumstances.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-1">Right to Data Portability</h3>
              <p className="text-sm text-gray-700">Receive personal data in a structured, portable format or transfer to another organisation.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-1">Right to Object</h3>
              <p className="text-sm text-gray-700">Object to processing, including direct marketing.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-1">Rights Related to Automated Processing</h3>
              <p className="text-sm text-gray-700">Not be subject to decisions based solely on automated processing that significantly affects them.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Protection Officer</h3>
        <p className="text-sm text-gray-700 mb-4">Some organisations must appoint a Data Protection Officer (DPO):</p>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex gap-3"><span className="text-primary font-bold">•</span> Public authorities and bodies</li>
          <li className="flex gap-3"><span className="text-primary font-bold">•</span> Large-scale monitoring of individuals</li>
          <li className="flex gap-3"><span className="text-primary font-bold">•</span> Large-scale processing of special category data (health, etc.)</li>
        </ul>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Information Commissioner's Office (ICO)</h3>
        <p className="text-sm text-gray-700 mb-4">UK's independent data protection authority. Handles complaints and enforces GDPR.</p>
        <a
          href="https://ico.org.uk"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
        >
          Visit ICO Website
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Topics</h3>
        <div className="grid gap-4">
          <Link href="/legal/safeguarding" className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-all">
            <p className="font-medium text-gray-900">Safeguarding</p>
            <p className="text-sm text-gray-600">Protecting vulnerable people and their information</p>
          </Link>
          <Link href="/legal/employment" className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-all">
            <p className="font-medium text-gray-900">Employment Law</p>
            <p className="text-sm text-gray-600">Worker rights and data protection in employment</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
