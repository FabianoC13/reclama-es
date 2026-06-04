'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Tier2Disclaimer } from '@/components/tier2/DisclaimerBox';
import {
  MADRID_DEMO_COPY_FIELDS,
  MADRID_GUIDE_STEPS,
  MADRID_ONLINE_START_URL,
  MADRID_PROCEDURE_INFO_URL,
} from '@/lib/static-madrid-sede';
import { ExternalLink, Copy, Check } from 'lucide-react';

const basePath = process.env.NEXT_PUBLIC_GITHUB_PAGES === 'true' ? '/reclama-es' : '';

export default function StaticSedeCopilot({ embedded = false }: { embedded?: boolean }) {
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const copyFields = MADRID_DEMO_COPY_FIELDS;

  const copyText = (key: string, text: string) => {
    void navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const openOfficialSite = () => {
    window.open(MADRID_ONLINE_START_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={embedded ? 'mx-auto max-w-6xl' : 'mx-auto max-w-4xl px-4 py-8 sm:px-6'}>
      {!embedded && (
        <Link href={`${basePath}/`} className="text-sm text-accent-blue hover:underline">
          ← Inicio
        </Link>
      )}

      <h2 className={`font-display text-3xl font-medium ${embedded ? '' : 'mt-4'}`}>
        Presentación oficial en Sede Electrónica (Madrid)
      </h2>
      <p className="mt-2 text-text-secondary">
        Guía paso a paso para la Sede del Ayuntamiento de Madrid.
        {process.env.NEXT_PUBLIC_GITHUB_PAGES === 'true' && (
          <span className="text-warning"> · Demo publicada</span>
        )}
      </p>

      {process.env.NEXT_PUBLIC_GITHUB_PAGES === 'true' && !embedded && (
        <div className="mt-4 rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-text-secondary">
          En GitHub Pages no hay servidor: ves un <strong>caso de ejemplo</strong> (Movistar, CP
          28013) y la guía Sede. Para generar tu reclamación con IA y guardar el justificante, usa la
          app completa en local o en Vercel.
        </div>
      )}

      <div className={`grid gap-8 lg:grid-cols-2 ${embedded ? 'mt-6' : 'mt-8'}`}>
        <div className="space-y-4">
          <h2 className="font-display text-2xl">Presenta en la web oficial</h2>
          <p className="text-sm text-text-secondary">
            Trámite: «Reclamaciones y denuncias de consumo». El botón abre la ficha oficial; luego
            sigue los pasos marcados.
          </p>
          <Button onClick={openOfficialSite} className="w-full gap-2" size="lg">
            <ExternalLink className="h-4 w-4" />
            Abrir trámite en línea
          </Button>
          <div className="card-surface space-y-2 text-sm text-text-secondary">
            <p>
              <strong className="text-text-primary">Paso en la web oficial:</strong> sección{' '}
              <em>Tramitar</em> → <em>En línea</em> →{' '}
              <em>Solicitud de reclamaciones y denuncias de consumo</em>. Después verás{' '}
              <em>SISTEMA DE IDENTIFICACIÓN</em> (Cl@ve, certificado, DNIe…).
            </p>
            <p>
              <a
                href={MADRID_PROCEDURE_INFO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-blue hover:underline"
              >
                Ficha del trámite en la Sede (referencia)
              </a>
            </p>
          </div>
          <p className="text-xs text-warning">
            No cierres la web oficial sin descargar el justificante.
          </p>
          {MADRID_GUIDE_STEPS.map((s) => (
            <div key={s.order} className="card-surface text-sm">
              <label className="flex items-start gap-2">
                <Checkbox
                  checked={!!checkedSteps[s.order]}
                  onCheckedChange={(v) =>
                    setCheckedSteps((c) => ({ ...c, [s.order]: v === true }))
                  }
                />
                <span>
                  <strong>
                    {s.order}. {s.title}
                  </strong>
                  <p className="mt-1 text-text-secondary">{s.description}</p>
                </span>
              </label>
            </div>
          ))}
          <Tier2Disclaimer variant="mediation" />
        </div>
        <div className="space-y-4">
          <h3 className="font-medium">Campos para copiar (ejemplo)</h3>
          {(
            [
              ['facts', 'Hechos', copyFields.facts],
              ['request', 'Solicitud', copyFields.request],
              ['company', 'Empresa', copyFields.company],
              ['consumer', 'Consumidor', copyFields.consumer],
              ['evidence', 'Índice de pruebas', copyFields.evidenceIndex],
            ] as const
          ).map(([key, title, text]) => (
            <div key={key} className="card-surface">
              <div className="mb-2 flex justify-between">
                <span className="font-medium">{title}</span>
                <button
                  type="button"
                  className="flex items-center gap-1 text-xs text-accent-blue"
                  onClick={() => copyText(key, text)}
                >
                  {copied === key ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  Copiar
                </button>
              </div>
              <p className="max-h-32 overflow-auto whitespace-pre-wrap text-xs text-text-secondary">
                {text.slice(0, 400)}
                {text.length > 400 ? '…' : ''}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
