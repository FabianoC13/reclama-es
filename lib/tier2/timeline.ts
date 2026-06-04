import { prisma } from '@/lib/db';

export async function addTimelineEvent(
  caseId: string,
  sessionId: string,
  eventType: string,
  title: string,
  description?: string,
  metadata?: Record<string, unknown>,
) {
  return prisma.submissionTimelineEvent.create({
    data: {
      caseId,
      sessionId,
      eventType,
      title,
      description,
      metadataJson: metadata ? JSON.stringify(metadata) : null,
    },
  });
}

export const timeline = {
  tier2Started: (caseId: string, sessionId: string) =>
    addTimelineEvent(caseId, sessionId, 'tier2_started', 'Tier 2 iniciado', 'Copiloto de presentación en Sede'),
  routeSelected: (caseId: string, sessionId: string, routeId: string, routeName: string) =>
    addTimelineEvent(caseId, sessionId, 'route_selected', 'Ruta oficial seleccionada', routeName, {
      routeId,
    }),
  idReadinessChecked: (caseId: string, sessionId: string) =>
    addTimelineEvent(caseId, sessionId, 'id_readiness_checked', 'Identificación electrónica revisada'),
  packageGenerated: (caseId: string, sessionId: string, packageId: string) =>
    addTimelineEvent(caseId, sessionId, 'package_generated', 'Paquete Sede generado', undefined, {
      packageId,
    }),
  officialSiteOpened: (caseId: string, sessionId: string, packageId: string) =>
    addTimelineEvent(caseId, sessionId, 'official_site_opened', 'Sede oficial abierta', undefined, {
      packageId,
    }),
  userMarkedSubmitted: (caseId: string, sessionId: string, packageId: string) =>
    addTimelineEvent(caseId, sessionId, 'user_marked_submitted', 'Usuario marcó envío externo', undefined, {
      packageId,
    }),
  receiptUploaded: (caseId: string, sessionId: string, receiptId: string) =>
    addTimelineEvent(caseId, sessionId, 'receipt_uploaded', 'Justificante guardado', undefined, {
      receiptId,
    }),
  tier2Completed: (caseId: string, sessionId: string) =>
    addTimelineEvent(caseId, sessionId, 'tier2_completed', 'Tier 2 completado'),
  fallbackUsed: (caseId: string, sessionId: string, reason: string) =>
    addTimelineEvent(caseId, sessionId, 'fallback_used', 'Alternativa utilizada', reason),
  blockerReported: (caseId: string, sessionId: string, blockerType: string) =>
    addTimelineEvent(caseId, sessionId, 'blocker_reported', 'Incidencia reportada', blockerType, {
      blockerType,
    }),
};
