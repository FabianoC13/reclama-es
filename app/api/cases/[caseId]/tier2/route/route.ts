import { NextRequest, NextResponse } from 'next/server';
import { assertCaseAccess } from '@/lib/case-access';
import { findBestRouteForCase, getRouteRequirements } from '@/lib/tier2/official-route';
import { resolveSessionId } from '@/lib/api-session';

export async function GET(
  request: NextRequest,
  { params }: { params: { caseId: string } },
) {
  try {
    const sessionId = resolveSessionId(request);
    await assertCaseAccess(params.caseId, sessionId);
    const match = await findBestRouteForCase(params.caseId);
    const requirements = match.bestRoute ? getRouteRequirements(match.bestRoute) : null;
    return NextResponse.json({ ...match, requirements });
  } catch {
    return NextResponse.json({ error: 'No autorizado' }, { status: 404 });
  }
}
