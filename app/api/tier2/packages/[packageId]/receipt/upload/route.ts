import { NextRequest, NextResponse } from 'next/server';
import { assertPackageAccess } from '@/lib/case-access';
import { uploadReceipt } from '@/lib/tier2/receipt';
import { resolveSessionId } from '@/lib/api-session';
import { trackEvent } from '@/lib/analytics';

export async function POST(
  request: NextRequest,
  { params }: { params: { packageId: string } },
) {
  try {
    const sessionId = resolveSessionId(request);
    const pkg = await assertPackageAccess(params.packageId, sessionId);
    const form = await request.formData();
    const file = form.get('file');
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'Archivo requerido' }, { status: 400 });
    }

    const receipt = await uploadReceipt(pkg.caseId, params.packageId, sessionId, file, {
      receiptNumber: (form.get('receiptNumber') as string) || undefined,
      registryNumber: (form.get('registryNumber') as string) || undefined,
      submittedAt: (form.get('submittedAt') as string) || undefined,
      authorityName: (form.get('authorityName') as string) || undefined,
      procedureName: (form.get('procedureName') as string) || undefined,
      notes: (form.get('notes') as string) || undefined,
    });

    trackEvent('tier2_receipt_uploaded');
    trackEvent('tier2_completed');

    return NextResponse.json({ receipt });
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === 'INVALID_FILE_TYPE') {
        return NextResponse.json({ error: 'Tipo de archivo no permitido' }, { status: 400 });
      }
      if (e.message === 'FILE_TOO_LARGE') {
        return NextResponse.json({ error: 'Archivo demasiado grande (máx. 10 MB)' }, { status: 400 });
      }
    }
    return NextResponse.json({ error: 'Error al subir justificante' }, { status: 500 });
  }
}
