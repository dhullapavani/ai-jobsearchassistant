'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import {
  Search,
  Bell,
  Sparkles,
  UserCheck,
  CheckCircle2,
  Briefcase,
  AlertCircle,
  Clock,
  ChevronDown,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    appMode,
    toggleAppMode,
    aiProviderType,
    profile,
    applications,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsRead,
    resetDemoProfile
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const activeAppCount = applications.filter(
    a => a.status === 'Applied' || a.status === 'Assessment' || a.status === 'Interview'
  ).length;

  return (
    <header className="sticky top-0 z-40 w-full h-16 border-b border-[#dbe7f7] bg-white backdrop-blur-md px-4 md:px-6 flex items-center justify-between gap-4">
      {/* Search Bar */}
      <div className="flex-1 max-w-md relative hidden sm:block">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search jobs, skills, companies (e.g. Java, Optum, AWS)..."
          className="w-full pl-10 pr-4 py-2 text-sm bg-[#f8faff] border border-[#dbe7f7] rounded-xl text-[#172554] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
        />
      </div>

      {/* Center/Right Status Indicators */}
      <div className="flex items-center gap-3 ml-auto">
        {/* DEMO / LIVE DATA Status Indicator & Toggle */}
        <button
          onClick={toggleAppMode}
          title={`Click to switch between Demo and Live Mode (Currently: ${appMode.toUpperCase()} DATA)`}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${
            appMode === 'live'
              ? 'bg-[#FFFBEB] border-amber-500/60 text-[#F59E0B] hover:bg-[#FFFBEB] ring-2 ring-amber-500/20'
              : 'bg-[#ECFDF5] border-emerald-500/50 text-emerald-600 hover:bg-[#ECFDF5] ring-2 ring-emerald-500/20'
          }`}
        >
          <Activity className={`w-3.5 h-3.5 ${appMode === 'live' ? 'text-[#F59E0B] animate-pulse' : 'text-emerald-600'}`} />
          <span>{appMode === 'live' ? 'LIVE DATA' : 'DEMO DATA'}</span>
          <span className="text-[10px] opacity-75 font-normal ml-0.5">({aiProviderType.toUpperCase()})</span>
        </button>

        {/* Target Role Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EEF2FF] border border-indigo-500/30 text-xs font-medium text-indigo-200">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
          <span>Role: {profile.targetRoles[0] || 'Java Developer'}</span>
        </div>

        {/* Active Pipeline Badge */}
        <Link
          href="/applications"
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#f8faff] hover:bg-white/80 border border-[#dbe7f7] text-xs font-medium text-[#172554] transition-colors"
        >
          <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
          <span>In Pipeline: <strong className="text-emerald-600 font-bold">{activeAppCount}</strong></span>
        </Link>

        {/* Truth Guard Status Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#EEF2FF] border border-indigo-500/40 text-[11px] font-semibold text-indigo-600">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
          <span>Truth Guard Active</span>
        </div>

        {/* Notification Center Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-[#475569] hover:text-[#172554] hover:bg-[#f8faff] transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-[#dbe7f7] bg-white shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-[#dbe7f7]">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-indigo-600" />
                  <h3 className="font-semibold text-sm text-[#172554]">Notifications</h3>
                  <span className="text-xs bg-[#EEF2FF] text-indigo-600 px-2 py-0.5 rounded-full">
                    {unreadNotificationCount} new
                  </span>
                </div>
                {unreadNotificationCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-indigo-600 hover:text-indigo-600 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationAsRead(n.id)}
                    className={`p-3 rounded-xl transition-colors cursor-pointer border ${
                      n.read
                        ? 'bg-[#f8faff] border-[#dbe7f7] text-[#64748b]'
                        : 'bg-[#EEF2FF] border-indigo-500/30 text-[#172554]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-semibold text-[#172554]">{n.title}</h4>
                      <span className="text-[10px] text-[#64748b] flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {n.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-[#475569] mt-1 leading-relaxed">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#f8faff] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-[#172554] font-bold text-xs shadow-md ring-2 ring-indigo-500/30">
              {profile.name ? profile.name.split(' ').map(n => n[0]).join('') : 'U'}
            </div>
            <div className="hidden sm:block text-left text-xs">
              <p className="font-semibold text-[#172554] leading-none">{profile.name || 'Alex Kumar'}</p>
              <p className="text-[10px] text-[#64748b] mt-0.5">{profile.title ? profile.title.split('&')[0] : 'Developer'}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#64748b] hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-[#dbe7f7] bg-white shadow-2xl p-2 z-50">
              <div className="px-3 py-2 border-b border-[#dbe7f7] text-xs">
                <p className="font-semibold text-[#172554]">{profile.name || 'Alex Kumar'}</p>
                <p className="text-[#64748b] truncate">{profile.email || 'alex.kumar@example.com'}</p>
              </div>

              <div className="py-1">
                <Link
                  href="/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[#475569] hover:text-[#172554] hover:bg-[#f8faff] transition-colors"
                >
                  <UserCheck className="w-4 h-4 text-indigo-600" />
                  <span>Candidate Profile</span>
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[#475569] hover:text-[#172554] hover:bg-[#f8faff] transition-colors"
                >
                  <Briefcase className="w-4 h-4 text-emerald-600" />
                  <span>Preferences & Settings</span>
                </Link>
                <button
                  onClick={() => {
                    resetDemoProfile();
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[#F59E0B] hover:bg-[#FFFBEB] transition-colors text-left"
                >
                  <AlertCircle className="w-4 h-4 text-[#F59E0B]" />
                  <span>Reset Demo Profile</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
