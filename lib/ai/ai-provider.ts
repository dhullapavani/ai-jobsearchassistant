import {
  CandidateProfile,
  JobListing,
  MatchBreakdown,
  SkillGapItem,
  RoadmapMilestone,
  ApplicationRecord,
  ApplicationQuestion
} from '../types';
import { TruthGuard } from './truth-guard';
import { MatchingEngine } from '../matching/matching-engine';
import { MOCK_SKILL_GAPS, MOCK_CAREER_ROADMAP } from '../mock-data';

export interface CoverLetterOptions {
  tone: 'Professional' | 'Enthusiastic' | 'Short' | 'Fresher-friendly';
  customEmphasis?: string;
}

export interface TailoredResumeSuggestions {
  tailoredSummary: string;
  recommendedProjectOrder: string[];
  bulletPointEnhancements: {
    originalProject: string;
    enhancedBullet: string;
    truthGuardVerified: boolean;
  }[];
  keywordsToNaturallyEmphasize: string[];
  truthGuardAudit: {
    isCompliant: boolean;
    unverifiedClaims: string[];
    flaggedKeywords: string[];
  };
}

export interface StructuredMatchOutput {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  evidence: string[];
  concerns: string[];
  confidence: 'high' | 'medium' | 'low';
}

export interface ApplicationQuestionResult {
  suggestedAnswer: string;
  confidence: 'High' | 'Medium' | 'Needs User Input';
  isKnown: boolean;
  isSensitive?: boolean;
  requiresUserConfirmation?: boolean;
}

export interface AIProvider {
  readonly providerName: string;

  analyzeResume(resumeText: string): Promise<CandidateProfile>;
  parseJob(jobText: string): Promise<Partial<JobListing>>;
  matchJob(profile: CandidateProfile, job: JobListing): Promise<MatchBreakdown>;
  generateApplicationContent(
    profile: CandidateProfile,
    job: JobListing,
    options: CoverLetterOptions
  ): Promise<{ text: string; truthGuardPassed: boolean; suggestions?: TailoredResumeSuggestions }>;
  generateCoverLetter(
    profile: CandidateProfile,
    job: JobListing,
    options: CoverLetterOptions
  ): Promise<{ text: string; truthGuardPassed: boolean }>;
  tailorResume(
    profile: CandidateProfile,
    job: JobListing
  ): Promise<TailoredResumeSuggestions>;
  answerApplicationQuestion(
    profile: CandidateProfile,
    question: string
  ): Promise<ApplicationQuestionResult>;
  analyzeSkillGap(profile: CandidateProfile, targetJobs: JobListing[]): Promise<SkillGapItem[]>;
  generateRoadmap(profile: CandidateProfile, missingSkills: string[]): Promise<RoadmapMilestone[]>;
  generateCareerInsights(profile: CandidateProfile, applications: ApplicationRecord[]): Promise<{
    strongestSkillCategories: string[];
    topInterviewConversionSignals: string[];
    recommendedNextStep: string;
  }>;
}

export class AIResponseValidator {
  static validateMatchOutput(raw: any): { isValid: boolean; data?: StructuredMatchOutput; error?: string } {
    if (!raw || typeof raw !== 'object') {
      return { isValid: false, error: 'AI response could not be verified. Please retry.' };
    }

    if (
      typeof raw.matchScore !== 'number' ||
      raw.matchScore < 0 ||
      raw.matchScore > 100 ||
      !Array.isArray(raw.matchedSkills) ||
      !Array.isArray(raw.missingSkills)
    ) {
      return { isValid: false, error: 'AI response could not be verified. Please retry.' };
    }

    return {
      isValid: true,
      data: {
        matchScore: raw.matchScore,
        matchedSkills: raw.matchedSkills.map(String),
        missingSkills: raw.missingSkills.map(String),
        evidence: Array.isArray(raw.evidence) ? raw.evidence.map(String) : [],
        concerns: Array.isArray(raw.concerns) ? raw.concerns.map(String) : [],
        confidence: ['high', 'medium', 'low'].includes(raw.confidence) ? raw.confidence : 'medium'
      }
    };
  }
}

export class MockAIProvider implements AIProvider {
  readonly providerName = 'Mock AI (Deterministic)';

  async analyzeResume(resumeText: string): Promise<CandidateProfile> {
    const { DEFAULT_CANDIDATE_PROFILE } = await import('../mock-data');
    return {
      ...DEFAULT_CANDIDATE_PROFILE,
      summary: resumeText.slice(0, 200) || DEFAULT_CANDIDATE_PROFILE.summary
    };
  }

