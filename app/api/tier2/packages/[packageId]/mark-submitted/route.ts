import { NextRequest, NextResponse } from 'next/server';
import { assertPackageAccess } from '@/lib/case-access';
import { prisma } from '@/lib/db';
import { timeline } from '@/lib/tier2/timeline';
import { resolveSessionId } from '@/lib/api-session';
import { trackEvent } from '@/lib/analytics';

export async function POST(
  request: NextRequest,
  { params }: { params: { packageId: string } },
) {
  try {
    const sessionId = resolveSessionId(request);
    const pkg = await assertPackageAccess(params.packageId, sessionId);
    const body = await request.json().catch(() => ({}));

    if (body.blockerType) {
      await timeline.blockerReported(pkg.caseId, sessionId, body.blockerType as string);
      trackEvent('tier2_blocker_reported', { blocker_type: body.blockerType });
      return NextResponse.json({ status: 'blocker_recorded', blockerType: body.blockerType });
    }

    await prisma.sedeSubmissionPackage.update({
      where: { id: params.packageId },
      data: { status: 'submitted_external_pending_receipt' },
    });

    await timeline.userMarkedSubmitted(pkg.caseId, sessionId, params.packageId);
    trackEvent('tier2_marked_submitted');

    return NextResponse.json({ status: 'submitted_external_pending_receipt' });
  } catch {
    return NextResponse.json({ error: 'No autorizado' }, { status: 404 });
  }
}
