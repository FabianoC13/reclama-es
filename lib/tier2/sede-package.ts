import path from 'path';
import type { DocumentoGenerado, WizardData } from '@/lib/types';
import { prisma } from '@/lib/db';
import { buildCopyFields } from '@/lib/tier2/copy-fields';
import {
  generateComplaintPdf,
  generateCoverSheetPdf,
  generateEvidenceIndexPdf,
  getUploadRoot,
} from '@/lib/tier2/pdf';
import { timeline } from '@/lib/tier2/timeline';
import { tipoLabels } from '@/lib/labels';

function buildComplaintBody(doc: DocumentoGenerado) {
  return [
    'IDENTIFICACIÓN DEL RECLAMANTE',
    doc.identificacionReclamante,
    '',
    'IDENTIFICACIÓN DEL RECLAMADO',
    doc.identificacionReclamado,
    '',
    'RELACIÓN DE HECHOS',
    doc.relacionHechos,
    '',
    'PETICIÓN',
    doc.peticion,
    '',
    `${doc.lugar} — ${doc.fecha}`,
    '',
    'Borrador generado a partir de datos proporcionados por el usuario. No constituye asesoramiento jurídico.',
  ].join('\n');
}

export function buildPackageChecklist(wizard: WizardData) {
  const items = [
    { key: 'complaint', label: 'Texto de reclamación', ok: true, critical: true },
    {
      key: 'consumer',
      label: 'Datos del consumidor',
      ok: !!(wizard.step3?.nombreCompleto && wizard.step3.dniNie),
      critical: true,
    },
    {
      key: 'company',
      label: 'Nombre de la empresa',
      ok: !!wizard.step2?.nombreEmpresa,
      critical: true,
    },
    {
      key: 'company_cif',
      label: 'CIF/NIF de la empresa',
      ok: !!wizard.step2?.cifNif,
      critical: false,
    },
    {
      key: 'company_address',
      label: 'Dirección de la empresa',
      ok: !!wizard.step2?.direccionEmpresa,
      critical: false,
    },
    {
      key: 'facts',
      label: 'Hechos',
      ok: (wizard.step4?.descripcionLoQueOcurrio?.length ?? 0) >= 20,
      critical: true,
    },
    {
      key: 'evidence',
      label: 'Documentación indicada',
      ok: (wizard.step5?.documentosDisponibles?.length ?? 0) > 0,
      critical: false,
    },
  ];
  return items;
}

export async function generatePackage(caseId: string, routeId: string, sessionId: string) {
  const caseRecord = await prisma.case.findFirst({
    where: { id: caseId, sessionId },
  });
  if (!caseRecord?.documentoJson) throw new Error('NO_DOCUMENT');

  const wizard = JSON.parse(caseRecord.wizardDataJson) as WizardData;
  const doc = JSON.parse(caseRecord.documentoJson) as DocumentoGenerado;
  const route = await prisma.officialSubmissionRoute.findUnique({
    where: { id: routeId },
    include: { authority: true },
  });
  if (!route) throw new Error('ROUTE_NOT_FOUND');

  const fields = buildCopyFields(wizard, doc);
  const checklist = buildPackageChecklist(wizard);
  const uploadDir = path.join(getUploadRoot(), caseId, `pkg-${Date.now()}`);

  const complaintPath = path.join(uploadDir, '01_reclamacion.pdf');
  const coverPath = path.join(uploadDir, '02_caratula.pdf');
  const indexPath = path.join(uploadDir, '03_indice_pruebas.pdf');

  await generateComplaintPdf(buildComplaintBody(doc), complaintPath);
  await generateCoverSheetPdf({
    authorityName: route.authority.name,
    procedureName: route.procedureName,
    consumer: fields.consumer,
    company: fields.company,
    subject: tipoLabels[wizard.step1?.tipo ?? 'otro'],
    request: fields.request,
    evidenceList: fields.evidenceIndex,
    filePath: coverPath,
  });
  await generateEvidenceIndexPdf(fields.evidenceIndex, indexPath);

  const existing = await prisma.sedeSubmissionPackage.findFirst({
    where: { caseId, routeId },
    orderBy: { createdAt: 'desc' },
  });

  const version = (existing?.packageVersion ?? 0) + 1;

  const pkg = await prisma.sedeSubmissionPackage.create({
    data: {
      caseId,
      sessionId,
      routeId,
      status: 'generated',
      plainTextFacts: fields.facts,
      plainTextRequest: fields.request,
      plainTextCompanyData: fields.company,
      plainTextConsumerData: fields.consumer,
      plainTextFactsShort: fields.factsShort,
      plainTextRequestShort: fields.requestShort,
      plainTextSummary: fields.summary,
      evidenceIndexJson: JSON.stringify({ text: fields.evidenceIndex, items: wizard.step5 }),
      checklistJson: JSON.stringify(checklist),
      complaintFilePath: complaintPath,
      coverSheetFilePath: coverPath,
      evidenceIndexFilePath: indexPath,
      packageVersion: version,
    },
    include: { route: { include: { authority: true } } },
  });

  await prisma.case.update({
    where: { id: caseId },
    data: { tier2Status: 'package_generated', status: 'tier2_in_progress' },
  });

  await timeline.packageGenerated(caseId, sessionId, pkg.id);

  return { package: pkg, checklist, fields };
}

export function getCopyPasteFields(pkg: {
  plainTextFacts: string | null;
  plainTextRequest: string | null;
  plainTextCompanyData: string | null;
  plainTextConsumerData: string | null;
  plainTextFactsShort: string | null;
  plainTextRequestShort: string | null;
  plainTextSummary: string | null;
  evidenceIndexJson: string | null;
}) {
  let evidenceIndex = '';
  try {
    const parsed = pkg.evidenceIndexJson ? JSON.parse(pkg.evidenceIndexJson) : null;
    evidenceIndex = parsed?.text ?? '';
  } catch {
    evidenceIndex = '';
  }

  return {
    facts: pkg.plainTextFacts ?? '',
    request: pkg.plainTextRequest ?? '',
    company: pkg.plainTextCompanyData ?? '',
    consumer: pkg.plainTextConsumerData ?? '',
    evidenceIndex,
    summary: pkg.plainTextSummary ?? '',
    factsShort: pkg.plainTextFactsShort ?? '',
    requestShort: pkg.plainTextRequestShort ?? '',
  };
}
