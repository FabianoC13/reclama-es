import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { assertAdmin } from '@/lib/admin-auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    assertAdmin(request);
    const body = await request.json();
    const route = await prisma.officialSubmissionRoute.update({
      where: { id: params.id },
      data: body,
    });
    return NextResponse.json({ route });
  } catch {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
}
