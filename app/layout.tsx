import type { Metadata } from 'next';
import "./globals.css";
import { AppProvider } from '@/lib/store';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'AI JobPilot — Search Smarter. Apply Better. Grow Faster.',
  description: 'AI JobPilot is an intelligent multi-platform job search and application assistant for students, freshers, and developers. Discover, match, personalize truthfully, and track applications with built-in career roadmaps.',
  keywords: ['AI Job Search', 'Resume Parser', 'Application Copilot', 'Job Tracker', 'Truth Guard', 'Career Roadmap', 'Skill Gap Analysis'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#f5f8ff] text-[#172554] min-h-screen">
        <AppProvider>
          <AppShell>{children}</AppShell>
        </AppProvider>
      </body>
    </html>
  );
}
