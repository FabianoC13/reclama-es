import { NextRequest, NextResponse } from 'next/server';
import { assertPackageAccess } from '@/lib/case-access';
import { getCopyPasteFields } from '@/lib/tier2/sede-package';
import { resolveSessionId } from '@/lib/api-session';

export async function GET(
  request: NextRequest,
  { params }: { params: { packageId: string } },
) {
  try {
    const sessionId = resolveSessionId(request);
    const pkg = await assertPackageAccess(params.packageId, sessionId);
    return NextResponse.json({ copyFields: getCopyPasteFields(pkg) });
  } catch {
    return NextResponse.json({ error: 'No autorizado' }, { status: 404 });
  }
}
