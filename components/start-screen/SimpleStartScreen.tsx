'use client';

import React, { useRef, useState } from 'react';
import {
  Upload,
  Wand2,
  ArrowRight,
  Sparkles,
  Layers,
  User,
  LogOut,
  CheckCircle2,
  FileText,
  SlidersHorizontal,
  Download,
  Loader2,
} from 'lucide-react';
import { useResume } from '@/context/ResumeContext';

export const SimpleStartScreen: React.FC = () => {
  const {
    startNewCVFlow,
    uploadCVData,
    tellAIAboutMeFlow,
    resumesList,
    setIsMyResumesModalOpen,
    setIsAuthModalOpen,
    currentUser,
    isGuest,
    logout,
    isAiThinking,
  } = useResume();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [tellAIText, setTellAIText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileSelected = async (file: File) => {
    setIsSubmitting(true);
    try {
      await uploadCVData(file);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateFromText = async () => {
    if (!tellAIText.trim() || isSubmitting || isAiThinking) return;
    setIsSubmitting(true);
    try {
      await tellAIAboutMeFlow(tellAIText.trim());
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] flex flex-col justify-between text-slate-900 font-sans antialiased selection:bg-blue-100 selection:text-blue-900 relative">
      {/* =========================================================
          1. TOP BRAND HEADER (Sticky, Clean SaaS floating bar)
         ========================================================= */}
      <header className="w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-base shadow-sm shadow-blue-500/20 ring-2 ring-blue-500/10">
              R
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900">
                Resumate <span className="text-blue-600">AI</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/60">
                v2.0 Pro
              </span>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {resumesList.length > 0 && (
              <button
                onClick={() => setIsMyResumesModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 shadow-2xs transition-all active:scale-98"
              >
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">My CVs</span>
                <span className="text-[10px] bg-blue-100/80 text-blue-800 px-1.5 py-0.2 rounded-full font-bold">
                  {resumesList.length}
                </span>
              </button>
            )}

            {isGuest ? (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition-all active:scale-98"
              >
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>Sign In</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <span className="text-xs font-semibold text-slate-700 max-w-[120px] truncate">
                  {currentUser?.fullName || currentUser?.email?.split('@')[0]}
                </span>
                <button
                  onClick={() => logout()}
                  className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelected(file);
        }}
        accept=".pdf,.docx,.doc,.txt,.jpg,.jpeg,.png"
        className="hidden"
      />

      {/* =========================================================
          2. MAIN HERO & ACTION CARDS CONTAINER
         ========================================================= */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-10 sm:py-14 max-w-5xl mx-auto w-full">
        {/* Hero Title & Subtitle */}
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-10 sm:mb-12 animate-in fade-in zoom-in-98 duration-300">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50/80 text-blue-700 text-xs font-bold border border-blue-200/60 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Resume Builder • 100% Free to Try</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-[1.15]">
            Create your dream CV <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
              in seconds
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto font-normal leading-relaxed">
            Upload your old CV or simply tell AI about yourself. Get an ATS-ready, professional resume ready for job applications.
          </p>
        </div>

        {/* 2 Main Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 w-full max-w-3xl mb-8">
          {/* Option 1: Upload Old CV */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files[0];
              if (file) handleFileSelected(file);
            }}
            onClick={() => !isSubmitting && fileInputRef.current?.click()}
            className={`relative p-7 sm:p-8 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between text-left group bg-white shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 active:translate-y-0 active:scale-[0.99] ${
              isDragging
                ? 'border-blue-600 bg-blue-50/80 ring-4 ring-blue-500/10'
                : 'border-slate-200/90 hover:border-blue-500'
            } ${isSubmitting ? 'pointer-events-none opacity-60' : ''}`}
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-200 shadow-xs">
                <Upload className="w-7 h-7" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Upload Old CV
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed font-normal">
                Have an existing CV? Upload your PDF or Word document and AI will reconstruct it into modern ATS format.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
              <span className="text-slate-400 font-medium text-[11px]">PDF • DOCX • TXT • JPG</span>
              <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Choose File <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Option 2: Create New CV */}
          <div
            onClick={() => !isSubmitting && startNewCVFlow()}
            className={`relative p-7 sm:p-8 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between text-left group bg-white shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 active:translate-y-0 active:scale-[0.99] border-slate-200/90 hover:border-indigo-500 ${
              isSubmitting ? 'pointer-events-none opacity-60' : ''
            }`}
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-200 shadow-xs">
                <Wand2 className="w-7 h-7" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                Create New CV
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed font-normal">
                Starting fresh? AI will ask simple conversational questions to write high-impact achievements and skills.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
              <span className="text-slate-400 font-medium text-[11px]">Interactive AI Writer</span>
              <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Start Fresh <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================
            3. "TELL US ABOUT YOURSELF" AI INPUT BOX
           ========================================================= */}
        <div className="w-full max-w-3xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="h-px flex-1 max-w-[80px] bg-slate-200" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Or simply describe yourself
            </span>
            <div className="h-px flex-1 max-w-[80px] bg-slate-200" />
          </div>

          <div className="w-full bg-white rounded-2xl border-2 border-slate-200/90 shadow-sm focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all p-3 sm:p-4">
            <textarea
              rows={3}
              value={tellAIText}
              onChange={(e) => setTellAIText(e.target.value)}
              disabled={isSubmitting || isAiThinking}
              placeholder="Example: I am a Quality Controller with 4 years of experience in garments. I completed my B.Sc. in Textile Engineering and have expertise in ISO 9001, AQL 2.5 inspection, and fabric sourcing..."
              className="w-full bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none resize-none text-sm sm:text-base leading-relaxed p-2"
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 mt-2">
              <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                <span className="text-blue-600 font-bold">💡 Tip:</span>
                <span>You can write in বাংলা, English or Banglish.</span>
              </div>

              <button
                disabled={!tellAIText.trim() || isSubmitting || isAiThinking}
                onClick={handleGenerateFromText}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 text-white text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95 shrink-0"
              >
                {isSubmitting || isAiThinking ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating your CV...</span>
                  </>
                ) : (
                  <>
                    <span>Create My CV</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================
            4. VISUAL TRUST ROW
           ========================================================= */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>AI-Powered Writing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>100% ATS-Friendly Formats</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Private &amp; Secure</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Unlimited Free Editing</span>
          </div>
        </div>

        {/* =========================================================
            5. COMPACT 3-STEP GUIDE
           ========================================================= */}
        <div className="w-full max-w-3xl mt-12 pt-8 border-t border-slate-200/80">
          <div className="text-center mb-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">How It Works</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200/70 text-center space-y-1.5 shadow-2xs">
              <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center mx-auto mb-2">
                1
              </div>
              <h4 className="text-xs font-bold text-slate-900">Upload or Tell AI</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                Upload your old file or simply describe your job experience.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/70 text-center space-y-1.5 shadow-2xs">
              <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center mx-auto mb-2">
                2
              </div>
              <h4 className="text-xs font-bold text-slate-900">Improve &amp; Customize</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                Chat with AI to tune formatting, spacing, and templates in real time.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/70 text-center space-y-1.5 shadow-2xs">
              <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center mx-auto mb-2">
                3
              </div>
              <h4 className="text-xs font-bold text-slate-900">Download Final PDF</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                Export clean, professional A4 PDF formatted for your target employer.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* =========================================================
          6. SIMPLE CLEAN FOOTER
         ========================================================= */}
      <footer className="w-full border-t border-slate-200/80 bg-white/60 py-4 px-6 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Resumate AI &copy; 2026 — Secure &amp; Private AI Resume Builder</span>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <a href="/privacy" className="hover:text-slate-800 transition-colors">Privacy</a>
            <span>•</span>
            <a href="/terms" className="hover:text-slate-800 transition-colors">Terms</a>
            <span>•</span>
            <a href="/contact" className="hover:text-slate-800 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
