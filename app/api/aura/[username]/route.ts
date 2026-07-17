import { NextResponse } from 'next/server';
import { computeAura } from '@/lib/computeAura';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const username = (await params).username;
    
    // 1. Fetch from GitHub and generate the pure Aura
    const aura = await computeAura(username);
    
    // 2. Calculate a single "Aura Score" for the leaderboard
    // More events = higher score. Lower variance = higher score multiplier. More repos = higher score.
    const score = aura.totalEvents * (1 + (1 / Math.max(0.1, aura.variance))) * Math.max(1, aura.reposCount);

    // 3. Upsert into database
    const dbUser = await prisma.auraUser.upsert({
      where: { username: aura.username.toLowerCase() },
      update: {
        avatarUrl: aura.avatar,
        title: aura.title,
        score,
        nightOwlPercent: aura.nightOwlPercent,
        variance: aura.variance,
        reposCount: aura.reposCount,
        totalEvents: aura.totalEvents,
        topColor: aura.colors[0] || '#ffffff'
      },
      create: {
        username: aura.username.toLowerCase(),
        avatarUrl: aura.avatar,
        title: aura.title,
        score,
        nightOwlPercent: aura.nightOwlPercent,
        variance: aura.variance,
        reposCount: aura.reposCount,
        totalEvents: aura.totalEvents,
        topColor: aura.colors[0] || '#ffffff'
      }
    });

    // 4. Find Rivals (3 above, 3 below)
    const rivalsAbove = await prisma.auraUser.findMany({
      where: {
        score: { gt: score },
        username: { not: aura.username.toLowerCase() }
      },
      orderBy: { score: 'asc' },
      take: 3
    });

    const rivalsBelow = await prisma.auraUser.findMany({
      where: {
        score: { lt: score },
        username: { not: aura.username.toLowerCase() }
      },
      orderBy: { score: 'desc' },
      take: 3
    });

    // We want the highest scores on top, so we reverse rivalsAbove (since it was asc)
    const rivals = [...rivalsAbove.reverse(), ...rivalsBelow];

    return NextResponse.json({
      ...aura,
      rivals: rivals.map(r => ({
        username: r.username,
        avatarUrl: r.avatarUrl,
        title: r.title,
        score: r.score,
        topColor: r.topColor
      }))
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to generate aura' },
      { status: error.message === 'Rate limit exceeded' ? 429 : 500 }
    );
  }
}
