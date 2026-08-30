import React, { useState } from 'react';
import { useResume } from '@/context/ResumeContext';
import {
  Sparkles,
  FileText,
  PlusCircle,
  Layout,
  ShieldCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  User,
  ExternalLink,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export const AppSidebar: React.FC = () => {
  const { resumeData, setActiveModal, createNewResume, loadProfile } = useResume();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState<boolean>(false);

  return (
    <aside
      className={`no-print bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col justify-between transition-all duration-300 shrink-0 z-20 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand & Logo Header */}
      <div>
        <div className="p-4 flex items-center justify-between border-b border-slate-800/80">
          {!isCollapsed ? (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-glow">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-sm text-white tracking-tight flex items-center gap-1.5">
                  Resumate AI
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded">
                    PRO
                  </span>
                </span>
                <p className="text-[10px] text-slate-400">AI Resume Architecture</p>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 mx-auto rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-glow">
              <Sparkles className="w-4 h-4" />
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors hidden md:inline-flex"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="p-3 space-y-1 text-xs">
          {/* New Resume Action */}
          <button
            onClick={() => setActiveModal('start')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition-all active:scale-[0.98] ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
            title="Create New Resume"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>New Resume</span>}
          </button>

          <div className="pt-2" />

          {/* My Resumes / Active Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors ${
                isCollapsed ? 'justify-center px-0' : ''
              }`}
              title="My Resumes"
            >
              <div className="flex items-center gap-3 truncate">
                <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                {!isCollapsed && <span className="font-medium truncate">My Resumes</span>}
              </div>
              {!isCollapsed && <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
            </button>

            {/* Quick Profile Switcher Submenu */}
            {isProfileDropdownOpen && !isCollapsed && (
              <div className="mt-1 ml-4 pl-3 border-l border-slate-700 space-y-1 py-1">
                <button
                  onClick={() => {
                    loadProfile('tech-architect');
                    setIsProfileDropdownOpen(false);
                  }}
                  className="w-full text-left py-1 text-[11px] text-slate-300 hover:text-white truncate"
                >
                  • AI Architect Resume (Active)
                </button>
                <button
                  onClick={() => {
                    loadProfile('healthcare-pro');
                    setIsProfileDropdownOpen(false);
                  }}
                  className="w-full text-left py-1 text-[11px] text-slate-400 hover:text-white truncate"
                >
                  • Clinical Director CV
                </button>
              </div>
            )}
          </div>

          {/* Templates Gallery */}
          <button
            onClick={() => setActiveModal('templates')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
            title="Templates Gallery"
          >
            <Layout className="w-4 h-4 text-purple-400 shrink-0" />
            {!isCollapsed && <span>Templates Gallery</span>}
          </button>

          {/* Job Match / ATS Analyzer */}
          <button
            onClick={() => setActiveModal('ats-match')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
            title="ATS Job Match"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            {!isCollapsed && (
              <div className="flex items-center justify-between w-full">
                <span>Job Match & ATS</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 rounded">
                  94%
                </span>
              </div>
            )}
          </button>

          {/* Settings */}
          <button
            onClick={() => setActiveModal('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
            title="Settings"
          >
            <Settings className="w-4 h-4 text-slate-400 shrink-0" />
            {!isCollapsed && <span>Settings</span>}
          </button>
        </div>
      </div>

      {/* User Footer / Pro Card */}
      <div className="p-3 border-t border-slate-800">
        {!isCollapsed ? (
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                AM
              </div>
              <div className="truncate">
                <div className="font-semibold text-white text-xs truncate">
                  {resumeData.personalInfo.fullName}
                </div>
                <div className="text-[10px] text-slate-400 truncate">Unlimited AI Plan</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 mx-auto rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
            AM
          </div>
        )}
      </div>
    </aside>
  );
};
