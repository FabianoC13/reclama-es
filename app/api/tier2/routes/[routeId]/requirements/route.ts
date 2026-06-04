import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getRouteRequirements } from '@/lib/tier2/official-route';

export async function GET(
  _request: NextRequest,
  { params }: { params: { routeId: string } },
) {
  const route = await prisma.officialSubmissionRoute.findUnique({
    where: { id: params.routeId },
    include: { authority: true },
  });
  if (!route) return NextResponse.json({ error: 'Ruta no encontrada' }, { status: 404 });
  return NextResponse.json({
    route,
    requirements: getRouteRequirements(route),
  });
}
