import { UserIntent, AgentState, AgentAction } from './agent-types';
import { IntentParser } from './intent-parser';
import { JobListing, CandidateProfile } from '../types';
import { MatchingEngine } from '../matching/matching-engine';
import { DeduplicationEngine } from '../jobs/deduplication';
import { JobRiskDetector } from '../jobs/risk-detector';
import { TruthGuard } from '../ai/truth-guard';

export class CareerAgent {
  private state: AgentState;
  
  constructor() {
    this.state = {
      intent: null,
      actions: [],
      currentStep: 0,
      isComplete: false,
      discoveredJobs: [],
      matchedJobs: []
    };
  }

  getState(): AgentState {
    return this.state;
  }

  private addAction(action: AgentAction) {
    this.state.actions.push(action);
  }

  private updateLastAction(updates: Partial<AgentAction>) {
    if (this.state.actions.length === 0) return;
    const lastIdx = this.state.actions.length - 1;
    this.state.actions[lastIdx] = { ...this.state.actions[lastIdx], ...updates };
  }

  /**
   * Orchestrates the entire job discovery, matching, and presentation pipeline based on a natural language query.
   */
  async processQuery(query: string, profile: CandidateProfile, rawJobsSource: JobListing[]) {
    // Step 1: Parse Intent
    this.addAction({ type: 'SEARCH_JOBS', status: 'IN_PROGRESS', message: 'Parsing user intent...' });
    const intent = await IntentParser.parseQuery(query);
    this.state.intent = intent;
    
    // Step 2: Simulate fetching and deduplication (Normally from Adapters)
    this.updateLastAction({ message: 'Discovering & deduplicating jobs...', payload: intent });
    const dedupedJobs = DeduplicationEngine.deduplicateJobs(rawJobsSource).uniqueJobs;
    
    // Filter by basic intent (location, etc.) before expensive AI match
    let filteredJobs = dedupedJobs;
    if (intent.location) {
      filteredJobs = filteredJobs.filter(j => j.location.toLowerCase().includes(intent.location!.toLowerCase()));
    }
    
    // Step 3: Risk Detection
    filteredJobs = filteredJobs.filter(j => {
      const risk = JobRiskDetector.analyzeJob(j);
      return risk.riskScore !== 'High'; // Auto-filter out high scam risks
    });
    
    this.state.discoveredJobs = filteredJobs;
    this.updateLastAction({ status: 'COMPLETED', result: filteredJobs.length + ' jobs passed initial filters.' });
    
    // Step 4: AI Matching & Truth Guard validation
    this.addAction({ type: 'MATCH_JOBS', status: 'IN_PROGRESS', message: 'Running Explainable AI Match & Truth Guard...' });
    
    const scoredJobs = filteredJobs.map(job => {
      const matchResult = MatchingEngine.calculateMatch(profile, job);
      return { job, matchResult };
    });
    
    // Filter by match threshold if specified
    const threshold = intent.minMatchThreshold || 0;
    const highMatchJobs = scoredJobs.filter(j => j.matchResult.overallScore >= threshold)
      .sort((a, b) => b.matchResult.overallScore - a.matchResult.overallScore);
      
    this.state.matchedJobs = highMatchJobs;
    this.updateLastAction({ status: 'COMPLETED', result: highMatchJobs.length + ' high-match jobs found.' });
    
    // Step 5: Request Approval
    this.addAction({ type: 'REQUEST_APPROVAL', status: 'PENDING', message: 'Waiting for user to review matched jobs and select one for Copilot.' });
    
    this.state.isComplete = true;
    return this.state;
  }
}
