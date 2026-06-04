'use client';

import { Button } from '@/components/ui/button';

type Props = {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
};

export default function DisclaimerModal({ open, onClose, onAccept }: Props) {
  if (!open) return null;

  return (
    <div className="no-print fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <div className="max-w-lg rounded-2xl border border-border bg-bg-surface p-6 shadow-xl">
        <h2 className="font-display text-xl font-medium">Antes de descargar tu borrador</h2>
        <div className="mt-4 space-y-2 text-sm text-text-secondary">
          <p>
            Este documento es un borrador generado automáticamente a partir de la información que tú
            has proporcionado. Recuerda:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Reclama no es un despacho de abogados y no ha dado asesoramiento jurídico.</li>
            <li>Eres tú quien decide presentar esta reclamación y en qué términos.</li>
            <li>Revisa el documento completo antes de presentarlo.</li>
            <li>Si tienes dudas sobre tu situación concreta, consulta a un abogado colegiado.</li>
          </ul>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onAccept}>Entendido — descargar borrador</Button>
        </div>
      </div>
    </div>
  );
}
