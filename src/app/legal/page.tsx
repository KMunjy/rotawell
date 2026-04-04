'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, ExternalLink, Scale, Shield, Briefcase, Database, FileCheck, Users, AlertTriangle, Megaphone } from 'lucide-react';

interface LegalSection {
  title: string;
  year: number;
  icon: React.ReactNode;
  keyPoints: string[];
  externalLink: string;
  href: string;
}

const sections: LegalSection[] = [
  {
    title: 'Employment Law',
    year: 1996,
    icon: <Briefcase className="h-5 w-5" />,
    keyPoints: [
      'Employment Rights Act 1996 — statutory employment protections',
      'Working Time Regulations 1998 — maximum 48-hour week (averaged), 11-hour daily rest, 1 day weekly rest',
      'National Minimum Wage Act 1998 — £12.71/hr (April 2026)',
      'Agency Workers Regulations 2010 — equal treatment after 12 weeks',
      'IR35 Off-payroll Working Rules — deemed employment status for contracts',
    ],
    externalLink: 'https://www.gov.uk/employment-contracts-and-conditions',
    href: '/legal/employment',
  },
  {
    title: 'CQC Regulations',
    year: 2014,
    icon: <Scale className="h-5 w-5" />,
    keyPoints: [
      'Health and Social Care Act 2008 (Regulated Activities) Regulations 2014 — fundamental requirements',
      '5 Key Questions: Safe, Effective, Caring, Responsive, Well-led',
      'Registration with CQC mandatory for all regulated activities',
      'Inspection framework with unannounced monitoring',
      'Ratings: Outstanding, Good, Requires Improvement, Inadequate',
    ],
    externalLink: 'https://www.cqc.org.uk/guidance-providers',
    href: '/legal/cqc',
  },
  {
    title: 'Safeguarding',
    year: 2014,
    icon: <Shield className="h-5 w-5" />,
    keyPoints: [
      'Care Act 2014 — Section 42 safeguarding enquiries mandatory for adults at risk',
      '6 Safeguarding Principles: Empowerment, Prevention, Proportionality, Protection, Partnership, Accountability',
      'Mental Capacity Act 2005 — decision-making for those lacking capacity',
      'Deprivation of Liberty Safeguards (DoLS) / Liberty Protection Safeguards (LPS)',
      'Modern Slavery Act 2015 — due diligence and reporting obligations',
    ],
    externalLink: 'https://www.gov.uk/guidance/care-act-2014-part-1',
    href: '/legal/safeguarding',
  },
  {
    title: 'GDPR & Data Protection',
    year: 2018,
    icon: <Database className="h-5 w-5" />,
    keyPoints: [
      'UK GDPR (retained EU law) — data protection requirements',
      'Data Protection Act 2018 — supplementary UK requirements',
      'Caldicott Principles (8 principles) — health data governance',
      'Information Commissioner\'s Office (ICO) — regulatory authority',
      'Article 9 lawful basis required for health data processing',
    ],
    externalLink: 'https://ico.org.uk/for-organisations/uk-gdpr/',
    href: '/legal/gdpr',
  },
  {
    title: 'Right to Work',
    year: 2006,
    icon: <FileCheck className="h-5 w-5" />,
    keyPoints: [
      'Immigration, Asylum and Nationality Act 2006 — illegal working offences',
      'Right to Work checks — List A (historical documents) and List B (ongoing)',
      'Digital right to work checks via GOV.UK system',
      'Employer penalties: up to £60,000 per worker (from Feb 2024)',
      'Employers must keep records and conduct reasonable checks',
    ],
    externalLink: 'https://www.gov.uk/guidance/right-to-work-checks',
    href: '/legal/right-to-work',
  },
  {
    title: 'NMC Standards',
    year: 2015,
    icon: <Users className="h-5 w-5" />,
    keyPoints: [
      'The Code: Professional standards of practice and behaviour for nurses',
      'Revalidation every 3 years: 450 practice hours, 35 CPD hours, 5 reflective accounts',
      'Fitness to practise procedures for misconduct',
      'Standards for pre-registration nursing programmes (RN training)',
      'Duty of candour — transparency about errors and concerns',
    ],
    externalLink: 'https://www.nmc.org.uk/standards/',
    href: '/legal/nmc',
  },
  {
    title: 'Health & Safety',
    year: 1974,
    icon: <AlertTriangle className="h-5 w-5" />,
    keyPoints: [
      'Health and Safety at Work Act 1974 — employer duty of care',
      'COSHH Regulations 2002 — hazardous substance management',
      'Manual Handling Operations Regulations 1992 — safe lifting procedures',
      'RIDDOR — Reporting of Injuries, Diseases and Dangerous Occurrences (notifiable)',
      'Infection Prevention and Control (IPC) Standards — NICE guidance',
    ],
    externalLink: 'https://www.hse.gov.uk/care-home/',
    href: '/legal/health-safety',
  },
  {
    title: 'Whistleblowing',
    year: 1998,
    icon: <Megaphone className="h-5 w-5" />,
    keyPoints: [
      'Public Interest Disclosure Act 1998 — protects workers speaking up',
      'CQC whistleblowing guidance for reporting concerns',
      'Freedom to Speak Up Guardian role in all NHS trusts and trusts',
      'Protection from dismissal for protected disclosures',
      'Investigation routes: internal, regulator, legal authority',
    ],
    externalLink: 'https://www.cqc.org.uk/guidance-regulation/freedom-speak-and-whistleblowing',
    href: '/legal/whistleblowing',
  },
];

