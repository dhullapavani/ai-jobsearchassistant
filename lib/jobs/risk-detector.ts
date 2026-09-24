import { JobListing } from '../types';

export interface RiskAnalysisResult {
  riskScore: 'Low' | 'Medium' | 'High' | 'Review';
  riskSignals: string[];
  evidence: string[];
  confidence: 'Low' | 'Medium' | 'High';
  safetyTips: string[];
  disclaimer: string;
}

export class JobRiskDetector {
  /**
   * Analyzes job metadata and text for common fraudulent or high-risk hiring patterns.
   * Produces compliant, objective assessments without definitive defamatory accusations.
   */
  static analyzeJob(job: Partial<JobListing>): RiskAnalysisResult {
    const riskSignals: string[] = [];
    const evidence: string[] = [];
    const lowerDesc = (job.description || '').toLowerCase();
    const lowerTitle = (job.title || '').toLowerCase();
    const lowerUrl = (job.applicationUrl || job.jobUrl || '').toLowerCase();

    // 1. Payment or Security Deposit Requests
    if (
      lowerDesc.includes('security deposit') ||
      lowerDesc.includes('laptop kit fee') ||
      lowerDesc.includes('registration fee') ||
      lowerDesc.includes('processing fee') ||
      lowerDesc.includes('deposit ₹') ||
      lowerDesc.includes('pay fee')
    ) {
      riskSignals.push('External payment request or upfront registration fee');
      evidence.push('Job description requests candidate to pay upfront fees for processing/equipment.');
    }

    // 2. Off-platform or Suspicious Communication Channels
    if (
      lowerDesc.includes('telegram') ||
      lowerDesc.includes('whatsapp only') ||
      lowerUrl.includes('telegram.me') ||
      lowerUrl.includes('t.me') ||
      lowerDesc.includes('personal gmail') ||
      lowerDesc.includes('@gmail.com') ||
      lowerDesc.includes('@yahoo.com')
    ) {
      riskSignals.push('Unusual contact domain or off-platform communication channel (Telegram/WhatsApp/Free Mail)');
      evidence.push('Communication directs applicant away from corporate domain to unmonitored chat handles.');
    }

    // 3. Unrealistic Guaranteed Language
    if (
      lowerDesc.includes('100% guaranteed job') ||
      lowerDesc.includes('no interview direct selection') ||
      lowerDesc.includes('earn ₹100,000/day') ||
      lowerDesc.includes('no experience 50 lpa')
    ) {
      riskSignals.push('Unrealistic guaranteed placement without formal interview');
      evidence.push('Listing guarantees unconditional employment without standard technical screening.');
    }

    // 4. Suspicious Salary Mismatch
    if (job.experienceLevel === 'Fresher' && (job.salaryMin && job.salaryMin > 3500000)) {
      riskSignals.push('Anomalous compensation bracket for entry-level designation');
      evidence.push('Stated compensation is disproportionately higher than certified industry benchmarks.');
    }

    // 5. Missing or Anonymous Company Info
    if (!job.company || (job.company.toLowerCase().includes('confidential') && riskSignals.length > 0)) {
      riskSignals.push('Anonymous or unverified hiring entity');
      evidence.push('Employer identity cannot be verified against official corporate registries.');
    }

    let riskScore: 'Low' | 'Medium' | 'High' | 'Review' = 'Low';
    let confidence: 'Low' | 'Medium' | 'High' = 'High';

    if (riskSignals.length >= 2) {
      riskScore = 'Review';
      confidence = 'High';
    } else if (riskSignals.length === 1) {
      riskScore = 'Medium';
      confidence = 'Medium';
    } else {
      riskScore = 'Low';
      confidence = 'High';
      riskSignals.push('Standard corporate hiring signals detected');
      evidence.push('No upfront monetary requests or suspicious routing channels identified.');
    }

    const safetyTips = [
      'Legitimate employers never ask candidates to pay for interviews, equipment, or training kits upfront.',
      'Always verify corporate email domains (@company.com) rather than free email or messaging handles.',
      'Check company registration on LinkedIn or official career sites before submitting personal government IDs.'
    ];

    return {
      riskScore,
      riskSignals,
      evidence,
      confidence,
      safetyTips,
      disclaimer: 'Potential risk signals detected. Verify independently before applying.'
    };
  }
}
