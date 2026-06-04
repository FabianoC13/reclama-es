import Link from 'next/link';
import { Button } from '@/components/ui/button';

function ProcedureCard({
  title,
  description,
  badge,
  available,
}: {
  title: string;
  description: string;
  badge: string;
  available: boolean;
}) {
  return (
    <article className="card-surface flex flex-col">
      <span
        className={`mb-4 inline-block w-fit rounded-full px-3 py-1 text-xs font-medium ${
          available ? 'bg-accent-green/20 text-accent-green' : 'bg-border text-text-tertiary'
        }`}
      >
        {badge}
      </span>
      <h3 className="font-display text-xl font-medium">{title}</h3>
      <p className="mt-3 flex-1 text-sm text-text-secondary">{description}</p>
      {available ? (
        <Button asChild className="mt-6 w-full sm:w-auto">
          <Link href="/reclamacion">Empezar reclamación OMIC</Link>
        </Button>
      ) : (
        <Button disabled className="mt-6 w-full sm:w-auto">
          Próximamente
        </Button>
      )}
    </article>
  );
}

export default function ProcedimientosSection() {
  return (
    <section id="procedimientos" className="scroll-mt-24 bg-bg-surface py-16 lg:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-semibold">Procedimientos disponibles</h2>
        <p className="mt-4 text-text-secondary">
          Información general sobre trámites que puedes preparar con Reclama. No es asesoramiento
          sobre tu caso concreto.
        </p>
        <div className="mt-10 space-y-6">
          <ProcedureCard
            title="OMIC — Hoja de Reclamación al Consumidor"
            description="La OMIC atiende reclamaciones entre consumidores y empresas. El trámite es gratuito y suele comenzar con una mediación."
            badge="Disponible ahora"
            available
          />
          <ProcedureCard
            title="Juzgado de Paz — Reclamación de Menor Cuantía"
            description="Para reclamaciones económicas de menor cuantía. Requisitos según comunidad autónoma."
            badge="Próximamente"
            available={false}
          />
          <ProcedureCard
            title="Reclamación de Fianza de Alquiler"
            description="Trámite ante organismos autonómicos o municipales. El organismo competente varía por ciudad."
            badge="Próximamente"
            available={false}
          />
        </div>
      </div>
    </section>
  );
}
