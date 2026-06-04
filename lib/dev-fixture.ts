import type { DocumentoGenerado, WizardData } from '@/lib/types';

/** Madrid OMIC test case for local development only. */
export const DEV_FIXTURE = {
  wizard: {
    step1: { tipo: 'facturacion_incorrecta' as const },
    step2: {
      nombreEmpresa: 'Movistar',
      cifNif: 'A82018474',
      sector: 'telefonia' as const,
      direccionEmpresa: 'Calle Gran Vía 28, Madrid',
      haContactadoEmpresa: true,
      fechaContacto: '2026-03-15',
      respuestaEmpresa: 'Me dijeron que la tarifa era correcta y no había error en la factura.',
    },
    step3: {
      nombreCompleto: 'Fabiano Calvay',
      dniNie: '12345678A',
      direccion: 'Calle Prueba 12, 3ºB',
      codigoPostal: '28013',
      ciudad: 'Madrid',
      email: 'fabiano@example.com',
      telefono: '600000000',
      condicion: 'consumidor_particular' as const,
    },
    step4: {
      fechaCompraContrato: '2026-01-10',
      importeEuros: 29.99,
      descripcionLoQueSeAcordo:
        'Contraté fibra 300Mb por 29,99€/mes con permanencia de 12 meses según la oferta publicitada en la web.',
      descripcionLoQueOcurrio:
        'En la primera factura me cobraron 45,99€ sin explicación clara. Llamé y no obtuve una solución.',
      fechaProblema: '2026-02-01',
      intentosResolucion: 'Llamé al 1004 dos veces y abrí incidencia por email el 20 de febrero.',
    },
    step5: {
      documentosDisponibles: ['factura_ticket', 'emails_chats', 'respuesta_empresa'] as const,
      notasDocumentacion: 'Tengo facturas PDF y capturas del área de cliente.',
    },
    step6: {
      pretensiones: ['reembolso_dinero', 'rectificacion_factura'] as const,
      notasAdicionales: 'Solicito que se aplique la tarifa contratada desde el primer mes.',
    },
    step7Confirmed: true,
  } satisfies WizardData,
  documento: {
    identificacionReclamante:
      'Fabiano Calvay, DNI 12345678A, Calle Prueba 12 3ºB, 28013 Madrid, fabiano@example.com, 600000000',
    identificacionReclamado:
      'Movistar, CIF A82018474, sector telecomunicaciones, Calle Gran Vía 28, Madrid',
    relacionHechos:
      '1. El día 10 de enero de 2026 contraté un servicio de fibra con tarifa mensual de 29,99€.\n2. En la factura de febrero de 2026 se cargó un importe de 45,99€.\n3. Contacté con la empresa en marzo de 2026 y no se regularizó el importe.',
    peticion:
      'Solicito el reembolso del importe cobrado de más y la rectificación de las facturas conforme a la tarifa acordada.',
    lugar: 'Madrid',
    fecha: 'Madrid, 4 de junio de 2026',
  } satisfies DocumentoGenerado,
};
