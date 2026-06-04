import Link from 'next/link';

const steps = [
  {
    title: 'Localiza tu OMIC',
    body: 'Cada municipio tiene su propia OMIC. Búscala en la web de tu ayuntamiento o en el portal oficial consumo.es.',
  },
  {
    title: 'Prepara tu documentación',
    body: 'Lleva facturas, contratos, correos, fotografías y cualquier comunicación con la empresa que hayas indicado en el formulario.',
  },
  {
    title: 'Presentación presencial',
    body: 'Acude a la oficina con tu borrador revisado y la documentación. Es posible que necesites pedir cita previa.',
  },
  {
    title: 'Presentación telemática',
    body: 'Muchos ayuntamientos permiten presentar la reclamación en línea, normalmente con certificado digital o Cl@ve. Busca en la Sede Electrónica de tu municipio: "[tu municipio] OMIC online".',
  },
  {
    title: 'Qué ocurre después',
    body: 'La OMIC suele contactar con la empresa e intentar una mediación. Los plazos y pasos posteriores dependen de cada municipio.',
  },
  {
    title: 'Conserva copias de todo',
    body: 'Guarda copias del borrador, de la documentación aportada y del justificante de presentación.',
  },
];

export default function GuiaEnvioPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-medium">Cómo presentar tu reclamación en la OMIC</h1>
      <p className="mt-4 text-text-secondary">
        Sigue estos pasos una vez hayas descargado tu borrador y lo hayas revisado.
      </p>
      <div className="info-box mt-6">
        Esta guía es de carácter informativo y general. Los plazos y procedimientos concretos pueden
        variar según tu municipio. Consulta siempre la página oficial de tu OMIC local.
      </div>
      <ol className="mt-10 space-y-8">
        {steps.map((step, i) => (
          <li key={step.title} className="relative border-l-2 border-border pl-8">
            <span className="absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-text-primary text-sm font-medium text-bg-surface">
              {i + 1}
            </span>
            <h2 className="font-display text-xl font-medium">{step.title}</h2>
            <p className="mt-2 text-text-secondary">{step.body}</p>
          </li>
        ))}
      </ol>
      <div className="card-surface mt-10 text-sm text-text-secondary">
        ¿No tienes certificado digital? Consulta cómo obtenerlo en la web de la FNMT:{' '}
        <a href="https://www.fnmt.es" className="text-accent-blue underline" target="_blank" rel="noreferrer">
          fnmt.es
        </a>
      </div>
      <p className="mt-8 text-center">
        <Link href="/resultado" className="text-sm text-accent-blue hover:underline">
          ← Volver al borrador
        </Link>
      </p>
    </div>
  );
}
