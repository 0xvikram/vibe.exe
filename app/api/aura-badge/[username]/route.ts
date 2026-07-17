import { NextResponse } from 'next/server';
import { computeAura } from '@/lib/computeAura';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const slug = (await params).username;
    // Handle the '.svg' part
    const username = slug.replace('.svg', '');
    const aura = await computeAura(username);
    
    const svg = `
      <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stop-color="${aura.colors[0] || '#888'}" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="${aura.colors[1] || '#333'}" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="1200" height="630" fill="#09090b" />
        <circle cx="600" cy="315" r="250" fill="url(#grad)" />
        <text x="600" y="550" font-family="sans-serif" font-size="32" font-weight="bold" fill="white" text-anchor="middle">
          ${aura.title}
        </text>
        <text x="600" y="590" font-family="sans-serif" font-size="20" fill="#a1a1aa" text-anchor="middle">
          github.com/${aura.username}
        </text>
      </svg>
    `;

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to generate aura SVG' },
      { status: error.message === 'Rate limit exceeded' ? 429 : 500 }
    );
  }
}
