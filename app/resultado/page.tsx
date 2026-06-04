'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import DocumentViewer from '@/components/resultado/DocumentViewer';
import DisclaimerModal from '@/components/resultado/DisclaimerModal';
import { clearWizardData, loadGeneratedDocument } from '@/lib/wizard-store';
import type { DocumentoGenerado } from '@/lib/types';

export default function ResultadoPage() {
  const router = useRouter();
  const [doc, setDoc] = useState<DocumentoGenerado | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const loaded = loadGeneratedDocument();
    if (!loaded) {
      router.replace('/reclamacion');
      return;
    }
    setDoc(loaded);
  }, [router]);

  const handlePrint = () => {
    setModalOpen(false);
    // Wait for React to unmount the modal before opening the print dialog
    window.setTimeout(() => window.print(), 200);
  };

  if (!doc) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center text-text-secondary">
        Cargando borrador...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 rounded-xl border border-warning/40 bg-[#f5ebe3] px-4 py-3 text-sm text-text-primary no-print">
        <strong>BORRADOR</strong> — Revisa cada sección antes de usar este documento. Puedes editar
        cualquier campo. Este documento no ha sido revisado por un abogado. Reclama no es un abogado.
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        <div className="card-surface print-document">
          <DocumentViewer documento={doc} onChange={setDoc} />
        </div>

        <aside className="no-print space-y-4">
          <Button className="w-full" onClick={() => setModalOpen(true)}>
            Descargar PDF (borrador)
          </Button>
          <Button asChild variant="secondary" className="w-full">
            <Link href="/guia-envio">Guía de envío</Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => {
              clearWizardData();
              router.push('/reclamacion');
            }}
          >
            Empezar de nuevo
          </Button>
          <div className="info-box text-xs">
            Esta herramienta no sustituye a un abogado. Puedes encontrar abogados de guardia en tu
            Colegio de Abogados provincial.
          </div>
        </aside>
      </div>

      <DisclaimerModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAccept={handlePrint}
      />
    </div>
  );
}
