import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import { assertPackageAccess } from '@/lib/case-access';
import { resolveSessionId } from '@/lib/api-session';

const FILE_MAP = {
  complaint: 'complaintFilePath',
  cover: 'coverSheetFilePath',
  evidence: 'evidenceIndexFilePath',
} as const;

export async function GET(
  request: NextRequest,
  { params }: { params: { packageId: string; fileType: string } },
) {
  try {
    const sessionId = resolveSessionId(request);
    const pkg = await assertPackageAccess(params.packageId, sessionId);
    const key = FILE_MAP[params.fileType as keyof typeof FILE_MAP];
    if (!key) return NextResponse.json({ error: 'Tipo no válido' }, { status: 400 });

    const filePath = pkg[key];
    if (!filePath) return NextResponse.json({ error: 'Archivo no generado' }, { status: 404 });

    const buffer = await fs.readFile(filePath);
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${params.fileType}.pdf"`,
      },
    });
  } catch {
    return NextResponse.json({ error: 'No autorizado' }, { status: 404 });
  }
}
