import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const MADRID_STEP_GUIDE = {
  id: 'madrid-omic-sede-guide-v1',
  title: 'Presentar una reclamación de consumo en la Sede Electrónica de Madrid',
  steps: [
    {
      order: 1,
      title: 'Abrir la Sede oficial',
      description:
        'Pulsa el botón para abrir el trámite oficial en una pestaña nueva. No cierres esta guía.',
      actionType: 'open_url',
    },
    {
      order: 2,
      title: 'Iniciar tramitación en línea',
      description:
        'Busca el botón de tramitación en línea. La etiqueta puede ser «Tramitar en línea» o similar.',
      actionType: 'manual',
    },
    {
      order: 3,
      title: 'Identificarse',
      description:
        'Identifícate con Cl@ve, certificado digital, DNIe, eIDAS u otro método aceptado. Reclama nunca te pedirá contraseñas ni PIN.',
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
    },
    create: {
      authorityId: authority.id,
      routeName: 'Madrid OMIC - Reclamaciones y denuncias de consumo',
      routeSlug: 'madrid-omic-reclamaciones-consumo',
      routeType: 'sede_specific_form',
      procedureName: 'Reclamaciones y denuncias de consumo',
      officialProcedureUrl:
        'https://sede.madrid.es/portal/site/tramites/menuitem.8e2b315002eb74a9c81deed1052898ca/?vgnextoid=8e2b315002eb74a9c81deed1052898ca&vgnextchannel=8e2b315002eb74a9c81deed1052898ca',
      onlineStartUrl: 'https://sede.madrid.es',
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
        'Esta vía oficial permite presentar una reclamación de consumo a través de la Sede Electrónica de Madrid. Deberás identificarte con un método electrónico aceptado. Tras el envío, descarga y guarda el justificante oficial.',
      stepGuideJson: JSON.stringify(MADRID_STEP_GUIDE),
    },
  });

  console.log('Seed: Madrid OMIC route ready');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
