import { prisma } from '@/lib/db';
import type { DocumentoGenerado, WizardData } from '@/lib/types';

export async function syncCaseFromSession(
  sessionId: string,
  wizard: WizardData,
  documento: DocumentoGenerado,
  existingCaseId?: string | null,
) {
  const ciudad = wizard.step3?.ciudad ?? null;
  const codigoPostal = wizard.step3?.codigoPostal ?? null;
  const autonomousCommunity =
    codigoPostal?.startsWith('28') || ciudad?.toLowerCase() === 'madrid'
      ? 'Comunidad de Madrid'
      : null;

  const payload = {
    sessionId,
    wizardDataJson: JSON.stringify(wizard),
    documentoJson: JSON.stringify(documento),
    ciudad,
    codigoPostal,
    autonomousCommunity,
    claimCategory: wizard.step1?.tipo ?? null,
    claimAmount: wizard.step4?.importeEuros ?? null,
    companyName: wizard.step2?.nombreEmpresa ?? null,
    companyCity: wizard.step2?.direccionEmpresa ?? null,
    status: 'complaint_generated',
  };

  if (existingCaseId) {
    return prisma.case.update({
      where: { id: existingCaseId },
      data: payload,
    });
  }

  return prisma.case.create({ data: payload });
}
