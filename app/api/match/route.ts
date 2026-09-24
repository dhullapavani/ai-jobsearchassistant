import { NextRequest, NextResponse } from 'next/server';
import { MatchingEngine } from '@/lib/matching/matching-engine';
import { DEFAULT_CANDIDATE_PROFILE, MOCK_JOBS } from '@/lib/mock-data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const candidate = body.candidate || DEFAULT_CANDIDATE_PROFILE;
    const job = body.job || (body.jobId ? MOCK_JOBS.find(j => j.id === body.jobId) : MOCK_JOBS[0]);

    if (!job) {
      return NextResponse.json({ success: false, error: 'Job listing not found' }, { status: 404 });
    }

    const matchBreakdown = MatchingEngine.calculateMatch(candidate, job);

    return NextResponse.json({
      success: true,
      jobId: job.id,
      match: matchBreakdown
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
