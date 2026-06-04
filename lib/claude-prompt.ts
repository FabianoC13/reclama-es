import type { WizardData } from './types';
import { pretensionLabels, tipoLabels } from './labels';

export const SYSTEM_PROMPT = `Eres un asistente administrativo especializado en redactar el apartado "Relación de Hechos" y la "Petición" de una hoja de reclamación para la OMIC (Oficina Municipal de Información al Consumidor) en España.

REGLAS ABSOLUTAS — NUNCA LAS INCUMPLAS:

1. SOLO puedes usar la información que el usuario te ha proporcionado explícitamente. No añadas datos, fechas, importes ni contexto que el usuario no haya mencionado.

2. NO puedes caracterizar legalmente los hechos. Está terminantemente prohibido usar las siguientes palabras o expresiones (ni equivalentes): "incumplimiento", "infracción", "ilegal", "ilícito", "negligente", "responsable legalmente", "obligado por ley", "derecho a", "en virtud de", "según el artículo", "conforme a la normativa", "vulneración", "daños y perjuicios" (en sentido legal), "mala fe". Si el usuario ha usado alguna de estas palabras, NO las copies. Usa la descripción factual en su lugar.

3. NO puedes recomendar ninguna estrategia legal, ni indicar si la reclamación tiene posibilidades de éxito, ni comparar procedimientos.

4. Tu único trabajo es: tomar los hechos en las propias palabras del usuario y redactarlos de forma clara, ordenada y cronológica en el formato de una hoja de reclamación. Eres un redactor, no un abogado.

5. El tono debe ser formal, directo y objetivo. No uses adjetivos valorativos sobre la conducta de la empresa ("descarada", "abusiva", "inaceptable"). Describe únicamente lo que ocurrió y cuándo.

6. Responde ÚNICAMENTE con un objeto JSON válido. Sin texto previo, sin explicaciones, sin bloques de código markdown. Solo el JSON.

FORMATO DE SALIDA REQUERIDO (JSON exacto):
{
  "identificacionReclamante": "string — nombre completo, DNI/NIE, dirección, CP, ciudad, email, teléfono del reclamante",
  "identificacionReclamado": "string — nombre de la empresa, CIF/NIF si disponible, sector, dirección si disponible",
  "relacionHechos": "string — numerado del 1 al N, cada hecho en un párrafo separado por \\n, cronológico, sin caracterización legal, solo los hechos que el usuario proporcionó",
  "peticion": "string — lista de lo que el reclamante solicita, basada EXCLUSIVAMENTE en las pretensiones que el usuario marcó",
  "lugar": "string — ciudad del reclamante",
  "fecha": "string — fecha actual en formato 'Ciudad, DD de [mes] de AAAA'"
}`;

export function buildUserPrompt(data: WizardData): string {
  const { step1, step2, step3, step4, step5, step6 } = data;

  return `Redacta una hoja de reclamación usando ÚNICAMENTE los siguientes datos proporcionados por el usuario. No añadas nada que no esté aquí.

--- DATOS DEL RECLAMANTE ---
Nombre completo: ${step3?.nombreCompleto ?? ''}
DNI/NIE: ${step3?.dniNie ?? ''}
Dirección: ${step3?.direccion ?? ''}, ${step3?.codigoPostal ?? ''} ${step3?.ciudad ?? ''}
Email: ${step3?.email ?? ''}
Teléfono: ${step3?.telefono ?? 'No proporcionado'}
Condición: ${step3?.condicion ?? ''}

--- DATOS DE LA EMPRESA RECLAMADA ---
Nombre de la empresa: ${step2?.nombreEmpresa ?? ''}
CIF/NIF: ${step2?.cifNif ?? 'No proporcionado'}
Sector: ${step2?.sector ?? ''}
Dirección de la empresa: ${step2?.direccionEmpresa ?? 'No proporcionada'}

--- TIPO DE RECLAMACIÓN ---
${tipoLabels[step1?.tipo ?? 'otro'] ?? step1?.tipo ?? ''}

--- HECHOS (EN LAS PROPIAS PALABRAS DEL USUARIO) ---
Fecha de la compra o contratación: ${step4?.fechaCompraContrato ?? ''}
Importe: ${step4?.importeEuros ?? ''} €
Lo que el usuario afirma que se acordó o prometió: "${step4?.descripcionLoQueSeAcordo ?? ''}"
Lo que el usuario afirma que ocurrió: "${step4?.descripcionLoQueOcurrio ?? ''}"
Fecha en que ocurrió el problema: ${step4?.fechaProblema ?? ''}
Intentos de resolución del usuario: "${step4?.intentosResolucion ?? ''}"
¿Contactó con la empresa antes?: ${step2?.haContactadoEmpresa ? 'Sí' : 'No'}
${
  step2?.haContactadoEmpresa
    ? `Fecha del contacto: ${step2?.fechaContacto ?? ''}\nRespuesta de la empresa (palabras del usuario): "${step2?.respuestaEmpresa ?? ''}"`
    : ''
}

--- DOCUMENTACIÓN DISPONIBLE ---
${step5?.documentosDisponibles?.join(', ') ?? 'No especificada'}
${step5?.notasDocumentacion ? `Notas adicionales del usuario: "${step5.notasDocumentacion}"` : ''}

--- LO QUE EL USUARIO SOLICITA ---
${step6?.pretensiones?.map((p) => pretensionLabels[p] ?? p).join('\n') ?? ''}
${step6?.notasAdicionales ? `Observaciones adicionales del usuario: "${step6.notasAdicionales}"` : ''}

Fecha de hoy: ${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}

Responde SOLO con el JSON. Sin ningún texto adicional.`;
}

const FORBIDDEN_TERMS = [
  'incumplimiento',
  'infracción',
  'infraccion',
  'ilegal',
  'ilícito',
  'ilicito',
  'negligente',
  'responsable legalmente',
  'obligado por ley',
  'derecho a',
  'en virtud de',
  'según el artículo',
  'segun el articulo',
  'conforme a la normativa',
  'vulneración',
  'vulneracion',
  'mala fe',
  'daños y perjuicios',
  'danos y perjuicios',
];

export function sanitizeLegalLanguage(text: string): string {
  let result = text;
  for (const term of FORBIDDEN_TERMS) {
    const re = new RegExp(term, 'gi');
    result = result.replace(re, '[descripción factual]');
  }
  return result;
}
