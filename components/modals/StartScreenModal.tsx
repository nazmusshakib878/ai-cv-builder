import React, { useState } from 'react';
import { useResume } from '@/context/ResumeContext';
import {
  Upload,
  Sparkles,
  MessageSquare,
  X,
  FileText,
  ArrowRight,
  CheckCircle2,
  Cpu,
  HeartPulse,
  Briefcase,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const StartScreenModal: React.FC = () => {
  const { appMode, activeModal, setActiveModal, uploadCVData, sendMessage, loadProfile, createNewResume } = useResume();
  const [naturalLanguageInput, setNaturalLanguageInput] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && appMode === 'start') {
        setActiveModal('none');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appMode, setActiveModal]);

  if (appMode !== 'start') return null;

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    await uploadCVData(file);
    setIsUploading(false);
    setActiveModal('none');
  };

  const handleNaturalLanguageSubmit = () => {
    if (!naturalLanguageInput.trim()) return;
    sendMessage(`Here is my background: ${naturalLanguageInput.trim()}. Please create a tailored resume structure for me.`);
    setActiveModal('none');
  };

  return (
    <div
      onClick={() => setActiveModal('none')}
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">How would you like to begin?</h2>
              <p className="text-xs text-slate-500">Choose how you want to build your production-ready CV</p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal('none')}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Primary Two Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Option 1: Upload Existing CV */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const file = e.dataTransfer.files[0];
                if (file) handleFileUpload(file);
              }}
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.pdf,.docx,.txt';
                input.onchange = (e: any) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                };
                input.click();
              }}
              className={`p-5 rounded-xl border-2 border-dashed cursor-pointer transition-all flex flex-col items-center text-center justify-between group ${
                dragOver
                  ? 'border-blue-500 bg-blue-50/70'
                  : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50/70'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center text-blue-600 mb-3 transition-colors">
                <Upload className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">1. Upload Existing CV</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Drag & drop PDF or Word file. Our AI instantly extracts experience, education & skills.
                </p>
              </div>
              <span className="mt-3 text-xs font-semibold text-blue-600 group-hover:underline inline-flex items-center gap-1">
                {isUploading ? 'Parsing document...' : 'Upload & Parse CV'} <ArrowRight className="w-3 h-3" />
              </span>
            </div>

            {/* Option 2: Create CV with AI */}
            <div
              onClick={() => {
                createNewResume();
                setActiveModal('none');
              }}
              className="p-5 rounded-xl border-2 border-slate-200 hover:border-purple-400 hover:bg-purple-50/30 cursor-pointer transition-all flex flex-col items-center text-center justify-between group"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center text-purple-600 mb-3 transition-colors">
                <Sparkles className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">2. Create CV with AI</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Build a brand new resume from scratch with AI step-by-step guidance & STAR bullet generator.
                </p>
              </div>
              <span className="mt-3 text-xs font-semibold text-purple-600 group-hover:underline inline-flex items-center gap-1">
                Start Fresh with AI <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* Option 3: Tell AI About Yourself (Natural Language Input) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-slate-700" />
              <label className="font-bold text-slate-900 text-xs">
                Or Tell AI About Yourself (Natural Language)
              </label>
            </div>
            <textarea
              rows={3}
              value={naturalLanguageInput}
              onChange={(e) => setNaturalLanguageInput(e.target.value)}
              placeholder="e.g., I am a Staff Distributed Systems Engineer with 8 years of experience building high-throughput microservices in Go and Rust at scale..."
              className="w-full p-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
            />
            <div className="flex items-center justify-between mt-2.5">
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <span className="text-slate-400">Quick load profiles:</span>
                <button
                  type="button"
                  onClick={() => {
                    loadProfile('tech-architect');
                    setActiveModal('none');
                  }}
                  className="text-blue-600 hover:underline font-medium"
                >
                  AI Architect
                </button>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={() => {
                    loadProfile('healthcare-pro');
                    setActiveModal('none');
                  }}
                  className="text-emerald-600 hover:underline font-medium"
                >
                  Healthcare Specialist
                </button>
              </div>

              <Button
                size="sm"
                variant="brand"
                disabled={!naturalLanguageInput.trim()}
                onClick={handleNaturalLanguageSubmit}
                icon={<Sparkles className="w-3.5 h-3.5" />}
              >
                Generate Resume
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
