import { CandidateProfile, JobListing, ApplicationRecord } from '../types';

export interface RetrievedContext {
  resumeEvidence: string[];
  relevantSkills: string[];
  relevantJobs: Partial<JobListing>[];
  relevantApplications: Partial<ApplicationRecord>[];
}

/**
 * RAG Retriever stub for Career Intelligence.
 * In production, this would query a vector DB (e.g., Pinecone/Milvus) using embeddings.
 */
export class CareerRetriever {
  /**
   * Retrieves grounded context based on a user query.
   */
  static async retrieveContext(
    query: string, 
    profile: CandidateProfile, 
    activeApplications: ApplicationRecord[]
  ): Promise<RetrievedContext> {
    const context: RetrievedContext = {
      resumeEvidence: [],
      relevantSkills: [],
      relevantJobs: [],
      relevantApplications: []
    };

    const lowerQuery = query.toLowerCase();

    // Naive local retrieval logic (to be replaced with vector search)
    if (lowerQuery.includes('shortlisted') || lowerQuery.includes('rejected')) {
      // Retrieve recent failed applications for feedback loop
      context.relevantApplications = activeApplications
        .filter(a => a.status === 'Rejected' || a.status === 'Applied')
        .slice(0, 3)
        .map(a => ({ id: a.id, job: a.job, status: a.status }));
    }

    if (lowerQuery.includes('java') || lowerQuery.includes('backend')) {
      context.relevantSkills = profile.skills
        .filter(s => s.category === 'Languages' || s.name.toLowerCase().includes('java'))
        .map(s => s.name);
        
      context.resumeEvidence = profile.experience
        .filter(e => e.description.toLowerCase().includes('java') || e.description.toLowerCase().includes('backend'))
        .map(e => e.description);
    }

    return context;
  }

  /**
   * Formats retrieved context into a safe LLM prompt block.
   */
  static buildPromptContext(context: RetrievedContext): string {
    let promptBlock = '=== GROUNDED EVIDENCE ===\n';
    
    if (context.resumeEvidence.length > 0) {
      promptBlock += `\nRESUME EVIDENCE:\n${context.resumeEvidence.join('\n')}\n`;
    }
    
    if (context.relevantSkills.length > 0) {
      promptBlock += `\nVERIFIED SKILLS:\n${context.relevantSkills.join(', ')}\n`;
    }
    
    if (context.relevantApplications.length > 0) {
      promptBlock += `\nRECENT APPLICATION OUTCOMES:\n`;
      context.relevantApplications.forEach(app => {
        promptBlock += `- Job: ${app.job?.title} at ${app.job?.company} (Status: ${app.status})\n`;
      });
    }

    promptBlock += '\n=========================\n';
    return promptBlock;
  }
}
