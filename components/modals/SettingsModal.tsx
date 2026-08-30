import React from 'react';
import { useResume } from '@/context/ResumeContext';
import { X, Settings, Download, ShieldCheck, Globe, Moon, FileText, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const SettingsModal: React.FC = () => {
  const { activeModal, setActiveModal, exportToPDF } = useResume();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeModal === 'settings') {
        setActiveModal('none');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, setActiveModal]);

  if (activeModal !== 'settings') return null;

  return (
    <div
      onClick={() => setActiveModal('none')}
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">App Preferences & Settings</h2>
              <p className="text-xs text-slate-500">Configure export, formatting, and ATS parser preferences</p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal('none')}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {/* Export Settings */}
          <div className="space-y-2">
            <label className="font-bold text-slate-900 block text-xs uppercase tracking-wider">
              Document Export Standards
            </label>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-bold text-slate-900">A4 High-Fidelity Vector PDF</div>
                  <div className="text-[11px] text-slate-500">Standard international sizing (210 × 297mm)</div>
                </div>
              </div>
              <span className="text-[11px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-medium">Default</span>
            </div>
          </div>

          {/* ATS Compliance Rules */}
          <div className="space-y-2">
            <label className="font-bold text-slate-900 block text-xs uppercase tracking-wider">
              ATS Parser Compatibility
            </label>
            <div className="space-y-1.5">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-700">Auto-convert headers to standard ontology</span>
                <span className="text-emerald-600 font-bold">Enabled</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-700">Avoid complex non-parseable table nested tags</span>
                <span className="text-emerald-600 font-bold">Enabled</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end gap-2">
          <Button size="sm" variant="secondary" onClick={() => setActiveModal('none')}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};
