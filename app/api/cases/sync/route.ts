import { NextRequest, NextResponse } from 'next/server';
import { syncCaseFromSession } from '@/lib/tier2/case-sync';
import { resolveSessionId, withSessionCookie } from '@/lib/api-session';
import type { DocumentoGenerado, WizardData } from '@/lib/types';
export async function POST(request: NextRequest) {
  try {
    const sessionId = resolveSessionId(request);
    const body = await request.json();
    const wizard = body.wizardData as WizardData;
    const documento = body.documento as DocumentoGenerado;
    const existingCaseId = body.caseId as string | undefined;

    if (!wizard?.step3 || !documento) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    const caseRecord = await syncCaseFromSession(sessionId, wizard, documento, existingCaseId);

    const res = NextResponse.json({ caseId: caseRecord.id, sessionId });
    return withSessionCookie(res, sessionId);
  } catch (e) {
    console.error('case sync', e);
    return NextResponse.json({ error: 'Error al guardar el caso' }, { status: 500 });
  }
}
