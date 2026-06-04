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
    const url =
      pkg.route.onlineStartUrl ??
      pkg.route.officialProcedureUrl ??
      pkg.route.fallbackUrl;

    if (!url) {
      return NextResponse.json({ error: 'URL oficial no disponible' }, { status: 400 });
    }

    await prisma.sedeSubmissionPackage.update({
      where: { id: params.packageId },
      data: { status: 'opened_official_site' },
    });

    await timeline.officialSiteOpened(pkg.caseId, sessionId, params.packageId);
    trackEvent('tier2_official_site_opened', { route_type: pkg.route.routeType });

    return NextResponse.json({ url, packageId: params.packageId });
  } catch {
    return NextResponse.json({ error: 'No autorizado' }, { status: 404 });
  }
}