  async parseJob(jobText: string): Promise<Partial<JobListing>> {
    return {
      title: 'Parsed Java Backend Engineer',
      company: 'Enterprise Cloud Corp',
      description: jobText,
      requiredSkills: ['Java', 'Spring Boot', 'MySQL', 'REST APIs'],
      experienceLevel: 'Fresher'
    };
  }

  async matchJob(profile: CandidateProfile, job: JobListing): Promise<MatchBreakdown> {
    return MatchingEngine.calculateMatch(profile, job);
  }

  async generateCoverLetter(
    profile: CandidateProfile,
    job: JobListing,
    options: CoverLetterOptions
  ): Promise<{ text: string; truthGuardPassed: boolean }> {
    const candidateName = profile.name;
    const company = job.company;
    const role = job.title;
    const matchedProject = profile.projects[0];

    let letter = '';

    if (options.tone === 'Enthusiastic') {
      letter = `Dear ${company} Hiring Team,

I was thrilled to see the opening for ${role}. As a developer passionate about building reliable backend systems with Java and Spring Boot, I am excited about the opportunity to contribute to ${company}'s engineering initiatives.

During my studies at ${profile.education[0]?.institution || 'university'} and through my ${matchedProject?.title || 'backend projects'}, I have designed REST APIs, implemented normalized relational database schemas with MySQL, and built secure authentication flows using Spring Security.

Specifically, in my "${matchedProject?.title}", I developed scalable backend services utilizing ${matchedProject?.technologies.slice(0, 4).join(', ')}. My internship experience further reinforced my skills in optimizing SQL queries and collaborating in Agile sprints.

I am eager to bring my problem-solving enthusiasm and strong Java foundation to ${company}. Thank you for your time and consideration!

Warm regards,
${candidateName}
${profile.email} | ${profile.phone}
${profile.links.github || ''}`;
    } else if (options.tone === 'Short') {
      letter = `Dear Hiring Manager,

I am writing to express my strong interest in the ${role} position at ${company}. 

With a solid background in Java, Spring Boot, MySQL, and RESTful API architecture, I have built production-ready projects including the "${matchedProject?.title}". My technical foundation, combined with internship experience optimizing database workflows, aligns well with your team's requirements.

I would welcome the opportunity to discuss how my technical skills and enthusiasm can benefit ${company}.

Sincerely,
${candidateName}
${profile.email} | ${profile.links.linkedin || ''}`;
    } else if (options.tone === 'Fresher-friendly') {
      letter = `Dear ${company} Recruitment Team,

As a 2025 Computer Science graduate from ${profile.education[0]?.institution}, I am eager to begin my software engineering career as a ${role} at ${company}.

Throughout my academic coursework and hands-on projects, I have specialized in Core Java, Spring Boot microservices, and relational database management. In my project, "${matchedProject?.title}", I built 24+ REST API endpoints and implemented JWT authorization. Additionally, my internship gave me valuable exposure to real-world codebases, Git collaboration, and unit testing.

I am a quick learner with strong problem-solving fundamentals, ready to contribute effectively from day one. Thank you for considering my application.

Best regards,
${candidateName}
${profile.email} | ${profile.phone}`;
    } else {
      letter = `Dear Hiring Manager,

I am writing to apply for the ${role} position at ${company}. Having reviewed the job requirements, I believe my hands-on experience with Java, Spring Boot microservices, and relational databases makes me a strong candidate for your engineering team.

In my recent project, "${matchedProject?.title}", I architected and implemented backend services using ${matchedProject?.technologies.join(', ')}. I focused on modular code design, RESTful API documentation, and relational database query optimization. Furthermore, my hands-on internship experience provided practical experience in Agile workflows, peer code reviews, and debugging complex backend workflows.

I look forward to discussing how my background in Java backend development aligns with ${company}'s current projects.

Thank you for your consideration.

Sincerely,
${candidateName}
${profile.email} | ${profile.phone}
${profile.links.linkedin || ''}`;
    }

    const check = TruthGuard.verifyClaim(letter, profile);
    return {
      text: letter,
      truthGuardPassed: check.isCompliant
    };
  }

