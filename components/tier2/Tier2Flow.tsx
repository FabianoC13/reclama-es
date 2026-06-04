'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Tier2Disclaimer } from '@/components/tier2/DisclaimerBox';
import { ExternalLink, Copy, Check } from 'lucide-react';

type Step = 'overview' | 'readiness' | 'package' | 'sede' | 'receipt' | 'done';

type RouteMatch = {
  bestRoute: {
    id: string;
    routeName: string;
    procedureName: string;
    routeType: string;
    notesUserFacing: string | null;
    lastVerifiedAt: string | null;
    officialProcedureUrl: string | null;
    stepGuideJson: string | null;
    authority: { name: string; shortName: string; municipality: string | null };
  } | null;
  confidence: string;
  reason: string;
  warnings: string[];
};

export default function Tier2Flow({ caseId }: { caseId: string }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>('overview');
  const [loading, setLoading] = useState(true);
  const [routeMatch, setRouteMatch] = useState<RouteMatch | null>(null);
  const [packageId, setPackageId] = useState<string | null>(null);
  const [, setPkgStatus] = useState<string | null>(null);
  const [copyFields, setCopyFields] = useState<Record<string, string> | null>(null);
  const [checklist, setChecklist] = useState<{ label: string; ok: boolean; critical: boolean }[]>([]);
  const [guideSteps, setGuideSteps] = useState<{ order: number; title: string; description: string; actionType?: string; copyFieldKey?: string }[]>([]);
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [readiness, setReadiness] = useState({
    hasClaveMovil: false,
    hasClavePermanente: false,
    hasCertificadoDigital: false,
    hasDnie: false,
    hasEidas: false,
    unsure: false,
    hasNoId: false,
    hasAutofirmaInstalled: null as boolean | null,
  });

  const [receiptForm, setReceiptForm] = useState({
    registryNumber: '',
    receiptNumber: '',
    submittedAt: '',
    notes: '',
  });
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [officialLink, setOfficialLink] = useState<{
    procedureInfoUrl?: string;
    procedureName?: string;
    expectedPageTitle?: string;
  } | null>(null);

  const hydrateFromStatus = (data: {
    package?: { id: string; status: string };
    copyFields?: Record<string, string> | null;
    checklist?: { label: string; ok: boolean; critical: boolean }[];
    routeMatch?: RouteMatch | null;
    steps?: {
      completed?: boolean;
      submittedExternal?: boolean;
      packageGenerated?: boolean;
      officialSiteOpened?: boolean;
      readinessDone?: boolean;
    };
  }) => {
    if (data.package?.id) {
      setPackageId(data.package.id);
      setPkgStatus(data.package.status);
    }
    if (data.copyFields) setCopyFields(data.copyFields);
    if (data.checklist?.length) setChecklist(data.checklist);
    try {
      const guideJson = data.routeMatch?.bestRoute?.stepGuideJson;
      if (guideJson) {
        const guide = JSON.parse(guideJson);
        setGuideSteps(guide?.steps ?? []);
      }
    } catch {
      setGuideSteps([]);
    }
    if (data.steps?.completed) setStep('done');
    else if (data.steps?.submittedExternal) setStep('receipt');
    else if (data.steps?.packageGenerated || data.steps?.officialSiteOpened) setStep('sede');
    else if (data.steps?.readinessDone) setStep('package');
  };

  const loadStatus = useCallback(async () => {
    const res = await fetch(`/api/cases/${caseId}/tier2/status`);
    if (!res.ok) throw new Error('status');
    const data = await res.json();
    hydrateFromStatus(data);
    return data;
  }, [caseId]);

  useEffect(() => {
    (async () => {
      try {
        const startRes = await fetch(`/api/cases/${caseId}/tier2/start`, { method: 'POST' });
        if (!startRes.ok) {
          if (startRes.status === 404) {
            setError(
              'No se encontró este caso o la sesión no coincide. Crea un caso de prueba en /dev.',
            );
          } else {
            setError('No se pudo iniciar el flujo Tier 2');
          }
          return;
        }
        const routeRes = await fetch(`/api/cases/${caseId}/tier2/route`);
        if (!routeRes.ok) {
          setError('No se pudo cargar la ruta oficial');
          return;
        }
        const routeData = await routeRes.json();
        setRouteMatch(routeData);
        await loadStatus();
      } catch {
        setError('No se pudo cargar el flujo Tier 2. Comprueba la base de datos (npm run db:setup).');
      } finally {
        setLoading(false);
      }
    })();
  }, [caseId, loadStatus]);

  useEffect(() => {
    if (step !== 'sede' || !packageId || copyFields) return;
    (async () => {
      const res = await fetch(`/api/tier2/packages/${packageId}/copy-fields`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.copyFields) setCopyFields(data.copyFields);
    })();
  }, [step, packageId, copyFields]);

  const startReadiness = () => {
    if (!routeMatch?.bestRoute) return;
    setStep('readiness');
  };

  const saveReadiness = async () => {
    const res = await fetch(`/api/cases/${caseId}/tier2/readiness`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(readiness),
    });
    const data = await res.json();
    if (data.shouldUseEmailFallback && readiness.hasNoId) {
      router.push(`/casos/${caseId}/tier1-email`);
      return;
    }
    setStep('package');
  };

  const generatePackage = async () => {
    if (!routeMatch?.bestRoute) return;
    setLoading(true);
    const res = await fetch(`/api/cases/${caseId}/tier2/package`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ routeId: routeMatch.bestRoute.id }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? 'Error');
      return;
    }
    setPackageId(data.package.id);
    setPkgStatus(data.package.status);
    setCopyFields(data.copyFields);
    setChecklist(data.checklist);
    try {
      const guide = routeMatch.bestRoute.stepGuideJson
        ? JSON.parse(routeMatch.bestRoute.stepGuideJson)
        : null;
      setGuideSteps(guide?.steps ?? []);
    } catch {
      setGuideSteps([]);
    }
    setStep('sede');
  };

  const openOfficialSite = async () => {
    if (!packageId) return;
    const res = await fetch(`/api/tier2/packages/${packageId}/open-official-site`, { method: 'POST' });
    const data = await res.json();
    if (!res.ok || !data.url) return;
    setOfficialLink({
      procedureInfoUrl: data.procedureInfoUrl,
      procedureName: data.procedureName,
      expectedPageTitle: data.expectedPageTitle,
    });
    window.open(data.url, '_blank', 'noopener,noreferrer');
    setPkgStatus('opened_official_site');
  };

  const markSubmitted = async (blockerType?: string) => {
    if (!packageId) return;
    await fetch(`/api/tier2/packages/${packageId}/mark-submitted`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(blockerType ? { blockerType } : {}),
    });
    if (blockerType) {
      router.push(`/casos/${caseId}/tier1-email`);
      return;
    }
    setStep('receipt');
  };

  const saveReceipt = async () => {
    if (!packageId) return;
    setLoading(true);
    if (receiptFile) {
      const fd = new FormData();
      fd.append('file', receiptFile);
      fd.append('registryNumber', receiptForm.registryNumber);
      fd.append('receiptNumber', receiptForm.receiptNumber);
      fd.append('submittedAt', receiptForm.submittedAt);
      fd.append('notes', receiptForm.notes);
      await fetch(`/api/tier2/packages/${packageId}/receipt/upload`, { method: 'POST', body: fd });
    } else {
      await fetch(`/api/tier2/packages/${packageId}/receipt/manual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(receiptForm),
      });
    }
    setLoading(false);
    setStep('done');
  };

  const copyText = (key: string, text: string) => {
    void navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading && step === 'overview') {
    return <p className="py-12 text-center text-text-secondary">Cargando copiloto Sede...</p>;
  }

  const progressSteps = [
    'Requisitos',
    'Paquete',
    'Sede oficial',
    'Justificante',
    'Completado',
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link href="/resultado" className="text-sm text-accent-blue hover:underline">
        ← Volver al borrador
      </Link>

      <h1 className="mt-4 font-display text-3xl font-medium">Presentación oficial en Sede Electrónica</h1>
      <p className="mt-2 text-text-secondary">
        Caso <code className="text-xs">{decodeURIComponent(caseId).slice(0, 12)}</code>
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {progressSteps.map((label, i) => (
          <span
            key={label}
            className="rounded-full border border-border px-3 py-1 text-xs text-text-secondary"
          >
            {i + 1}. {label}
          </span>
        ))}
      </div>

      {error && (
        <div className="mt-4 space-y-3 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          <p>{error}</p>
          <Button asChild variant="secondary" size="sm">
            <Link href="/dev">Crear caso de prueba (dev)</Link>
          </Button>
        </div>
      )}

      {step === 'overview' && (
        <div className="mt-8 space-y-6">
          <Tier2Disclaimer variant="overview" />
          {routeMatch?.bestRoute ? (
            <div className="card-surface">
              <p className="text-sm text-accent-green font-medium">Ruta verificada · {routeMatch.confidence}</p>
              <h2 className="mt-2 font-display text-xl">{routeMatch.bestRoute.authority.name}</h2>
              <p className="text-text-secondary">{routeMatch.bestRoute.procedureName}</p>
              <p className="mt-2 text-sm">{routeMatch.reason}</p>
              {routeMatch.bestRoute.notesUserFacing && (
                <p className="mt-3 text-sm text-text-secondary">{routeMatch.bestRoute.notesUserFacing}</p>
              )}
              <ul className="mt-3 list-disc pl-5 text-sm text-text-secondary">
                {routeMatch.warnings.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="card-surface">
              <p className="font-medium">Ruta oficial no verificada aún</p>
              <p className="mt-2 text-sm text-text-secondary">{routeMatch?.reason}</p>
              <Button asChild variant="secondary" className="mt-4">
                <Link href={`/casos/${caseId}/tier1-email`}>Usar flujo por correo</Link>
              </Button>
            </div>
          )}
          <Tier2Disclaimer variant="mediation" />
          {routeMatch?.bestRoute && (
            <Button size="lg" onClick={startReadiness}>
              Continuar
            </Button>
          )}
        </div>
      )}

      {step === 'readiness' && (
        <div className="mt-8 space-y-6">
          <h2 className="font-display text-2xl">Comprueba tu identificación electrónica</h2>
          <p className="text-text-secondary">
            La mayoría de presentaciones electrónicas requieren identificarte en la web oficial. Selecciona lo
            que ya tienes.
          </p>
          {[
            ['hasClaveMovil', 'Cl@ve Móvil'],
            ['hasClavePermanente', 'Cl@ve Permanente'],
            ['hasCertificadoDigital', 'Certificado digital'],
            ['hasDnie', 'DNIe'],
            ['hasEidas', 'eIDAS'],
            ['unsure', 'No estoy seguro/a'],
            ['hasNoId', 'No tengo ninguno'],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center gap-3">
              <Checkbox
                checked={readiness[key as keyof typeof readiness] as boolean}
                onCheckedChange={(v) =>
                  setReadiness((r) => ({ ...r, [key]: v === true }))
                }
              />
              {label}
            </label>
          ))}
          <p className="font-medium">¿Tienes AutoFirma instalado?</p>
          <div className="flex gap-4">
            {(['Sí', 'No', 'No estoy seguro'] as const).map((opt, i) => (
              <label key={opt} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="autofirma"
                  onChange={() =>
                    setReadiness((r) => ({
                      ...r,
                      hasAutofirmaInstalled: i === 0 ? true : i === 1 ? false : null,
                    }))
                  }
                />
                {opt}
              </label>
            ))}
          </div>
          <div className="card-surface text-sm">
            Puedes usar el flujo por correo hoy. Para la Sede más adelante, configura Cl@ve o certificado en fnmt.es / clave.gob.es
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={saveReadiness}>Continuar</Button>
            <Button variant="secondary" asChild>
              <Link href={`/casos/${caseId}/tier1-email`}>Usar correo</Link>
            </Button>
          </div>
        </div>
      )}

      {step === 'package' && (
        <div className="mt-8 space-y-6">
          <h2 className="font-display text-2xl">Prepara tu paquete de presentación</h2>
          <ul className="space-y-2">
            {checklist.length === 0 &&
              ['Reclamación', 'Datos consumidor', 'Datos empresa', 'Hechos', 'Solicitud'].map((l) => (
                <li key={l} className="text-sm">
                  ○ {l}
                </li>
              ))}
            {checklist.map((item) => (
              <li key={item.label} className={`text-sm ${item.ok ? 'text-accent-green' : 'text-warning'}`}>
                {item.ok ? '✓' : '○'} {item.label}
                {!item.ok && !item.critical && ' (recomendado)'}
              </li>
            ))}
          </ul>
          <Button size="lg" onClick={generatePackage} disabled={loading}>
            Generar paquete de presentación oficial
          </Button>
        </div>
      )}

      {step === 'sede' && !packageId && (
        <div className="mt-8 space-y-4">
          <p className="text-sm text-text-secondary">
            Falta el paquete de presentación. Genera el paquete en el paso anterior o crea un caso nuevo en{' '}
            <Link href="/dev" className="text-accent-blue underline">
              /dev
            </Link>
            .
          </p>
          <Button variant="secondary" onClick={() => setStep('package')}>
            Ir a generar paquete
          </Button>
        </div>
      )}

      {step === 'sede' && packageId && !copyFields && (
        <p className="mt-8 text-center text-text-secondary">Cargando campos del paquete…</p>
      )}

      {step === 'sede' && packageId && copyFields && (
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="font-display text-2xl">Presenta en la web oficial</h2>
            <p className="text-sm text-text-secondary">
              {routeMatch?.bestRoute?.procedureName
                ? `Trámite: «${routeMatch.bestRoute.procedureName}». El botón abre el formulario en línea, no el buscador general de trámites.`
                : 'Abre el trámite en una pestaña nueva y mantén esta guía abierta.'}
            </p>
            <Button onClick={openOfficialSite} className="w-full gap-2" size="lg">
              <ExternalLink className="h-4 w-4" />
              Abrir trámite en línea
            </Button>
            <div className="card-surface space-y-2 text-sm text-text-secondary">
              <p>
                <strong className="text-text-primary">Paso en la web oficial (después del botón):</strong>{' '}
                baja a la sección <em>Tramitar</em> → columna <em>En línea</em> → pulsa{' '}
                <em>Solicitud de reclamaciones y denuncias de consumo</em>. A continuación verás la
                pantalla <em>SISTEMA DE IDENTIFICACIÓN</em> (Cl@ve Móvil, Cl@ve Permanente, DNIe/Certificado,
                eID.AS…). Tras identificarte, se abrirá el formulario de la reclamación.
              </p>
              <p>
                <strong className="text-text-primary">Si ves «Buscar trámite o servicio»:</strong> has
                caído en la página general. Cierra esa pestaña, vuelve aquí y pulsa de nuevo «Abrir
                trámite en línea».
              </p>
              {(officialLink?.procedureInfoUrl ?? routeMatch?.bestRoute?.officialProcedureUrl) && (
                <p>
                  <a
                    href={
                      officialLink?.procedureInfoUrl ??
                      routeMatch!.bestRoute!.officialProcedureUrl!
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-blue hover:underline"
                  >
                    Ficha del trámite en la Sede (referencia)
                  </a>
                </p>
              )}
            </div>
            <p className="text-xs text-warning">
              No cierres la web oficial sin descargar el justificante.
            </p>
            {guideSteps.map((s) => (
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
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => markSubmitted()}>Sí, la he presentado</Button>
              <Button variant="secondary" onClick={() => markSubmitted('cannot_login')}>
                Me he quedado bloqueado/a
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-medium">Campos para copiar</h3>
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
            <div className="flex flex-col gap-2">
              <a
                href={`/api/tier2/packages/${packageId}/files/complaint`}
                className="text-sm text-accent-blue underline"
              >
                Descargar PDF reclamación
              </a>
              <a
                href={`/api/tier2/packages/${packageId}/files/cover`}
                className="text-sm text-accent-blue underline"
              >
                Descargar carátula
              </a>
              <a
                href={`/api/tier2/packages/${packageId}/files/evidence`}
                className="text-sm text-accent-blue underline"
              >
                Descargar índice de pruebas
              </a>
            </div>
          </div>
        </div>
      )}

      {step === 'receipt' && packageId && (
        <div className="mt-8 space-y-6">
          <h2 className="font-display text-2xl">Guarda tu justificante oficial</h2>
          <Tier2Disclaimer variant="receipt" />
          <input
            type="file"
            accept=".pdf,image/png,image/jpeg"
            onChange={(e) => setReceiptFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm"
          />
          <input
            className="input-field"
            placeholder="Número de registro"
            value={receiptForm.registryNumber}
            onChange={(e) => setReceiptForm((f) => ({ ...f, registryNumber: e.target.value }))}
          />
          <input
            className="input-field"
            placeholder="Número de justificante (opcional)"
            value={receiptForm.receiptNumber}
            onChange={(e) => setReceiptForm((f) => ({ ...f, receiptNumber: e.target.value }))}
          />
          <input
            type="date"
            className="input-field"
            value={receiptForm.submittedAt}
            onChange={(e) => setReceiptForm((f) => ({ ...f, submittedAt: e.target.value }))}
          />
          <textarea
            className="input-field"
            rows={2}
            placeholder="Notas (opcional)"
            value={receiptForm.notes}
            onChange={(e) => setReceiptForm((f) => ({ ...f, notes: e.target.value }))}
          />
          <Button size="lg" onClick={saveReceipt} disabled={loading}>
            Guardar justificante
          </Button>
        </div>
      )}

      {step === 'done' && (
        <div className="mt-8 space-y-6">
          <h2 className="font-display text-2xl">Presentación oficial registrada</h2>
          <p className="text-text-secondary">
            Tu justificante ha sido guardado. Esto ayuda a acreditar que presentaste la reclamación.
          </p>
          <Tier2Disclaimer variant="mediation" />
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/resultado">Volver al borrador</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href={`/casos/${caseId}/tier2`}>Ver estado Tier 2</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
