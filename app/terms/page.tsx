import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsPage() {
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
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Terms &amp; Conditions</h1>
            <p className="text-xs text-slate-500">Effective: August 2026</p>
          </div>
        </div>

        <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. Service Description</h2>
            <p>
              Resumate AI provides automated resume authoring, formatting, multi-turn AI copywriting, and high-definition PDF export services. Creating, customizing, and previewing CVs is free. High-resolution PDF downloads require a standard payment of 50 BDT per CV.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. User Responsibility</h2>
            <p>
              You are solely responsible for ensuring the truthfulness and accuracy of the information in your CV. Resumate AI facilitates formatting and phrasing assistance but does not verify employment credentials.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. Permanent Paid CV Access</h2>
            <p>
              Once a fee of 50 BDT is paid for a specific CV, that resume remains unlocked permanently for ongoing downloads under your user or guest session.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
