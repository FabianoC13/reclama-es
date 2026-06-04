import { prisma } from '@/lib/db';
import type { Case, OfficialAuthority, OfficialSubmissionRoute } from '@prisma/client';

type RouteWithAuthority = OfficialSubmissionRoute & { authority: OfficialAuthority };

export type RouteMatchResult = {
  bestRoute: RouteWithAuthority | null;
  fallbackRoutes: RouteWithAuthority[];
  confidence: 'high' | 'medium' | 'low' | 'none';
  reason: string;
  warnings: string[];
};

function normalizeCity(city: string | null | undefined): string {
  return (city ?? '').trim().toLowerCase();
}

function matchesMadrid(caseRecord: Case): boolean {
  const city = normalizeCity(caseRecord.ciudad);
  if (city === 'madrid') return true;
  const cp = caseRecord.codigoPostal ?? '';
  return cp.startsWith('28');
}

export async function findBestRouteForCase(caseId: string): Promise<RouteMatchResult> {
  const caseRecord = await prisma.case.findUnique({ where: { id: caseId } });
  if (!caseRecord) {
    return {
      bestRoute: null,
      fallbackRoutes: [],
      confidence: 'none',
      reason: 'Caso no encontrado.',
      warnings: [],
    };
  }

  const verifiedRoutes = await prisma.officialSubmissionRoute.findMany({
    where: { verificationStatus: 'verified' },
    include: { authority: true },
  });

  const warnings = [
    'La presentación electrónica oficial requiere identificación electrónica.',
    'La autoridad puede mediar, pero no garantiza el reembolso.',
  ];

  if (matchesMadrid(caseRecord)) {
    const madrid = verifiedRoutes.find((r) => r.routeSlug === 'madrid-omic-reclamaciones-consumo');
    if (madrid) {
      const others = verifiedRoutes.filter((r) => r.id !== madrid.id);
      return {
        bestRoute: madrid,
        fallbackRoutes: others,
        confidence: 'high',
        reason: 'La ciudad o código postal corresponde a Madrid y existe una ruta OMIC verificada.',
        warnings,
      };
    }
  }

  const generic = verifiedRoutes.find((r) => r.routeType === 'sede_generic_registry');
  if (generic) {
    return {
      bestRoute: generic,
      fallbackRoutes: verifiedRoutes.filter((r) => r.id !== generic.id),
      confidence: 'low',
      reason: 'No hay ruta municipal verificada; se sugiere registro genérico si existe.',
      warnings: [...warnings, 'Verifica siempre la autoridad competente de tu municipio.'],
    };
  }

  return {
    bestRoute: null,
    fallbackRoutes: verifiedRoutes,
    confidence: 'none',
    reason: 'Aún no tenemos una ruta oficial verificada para tu municipio.',
    warnings: [
      ...warnings,
      'Puedes usar el flujo por correo electrónico o guardar el paquete para presentación manual.',
    ],
  };
}

export function getRouteRequirements(route: {
  supportedAuthMethods: string;
  requiresElectronicId: boolean;
  receiptExpected: boolean;
  receiptNames: string | null;
  attachmentMaxSizeMb: number | null;
  allowedAttachmentTypes: string | null;
  notesUserFacing: string | null;
  mayRequireAutofirma: boolean;
}) {
  let authMethods: string[] = [];
  try {
    authMethods = JSON.parse(route.supportedAuthMethods) as string[];
  } catch {
    authMethods = [];
  }

  let receiptNames: string[] = [];
  try {
    receiptNames = route.receiptNames ? (JSON.parse(route.receiptNames) as string[]) : [];
  } catch {
    receiptNames = [];
  }

  return {
    requiresElectronicId: route.requiresElectronicId,
    supportedAuthMethods: authMethods,
    receiptExpected: route.receiptExpected,
    receiptNames,
    attachmentMaxSizeMb: route.attachmentMaxSizeMb,
    allowedAttachmentTypes: route.allowedAttachmentTypes,
    mayRequireAutofirma: route.mayRequireAutofirma,
    notesUserFacing: route.notesUserFacing,
  };
}
