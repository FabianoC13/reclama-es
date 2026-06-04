import { prisma } from '@/lib/db';
import { findBestRouteForCase } from '@/lib/tier2/official-route';

export async function getTier2Status(caseId: string, sessionId: string) {
  const caseRecord = await prisma.case.findFirst({
    where: { id: caseId, sessionId },
  });
  if (!caseRecord) return null;

  const routeMatch = await findBestRouteForCase(caseId);
  const pkg = await prisma.sedeSubmissionPackage.findFirst({
    where: { caseId },
    orderBy: { createdAt: 'desc' },
    include: { route: { include: { authority: true } } },
  });
  const receipt = pkg
    ? await prisma.officialSubmissionReceipt.findFirst({ where: { packageId: pkg.id } })
    : null;
  const readiness = await prisma.userElectronicIdReadiness.findUnique({ where: { caseId } });
  const timeline = await prisma.submissionTimelineEvent.findMany({
    where: { caseId },
    orderBy: { createdAt: 'asc' },
  });

  const steps = {
    routeChecked: !!routeMatch.bestRoute,
    readinessDone: !!readiness,
    packageGenerated: pkg?.status === 'generated' || !!pkg?.complaintFilePath,
    officialSiteOpened: ['opened_official_site', 'submitted_external_pending_receipt', 'receipt_uploaded', 'completed'].includes(pkg?.status ?? ''),
    submittedExternal: ['submitted_external_pending_receipt', 'receipt_uploaded', 'completed'].includes(pkg?.status ?? ''),
    receiptSaved: !!receipt,
    completed: caseRecord.tier2Status === 'tier2_completed',
  };

  return {
    case: caseRecord,
    routeMatch,
    package: pkg,
    receipt,
    readiness,
    timeline,
    steps,
    nextAction: resolveNextAction(steps, routeMatch.bestRoute !== null),
  };
}

function resolveNextAction(
  steps: Record<string, boolean>,
  hasRoute: boolean,
): string {
  if (steps.completed) return 'wait_for_response';
  if (steps.receiptSaved) return 'view_receipt';
  if (steps.submittedExternal) return 'upload_receipt';
  if (steps.officialSiteOpened) return 'mark_submitted_or_upload_receipt';
  if (steps.packageGenerated) return 'open_official_sede';
  if (steps.readinessDone && hasRoute) return 'generate_package';
  if (hasRoute) return 'check_id_readiness';
  if (!hasRoute) return 'use_email_fallback';
  return 'start_tier2';
}
