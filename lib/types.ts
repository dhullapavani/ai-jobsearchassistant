export type AppMode = 'demo' | 'live';

export type PlatformSource = 'LinkedIn' | 'Naukri' | 'Unstop' | 'Company Careers' | 'Manual' | 'Indeed';

export type WorkMode = 'Remote' | 'Hybrid' | 'On-site';
export type JobType = 'Full-time' | 'Internship' | 'Contract';
export type ExperienceLevel = 'Fresher' | '0-1 years' | '1-3 years' | '3-5 years' | '5+ years';

export type SkillConfidence = 'Verified' | 'Inferred' | 'Missing' | 'Needs Confirmation';

export type ClaimVerificationStatus = 'VERIFIED' | 'INFERRED' | 'USER CONFIRMATION REQUIRED' | 'UNSUPPORTED';

export interface ExtractedSkill {
  name: string;
  category: 'Languages' | 'Frameworks' | 'Databases' | 'Cloud' | 'Tools' | 'Concepts';
  proficiency: number; // 0 - 100
  confidence: SkillConfidence;
  evidence?: string;
  yearsOfExp?: number;
}

export interface CandidateEducation {
  degree: string;
  field: string;
  institution: string;
  graduationYear: string;
  cgpa?: string;
}

export interface CandidateProject {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  role?: string;
  link?: string;
  highlightSnippets?: string[];
}

export interface CandidateExperience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  technologies: string[];
}

export interface CandidateProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  summary: string;
  targetRoles: string[];
  preferredLocations: string[];
  preferredWorkModes: WorkMode[];
  expectedSalary: string;
  noticePeriod: string;
  relocationPreference: boolean;
  workAuthorization: string;
  education: CandidateEducation[];
  skills: ExtractedSkill[];
  projects: CandidateProject[];
  experience: CandidateExperience[];
  certifications: string[];
  links: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
  };
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  platform: PlatformSource;
  location: string;
  workMode: WorkMode;
  salary: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  experienceLevel: ExperienceLevel;
  jobType: JobType;
  postedTime: string;
  postedTimestamp: number;
  retrievedAt?: string;
  retrievedTimestamp?: number;
  lastCheckedTimestamp?: number;
  originalJobUrl?: string;
  isExpired?: boolean;
  isUnavailable?: boolean;
  directAutomationAvailable?: boolean;
  directAutomationNote?: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  jobUrl: string;
  applicationUrl: string;
  applicationMethod: 'Direct' | 'External' | 'EasyApply' | 'Assisted';
  duplicateCount?: number;
  duplicateSources?: PlatformSource[];
  duplicateUrls?: { platform: PlatformSource; url: string }[];
  duplicateGroupId?: string;
  department?: string;
  applicantCount?: number;
  qualityScore: number; // 0 - 100
  riskScore: 'Low' | 'Medium' | 'High' | 'Review';
  riskSignals: string[];
  riskEvidence?: string[];
  riskConfidence?: 'Low' | 'Medium' | 'High';
  qualityMetrics: {
    descriptionCompleteness: number; // 0-100
    skillsClarity: number;
    salaryTransparency: number;
    companyVerified: boolean;
    duplicateLikelihood: number;
  };
}

export interface MatchBreakdown {
  overallScore: number; // 0 - 100
  skillsScore: number;
  experienceScore: number;
  roleScore: number;
  locationScore: number;
  educationScore: number;
  priorityCategory: 'High Priority' | 'Review' | 'Low Relevance';
  priorityReason: string;
  matchedSkills: string[];
  missingSkills: string[];
  evidencePoints: {
    skillOrAspect: string;
    candidateEvidence: string;
    isTruthGuarded: boolean;
    verificationStatus?: ClaimVerificationStatus;
  }[];
  potentialConcerns: string[];
  whatYouHave: string[];
  whatNeedsImprovement: string[];
  applicationReadiness: number; // 0 - 100
  readinessChecks: {
    label: string;
    passed: boolean;
    note?: string;
  }[];
  whyAmISeeingThis?: string[];
}

export type ApplicationStatus =
  | 'Saved'
  | 'Review'
  | 'Ready'
  | 'Applied'
  | 'Submission Unverified'
  | 'Assessment'
  | 'Interview'
  | 'Offer'
  | 'Rejected'
  | 'Withdrawn';

export interface ApplicationRecord {
  id: string;
  jobId: string;
  job: JobListing;
  status: ApplicationStatus;
  matchScore: number;
  dateCreated: string;
  dateApplied?: string;
  lastUpdated: string;
  notes?: string;
  customCoverLetter?: string;
  customSummary?: string;
  answersUsed: {
    question: string;
    answer: string;
    source: 'AnswerMemory' | 'UserSupplied' | 'TruthGuardedAI';
    isConfirmedByUser?: boolean;
  }[];
  auditTrail: {
    timestamp: string;
    action: string;
    details: string;
    userConfirmed: boolean;
  }[];
}

export interface ApplicationQuestion {
  id: string;
  question: string;
  category: 'General' | 'Experience' | 'WorkAuth' | 'Technical' | 'Preferences' | 'Custom';
  expectedType: 'text' | 'select' | 'number' | 'boolean';
  options?: string[];
  suggestedAnswer?: string;
  isKnown: boolean;
  savedAnswerId?: string;
  confidence: 'High' | 'Medium' | 'Needs User Input';
  isSensitive?: boolean; // Visa, salary, auth, etc.
}

export interface SavedAnswer {
  id: string;
  questionPattern: string;
  category: string;
  answer: string;
  lastUsed: string;
  useCount: number;
}

export interface SkillGapItem {
  skill: string;
  category: string;
  frequencyInTargetJobs: number; // percentage e.g. 64%
  importance: 'Critical' | 'Recommended' | 'Bonus';
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  userStatus: 'Not in Resume' | 'Found in Projects' | 'Basic Mention';
  learningHours: number;
  topJobRolesRequiring: string[];
}

export interface RoadmapMilestone {
  id: string;
  week: number;
  title: string;
  skillFocus: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  prerequisites: string[];
  whyLearn: string;
  suggestedProject: {
    title: string;
    description: string;
    deliverable: string;
  };
  topics: {
    name: string;
    completed: boolean;
  }[];
  completed: boolean;
}

export interface MarketSkillDemand {
  skill: string;
  percentage: number;
  jobCount: number;
  averageSalary: string;
  growthTrend: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'job_alert' | 'application_update' | 'skill_trend' | 'interview_reminder' | 'system';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface UserFeedback {
  jobId: string;
  type: 'relevant' | 'not_relevant' | 'saved' | 'skipped' | 'applied' | 'interview' | 'rejected';
  timestamp: string;
}
