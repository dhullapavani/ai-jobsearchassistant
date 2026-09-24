'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import {
  Compass,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  BookOpen,
  Award,
  Layers,
  Clock,
  ExternalLink,
  Code
} from 'lucide-react';

export default function CareerRoadmapPage() {
  const { careerRoadmap, toggleRoadmapTopic, toggleMilestoneComplete } = useApp();

  const totalTopics = careerRoadmap.reduce((acc, m) => acc + m.topics.length, 0);
  const completedTopics = careerRoadmap.reduce((acc, m) => acc + m.topics.filter(t => t.completed).length, 0);
  const overallProgress = Math.round((completedTopics / (totalTopics || 1)) * 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#172554] flex items-center gap-2.5">
            <Compass className="w-6 h-6 text-[#06B6D4]" />
            <span>30-Day AI Career Roadmap</span>
          </h1>
          <p className="text-xs text-[#64748b] mt-1">
            Personalized learning path addressing identified skill gaps to reach top-tier Java Backend roles
          </p>
        </div>

        {/* Progress bar pill */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-[#dbe7f7]">
          <div className="text-right">
            <span className="text-[10px] text-[#64748b] font-bold uppercase tracking-wider block">Roadmap Progress</span>
            <span className="text-sm font-extrabold text-[#06B6D4]">{completedTopics}/{totalTopics} Topics ({overallProgress}%)</span>
          </div>
          <div className="w-20 bg-[#f8faff] h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-full transition-all duration-300" style={{ width: `${overallProgress}%` }} />
          </div>
        </div>
      </div>

      {/* 4-Week Milestone Cards */}
      <div className="space-y-6">
        {careerRoadmap.map(milestone => {
          return (
            <div
              key={milestone.id}
              className={`p-6 sm:p-8 rounded-3xl border transition-all ${
                milestone.completed
                  ? 'bg-white border-emerald-500/30'
                  : 'bg-white border-[#dbe7f7] backdrop-blur-md shadow-xl'
              }`}
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#dbe7f7]">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-[#EEF2FF] text-[#4F46E5] border border-indigo-800">
                    WEEK {milestone.week}
                  </span>
                  <h2 className="text-lg font-bold text-[#172554]">{milestone.title}</h2>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="text-[#64748b] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> ~{milestone.estimatedHours} hrs
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#f8faff] text-[#475569] border border-[#dbe7f7]">
                    {milestone.difficulty}
                  </span>
                  <button
                    onClick={() => toggleMilestoneComplete(milestone.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      milestone.completed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#f8faff] hover:bg-white text-[#475569]'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{milestone.completed ? 'Completed' : 'Mark Week Done'}</span>
                  </button>
                </div>
              </div>

              {/* Description and Why Learn */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-5">
                <div className="lg:col-span-2 space-y-4">
                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                    {milestone.description}
                  </p>

                  <div className="p-3.5 rounded-2xl bg-[#EEF2FF] border border-indigo-500/30 text-xs text-indigo-200">
                    <strong className="text-[#4F46E5] font-semibold">Why Learn:</strong> {milestone.whyLearn}
                  </div>

                  {/* Checklist of sub-topics */}
                  <div className="space-y-2.5 pt-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748b]">Core Practical Topics</h3>
                    <div className="space-y-2">
                      {milestone.topics.map((topic, idx) => (
                        <label
                          key={topic.name}
                          className="flex items-center gap-3 p-3 rounded-xl bg-[#f5f8ff]/70 border border-[#dbe7f7] hover:border-[#dbe7f7] cursor-pointer transition-colors text-xs text-[#172554]"
                        >
                          <input
                            type="checkbox"
                            checked={topic.completed}
                            onChange={() => toggleRoadmapTopic(milestone.id, idx)}
                            className="w-4 h-4 rounded accent-indigo-500"
                          />
                          <span className={topic.completed ? 'line-through text-[#64748b]' : 'text-[#172554] font-medium'}>
                            {topic.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Suggested Project Deliverable for Portfolio */}
                <div className="p-5 rounded-2xl bg-[#f5f8ff]/90 border border-[#dbe7f7] flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#F59E0B] uppercase tracking-wider mb-2">
                      <Code className="w-4 h-4" />
                      <span>Portfolio Project Deliverable</span>
                    </div>
                    <h4 className="text-sm font-bold text-[#172554]">{milestone.suggestedProject.title}</h4>
                    <p className="text-xs text-[#64748b] mt-1.5 leading-relaxed">
                      {milestone.suggestedProject.description}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-[#dbe7f7] text-[11px] text-[#475569]">
                    <strong className="text-[#06B6D4] block mb-0.5">Deliverable:</strong>
                    {milestone.suggestedProject.deliverable}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
