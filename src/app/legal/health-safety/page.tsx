import Link from 'next/link';
import { ExternalLink, AlertCircle } from 'lucide-react';

export default function HealthSafetyPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Health & Safety</h1>
        <p className="text-gray-600">Workplace safety requirements and obligations</p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex gap-4">
        <AlertCircle className="h-6 w-6 text-red-700 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-red-900 mb-2">Duty of Care</h3>
          <p className="text-sm text-red-800">
            Employers have a legal duty to protect the health and safety of employees and service users. Breaches can result in prosecution, fines up to £20 million, and imprisonment for directors.
          </p>
        </div>
      </div>

      <section className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Health and Safety at Work Act 1974</h2>
              <p className="text-sm text-gray-600 mt-2">Core framework for workplace health and safety</p>
            </div>
            <a
              href="https://www.legislation.gov.uk/ukpga/1974/37/contents"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              View Act
            </a>
          </div>
          <div className="space-y4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Section 2 — Employer Duties:</h3>
              <p className="text-sm text-gray-700 mb-3">Ensure health and safety of employees and others affected by work:</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Safe systems of work</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Safe plant and equipment</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Safe handling of materials and substances</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Sufficient information, instruction, training, and supervision</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Safe working environment and facilities</li>
              </ul>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-900 mb-2">Section 7 — Employee Duties:</h3>
              <p className="text-sm text-gray-700 mb-2">Employees must:</p>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Take reasonable care of themselves and others</li>
                <li>• Cooperate with health and safety arrangements</li>
                <li>• Report hazards and accidents</li>
                <li>• Not misuse safety equipment</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">COSHH Regulations 2002</h2>
              <p className="text-sm text-gray-600 mt-2">Control of Substances Hazardous to Health</p>
            </div>
            <a
              href="https://www.legislation.gov.uk/uksi/2002/2677/contents/made"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              View Regulations
            </a>
          </div>
          <div className="space-y4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Scope:</h3>
              <p className="text-sm text-gray-700 mb-3">Covers hazardous substances used in care settings, including:</p>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Cleaning chemicals, disinfectants</li>
                <li>• Medications and injections</li>
                <li>• Biological hazards (blood-borne pathogens, etc.)</li>
                <li>• Dust and fumes</li>
              </ul>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-900 mb-2">Employer Requirements:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Identify hazardous substances used</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Assess risks from exposure</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Provide Control Measures (elimination, substitution, engineering controls, PPE)</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Health Surveillance where necessary</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Information and training</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Keep Safety Data Sheets (SDS) for all substances</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Manual Handling Operations Regulations 1992</h2>
              <p className="text-sm text-gray-600 mt-2">Safe lifting and moving procedures</p>
            </div>
            <a
              href="https://www.legislation.gov.uk/uksi/1992/2793/contents/made"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              View Regulations
            </a>
          </div>
          <div className="space-y4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Hierarchy of Control:</h3>
              <ol className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-3"><span className="text-primary font-bold">1.</span> <strong>Avoid:</strong> Eliminate need for manual handling where possible</li>
                <li className="flex gap-3"><span className="text-primary font-bold">2.</span> <strong>Assess:</strong> Risk assessment of all manual handling tasks</li>
                <li className="flex gap-3"><span className="text-primary font-bold">3.</span> <strong>Reduce:</strong> Minimise force, frequency, and distance</li>
                <li className="flex gap-3"><span className="text-primary font-bold">4.</span> <strong>Use Equipment:</strong> Hoists, slides, turning sheets</li>
                <li className="flex gap-3"><span className="text-primary font-bold">5.</span> <strong>Train:</strong> Proper manual handling techniques</li>
              </ol>
            </div>
            <div className="border-t border-gray-200 pt-4 bg-blue-50 rounded-lg p-4">
              <h3 className="font-bold text-blue-900 mb-2">Safe Lifting Principles (RAMP):</h3>
              <ul className="space-y-1 text-sm text-blue-800">
                <li><strong>R</strong>aise your awareness — observe surroundings</li>
                <li><strong>A</strong>ssess the load and situation</li>
                <li><strong>M</strong>ake a plan before lifting</li>
                <li><strong>P</strong>erfect technique — straight back, bend knees, firm grip</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">RIDDOR (Reporting of Injuries, Diseases and Dangerous Occurrences)</h2>
              <p className="text-sm text-gray-600 mt-2">Mandatory incident reporting</p>
            </div>
            <a
              href="https://www.legislation.gov.uk/uksi/2013/735/contents/made"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              View Regulations
            </a>
          </div>
          <div className="space-y4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-bold text-red-900 mb-2">When to Report (Immediately):</h3>
              <ul className="space-y-1 text-sm text-red-800">
                <li>• Death (regardless of cause)</li>
                <li>• Specified serious injuries (fractures, loss of consciousness, etc.)</li>
                <li>• Injuries causing inability to work for 7+ consecutive days</li>
                <li>• Occupational diseases (COSHH-related illnesses, etc.)</li>
                <li>• Dangerous occurrences (near misses with potential serious outcomes)</li>
              </ul>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-900 mb-2">How to Report:</h3>
              <p className="text-sm text-gray-700 mb-2">Report to the Health and Safety Executive (HSE):</p>
              <ul className="space-y2 text-sm text-gray-700">
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Online: report.hse.gov.uk (immediate/written)</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Phone: HSE hotline for serious incidents</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Timeline: Immediately for serious; within 7 days for other injuries</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Infection Prevention and Control</h2>
              <p className="text-sm text-gray-600 mt-2">NICE guidance and best practice</p>
            </div>
            <a
              href="https://www.nice.org.uk/guidance/cng139"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              NICE Guidance
            </a>
          </div>
          <div className="space-y4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Key Principles:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Hand Hygiene:</strong> Regular handwashing (alcohol gels insufficient for some infections)</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>PPE:</strong> Appropriate protective equipment (gloves, masks, aprons, eye protection)</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Cleaning:</strong> Regular disinfection of equipment and surfaces</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Waste Management:</strong> Safe disposal of clinical and contaminated waste</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Sharps Safety:</strong> Safe needle and blade handling; disposal</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Vaccinations:</strong> Staff vaccines (HBV, seasonal flu, etc.)</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Outbreak Management:</strong> Procedures for infectious disease outbreaks</li>
              </ul>
            </div>
            <div className="border-t border-gray-200 pt-4 bg-amber-50 rounded-lg p-4">
              <h3 className="font-bold text-amber-900 mb-2">Post-Exposure Incident:</h3>
              <p className="text-sm text-amber-800">If exposed to bloodborne pathogen (needlestick, splash), report immediately, seek first aid, and get baseline testing (HIV, HBV, HCV).</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Risk Assessment</h2>
              <p className="text-sm text-gray-600 mt-2">Core health and safety requirement</p>
            </div>
          </div>
          <div className="space-y4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-blue-900 mb-2">5 Steps to Risk Assessment:</h3>
              <ol className="space-y-2 text-sm text-blue-800">
                <li className="flex gap-3"><span className="text-primary font-bold">1.</span> Identify hazards (what could cause harm)</li>
                <li className="flex gap-3"><span className="text-primary font-bold">2.</span> Identify who is at risk (employees, service users, visitors)</li>
                <li className="flex gap-3"><span className="text-primary font-bold">3.</span> Evaluate the risk (likelihood and severity)</li>
                <li className="flex gap-3"><span className="text-primary font-bold">4.</span> Control measures (eliminate or reduce the risk)</li>
                <li className="flex gap-3"><span className="text-primary font-bold">5.</span> Review (regularly update assessment)</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Health and Safety Representative Rights</h2>
              <p className="text-sm text-gray-600 mt-2">Worker representation and union rights</p>
            </div>
          </div>
          <div className="space-y4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Representatives Can:</h3>
              <ul className="space-y2 text-sm text-gray-700">
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Investigate accidents and ill-health</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Inspect the workplace regularly</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Attend safety committee meetings</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Investigate complaints from members</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Make representations to the employer</li>
                <li className="flex gap-3"><span className="text-primary font-bold">•</span> Liaise with HSE inspectors</li>
              </ul>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-700"><strong>Protection:</strong> Representatives cannot be victimised for exercising their rights.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">HSE Enforcement</h3>
        <div className="space-y4 text-sm text-gray-700">
          <p>The Health and Safety Executive (HSE) enforces health and safety law through:</p>
          <ul className="space-y2">
            <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Inspections:</strong> Planned and reactive inspections of workplaces</li>
            <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Notices:</strong> Improvement notices (14+ days) and prohibition notices (immediate)</li>
            <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Prosecutions:</strong> Against companies and/or directors for violations</li>
            <li className="flex gap-3"><span className="text-primary font-bold">•</span> <strong>Penalties:</strong> Fines up to £20 million and unlimited liability</li>
          </ul>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Topics</h3>
        <div className="grid gap-4">
          <Link href="/legal/employment" className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-all">
            <p className="font-medium text-gray-900">Employment Law</p>
            <p className="text-sm text-gray-600">Worker rights and protections</p>
          </Link>
          <Link href="/legal/cqc" className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-all">
            <p className="font-medium text-gray-900">CQC Regulations</p>
            <p className="text-sm text-gray-600">Care quality standards and safe systems</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
