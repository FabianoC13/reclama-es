import type { DocumentoGenerado, WizardData } from '@/lib/types';
import { documentoLabels, pretensionLabels, sectorLabels, tipoLabels } from '@/lib/labels';

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 3).trim()}...`;
}

export function buildCopyFields(wizard: WizardData, doc: DocumentoGenerado) {
  const facts = doc.relacionHechos;
  const request = doc.peticion;
  const company = doc.identificacionReclamado;
  const consumer = doc.identificacionReclamante;

  const evidenceLines =
    wizard.step5?.documentosDisponibles?.map(
      (d, i) => `${i + 1}. ${documentoLabels[d]}`,
    ) ?? [];

  const evidenceIndex =
    evidenceLines.length > 0
      ? evidenceLines.join('\n')
      : 'No se han indicado documentos adjuntos en el formulario.';

  const summary = truncate(
    `${wizard.step2?.nombreEmpresa ?? 'Empresa'} — ${tipoLabels[wizard.step1?.tipo ?? 'otro']}. Importe: ${wizard.step4?.importeEuros ?? 0} €.`,
    500,
  );

  return {
    facts,
    request,
    company,
    consumer,
    evidenceIndex,
    summary,
    factsShort: truncate(facts, 1500),
    requestShort: truncate(request, 1500),
    factsVeryShort: truncate(facts, 500),
    requestVeryShort: truncate(request, 500),
    companyMeta: [
      `Empresa: ${wizard.step2?.nombreEmpresa ?? 'No consta'}`,
      `CIF/NIF: ${wizard.step2?.cifNif ?? 'No consta'}`,
      `Sector: ${sectorLabels[wizard.step2?.sector ?? 'otro']}`,
      `Dirección: ${wizard.step2?.direccionEmpresa ?? 'No consta'}`,
    ].join('\n'),
    consumerMeta: [
      `Nombre: ${wizard.step3?.nombreCompleto ?? ''}`,
      `DNI/NIE: ${wizard.step3?.dniNie ?? ''}`,
      `Dirección: ${wizard.step3?.direccion ?? ''}, ${wizard.step3?.codigoPostal ?? ''} ${wizard.step3?.ciudad ?? ''}`,
      `Email: ${wizard.step3?.email ?? ''}`,
      `Teléfono: ${wizard.step3?.telefono ?? 'No proporcionado'}`,
    ].join('\n'),
    pretensiones:
      wizard.step6?.pretensiones?.map((p) => pretensionLabels[p]).join('; ') ?? '',
  };
}
