import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';

function wrapLines(text: string, maxChars: number): string[] {
  const lines: string[] = [];
  for (const paragraph of text.split('\n')) {
    if (!paragraph.trim()) {
      lines.push('');
      continue;
    }
    let remaining = paragraph;
    while (remaining.length > maxChars) {
      let breakAt = remaining.lastIndexOf(' ', maxChars);
      if (breakAt < 20) breakAt = maxChars;
      lines.push(remaining.slice(0, breakAt).trim());
      remaining = remaining.slice(breakAt).trim();
    }
    lines.push(remaining);
  }
  return lines;
}

async function writeTextPdf(title: string, body: string, filePath: string) {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  let page = pdf.addPage([595, 842]);
  let y = 800;
  const margin = 50;
  const lineHeight = 14;

  page.drawText(title, { x: margin, y, size: 14, font: bold, color: rgb(0.1, 0.1, 0.1) });
  y -= 28;

  for (const line of wrapLines(body, 85)) {
    if (y < 60) {
      page = pdf.addPage([595, 842]);
      y = 800;
    }
    page.drawText(line, { x: margin, y, size: 10, font, color: rgb(0.15, 0.15, 0.15) });
    y -= lineHeight;
  }

  const bytes = await pdf.save();
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, bytes);
}

export async function generateCoverSheetPdf(params: {
  authorityName: string;
  procedureName: string;
  consumer: string;
  company: string;
  subject: string;
  request: string;
  evidenceList: string;
  filePath: string;
}) {
  const body = [
    `Destino: ${params.authorityName}`,
    `Procedimiento: ${params.procedureName}`,
    '',
    'DATOS DEL CONSUMIDOR',
    params.consumer,
    '',
    'DATOS DE LA EMPRESA RECLAMADA',
    params.company,
    '',
    `Asunto: ${params.subject}`,
    '',
    'SOLICITUD',
    params.request,
    '',
    'DOCUMENTACIÓN ADJUNTA',
    params.evidenceList,
    '',
    `Fecha: ${new Date().toLocaleDateString('es-ES')}`,
    '',
    'Documento preparado con fines de organización. El usuario presenta en la Sede oficial.',
  ].join('\n');

  await writeTextPdf('Carátula para presentación electrónica', body, params.filePath);
}

export async function generateComplaintPdf(body: string, filePath: string) {
  await writeTextPdf('Hoja de reclamación (borrador)', body, filePath);
}

export async function generateEvidenceIndexPdf(evidenceIndex: string, filePath: string) {
  await writeTextPdf('Índice de pruebas', evidenceIndex, filePath);
}

export function getUploadRoot() {
  return process.env.UPLOAD_DIR ?? path.join(process.cwd(), 'data', 'uploads');
}
