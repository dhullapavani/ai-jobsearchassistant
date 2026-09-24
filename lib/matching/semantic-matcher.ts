/**
 * Dictionary of semantic equivalents.
 * In a real production environment, this would be backed by an Embedding Model 
 * (like text-embedding-3-small) and cosine similarity comparisons.
 */
const SEMANTIC_KNOWLEDGE_BASE: Record<string, string[]> = {
  'restful services': ['rest', 'rest api', 'rest apis', 'restful apis', 'web services'],
  'cloud deployment': ['aws deployment', 'gcp deployment', 'azure deployment', 'cloud architecture', 'aws', 'docker'],
  'distributed messaging': ['apache kafka', 'kafka', 'rabbitmq', 'pub/sub', 'message queues'],
  'microservices': ['distributed systems', 'spring boot', 'docker', 'kubernetes'],
  'frontend': ['react', 'vue', 'angular', 'ui/ux', 'javascript', 'typescript', 'html/css']
};

export class SemanticMatcher {
  
  /**
   * Calculates semantic similarity between a required skill and a candidate's skill set.
   * Returns a score between 0 and 1.
   */
  static calculateSemanticSimilarity(requiredSkill: string, candidateSkills: string[]): number {
    const reqLower = requiredSkill.toLowerCase().trim();
    const candidateLowerSkills = candidateSkills.map(s => s.toLowerCase().trim());
    
    // 1. Exact Match
    if (candidateLowerSkills.includes(reqLower)) {
      return 1.0;
    }
    
    // 2. Partial Substring Match
    if (candidateLowerSkills.some(s => s.includes(reqLower) || reqLower.includes(s))) {
      return 0.8;
    }

    // 3. Knowledge Base Alias / Semantic Match
    for (const [concept, aliases] of Object.entries(SEMANTIC_KNOWLEDGE_BASE)) {
      const isRequiredInConcept = concept.includes(reqLower) || aliases.some(a => a.includes(reqLower));
      
      if (isRequiredInConcept) {
        // Does candidate have anything in this concept group?
        const candidateHasConcept = candidateLowerSkills.some(skill => 
          concept.includes(skill) || aliases.some(a => a.includes(skill))
        );
        
        if (candidateHasConcept) {
          return 0.7; // High semantic similarity
        }
      }
    }

    // 4. No Match
    return 0;
  }
}
