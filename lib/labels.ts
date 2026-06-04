import type { DocumentoDisponible, Pretension, SectorEmpresa, TipoReclamacion } from './types';

export const tipoLabels: Record<TipoReclamacion, string> = {
  producto_defectuoso: 'Producto defectuoso',
  servicio_no_prestado: 'Servicio no prestado',
  facturacion_incorrecta: 'Facturación incorrecta',
  publicidad_enganosa: 'Publicidad engañosa',
  entrega_no_realizada: 'Entrega no realizada',
  garantia_no_aplicada: 'Garantía no atendida',
  otro: 'Otro',
};

export const sectorLabels: Record<SectorEmpresa, string> = {
  telefonia: 'Telefonía y comunicaciones',
  energia: 'Energía y suministros',
  banca_seguros: 'Banca y seguros',
  transporte: 'Transporte y mensajería',
  comercio_electronico: 'Comercio electrónico',
  restauracion_hosteleria: 'Restauración y hostelería',
  salud_bienestar: 'Salud y bienestar',
  educacion: 'Educación',
  otro: 'Otro',
};

export const pretensionLabels: Record<Pretension, string> = {
  reembolso_dinero: 'Reembolso del importe pagado',
  reparacion_sustitucion: 'Reparación o sustitución del producto',
  prestacion_correcta: 'Prestación correcta del servicio contratado',
  compensacion_danios: 'Compensación por los perjuicios sufridos',
  rectificacion_factura: 'Rectificación de la factura emitida',
  anulacion_contrato: 'Anulación del contrato',
};

export const documentoLabels: Record<DocumentoDisponible, string> = {
  factura_ticket: 'Factura o ticket de compra',
  contrato_presupuesto: 'Contrato o presupuesto',
  emails_chats: 'Correos electrónicos o chats',
  fotografias: 'Fotografías o capturas de pantalla',
  respuesta_empresa: 'Respuesta de la empresa',
  otros: 'Otros documentos',
};

export const condicionLabels = {
  consumidor_particular: 'Como consumidor particular',
  autonomo: 'Como autónomo/profesional',
  representante_empresa: 'En representación de una empresa (PYME)',
};
