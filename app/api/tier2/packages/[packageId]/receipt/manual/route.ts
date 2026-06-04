import { NextRequest, NextResponse } from 'next/server';
import { assertPackageAccess } from '@/lib/case-access';
import { manualReceiptEntry } from '@/lib/tier2/receipt';
import { resolveSessionId } from '@/lib/api-session';
import { trackEvent } from '@/lib/analytics';

export async function POST(
  request: NextRequest,
  { params }: { params: { packageId: string } },
) {
  try {
    const sessionId = resolveSessionId(request);
    const pkg = await assertPackageAccess(params.packageId, sessionId);
    const body = await request.json();

    const receipt = await manualReceiptEntry(pkg.caseId, params.packageId, sessionId, body);
    trackEvent('tier2_receipt_uploaded');
    trackEvent('tier2_completed');

    return NextResponse.json({ receipt });
  } catch {
    return NextResponse.json({ error: 'No autorizado' }, { status: 500 });
  }
}
