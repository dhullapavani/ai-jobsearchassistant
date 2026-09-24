import { UserIntent } from './agent-types';

export class IntentParser {
  /**
   * Parses natural language query into structured UserIntent.
   * In a production environment, this would call an LLM with structured output or function calling.
   */
  static async parseQuery(query: string): Promise<UserIntent> {
    // Simple heuristic parser for demo purposes before LLM integration
    const intent: UserIntent = {
      rawQuery: query,
      requiredSkills: [],
    };

    const lowerQuery = query.toLowerCase();

    // Extract Role (Basic heuristic)
    if (lowerQuery.includes('java')) {
      intent.targetRole = 'Java Developer';
      intent.requiredSkills.push('Java');
    }
    
    // Extract Location
    if (lowerQuery.includes('hyderabad')) intent.location = 'Hyderabad';
    if (lowerQuery.includes('bangalore') || lowerQuery.includes('bengaluru')) intent.location = 'Bengaluru';
    if (lowerQuery.includes('remote')) intent.workMode = 'Remote';
    
    // Extract Salary
    const salaryMatch = lowerQuery.match(/(\d+)\s*lpa/);
    if (salaryMatch) {
      intent.minSalaryLPA = parseInt(salaryMatch[1], 10);
    }
    
    // Extract Match threshold
    const matchScore = lowerQuery.match(/(\d+)%\s*match/);
    if (matchScore) {
      intent.minMatchThreshold = parseInt(matchScore[1], 10);
    }

    return intent;
  }
}
