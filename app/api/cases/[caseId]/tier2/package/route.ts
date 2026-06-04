import { NextRequest, NextResponse } from 'next/server';
import { assertCaseAccess } from '@/lib/case-access';
import { generatePackage, getCopyPasteFields } from '@/lib/tier2/sede-package';
import { prisma } from '@/lib/db';
import { resolveSessionId } from '@/lib/api-session';
import { trackEvent } from '@/lib/analytics';

export async function GET(
  request: NextRequest,
  { params }: { params: { caseId: string } },
) {
  try {
    const sessionId = resolveSessionId(request);
    await assertCaseAccess(params.caseId, sessionId);
    const pkg = await prisma.sedeSubmissionPackage.findFirst({
      where: { caseId: params.caseId },
      orderBy: { createdAt: 'desc' },
      include: { route: { include: { authority: true } } },
    });
    return NextResponse.json({ package: pkg });
  } catch {
    return NextResponse.json({ error: 'No autorizado' }, { status: 404 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { caseId: string } },
) {
  try {
    const sessionId = resolveSessionId(request);
    await assertCaseAccess(params.caseId, sessionId);
    const body = await request.json();
    const routeId = body.routeId as string;
    if (!routeId) return NextResponse.json({ error: 'routeId requerido' }, { status: 400 });

    const result = await generatePackage(params.caseId, routeId, sessionId);
    trackEvent('tier2_package_generated', { route_type: result.package.route.routeType });

    return NextResponse.json({
      package: result.package,
      checklist: result.checklist,
      copyFields: getCopyPasteFields(result.package),
    });
  } catch (e) {
    if (e instanceof Error && e.message === 'NO_DOCUMENT') {
      return NextResponse.json({ error: 'Genera primero la reclamación' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error al generar paquete' }, { status: 500 });
  }
}
