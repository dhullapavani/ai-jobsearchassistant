export interface SystemEvaluationMetrics {
  totalMatchesRun: number;
  averageMatchPrecision: number;
  truthGuardPassRate: number;
  unsupportedClaimRate: number;
  averageResponseTimeMs: number;
  recommendationAcceptanceRate: number;
}

export interface EvaluationEvent {
  type: 'MATCH' | 'TRUTH_GUARD_CHECK' | 'USER_CORRECTION' | 'RECOMMENDATION_ACCEPTED' | 'RECOMMENDATION_REJECTED';
  success: boolean;
  responseTimeMs?: number;
  unsupportedClaimsDetected?: number;
}

export class AIEvaluationSystem {
  private static events: EvaluationEvent[] = [];

  /**
   * Logs a real system event for continuous evaluation tracking
   */
  static logEvent(event: EvaluationEvent) {
    this.events.push(event);
  }

  /**
   * Computes evaluation metrics dynamically from logged system data.
   * Ensures no fake/hardcoded impressive percentages are displayed.
   */
  static calculateMetrics(): SystemEvaluationMetrics {
    if (this.events.length === 0) {
      return {
        totalMatchesRun: 0,
        averageMatchPrecision: 0,
        truthGuardPassRate: 100, // Baseline assumption before failure logs
        unsupportedClaimRate: 0,
        averageResponseTimeMs: 0,
        recommendationAcceptanceRate: 0
      };
    }

    const matchEvents = this.events.filter(e => e.type === 'MATCH');
    const truthGuardEvents = this.events.filter(e => e.type === 'TRUTH_GUARD_CHECK');
    const recommendationEvents = this.events.filter(e => e.type === 'RECOMMENDATION_ACCEPTED' || e.type === 'RECOMMENDATION_REJECTED');

    // Calculate match precision (successful matches vs user corrections)
    const successfulMatches = matchEvents.filter(e => e.success).length;
    const matchPrecision = matchEvents.length > 0 ? (successfulMatches / matchEvents.length) * 100 : 0;

    // Calculate Truth Guard stats
    const tgPasses = truthGuardEvents.filter(e => e.success).length;
    const tgPassRate = truthGuardEvents.length > 0 ? (tgPasses / truthGuardEvents.length) * 100 : 100;
    
    let totalUnsupported = 0;
    truthGuardEvents.forEach(e => {
      if (e.unsupportedClaimsDetected) totalUnsupported += e.unsupportedClaimsDetected;
    });
    const unsupportedRate = truthGuardEvents.length > 0 ? totalUnsupported / truthGuardEvents.length : 0;

    // Calculate Response Time
    let totalTime = 0;
    let timeEventsCount = 0;
    this.events.forEach(e => {
      if (e.responseTimeMs) {
        totalTime += e.responseTimeMs;
        timeEventsCount++;
      }
    });
    const avgResponseTime = timeEventsCount > 0 ? Math.round(totalTime / timeEventsCount) : 0;

    // Recommendation Acceptance
    const acceptedRecs = recommendationEvents.filter(e => e.type === 'RECOMMENDATION_ACCEPTED').length;
    const recAcceptanceRate = recommendationEvents.length > 0 ? (acceptedRecs / recommendationEvents.length) * 100 : 0;

    return {
      totalMatchesRun: matchEvents.length,
      averageMatchPrecision: Math.round(matchPrecision),
      truthGuardPassRate: Math.round(tgPassRate),
      unsupportedClaimRate: Math.round(unsupportedRate * 100) / 100,
      averageResponseTimeMs: avgResponseTime,
      recommendationAcceptanceRate: Math.round(recAcceptanceRate)
    };
  }
}
