'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { FadeIn } from '@/components/animations/FadeIn';
import { SlideUp } from '@/components/animations/SlideUp';
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerContainer';
import { AnimatedNumber } from '@/components/animations/AnimatedNumber';
import {
  Briefcase,
  Sparkles,
  Search,
  KanbanSquare,
  Calendar,
  Percent,
  Compass,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Building2,
  MapPin,
  Clock,
  Zap,
  Bookmark
} from 'lucide-react';

export default function DashboardPage() {
  const {
    profile,
    jobs,
    rawJobCount,
    duplicateCount,
    savedJobIds,
    toggleSaveJob,
    getJobMatch,
    applications,
    skillGaps,
    careerRoadmap,
    setActiveJobForCopilot
  } = useApp();

  // Metrics calculation
  const totalDiscovered = rawJobCount;
  const highMatchJobs = jobs.filter(j => getJobMatch(j).overallScore >= 85);
  const activeApplications = applications.filter(a => a.status !== 'Rejected' && a.status !== 'Withdrawn');
  const interviewCount = applications.filter(a => a.status === 'Interview' || a.status === 'Assessment').length;

  const averageMatchScore = Math.round(
    jobs.reduce((acc, j) => acc + getJobMatch(j).overallScore, 0) / (jobs.length || 1)
  );

  const topMissingSkills = skillGaps.slice(0, 3).map(s => s.skill.split(' ')[0]).join(', ');

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <SlideUp duration={0.6}>
      <div className="relative p-6 sm:p-8 rounded-[24px] bg-gradient-to-r from-white via-[#EFF6FF] to-[#EEF2FF] border border-[#dbe7f7] overflow-hidden shadow-lg backdrop-blur-xl">
        {/* Subtle decorative radial shapes */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle_at_75%_0%,rgba(125,211,252,0.25),transparent_50%)] pointer-events-none rounded-full blur-2xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EEF2FF] text-[#4F46E5] border border-[#dbe7f7]">
                AI Career Copilot Active
              </span>
              <span className="text-xs text-[#64748b] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Updated 10 mins ago
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight">
              Welcome back, <span className="text-[#4F46E5]">{profile.name}</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#475569] mt-2 max-w-xl leading-relaxed">
              Targeting <strong>{profile.targetRoles[0]}</strong> in <strong>{profile.preferredLocations.slice(0, 2).join(', ')}</strong>. We found <strong>{highMatchJobs.length} high-match opportunities</strong> aligned with your Java & Spring Boot background.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2 mb-4">
               <span className="px-3 py-1 rounded-full bg-white border border-[#dbe7f7] text-xs font-bold text-[#4F46E5] flex items-center gap-1 shadow-sm"><CheckCircle2 className="w-3 h-3 text-[#10B981]" /> Java</span>
               <span className="px-3 py-1 rounded-full bg-white border border-[#dbe7f7] text-xs font-bold text-[#4F46E5] flex items-center gap-1 shadow-sm"><CheckCircle2 className="w-3 h-3 text-[#10B981]" /> Spring Boot</span>
               <span className="px-3 py-1 rounded-full bg-[#EEF2FF] border border-[#dbe7f7] text-xs font-bold text-[#2563EB] flex items-center gap-1 shadow-sm"><Sparkles className="w-3 h-3 text-[#2563EB]" /> AI Matching</span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/jobs"
                className="px-6 py-3 text-xs font-bold text-white bg-gradient-to-br from-[#4F46E5] to-[#2563EB] shadow-md hover:-translate-y-[2px] rounded-xl transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <span>Explore High-Match Jobs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          
          <div className="hidden md:block flex-shrink-0 animate-in slide-in-from-right-4 duration-1000 ease-out">
             <div className="w-[300px] h-[220px] relative rounded-2xl overflow-hidden shadow-lg border border-[#dbe7f7] bg-white group hover:scale-[1.02] transition-transform duration-500">
               <img src="/dashboard_3d_developer.jpg" alt="3D Developer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
             </div>
          </div>
        </div>
      </div>
      </SlideUp>

      {/* 6 Metric Cards */}
      <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Metric 1 */}
        <StaggerItem className="p-4 rounded-2xl bg-white border border-[#dbe7f7] backdrop-blur-md transition-transform hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between text-[#64748b] mb-2">
            <span className="text-[11px] font-semibold">Jobs Found</span>
            <Search className="w-4 h-4 text-[#4F46E5]" />
          </div>
          <div className="text-2xl font-extrabold text-[#172554]"><AnimatedNumber value={totalDiscovered} /></div>
          <p className="text-[10px] text-[#64748b] mt-1">
            <span className="text-[#10B981] font-semibold">{jobs.length} unique</span> ({duplicateCount} deduped)
          </p>
        </StaggerItem>

        {/* Metric 2 */}
        <StaggerItem className="p-4 rounded-2xl bg-white border border-[#dbe7f7] backdrop-blur-md transition-transform hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between text-[#64748b] mb-2">
            <span className="text-[11px] font-semibold">High-Match</span>
            <Sparkles className="w-4 h-4 text-[#06B6D4]" />
          </div>
          <div className="text-2xl font-extrabold text-[#06B6D4]"><AnimatedNumber value={highMatchJobs.length} /></div>
          <p className="text-[10px] text-[#64748b] mt-1">&ge;85% compatibility</p>
        </StaggerItem>

        {/* Metric 3 */}
        <StaggerItem className="p-4 rounded-2xl bg-white border border-[#dbe7f7] backdrop-blur-md transition-transform hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between text-[#64748b] mb-2">
            <span className="text-[11px] font-semibold">In Pipeline</span>
            <KanbanSquare className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-[#172554]"><AnimatedNumber value={activeApplications.length} /></div>
          <p className="text-[10px] text-[#64748b] mt-1">Across 4 stages</p>
        </StaggerItem>

        {/* Metric 4 */}
        <StaggerItem className="p-4 rounded-2xl bg-white border border-[#dbe7f7] backdrop-blur-md transition-transform hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between text-[#64748b] mb-2">
            <span className="text-[11px] font-semibold">Interviews</span>
            <Calendar className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="text-2xl font-extrabold text-[#10B981]"><AnimatedNumber value={interviewCount} /></div>
          <p className="text-[10px] text-[#64748b] mt-1">1 active tomorrow</p>
        </StaggerItem>

        {/* Metric 5 */}
        <StaggerItem className="p-4 rounded-2xl bg-white border border-[#dbe7f7] backdrop-blur-md transition-transform hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between text-[#64748b] mb-2">
            <span className="text-[11px] font-semibold">Avg Match</span>
            <Percent className="w-4 h-4 text-[#4F46E5]" />
          </div>
          <div className="text-2xl font-extrabold text-[#172554]"><AnimatedNumber value={averageMatchScore} format="percentage" /></div>
          <p className="text-[10px] text-[#10B981] mt-1">+14% vs un-tailored</p>
        </StaggerItem>

        {/* Metric 6 */}
        <StaggerItem className="p-4 rounded-2xl bg-white border border-[#dbe7f7] backdrop-blur-md transition-transform hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between text-[#64748b] mb-2">
            <span className="text-[11px] font-semibold">Skills to Learn</span>
            <Compass className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="text-xs font-bold text-[#F59E0B] truncate mt-1">{topMissingSkills}</div>
          <p className="text-[10px] text-[#64748b] mt-2">Week 1 roadmap ready</p>
        </StaggerItem>
      </StaggerContainer>

      {/* Main Grid: Left 2 Cols (Recommended & Discoveries), Right 1 Col (Upcoming Interviews, Skill Gap & AI Feedback) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 spans) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Top Recommended Jobs */}
          <div className="p-6 rounded-3xl bg-white border border-[#dbe7f7] backdrop-blur-md shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold text-[#172554] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#4F46E5]" />
                  <span>Top Recommended For You</span>
                </h2>
                <p className="text-xs text-[#64748b] mt-0.5">Ranked by explainable skill & experience compatibility</p>
              </div>
              <Link href="/jobs" className="text-xs font-semibold text-[#4F46E5] hover:text-[#4F46E5] flex items-center gap-1">
                <span>View all ({jobs.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              {jobs.slice(0, 3).map(job => {
                const match = getJobMatch(job);
                const isSaved = savedJobIds.has(job.id);

                return (
                  <div
                    key={job.id}
                    className="p-5 rounded-2xl bg-[#f8faff] border border-[#dbe7f7] hover:border-indigo-500/40 hover:bg-[#f8faff] transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-[#f8faff] border border-[#dbe7f7] flex items-center justify-center text-[#172554] font-bold text-sm">
                          {job.company[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm text-[#172554] hover:text-[#4F46E5] transition-colors">
                              {job.title}
                            </h3>
                            {job.duplicateCount && job.duplicateCount > 1 && (
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-cyan-950/80 text-[#06B6D4] border border-cyan-700/40">
                                In {job.duplicateCount} sources
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#475569] mt-0.5 flex items-center gap-2">
                            <span>{job.company}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-[#64748b]">
                              <MapPin className="w-3 h-3" /> {job.location} ({job.workMode})
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Match Score Badge */}
                      <div className="text-right flex-shrink-0">
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ECFDF5] border border-emerald-500/40 text-xs font-bold text-[#10B981]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                          <span>{match.overallScore}% Match</span>
                        </div>
                        <div className="text-[10px] text-[#64748b] mt-1">{job.salary}</div>
                      </div>
                    </div>

                    {/* Matched skills and evidence citation */}
                    <div className="mt-4 pt-3 border-t border-[#dbe7f7] flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] text-[#64748b]">Verified Skills:</span>
                        {match.matchedSkills.slice(0, 4).map(skill => (
                          <span key={skill} className="text-[10px] bg-white text-indigo-200 px-2 py-0.5 rounded-md border border-[#dbe7f7] font-medium">
                            ✓ {skill}
                          </span>
                        ))}
                        {match.missingSkills.length > 0 && (
                          <span className="text-[10px] bg-[#FFFBEB] text-[#F59E0B] px-2 py-0.5 rounded-md border border-amber-800/40">
                            ⚠ Missing: {match.missingSkills.slice(0, 2).join(', ')}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 ml-auto">
                        <button
                          onClick={() => toggleSaveJob(job.id)}
                          className={`p-2 rounded-xl border text-xs transition-colors ${
                            isSaved
                              ? 'bg-indigo-600/20 text-[#4F46E5] border-indigo-500/40'
                              : 'bg-[#f8faff] text-[#64748b] border-[#dbe7f7] hover:text-[#172554]'
                          }`}
                          title={isSaved ? 'Saved' : 'Save Job'}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-indigo-400' : ''}`} />
                        </button>

                        <Link
                          href="/copilot"
                          onClick={() => setActiveJobForCopilot(job)}
                          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#2563EB] shadow-md hover:-translate-y-[1px] text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                        >
                          <Zap className="w-3.5 h-3.5 text-[#F59E0B]" />
                          <span>Prepare with Copilot</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mini Pipeline Kanban Overview */}
          <div className="p-6 rounded-3xl bg-white border border-[#dbe7f7] backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-[#172554] flex items-center gap-2">
                  <KanbanSquare className="w-4 h-4 text-purple-400" />
                  <span>Application Pipeline Overview</span>
                </h2>
                <p className="text-xs text-[#64748b] mt-0.5">Tracking your active career progression</p>
              </div>
              <Link href="/applications" className="text-xs font-semibold text-[#4F46E5] hover:text-[#4F46E5] flex items-center gap-1">
                <span>Full Board</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Ready for Review', count: applications.filter(a => a.status === 'Ready').length, color: 'text-[#F59E0B]', bg: 'bg-[#FFFBEB] border-amber-800/40' },
                { label: 'Applied', count: applications.filter(a => a.status === 'Applied').length, color: 'text-blue-300', bg: 'bg-blue-950/30 border-blue-800/40' },
                { label: 'Assessment', count: applications.filter(a => a.status === 'Assessment').length, color: 'text-purple-300', bg: 'bg-purple-950/30 border-purple-800/40' },
                { label: 'Interview', count: applications.filter(a => a.status === 'Interview').length, color: 'text-[#10B981]', bg: 'bg-[#ECFDF5] border-emerald-800/40' }
              ].map(stage => (
                <div key={stage.label} className={`p-3.5 rounded-xl border ${stage.bg}`}>
                  <div className="text-xs text-[#64748b] font-medium">{stage.label}</div>
                  <div className={`text-xl font-bold mt-1 ${stage.color}`}>{stage.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 span) */}
        <div className="space-y-6">
          {/* Upcoming Interview Alert Box */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/40 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-bold text-[#10B981] uppercase tracking-wider mb-2">
              <Calendar className="w-4 h-4" />
              <span>Upcoming Interview</span>
            </div>
            <h3 className="font-bold text-sm text-[#172554]">Accenture India</h3>
            <p className="text-xs text-[#475569] mt-1">
              Technical Round 1 • Java & Microservices
            </p>
            <div className="mt-3 p-3 rounded-xl bg-white border border-[#dbe7f7] text-xs space-y-1">
              <div className="flex justify-between text-[#64748b]">
                <span>Date & Time:</span>
                <span className="text-[#172554] font-medium">Tomorrow, 3:00 PM IST</span>
              </div>
              <div className="flex justify-between text-[#64748b]">
                <span>Role:</span>
                <span className="text-[#172554] font-medium">Full Stack Java & React Intern</span>
              </div>
            </div>
            <Link
              href="/applications"
              className="mt-4 w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>View Prep & Notes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Skill Gap Snapshot */}
          <div className="p-5 rounded-3xl bg-white border border-[#dbe7f7] backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-[#172554] flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#F59E0B]" />
                <span>Priority Skill Gaps</span>
              </h3>
              <Link href="/skills" className="text-xs text-[#4F46E5] hover:text-[#4F46E5]">
                Analysis
              </Link>
            </div>

            <div className="space-y-3">
              {skillGaps.slice(0, 3).map(gap => (
                <div key={gap.skill} className="p-3 rounded-xl bg-[#f8faff] border border-[#dbe7f7]">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-[#172554]">{gap.skill}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#FFFBEB] text-[#F59E0B] border border-amber-800/50">
                      In {gap.frequencyInTargetJobs}% of jobs
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748b] mt-1">{gap.importance} priority • ~{gap.learningHours}h learning</p>
                </div>
              ))}
            </div>

            <Link
              href="/roadmap"
              className="mt-4 w-full py-2 rounded-xl bg-[#f8faff] hover:bg-white text-[#4F46E5] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-[#dbe7f7]"
            >
              <span>Open 30-Day Learning Plan</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* AI Career Feedback Loop */}
          <div className="p-5 rounded-3xl bg-white border border-[#dbe7f7] backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-bold text-[#4F46E5] uppercase tracking-wider mb-2">
              <TrendingUp className="w-4 h-4" />
              <span>AI Career Insights</span>
            </div>
            <p className="text-xs text-[#475569] leading-relaxed">
              &ldquo;Your applications match <strong>Backend & Microservices</strong> roles with a 92% rate. Adding <strong>AWS deployment evidence</strong> will unlock the top 35% salary band (₹12-16 LPA).&rdquo;
            </p>
            <div className="mt-3 text-[11px] text-[#64748b] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Data backed by your recent 4 applications</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
