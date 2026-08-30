'use client';

import React from 'react';
import { useResume } from '@/context/ResumeContext';
import { AIChatPanel } from '@/components/ai-chat/AIChatPanel';
import { ResumePreview } from '@/components/preview/ResumePreview';

export const MainWorkspace: React.FC = () => {
  const { activeMobileView } = useResume();

  return (
    <main className="flex-1 flex overflow-hidden relative">
      {/* LEFT PANEL: Clean ChatGPT-style AI Chat (Desktop: 480px to 540px, Mobile: conditional) */}
      <div
        className={`w-full md:w-[460px] lg:w-[500px] xl:w-[540px] flex flex-col h-full bg-white shrink-0 border-r border-slate-200/80 z-10 ${
          activeMobileView === 'preview' ? 'hidden md:flex' : 'flex'
        }`}
      >
        <AIChatPanel />
      </div>

      {/* RIGHT PANEL: Live CV Preview */}
      <div
        className={`flex-1 flex flex-col h-full overflow-hidden ${
          activeMobileView !== 'preview' ? 'hidden md:flex' : 'flex'
        }`}
      >
        <ResumePreview />
      </div>
    </main>
  );
};