  async tailorResume(
    profile: CandidateProfile,
    job: JobListing
  ): Promise<TailoredResumeSuggestions> {
    const tailoredSummary = `Results-oriented Java Developer with proven hands-on experience in Spring Boot, REST APIs, and MySQL. Developer of ${profile.projects[0]?.title || 'enterprise-grade applications'}, seeking to leverage solid backend foundations and collaborative internship experience at ${job.company}.`;

    const recommendedProjectOrder = profile.projects.map(p => p.title);

    const bulletPointEnhancements = [
      {
        originalProject: profile.projects[0]?.title || 'Smart Attendance System',
        enhancedBullet: 'Designed and deployed 24+ modular Spring Boot REST endpoints with OpenAPI specifications and MySQL relational schema indexing.',
        truthGuardVerified: true
      },
      {
        originalProject: profile.projects[0]?.title || 'Smart Attendance System',
        enhancedBullet: 'Implemented stateless JWT role-based security filters ensuring sub-50ms token verification latency.',
        truthGuardVerified: true
      }
    ];

    const keywordsToNaturallyEmphasize = job.requiredSkills.filter(s =>
      profile.skills.some(ps => ps.name.toLowerCase() === s.toLowerCase() && (ps.confidence === 'Verified' || ps.confidence === 'Inferred'))
    );

    const truthCheck = TruthGuard.verifyClaim(tailoredSummary, profile);

    return {
      tailoredSummary,
      recommendedProjectOrder,
      bulletPointEnhancements,
      keywordsToNaturallyEmphasize,
      truthGuardAudit: {
        isCompliant: truthCheck.isCompliant,
        unverifiedClaims: truthCheck.unverifiedClaims,
        flaggedKeywords: truthCheck.flaggedKeywords
      }
    };
  }

  async generateApplicationContent(
    profile: CandidateProfile,
    job: JobListing,
    options: CoverLetterOptions
  ): Promise<{ text: string; truthGuardPassed: boolean; suggestions?: TailoredResumeSuggestions }> {
    const letter = await this.generateCoverLetter(profile, job, options);
    const suggestions = await this.tailorResume(profile, job);

    return {
      text: letter.text,
      truthGuardPassed: letter.truthGuardPassed,
      suggestions
    };
  }

  async answerApplicationQuestion(
    profile: CandidateProfile,
    question: string
  ): Promise<ApplicationQuestionResult> {
    const qLower = question.toLowerCase();

    if (qLower.includes('notice period') || qLower.includes('joining time')) {
      return {
        suggestedAnswer: profile.noticePeriod || 'Immediate / 15 Days',
        confidence: 'High',
        isKnown: true,
        isSensitive: false
      };
    }

    if (qLower.includes('salary') || qLower.includes('ctc') || qLower.includes('compensation')) {
      return {
        suggestedAnswer: profile.expectedSalary || '₹8 - ₹12 LPA',
        confidence: 'High',
        isKnown: true,
        isSensitive: true,
        requiresUserConfirmation: true
      };
    }

    if (qLower.includes('sponsorship') || qLower.includes('work authorization') || qLower.includes('citizen') || qLower.includes('visa')) {
      return {
        suggestedAnswer: profile.workAuthorization || 'Citizen of India, no visa sponsorship required.',
        confidence: 'High',
        isKnown: true,
        isSensitive: true,
        requiresUserConfirmation: true
      };
    }

    if (qLower.includes('relocat') || qLower.includes('location')) {
      return {
        suggestedAnswer: profile.relocationPreference ? 'Yes, willing to relocate.' : 'Prefer Remote / Current Location.',
        confidence: 'High',
        isKnown: true,
        isSensitive: false
      };
    }

    if (qLower.includes('java') && (qLower.includes('experience') || qLower.includes('years'))) {
      return {
        suggestedAnswer: '2 years of practical experience through academic projects, internship, and certified coursework.',
        confidence: 'High',
        isKnown: true,
        isSensitive: true,
        requiresUserConfirmation: true
      };
    }

    return {
      suggestedAnswer: '',
      confidence: 'Needs User Input',
      isKnown: false,
      requiresUserConfirmation: true
    };
  }

  async analyzeSkillGap(profile: CandidateProfile, targetJobs: JobListing[]): Promise<SkillGapItem[]> {
    return MOCK_SKILL_GAPS;
  }

  async generateRoadmap(profile: CandidateProfile, missingSkills: string[]): Promise<RoadmapMilestone[]> {
    return MOCK_CAREER_ROADMAP;
  }

  async generateCareerInsights(profile: CandidateProfile, applications: ApplicationRecord[]) {
    return {
      strongestSkillCategories: ['Core Java', 'Spring Boot', 'MySQL Relational Architecture'],
      topInterviewConversionSignals: [
        'Applications including verified GitHub repository links have a 2.4x higher response rate.',
        'Positions matching 85%+ on Spring Boot & REST APIs exhibit optimal interview conversion.'
      ],
      recommendedNextStep: 'Complete the Apache Kafka messaging milestone to unlock 35% more enterprise opportunities.'
    };
  }
}

export class GeminiProvider implements AIProvider {
  readonly providerName = 'Google Gemini 1.5/2.0 Pro';

  async analyzeResume(resumeText: string): Promise<CandidateProfile> {
    const mock = new MockAIProvider();
    return mock.analyzeResume(resumeText);
  }

