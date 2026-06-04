import fs from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/db';
import { getUploadRoot } from '@/lib/tier2/pdf';
import { timeline } from '@/lib/tier2/timeline';

const ALLOWED_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
const MAX_BYTES = 10 * 1024 * 1024;

export async function uploadReceipt(
  caseId: string,
  packageId: string,
  sessionId: string,
  file: File,
  meta: {
    receiptNumber?: string;
    registryNumber?: string;
    submittedAt?: string;
    authorityName?: string;
    procedureName?: string;
    notes?: string;
  },
) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('INVALID_FILE_TYPE');
  }
  if (file.size > MAX_BYTES) throw new Error('FILE_TOO_LARGE');

  const pkg = await prisma.sedeSubmissionPackage.findFirst({
    where: { id: packageId, caseId, sessionId },
    include: { route: { include: { authority: true } } },
  });
  if (!pkg) throw new Error('PACKAGE_NOT_FOUND');

  const ext = file.type === 'application/pdf' ? 'pdf' : file.type.includes('png') ? 'png' : 'jpg';
  const dir = path.join(getUploadRoot(), caseId, 'receipts');
  const filePath = path.join(dir, `${packageId}-${Date.now()}.${ext}`);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filePath, buffer);

  const receipt = await prisma.officialSubmissionReceipt.upsert({
    where: { id: `${packageId}-receipt` },
    update: {
      receiptFilePath: filePath,
      receiptNumber: meta.receiptNumber,
      registryNumber: meta.registryNumber,
      submittedAt: meta.submittedAt ? new Date(meta.submittedAt) : undefined,
      authorityName: meta.authorityName ?? pkg.route.authority.shortName,
      procedureName: meta.procedureName ?? pkg.route.procedureName,
      notes: meta.notes,
      receiptSource: 'uploaded_pdf',
      verificationStatus: 'user_provided',
    },
    create: {
      id: `${packageId}-receipt`,
      caseId,
      sessionId,
      packageId,
      routeId: pkg.routeId,
      receiptFilePath: filePath,
      receiptNumber: meta.receiptNumber,
      registryNumber: meta.registryNumber,
      submittedAt: meta.submittedAt ? new Date(meta.submittedAt) : new Date(),
      authorityName: meta.authorityName ?? pkg.route.authority.shortName,
      procedureName: meta.procedureName ?? pkg.route.procedureName,
      notes: meta.notes,
      receiptSource: file.type === 'application/pdf' ? 'uploaded_pdf' : 'screenshot',
      verificationStatus: 'user_provided',
    },
  });

  await prisma.sedeSubmissionPackage.update({
    where: { id: packageId },
    data: { status: 'receipt_uploaded' },
  });

  await prisma.case.update({
    where: { id: caseId },
    data: { tier2Status: 'tier2_completed', status: 'tier2_completed' },
  });

  await timeline.receiptUploaded(caseId, sessionId, receipt.id);
  await timeline.tier2Completed(caseId, sessionId);

  return receipt;
}

export async function manualReceiptEntry(
  caseId: string,
  packageId: string,
  sessionId: string,
  data: {
    registryNumber?: string;
    receiptNumber?: string;
    submittedAt?: string;
    authorityName?: string;
    procedureName?: string;
    notes?: string;
  },
) {
  const pkg = await prisma.sedeSubmissionPackage.findFirst({
    where: { id: packageId, caseId, sessionId },
    include: { route: { include: { authority: true } } },
  });
  if (!pkg) throw new Error('PACKAGE_NOT_FOUND');

  const receipt = await prisma.officialSubmissionReceipt.upsert({
    where: { id: `${packageId}-receipt` },
    update: {
      registryNumber: data.registryNumber,
      receiptNumber: data.receiptNumber,
      submittedAt: data.submittedAt ? new Date(data.submittedAt) : new Date(),
      authorityName: data.authorityName ?? pkg.route.authority.shortName,
      procedureName: data.procedureName ?? pkg.route.procedureName,
      notes: data.notes,
      receiptSource: 'manual_entry',
      verificationStatus: 'manually_confirmed',
    },
    create: {
      id: `${packageId}-receipt`,
      caseId,
      sessionId,
      packageId,
      routeId: pkg.routeId,
      registryNumber: data.registryNumber,
      receiptNumber: data.receiptNumber,
      submittedAt: data.submittedAt ? new Date(data.submittedAt) : new Date(),
      authorityName: data.authorityName ?? pkg.route.authority.shortName,
      procedureName: data.procedureName ?? pkg.route.procedureName,
      notes: data.notes,
      receiptSource: 'manual_entry',
      verificationStatus: 'manually_confirmed',
    },
  });

  await prisma.sedeSubmissionPackage.update({
    where: { id: packageId },
    data: { status: 'receipt_uploaded' },
  });

  await prisma.case.update({
    where: { id: caseId },
    data: { tier2Status: 'tier2_completed', status: 'tier2_completed' },
  });

  await timeline.receiptUploaded(caseId, sessionId, receipt.id);
  await timeline.tier2Completed(caseId, sessionId);

  return receipt;
}
