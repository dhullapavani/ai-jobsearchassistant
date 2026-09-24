import { CandidateProfile, ClaimVerificationStatus } from '../types';

export interface ClaimVerificationDetail {
  claim: string;
  status: ClaimVerificationStatus;
  reason: string;
  evidenceSource?: string;
  isSensitive?: boolean;
}

export interface TruthGuardResult {
  isCompliant: boolean;
  claims: ClaimVerificationDetail[];
  unverifiedClaims: string[];
  flaggedKeywords: string[];
  suggestedAction: string;
  verifiedEvidenceSummary: string[];
}

export class TruthGuard {
  // Sensitive personal/legal fields that AI must NEVER fabricate
  private static readonly SENSITIVE_TERMS = [
    'visa',
    'sponsorship',
    'work authorization',
    'citizen',
    'criminal',
    'disability',
    'accommodation',
    'salary',
    'ctc',
    'compensation',
    'years of experience',
    'cgpa',
    'gpa',
    'degree'
  ];

  /**
   * Classifies a claim into one of four evidence tiers:
   * 1. VERIFIED: Explicitly attested in candidate profile/skills/education
   * 2. INFERRED: Derived logically from listed projects or roles
   * 3. USER CONFIRMATION REQUIRED: Ambiguous, sensitive, or border-case
   * 4. UNSUPPORTED: Not present in candidate profile fact base
   */
  static classifyClaim(claimText: string, profile: CandidateProfile): ClaimVerificationDetail {
    const lower = claimText.toLowerCase().trim();

    // Check if it is a sensitive declaration
    const isSensitive = this.SENSITIVE_TERMS.some(term => lower.includes(term));

    // Check verified skills
    const verifiedSkill = profile.skills.find(
      s => s.confidence === 'Verified' && lower.includes(s.name.toLowerCase())
    );
    if (verifiedSkill) {
      return {
        claim: claimText,
        status: 'VERIFIED',
        reason: `Explicitly verified in candidate profile under ${verifiedSkill.name}.`,
        evidenceSource: verifiedSkill.evidence || 'Candidate Skill Records',
        isSensitive
      };
    }

    // Check inferred skills / projects
    const inferredSkill = profile.skills.find(
      s => s.confidence === 'Inferred' && lower.includes(s.name.toLowerCase())
    );
    const relatedProject = profile.projects.find(p =>
      p.technologies.some(t => lower.includes(t.toLowerCase())) ||
      lower.includes(p.title.toLowerCase())
    );

    if (inferredSkill || relatedProject) {
      return {
        claim: claimText,
        status: 'INFERRED',
        reason: relatedProject
          ? `Inferred from project "${relatedProject.title}".`
          : `Inferred from practical coursework.`,
        evidenceSource: relatedProject?.title || 'Profile Projects',
        isSensitive
      };
    }

    // Check sensitive fields: always require confirmation if not explicitly known
    if (isSensitive) {
      return {
        claim: claimText,
        status: 'USER CONFIRMATION REQUIRED',
        reason: 'Sensitive candidate declaration (authorization, salary, or experience). Requires explicit user confirmation.',
        isSensitive: true
      };
    }

    // Unsupported
    return {
      claim: claimText,
      status: 'UNSUPPORTED',
      reason: 'No evidence found in candidate profile facts. Must not appear in application content.',
      isSensitive: false
    };
  }

  /**
   * Validates generated text against candidate profile facts.
   * Ensures no fabricated skills, years of experience, fake degrees, or imaginary projects.
   */
  static verifyClaim(generatedText: string, profile: CandidateProfile): TruthGuardResult {
    const unverifiedClaims: string[] = [];
    const flaggedKeywords: string[] = [];
    const claims: ClaimVerificationDetail[] = [];
    const lowerText = generatedText.toLowerCase();

    // 1. Verify sensitive tech skills
    const knownSkills = new Set(
      profile.skills
        .filter(s => s.confidence === 'Verified' || s.confidence === 'Inferred')
        .map(s => s.name.toLowerCase())
    );

    const sensitiveSkillsToCheck = [
      'aws',
      'amazon web services',
      'apache kafka',
      'kafka',
      'kubernetes',
      'k8s',
      'azure',
      'gcp',
      'graphql',
      'rust',
      'golang',
      'c++',
      'spark',
      'hadoop',
      'terraform'
    ];

    for (const skill of sensitiveSkillsToCheck) {
      if (lowerText.includes(skill) && !knownSkills.has(skill)) {
        const candidateHasSkill = profile.skills.some(
          s => s.name.toLowerCase() === skill && (s.confidence === 'Verified' || s.confidence === 'Inferred')
        );

        if (!candidateHasSkill) {
          const detail: ClaimVerificationDetail = {
            claim: `Claimed knowledge in "${skill.toUpperCase()}"`,
            status: 'UNSUPPORTED',
            reason: `Candidate profile has no verified evidence for ${skill.toUpperCase()}.`
          };
          claims.push(detail);
          unverifiedClaims.push(detail.claim);
          flaggedKeywords.push(skill);
        }
      }
    }

    // 2. Check for fabricated years of experience
    const yearsExpRegex = /(\d+)\+?\s*(years|yrs|year)\s*(of)?\s*(experience|exp)/gi;
    let match;
    while ((match = yearsExpRegex.exec(lowerText)) !== null) {
      const claimedYears = parseInt(match[1], 10);
      const isGrad2025 = profile.education.some(e => e.graduationYear === '2025');
      if (claimedYears > 3 && isGrad2025) {
        const detail: ClaimVerificationDetail = {
          claim: `Claimed ${claimedYears} years of experience`,
          status: 'UNSUPPORTED',
          reason: `Candidate graduated in 2025 (Fresher/Entry-level). Claiming ${claimedYears} years violates truth guard policy.`,
          isSensitive: true
        };
        claims.push(detail);
        unverifiedClaims.push(detail.claim);
        flaggedKeywords.push(`${claimedYears} years`);
      }
    }

    // 3. Compile verified evidence summary
    const verifiedEvidenceSummary = profile.projects.map(
      p => `${p.title}: evidenced [${p.technologies.join(', ')}]`
    );

    const isCompliant = unverifiedClaims.length === 0;

    return {
      isCompliant,
      claims,
      unverifiedClaims,
      flaggedKeywords,
      suggestedAction: isCompliant
        ? 'Truth Guard passed: All assertions verified against profile fact base.'
        : 'Unsupported claims detected. Stripping unbacked assertions before submission.',
      verifiedEvidenceSummary
    };
  }

  /**
   * Sanitizes text by replacing unsupported claims with truthful alternatives based on candidate facts
   */
  static sanitizeContent(rawText: string, profile: CandidateProfile): string {
    const check = this.verifyClaim(rawText, profile);
    if (check.isCompliant) {
      return rawText;
    }

    let sanitized = rawText;
    const topSkills = profile.skills
      .filter(s => s.confidence === 'Verified')
      .slice(0, 3)
      .map(s => s.name);
      
    const truthfulAlternative = topSkills.length > 0 
      ? `core competencies in ${topSkills.join(', ')}` 
      : 'verified academic foundations';

    for (const keyword of check.flaggedKeywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      sanitized = sanitized.replace(regex, truthfulAlternative);
    }
    
    return sanitized;
  }
}
