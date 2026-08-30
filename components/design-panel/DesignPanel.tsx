'use client';

import React from 'react';
import { useResume } from '@/context/ResumeContext';
import { TEMPLATES_CONFIG, ACCENT_COLORS, FONT_OPTIONS } from '@/data/templatePresets';
import { TemplateType, FontFamilyType, FontSizeType, SpacingType } from '@/types/resume';
import {
  X,
  Palette,
  Check,
  FileCheck,
  CheckCircle2,
  Sliders,
} from 'lucide-react';

export const DesignPanel: React.FC = () => {
  const { isDesignPanelOpen, setIsDesignPanelOpen, designConfig, updateDesignConfig } = useResume();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDesignPanelOpen) {
        setIsDesignPanelOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDesignPanelOpen, setIsDesignPanelOpen]);

  if (!isDesignPanelOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        onClick={() => setIsDesignPanelOpen(false)}
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-[1px] z-40 transition-opacity"
      />

      {/* Drawer */}
      <div className="no-print fixed inset-y-0 right-0 w-full sm:w-[400px] bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col transition-all duration-300 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Customize Design</h2>
              <p className="text-xs text-slate-500">Pick templates, colors, fonts and spacing</p>
            </div>
          </div>

          <button
            onClick={() => setIsDesignPanelOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* 1. Templates */}
          <div>
            <label className="block font-bold text-slate-900 mb-2.5 text-xs uppercase tracking-wider">
              Choose CV Style
            </label>
            <div className="grid grid-cols-2 gap-3">
              {TEMPLATES_CONFIG.map((tmpl) => {
                const isSelected = designConfig.template === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    onClick={() => updateDesignConfig({ template: tmpl.id })}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: tmpl.thumbnailColor }} />
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                      </div>
                      <div className="font-bold text-slate-900 text-xs">{tmpl.name}</div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{tmpl.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. One-Page Fit */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50/60 border border-blue-200 flex items-center justify-between">
            <div>
              <div className="font-bold text-blue-950 flex items-center gap-1.5 text-xs">
                <FileCheck className="w-4 h-4 text-blue-600" />
                <span>Fit on 1 Page</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Automatically adjusts spacing so your CV fits neatly on one single page.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-3">
              <input
                type="checkbox"
                checked={designConfig.onePageMode}
                onChange={(e) => {
                  const checked = e.target.checked;
                  updateDesignConfig({
                    onePageMode: checked,
                    lineSpacing: checked ? 'compact' : 'normal',
                    sectionSpacing: checked ? 'compact' : 'normal',
                    fontSize: checked ? 'sm' : 'base',
                  });
                }}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* 3. Accent Color */}
          <div>
            <label className="block font-bold text-slate-900 mb-2.5 text-xs uppercase tracking-wider">
              Accent Color
            </label>
            <div className="grid grid-cols-4 gap-2.5">
              {ACCENT_COLORS.map((col) => {
                const isSelected = designConfig.accentColor.toLowerCase() === col.hex.toLowerCase();
                return (
                  <button
                    key={col.hex}
                    onClick={() => updateDesignConfig({ accentColor: col.hex })}
                    title={col.name}
                    className={`h-10 rounded-xl flex items-center justify-center transition-all ${
                      isSelected ? 'ring-2 ring-offset-2 ring-slate-900 scale-105 shadow-sm' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: col.hex }}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white drop-shadow" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Font Style */}
          <div>
            <label className="block font-bold text-slate-900 mb-2.5 text-xs uppercase tracking-wider">
              Font Style
            </label>
            <div className="space-y-2">
              {FONT_OPTIONS.map((font) => {
                const isSelected = designConfig.fontFamily === font.id;
                return (
                  <button
                    key={font.id}
                    onClick={() => updateDesignConfig({ fontFamily: font.id as FontFamilyType })}
                    className={`w-full px-4 py-2.5 rounded-xl border text-left flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 font-bold text-blue-950'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className={`text-sm ${font.familyClass}`}>{font.name}</span>
                    {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Spacing Density */}
          <div>
            <label className="block font-bold text-slate-900 mb-2.5 text-xs uppercase tracking-wider">
              Spacing Density
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['compact', 'normal', 'relaxed'] as SpacingType[]).map((spacing) => (
                <button
                  key={spacing}
                  onClick={() => updateDesignConfig({ lineSpacing: spacing, sectionSpacing: spacing })}
                  className={`py-2 rounded-xl border text-center font-semibold capitalize transition-colors text-xs ${
                    designConfig.lineSpacing === spacing
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {spacing}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex justify-end">
          <button
            onClick={() => setIsDesignPanelOpen(false)}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </>
  );
};
