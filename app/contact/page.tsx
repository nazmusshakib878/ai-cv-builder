import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, MessageSquare, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to CV Builder
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Contact &amp; Support</h1>
            <p className="text-xs text-slate-500">We're here to help you get hired</p>
          </div>
        </div>

        <div className="space-y-6 text-sm text-slate-600">
          <p>
            Have questions regarding CV templates, payments, or account data? Reach out to our direct support desk:
          </p>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Support</div>
                <a href="mailto:support@resumate.ai" className="font-bold text-slate-900 hover:text-blue-600">
                  support@resumate.ai
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
              <Clock className="w-5 h-5 text-emerald-600" />
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Response Time</div>
                <div className="font-semibold text-slate-800">Within 2–4 hours (7 days a week)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
