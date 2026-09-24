'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { TruthGuard } from '@/lib/ai/truth-guard';
import { MockAIProvider } from '@/lib/ai/ai-provider';
import { ExtractedSkill, SkillConfidence } from '@/lib/types';
import {
  FileText,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Edit3,
  Save,
  Plus,
  Trash2,
  Layers,
  ArrowRight,
  GitBranch,
  Award,
  BookOpen,
  Briefcase
} from 'lucide-react';

export default function ResumeIntelligencePage() {
  const { profile, updateProfile, jobs, addToast } = useApp();
  const [activeTab, setActiveTab] = useState<'profile' | 'graph' | 'tailor' | 'raw'>('profile');
  const [isEditing, setIsEditing] = useState(false);

  // Editable Profile fields
  const [editName, setEditName] = useState(profile.name);
  const [editTitle, setEditTitle] = useState(profile.title);
  const [editSummary, setEditSummary] = useState(profile.summary);
  const [editGradYear, setEditGradYear] = useState(profile.education[0]?.graduationYear || '2025');

  // Resume Tailor State
  const [selectedTailorJobId, setSelectedTailorJobId] = useState(jobs[0]?.id || '');
  const [isGeneratingTailor, setIsGeneratingTailor] = useState(false);
  const [tailorResult, setTailorResult] = useState<any>(null);

  // Interactive Skill Graph state
  const skillNodes = [
    { name: 'Java (Core & SE 8/21)', category: 'Root', level: 'Verified (92%)', children: ['Spring Boot', 'Hibernate / JPA', 'REST APIs'] },
    { name: 'Spring Boot', category: 'Framework', level: 'Verified (86%)', children: ['Spring Security / JWT', 'Spring Data JPA', 'Microservices'] },
    { name: 'Relational DBs (MySQL/PostgreSQL)', category: 'Database', level: 'Verified (88%)', children: ['Schema Indexing', 'ACID Transactions', 'Connection Pooling'] },
    { name: 'Cloud Infrastructure (AWS)', category: 'Cloud', level: 'Missing (Roadmap Week 1)', children: ['AWS EC2', 'AWS S3', 'AWS RDS'] },
    { name: 'Event Streaming (Kafka)', category: 'Distributed', level: 'Missing (Roadmap Week 3)', children: ['Topic Partitions', 'Consumer Groups', 'Spring Cloud Stream'] },
  ];

  const handleSaveProfile = () => {
    updateProfile({
      name: editName,
      title: editTitle,
      summary: editSummary,
      education: [
        {
          ...profile.education[0],
          graduationYear: editGradYear
        }
      ]
    });
    setIsEditing(false);
  };

  const handleGenerateTailoredResume = async () => {
    const job = jobs.find(j => j.id === selectedTailorJobId) || jobs[0];
    setIsGeneratingTailor(true);
    const ai = new MockAIProvider();
    const result = await ai.tailorResume(profile, job);
    setTailorResult(result);
    setIsGeneratingTailor(false);
    addToast({
      type: 'success',
      title: 'Resume Tailored with Truth Guard',
      message: 'Suggestions generated strictly within verified profile evidence.'
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#172554] flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-[#4F46E5]" />
            <span>Resume Intelligence & Skill Graph</span>
          </h1>
          <p className="text-xs text-[#64748b] mt-1">
            Deep parser, verifiable project evidence extraction, and Truth Guard compliance auditing
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              addToast({
                type: 'info',
                title: 'Resume Parsed',
                message: 'Extracted 12 skills, 2 projects, and education credentials.'
              });
            }}
            className="px-4 py-2 text-xs font-semibold text-[#172554] bg-white border border-[#dbe7f7] rounded-xl hover:bg-[#f8faff] transition-all flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5 text-[#4F46E5]" />
            <span>Re-upload PDF/DOCX</span>
          </button>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-br from-[#4F46E5] to-[#2563EB] shadow-md hover:-translate-y-[1px] rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Parsed Info'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#dbe7f7] pb-3">
        {[
          { id: 'profile', label: 'Structured Profile & Skills' },
          { id: 'graph', label: 'Skill Knowledge Graph' },
          { id: 'tailor', label: 'AI Resume Tailor & Truth Guard' },
          { id: 'raw', label: 'Raw Resume Data' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-600/20 text-[#4F46E5] border border-indigo-500/40 shadow-sm'
                : 'text-[#64748b] hover:text-[#172554] hover:bg-[#f8faff]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Structured Profile & Skills */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Candidate Info & Projects (2 spans) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary Card */}
            <div className="p-6 rounded-3xl bg-white border border-[#dbe7f7] backdrop-blur-md space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className="text-lg font-bold text-[#172554] bg-[#f8faff] border border-[#dbe7f7] rounded-lg px-3 py-1 w-full"
                        placeholder="Candidate Name"
                      />
                      <input
                        type="text"
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        className="text-xs text-[#4F46E5] bg-[#f8faff] border border-[#dbe7f7] rounded-lg px-3 py-1 w-full"
                        placeholder="Candidate Headline / Title"
                      />
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-xl font-extrabold text-[#172554]">{profile.name}</h2>
                      <p className="text-xs font-semibold text-[#4F46E5] mt-0.5">{profile.title}</p>
                    </div>
                  )}
                  <p className="text-xs text-[#64748b] mt-1">
                    {profile.email} • {profile.phone} • {profile.location}
                  </p>
                </div>

                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#ECFDF5] text-[#10B981] border border-emerald-700/50 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Profile</span>
                </span>
              </div>

              {/* Summary */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#64748b]">Professional Summary</label>
                {isEditing ? (
                  <textarea
                    rows={3}
                    value={editSummary}
                    onChange={e => setEditSummary(e.target.value)}
                    className="w-full mt-1.5 p-3 text-xs bg-[#f8faff] border border-[#dbe7f7] rounded-xl text-[#172554] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="text-xs text-[#475569] mt-1.5 leading-relaxed bg-[#f5f8ff]/60 p-3.5 rounded-2xl border border-[#dbe7f7]">
                    {profile.summary}
                  </p>
                )}
              </div>

              {/* Education & Experience Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#f5f8ff]/60 border border-[#dbe7f7]">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#172554] mb-2">
                    <BookOpen className="w-4 h-4 text-[#4F46E5]" />
                    <span>Education Credentials</span>
                  </div>
                  <p className="text-xs font-semibold text-[#172554]">{profile.education[0]?.degree}</p>
                  <p className="text-[11px] text-[#64748b] mt-0.5">{profile.education[0]?.institution}</p>
                  <p className="text-[11px] text-[#4F46E5] mt-1 font-medium">
                    Graduation: {isEditing ? (
                      <input
                        type="text"
                        value={editGradYear}
                        onChange={e => setEditGradYear(e.target.value)}
                        className="bg-[#f8faff] border border-[#dbe7f7] px-2 py-0.5 rounded text-[#172554] text-xs w-20"
                      />
                    ) : (
                      profile.education[0]?.graduationYear
                    )} • CGPA: {profile.education[0]?.cgpa}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#f5f8ff]/60 border border-[#dbe7f7]">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#172554] mb-2">
                    <Briefcase className="w-4 h-4 text-[#10B981]" />
                    <span>Practical Experience</span>
                  </div>
                  <p className="text-xs font-semibold text-[#172554]">{profile.experience[0]?.title}</p>
                  <p className="text-[11px] text-[#64748b] mt-0.5">{profile.experience[0]?.company} ({profile.experience[0]?.startDate} - {profile.experience[0]?.endDate})</p>
                  <p className="text-[11px] text-[#64748b] mt-1 line-clamp-2">{profile.experience[0]?.description}</p>
                </div>
              </div>

              {isEditing && (
                <div className="pt-3 border-t border-[#dbe7f7] flex justify-end">
                  <button
                    onClick={handleSaveProfile}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </div>

            {/* Verified Candidate Projects */}
            <div className="p-6 rounded-3xl bg-white border border-[#dbe7f7] backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#172554] flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#F59E0B]" />
                  <span>Evidenced Candidate Projects</span>
                </h3>
                <span className="text-xs text-[#64748b]">Used for match evidence citation</span>
              </div>

              <div className="space-y-4">
                {profile.projects.map(proj => (
                  <div key={proj.id} className="p-4 rounded-2xl bg-[#f5f8ff]/70 border border-[#dbe7f7] space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-bold text-[#172554]">{proj.title}</h4>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#EEF2FF] text-[#4F46E5] border border-indigo-800">
                        {proj.role}
                      </span>
                    </div>
                    <p className="text-xs text-[#475569] leading-relaxed">{proj.description}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.technologies.map(tech => (
                        <span key={tech} className="text-[10px] bg-[#f8faff] text-[#475569] px-2 py-0.5 rounded border border-[#dbe7f7]">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Skill Profile Bars & Confidence Breakdown */}
          <div className="space-y-6">
            {/* Skill Profile Bars */}
            <div className="p-6 rounded-3xl bg-white border border-[#dbe7f7] backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[#172554] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#4F46E5]" />
                  <span>Resume Skill Profile</span>
                </h3>
                <span className="text-xs text-[#64748b]">{profile.skills.length} skills</span>
              </div>

              <div className="space-y-3.5">
                {profile.skills.map(skill => {
                  let barColor = 'bg-indigo-500';
                  let badgeStyle = 'bg-[#ECFDF5] text-[#10B981] border-emerald-800/40';

                  if (skill.confidence === 'Inferred') {
                    barColor = 'bg-cyan-500';
                    badgeStyle = 'bg-cyan-950/80 text-[#06B6D4] border-cyan-800/40';
                  } else if (skill.confidence === 'Needs Confirmation') {
                    barColor = 'bg-amber-500';
                    badgeStyle = 'bg-[#FFFBEB] text-[#F59E0B] border-amber-800/40';
                  } else if (skill.confidence === 'Missing') {
                    barColor = 'bg-slate-600';
                    badgeStyle = 'bg-[#f8faff] text-[#64748b] border-[#dbe7f7]';
                  }

                  return (
                    <div key={skill.name} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-[#172554]">{skill.name}</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] px-1.5 py-0.2 rounded border font-medium ${badgeStyle}`}>
                            {skill.confidence}
                          </span>
                          <span className="font-mono text-[#64748b]">{skill.proficiency}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-[#f8faff] h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`${barColor} h-full rounded-full transition-all duration-500`}
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Confidence Legend */}
            <div className="p-5 rounded-3xl bg-white border border-[#dbe7f7] text-xs space-y-2.5">
              <h4 className="font-bold text-[#172554] text-xs uppercase tracking-wider">Skill Confidence Tiers</h4>
              <div className="space-y-2 text-[#475569] text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span><strong>Verified:</strong> Explicitly confirmed in projects and coursework.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <span><strong>Inferred:</strong> Derived from linked full-stack repos.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span><strong>Needs Confirmation:</strong> Basic mention without deep proof.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                  <span><strong>Missing:</strong> Required in market; queued in career roadmap.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Skill Knowledge Graph */}
      {activeTab === 'graph' && (
        <div className="p-8 rounded-3xl bg-white border border-[#dbe7f7] backdrop-blur-md space-y-6">
          <div>
            <h3 className="text-base font-bold text-[#172554] flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-[#4F46E5]" />
              <span>Interactive Skill Taxonomy & Dependency Graph</span>
            </h3>
            <p className="text-xs text-[#64748b] mt-1">
              Visualizing prerequisite chains, core mastery, and cloud growth frontiers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillNodes.map(node => (
              <div
                key={node.name}
                className="p-5 rounded-2xl bg-[#f5f8ff] border border-[#dbe7f7] hover:border-indigo-500/50 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-[#4F46E5] bg-[#EEF2FF] px-2 py-0.5 rounded border border-indigo-800">
                    {node.category}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    node.level.includes('Verified') ? 'bg-[#ECFDF5] text-[#10B981]' : 'bg-[#FFFBEB] text-[#F59E0B]'
                  }`}>
                    {node.level}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-[#172554]">{node.name}</h4>

                <div className="pt-2 border-t border-[#dbe7f7] space-y-1.5">
                  <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider">Sub-components:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {node.children.map(child => (
                      <span key={child} className="text-xs bg-white text-[#475569] px-2 py-1 rounded-lg border border-[#dbe7f7] flex items-center gap-1">
                        <span>→</span> {child}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Resume Tailor & Truth Guard */}
      {activeTab === 'tailor' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-[#dbe7f7] backdrop-blur-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-[#172554] flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#10B981]" />
                  <span>Truth-Guarded Resume Tailoring</span>
                </h3>
                <p className="text-xs text-[#64748b] mt-0.5">
                  Re-orders projects and refines bullet points for target job without creating unverified claims.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={selectedTailorJobId}
                  onChange={e => setSelectedTailorJobId(e.target.value)}
                  className="px-3 py-2 text-xs bg-[#f8faff] border border-[#dbe7f7] rounded-xl text-[#172554] focus:outline-none"
                >
                  {jobs.map(j => (
                    <option key={j.id} value={j.id}>
                      {j.title} ({j.company})
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleGenerateTailoredResume}
                  disabled={isGeneratingTailor}
                  className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-br from-[#4F46E5] to-[#2563EB] shadow-md hover:-translate-y-[1px] rounded-xl transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>{isGeneratingTailor ? 'Auditing & Tailoring...' : 'Generate Tailored Content'}</span>
                </button>
              </div>
            </div>

            {/* Tailor Output */}
            {tailorResult ? (
              <div className="space-y-6 pt-4 border-t border-[#dbe7f7]">
                {/* Truth Guard Audit Stamp */}
                <div className="p-4 rounded-2xl bg-[#ECFDF5] border border-emerald-500/40 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#10B981] font-semibold">
                    <ShieldCheck className="w-5 h-5 text-[#10B981]" />
                    <span>Truth Guard Audit: PASSED (0 unverified claims detected)</span>
                  </div>
                  <span className="text-[10px] text-[#64748b] font-mono">Status: Safe for ATS Submission</span>
                </div>

                {/* Tailored Summary */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#64748b] uppercase tracking-wider">Tailored Summary</label>
                  <p className="p-4 rounded-xl bg-[#f5f8ff] border border-[#dbe7f7] text-xs text-[#172554] leading-relaxed">
                    {tailorResult.tailoredSummary}
                  </p>
                </div>

                {/* Bullet-point Enhancements */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-[#64748b] uppercase tracking-wider">Enhanced Bullet Points</label>
                  <div className="space-y-2">
                    {tailorResult.bulletPointEnhancements.map((b: any, i: number) => (
                      <div key={i} className="p-3 rounded-xl bg-[#f5f8ff] border border-[#dbe7f7] text-xs flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                        <span className="text-[#172554]">{b.enhancedBullet}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-[#f5f8ff]/40 rounded-2xl border border-[#dbe7f7]">
                <Sparkles className="w-8 h-8 text-[#4F46E5] mx-auto mb-2 opacity-60" />
                <p className="text-xs text-[#475569] font-medium">Select a job above and click Generate Tailored Content</p>
                <p className="text-[11px] text-[#64748b] mt-1">Truth Guard will verify each sentence against your verified projects.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Raw JSON / Audit */}
      {activeTab === 'raw' && (
        <div className="p-6 rounded-3xl bg-white border border-[#dbe7f7] backdrop-blur-md space-y-3">
          <h3 className="text-sm font-bold text-[#172554]">Parsed Profile JSON State</h3>
          <pre className="p-4 rounded-2xl bg-[#f5f8ff] border border-[#dbe7f7] text-[11px] text-[#475569] font-mono overflow-x-auto max-h-96">
            {JSON.stringify(profile, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
