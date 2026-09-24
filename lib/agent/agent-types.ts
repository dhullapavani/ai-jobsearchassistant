export interface UserIntent {
  rawQuery: string;
  targetRole?: string;
  location?: string;
  minSalaryLPA?: number;
  minMatchThreshold?: number;
  workMode?: 'Remote' | 'On-site' | 'Hybrid' | 'Flexible';
  requiredSkills: string[];
}

export interface AgentAction {
  type: 'SEARCH_JOBS' | 'ANALYZE_RESUME' | 'MATCH_JOBS' | 'REQUEST_APPROVAL' | 'LAUNCH_COPILOT' | 'ERROR';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  payload?: any;
  result?: any;
  message?: string;
}

export interface AgentState {
  intent: UserIntent | null;
  actions: AgentAction[];
  currentStep: number;
  isComplete: boolean;
  discoveredJobs: any[];
  matchedJobs: any[];
}
