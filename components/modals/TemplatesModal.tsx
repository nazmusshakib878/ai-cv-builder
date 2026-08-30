import React, { useState } from 'react';
import { useResume } from '@/context/ResumeContext';
import { TEMPLATES_CONFIG } from '@/data/templatePresets';
import { TemplateType } from '@/types/resume';
import { X, Check, Layout, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const TemplatesModal: React.FC = () => {
  const { activeModal, setActiveModal, designConfig, updateDesignConfig } = useResume();
  const [activeFilter, setActiveFilter] = useState<string>('All');

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeModal === 'templates') {
        setActiveModal('none');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, setActiveModal]);

  if (activeModal !== 'templates') return null;

  const categories = ['All', 'ATS Friendly', 'Modern', 'Minimalist', 'Executive', 'Specialized'];

  const filteredTemplates =
    activeFilter === 'All'
      ? TEMPLATES_CONFIG
      : TEMPLATES_CONFIG.filter((t) => t.category === activeFilter);

  const handleSelectTemplate = (templateId: TemplateType) => {
    updateDesignConfig({ template: templateId });
    setActiveModal('none');
  };

  return (
    <div
      onClick={() => setActiveModal('none')}
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Resume Template Gallery</h2>
              <p className="text-xs text-slate-500">Pick from 6 battle-tested, ATS-optimized layouts</p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal('none')}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filters */}
        <div className="px-6 py-2.5 border-b border-slate-100 bg-white flex gap-2 overflow-x-auto shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeFilter === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredTemplates.map((tmpl) => {
            const isSelected = designConfig.template === tmpl.id;
            return (
              <div
                key={tmpl.id}
                onClick={() => handleSelectTemplate(tmpl.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between group ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20 shadow-md'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-subtle bg-white'
                }`}
              >
                <div>
                  {/* Miniature Visual Mock Preview */}
                  <div className="h-32 rounded-lg bg-slate-100 border border-slate-200/70 p-3 mb-3 flex flex-col justify-between relative overflow-hidden group-hover:scale-[1.02] transition-transform">
                    <div className="h-1.5 w-12 rounded" style={{ backgroundColor: tmpl.thumbnailColor }} />
                    <div className="space-y-1.5 opacity-60">
                      <div className="h-1 bg-slate-400 rounded w-3/4" />
                      <div className="h-1 bg-slate-300 rounded w-1/2" />
                      <div className="h-1 bg-slate-300 rounded w-full" />
                    </div>
                    <div className="h-1 bg-slate-300 rounded w-2/3 opacity-40" />

                    {isSelected && (
                      <div className="absolute top-2 right-2 p-1 rounded-full bg-blue-600 text-white shadow">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-sm">{tmpl.name}</h3>
                    {tmpl.badge && (
                      <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                        {tmpl.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{tmpl.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Best for: {tmpl.category}</span>
                  <Button size="xs" variant={isSelected ? 'brand' : 'secondary'}>
                    {isSelected ? 'Selected' : 'Use Template'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
