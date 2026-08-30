import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Trash2, Lock } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to CV Builder
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Privacy Policy</h1>
            <p className="text-xs text-slate-500">Last updated: August 2026</p>
          </div>
        </div>

        <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. Data Ownership &amp; Privacy First</h2>
            <p>
              Your Curriculum Vitae (CV) belongs exclusively to you. Resumate AI does not sell, license, or share your personal contact details, work history, or academic records with third-party advertisers or recruitment agencies without your explicit consent.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. Information We Process</h2>
            <p>
              When you use our service, we securely process the information you provide (name, email, phone, experiences, education, and optional photo) solely for rendering CV previews, executing AI assistant commands, and generating downloadable PDFs.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. Your Right to Delete Data</h2>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-slate-700">
              <Trash2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900 text-xs">Complete Data Deletion</p>
                <p className="text-xs text-slate-600 mt-0.5">
                  You can permanently delete any CV directly from the "My CVs" manager. Deleting a CV immediately erases all associated text, design configurations, version history, and chat messages from our database.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">4. Payment Security</h2>
            <p>
              Payments are processed through PCI-DSS compliant payment gateways (bKash Merchant Gateway). Resumate AI never sees, collects, or stores your PIN or financial credentials.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">5. Contact</h2>
            <p>
              If you have any questions or data deletion requests, contact our privacy officer at{' '}
              <a href="mailto:support@resumate.ai" className="text-blue-600 font-semibold underline">
                support@resumate.ai
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
