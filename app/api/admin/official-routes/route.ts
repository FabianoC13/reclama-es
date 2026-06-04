import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { assertAdmin } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  try {
    assertAdmin(request);
    const routes = await prisma.officialSubmissionRoute.findMany({
      include: { authority: true },
      orderBy: { updatedAt: 'desc' },
    });
    return NextResponse.json({ routes });
  } catch {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    assertAdmin(request);
    const body = await request.json();
    const route = await prisma.officialSubmissionRoute.create({ data: body });
    return NextResponse.json({ route });
  } catch {
    return NextResponse.json({ error: 'Error' }, { status: 401 });
  }
}