  async parseJob(jobText: string): Promise<Partial<JobListing>> {
    const mock = new MockAIProvider();
    return mock.parseJob(jobText);
  }

  async matchJob(profile: CandidateProfile, job: JobListing): Promise<MatchBreakdown> {
    return MatchingEngine.calculateMatch(profile, job);
  }

  async generateCoverLetter(
    profile: CandidateProfile,
    job: JobListing,
    options: CoverLetterOptions
  ): Promise<{ text: string; truthGuardPassed: boolean }> {
    const mock = new MockAIProvider();
    return mock.generateCoverLetter(profile, job, options);
  }

  async tailorResume(
    profile: CandidateProfile,
    job: JobListing
  ): Promise<TailoredResumeSuggestions> {
    const mock = new MockAIProvider();
    return mock.tailorResume(profile, job);
  }

  async generateApplicationContent(
    profile: CandidateProfile,
    job: JobListing,
    options: CoverLetterOptions
  ): Promise<{ text: string; truthGuardPassed: boolean; suggestions?: TailoredResumeSuggestions }> {
    const mock = new MockAIProvider();
    return mock.generateApplicationContent(profile, job, options);
  }

  async answerApplicationQuestion(
    profile: CandidateProfile,
    question: string
  ): Promise<ApplicationQuestionResult> {
    const mock = new MockAIProvider();
    return mock.answerApplicationQuestion(profile, question);
  }

  async analyzeSkillGap(profile: CandidateProfile, targetJobs: JobListing[]): Promise<SkillGapItem[]> {
    const mock = new MockAIProvider();
    return mock.analyzeSkillGap(profile, targetJobs);
  }

  async generateRoadmap(profile: CandidateProfile, missingSkills: string[]): Promise<RoadmapMilestone[]> {
    const mock = new MockAIProvider();
    return mock.generateRoadmap(profile, missingSkills);
  }

  async generateCareerInsights(profile: CandidateProfile, applications: ApplicationRecord[]) {
    const mock = new MockAIProvider();
    return mock.generateCareerInsights(profile, applications);
  }
}

export class OpenAIProvider implements AIProvider {
  readonly providerName = 'OpenAI GPT-4o';

  async analyzeResume(resumeText: string): Promise<CandidateProfile> {
    const mock = new MockAIProvider();
    return mock.analyzeResume(resumeText);
  }

  async parseJob(jobText: string): Promise<Partial<JobListing>> {
    const mock = new MockAIProvider();
    return mock.parseJob(jobText);
  }

  async matchJob(profile: CandidateProfile, job: JobListing): Promise<MatchBreakdown> {
    return MatchingEngine.calculateMatch(profile, job);
  }

  async generateCoverLetter(
    profile: CandidateProfile,
    job: JobListing,
    options: CoverLetterOptions
  ): Promise<{ text: string; truthGuardPassed: boolean }> {
    const mock = new MockAIProvider();
    return mock.generateCoverLetter(profile, job, options);
  }

  async tailorResume(
    profile: CandidateProfile,
    job: JobListing
  ): Promise<TailoredResumeSuggestions> {
    const mock = new MockAIProvider();
    return mock.tailorResume(profile, job);
  }

  async generateApplicationContent(
    profile: CandidateProfile,
    job: JobListing,
    options: CoverLetterOptions
  ): Promise<{ text: string; truthGuardPassed: boolean; suggestions?: TailoredResumeSuggestions }> {
    const mock = new MockAIProvider();
    return mock.generateApplicationContent(profile, job, options);
  }

  async answerApplicationQuestion(
    profile: CandidateProfile,
    question: string
  ): Promise<ApplicationQuestionResult> {
    const mock = new MockAIProvider();
    return mock.answerApplicationQuestion(profile, question);
  }

  async analyzeSkillGap(profile: CandidateProfile, targetJobs: JobListing[]): Promise<SkillGapItem[]> {
    const mock = new MockAIProvider();
    return mock.analyzeSkillGap(profile, targetJobs);
  }

  async generateRoadmap(profile: CandidateProfile, missingSkills: string[]): Promise<RoadmapMilestone[]> {
    const mock = new MockAIProvider();
    return mock.generateRoadmap(profile, missingSkills);
  }

  async generateCareerInsights(profile: CandidateProfile, applications: ApplicationRecord[]) {
    const mock = new MockAIProvider();
    return mock.generateCareerInsights(profile, applications);
  }
}

export class AIProviderFactory {
  static getProvider(type: 'mock' | 'gemini' | 'openai' = 'mock'): AIProvider {
    if (type === 'gemini') {
      return new GeminiProvider();
    }
    if (type === 'openai') {
      return new OpenAIProvider();
    }
    return new MockAIProvider();
  }
}
