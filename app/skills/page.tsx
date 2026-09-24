'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import {
  BarChart3,
  Sparkles,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  BookOpen
} from 'lucide-react';

export default function SkillGapPage() {
  const { profile, skillGaps } = useApp();

  const userSkillsList = profile.skills.filter(s => s.confidence === 'Verified' || s.confidence === 'Inferred');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#172554] flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-[#4F46E5]" />
            <span>Personal Skill Gap Analyzer</span>
          </h1>
          <p className="text-xs text-[#64748b] mt-1">
            Real-time comparison between your verified resume skills and current market requirements
          </p>
        </div>

        <Link
          href="/roadmap"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all self-start sm:self-auto"
        >
          <Compass className="w-4 h-4 text-cyan-200" />
          <span>Generate 30-Day Learning Plan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Comparison Grid: User Skills vs Market Demands */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Verified Skills */}
        <div className="p-6 rounded-3xl bg-white border border-[#dbe7f7] backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#172554] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              <span>Your Verified Resume Foundation</span>
            </h3>
            <span className="text-xs text-[#10B981] font-semibold">{userSkillsList.length} Verified</span>
          </div>

          <div className="space-y-2.5">
            {userSkillsList.map(skill => (
              <div
                key={skill.name}
                className="p-3 rounded-xl bg-[#f5f8ff]/70 border border-[#dbe7f7] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="font-semibold text-[#172554]">{skill.name}</span>
                  <span className="text-[10px] text-[#64748b] bg-white px-2 py-0.2 rounded border border-[#dbe7f7]">
                    {skill.category}
                  </span>
                </div>
                <span className="text-[#10B981] font-mono text-[11px]">
                  {skill.confidence} ({skill.proficiency}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Missing Market Requirements */}
        <div className="p-6 rounded-3xl bg-white border border-[#dbe7f7] backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#172554] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
              <span>Missing Market Requirements</span>
            </h3>
            <span className="text-xs text-[#F59E0B] font-semibold">{skillGaps.length} Target Gaps</span>
          </div>

          <div className="space-y-2.5">
            {skillGaps.map(gap => (
              <div
                key={gap.skill}
                className="p-3 rounded-xl bg-[#f5f8ff]/70 border border-amber-900/30 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#172554]">{gap.skill}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#FFFBEB] text-[#F59E0B] border border-amber-800/40">
                      {gap.importance}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748b] mt-0.5">
                    Found in <strong>{gap.frequencyInTargetJobs}%</strong> of Java Backend postings
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-[#4F46E5] font-medium block">~{gap.learningHours}h study</span>
                  <span className="text-[10px] text-[#64748b]">{gap.difficulty}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Prioritized Learning Queue Table */}
      <div className="p-6 rounded-3xl bg-white border border-[#dbe7f7] backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#172554] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#4F46E5]" />
              <span>Prioritized Learning Queue</span>
            </h3>
            <p className="text-xs text-[#64748b] mt-0.5">
              Ranked automatically by job frequency in your search, salary boost potential, and difficulty
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#475569]">
            <thead className="border-b border-[#dbe7f7] text-[10px] uppercase font-bold text-[#64748b] bg-[#f5f8ff]/40">
              <tr>
                <th className="py-3 px-4">Skill</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Job Demand</th>
                <th className="py-3 px-4">Estimated Effort</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-right">Roadmap Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {skillGaps.map(gap => (
                <tr key={gap.skill} className="hover:bg-[#f8faff] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#172554]">{gap.skill}</td>
                  <td className="py-3.5 px-4 text-[#64748b]">{gap.category}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-[#f8faff] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full" style={{ width: `${gap.frequencyInTargetJobs}%` }} />
                      </div>
                      <span className="font-semibold text-[#F59E0B]">{gap.frequencyInTargetJobs}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-[#475569]">{gap.learningHours} hours ({gap.difficulty})</td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#f8faff] text-[#64748b] border border-[#dbe7f7]">
                      {gap.userStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href="/roadmap"
                      className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-[#4F46E5] font-semibold text-xs transition-colors border border-indigo-500/30"
                    >
                      View in Roadmap
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
