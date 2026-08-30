'use client';

import React from 'react';
import { useResume } from '@/context/ResumeContext';
import {
  ArrowLeft,
  Palette,
  Download,
  Eye,
  MessageSquare,
  Sparkles,
  Layers,
  Check,
  Loader2,
  User,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const TopToolbar: React.FC = () => {
  const {
    resumeData,
    updateResumeData,
    setAppMode,
    isDesignPanelOpen,
    setIsDesignPanelOpen,
    setIsMyResumesModalOpen,
    setIsAuthModalOpen,
    currentUser,
    isGuest,
    logout,
    resumesList,
    saveStatus,
    exportToPDF,
    activeMobileView,
    setActiveMobileView,
    paymentStatus,
  } = useResume();

  return (
    <header className="no-print h-16 bg-white border-b border-slate-200/80 px-3 sm:px-6 flex items-center justify-between shrink-0 z-30 select-none">
      {/* Left: Back Button, My CVs, & CV Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Back Button */}
        <button
          onClick={() => setAppMode('start')}
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
          title="Back to start screen"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </button>

        <div className="h-5 w-[1px] bg-slate-200" />

        {/* My CVs Switcher Button */}
        <button
          onClick={() => setIsMyResumesModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100/80 hover:bg-slate-200/80 hover:text-slate-900 transition-colors shrink-0 border border-slate-200/60"
          title="Switch or manage multiple CVs"
        >
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden md:inline">My CVs</span>
          {resumesList.length > 0 && (
            <span className="text-[10px] bg-white px-1.5 py-0.2 rounded-full border border-slate-200 font-bold text-slate-600">
              {resumesList.length}
            </span>
          )}
        </button>

        {/* CV Title Input */}
        <div className="flex items-center gap-1.5 min-w-0">
          <input
            type="text"
            value={resumeData.title}
            onChange={(e) => updateResumeData({ title: e.target.value })}
            className="font-bold text-xs sm:text-sm md:text-base text-slate-900 bg-transparent hover:bg-slate-100/70 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 rounded-lg px-2 py-1 truncate max-w-[110px] sm:max-w-[200px] md:max-w-[280px] transition-colors"
            title="Click to rename CV"
          />
        </div>

        {/* Quiet Auto-Save Status */}
        <div className="hidden lg:flex items-center gap-1 text-[11px] font-medium text-slate-400 pl-1">
          {saveStatus === 'saving' ? (
            <span className="inline-flex items-center gap-1 text-slate-400">
              <Loader2 className="w-3 h-3 animate-spin" />
              Saving...
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-emerald-600">
              <Check className="w-3 h-3 text-emerald-600" />
              Saved
            </span>
          )}
        </div>
      </div>

      {/* Center: Mobile Switcher (Chat vs Preview) */}
      <div className="flex md:hidden items-center bg-slate-100 p-0.5 rounded-xl text-xs">
        <button
          onClick={() => setActiveMobileView('chat')}
          className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-colors ${
            activeMobileView === 'chat' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
          }`}
        >
          <MessageSquare className="w-3 h-3" />
          <span>Chat</span>
        </button>
        <button
          onClick={() => setActiveMobileView('preview')}
          className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-colors ${
            activeMobileView === 'preview' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
          }`}
        >
          <Eye className="w-3 h-3" />
          <span>Preview</span>
        </button>
      </div>

      {/* Right: User/Auth, Change Design & Download PDF */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Account / Guest Button */}
        {isGuest ? (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Sign in to save CVs permanently"
          >
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span>Sign In</span>
          </button>
        ) : (
          <div className="hidden sm:flex items-center gap-2">
            <span
              className="text-xs font-semibold text-slate-700 truncate max-w-[100px]"
              title={currentUser?.email}
            >
              {currentUser?.fullName || currentUser?.email?.split('@')[0]}
            </span>
            <button
              onClick={() => logout()}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Log out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Change Design / More Options */}
        <button
          onClick={() => setIsDesignPanelOpen(!isDesignPanelOpen)}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
            isDesignPanelOpen
              ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs ring-2 ring-blue-500/20'
              : 'border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
          }`}
          title="Change template, colors, font & layout"
        >
          <Palette className="w-4 h-4 text-blue-600" />
          <span className="hidden sm:inline">Change Design</span>
        </button>

        {/* Download PDF / Payment Gate */}
        <Button
          size="md"
          variant="primary"
          onClick={exportToPDF}
          icon={<Download className="w-4 h-4" />}
          className={`rounded-xl shadow-sm font-bold text-xs sm:text-sm px-3 sm:px-4 py-2 ${
            paymentStatus === 'unlocked' ? '' : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
        >
          <span>{paymentStatus === 'unlocked' ? 'Download PDF' : 'Download CV — ৳50'}</span>
        </Button>
      </div>
    </header>
  );
};
