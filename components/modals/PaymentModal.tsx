'use client';

import React, { useState } from 'react';
import { useResume } from '@/context/ResumeContext';
import { CheckCircle2, Loader2, X, Download, ShieldCheck, FileCheck2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const PaymentModal: React.FC = () => {
  const {
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    paymentStatus,
    exportToPDF,
    resumeData,
  } = useResume();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isPaymentModalOpen) return null;

  const isPaid = paymentStatus === 'unlocked';

  const handleBkashCheckout = async () => {
    try {
      setIsProcessing(true);
      setErrorMessage(null);

      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId: resumeData.id }),
      });

      const data = await res.json();

      if (data.alreadyPaid) {
        setIsProcessing(false);
        exportToPDF();
        return;
      }

      if (data.bkashURL) {
        window.location.href = data.bkashURL;
        return;
      }

      throw new Error(data.error || 'Could not initiate bKash payment');
    } catch (err: any) {
      console.error('Checkout error:', err);
      setIsProcessing(false);
      setErrorMessage(err.message || 'Payment initiation failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200 text-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Resumate Pro</span>
          </div>
          <button
            onClick={() => setIsPaymentModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 pt-2 text-center space-y-5">
          {isPaid ? (
            /* =========================================================
               PAID STATE: "Payment Successful ✅" -> [ Download CV ]
               ========================================================= */
            <div className="space-y-5 py-3">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-9 h-9 text-emerald-600" />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 flex items-center justify-center gap-1.5">
                  <span>Payment Successful</span>
                  <span className="text-emerald-600">✅</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Your CV download is permanently unlocked.
                </p>
              </div>

              <Button
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 text-sm rounded-2xl shadow-md flex items-center justify-center gap-2"
                onClick={() => {
                  exportToPDF();
                  setIsPaymentModalOpen(false);
                }}
              >
                <Download className="w-4 h-4" />
                Download CV
              </Button>
            </div>
          ) : (
            /* =========================================================
               UNPAID STATE: "Your CV is Ready ✅" -> [ Pay ৳50 with bKash ]
               ========================================================= */
            <div className="space-y-5 py-2">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
                <FileCheck2 className="w-8 h-8 text-blue-600" />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 flex items-center justify-center gap-1.5">
                  <span>Your CV is Ready</span>
                  <span className="text-emerald-600">✅</span>
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  Download Professional PDF
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
                <div className="text-3xl font-black text-slate-900">৳50</div>
                <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                  One-time payment • Lifetime edits free
                </div>
              </div>

              {errorMessage && (
                <div className="p-2.5 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
                  {errorMessage}
                </div>
              )}

              <Button
                disabled={isProcessing}
                className="w-full bg-[#E2136E] hover:bg-[#c70f61] text-white font-bold h-12 text-sm rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                onClick={handleBkashCheckout}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connecting to bKash...</span>
                  </>
                ) : (
                  <span>Pay ৳50 with bKash</span>
                )}
              </Button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Encrypted 256-bit Secure bKash Gateway</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
