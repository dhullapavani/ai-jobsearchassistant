import { JobListing, PlatformSource } from '../types';

export class DeduplicationEngine {
  /**
   * Generates a normalized signature for a job based on company name, core title tokens, and location.
   */
  static generateSignature(job: JobListing): string {
    const cleanCompany = job.company
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .replace(/(technologies|services|solutions|pvt|ltd|inc|corporation|llc|india|global|software)/g, '');

    const cleanTitle = job.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .replace(/(junior|associate|trainee|senior|lead|engineer|developer|specialist|consultant)/g, '');

    const cleanLoc = job.location
      .toLowerCase()
      .split(/[,/]/)[0]
      .replace(/[^a-z0-9]/g, '');

    return `${cleanCompany}_${cleanTitle}_${cleanLoc}`;
  }

  /**
   * Identifies and groups cross-platform duplicates.
   * Merges multi-platform occurrences into a single enriched listing with source tracking and preserved URLs.
   */
  static deduplicateJobs(jobs: JobListing[]): {
    uniqueJobs: JobListing[];
    duplicateCount: number;
    clusters: Record<string, JobListing[]>;
  } {
    const groups = new Map<string, JobListing[]>();

    for (const job of jobs) {
      const sig = this.generateSignature(job);
      const existing = groups.get(sig) || [];
      existing.push(job);
      groups.set(sig, existing);
    }

    const uniqueJobs: JobListing[] = [];
    const clusters: Record<string, JobListing[]> = {};
    let totalDuplicatesRemoved = 0;

    const entries = Array.from(groups.entries());
    for (const [sig, list] of entries) {
      if (list.length === 1) {
        uniqueJobs.push(list[0]);
      } else {
        // Multi-source posting detected across LinkedIn, Naukri, Company Careers, etc.
        totalDuplicatesRemoved += (list.length - 1);
        clusters[sig] = list;

        // Choose highest quality listing as primary
        const primary = [...list].sort((a, b) => b.qualityScore - a.qualityScore)[0];
        const allSources = Array.from(new Set(list.map(j => j.platform))) as PlatformSource[];
        const duplicateUrls = list.map(j => ({
          platform: j.platform,
          url: j.jobUrl || j.applicationUrl
        }));

        uniqueJobs.push({
          ...primary,
          duplicateCount: list.length,
          duplicateSources: allSources,
          duplicateUrls,
          duplicateGroupId: sig
        });
      }
    }

    return {
      uniqueJobs,
      duplicateCount: totalDuplicatesRemoved,
      clusters
    };
  }
}
