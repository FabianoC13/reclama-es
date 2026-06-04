import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="no-print border-t border-border bg-bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <p className="mb-2 font-display text-lg font-medium">Reclama</p>
          <p className="text-sm text-text-secondary">
            Reclama es una herramienta de asistencia administrativa para consumidores en España. No
            es un despacho de abogados y no proporciona asesoramiento jurídico.
          </p>
        </div>
        <div>
          <p className="mb-3 text-sm font-medium">Procedimientos</p>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li>
              <Link href="/procedimientos" className="hover:text-text-primary">
                Procedimientos disponibles
              </Link>
            </li>
            <li>
              <Link href="/guia-envio" className="hover:text-text-primary">
                Guía de envío OMIC
              </Link>
            </li>
            <li>
              <Link href="/reclamacion" className="hover:text-text-primary">
                Empezar reclamación
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-medium">Legal</p>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li>Aviso legal</li>
            <li>Política de privacidad</li>
            <li>Aviso sobre IA</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border px-4 py-4 text-center text-xs text-text-tertiary">
        © {new Date().getFullYear()} Reclama. Esta herramienta no proporciona asesoramiento jurídico.
      </div>
    </footer>
  );
}
