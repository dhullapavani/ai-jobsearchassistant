'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { JobListing, MatchBreakdown, PlatformSource, WorkMode } from '@/lib/types';
import {
  Search,
  Filter,
  Sparkles,
  MapPin,
  Building2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Zap,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Layers,
  Info,
  X,
  Activity,
  HelpCircle,
  Radio,
  Lock
} from 'lucide-react';

export default function JobsPage() {
  const {
    appMode,
    jobs,
    rawJobCount,
    duplicateCount,
    savedJobIds,
    toggleSaveJob,
    getJobMatch,
    recordFeedback,
    setActiveJobForCopilot
  } = useApp();

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('All');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [selectedFreshness, setSelectedFreshness] = useState<string>('All');
  const [minMatchScore, setMinMatchScore] = useState<number>(0);
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('All');

  // Selected job for detail modal
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [showWhyModal, setShowWhyModal] = useState<JobListing | null>(null);

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const match = getJobMatch(job);

      // Match score filter
      if (match.overallScore < minMatchScore) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          job.title.toLowerCase().includes(q) ||
          job.company.toLowerCase().includes(q) ||
          job.requiredSkills.some(s => s.toLowerCase().includes(q)) ||
          job.description.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // Role Filter
      if (selectedRole !== 'All') {
        if (!job.title.toLowerCase().includes(selectedRole.toLowerCase())) return false;
      }

      // Location Filter
      if (selectedLocation !== 'All') {
        if (!job.location.toLowerCase().includes(selectedLocation.toLowerCase()) && job.workMode !== 'Remote') {
          return false;
        }
      }

      // Work Mode Filter
      if (selectedWorkMode !== 'All') {
        if (job.workMode !== selectedWorkMode) return false;
      }

      // Platform Filter
      if (selectedPlatform !== 'All') {
        const hasPlatform = job.platform === selectedPlatform || (job.duplicateSources && job.duplicateSources.includes(selectedPlatform as PlatformSource));
        if (!hasPlatform) return false;
      }

      // Freshness Filter
      if (selectedFreshness !== 'All') {
        const now = Date.now();
        const diffHours = (now - job.postedTimestamp) / 3600000;
        if (selectedFreshness === '24h' && diffHours > 24) return false;
        if (selectedFreshness === '3d' && diffHours > 72) return false;
        if (selectedFreshness === '7d' && diffHours > 168) return false;
      }

      // Risk Score Filter
      if (selectedRiskFilter !== 'All') {
        if (job.riskScore !== selectedRiskFilter) return false;
      }

      return true;
    });
  }, [
    jobs,
    getJobMatch,
    minMatchScore,
    searchQuery,
    selectedRole,
    selectedLocation,
    selectedWorkMode,
    selectedPlatform,
    selectedFreshness,
    selectedRiskFilter
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Mode Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-[#172554] flex items-center gap-2.5">
              <span>Verified Job Opportunities</span>
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                appMode === 'live'
                  ? 'bg-[#FFFBEB] text-[#F59E0B] border-amber-500/40'
                  : 'bg-[#ECFDF5] text-[#10B981] border-emerald-500/40'
              }`}
            >
              <Activity className="w-3 h-3 animate-pulse" />
              <span>{appMode === 'live' ? 'LIVE DATA' : 'DEMO DATA'}</span>
            </span>
          </div>
          <p className="text-xs text-[#64748b] mt-1">
            {appMode === 'live'
              ? 'Authorized public APIs & live permitted feeds. Showing real verified timestamps and source citations.'
              : 'High-fidelity simulation across LinkedIn, Naukri, Unstop, and corporate career channels.'}
          </p>
        </div>

        {/* Deduplication Metric Bar */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-[#dbe7f7] text-xs text-[#475569]">
          <Layers className="w-4 h-4 text-[#4F46E5]" />
          <span>
            Aggregated <strong className="text-[#172554]">{rawJobCount}</strong> raw postings into{' '}
            <strong className="text-[#4F46E5]">{jobs.length}</strong> unique opportunities{' '}
            <span className="text-[#10B981] font-semibold">({duplicateCount} cross-platform duplicates grouped)</span>
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#dbe7f7] backdrop-blur-md space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Main search input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by title, company, skill (e.g. Java, Optum, Spring Boot, MySQL)..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#f5f8ff] border border-[#dbe7f7] rounded-xl text-[#172554] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          {/* Quick Platform Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {['All', 'LinkedIn', 'Naukri', 'Unstop', 'Company Careers'].map(p => (
              <button
                key={p}
                onClick={() => setSelectedPlatform(p)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
                  selectedPlatform === p
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-[#f5f8ff] border-[#dbe7f7] text-[#64748b] hover:text-[#172554] hover:bg-[#f8faff]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
          {/* Work Mode */}
          <select
            value={selectedWorkMode}
            onChange={e => setSelectedWorkMode(e.target.value)}
            className="px-3 py-2 bg-[#f5f8ff] border border-[#dbe7f7] rounded-xl text-[#475569] focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="All">All Work Modes</option>
            <option value="Remote">Remote Only</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>

          {/* Location */}
          <select
            value={selectedLocation}
            onChange={e => setSelectedLocation(e.target.value)}
            className="px-3 py-2 bg-[#f5f8ff] border border-[#dbe7f7] rounded-xl text-[#475569] focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="All">All Locations</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Pune">Pune</option>
            <option value="Delhi">Delhi NCR</option>
          </select>

          {/* Freshness */}
          <select
            value={selectedFreshness}
            onChange={e => setSelectedFreshness(e.target.value)}
            className="px-3 py-2 bg-[#f5f8ff] border border-[#dbe7f7] rounded-xl text-[#475569] focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="All">Any Time</option>
            <option value="24h">Past 24 Hours</option>
            <option value="3d">Past 3 Days</option>
            <option value="7d">Past 7 Days</option>
          </select>

          {/* Risk Level Filter */}
          <select
            value={selectedRiskFilter}
            onChange={e => setSelectedRiskFilter(e.target.value)}
            className="px-3 py-2 bg-[#f5f8ff] border border-[#dbe7f7] rounded-xl text-[#475569] focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="All">All Risk Profiles</option>
            <option value="Low">Verified Low Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="Review">Risk Review Required</option>
          </select>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredJobs.map(job => {
          const match = getJobMatch(job);
          const isSaved = savedJobIds.has(job.id);
          const isHighMatch = match.overallScore >= 85;

          return (
            <div
              key={job.id}
              className={`rounded-3xl border p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl relative bg-white ${
                isHighMatch
                  ? 'border-indigo-500/40 hover:border-indigo-400/80 shadow-indigo-950/20'
                  : 'border-[#dbe7f7] hover:border-[#dbe7f7]'
              }`}
            >
              <div>
                {/* Header: Company, Source & Match Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-semibold text-[#4F46E5] flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />
                      {job.company}
                    </span>
                    <h3 className="text-base font-bold text-[#172554] mt-1 leading-snug hover:text-[#4F46E5] cursor-pointer transition-colors" onClick={() => setSelectedJob(job)}>
                      {job.title}
                    </h3>
                  </div>

                  {/* Explainable Match Score Badge */}
                  <div
                    onClick={() => setSelectedJob(job)}
                    className={`flex flex-col items-center justify-center min-w-[50px] px-2 py-1 rounded-2xl border cursor-pointer hover:scale-105 transition-transform ${
                      match.overallScore >= 85
                        ? 'bg-[#ECFDF5] border-emerald-500/50 text-[#10B981]'
                        : match.overallScore >= 70
                        ? 'bg-[#EEF2FF] border-indigo-500/50 text-[#4F46E5]'
                        : 'bg-[#f5f8ff] border-[#dbe7f7] text-[#64748b]'
                    }`}
                  >
                    <span className="text-sm font-black leading-none">{match.overallScore}%</span>
                    <span className="text-[9px] font-semibold uppercase tracking-wider mt-0.5">Match</span>
                  </div>
                </div>

                {/* Location, Mode & Salary */}
                <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-[#64748b]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#64748b]" />
                    {job.location}
                  </span>
                  <span>•</span>
                  <span className="px-2 py-0.5 rounded-lg bg-[#f8faff] text-[#475569] font-medium text-[11px]">
                    {job.workMode}
                  </span>
                  <span>•</span>
                  <span className="text-[#475569] font-medium">{job.salary}</span>
                </div>

                {/* Live Source Metadata Box */}
                <div className="mt-3.5 p-2.5 rounded-xl bg-[#f5f8ff]/90 border border-[#dbe7f7] space-y-1 text-[11px]">
                  <div className="flex items-center justify-between text-[#475569] font-medium">
                    <span className="flex items-center gap-1.5">
                      <Radio className="w-3 h-3 text-[#10B981]" />
                      <span>Source: <strong className="text-[#172554]">{job.platform}</strong></span>
                    </span>
                    <span className="text-[10px] text-[#64748b]">
                      Retrieved: {job.retrievedAt || '2m ago'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[#64748b]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5 text-[#64748b]" />
                      Posted: {job.postedTime}
                    </span>
                    {job.jobUrl && (
                      <a
                        href={job.jobUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#4F46E5] hover:text-[#4F46E5] flex items-center gap-0.5 underline"
                      >
                        Original URL <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>

                  {/* Multi-platform Deduplication Display */}
                  {job.duplicateSources && job.duplicateSources.length > 1 && (
                    <div className="pt-1 border-t border-[#dbe7f7] text-[10px] text-[#4F46E5] flex items-center justify-between">
                      <span>Detected across: {job.duplicateSources.join(', ')}</span>
                      <span className="bg-[#EEF2FF] px-1.5 py-0.5 rounded text-[9px] border border-indigo-800 font-semibold">
                        Merged
                      </span>
                    </div>
                  )}

                  {/* Non-automated source notice */}
                  {job.applicationMethod === 'External' && (
                    <div className="text-[10px] text-[#F59E0B]/90 flex items-center gap-1 pt-0.5">
                      <Info className="w-2.5 h-2.5 text-[#F59E0B] flex-shrink-0" />
                      <span className="truncate">Direct automation unavailable — open official application page.</span>
                    </div>
                  )}
                </div>

                {/* Skills Chips */}
                <div className="flex flex-wrap gap-1.5 mt-3.5">
                  {job.requiredSkills.slice(0, 4).map(skill => {
                    const isMatched = match.matchedSkills.some(s => s.toLowerCase() === skill.toLowerCase());
                    return (
                      <span
                        key={skill}
                        className={`text-[10px] px-2 py-0.5 rounded-lg font-medium border ${
                          isMatched
                            ? 'bg-[#ECFDF5] border-emerald-500/40 text-[#10B981]'
                            : 'bg-[#f8faff] border-[#dbe7f7] text-[#64748b]'
                        }`}
                      >
                        {isMatched ? '✓ ' : ''}{skill}
                      </span>
                    );
                  })}
                  {job.requiredSkills.length > 4 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#f8faff] text-[#64748b]">
                      +{job.requiredSkills.length - 4} more
                    </span>
                  )}
                </div>

                {/* Risk Signal Badge */}
                {job.riskScore === 'Review' || job.riskScore === 'High' ? (
                  <div className="mt-3 p-2 rounded-xl bg-[#FFFBEB] border border-amber-600/40 text-[11px] text-[#F59E0B] flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                    <p className="leading-snug">
                      Potential risk signals detected. Verify independently before applying.
                    </p>
                  </div>
                ) : null}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-4 border-t border-[#dbe7f7] flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  {/* Save Button */}
                  <button
                    onClick={() => toggleSaveJob(job.id)}
                    className={`p-2 rounded-xl border transition-colors ${
                      isSaved
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-[#f5f8ff] border-[#dbe7f7] text-[#64748b] hover:text-[#172554] hover:bg-[#f8faff]'
                    }`}
                    title={isSaved ? 'Remove from saved' : 'Save opportunity'}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>

                  {/* Why am I seeing this? */}
                  <button
                    onClick={() => setShowWhyModal(job)}
                    className="p-2 rounded-xl bg-[#f5f8ff] border border-[#dbe7f7] text-[#64748b] hover:text-[#4F46E5] hover:bg-[#f8faff] transition-colors"
                    title="Why am I seeing this job?"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>

                  {/* Thumbs up / down feedback */}
                  <button
                    onClick={() => recordFeedback(job.id, 'relevant')}
                    className="p-2 rounded-xl bg-[#f5f8ff] border border-[#dbe7f7] text-[#64748b] hover:text-[#10B981] hover:bg-[#f8faff] transition-colors"
                    title="Mark relevant"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => recordFeedback(job.id, 'not_relevant')}
                    className="p-2 rounded-xl bg-[#f5f8ff] border border-[#dbe7f7] text-[#64748b] hover:text-red-400 hover:bg-[#f8faff] transition-colors"
                    title="Mark not relevant"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="px-3 py-2 rounded-xl bg-[#f8faff] hover:bg-white text-[#172554] font-semibold text-xs transition-colors border border-[#dbe7f7]"
                  >
                    Breakdown
                  </button>

                  <Link
                    href="/copilot"
                    onClick={() => setActiveJobForCopilot(job)}
                    className="px-3 py-2 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#2563EB] shadow-md hover:-translate-y-[1px] text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-indigo-600/20"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Apply</span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* "Why Am I Seeing This Job?" Modal */}
      {showWhyModal && (
        <div className="fixed inset-0 z-50 bg-[#f5f8ff]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#dbe7f7] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#dbe7f7] pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#4F46E5]" />
                <h3 className="font-bold text-base text-[#172554]">Why Am I Seeing This Job?</h3>
              </div>
              <button onClick={() => setShowWhyModal(null)} className="p-1 rounded-lg text-[#64748b] hover:text-[#172554]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#475569]">
              <p className="text-[#64748b] font-medium">
                Recommendation explanation for <strong className="text-[#172554]">{showWhyModal.title}</strong> at{' '}
                <strong className="text-[#4F46E5]">{showWhyModal.company}</strong>:
              </p>

              <div className="space-y-2 bg-[#f5f8ff] p-4 rounded-2xl border border-[#dbe7f7]">
                {getJobMatch(showWhyModal).whyAmISeeingThis?.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                    <p className="leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-[#EEF2FF] border border-indigo-500/30 text-[11px] text-indigo-200">
                <p>
                  Your explicit feedback (thumbs up/down, saved jobs, applied statuses) dynamically tunes future recommendations without altering your hard preferences.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowWhyModal(null)}
                className="px-4 py-2 rounded-xl bg-[#f8faff] hover:bg-white text-[#172554] text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Explainable Match Breakdown Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-[#f5f8ff]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#dbe7f7] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#dbe7f7] pb-4">
              <div>
                <span className="text-xs font-semibold text-[#4F46E5]">{selectedJob.company}</span>
                <h2 className="text-xl font-bold text-[#172554] mt-0.5">{selectedJob.title}</h2>
                <div className="flex items-center gap-2 text-xs text-[#64748b] mt-1">
                  <span>{selectedJob.location}</span>
                  <span>•</span>
                  <span>{selectedJob.workMode}</span>
                  <span>•</span>
                  <span>{selectedJob.salary}</span>
                </div>
              </div>
              <button onClick={() => setSelectedJob(null)} className="p-1 rounded-lg text-[#64748b] hover:text-[#172554]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Match Breakdown Scores */}
            {(() => {
              const match = getJobMatch(selectedJob);
              return (
                <div className="space-y-5">
                  {/* Overall Match Summary */}
                  <div className="p-4 rounded-2xl bg-[#f5f8ff] border border-[#dbe7f7] flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#172554] flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#4F46E5]" />
                        <span>Explainable Compatibility Score</span>
                      </h4>
                      <p className="text-xs text-[#64748b] mt-0.5">{match.priorityReason}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-black text-[#10B981]">{match.overallScore}%</span>
                      <p className="text-[10px] text-[#64748b] font-semibold">Overall Match</p>
                    </div>
                  </div>

                  {/* Factor Breakdown Bars */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center text-xs">
                    <div className="p-3 rounded-2xl bg-[#f5f8ff] border border-[#dbe7f7]">
                      <span className="text-base font-bold text-[#172554]">{match.skillsScore}%</span>
                      <p className="text-[10px] text-[#64748b] mt-0.5">Skills</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#f5f8ff] border border-[#dbe7f7]">
                      <span className="text-base font-bold text-[#172554]">{match.roleScore}%</span>
                      <p className="text-[10px] text-[#64748b] mt-0.5">Role</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#f5f8ff] border border-[#dbe7f7]">
                      <span className="text-base font-bold text-[#172554]">{match.experienceScore}%</span>
                      <p className="text-[10px] text-[#64748b] mt-0.5">Experience</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#f5f8ff] border border-[#dbe7f7]">
                      <span className="text-base font-bold text-[#172554]">{match.locationScore}%</span>
                      <p className="text-[10px] text-[#64748b] mt-0.5">Location</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#f5f8ff] border border-[#dbe7f7] col-span-2 sm:col-span-1">
                      <span className="text-base font-bold text-[#172554]">{match.educationScore}%</span>
                      <p className="text-[10px] text-[#64748b] mt-0.5">Education</p>
                    </div>
                  </div>

                  {/* Positive Evidence Points */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-[#172554] uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                      <span>Evidence Found in Candidate Facts</span>
                    </h4>
                    <div className="space-y-1.5 bg-[#f5f8ff] p-3 rounded-2xl border border-[#dbe7f7] text-xs">
                      {match.evidencePoints.map((ep, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-[#475569]">
                          <span className="text-[#10B981] font-bold">✓</span>
                          <span>{ep.candidateEvidence}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Missing Skills Warning */}
                  {match.missingSkills.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-[#172554] uppercase tracking-wider flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
                        <span>Missing / Unverified Skills</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {match.missingSkills.map(s => (
                          <span
                            key={s}
                            className="px-2.5 py-1 rounded-xl bg-[#FFFBEB] border border-amber-600/40 text-[#F59E0B] text-xs font-medium"
                          >
                            ⚠ {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Modal Footer Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#dbe7f7]">
                    <a
                      href={selectedJob.jobUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-[#4F46E5] hover:text-[#4F46E5] flex items-center gap-1 underline"
                    >
                      Open Official Job Page <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedJob(null)}
                        className="px-4 py-2 rounded-xl bg-[#f8faff] hover:bg-white text-[#172554] text-xs font-semibold"
                      >
                        Close
                      </button>
                      <Link
                        href="/copilot"
                        onClick={() => {
                          setActiveJobForCopilot(selectedJob);
                          setSelectedJob(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#2563EB] shadow-md hover:-translate-y-[1px] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Launch Application Copilot</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
