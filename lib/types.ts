export interface WizardData {
  step1: Step1Data | null;
  step2: Step2Data | null;
  step3: Step3Data | null;
  step4: Step4Data | null;
  step5: Step5Data | null;
  step6: Step6Data | null;
  step7Confirmed: boolean;
}

export type TipoReclamacion =
  | 'producto_defectuoso'
  | 'servicio_no_prestado'
  | 'facturacion_incorrecta'
  | 'publicidad_enganosa'
  | 'entrega_no_realizada'
  | 'garantia_no_aplicada'
  | 'otro';

export type SectorEmpresa =
  | 'telefonia'
  | 'energia'
  | 'banca_seguros'
  | 'transporte'
  | 'comercio_electronico'
  | 'restauracion_hosteleria'
  | 'salud_bienestar'
  | 'educacion'
  | 'otro';

export type Pretension =
  | 'reembolso_dinero'
  | 'reparacion_sustitucion'
  | 'prestacion_correcta'
  | 'compensacion_danios'
  | 'rectificacion_factura'
  | 'anulacion_contrato';

export interface Step1Data {
  tipo: TipoReclamacion;
}

export interface Step2Data {
  nombreEmpresa: string;
  cifNif?: string;
  sector: SectorEmpresa;
  direccionEmpresa?: string;
  haContactadoEmpresa: boolean;
  fechaContacto?: string;
  respuestaEmpresa?: string;
}

export interface Step3Data {
  nombreCompleto: string;
  dniNie: string;
  direccion: string;
  codigoPostal: string;
  ciudad: string;
  email: string;
  telefono?: string;
  condicion: 'consumidor_particular' | 'autonomo' | 'representante_empresa';
}

export interface Step4Data {
  fechaCompraContrato: string;
  importeEuros: number;
  descripcionLoQueSeAcordo: string;
  descripcionLoQueOcurrio: string;
  fechaProblema: string;
  intentosResolucion: string;
}

export interface Step5Data {
  documentosDisponibles: DocumentoDisponible[];
  notasDocumentacion?: string;
}

export type DocumentoDisponible =
  | 'factura_ticket'
  | 'contrato_presupuesto'
  | 'emails_chats'
  | 'fotografias'
  | 'respuesta_empresa'
  | 'otros';

export interface Step6Data {
  pretensiones: Pretension[];
  notasAdicionales?: string;
}

export interface DocumentoGenerado {
  identificacionReclamante: string;
  identificacionReclamado: string;
  relacionHechos: string;
  peticion: string;
  lugar: string;
  fecha: string;
}

export type DocumentoEditado = DocumentoGenerado;
