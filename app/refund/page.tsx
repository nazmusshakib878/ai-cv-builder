import React from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCcw } from 'lucide-react';

export default function RefundPolicyPage() {
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
          <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600">
            <RefreshCcw className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Refund Policy</h1>
            <p className="text-xs text-slate-500">100% Satisfaction Guarantee</p>
          </div>
        </div>

        <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. Instant Digital Delivery &amp; Fair Refunds</h2>
            <p>
              Because CV PDF downloads are delivered immediately upon payment, all purchases are generally non-refundable once the file is downloaded. However, if a technical error prevents your PDF from downloading or if formatting is defective, we issue full refunds or re-renderings.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. How to Request a Refund</h2>
            <p>
              Email{' '}
              <a href="mailto:support@resumate.ai" className="text-blue-600 font-semibold underline">
                support@resumate.ai
              </a>{' '}
              with your bKash Transaction ID (TrxID) and resume title. Refunds are processed back to your original bKash wallet within 2–3 business days.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
