import { NextRequest, NextResponse } from 'next/server';
import { assertCaseAccess } from '@/lib/case-access';
import { prisma } from '@/lib/db';
import { timeline } from '@/lib/tier2/timeline';
import { resolveSessionId } from '@/lib/api-session';
import { trackEvent } from '@/lib/analytics';

export async function POST(
  request: NextRequest,
  { params }: { params: { caseId: string } },
) {
  try {
    const sessionId = resolveSessionId(request);
    await assertCaseAccess(params.caseId, sessionId);
    const body = await request.json();

    const readiness = await prisma.userElectronicIdReadiness.upsert({
      where: { caseId: params.caseId },
      update: {
        hasClaveMovil: !!body.hasClaveMovil,
        hasClavePermanente: !!body.hasClavePermanente,
        hasCertificadoDigital: !!body.hasCertificadoDigital,
        hasDnie: !!body.hasDnie,
        hasEidas: !!body.hasEidas,
        hasAutofirmaInstalled:
          body.hasAutofirmaInstalled === null ? null : !!body.hasAutofirmaInstalled,
        unsure: !!body.unsure,
        hasNoId: !!body.hasNoId,
        lastAskedAt: new Date(),
      },
      create: {
        caseId: params.caseId,
        sessionId,
        hasClaveMovil: !!body.hasClaveMovil,
        hasClavePermanente: !!body.hasClavePermanente,
        hasCertificadoDigital: !!body.hasCertificadoDigital,
        hasDnie: !!body.hasDnie,
        hasEidas: !!body.hasEidas,
        hasAutofirmaInstalled:
          body.hasAutofirmaInstalled === null ? null : !!body.hasAutofirmaInstalled,
        unsure: !!body.unsure,
        hasNoId: !!body.hasNoId,
      },
    });

    await timeline.idReadinessChecked(params.caseId, sessionId);
    trackEvent('tier2_readiness_completed', {
      auth_ready_boolean: !readiness.hasNoId && !readiness.unsure,
    });

    const canContinue =
      readiness.hasClaveMovil ||
      readiness.hasClavePermanente ||
      readiness.hasCertificadoDigital ||
      readiness.hasDnie ||
      readiness.hasEidas ||
      readiness.unsure;

    return NextResponse.json({ readiness, canContinue, shouldUseEmailFallback: readiness.hasNoId });
  } catch {
    return NextResponse.json({ error: 'No autorizado' }, { status: 404 });
  }
}
