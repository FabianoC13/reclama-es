const steps = [
  {
    title: 'Localiza tu OMIC',
    body: 'Cada municipio tiene su propia OMIC. Búscala en la web de tu ayuntamiento o en consumo.es.',
  },
  {
    title: 'Prepara tu documentación',
    body: 'Lleva facturas, contratos, correos y cualquier comunicación con la empresa.',
  },
  {
    title: 'Presentación presencial',
    body: 'Acude con tu borrador revisado. Puede que necesites cita previa.',
  },
  {
    title: 'Presentación telemática',
    body: 'Muchos ayuntamientos permiten presentar en línea con Cl@ve o certificado digital.',
  },
  {
    title: 'Qué ocurre después',
    body: 'La OMIC suele contactar con la empresa e intentar una mediación.',
  },
  {
    title: 'Conserva copias de todo',
    body: 'Guarda el borrador, la documentación y el justificante de presentación.',
  },
];

export default function GuiaEnvioSection() {
  return (
    <section id="guia-envio" className="scroll-mt-24 py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-semibold">Cómo presentar tu reclamación</h2>
        <p className="mt-4 text-text-secondary">
          Pasos generales una vez tengas tu borrador revisado. Los detalles pueden variar por
          municipio.
        </p>
        <div className="info-box mt-6 text-sm">
          Consulta siempre la página oficial de tu OMIC local.
        </div>
        <ol className="mt-10 space-y-8">
          {steps.map((step, i) => (
            <li key={step.title} className="relative border-l-2 border-border pl-8">
              <span className="absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-text-primary text-sm font-medium text-bg-surface">
                {i + 1}
              </span>
              <h3 className="font-display text-xl font-medium">{step.title}</h3>
              <p className="mt-2 text-text-secondary">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
