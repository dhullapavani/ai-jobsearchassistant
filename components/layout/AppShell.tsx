'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { ToastContainer } from '../common/ToastContainer';
import {
  LayoutDashboard,
  Search,
  FileText,
  Bot,
  KanbanSquare,
  BarChart3
} from 'lucide-react';

export const AppShell: React.FC<{ children: ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  if (isLandingPage) {
    return (
      <div className="min-h-screen bg-[#f5f8ff] text-[#172554] flex flex-col selection:bg-indigo-500 selection:text-white">
        {children}
        <ToastContainer />
      </div>
    );
  }

  const mobileNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Jobs', href: '/jobs', icon: Search },
    { name: 'Resume', href: '/resume', icon: FileText },
    { name: 'Copilot', href: '/copilot', icon: Bot },
    { name: 'Tracker', href: '/applications', icon: KanbanSquare },
    { name: 'Skills', href: '/skills', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-[#f5f8ff] text-[#172554] flex flex-col md:flex-row bg-gradient-mesh selection:bg-indigo-500 selection:text-white">
      {/* Sidebar for Desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-16 md:pb-0">
        <Navbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#dbe7f7] backdrop-blur-lg flex items-center justify-around py-2 px-1">
        {mobileNavItems.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-medium transition-colors ${
                isActive ? 'text-[#4F46E5] font-semibold' : 'text-[#64748b] hover:text-[#172554]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Reactive Toasts */}
      <ToastContainer />
    </div>
  );
};