export default function LegalPage() {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (title: string) => {
    setExpandedSections((prev) =>
      prev.includes(title)
        ? prev.filter((s) => s !== title)
        : [...prev, title]
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">UK Care Sector Legal Reference Guide</h2>
        <p className="text-gray-600 mb-4">
          A comprehensive resource covering key legislation affecting UK care workers, providers, and facilities. This guide provides essential information about employment law, safeguarding, CQC regulations, data protection, and professional standards.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>Note:</strong> This information is for reference only and not a substitute for professional legal advice. Always consult with qualified legal professionals regarding specific compliance requirements.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.title} className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors">
            <button
              onClick={() => toggleSection(section.title)}
              className="w-full flex items-center justify-between px-6 py-4 bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="text-primary">{section.icon}</div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">{section.title}</h3>
                  <p className="text-sm text-gray-500">{section.year} legislation</p>
                </div>
              </div>
              {expandedSections.includes(section.title) ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </button>

            {expandedSections.includes(section.title) && (
              <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Key Points:</h4>
                    <ul className="space-y-2">
                      {section.keyPoints.map((point, idx) => (
                        <li key={idx} className="flex gap-3 text-sm text-gray-700">
                          <span className="text-primary font-bold">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <Link
                      href={section.href}
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      Read full details
                      <ChevronUp className="h-4 w-4 rotate-180" />
                    </Link>
                    <a
                      href={section.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 ml-4 transition-colors"
                    >
                      View on official source
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Resources</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <a href="https://www.gov.uk/" target="_blank" rel="noopener noreferrer" className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-all">
            <p className="font-medium text-gray-900">UK Government</p>
            <p className="text-sm text-gray-600">Official legislation and statutory instruments</p>
          </a>
          <a href="https://www.cqc.org.uk/" target="_blank" rel="noopener noreferrer" className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-all">
            <p className="font-medium text-gray-900">Care Quality Commission</p>
            <p className="text-sm text-gray-600">Care standards and inspection framework</p>
          </a>
          <a href="https://www.nmc.org.uk/" target="_blank" rel="noopener noreferrer" className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-all">
            <p className="font-medium text-gray-900">Nursing & Midwifery Council</p>
            <p className="text-sm text-gray-600">Nursing professional standards</p>
          </a>
          <a href="https://ico.org.uk/" target="_blank" rel="noopener noreferrer" className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-all">
            <p className="font-medium text-gray-900">Information Commissioner's Office</p>
            <p className="text-sm text-gray-600">Data protection and privacy guidance</p>
          </a>
        </div>
      </div>
    </div>
  );
}
