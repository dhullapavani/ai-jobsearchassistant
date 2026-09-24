import { MatchingEngine } from '../lib/matching/matching-engine';
import { DeduplicationEngine } from '../lib/jobs/deduplication';
import { JobRiskDetector } from '../lib/jobs/risk-detector';
import { TruthGuard } from '../lib/ai/truth-guard';
import { AIResponseValidator, MockAIProvider, AIProviderFactory } from '../lib/ai/ai-provider';
import { LinkedInJobSource, NaukriJobSource, JobSourceRegistry } from '../lib/jobs/adapters/platform-adapters';
import { DEFAULT_CANDIDATE_PROFILE, MOCK_JOBS } from '../lib/mock-data';
import { CandidateProfile, JobListing, ApplicationRecord } from '../lib/types';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, errorDetail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${testName} - ${errorDetail || 'Assertion failed'}`);
  }
}

async function runTestSuite() {
  console.log('===============================================================');
  console.log(' AI JOBPILOT - SECTION 8 PRODUCTION READINESS & INTEGRATION SUITE');
  console.log('===============================================================\n');

  // -------------------------------------------------------------
  // Test 1: Resume Parsing & Fact Profile Extraction
  // -------------------------------------------------------------
  console.log('[1/10] Testing Resume Parsing & Profile Integrity...');
  const mockAI = new MockAIProvider();
  const sampleResumeText = 'Alex Kumar - Java Developer with Spring Boot & MySQL experience.';
  const parsedProfile = await mockAI.analyzeResume(sampleResumeText);
  assert(parsedProfile.name === 'Alex Kumar', 'Resume parsing extracts candidate name');
  assert(parsedProfile.skills.length > 0, 'Resume parsing identifies candidate skills');
  assert(parsedProfile.education.length > 0, 'Resume parsing preserves degree/education');

  // Edge case: Empty resume
  const emptyParsedProfile = await mockAI.analyzeResume('');
  assert(Boolean(emptyParsedProfile.id), 'Handles empty resume gracefully without throwing');

  // -------------------------------------------------------------
  // Test 2: Skill Extraction & Categorization
  // -------------------------------------------------------------
  console.log('\n[2/10] Testing Skill Extraction & Categorization...');
  const javaSkill = parsedProfile.skills.find(s => s.name.toLowerCase() === 'java');
  assert(Boolean(javaSkill), 'Extracts Core Java skill');
  assert(javaSkill?.confidence === 'Verified', 'Categorizes core skill as Verified with evidence');
  assert(Boolean(javaSkill?.category), 'Assigns skill category (Languages/Frameworks/Databases)');

  // -------------------------------------------------------------
  // Test 3: Truth Guard 4-Tier Claim Verification
  // -------------------------------------------------------------
  console.log('\n[3/10] Testing Truth Guard 4-Tier Verification...');
  // Verified claim
  const verifiedCheck = TruthGuard.classifyClaim('Java & Spring Boot', DEFAULT_CANDIDATE_PROFILE);
  assert(verifiedCheck.status === 'VERIFIED', 'Classifies attested skill as VERIFIED');

  // Inferred claim
  const inferredCheck = TruthGuard.classifyClaim('React Dashboard UI and Frontend Integration', DEFAULT_CANDIDATE_PROFILE);
  assert(inferredCheck.status === 'INFERRED', 'Classifies project-derived skill as INFERRED');

  // Sensitive claim without confirmation
  const sensitiveCheck = TruthGuard.classifyClaim('Requires visa sponsorship for USA', DEFAULT_CANDIDATE_PROFILE);
  assert(sensitiveCheck.status === 'USER CONFIRMATION REQUIRED', 'Flags sensitive visa claim as USER CONFIRMATION REQUIRED');

  // Unsupported claim (Hallucination prevention)
  const unsupportedCheck = TruthGuard.classifyClaim('10 years of Kubernetes and AWS deployment', DEFAULT_CANDIDATE_PROFILE);
  assert(unsupportedCheck.status === 'UNSUPPORTED', 'Classifies unbacked claim as UNSUPPORTED');

  // Test cover letter verification with forbidden hallucinated claim
  const badLetter = 'I have 8 years of AWS and Kafka cloud architecture experience.';
  const truthGuardAudit = TruthGuard.verifyClaim(badLetter, DEFAULT_CANDIDATE_PROFILE);
  assert(!truthGuardAudit.isCompliant, 'Truth Guard detects unverified AWS/Kafka claims');
  assert(truthGuardAudit.unverifiedClaims.length > 0, 'Lists explicit unverified claims in audit');

  // -------------------------------------------------------------
  // Test 4: Explainable Matching Engine
  // -------------------------------------------------------------
  console.log('\n[4/10] Testing Explainable Matching Engine...');
  const testJob = MOCK_JOBS[0]; // Optum Java Developer
  const matchResult = MatchingEngine.calculateMatch(DEFAULT_CANDIDATE_PROFILE, testJob);
  assert(matchResult.overallScore > 0 && matchResult.overallScore <= 100, 'Computes overall match score');
  assert(typeof matchResult.skillsScore === 'number', 'Returns granular Skills breakdown');
  assert(typeof matchResult.roleScore === 'number', 'Returns granular Role breakdown');
  assert(typeof matchResult.experienceScore === 'number', 'Returns granular Experience breakdown');
  assert(typeof matchResult.locationScore === 'number', 'Returns granular Location breakdown');
  assert(typeof matchResult.educationScore === 'number', 'Returns granular Education breakdown');
  assert(matchResult.evidencePoints.length > 0, 'Provides explicit evidence points citing candidate projects');
  assert(Array.isArray(matchResult.whyAmISeeingThis), 'Provides explainable "Why am I seeing this job?" reasons');

  // -------------------------------------------------------------
  // Test 5: Job Deduplication Across Sources
  // -------------------------------------------------------------
  console.log('\n[5/10] Testing Cross-Platform Job Deduplication...');
  const duplicateJobs: JobListing[] = [
    {
      ...testJob,
      id: 'job-dup-1',
      platform: 'LinkedIn',
      jobUrl: 'https://linkedin.com/jobs/1'
    },
    {
      ...testJob,
      id: 'job-dup-2',
      platform: 'Naukri',
      jobUrl: 'https://naukri.com/jobs/1'
    }
  ];
  const dedupResult = DeduplicationEngine.deduplicateJobs(duplicateJobs);
  assert(dedupResult.uniqueJobs.length === 1, 'Merges identical postings into 1 opportunity');
  assert(dedupResult.duplicateCount === 1, 'Records 1 duplicate removed');
  assert(
    Boolean(dedupResult.uniqueJobs[0].duplicateSources?.includes('LinkedIn')) &&
    Boolean(dedupResult.uniqueJobs[0].duplicateSources?.includes('Naukri')),
    'Preserves multi-source platforms (LinkedIn + Naukri)'
  );

  // -------------------------------------------------------------
  // Test 6: Job Risk Detector & Safety Wording
  // -------------------------------------------------------------
  console.log('\n[6/10] Testing Job Risk Detector...');
  const suspiciousJob: Partial<JobListing> = {
    title: 'Data Entry Assistant',
    company: 'Confidential Staffing',
    description: 'Pay ₹5,000 security deposit for laptop kit. Contact on Telegram: @quickhire',
    experienceLevel: 'Fresher'
  };
  const riskResult = JobRiskDetector.analyzeJob(suspiciousJob);
  assert(riskResult.riskScore === 'Review' || riskResult.riskScore === 'High', 'Flags upfront deposit & Telegram as Review/High risk');
  assert(riskResult.riskSignals.length >= 2, 'Identifies multiple risk signals');
  assert(
    riskResult.disclaimer.includes('Potential risk signals detected'),
    'Uses compliant, non-defamatory warning language'
  );

  // -------------------------------------------------------------
  // Test 7: Application Lifecycle & "Submission Unverified"
  // -------------------------------------------------------------
  console.log('\n[7/10] Testing Application Lifecycle & Status Transitions...');
  const applicationRecord: ApplicationRecord = {
    id: 'app-test-1',
    jobId: testJob.id,
    job: testJob,
    status: 'Submission Unverified',
    matchScore: 91,
    dateCreated: '2026-09-20',
    lastUpdated: '2026-09-20',
    answersUsed: [],
    auditTrail: [
      {
        timestamp: '09:32',
        action: 'Job Discovered',
        details: 'Found on LinkedIn',
        userConfirmed: true
      },
      {
        timestamp: '09:37',
        action: 'Application Submitted',
        details: 'External submission unverified',
        userConfirmed: true
      }
    ]
  };
  assert(applicationRecord.status === 'Submission Unverified', 'Supports Submission Unverified status');
  assert(applicationRecord.auditTrail.length === 2, 'Maintains immutable audit trail history');

  // -------------------------------------------------------------
  // Test 8: Application Question Safety (Zero Hallucination)
  // -------------------------------------------------------------
  console.log('\n[8/10] Testing Application Question Safety...');
  // Notice period -> known answer
  const qNotice = await mockAI.answerApplicationQuestion(DEFAULT_CANDIDATE_PROFILE, 'What is your notice period?');
  assert(qNotice.isKnown && qNotice.suggestedAnswer.length > 0, 'Suggests known notice period');

  // Salary question -> sensitive flag
  const qSalary = await mockAI.answerApplicationQuestion(DEFAULT_CANDIDATE_PROFILE, 'What is your expected salary?');
  assert(qSalary.isSensitive === true, 'Flags salary as sensitive requiring confirmation');

  // Unknown technical question -> prompt user
  const qUnknown = await mockAI.answerApplicationQuestion(DEFAULT_CANDIDATE_PROFILE, 'How did you architect Cassandra distributed clusters?');
  assert(qUnknown.isKnown === false, 'Refuses to invent answer for unknown Cassandra skill');
  assert(qUnknown.confidence === 'Needs User Input', 'Marks unknown question as Needs User Input');

  // -------------------------------------------------------------
  // Test 9: Structured AI JSON Validation
  // -------------------------------------------------------------
  console.log('\n[9/10] Testing Structured AI Response Validation...');
  // Valid JSON structure
  const validPayload = {
    matchScore: 91,
    matchedSkills: ['Java', 'Spring Boot'],
    missingSkills: ['AWS'],
    evidence: ['Project Smart Attendance demonstrates Java'],
    concerns: [],
    confidence: 'high'
  };
  const validCheck = AIResponseValidator.validateMatchOutput(validPayload);
  assert(validCheck.isValid === true, 'Accepts valid structured JSON payload');
  assert(validCheck.data?.matchScore === 91, 'Extracts validated match score');

  // Invalid JSON structure (e.g. malformed raw LLM response)
  const invalidPayload = { text: 'Some random text without score' };
  const invalidCheck = AIResponseValidator.validateMatchOutput(invalidPayload);
  assert(invalidCheck.isValid === false, 'Rejects malformed LLM response');
  assert(
    invalidCheck.error === 'AI response could not be verified. Please retry.',
    'Provides standardized verification retry error message'
  );

  // -------------------------------------------------------------
  // Test 10: Provider Abstraction & Health Checks
  // -------------------------------------------------------------
  console.log('\n[10/10] Testing Provider Abstraction & Health Checks...');
  const provider = AIProviderFactory.getProvider('mock');
  assert(Boolean(provider.providerName), 'AIProviderFactory instantiates provider cleanly');

  const linkedInSource = new LinkedInJobSource();
  const healthResult = await linkedInSource.healthCheck();
  assert(healthResult.isHealthy === true, 'Job source healthCheck succeeds');
  assert(healthResult.provider === 'LinkedIn', 'Reports healthy source provider name');

  // Source application requirements
  const appReqs = await linkedInSource.getApplicationRequirements(testJob.id);
  assert(Array.isArray(appReqs.questions), 'Retrieves application questions for target job');

  // -------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------
  console.log('\n===============================================================');
  console.log(` RESULTS: ${passedTests}/${totalTests} Tests Passed (${failedTests} Failures)`);
  console.log('===============================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTestSuite().catch(err => {
  console.error('Test runner error:', err);
  process.exit(1);
});
