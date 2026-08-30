'use client';

import React from 'react';
import { useResume } from '@/context/ResumeContext';
import { NationalProTemplate } from './templates/NationalProTemplate';
import { InternationalProTemplate } from './templates/InternationalProTemplate';
import { MultinationalCorpTemplate } from './templates/MultinationalCorpTemplate';
import { GermanLebenslaufTemplate } from './templates/GermanLebenslaufTemplate';
import { NordicEuropeTemplate } from './templates/NordicEuropeTemplate';
import { AustraliaNZTemplate } from './templates/AustraliaNZTemplate';
import { EuropassStyleTemplate } from './templates/EuropassStyleTemplate';
import { GlobalATSTemplate } from './templates/GlobalATSTemplate';
import { ZoomControls } from './ZoomControls';

export const ResumePreview: React.FC = () => {
  const { resumeData, designConfig, zoomLevel } = useResume();

  const renderTemplate = () => {
    switch (designConfig.template) {
      // 8 Professional Template Types
      case 'national-pro':
        return <NationalProTemplate data={resumeData} design={designConfig} />;
      case 'international-pro':
        return <InternationalProTemplate data={resumeData} design={designConfig} />;
      case 'multinational-corp':
      case 'corporate':
      case 'executive':
        return <MultinationalCorpTemplate data={resumeData} design={designConfig} />;
      case 'german-lebenslauf':
        return <GermanLebenslaufTemplate data={resumeData} design={designConfig} />;
      case 'nordic-europe':
      case 'minimal':
        return <NordicEuropeTemplate data={resumeData} design={designConfig} />;
      case 'australia-nz':
        return <AustraliaNZTemplate data={resumeData} design={designConfig} />;
      case 'europass-style':
        return <EuropassStyleTemplate data={resumeData} design={designConfig} />;
      case 'global-ats':
      case 'ats-classic':
        return <GlobalATSTemplate data={resumeData} design={designConfig} />;
      case 'healthcare':
      case 'modern-pro':
      default:
        return <NationalProTemplate data={resumeData} design={designConfig} />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-100/70 overflow-hidden relative">
      {/* Top Zoom & Page Toolbar */}
      <ZoomControls />

      {/* Scrollable Viewport with A4 Sheet */}
      <div className="preview-viewport flex-1 overflow-y-auto overflow-x-auto p-4 sm:p-8 flex justify-center items-start">
        <div
          className="relative transition-transform duration-150 ease-out origin-top my-2"
          style={{
            transform: `scale(${zoomLevel})`,
            marginBottom: `${Math.max(20, 297 * (zoomLevel - 1) + 40)}mm`,
          }}
        >
          {/* Printable A4 Paper Container */}
          <div
            id="resume-a4-document"
            className="a4-sheet resume-paper-shadow border border-slate-200/80 rounded-sm overflow-hidden text-slate-900"
          >
            {renderTemplate()}
          </div>
        </div>
      </div>
    </div>
  );
};
