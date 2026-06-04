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
      <h2 className="font-display text-xl font-medium">{title}</h2>
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

export default function ProcedimientosPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-medium">Procedimientos disponibles</h1>
      <p className="mt-4 text-text-secondary">
        Esta herramienta te ayuda a preparar documentación para los siguientes procedimientos
        administrativos. Esta es información general — no asesoramiento sobre tu situación concreta.
      </p>
      <div className="mt-10 space-y-6">
        <ProcedureCard
          title="OMIC — Hoja de Reclamación al Consumidor"
          description="La Oficina Municipal de Información al Consumidor atiende reclamaciones entre consumidores y empresas. El trámite es gratuito y suele comenzar con una mediación."
          badge="Disponible ahora"
          available
        />
        <ProcedureCard
          title="Juzgado de Paz — Reclamación de Menor Cuantía"
          description="Para reclamaciones económicas de menor cuantía (por debajo de ciertos umbrales legales). Información general; requisitos según comunidad autónoma."
          badge="Próximamente"
          available={false}
        />
        <ProcedureCard
          title="Reclamación de Fianza de Alquiler"
          description="Trámite ante organismos autonómicos o municipales para la devolución de fianzas de alquiler. Los organismos competentes varían (por ejemplo IVIMA en Madrid)."
          badge="Próximamente"
          available={false}
        />
      </div>
      <div className="disclaimer-box mt-10 text-sm">
        Reclama no es un abogado. Esta página contiene información general sobre procedimientos
        administrativos en España. No constituye asesoramiento jurídico. Verifique siempre los
        detalles con la autoridad competente de su municipio.
      </div>
    </div>
  );
}
