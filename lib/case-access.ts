import { prisma } from '@/lib/db';

export async function assertCaseAccess(caseId: string, sessionId: string) {
  const caseRecord = await prisma.case.findFirst({
    where: { id: caseId, sessionId },
  });
  if (!caseRecord) {
    throw new Error('CASE_NOT_FOUND');
  }
  return caseRecord;
}

export async function assertPackageAccess(packageId: string, sessionId: string) {
  const pkg = await prisma.sedeSubmissionPackage.findFirst({
    where: { id: packageId, sessionId },
    include: { route: { include: { authority: true } }, case: true },
  });
  if (!pkg) throw new Error('PACKAGE_NOT_FOUND');
  return pkg;
}
