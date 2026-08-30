'use client';

import React, { useRef, useState } from 'react';
import { Upload, Wand2, ArrowRight, Sparkles, Layers, User, LogOut } from 'lucide-react';
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
  } = useResume();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [tellAIText, setTellAIText] = useState('');

  const handleFileSelected = async (file: File) => {
    await uploadCVData(file);
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] flex flex-col items-center justify-between p-6 text-slate-900 font-sans antialiased selection:bg-blue-100 relative">
      {/* Top Bar on Start Screen */}
      <div className="w-full max-w-5xl flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-sm">
            R
          </div>
          <span className="font-bold text-base tracking-tight text-slate-900">Resumate AI</span>
        </div>

        <div className="flex items-center gap-3">
          {resumesList.length > 0 && (
            <button
              onClick={() => setIsMyResumesModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-xs transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>My CVs</span>
              <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded-full border border-blue-200 font-bold">
                {resumesList.length}
              </span>
            </button>
          )}

          {isGuest ? (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-xs transition-colors"
            >
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>Sign In</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700">
                {currentUser?.fullName || currentUser?.email?.split('@')[0]}
              </span>
              <button
                onClick={() => logout()}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

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

      <div className="max-w-3xl w-full flex flex-col items-center text-center space-y-10 my-auto animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold border border-blue-100 shadow-sm">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>AI Resume Builder</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Create your dream CV in seconds
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto font-medium">
            Just talk to AI, and your CV gets created automatically.
          </p>
        </div>

        {/* 2 Large Option Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
          {/* 1. Upload Old CV */}
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
            onClick={() => fileInputRef.current?.click()}
            className={`p-8 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center text-center justify-between group shadow-sm hover:shadow-md ${
              isDragging
                ? 'border-blue-500 bg-blue-50/80 scale-[1.02]'
                : 'border-slate-200 hover:border-blue-500 bg-white hover:bg-blue-50/20'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Upload Old CV
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Have an existing CV? Upload it and AI will make it modern.
              </p>
            </div>
          </div>

          {/* 2. Create New CV */}
          <div
            onClick={startNewCVFlow}
            className="p-8 rounded-2xl border-2 border-slate-200 hover:border-purple-500 bg-white hover:bg-purple-50/20 cursor-pointer transition-all flex flex-col items-center text-center justify-between group shadow-sm hover:shadow-md"
          >
            <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Wand2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                Create New CV
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Starting fresh? AI will ask you simple questions and write it.
              </p>
            </div>
          </div>
        </div>

        {/* Text Area for Direct Input */}
        <div className="w-full max-w-2xl mx-auto space-y-4 pt-4">
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-slate-200" />
            <span className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Or tell us about yourself</span>
            <div className="h-px w-12 bg-slate-200" />
          </div>

          <div className="w-full relative shadow-sm rounded-2xl bg-white border-2 border-slate-200 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all">
            <textarea
              rows={3}
              value={tellAIText}
              onChange={(e) => setTellAIText(e.target.value)}
              placeholder="Example: I am a teacher with 4 years of experience. I know English and Math..."
              className="w-full p-5 rounded-2xl bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none resize-none text-base"
            />
            <div className="absolute right-3 bottom-3">
              <button
                disabled={!tellAIText.trim()}
                onClick={() => tellAIAboutMeFlow(tellAIText.trim())}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 disabled:opacity-40 disabled:hover:bg-slate-900 text-white text-sm font-bold transition-colors shadow-sm flex items-center gap-2 active:scale-95"
              >
                <span>Generate</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="py-2 text-xs text-slate-400">
        Resumate AI &copy; 2026 — Secure &amp; Private CV Builder
      </div>
    </div>
  );
};
