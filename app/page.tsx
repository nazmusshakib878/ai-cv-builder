'use client';

import React from 'react';
import { useResume } from '@/context/ResumeContext';
import { SimpleStartScreen } from '@/components/start-screen/SimpleStartScreen';
import { TopToolbar } from '@/components/layout/TopToolbar';
import { MainWorkspace } from '@/components/layout/MainWorkspace';
import { DesignPanel } from '@/components/design-panel/DesignPanel';
import { PaymentModal } from '@/components/modals/PaymentModal';
import { MyResumesModal } from '@/components/modals/MyResumesModal';
import { AuthModal } from '@/components/modals/AuthModal';

export default function HomePage() {
  const { appMode } = useResume();

  if (appMode === 'start') {
    return (
      <>
        <SimpleStartScreen />
        <MyResumesModal />
        <AuthModal />
      </>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-[#f8fafc] overflow-hidden text-slate-900 font-sans antialiased">
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        {/* Simplified Top Toolbar: Back, CV Name, My CVs, Saved status, Change Design, Download PDF */}
        <TopToolbar />

        {/* Two-Panel Workspace: Left AI Chat, Right Live CV Preview */}
        <MainWorkspace />

        {/* Change Design / More Options Slide-Out Drawer */}
        <DesignPanel />

        {/* Modals */}
        <PaymentModal />
        <MyResumesModal />
        <AuthModal />
      </div>
    </div>
  );
}
