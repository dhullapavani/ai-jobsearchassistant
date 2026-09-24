import { JobListing, PlatformSource, ApplicationQuestion } from '../../types';

export interface JobSearchParams {
  query?: string;
  role?: string;
  location?: string;
  skills?: string[];
  workMode?: string;
  experience?: string;
  minSalary?: number;
  postedWithinDays?: number;
}

export interface HealthCheckResult {
  isHealthy: boolean;
  provider: PlatformSource;
  latencyMs: number;
  message: string;
  mode: 'demo' | 'live';
}

export interface ApplicationRequirements {
  requiresResume: boolean;
  requiresCoverLetter: boolean;
  questions: ApplicationQuestion[];
  submissionWorkflow: 'Direct' | 'External' | 'Assisted';
  directAutomationAvailable: boolean;
  noticeMessage?: string;
}

export interface JobSource {
  readonly platform: PlatformSource;
  readonly isOfficialOrPermitted: boolean;
  
  search(params: JobSearchParams): Promise<JobListing[]>;
  getJobDetails(jobId: string): Promise<JobListing | null>;
  getApplicationUrl(jobId: string): Promise<string>;
  getApplicationRequirements(jobId: string): Promise<ApplicationRequirements>;
  healthCheck(): Promise<HealthCheckResult>;
}

// Backwards compatibility alias
export type JobSourceAdapter = JobSource;
