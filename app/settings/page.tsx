'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Settings,
  ShieldCheck,
  Cpu,
  Database,
  Trash2,
  Download,
  RotateCcw,
  CheckCircle2,
  Lock,
  Bell,
  Activity,
  FileText,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

export default function SettingsPage() {
  const {
    appMode,
    setAppMode,
    aiProviderType,
    setAiProviderType,
    profile,
    applications,
    savedAnswers,
    resetDemoProfile,
    deleteResume,
    clearApplicationHistory,
    clearAnswerMemory,
    deleteAllUserData,
    addToast
  } = useApp();

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [browserNotifications, setBrowserNotifications] = useState(true);

  const handleExportWorkspace = () => {
    const data = {
      appMode,
      aiProvider: aiProviderType,
      profile,
      applications,
      savedAnswers,
      exportTimestamp: new Date().toISOString()
    };
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', jsonStr);
    dlAnchorElem.setAttribute('download', `ai_jobpilot_backup_${new Date().toISOString().split('T')[0]}.json`);
    dlAnchorElem.click();
    addToast({
      type: 'success',
      title: 'Data Exported',
      message: 'Complete workspace JSON exported to your downloads.'
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#172554] flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-[#4F46E5]" />
            <span>Platform Settings & Privacy</span>
          </h1>
          <p className="text-xs text-[#64748b] mt-1">
            Configure system mode, AI providers, Truth Guard policy rules, and manage or purge personal data
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* System Mode: Demo vs Live */}
        <div className="p-6 rounded-3xl bg-white border border-[#dbe7f7] backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#172554] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#10B981]" />
              <span>Operation Mode</span>
            </h2>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                appMode === 'live'
                  ? 'bg-[#FFFBEB] text-[#F59E0B] border-amber-600/50'
                  : 'bg-[#ECFDF5] text-[#10B981] border-emerald-600/50'
              }`}
            >
              {appMode === 'live' ? 'LIVE DATA' : 'DEMO DATA'}
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <label
              onClick={() => setAppMode('demo')}
              className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-colors ${
                appMode === 'demo'
                  ? 'bg-[#ECFDF5] border-emerald-500/50 text-[#172554]'
                  : 'bg-[#f5f8ff] border-[#dbe7f7] text-[#64748b]'
              }`}
            >
              <input type="radio" name="mode" checked={appMode === 'demo'} onChange={() => {}} className="mt-0.5 accent-emerald-500" />
              <div>
                <div className="font-bold text-[#172554] flex items-center gap-1.5">
                  <span>Demo Mode</span>
                  <span className="text-[10px] bg-[#ECFDF5] text-[#10B981] px-1.5 py-0.5 rounded border border-emerald-800">
                    No API Keys Required
                  </span>
                </div>
                <p className="text-[11px] text-[#64748b] mt-1">
                  Uses realistic mock jobs and deterministic AI responses. Perfect for evaluations, presentations, and fast testing.
                </p>
              </div>
            </label>

            <label
              onClick={() => setAppMode('live')}
              className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-colors ${
                appMode === 'live'
                  ? 'bg-[#FFFBEB] border-amber-500/50 text-[#172554]'
                  : 'bg-[#f5f8ff] border-[#dbe7f7] text-[#64748b]'
              }`}
            >
              <input type="radio" name="mode" checked={appMode === 'live'} onChange={() => {}} className="mt-0.5 accent-amber-500" />
              <div>
                <div className="font-bold text-[#172554] flex items-center gap-1.5">
                  <span>Live Production Mode</span>
                  <span className="text-[10px] bg-[#FFFBEB] text-[#F59E0B] px-1.5 py-0.5 rounded border border-amber-800">
                    Permitted Sources Only
                  </span>
                </div>
                <p className="text-[11px] text-[#64748b] mt-1">
                  Connects to configured live AI providers and official job sources. Never silently falls back to fake data.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* AI Provider Selection */}
        <div className="p-6 rounded-3xl bg-white border border-[#dbe7f7] backdrop-blur-md space-y-4">
          <h2 className="text-base font-bold text-[#172554] flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span>AI Provider & LLM Engine</span>
          </h2>

          <div className="space-y-2 text-xs">
            <label
              onClick={() => setAiProviderType('mock')}
              className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-colors ${
                aiProviderType === 'mock'
                  ? 'bg-[#EEF2FF] border-indigo-500/50 text-[#172554]'
                  : 'bg-[#f5f8ff] border-[#dbe7f7] text-[#64748b]'
              }`}
            >
              <input type="radio" name="ai" checked={aiProviderType === 'mock'} onChange={() => {}} className="mt-0.5 accent-indigo-500" />
              <div>
                <div className="font-bold text-[#172554] flex items-center gap-1.5">
                  <span>Deterministic Mock AI Provider</span>
                  <span className="text-[10px] bg-[#ECFDF5] text-[#10B981] px-1.5 py-0.2 rounded border border-emerald-800">
                    Recommended
                  </span>
                </div>
                <p className="text-[11px] text-[#64748b] mt-0.5">
                  High-fidelity deterministic engine ensuring truthful results without API costs or quota limits.
                </p>
              </div>
            </label>

            <label
              onClick={() => setAiProviderType('gemini')}
              className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-colors ${
                aiProviderType === 'gemini'
                  ? 'bg-[#EEF2FF] border-indigo-500/50 text-[#172554]'
                  : 'bg-[#f5f8ff] border-[#dbe7f7] text-[#64748b]'
              }`}
            >
              <input type="radio" name="ai" checked={aiProviderType === 'gemini'} onChange={() => {}} className="mt-0.5 accent-indigo-500" />
              <div>
                <div className="font-bold text-[#172554]">Google Gemini 1.5 / 2.0 Pro</div>
                <p className="text-[11px] text-[#64748b] mt-0.5">
                  Uses server-side <code className="text-[#4F46E5] bg-[#f8faff] px-1 py-0.5 rounded">GEMINI_API_KEY</code> environment variable.
                </p>
              </div>
            </label>

            <label
              onClick={() => setAiProviderType('openai')}
              className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-colors ${
                aiProviderType === 'openai'
                  ? 'bg-[#EEF2FF] border-indigo-500/50 text-[#172554]'
                  : 'bg-[#f5f8ff] border-[#dbe7f7] text-[#64748b]'
              }`}
            >
              <input type="radio" name="ai" checked={aiProviderType === 'openai'} onChange={() => {}} className="mt-0.5 accent-indigo-500" />
              <div>
                <div className="font-bold text-[#172554]">OpenAI GPT-4o / GPT-4o-mini</div>
                <p className="text-[11px] text-[#64748b] mt-0.5">
                  Uses server-side <code className="text-[#4F46E5] bg-[#f8faff] px-1 py-0.5 rounded">OPENAI_API_KEY</code> environment variable.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Truth Guard Enforcement */}
        <div className="p-6 rounded-3xl bg-white border border-[#dbe7f7] backdrop-blur-md space-y-4">
          <h2 className="text-base font-bold text-[#172554] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            <span>Truth Guard Compliance Policy</span>
          </h2>

          <div className="p-4 rounded-2xl bg-[#f5f8ff] border border-[#dbe7f7] space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#172554]">Strict Hallucination Prevention</span>
              <span className="text-xs text-[#10B981] font-semibold">Active & Enforced</span>
            </div>
            <p className="text-[11px] text-[#64748b] leading-relaxed">
              Every candidate assertion is classified into 4 verified tiers (VERIFIED, INFERRED, USER CONFIRMATION REQUIRED, UNSUPPORTED).
              Sensitive facts (work authorization, visa, salary, years of experience) are NEVER fabricated by the AI.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] bg-[#ECFDF5] text-[#10B981] px-2 py-0.5 rounded border border-emerald-800">VERIFIED</span>
              <span className="text-[10px] bg-[#EEF2FF] text-[#4F46E5] px-2 py-0.5 rounded border border-indigo-800">INFERRED</span>
              <span className="text-[10px] bg-[#FFFBEB] text-[#F59E0B] px-2 py-0.5 rounded border border-amber-800">CONFIRMATION REQUIRED</span>
              <span className="text-[10px] bg-red-950/80 text-red-300 px-2 py-0.5 rounded border border-red-800">UNSUPPORTED (BLOCKED)</span>
            </div>
          </div>
        </div>

        {/* Privacy & Data Controls */}
        <div className="p-6 rounded-3xl bg-white border border-[#dbe7f7] backdrop-blur-md space-y-4">
          <h2 className="text-base font-bold text-[#172554] flex items-center gap-2">
            <Database className="w-4 h-4 text-[#06B6D4]" />
            <span>Privacy & Data Management</span>
          </h2>

          <div className="space-y-2.5 text-xs">
            <button
              onClick={handleExportWorkspace}
              className="w-full py-2.5 px-4 rounded-xl bg-[#f8faff] hover:bg-white text-[#172554] font-semibold flex items-center justify-center gap-2 transition-colors border border-[#dbe7f7]"
            >
              <Download className="w-3.5 h-3.5 text-[#4F46E5]" />
              <span>Export My Data (JSON Backup)</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={clearApplicationHistory}
                className="py-2 px-3 rounded-xl bg-[#f5f8ff] hover:bg-[#f8faff] text-[#475569] font-medium flex items-center justify-center gap-1.5 transition-colors border border-[#dbe7f7] text-[11px]"
              >
                <Trash2 className="w-3 h-3 text-[#64748b]" />
                <span>Clear Applications</span>
              </button>

              <button
                onClick={clearAnswerMemory}
                className="py-2 px-3 rounded-xl bg-[#f5f8ff] hover:bg-[#f8faff] text-[#475569] font-medium flex items-center justify-center gap-1.5 transition-colors border border-[#dbe7f7] text-[11px]"
              >
                <Trash2 className="w-3 h-3 text-[#64748b]" />
                <span>Clear Answer Memory</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={deleteResume}
                className="py-2 px-3 rounded-xl bg-[#FFFBEB] hover:bg-[#FFFBEB] text-[#F59E0B] font-medium flex items-center justify-center gap-1.5 transition-colors border border-amber-800/40 text-[11px]"
              >
                <FileText className="w-3 h-3 text-[#F59E0B]" />
                <span>Delete Resume</span>
              </button>

              <button
                onClick={resetDemoProfile}
                className="py-2 px-3 rounded-xl bg-[#EEF2FF] hover:bg-[#EEF2FF] text-[#4F46E5] font-medium flex items-center justify-center gap-1.5 transition-colors border border-indigo-800/40 text-[11px]"
              >
                <RotateCcw className="w-3 h-3 text-[#4F46E5]" />
                <span>Reset Demo State</span>
              </button>
            </div>

            <button
              onClick={deleteAllUserData}
              className="w-full py-2.5 px-4 rounded-xl bg-red-950/30 hover:bg-red-950/60 text-red-300 font-semibold flex items-center justify-center gap-2 transition-colors border border-red-800/40 text-xs mt-1"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span>Delete All My Data (Full Wipe)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
