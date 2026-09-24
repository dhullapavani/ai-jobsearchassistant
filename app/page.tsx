'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  FileText,
  Bot,
  KanbanSquare,
  BarChart3,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Globe,
  Layers,
  ChevronRight,
  TrendingUp,
  Lock,
  Cpu,
  Star
} from 'lucide-react';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'match' | 'truth' | 'copilot' | 'roadmap'>('match');

  const workflowSteps = [
    { number: '01', title: 'Upload Resume', desc: 'AI extracts verified skills, projects, and education with confidence tiers.', icon: FileText },
    { number: '02', title: 'Set Preferences', desc: 'Specify target roles, locations, salary expectations, and work modes.', icon: Compass },
    { number: '03', title: 'Discover Jobs', desc: 'Aggregates & deduplicates listings across LinkedIn, Naukri, Unstop & Careers.', icon: Search },
    { number: '04', title: 'AI Matching', desc: 'Generates explainable compatibility scores with verified project evidence.', icon: Sparkles },
    { number: '05', title: 'Personalize', desc: 'Generates truthful cover letters and summaries strictly backed by facts.', icon: ShieldCheck },
    { number: '06', title: 'Apply with Copilot', desc: 'Auto-fills known questions from memory with human-in-the-loop safety.', icon: Bot },
    { number: '07', title: 'Track Kanban', desc: 'Organizes applications across 9 stages with drag-and-drop & CSV export.', icon: KanbanSquare },
    { number: '08', title: 'Skill Roadmap', desc: 'Transforms rejection feedback and skill gaps into 30-day learning roadmaps.', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-[#f5f8ff] text-[#172554] selection:bg-indigo-500 selection:text-white overflow-hidden">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 border-b border-[#dbe7f7] bg-[#f5f8ff]/80 backdrop-blur-xl px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-5 h-5 text-[#172554]" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
              AI JobPilot
            </span>
            <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-[#4F46E5] border border-indigo-500/30">
              SaaS Pro
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#475569]">
          <a href="#how-it-works" className="hover:text-[#172554] transition-colors">How It Works</a>
          <a href="#features" className="hover:text-[#172554] transition-colors">Features</a>
          <a href="#architecture" className="hover:text-[#172554] transition-colors">Architecture</a>
          <a href="#truth-guard" className="hover:text-[#172554] transition-colors">Truth Guard</a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="px-4 py-2 text-xs font-semibold text-[#475569] hover:text-[#172554] bg-white border border-[#dbe7f7] rounded-xl hover:bg-[#f8faff] transition-all"
          >
            Explore Demo
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-br from-[#4F46E5] to-[#2563EB] shadow-md hover:-translate-y-[1px] hover:from-indigo-500 hover:to-cyan-400 rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-1.5"
          >
            <span>Launch App</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-6 lg:px-12 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Glow ambient backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

        {/* Top Tagline Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-indigo-500/30 text-xs font-semibold text-[#4F46E5] mb-8 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-[#4F46E5] animate-pulse" />
          <span>Search Smarter. Apply Better. Grow Faster.</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#172554] max-w-4xl leading-[1.1]">
          Stop Applying Everywhere.{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
            Start Applying Smarter.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-[#475569] max-w-2xl leading-relaxed">
          AI JobPilot discovers relevant opportunities, understands requirements, matches verified skills with project evidence, truthfully personalizes applications, and manages your entire career growth in one intelligent workspace.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/jobs"
            className="px-8 py-3.5 text-sm font-bold text-white bg-gradient-to-br from-[#4F46E5] to-[#2563EB] shadow-md hover:-translate-y-[1px] hover:from-indigo-500 hover:to-cyan-400 rounded-xl shadow-xl shadow-indigo-500/30 transition-all flex items-center gap-2 hover:scale-105"
          >
            <span>Start Smart Job Search</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/dashboard"
            className="px-8 py-3.5 text-sm font-semibold text-[#172554] bg-white hover:bg-[#f8faff] border border-[#dbe7f7] rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Bot className="w-4 h-4 text-[#4F46E5]" />
            <span>Interactive Demo (Alex Kumar)</span>
          </Link>
        </div>

        {/* Live Interactive Workflow Banner Visual */}
        <div className="mt-16 w-full max-w-5xl rounded-2xl border border-[#dbe7f7] bg-white shadow-2xl p-6 backdrop-blur-md relative">
          <div className="flex items-center justify-between border-b border-[#dbe7f7] pb-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs text-[#64748b] font-mono ml-2">ai-jobpilot-engine-v2.0 // Active Candidate Pipeline</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#10B981] font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Truth Guard: Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-left">
            <div className="p-4 rounded-xl bg-[#f8faff] border border-[#dbe7f7]">
              <div className="text-[10px] font-bold text-[#4F46E5] uppercase tracking-wider mb-1">01. Resume Input</div>
              <div className="font-semibold text-sm text-[#172554]">Alex Kumar</div>
              <p className="text-xs text-[#64748b] mt-1">Parsed 12 skills & 2 verified backend projects</p>
              <div className="mt-3 flex gap-1 flex-wrap">
                <span className="text-[10px] bg-[#EEF2FF] text-[#4F46E5] px-1.5 py-0.5 rounded border border-indigo-800">Java</span>
                <span className="text-[10px] bg-[#EEF2FF] text-[#4F46E5] px-1.5 py-0.5 rounded border border-indigo-800">Spring Boot</span>
                <span className="text-[10px] bg-[#EEF2FF] text-[#4F46E5] px-1.5 py-0.5 rounded border border-indigo-800">MySQL</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#f8faff] border border-[#dbe7f7]">
              <div className="text-[10px] font-bold text-[#06B6D4] uppercase tracking-wider mb-1">02. Discovery</div>
              <div className="font-semibold text-sm text-[#172554]">Multi-Source Pool</div>
              <p className="text-xs text-[#64748b] mt-1">LinkedIn, Naukri, Unstop & Direct Careers</p>
              <div className="mt-3 text-xs text-[#10B981] font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>50 Raw → 38 Deduplicated</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#f8faff] border border-[#dbe7f7]">
              <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-1">03. AI Match</div>
              <div className="font-semibold text-sm text-[#172554]">Optum Solutions</div>
              <p className="text-xs text-[#64748b] mt-1">92% Match with verified project evidence citation</p>
              <div className="mt-3 text-xs text-[#4F46E5] font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#4F46E5]" />
                <span>High Priority Fit</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#f8faff] border border-[#dbe7f7]">
              <div className="text-[10px] font-bold text-[#F59E0B] uppercase tracking-wider mb-1">04. Copilot Assist</div>
              <div className="font-semibold text-sm text-[#172554]">Form Automation</div>
              <p className="text-xs text-[#64748b] mt-1">4 Auto-filled answers from memory + 1 User prompt</p>
              <div className="mt-3 text-xs text-[#475569] font-medium flex items-center gap-1">
                <Bot className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Safety Check: Passed</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#f8faff] border border-[#dbe7f7]">
              <div className="text-[10px] font-bold text-[#10B981] uppercase tracking-wider mb-1">05. Growth Loop</div>
              <div className="font-semibold text-sm text-[#172554]">Career Roadmap</div>
              <p className="text-xs text-[#64748b] mt-1">Missing: AWS & Kafka → 30-day guided learning</p>
              <div className="mt-3 text-xs text-[#06B6D4] font-medium flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-[#06B6D4]" />
                <span>Week 1: AWS ECS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem vs The Solution */}
      <section className="py-20 px-6 lg:px-12 bg-white border-y border-[#dbe7f7]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#4F46E5] mb-2">Why We Built AI JobPilot</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#172554]">
              The Broken Job Hunt vs The Intelligent Way
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Old Problem */}
            <div className="p-8 rounded-2xl border border-rose-500/20 bg-[#FEF2F2] backdrop-blur-md">
              <div className="flex items-center gap-3 text-[#EF4444] font-bold text-lg mb-6">
                <AlertTriangle className="w-6 h-6" />
                <h4>The Old Broken Way</h4>
              </div>
              <ul className="space-y-4 text-sm text-[#475569]">
                <li className="flex items-start gap-3">
                  <span className="text-[#EF4444] font-bold">✕</span>
                  <span><strong>Endless Manual Searching:</strong> Spending 3-4 hours daily switching between LinkedIn, Naukri, Unstop, and corporate career boards.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#EF4444] font-bold">✕</span>
                  <span><strong>Blind Keyword Spamming:</strong> Sending generic resumes to hundreds of jobs without knowing actual compatibility.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#EF4444] font-bold">✕</span>
                  <span><strong>Repetitive Form Answering:</strong> Typing the exact same notice period, CTC, relocation, and experience details 20 times a day.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#EF4444] font-bold">✕</span>
                  <span><strong>Ghost Rejections with Zero Feedback:</strong> Never knowing why you were rejected or which specific skill gap caused it.</span>
                </li>
              </ul>
            </div>

            {/* The JobPilot Solution */}
            <div className="p-8 rounded-2xl border border-emerald-500/30 bg-[#ECFDF5] backdrop-blur-md shadow-lg shadow-emerald-500/5">
              <div className="flex items-center gap-3 text-[#10B981] font-bold text-lg mb-6">
                <CheckCircle2 className="w-6 h-6" />
                <h4>The AI JobPilot Way</h4>
              </div>
              <ul className="space-y-4 text-sm text-[#475569]">
                <li className="flex items-start gap-3">
                  <span className="text-[#10B981] font-bold">✓</span>
                  <span><strong>Unified Smart Aggregation:</strong> Cross-platform discovery with automatic deduplication into one unified feed.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#10B981] font-bold">✓</span>
                  <span><strong>Explainable AI Matching:</strong> Clear score breakdowns with citations from your actual projects (no fabricated claims).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#10B981] font-bold">✓</span>
                  <span><strong>Application Copilot & Memory:</strong> Saves answers once, automatically suggests them, and requests human confirmation.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#10B981] font-bold">✓</span>
                  <span><strong>Skill Gap to Career Roadmap:</strong> Converts job market demand into actionable 30-day learning roadmaps with project milestones.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 8-Step Core User Flow */}
      <section id="how-it-works" className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#4F46E5] mb-2">Step-by-Step Flow</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-[#172554]">
            From Resume Upload to Continuous Career Growth
          </h3>
          <p className="mt-3 text-sm text-[#64748b]">
            A complete human-in-the-loop lifecycle designed for precision, transparency, and safety.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {workflowSteps.map(step => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="p-6 rounded-2xl bg-white border border-[#dbe7f7] hover:border-indigo-500/40 hover:bg-[#f8faff] transition-all duration-200 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-[#4F46E5] bg-[#EEF2FF] px-2 py-1 rounded border border-indigo-800/60">
                    {step.number}
                  </span>
                  <div className="p-2 rounded-xl bg-[#f8faff] group-hover:bg-indigo-600/20 text-[#64748b] group-hover:text-[#4F46E5] transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h4 className="text-base font-bold text-[#172554] mb-2">{step.title}</h4>
                <p className="text-xs text-[#64748b] leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Feature Deep Dive */}
      <section id="features" className="py-20 px-6 lg:px-12 bg-white border-t border-[#dbe7f7]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#4F46E5] mb-2">Platform Capabilities</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#172554]">
              Built with Truth Guard, Modularity & Intelligence
            </h3>
          </div>

          {/* Interactive Feature Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {[
              { id: 'match', label: 'Explainable Matching' },
              { id: 'truth', label: 'Truth Guard Verifier' },
              { id: 'copilot', label: 'Application Copilot' },
              { id: 'roadmap', label: 'Skill Gap & Roadmap' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-[#f8faff] text-[#64748b] hover:text-[#172554] hover:bg-white/80 border border-[#dbe7f7]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Panels */}
          <div className="p-8 rounded-2xl border border-[#dbe7f7] bg-white backdrop-blur-md">
            {activeTab === 'match' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <span className="text-xs font-bold text-[#4F46E5] uppercase tracking-wider">No Black-Box Scores</span>
                  <h4 className="text-2xl font-bold text-[#172554] mt-1 mb-4">Multi-Factor Explainable Scoring</h4>
                  <p className="text-sm text-[#475569] leading-relaxed mb-4">
                    Instead of a generic percentage, AI JobPilot breaks down your compatibility across 5 distinct dimensions: Skills Match, Role Match, Experience Fit, Location Alignment, and Education Requirements.
                  </p>
                  <div className="space-y-2 text-xs text-[#475569]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                      <span>Cites exact candidate projects as verifiable evidence</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                      <span>Pinpoints missing requirements (e.g. AWS, Kafka)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                      <span>Computes 0-100% Application Readiness checklist</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-[#f5f8ff] border border-[#dbe7f7]">
                  <div className="flex items-center justify-between pb-3 border-b border-[#dbe7f7]">
                    <span className="text-xs font-semibold text-[#172554]">Junior Java Developer — Optum</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#10B981] border border-emerald-500/30">
                      92% Compatibility
                    </span>
                  </div>
                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex justify-between text-[#64748b]">
                      <span>Skills Match</span>
                      <span className="text-[#172554] font-semibold">90%</span>
                    </div>
                    <div className="w-full bg-[#f8faff] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full w-[90%]" />
                    </div>
                    <p className="text-[11px] text-[#64748b] italic pt-2">
                      Evidence: &ldquo;Your Smart Attendance project demonstrates Java, Spring Boot, MySQL, and REST APIs relevant to this role.&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'truth' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <span className="text-xs font-bold text-[#10B981] uppercase tracking-wider">Zero Hallucinations</span>
                  <h4 className="text-2xl font-bold text-[#172554] mt-1 mb-4">Truth Guard Verification Engine</h4>
                  <p className="text-sm text-[#475569] leading-relaxed mb-4">
                    Most AI tools hallucinate years of experience, fake degrees, and imaginary cloud skills to please ATS scanners. AI JobPilot&apos;s Truth Guard strictly cross-references all generated summaries and letters against your verified profile facts.
                  </p>
                  <div className="p-4 rounded-xl bg-[#f5f8ff] border border-[#dbe7f7] text-xs text-[#475569]">
                    <p className="font-semibold text-[#10B981] flex items-center gap-1.5 mb-1">
                      <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                      Truth Guard Guarantee
                    </p>
                    <p className="text-[#64748b]">If a skill is not verified in your resume, it will never be claimed as production experience.</p>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-[#f5f8ff] border border-rose-500/30">
                  <div className="flex items-center gap-2 text-[#EF4444] text-xs font-bold mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Truth Guard Intercepted Claim</span>
                  </div>
                  <p className="text-xs text-[#475569] font-mono bg-white p-3 rounded-lg border border-[#dbe7f7]">
                    &ldquo;Candidate has 3+ years of enterprise Apache Kafka and AWS production experience.&rdquo;
                  </p>
                  <div className="mt-3 text-xs text-[#F59E0B] bg-[#FFFBEB] p-2.5 rounded-lg border border-amber-800/40">
                    <strong>Action:</strong> Flagged as unverified claim. Replaced with factual statement emphasizing Core Java and Spring Boot.
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'copilot' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <span className="text-xs font-bold text-[#06B6D4] uppercase tracking-wider">Human-In-The-Loop</span>
                  <h4 className="text-2xl font-bold text-[#172554] mt-1 mb-4">Application Copilot & Answer Memory</h4>
                  <p className="text-sm text-[#475569] leading-relaxed mb-4">
                    Stop re-typing your notice period, expected salary, relocation willingness, and work authorization. The Copilot remembers your preferences, auto-suggests answers, and asks you whenever a question is unknown or sensitive.
                  </p>
                  <div className="flex gap-2">
                    <span className="text-[11px] bg-[#f8faff] text-[#475569] px-2.5 py-1 rounded-lg border border-[#dbe7f7]">Notice Period: 15 Days</span>
                    <span className="text-[11px] bg-[#f8faff] text-[#475569] px-2.5 py-1 rounded-lg border border-[#dbe7f7]">CTC: ₹8-12 LPA</span>
                    <span className="text-[11px] bg-[#f8faff] text-[#475569] px-2.5 py-1 rounded-lg border border-[#dbe7f7]">Relocation: Yes</span>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-[#f5f8ff] border border-[#dbe7f7] space-y-3">
                  <div className="p-3 rounded-lg bg-white border border-[#dbe7f7]">
                    <span className="text-[10px] text-[#10B981] font-bold">SAVED ANSWER REUSED</span>
                    <p className="text-xs text-[#172554] font-medium mt-0.5">&ldquo;What is your notice period?&rdquo;</p>
                    <p className="text-xs text-[#64748b] mt-1">Immediate / 15 Days notice.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#FFFBEB] border border-amber-500/30">
                    <span className="text-[10px] text-[#F59E0B] font-bold">HUMAN INPUT PROMPT</span>
                    <p className="text-xs text-[#172554] font-medium mt-0.5">&ldquo;Describe your experience with high-volume database queries.&rdquo;</p>
                    <span className="text-[11px] text-[#F59E0B] font-mono mt-1 block">Awaiting user response before submission</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'roadmap' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Close the Loop</span>
                  <h4 className="text-2xl font-bold text-[#172554] mt-1 mb-4">Personal Skill Gap to 30-Day Roadmap</h4>
                  <p className="text-sm text-[#475569] leading-relaxed mb-4">
                    AI JobPilot analyzes the job listings you search and identify missing high-demand skills (e.g. AWS appeared in 64% of jobs). It automatically generates a structured 4-week learning roadmap with project milestones so your next application is stronger.
                  </p>
                  <Link
                    href="/roadmap"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4F46E5] hover:text-[#4F46E5] transition-colors"
                  >
                    <span>View Java Backend 30-Day Roadmap</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="p-5 rounded-xl bg-[#f5f8ff] border border-[#dbe7f7] space-y-2">
                  <div className="p-3 rounded-lg bg-white border border-[#dbe7f7] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#4F46E5]">WEEK 1</span>
                      <h5 className="text-xs font-bold text-[#172554]">AWS for Java Developers</h5>
                    </div>
                    <span className="text-xs text-[#64748b]">8 hrs</span>
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-[#dbe7f7] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#4F46E5]">WEEK 2</span>
                      <h5 className="text-xs font-bold text-[#172554]">Docker & Multi-Container</h5>
                    </div>
                    <span className="text-xs text-[#64748b]">10 hrs</span>
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-[#dbe7f7] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#4F46E5]">WEEK 3</span>
                      <h5 className="text-xs font-bold text-[#172554]">Apache Kafka Event Streams</h5>
                    </div>
                    <span className="text-xs text-[#64748b]">14 hrs</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Architecture Showcase */}
      <section id="architecture" className="py-20 px-6 lg:px-12 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#4F46E5] mb-2">Modular System Architecture</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-[#172554]">
            Provider-Agnostic & Privacy-First Design
          </h3>
          <p className="mt-3 text-sm text-[#64748b]">
            Source adapters, AI engine, matching logic, and personal answer memory are decoupled and compliant.
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-[#dbe7f7] bg-white backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-[#f5f8ff] border border-[#dbe7f7]">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-[#4F46E5] flex items-center justify-center mb-3">
                <Globe className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-[#172554]">Modular Source Adapters</h4>
              <p className="text-xs text-[#64748b] mt-2 leading-relaxed">
                LinkedInAdapter, NaukriAdapter, UnstopAdapter, and CompanyCareerAdapter decouple data ingestion from AI logic without illegal scrapers.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#f5f8ff] border border-[#dbe7f7]">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
                <Cpu className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-[#172554]">AI Provider Abstraction</h4>
              <p className="text-xs text-[#64748b] mt-2 leading-relaxed">
                Supports Google Gemini, OpenAI, and high-fidelity Mock fallback. Never exposes API keys on the client.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#f5f8ff] border border-[#dbe7f7]">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-[#10B981] flex items-center justify-center mb-3">
                <Lock className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-[#172554]">Audit Trail & Privacy</h4>
              <p className="text-xs text-[#64748b] mt-2 leading-relaxed">
                Every application stores a verifiable audit log. You can inspect answers used, timestamps, and export data in CSV format at any time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-24 px-6 lg:px-12 text-center relative border-t border-[#dbe7f7] bg-gradient-to-b from-slate-950 to-indigo-950/40">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#172554] tracking-tight">
            Build a Smarter Job Search Today.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#475569]">
            Join candidates using AI JobPilot to find high-match roles, submit truthful applications, and land interviews faster.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="px-8 py-3.5 text-sm font-bold text-white bg-gradient-to-br from-[#4F46E5] to-[#2563EB] shadow-md hover:-translate-y-[1px] hover:from-indigo-500 hover:to-cyan-400 rounded-xl shadow-xl shadow-indigo-500/30 transition-all flex items-center gap-2 hover:scale-105"
            >
              <span>Explore Demo Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 lg:px-12 border-t border-[#dbe7f7] text-center text-xs text-[#64748b]">
        <p>© 2026 AI JobPilot. Search Smarter. Apply Better. Grow Faster. Built for ethical, truthful, and high-impact career progression.</p>
      </footer>
    </div>
  );
}
