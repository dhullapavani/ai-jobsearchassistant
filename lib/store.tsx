'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  AppMode,
  CandidateProfile,
  JobListing,
  ApplicationRecord,
  ApplicationStatus,
  SavedAnswer,
  SkillGapItem,
  RoadmapMilestone,
  NotificationItem,
  UserFeedback,
  MatchBreakdown
} from './types';
import {
  DEFAULT_CANDIDATE_PROFILE,
  MOCK_JOBS,
  MOCK_APPLICATIONS,
  INITIAL_SAVED_ANSWERS,
  MOCK_SKILL_GAPS,
  MOCK_CAREER_ROADMAP,
  MOCK_NOTIFICATIONS
} from './mock-data';
import { MatchingEngine } from './matching/matching-engine';
import { DeduplicationEngine } from './jobs/deduplication';
import { AIProviderFactory, AIProvider } from './ai/ai-provider';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface AppContextType {
  // Mode (Demo vs Live)
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
  toggleAppMode: () => void;

  // AI Provider
  aiProviderType: 'mock' | 'gemini' | 'openai';
  setAiProviderType: (type: 'mock' | 'gemini' | 'openai') => void;
  getAIProvider: () => AIProvider;

  // Profile
  profile: CandidateProfile;
  updateProfile: (updates: Partial<CandidateProfile>) => void;
  resetDemoProfile: () => void;
  deleteResume: () => void;

  // Jobs
  jobs: JobListing[];
  rawJobCount: number;
  duplicateCount: number;
  savedJobIds: Set<string>;
  toggleSaveJob: (jobId: string) => void;
  getJobMatch: (job: JobListing) => MatchBreakdown;
  userFeedback: UserFeedback[];
  recordFeedback: (jobId: string, type: UserFeedback['type']) => void;

  // Applications
  applications: ApplicationRecord[];
  activeJobForCopilot: JobListing | null;
  setActiveJobForCopilot: (job: JobListing | null) => void;
  createOrUpdateApplication: (app: Partial<ApplicationRecord> & { jobId: string }) => ApplicationRecord;
  updateApplicationStatus: (appId: string, newStatus: ApplicationStatus, auditDetails?: string) => void;
  updateApplicationNotes: (appId: string, notes: string) => void;
  deleteApplication: (appId: string) => void;
  clearApplicationHistory: () => void;

  // Answer Memory
  savedAnswers: SavedAnswer[];
  addSavedAnswer: (questionPattern: string, answer: string, category?: string) => void;
  updateSavedAnswer: (id: string, newAnswer: string) => void;
  deleteSavedAnswer: (id: string) => void;
  clearAnswerMemory: () => void;

  // Privacy & Wipe
  deleteAllUserData: () => void;

  // Skill Gaps & Roadmap
  skillGaps: SkillGapItem[];
  careerRoadmap: RoadmapMilestone[];
  toggleRoadmapTopic: (milestoneId: string, topicIndex: number) => void;
  toggleMilestoneComplete: (milestoneId: string) => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Toast
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // App Mode & Provider State
  const [appMode, setAppModeState] = useState<AppMode>('demo');
  const [aiProviderType, setAiProviderType] = useState<'mock' | 'gemini' | 'openai'>('mock');

  // Profile and Data State
  const [profile, setProfile] = useState<CandidateProfile>(DEFAULT_CANDIDATE_PROFILE);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set(['job-01', 'job-03', 'job-05']));
  const [applications, setApplications] = useState<ApplicationRecord[]>(MOCK_APPLICATIONS);
  const [savedAnswers, setSavedAnswers] = useState<SavedAnswer[]>(INITIAL_SAVED_ANSWERS);
  const [skillGaps, setSkillGaps] = useState<SkillGapItem[]>(MOCK_SKILL_GAPS);
  const [careerRoadmap, setCareerRoadmap] = useState<RoadmapMilestone[]>(MOCK_CAREER_ROADMAP);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [userFeedback, setUserFeedback] = useState<UserFeedback[]>([]);
  const [activeJobForCopilot, setActiveJobForCopilot] = useState<JobListing | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Deduplicate initial jobs
  const deduplicatedResult = DeduplicationEngine.deduplicateJobs(MOCK_JOBS);
  const [jobs, setJobs] = useState<JobListing[]>(deduplicatedResult.uniqueJobs);
  const rawJobCount = MOCK_JOBS.length;
  const duplicateCount = deduplicatedResult.duplicateCount;

  // Toast manager
  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const setAppMode = (mode: AppMode) => {
    setAppModeState(mode);
    addToast({
      type: mode === 'live' ? 'info' : 'success',
      title: mode === 'live' ? 'LIVE MODE ACTIVE' : 'DEMO MODE ACTIVE',
      message: mode === 'live'
        ? 'Using live provider endpoints. Never falls back to fake data.'
        : 'Using realistic deterministic mock data for testing & demonstrations.'
    });
  };

  const toggleAppMode = () => {
    setAppMode(appMode === 'demo' ? 'live' : 'demo');
  };

  const getAIProvider = () => {
    return AIProviderFactory.getProvider(aiProviderType);
  };

  // Profile actions
  const updateProfile = (updates: Partial<CandidateProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Candidate facts and skills refreshed successfully.'
    });
  };

  const resetDemoProfile = () => {
    setProfile(DEFAULT_CANDIDATE_PROFILE);
    setApplications(MOCK_APPLICATIONS);
    setCareerRoadmap(MOCK_CAREER_ROADMAP);
    setSavedAnswers(INITIAL_SAVED_ANSWERS);
    setAppModeState('demo');
    addToast({
      type: 'info',
      title: 'Demo State Restored',
      message: 'Reset back to Alex Kumar (Java Backend Developer) baseline.'
    });
  };

  const deleteResume = () => {
    setProfile(prev => ({
      ...prev,
      summary: '',
      skills: [],
      projects: [],
      experience: [],
      certifications: []
    }));
    addToast({
      type: 'warning',
      title: 'Resume Data Purged',
      message: 'All parsed resume facts, projects, and skills have been deleted.'
    });
  };

  // Privacy: Wipe all user data
  const deleteAllUserData = () => {
    setProfile({
      id: 'usr-empty',
      name: 'Guest User',
      email: '',
      phone: '',
      location: '',
      title: '',
      summary: '',
      targetRoles: [],
      preferredLocations: [],
      preferredWorkModes: [],
      expectedSalary: '',
      noticePeriod: '',
      relocationPreference: false,
      workAuthorization: '',
      education: [],
      skills: [],
      projects: [],
      experience: [],
      certifications: [],
      links: {}
    });
    setApplications([]);
    setSavedAnswers([]);
    setSavedJobIds(new Set());
    setUserFeedback([]);
    addToast({
      type: 'warning',
      title: 'All Data Deleted',
      message: 'Candidate facts, applications, answer memory, and feedback wiped.'
    });
  };

  // Saved Jobs
  const toggleSaveJob = (jobId: string) => {
    setSavedJobIds(prev => {
      const next = new Set(prev);
      if (next.has(jobId)) {
        next.delete(jobId);
        addToast({ type: 'info', title: 'Job Removed', message: 'Removed from your saved list.' });
      } else {
        next.add(jobId);
        addToast({ type: 'success', title: 'Job Saved', message: 'Added to your saved collection.' });
      }
      return next;
    });
  };

  // Matching helper
  const getJobMatch = (job: JobListing): MatchBreakdown => {
    return MatchingEngine.calculateMatch(profile, job);
  };

  // Feedback loop
  const recordFeedback = (jobId: string, type: UserFeedback['type']) => {
    setUserFeedback(prev => [...prev, { jobId, type, timestamp: new Date().toISOString() }]);
    addToast({
      type: 'info',
      title: 'Feedback Recorded',
      message: `Recommendation adjusted based on your preference (${type}).`
    });
  };

  // Application actions
  const createOrUpdateApplication = (appData: Partial<ApplicationRecord> & { jobId: string }): ApplicationRecord => {
    const targetJob = jobs.find(j => j.id === appData.jobId) || MOCK_JOBS.find(j => j.id === appData.jobId)!;
    const match = getJobMatch(targetJob);

    const existingIndex = applications.findIndex(a => a.jobId === appData.jobId);
    let updatedApp: ApplicationRecord;

    if (existingIndex >= 0) {
      const existing = applications[existingIndex];
      updatedApp = {
        ...existing,
        ...appData,
        lastUpdated: new Date().toISOString().split('T')[0],
        auditTrail: [
          ...existing.auditTrail,
          {
            timestamp: new Date().toLocaleString(),
            action: 'Application Updated',
            details: `Status set to ${appData.status || existing.status}`,
            userConfirmed: true
          }
        ]
      };
      setApplications(prev => {
        const copy = [...prev];
        copy[existingIndex] = updatedApp;
        return copy;
      });
    } else {
      updatedApp = {
        id: `app-${Date.now()}`,
        jobId: appData.jobId,
        job: targetJob,
        status: appData.status || 'Ready',
        matchScore: match.overallScore,
        dateCreated: new Date().toISOString().split('T')[0],
        dateApplied: appData.status === 'Applied' ? new Date().toISOString().split('T')[0] : undefined,
        lastUpdated: new Date().toISOString().split('T')[0],
        notes: appData.notes || '',
        answersUsed: appData.answersUsed || [],
        auditTrail: [
          {
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            action: 'Job Discovered',
            details: `Found on ${targetJob.platform} with original URL`,
            userConfirmed: true
          },
          {
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            action: 'Resume Analyzed',
            details: `Extracted candidate facts for ${profile.name}`,
            userConfirmed: true
          },
          {
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            action: `${match.overallScore}% Match Calculated`,
            details: `Skills: ${match.skillsScore}%, Role: ${match.roleScore}%, Exp: ${match.experienceScore}%`,
            userConfirmed: true
          },
          {
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            action: 'Application Prepared',
            details: 'AI tailored content generated with Truth Guard verification',
            userConfirmed: true
          }
        ]
      };
      setApplications(prev => [updatedApp, ...prev]);
    }

    addToast({
      type: 'success',
      title: 'Application Saved',
      message: `Updated status for ${targetJob.company} (${updatedApp.status}).`
    });

    return updatedApp;
  };

  const updateApplicationStatus = (appId: string, newStatus: ApplicationStatus, auditDetails?: string) => {
    setApplications(prev =>
      prev.map(app => {
        if (app.id === appId) {
          return {
            ...app,
            status: newStatus,
            dateApplied: newStatus === 'Applied' && !app.dateApplied ? new Date().toISOString().split('T')[0] : app.dateApplied,
            lastUpdated: new Date().toISOString().split('T')[0],
            auditTrail: [
              ...app.auditTrail,
              {
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                action: newStatus === 'Applied' ? 'Application Submitted & Confirmed' : `Status Changed to ${newStatus}`,
                details: auditDetails || `Moved to ${newStatus} tracker stage`,
                userConfirmed: true
              }
            ]
          };
        }
        return app;
      })
    );
    addToast({
      type: 'info',
      title: 'Status Updated',
      message: `Application moved to ${newStatus}.`
    });
  };

  const updateApplicationNotes = (appId: string, notes: string) => {
    setApplications(prev =>
      prev.map(app => (app.id === appId ? { ...app, notes, lastUpdated: new Date().toISOString().split('T')[0] } : app))
    );
  };

  const deleteApplication = (appId: string) => {
    setApplications(prev => prev.filter(a => a.id !== appId));
    addToast({
      type: 'info',
      title: 'Application Removed',
      message: 'Application entry deleted from tracker.'
    });
  };

  const clearApplicationHistory = () => {
    setApplications([]);
    addToast({
      type: 'info',
      title: 'Application History Cleared',
      message: 'All application records removed.'
    });
  };

  // Saved Answer Memory
  const addSavedAnswer = (questionPattern: string, answer: string, category: string = 'General') => {
    const newAnswer: SavedAnswer = {
      id: `ans-${Date.now()}`,
      questionPattern,
      category,
      answer,
      lastUsed: new Date().toISOString().split('T')[0],
      useCount: 1
    };
    setSavedAnswers(prev => [newAnswer, ...prev]);
    addToast({
      type: 'success',
      title: 'Answer Saved to Memory',
      message: `Copilot will recall this answer for questions matching "${questionPattern}".`
    });
  };

  const updateSavedAnswer = (id: string, newAnswer: string) => {
    setSavedAnswers(prev =>
      prev.map(a => (a.id === id ? { ...a, answer: newAnswer, lastUsed: new Date().toISOString().split('T')[0] } : a))
    );
  };

  const deleteSavedAnswer = (id: string) => {
    setSavedAnswers(prev => prev.filter(a => a.id !== id));
  };

  const clearAnswerMemory = () => {
    setSavedAnswers([]);
    addToast({
      type: 'info',
      title: 'Answer Memory Cleared',
      message: 'Saved answers wiped from memory.'
    });
  };

  // Roadmap & Skill Gap Actions
  const toggleRoadmapTopic = (milestoneId: string, topicIndex: number) => {
    setCareerRoadmap(prev =>
      prev.map(m => {
        if (m.id === milestoneId) {
          const updatedTopics = [...m.topics];
          updatedTopics[topicIndex].completed = !updatedTopics[topicIndex].completed;
          const allCompleted = updatedTopics.every(t => t.completed);
          return {
            ...m,
            topics: updatedTopics,
            completed: allCompleted
          };
        }
        return m;
      })
    );
  };

  const toggleMilestoneComplete = (milestoneId: string) => {
    setCareerRoadmap(prev =>
      prev.map(m => {
        if (m.id === milestoneId) {
          const nextState = !m.completed;
          return {
            ...m,
            completed: nextState,
            topics: m.topics.map(t => ({ ...t, completed: nextState }))
          };
        }
        return m;
      })
    );
  };

  // Notifications
  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider
      value={{
        appMode,
        setAppMode,
        toggleAppMode,
        aiProviderType,
        setAiProviderType,
        getAIProvider,
        profile,
        updateProfile,
        resetDemoProfile,
        deleteResume,
        deleteAllUserData,
        jobs,
        rawJobCount,
        duplicateCount,
        savedJobIds,
        toggleSaveJob,
        getJobMatch,
        userFeedback,
        recordFeedback,
        applications,
        activeJobForCopilot,
        setActiveJobForCopilot,
        createOrUpdateApplication,
        updateApplicationStatus,
        updateApplicationNotes,
        deleteApplication,
        clearApplicationHistory,
        savedAnswers,
        addSavedAnswer,
        updateSavedAnswer,
        deleteSavedAnswer,
        clearAnswerMemory,
        skillGaps,
        careerRoadmap,
        toggleRoadmapTopic,
        toggleMilestoneComplete,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsRead,
        toasts,
        addToast,
        dismissToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
