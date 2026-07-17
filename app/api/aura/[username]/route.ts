import { NextResponse } from 'next/server';
import { computeAura } from '@/lib/computeAura';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const username = (await params).username;
    const aura = await computeAura(username);
    return NextResponse.json(aura);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to generate aura' },
      { status: error.message === 'Rate limit exceeded' ? 429 : 500 }
    );
  }
}
