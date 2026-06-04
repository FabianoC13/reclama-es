import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Tier1EmailPage({ params }: { params: { caseId: string } }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display text-3xl font-medium">Presentación por correo (Tier 1)</h1>
      <p className="mt-4 text-text-secondary">
        Si no puedes usar la Sede Electrónica ahora, puedes enviar tu reclamación por correo electrónico a la
        OMIC. Descarga tu borrador desde la página de resultado, adjunta la documentación y envía el mensaje tú
        mismo.
      </p>
      <div className="disclaimer-box mt-6 text-sm">
        Reclama no envía el correo en tu nombre. No sustituye a un abogado. La mediación de la OMIC no garantiza
        reembolso.
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/resultado">Ir al borrador</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/guia-envio">Guía de envío OMIC</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href={`/casos/${params.caseId}/tier2`}>Volver a Sede electrónica</Link>
        </Button>
      </div>
      <p className="mt-6 text-sm text-text-tertiary">
        Contacto OMIC Madrid (referencia): omic@madrid.es — verifica siempre el correo oficial de tu municipio.
      </p>
    </div>
  );
}
