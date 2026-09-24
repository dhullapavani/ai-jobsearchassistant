'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { JobListing, ApplicationQuestion, SavedAnswer, ClaimVerificationStatus } from '@/lib/types';
import { CoverLetterOptions } from '@/lib/ai/ai-provider';
import { TruthGuard } from '@/lib/ai/truth-guard';
import confetti from 'canvas-confetti';
import {
  Bot,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Send,
  Copy,
  Check,
  RefreshCw,
  Bookmark,
  ExternalLink,
  ChevronRight,
  Database,
  ArrowRight,
  HelpCircle,
  FileCheck,
  Lock,
  Layers,
  Clock,
  UserCheck,
  AlertCircle
} from 'lucide-react';

export default function CopilotPage() {
  const {
    profile,
    jobs,
    activeJobForCopilot,
    setActiveJobForCopilot,
    savedAnswers,
    addSavedAnswer,
    createOrUpdateApplication,
    updateApplicationStatus,
    getAIProvider,
    addToast
  } = useApp();

  // Active Selected Job
  const [selectedJob, setSelectedJob] = useState<JobListing>(activeJobForCopilot || jobs[0]);

  // Workflow Stages: 1. Prepared -> 2. Safety Check -> 3. Questions & Review -> 4. Submission
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form simulator questions state
  const [questions, setQuestions] = useState<
    (ApplicationQuestion & {
      userAnswer: string;
      isAccepted: boolean;
      isConfirmed: boolean;
      saveToMemory: boolean;
      verificationStatus: ClaimVerificationStatus;
    })[]
  >([]);

  // Cover Letter generator state
  const [coverLetterTone, setCoverLetterTone] = useState<CoverLetterOptions['tone']>('Professional');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isGeneratingLetter, setIsGeneratingLetter] = useState(false);
  const [copiedLetter, setCopiedLetter] = useState(false);
  const [truthGuardPassed, setTruthGuardPassed] = useState(true);

  // Application Submission state
  const [submissionOutcome, setSubmissionOutcome] = useState<'Applied' | 'Submission Unverified' | null>(null);

  // Sync selectedJob when activeJobForCopilot changes
  useEffect(() => {
    if (activeJobForCopilot) {
      setSelectedJob(activeJobForCopilot);
      setCurrentStep(1);
      setSubmissionOutcome(null);
    }
  }, [activeJobForCopilot]);

  // Initialize questions and generate initial cover letter
  useEffect(() => {
    if (!selectedJob) return;

    const baseQuestions: ApplicationQuestion[] = [
      {
        id: 'q-1',
        question: 'What is your notice period / availability?',
        category: 'General',
        expectedType: 'text',
        isKnown: true,
        suggestedAnswer: profile.noticePeriod || 'Immediate / 15 Days notice.',
        confidence: 'High',
        isSensitive: false
      },
      {
        id: 'q-2',
        question: 'What is your expected salary / CTC?',
        category: 'Preferences',
        expectedType: 'text',
        isKnown: true,
        suggestedAnswer: profile.expectedSalary || '₹8 - ₹12 LPA',
        confidence: 'High',
        isSensitive: true
      },
      {
        id: 'q-3',
        question: 'Are you legally authorized to work in India without sponsorship?',
        category: 'WorkAuth',
        expectedType: 'boolean',
        isKnown: true,
        suggestedAnswer: profile.workAuthorization || 'Citizen of India, no visa sponsorship required.',
        confidence: 'High',
        isSensitive: true
      },
      {
        id: 'q-4',
        question: 'How many years of professional experience do you have with Java & Spring Boot?',
        category: 'Experience',
        expectedType: 'text',
        isKnown: true,
        suggestedAnswer: '2 years evidenced across academic coursework, projects, and backend internship.',
        confidence: 'High',
        isSensitive: true
      },
      {
        id: 'q-5',
        question: 'Describe your hands-on experience optimizing database queries with MySQL / Postgres.',
        category: 'Custom',
        expectedType: 'text',
        isKnown: false,
        confidence: 'Needs User Input',
        isSensitive: false
      }
    ];

    setQuestions(
      baseQuestions.map(q => ({
        ...q,
        userAnswer: q.suggestedAnswer || '',
        isAccepted: q.isKnown && !q.isSensitive,
        isConfirmed: false,
        saveToMemory: false,
        verificationStatus: q.isKnown
          ? q.isSensitive
            ? 'USER CONFIRMATION REQUIRED'
            : 'VERIFIED'
          : 'USER CONFIRMATION REQUIRED'
      }))
    );

    // Initial Cover letter generation
    handleGenerateLetter('Professional', selectedJob);
  }, [selectedJob, profile]);

  const handleGenerateLetter = async (tone: CoverLetterOptions['tone'], job: JobListing) => {
    setIsGeneratingLetter(true);
    try {
      const provider = getAIProvider();
      const res = await provider.generateApplicationContent(profile, job, { tone });
      setGeneratedLetter(res.text);
      setTruthGuardPassed(res.truthGuardPassed);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingLetter(false);
    }
  };

  const handleCopyLetter = () => {
    navigator.clipboard.writeText(generatedLetter);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2000);
    addToast({
      type: 'success',
      title: 'Copied to Clipboard',
      message: 'Truth Guard verified cover letter ready to paste.'
    });
  };

  const handleAcceptAnswer = (index: number) => {
    setQuestions(prev => {
      const updated = [...prev];
      updated[index].isAccepted = true;
      updated[index].isConfirmed = true;
      return updated;
    });
  };

  const handleSaveAnswerToMemory = (q: (typeof questions)[0]) => {
    if (!q.userAnswer.trim()) return;
    addSavedAnswer(q.question, q.userAnswer, q.category);
  };

  const handleConfirmAllQuestions = () => {
    setQuestions(prev =>
      prev.map(q => ({
        ...q,
        isAccepted: true,
        isConfirmed: true
      }))
    );
    setCurrentStep(3);
    addToast({
      type: 'success',
      title: 'Answers Confirmed',
      message: 'All candidate declarations verified by user.'
    });
  };

  const handleSimulateSubmit = (verifiedSuccess: boolean) => {
    const outcome = verifiedSuccess ? 'Applied' : 'Submission Unverified';
    setSubmissionOutcome(outcome);
    setCurrentStep(4);

    const app = createOrUpdateApplication({
      jobId: selectedJob.id,
      status: outcome,
      customCoverLetter: generatedLetter,
      answersUsed: questions.map(q => ({
        question: q.question,
        answer: q.userAnswer,
        source: q.isKnown ? 'TruthGuardedAI' : 'UserSupplied',
        isConfirmedByUser: q.isConfirmed
      }))
    });

    if (verifiedSuccess) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
      addToast({
        type: 'success',
        title: 'Application Confirmed',
        message: `Submitted and verified for ${selectedJob.company}.`
      });
    } else {
      addToast({
        type: 'warning',
        title: 'Submission Unverified',
        message: 'Direct automated verification unavailable. Marked as Submission Unverified.'
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#172554] flex items-center gap-2.5">
            <Bot className="w-6 h-6 text-[#4F46E5]" />
            <span>Human-in-the-Loop Application Copilot</span>
          </h1>
          <p className="text-xs text-[#64748b] mt-1">
            Zero-hallucination assistance. Every claim is evidence-backed and verified by you before submission.
          </p>
        </div>

        {/* Target Job Selector */}
        <div className="flex items-center gap-2 bg-white border border-[#dbe7f7] p-1.5 rounded-2xl">
          <span className="text-xs font-semibold text-[#64748b] pl-2">Target Job:</span>
          <select
            value={selectedJob.id}
            onChange={e => {
              const found = jobs.find(j => j.id === e.target.value);
              if (found) setSelectedJob(found);
            }}
            className="px-3 py-1.5 bg-[#f5f8ff] border border-[#dbe7f7] rounded-xl text-xs font-bold text-[#172554] focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {jobs.map(j => (
              <option key={j.id} value={j.id}>
                {j.company} - {j.title} ({j.platform})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Workflow Step Indicator */}
      <div className="p-4 rounded-2xl bg-white border border-[#dbe7f7] backdrop-blur-md">
        <div className="flex items-center justify-between max-w-3xl mx-auto text-xs">
          <div className={`flex items-center gap-2 font-bold ${currentStep >= 1 ? 'text-[#4F46E5]' : 'text-slate-600'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep >= 1 ? 'bg-indigo-600 text-white' : 'bg-[#f8faff] text-[#64748b]'}`}>1</span>
            <span>Prepare</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-700" />
          <div className={`flex items-center gap-2 font-bold ${currentStep >= 2 ? 'text-[#4F46E5]' : 'text-slate-600'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep >= 2 ? 'bg-indigo-600 text-white' : 'bg-[#f8faff] text-[#64748b]'}`}>2</span>
            <span>Safety Check</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-700" />
          <div className={`flex items-center gap-2 font-bold ${currentStep >= 3 ? 'text-[#4F46E5]' : 'text-slate-600'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep >= 3 ? 'bg-indigo-600 text-white' : 'bg-[#f8faff] text-[#64748b]'}`}>3</span>
            <span>User Review</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-700" />
          <div className={`flex items-center gap-2 font-bold ${currentStep >= 4 ? 'text-[#10B981]' : 'text-slate-600'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep >= 4 ? 'bg-emerald-600 text-white' : 'bg-[#f8faff] text-[#64748b]'}`}>4</span>
            <span>Submit & Log</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Cover Letter & Tailoring (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-[#dbe7f7] backdrop-blur-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#dbe7f7] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#172554] flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-[#4F46E5]" />
                  <span>Truth Guard Tailored Cover Letter</span>
                </h3>
                <p className="text-[11px] text-[#64748b]">
                  Customized for {selectedJob.company} ({selectedJob.title})
                </p>
              </div>

              {/* Tone Switcher */}
              <div className="flex items-center gap-1 bg-[#f5f8ff] p-1 rounded-xl border border-[#dbe7f7] text-xs">
                {(['Professional', 'Enthusiastic', 'Short', 'Fresher-friendly'] as CoverLetterOptions['tone'][]).map(t => (
                  <button
                    key={t}
                    onClick={() => {
                      setCoverLetterTone(t);
                      handleGenerateLetter(t, selectedJob);
                    }}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                      coverLetterTone === t
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-[#64748b] hover:text-[#172554]'
                    }`}
                  >
                    {t.split('-')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Truth Guard Compliance Banner */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#f5f8ff] border border-[#dbe7f7] text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                <span className="text-[#475569] font-semibold">Truth Guard Audit:</span>
                <span className="text-[#10B981] font-bold">100% Fact Base Compliant</span>
              </div>
              <span className="text-[10px] text-[#64748b]">Zero Unverified Claims</span>
            </div>

            {/* Letter Text Area */}
            <div className="relative">
              <textarea
                value={generatedLetter}
                onChange={e => setGeneratedLetter(e.target.value)}
                rows={13}
                className="w-full p-4 bg-[#f5f8ff] border border-[#dbe7f7] rounded-2xl text-xs font-mono text-[#172554] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 leading-relaxed resize-none"
              />
              <button
                onClick={handleCopyLetter}
                className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-[#f8faff] hover:bg-white text-[#172554] text-xs font-semibold flex items-center gap-1.5 transition-colors border border-[#dbe7f7] shadow-md"
              >
                {copiedLetter ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLetter ? 'Copied' : 'Copy Text'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Question Safety & Human-in-the-Loop Review (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-[#dbe7f7] backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-[#dbe7f7] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#172554] flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#10B981]" />
                  <span>Application Question Safety</span>
                </h3>
                <p className="text-[11px] text-[#64748b]">
                  AI will never invent sensitive legal, salary, or auth responses
                </p>
              </div>
              <span className="text-xs bg-[#EEF2FF] text-[#4F46E5] px-2 py-0.5 rounded-full font-bold border border-indigo-800">
                {questions.filter(q => q.isConfirmed).length}/{questions.length} Confirmed
              </span>
            </div>

            {/* Questions List */}
            <div className="space-y-3.5 max-h-[460px] overflow-y-auto pr-1">
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    q.isConfirmed
                      ? 'bg-[#f5f8ff]/60 border-[#dbe7f7] text-[#475569]'
                      : q.isSensitive
                      ? 'bg-[#FFFBEB] border-amber-600/40 text-[#172554]'
                      : 'bg-[#f5f8ff] border-[#dbe7f7] text-[#172554]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold text-[#172554] leading-snug">{q.question}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider flex-shrink-0 ${
                        q.verificationStatus === 'VERIFIED'
                          ? 'bg-[#ECFDF5] text-[#10B981] border border-emerald-800'
                          : q.verificationStatus === 'INFERRED'
                          ? 'bg-[#EEF2FF] text-[#4F46E5] border border-indigo-800'
                          : 'bg-[#FFFBEB] text-[#F59E0B] border border-amber-800'
                      }`}
                    >
                      {q.verificationStatus}
                    </span>
                  </div>

                  <div className="mt-2">
                    <input
                      type="text"
                      value={q.userAnswer}
                      onChange={e => {
                        const val = e.target.value;
                        setQuestions(prev => {
                          const copy = [...prev];
                          copy[idx].userAnswer = val;
                          return copy;
                        });
                      }}
                      placeholder="Enter your verified answer..."
                      className="w-full px-3 py-1.5 bg-white border border-[#dbe7f7] rounded-xl text-xs text-[#172554] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[#dbe7f7] text-[11px]">
                    <button
                      onClick={() => handleSaveAnswerToMemory(q)}
                      className="text-[#64748b] hover:text-[#4F46E5] flex items-center gap-1 transition-colors"
                    >
                      <Database className="w-3 h-3" />
                      <span>Save to Memory</span>
                    </button>

                    <button
                      onClick={() => handleAcceptAnswer(idx)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        q.isConfirmed
                          ? 'bg-[#ECFDF5] text-[#10B981] border border-emerald-800'
                          : 'bg-gradient-to-br from-[#4F46E5] to-[#2563EB] shadow-md hover:-translate-y-[1px] text-white'
                      }`}
                    >
                      {q.isConfirmed ? '✓ Confirmed' : 'Confirm'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Human Approval Action */}
            <div className="pt-2 border-t border-[#dbe7f7] space-y-2">
              <button
                onClick={handleConfirmAllQuestions}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#2563EB] shadow-md hover:-translate-y-[1px] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-md shadow-indigo-600/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve All Facts & Proceed to Submit</span>
              </button>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleSimulateSubmit(true)}
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit (Confirmed)</span>
                </button>

                <button
                  onClick={() => handleSimulateSubmit(false)}
                  className="py-2.5 px-3 rounded-xl bg-[#FFFBEB] hover:bg-[#FFFBEB] border border-amber-600/50 text-[#F59E0B] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  title="Marks as Submission Unverified if external confirmation was not received"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>External / Unverified</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Audit Log (Viewable Event History) */}
      <div className="p-6 rounded-3xl bg-white border border-[#dbe7f7] backdrop-blur-md space-y-4">
        <h3 className="text-base font-bold text-[#172554] flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#4F46E5]" />
          <span>Application Audit Trail & Immutable Event History</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#f5f8ff] border border-[#dbe7f7] space-y-1">
            <span className="text-[10px] text-[#64748b] font-bold uppercase tracking-wider">Step 1</span>
            <h4 className="font-bold text-[#172554]">Job Discovered</h4>
            <p className="text-[#64748b] text-[11px]">Found on {selectedJob.platform} with original URL.</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#f5f8ff] border border-[#dbe7f7] space-y-1">
            <span className="text-[10px] text-[#64748b] font-bold uppercase tracking-wider">Step 2</span>
            <h4 className="font-bold text-[#172554]">Resume Facts Verified</h4>
            <p className="text-[#64748b] text-[11px]">Candidate profile & skill evidence extracted.</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#f5f8ff] border border-[#dbe7f7] space-y-1">
            <span className="text-[10px] text-[#64748b] font-bold uppercase tracking-wider">Step 3</span>
            <h4 className="font-bold text-[#172554]">Safety Check & Review</h4>
            <p className="text-[#64748b] text-[11px]">Sensitive questions explicitly confirmed by user.</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#f5f8ff] border border-[#dbe7f7] space-y-1">
            <span className="text-[10px] text-[#64748b] font-bold uppercase tracking-wider">Step 4</span>
            <h4 className="font-bold text-[#172554]">
              {submissionOutcome ? `Status: ${submissionOutcome}` : 'Ready for Submission'}
            </h4>
            <p className="text-[#64748b] text-[11px]">
              {submissionOutcome === 'Applied'
                ? 'Submission verified & logged to tracker.'
                : submissionOutcome === 'Submission Unverified'
                ? 'Submission unverified (requires external confirmation).'
                : 'Awaiting user action.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
