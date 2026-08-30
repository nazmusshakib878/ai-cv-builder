'use client';

import React from 'react';
import { useResume } from '@/context/ResumeContext';
import { ZoomIn, ZoomOut, Maximize2, FileText, CheckCircle2 } from 'lucide-react';

export const ZoomControls: React.FC = () => {
  const { zoomLevel, setZoomLevel, fitZoomToScreen, designConfig } = useResume();

  const zoomPercent = Math.round(zoomLevel * 100);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(1.4, parseFloat((prev + 0.1).toFixed(2))));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(0.4, parseFloat((prev - 0.1).toFixed(2))));
  };

  return (
    <div className="no-print flex items-center justify-between px-4 sm:px-6 py-2.5 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shrink-0 z-10 select-none">
      {/* Page status */}
      <div className="flex items-center gap-2 text-xs">
        <div className="flex items-center gap-1.5 font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
          <FileText className="w-3.5 h-3.5 text-slate-500" />
          <span>Page 1 of 1</span>
        </div>

        {designConfig.onePageMode && (
          <div className="hidden sm:flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg text-xs font-semibold border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>1-Page Fit Active</span>
          </div>
        )}
      </div>

      {/* Zoom controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={handleZoomOut}
          disabled={zoomLevel <= 0.4}
          title="Zoom out"
          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40 transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <span className="text-xs font-bold text-slate-700 w-12 text-center select-none font-mono">
          {zoomPercent}%
        </span>

        <button
          onClick={handleZoomIn}
          disabled={zoomLevel >= 1.4}
          title="Zoom in"
          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40 transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <div className="h-4 w-[1px] bg-slate-200 mx-1" />

        <button
          onClick={fitZoomToScreen}
          title="Fit to screen"
          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs font-semibold"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Fit</span>
        </button>
      </div>
    </div>
  );
};
