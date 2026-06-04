import { NextRequest, NextResponse } from 'next/server';
import { assertCaseAccess } from '@/lib/case-access';
import { findBestRouteForCase } from '@/lib/tier2/official-route';
import { timeline } from '@/lib/tier2/timeline';
import { resolveSessionId, withSessionCookie } from '@/lib/api-session';
import { prisma } from '@/lib/db';
import { trackEvent } from '@/lib/analytics';

export async function POST(
  request: NextRequest,
  { params }: { params: { caseId: string } },
) {
  try {
    const sessionId = resolveSessionId(request);
    await assertCaseAccess(params.caseId, sessionId);
    const match = await findBestRouteForCase(params.caseId);

    await prisma.case.update({
      where: { id: params.caseId },
      data: { tier2Status: 'tier2_started', status: 'tier2_in_progress' },
    });

    await timeline.tier2Started(params.caseId, sessionId);
    if (match.bestRoute) {
      await timeline.routeSelected(
        params.caseId,
        sessionId,
        match.bestRoute.id,
        match.bestRoute.routeName,
      );
      trackEvent('tier2_route_found', {
        route_type: match.bestRoute.routeType,
        municipality: match.bestRoute.authority.municipality ?? '',
      });
    } else {
      trackEvent('tier2_no_route_found', { municipality: '' });
    }

    const res = NextResponse.json({ match, caseId: params.caseId });
    return withSessionCookie(res, sessionId);
  } catch {
    return NextResponse.json({ error: 'No autorizado' }, { status: 404 });
  }
}
