import { DEV_FIXTURE } from '@/lib/dev-fixture';

export const MADRID_ONLINE_START_URL =
  'https://sede.madrid.es/sites/v/index.jsp?target=enLinea&vgnextchannel=23a99c5ffb020310VgnVCM100000171f5a0aRCRD&vgnextoid=6cc20d9772448210VgnVCM2000000c205a0aRCRD';

export const MADRID_PROCEDURE_INFO_URL =
  'https://sede.madrid.es/portal/site/tramites/menuitem.62876cb64654a55e2dbd7003a8a409a0/?vgnextchannel=3deaa38813180210VgnVCM100000c90da8c0RCRD&vgnextfmt=default&vgnextoid=6cc20d9772448210VgnVCM2000000c205a0aRCRD';

export const MADRID_GUIDE_STEPS = [
  {
    order: 1,
    title: 'Abrir la ficha del trámite',
    description:
      'Pulsa «Abrir trámite en línea» abajo. Se abrirá la ficha «Reclamaciones y denuncias de consumo» (a veces la página baja sola hasta la sección «Tramitar»).',
  },
  {
    order: 2,
    title: 'Iniciar la solicitud en línea',
    description:
      'En la sección «Tramitar», columna «En línea», pulsa «Solicitud de reclamaciones y denuncias de consumo». No uses «Aporte de documentación» salvo que ya hayas presentado la reclamación.',
  },
  {
    order: 3,
    title: 'Identificarse (Sistema de identificación)',
    description:
      'Verás «SISTEMA DE IDENTIFICACIÓN» del Ayuntamiento de Madrid. Elige Cl@ve Móvil, Cl@ve Permanente, DNIe/Certificado o eID.AS (UE). Reclama nunca te pedirá contraseñas ni PIN.',
  },
  {
    order: 4,
    title: 'Datos del consumidor',
    description: 'Rellena o pega los datos del consumidor desde los bloques de copia de esta página.',
  },
  {
    order: 5,
    title: 'Datos de la empresa',
    description: 'Rellena o pega los datos de la empresa reclamada.',
  },
  {
    order: 6,
    title: 'Hechos',
    description: 'Copia el texto de hechos y pégalo en el formulario oficial.',
  },
  {
    order: 7,
    title: 'Solicitud',
    description: 'Copia la solicitud/pretensiones y pégala en el campo correspondiente.',
  },
  {
    order: 8,
    title: 'Adjuntar documentos',
    description: 'Sube el PDF de reclamación y las pruebas que tengas preparadas.',
  },
  {
    order: 9,
    title: 'Revisar y enviar',
    description: 'Revisa todos los datos antes de enviar. No cierres la web sin descargar el justificante.',
  },
  {
    order: 10,
    title: 'Descargar justificante',
    description: 'Descarga el justificante o número de registro y guárdalo en un lugar seguro.',
  },
];

const d = DEV_FIXTURE.documento;

export const MADRID_DEMO_COPY_FIELDS = {
  consumer: d.identificacionReclamante,
  company: d.identificacionReclamado,
  facts: d.relacionHechos,
  request: d.peticion,
  evidenceIndex: `Documentación de ejemplo (caso demo Movistar, Madrid):\n- Factura / ticket\n- Emails o chats\n- Respuesta de la empresa\n\n${DEV_FIXTURE.wizard.step5.notasDocumentacion}`,
};
