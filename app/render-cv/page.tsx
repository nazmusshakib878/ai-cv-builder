'use client';

import React, { useEffect, useState } from 'react';
import { NationalProTemplate } from '@/components/preview/templates/NationalProTemplate';
import { InternationalProTemplate } from '@/components/preview/templates/InternationalProTemplate';
import { MultinationalCorpTemplate } from '@/components/preview/templates/MultinationalCorpTemplate';
import { GermanLebenslaufTemplate } from '@/components/preview/templates/GermanLebenslaufTemplate';
import { NordicEuropeTemplate } from '@/components/preview/templates/NordicEuropeTemplate';
import { AustraliaNZTemplate } from '@/components/preview/templates/AustraliaNZTemplate';
import { EuropassStyleTemplate } from '@/components/preview/templates/EuropassStyleTemplate';
import { GlobalATSTemplate } from '@/components/preview/templates/GlobalATSTemplate';
import { ResumeData, DesignConfig } from '@/types/resume';

export default function RenderCVPage() {
  const [data, setData] = useState<{ resumeData: ResumeData; config: DesignConfig } | null>(null);

  useEffect(() => {
    // Listen for the event dispatched by Playwright
    const handleDataReady = () => {
      const resumeData = (window as any).__INJECTED_RESUME_DATA__;
      const config = (window as any).__INJECTED_CONFIG__;
      if (resumeData && config) {
        setData({ resumeData, config });
      }
    };

    window.addEventListener('resume-data-ready', handleDataReady);

    // Check if it's already there (race condition mitigation)
    if ((window as any).__INJECTED_RESUME_DATA__) {
      handleDataReady();
    }

    return () => window.removeEventListener('resume-data-ready', handleDataReady);
  }, []);

  if (!data) {
    return <div className="p-8">Preparing PDF...</div>;
  }

  const renderTemplate = () => {
    switch (data.config.template) {
      case 'national-pro':
        return <NationalProTemplate data={data.resumeData} design={data.config} />;
      case 'international-pro':
        return <InternationalProTemplate data={data.resumeData} design={data.config} />;
      case 'multinational-corp':
      case 'corporate':
      case 'executive':
        return <MultinationalCorpTemplate data={data.resumeData} design={data.config} />;
      case 'german-lebenslauf':
        return <GermanLebenslaufTemplate data={data.resumeData} design={data.config} />;
      case 'nordic-europe':
      case 'minimal':
        return <NordicEuropeTemplate data={data.resumeData} design={data.config} />;
      case 'australia-nz':
        return <AustraliaNZTemplate data={data.resumeData} design={data.config} />;
      case 'europass-style':
        return <EuropassStyleTemplate data={data.resumeData} design={data.config} />;
      case 'global-ats':
      case 'ats-classic':
      case 'healthcare':
      case 'modern-pro':
      default:
        if (data.config.template === 'global-ats' || data.config.template === 'ats-classic') {
          return <GlobalATSTemplate data={data.resumeData} design={data.config} />;
        }
        return <NationalProTemplate data={data.resumeData} design={data.config} />;
    }
  };

  return (
    <div className="bg-white" style={{ width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}>
      {renderTemplate()}
    </div>
  );
}
