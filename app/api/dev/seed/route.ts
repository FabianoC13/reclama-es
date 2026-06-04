import { NextResponse } from 'next/server';
import { DEV_FIXTURE } from '@/lib/dev-fixture';
import { syncCaseFromSession } from '@/lib/tier2/case-sync';
import { withSessionCookie } from '@/lib/api-session';
import { prisma } from '@/lib/db';

const DEV_SESSION_ID = 'dev-local-session';

export async function POST() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'No disponible en producción' }, { status: 403 });
  }

  try {
    const existing = await prisma.case.findFirst({
      where: { sessionId: DEV_SESSION_ID },
      orderBy: { createdAt: 'desc' },
    });

    const caseRecord = await syncCaseFromSession(
      DEV_SESSION_ID,
      DEV_FIXTURE.wizard,
      DEV_FIXTURE.documento,
      existing?.id,
    );

    const res = NextResponse.json({
      caseId: caseRecord.id,
      sessionId: DEV_SESSION_ID,
      wizardData: DEV_FIXTURE.wizard,
      documento: DEV_FIXTURE.documento,
      links: {
        resultado: '/resultado',
        tier2: `/casos/${caseRecord.id}/tier2`,
        reclamacion: '/reclamacion',
      },
    });

    return withSessionCookie(res, DEV_SESSION_ID);
  } catch (e) {
    console.error('dev seed', e);
    return NextResponse.json(
      { error: 'Error al crear caso de prueba. Ejecuta: npm run db:setup' },
      { status: 500 },
    );
  }
}
