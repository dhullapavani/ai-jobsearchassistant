import { NextRequest, NextResponse } from 'next/server';
import { AIProviderFactory } from '@/lib/ai/ai-provider';
import { DEFAULT_CANDIDATE_PROFILE, MOCK_JOBS } from '@/lib/mock-data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const profile = body.profile || DEFAULT_CANDIDATE_PROFILE;
    const job = body.job || (body.jobId ? MOCK_JOBS.find(j => j.id === body.jobId) : MOCK_JOBS[0]);
    const tone = body.tone || 'Professional';
    const providerType = body.provider || 'mock';

    const ai = AIProviderFactory.getProvider(providerType);
    const content = await ai.generateApplicationContent(profile, job, { tone });

    return NextResponse.json({
      success: true,
      coverLetter: {
        text: content.text,
        truthGuardPassed: content.truthGuardPassed
      },
      suggestions: content.suggestions
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
