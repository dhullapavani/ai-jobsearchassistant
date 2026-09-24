import { JobListing, PlatformSource } from '../../types';
import { JobSource, JobSearchParams, HealthCheckResult, ApplicationRequirements } from './job-source-adapter';
import { MOCK_JOBS } from '../../mock-data';

/**
 * LinkedInAdapter — backwards-compat alias that delegates to the new JobSource interface.
 * Kept for any legacy imports in older pages.
 */
export class LinkedInAdapter implements JobSource {
  readonly platform: PlatformSource = 'LinkedIn';
  readonly isOfficialOrPermitted: boolean = true;

  async search(params: JobSearchParams): Promise<JobListing[]> {
    return MOCK_JOBS.filter(job => {
      const matchPlatform =
        job.platform === 'LinkedIn' ||
        (job.duplicateSources && job.duplicateSources.includes('LinkedIn'));
      if (!matchPlatform) return false;

      if (params.query) {
        const q = params.query.toLowerCase();
        const matchesQ =
          job.title.toLowerCase().includes(q) ||
          job.company.toLowerCase().includes(q) ||
          job.requiredSkills.some(s => s.toLowerCase().includes(q));
        if (!matchesQ) return false;
      }

      if (params.location && params.location !== 'All Locations') {
        if (
          !job.location.toLowerCase().includes(params.location.toLowerCase()) &&
          job.workMode !== 'Remote'
        ) {
          return false;
        }
      }

      return true;
    }).map(j => ({
      ...j,
      retrievedAt: j.retrievedAt || '2 minutes ago',
      retrievedTimestamp: j.retrievedTimestamp || Date.now() - 120000,
      lastCheckedTimestamp: j.lastCheckedTimestamp || Date.now(),
      originalJobUrl: j.originalJobUrl || j.jobUrl
    }));
  }

  /** @deprecated Use search() */
  async searchJobs(params: JobSearchParams): Promise<JobListing[]> {
    return this.search(params);
  }

  async getJobDetails(jobId: string): Promise<JobListing | null> {
    return MOCK_JOBS.find(j => j.id === jobId) || null;
  }

  async getApplicationUrl(jobId: string): Promise<string> {
    const job = await this.getJobDetails(jobId);
    return job?.applicationUrl || 'https://www.linkedin.com/jobs';
  }

  async getApplicationRequirements(jobId: string): Promise<ApplicationRequirements> {
    const job = await this.getJobDetails(jobId);
    const isEasyApply = job?.applicationMethod === 'EasyApply';

    return {
      requiresResume: true,
      requiresCoverLetter: true,
      submissionWorkflow: isEasyApply ? 'Direct' : 'Assisted',
      directAutomationAvailable: isEasyApply,
      noticeMessage: isEasyApply
        ? undefined
        : 'Direct automation unavailable for this source — open the official application page.',
      questions: [
        {
          id: 'q-1',
          question: 'What is your notice period?',
          category: 'General',
          expectedType: 'text',
          isKnown: true,
          suggestedAnswer: 'Immediate / 15 Days notice. Available to join right away.',
          confidence: 'High'
        },
        {
          id: 'q-2',
          question: 'What is your expected salary / CTC?',
          category: 'Preferences',
          expectedType: 'text',
          isKnown: true,
          isSensitive: true,
          suggestedAnswer: 'Expecting ₹8 - ₹12 LPA based on role requirements and company standards.',
          confidence: 'High'
        },
        {
          id: 'q-3',
          question: 'Are you willing to relocate to Hyderabad / Bengaluru?',
          category: 'Preferences',
          expectedType: 'boolean',
          isKnown: true,
          suggestedAnswer: 'Yes, fully willing to relocate.',
          confidence: 'High'
        },
        {
          id: 'q-4',
          question: 'Do you require visa sponsorship to work in India?',
          category: 'WorkAuth',
          expectedType: 'boolean',
          isKnown: true,
          isSensitive: true,
          suggestedAnswer: 'No, citizen of India.',
          confidence: 'High'
        },
        {
          id: 'q-5',
          question: 'How many years of Java and Spring Boot experience do you have?',
          category: 'Technical',
          expectedType: 'text',
          isKnown: true,
          isSensitive: true,
          suggestedAnswer: '2 years evidenced through academic projects, certifications, and backend internship.',
          confidence: 'High'
        },
        {
          id: 'q-6',
          question: 'Describe your experience with high-volume database query optimization.',
          category: 'Custom',
          expectedType: 'text',
          isKnown: false,
          confidence: 'Needs User Input'
        }
      ]
    };
  }

  async healthCheck(): Promise<HealthCheckResult> {
    return {
      isHealthy: true,
      provider: 'LinkedIn',
      latencyMs: 42,
      message: 'Permitted API / Partner integration operational',
      mode: 'demo'
    };
  }
}
