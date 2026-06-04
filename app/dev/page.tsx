'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { saveCaseId } from '@/lib/case-store';
import { saveGeneratedDocument, saveWizardData } from '@/lib/wizard-store';
import type { DocumentoGenerado, WizardData } from '@/lib/types';

export default function DevPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    caseId: string;
    links: { resultado: string; tier2: string };
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const seedCase = async (redirect: 'tier2' | 'resultado') => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/dev/seed', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Error');

      saveWizardData(data.wizardData as WizardData);
      saveGeneratedDocument(data.documento as DocumentoGenerado);
      saveCaseId(data.caseId);

      setResult({ caseId: data.caseId, links: data.links });

      if (redirect === 'tier2') {
        router.push(data.links.tier2);
      } else {
        router.push(data.links.resultado);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al crear caso');
      setLoading(false);
    }
  };

  if (process.env.NODE_ENV === 'production') {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p>No disponible en producción.</p>
        <Link href="/" className="text-accent-blue underline">
          Inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <p className="text-xs font-medium uppercase tracking-wide text-warning">Solo desarrollo</p>
      <h1 className="mt-2 font-display text-3xl font-medium">Caso de prueba Madrid</h1>
      <p className="mt-4 text-text-secondary">
        Crea un caso completo (Movistar, Madrid, CP 28013) con borrador generado y ruta OMIC verificada.
        No necesitas rellenar el wizard.
      </p>

      {error && (
        <div className="mt-4 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3">
        <Button size="lg" disabled={loading} onClick={() => seedCase('tier2')}>
          {loading ? 'Creando…' : 'Crear y abrir Tier 2 (Sede)'}
        </Button>
        <Button variant="secondary" disabled={loading} onClick={() => seedCase('resultado')}>
          Crear y abrir resultado (borrador)
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>

      {result && (
        <div className="info-box mt-6 text-sm">
          <p>
            <strong>Caso:</strong> <code className="text-xs">{result.caseId}</code>
          </p>
          <p className="mt-2">
            <Link href={result.links.tier2} className="text-accent-blue underline">
              Tier 2
            </Link>
            {' · '}
            <Link href={result.links.resultado} className="text-accent-blue underline">
              Resultado
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
