import { NextRequest, NextResponse } from 'next/server';
import { assertCaseAccess } from '@/lib/case-access';
import { getTier2Status } from '@/lib/tier2/status';
import { resolveSessionId } from '@/lib/api-session';

export async function GET(
  request: NextRequest,
  { params }: { params: { caseId: string } },
) {
  try {
    const sessionId = resolveSessionId(request);
    await assertCaseAccess(params.caseId, sessionId);
    const status = await getTier2Status(params.caseId, sessionId);
    return NextResponse.json(status);
  } catch {
    return NextResponse.json({ error: 'No autorizado' }, { status: 404 });
  }
}
