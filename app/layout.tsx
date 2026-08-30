import type { Metadata } from 'next';
import './globals.css';
import { ResumeProvider } from '@/context/ResumeContext';

export const metadata: Metadata = {
  title: 'Resumate AI — Production-Grade AI CV & Resume Builder',
  description:
    'Build high-impact, ATS-optimized, executive and modern resumes in minutes with your personal AI co-pilot and real-time A4 live preview.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-900 overflow-hidden font-sans">
        <ResumeProvider>{children}</ResumeProvider>
      </body>
    </html>
  );
}
