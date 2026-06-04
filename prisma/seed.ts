import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const MADRID_STEP_GUIDE = {
  id: 'madrid-omic-sede-guide-v2',
  title: 'Presentar una reclamación de consumo en la Sede Electrónica de Madrid',
  steps: [
    {
      order: 1,
      title: 'Abrir la ficha del trámite',
      description:
        'Pulsa «Abrir trámite en línea» en esta app. Se abrirá la ficha «Reclamaciones y denuncias de consumo» (a veces la página baja sola hasta la sección «Tramitar»).',
      actionType: 'open_url',
    },
    {
      order: 2,
      title: 'Iniciar la solicitud en línea',
      description:
        'En la sección «Tramitar», columna «En línea», pulsa el enlace «Solicitud de reclamaciones y denuncias de consumo». No uses «Aporte de documentación» salvo que ya hayas presentado la reclamación.',
      actionType: 'manual',
    },
    {
      order: 3,
      title: 'Identificarse (Sistema de identificación)',
      description:
        'Verás la pantalla «SISTEMA DE IDENTIFICACIÓN» del Ayuntamiento de Madrid. Elige el mismo método que marcaste en Reclama: Cl@ve Móvil, Cl@ve Permanente, DNIe/Certificado o eID.AS (UE). Completa el acceso en la web oficial; Reclama nunca te pedirá contraseñas ni PIN.',
      actionType: 'manual',
    },
    {
      order: 4,
      title: 'Datos del consumidor',
      description: 'Rellena o pega los datos del consumidor desde el bloque preparado en esta app.',
      actionType: 'copy_field',
      copyFieldKey: 'consumer',
    },
    {
      order: 5,
      title: 'Datos de la empresa',
      description: 'Rellena o pega los datos de la empresa reclamada.',
      actionType: 'copy_field',
      copyFieldKey: 'company',
    },
    {
      order: 6,
      title: 'Hechos',
      description: 'Copia el texto de hechos y pégalo en el formulario oficial.',
      actionType: 'copy_field',
      copyFieldKey: 'facts',
    },
    {
      order: 7,
      title: 'Solicitud',
      description: 'Copia la solicitud/pretensiones y pégala en el campo correspondiente.',
      actionType: 'copy_field',
      copyFieldKey: 'request',
    },
    {
      order: 8,
      title: 'Adjuntar documentos',
      description:
        'Sube el PDF de reclamación, la carátula y las pruebas indicadas en el índice de documentación.',
      actionType: 'manual',
    },
    {
      order: 9,
      title: 'Revisar y enviar',
      description: 'Revisa todos los datos antes de enviar. No cierres la web sin descargar el justificante.',
      actionType: 'manual',
    },
    {
      order: 10,
      title: 'Descargar justificante',
      description:
        'Descarga el justificante, resguardo o número de registro. Vuelve a Reclama para subirlo.',
      actionType: 'manual',
    },
  ],
};

async function main() {
  const authority = await prisma.officialAuthority.upsert({
    where: { id: 'seed-madrid-omic' },
    update: {},
    create: {
      id: 'seed-madrid-omic',
      name: 'Ayuntamiento de Madrid - Oficina Municipal de Información al Consumidor',
      shortName: 'OMIC Madrid',
      authorityType: 'municipal_omic',
      countryCode: 'ES',
      autonomousCommunity: 'Comunidad de Madrid',
      province: 'Madrid',
      municipality: 'Madrid',
      postalCodePrefixes: '28',
      officialWebsiteUrl: 'https://www.madrid.es',
      contactEmail: 'omic@madrid.es',
      verificationStatus: 'verified',
      lastVerifiedAt: new Date(),
      isActive: true,
    },
  });

  await prisma.officialSubmissionRoute.upsert({
    where: { routeSlug: 'madrid-omic-reclamaciones-consumo' },
    update: {
      lastVerifiedAt: new Date(),
      stepGuideJson: JSON.stringify(MADRID_STEP_GUIDE),
      procedureName: 'Reclamaciones y denuncias de consumo',
      officialProcedureUrl:
        'https://sede.madrid.es/portal/site/tramites/menuitem.62876cb64654a55e2dbd7003a8a409a0/?vgnextchannel=3deaa38813180210VgnVCM100000c90da8c0RCRD&vgnextfmt=default&vgnextoid=6cc20d9772448210VgnVCM2000000c205a0aRCRD',
      onlineStartUrl:
        'https://sede.madrid.es/sites/v/index.jsp?target=enLinea&vgnextchannel=23a99c5ffb020310VgnVCM100000171f5a0aRCRD&vgnextoid=6cc20d9772448210VgnVCM2000000c205a0aRCRD',
      notesUserFacing:
        'Tras abrir la ficha, en «Tramitar» → «En línea» debes pulsar «Solicitud de reclamaciones y denuncias de consumo». Luego te pedirán identificarte (Cl@ve, certificado, etc.).',
    },
    create: {
      authorityId: authority.id,
      routeName: 'Madrid OMIC - Reclamaciones y denuncias de consumo',
      routeSlug: 'madrid-omic-reclamaciones-consumo',
      routeType: 'sede_specific_form',
      procedureName: 'Reclamaciones y denuncias de consumo',
      officialProcedureUrl:
        'https://sede.madrid.es/portal/site/tramites/menuitem.62876cb64654a55e2dbd7003a8a409a0/?vgnextchannel=3deaa38813180210VgnVCM100000c90da8c0RCRD&vgnextfmt=default&vgnextoid=6cc20d9772448210VgnVCM2000000c205a0aRCRD',
      onlineStartUrl:
        'https://sede.madrid.es/sites/v/index.jsp?target=enLinea&vgnextchannel=23a99c5ffb020310VgnVCM100000171f5a0aRCRD&vgnextoid=6cc20d9772448210VgnVCM2000000c205a0aRCRD',
      requiresElectronicId: true,
      supportedAuthMethods: JSON.stringify([
        'clave_movil',
        'clave_permanente',
        'certificado_digital',
        'dnie',
        'eidas',
        'local_identity_system',
      ]),
      mayRequireAutofirma: true,
      autofirmaRequiredKnown: false,
      receiptExpected: true,
      receiptNames: JSON.stringify(['justificante', 'resguardo', 'número de registro']),
      routeCoverage: 'municipality',
      fallbackEmail: 'omic@madrid.es',
      verificationStatus: 'verified',
      lastVerifiedAt: new Date(),
      notesUserFacing:
        'Tras abrir la ficha, en «Tramitar» → «En línea» debes pulsar «Solicitud de reclamaciones y denuncias de consumo». Luego te pedirán identificarte (Cl@ve, certificado, etc.).',
      stepGuideJson: JSON.stringify(MADRID_STEP_GUIDE),
    },
  });

  console.log('Seed: Madrid OMIC route ready');

  // Dev test case (stable session for /dev page)
  const { DEV_FIXTURE } = await import('../lib/dev-fixture');
  const { syncCaseFromSession } = await import('../lib/tier2/case-sync');
  const DEV_SESSION_ID = 'dev-local-session';
  const existing = await prisma.case.findFirst({ where: { sessionId: DEV_SESSION_ID } });
  const c = await syncCaseFromSession(
    DEV_SESSION_ID,
    DEV_FIXTURE.wizard,
    DEV_FIXTURE.documento,
    existing?.id,
  );
  console.log('Seed: dev test case', c.id, '→ /dev or /casos/' + c.id + '/tier2');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
