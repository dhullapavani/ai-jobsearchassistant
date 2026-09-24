'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Search,
  Sparkles,
  FileText,
  Bot,
  KanbanSquare,
  BarChart3,
  Compass,
  TrendingUp,
  User,
  Settings,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useApp } from '@/lib/store';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { rawJobCount, applications, skillGaps } = useApp();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Find Jobs', href: '/jobs', icon: Search, badge: `${rawJobCount}` },
    { name: 'Recommended Jobs', href: '/jobs?view=recommended', icon: Sparkles, highlight: true },
    { name: 'Resume Intelligence', href: '/resume', icon: FileText },
    { name: 'Application Copilot', href: '/copilot', icon: Bot, badge: 'AI' },
    { name: 'Applications', href: '/applications', icon: KanbanSquare, badge: `${applications.length}` },
    { name: 'Skill Gap', href: '/skills', icon: BarChart3, badge: `${skillGaps.length}` },
    { name: 'Career Roadmap', href: '/roadmap', icon: Compass },
    { name: 'Job Market Insights', href: '/insights', icon: TrendingUp },
  ];

  const bottomItems = [
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-[#dbe7f7] bg-white flex flex-col justify-between hidden md:flex h-screen sticky top-0 z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#dbe7f7]">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-[#172554]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-[#172554]">
                AI JobPilot
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-600 border border-indigo-500/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-[#64748b] font-medium">Search Smarter. Apply Better.</p>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[11px] font-semibold text-[#64748b] uppercase tracking-wider">
          Core Platform
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href.includes('?') && pathname === item.href.split('?')[0]);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-[#EEF2FF] text-[#2563EB] border border-[#dbe7f7] shadow-sm font-semibold'
                  : 'text-[#64748b] hover:text-[#172554] hover:bg-[#f8faff]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 flex-shrink-0 transition-colors ${
                    isActive ? 'text-indigo-600' : 'text-[#64748b] group-hover:text-[#172554]'
                  }`}
                />
                <span className="truncate">{item.name}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.badge === 'AI'
                      ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-[#172554]'
                      : isActive
                      ? 'bg-indigo-500/30 text-indigo-600'
                      : 'bg-[#f8faff] text-[#64748b]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="pt-4 px-3 py-1.5 text-[11px] font-semibold text-[#64748b] uppercase tracking-wider">
          Account & Preferences
        </div>

        {bottomItems.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-[#EEF2FF] text-[#2563EB] border border-[#dbe7f7] font-semibold'
                  : 'text-[#64748b] hover:text-[#172554] hover:bg-[#f8faff]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-[#64748b] group-hover:text-[#172554]'}`} />
                <span>{item.name}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-[#64748b] transition-colors" />
            </Link>
          );
        })}
      </div>

      {/* Safety & Compliance Footer */}
      <div className="p-4 border-t border-[#dbe7f7] bg-[#f5f8ff]/40">
        <div className="p-3 rounded-xl bg-white border border-[#dbe7f7] text-[11px]">
          <div className="flex items-center gap-1.5 text-[#10B981] font-semibold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Truth Guard Guarantee</span>
          </div>
          <p className="text-[#64748b] leading-tight">
            Applications are verified against profile evidence. Zero fabricated claims.
          </p>
        </div>
      </div>
    </aside>
  );
};
