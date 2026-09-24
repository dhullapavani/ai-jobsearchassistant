import { NextRequest, NextResponse } from 'next/server';
import { MOCK_JOBS } from '@/lib/mock-data';
import { DeduplicationEngine } from '@/lib/jobs/deduplication';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase();
  const platform = searchParams.get('platform');
  const location = searchParams.get('location');

  let results = MOCK_JOBS;

  if (query) {
    results = results.filter(j =>
      j.title.toLowerCase().includes(query) ||
      j.company.toLowerCase().includes(query) ||
      j.requiredSkills.some(s => s.toLowerCase().includes(query))
    );
  }

  if (platform && platform !== 'All') {
    results = results.filter(j => j.platform === platform || (j.duplicateSources && j.duplicateSources.includes(platform as any)));
  }

  if (location && location !== 'All') {
    results = results.filter(j => j.location.toLowerCase().includes(location.toLowerCase()) || j.workMode === 'Remote');
  }

  const { uniqueJobs, duplicateCount } = DeduplicationEngine.deduplicateJobs(results);

  return NextResponse.json({
    success: true,
    totalDiscovered: results.length,
    uniqueCount: uniqueJobs.length,
    duplicatesMerged: duplicateCount,
    jobs: uniqueJobs
  });
}
