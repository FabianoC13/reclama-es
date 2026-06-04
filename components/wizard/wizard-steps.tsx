'use client';

import {
  Package,
  XCircle,
  Receipt,
  AlertTriangle,
  Truck,
  Shield,
  Check,
  Mail,
  FileText,
  Camera,
  MessageSquare,
  Paperclip,
  ArrowLeftCircle,
  Wrench,
  CheckCircle,
  AlertOctagon,
  Edit,
  XSquare,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import type {
  DocumentoDisponible,
  Pretension,
  Step1Data,
  Step2Data,
  Step3Data,
  Step4Data,
  Step5Data,
  Step6Data,
  TipoReclamacion,
  WizardData,
} from '@/lib/types';
import {
  condicionLabels,
  documentoLabels,
  pretensionLabels,
  sectorLabels,
  tipoLabels,
} from '@/lib/labels';

const TIPOS: { value: TipoReclamacion; icon: typeof Package; title: string; desc: string }[] = [
  { value: 'producto_defectuoso', icon: Package, title: 'Producto defectuoso', desc: 'El producto que compré no funciona, está dañado o no es como me lo describieron' },
  { value: 'servicio_no_prestado', icon: XCircle, title: 'Servicio no prestado', desc: 'Contraté un servicio que no se ha realizado o se realizó de forma incompleta' },
  { value: 'facturacion_incorrecta', icon: Receipt, title: 'Facturación incorrecta', desc: 'Me han cobrado una cantidad diferente a la acordada o me han facturado algo que no corresponde' },
  { value: 'publicidad_enganosa', icon: AlertTriangle, title: 'Publicidad engañosa', desc: 'Lo que me ofrecieron no se corresponde con lo que me han entregado o prestado' },
  { value: 'entrega_no_realizada', icon: Truck, title: 'Entrega no realizada', desc: 'Realicé un pedido que no ha llegado o llegó con un retraso importante no comunicado' },
  { value: 'garantia_no_aplicada', icon: Shield, title: 'Garantía no atendida', desc: 'He solicitado la garantía de un producto y no me la han aplicado' },
];

const DOCS: { value: DocumentoDisponible; icon: typeof Receipt; label: string; desc: string }[] = [
  { value: 'factura_ticket', icon: Receipt, label: documentoLabels.factura_ticket, desc: 'Documento que acredita la compra o contratación' },
  { value: 'contrato_presupuesto', icon: FileText, label: documentoLabels.contrato_presupuesto, desc: 'Documento firmado o aceptado con las condiciones' },
  { value: 'emails_chats', icon: Mail, label: documentoLabels.emails_chats, desc: 'Comunicaciones escritas con la empresa' },
  { value: 'fotografias', icon: Camera, label: documentoLabels.fotografias, desc: 'Imágenes que muestran el problema' },
  { value: 'respuesta_empresa', icon: MessageSquare, label: documentoLabels.respuesta_empresa, desc: 'Comunicación donde la empresa responde tu reclamación' },
  { value: 'otros', icon: Paperclip, label: documentoLabels.otros, desc: 'Cualquier otro documento relevante' },
];

const PRETENSIONES: { value: Pretension; icon: typeof ArrowLeftCircle; label: string }[] = [
  { value: 'reembolso_dinero', icon: ArrowLeftCircle, label: 'Que me devuelvan el dinero' },
  { value: 'reparacion_sustitucion', icon: Wrench, label: 'Que reparen o sustituyan el producto' },
  { value: 'prestacion_correcta', icon: CheckCircle, label: 'Que presten correctamente el servicio contratado' },
  { value: 'compensacion_danios', icon: AlertOctagon, label: 'Compensación por los perjuicios sufridos' },
  { value: 'rectificacion_factura', icon: Edit, label: 'Corrección de la factura' },
  { value: 'anulacion_contrato', icon: XSquare, label: 'Anulación del contrato' },
];

export function Step1Tipo({
  data,
  onChange,
}: {
  data: Step1Data | null;
  onChange: (d: Step1Data) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-2xl font-medium">¿Cuál es el motivo de tu reclamación?</h2>
      <p className="mt-2 text-text-secondary">Selecciona la opción que mejor describe tu situación.</p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {TIPOS.map((t) => {
          const selected = data?.tipo === t.value;
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => onChange({ tipo: t.value })}
              className={cn(
                'relative rounded-2xl border p-4 text-left transition-all',
                selected ? 'border-text-primary bg-text-primary/5' : 'border-border bg-bg-surface hover:border-border-focus',
              )}
            >
              {selected && <Check className="absolute right-3 top-3 h-5 w-5 text-text-primary" />}
              <t.icon className="mb-3 h-6 w-6 text-accent-green" />
              <p className="font-medium">{t.title}</p>
              <p className="mt-1 text-sm text-text-secondary">{t.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Step2Empresa({
  data,
  onChange,
}: {
  data: Step2Data | null;
  onChange: (d: Step2Data) => void;
}) {
  const d = data ?? {
    nombreEmpresa: '',
    sector: 'otro' as const,
    haContactadoEmpresa: false,
  };

  const set = (patch: Partial<Step2Data>) => onChange({ ...d, ...patch });

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl font-medium">Datos de la empresa que quieres reclamar</h2>
      <p className="text-text-secondary">Proporciona la información que tengas disponible.</p>
      <div>
        <Label>Nombre de la empresa *</Label>
        <input className="input-field mt-1" placeholder="Ej: Movistar, El Corte Inglés..." value={d.nombreEmpresa} onChange={(e) => set({ nombreEmpresa: e.target.value })} />
      </div>
      <div>
        <Label>Sector *</Label>
        <select className="input-field mt-1" value={d.sector} onChange={(e) => set({ sector: e.target.value as Step2Data['sector'] })}>
          {Object.entries(sectorLabels).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>
      <div>
        <Label>CIF/NIF de la empresa (opcional)</Label>
        <input className="input-field mt-1" placeholder="Ej: A12345678" value={d.cifNif ?? ''} onChange={(e) => set({ cifNif: e.target.value })} />
      </div>
      <div>
        <Label>Dirección de la empresa (opcional)</Label>
        <input className="input-field mt-1" placeholder="Ej: Calle Gran Vía 28, Madrid" value={d.direccionEmpresa ?? ''} onChange={(e) => set({ direccionEmpresa: e.target.value })} />
      </div>
      <hr className="border-border" />
      <p className="font-medium">¿Ya has intentado resolverlo con la empresa?</p>
      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input type="radio" checked={d.haContactadoEmpresa} onChange={() => set({ haContactadoEmpresa: true })} />
          Sí, contacté con ellos
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" checked={!d.haContactadoEmpresa} onChange={() => set({ haContactadoEmpresa: false })} />
          No, es mi primer paso
        </label>
      </div>
      {d.haContactadoEmpresa && (
        <div className="space-y-4 rounded-xl border border-border bg-bg-elevated p-4">
          <div>
            <Label>Fecha del contacto</Label>
            <input type="date" className="input-field mt-1" value={d.fechaContacto ?? ''} onChange={(e) => set({ fechaContacto: e.target.value })} />
          </div>
          <div>
            <Label>¿Qué te respondieron?</Label>
            <textarea className="input-field mt-1 min-h-[80px]" placeholder="Describe con tus propias palabras..." value={d.respuestaEmpresa ?? ''} onChange={(e) => set({ respuestaEmpresa: e.target.value })} />
          </div>
        </div>
      )}
    </div>
  );
}

export function Step3Datos({ data, onChange }: { data: Step3Data | null; onChange: (d: Step3Data) => void }) {
  const d = data ?? {
    nombreCompleto: '',
    dniNie: '',
    direccion: '',
    codigoPostal: '',
    ciudad: '',
    email: '',
    condicion: 'consumidor_particular' as const,
  };
  const set = (patch: Partial<Step3Data>) => onChange({ ...d, ...patch });

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl font-medium">Tus datos personales</h2>
      <p className="text-text-secondary">Estos datos aparecerán en tu hoja de reclamación.</p>
      <div className="info-box">
        Tus datos solo se usan para generar el documento en tu navegador. No guardamos tu información
        personal en ningún servidor salvo para la generación del borrador.
      </div>
      {(['nombreCompleto', 'dniNie', 'direccion', 'codigoPostal', 'ciudad', 'email'] as const).map((field) => (
        <div key={field}>
          <Label>{field === 'nombreCompleto' ? 'Nombre completo' : field === 'dniNie' ? 'DNI o NIE' : field === 'codigoPostal' ? 'Código postal' : field.charAt(0).toUpperCase() + field.slice(1)} *</Label>
          <input
            className="input-field mt-1"
            type={field === 'email' ? 'email' : field === 'codigoPostal' ? 'text' : 'text'}
            value={d[field]}
            onChange={(e) => set({ [field]: e.target.value })}
          />
        </div>
      ))}
      <div>
        <Label>Teléfono (opcional)</Label>
        <input type="tel" className="input-field mt-1" value={d.telefono ?? ''} onChange={(e) => set({ telefono: e.target.value })} />
      </div>
      <div>
        <Label>¿En qué condición reclamas? *</Label>
        <div className="mt-2 space-y-2">
          {(Object.keys(condicionLabels) as (keyof typeof condicionLabels)[]).map((k) => (
            <label key={k} className="flex items-center gap-2">
              <input type="radio" checked={d.condicion === k} onChange={() => set({ condicion: k })} />
              {condicionLabels[k]}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Step4Hechos({ data, onChange }: { data: Step4Data | null; onChange: (d: Step4Data) => void }) {
  const d = data ?? {
    fechaCompraContrato: '',
    importeEuros: 0,
    descripcionLoQueSeAcordo: '',
    descripcionLoQueOcurrio: '',
    fechaProblema: '',
    intentosResolucion: '',
  };
  const set = (patch: Partial<Step4Data>) => onChange({ ...d, ...patch });
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl font-medium">Cuéntanos qué pasó</h2>
      <p className="text-text-secondary">Describe los hechos con tus propias palabras. Sé específico con fechas e importes.</p>
      <div className="info-box">Escribe tal y como lo recuerdas. No necesitas usar términos legales.</div>
      <div>
        <Label>Fecha de compra o contratación *</Label>
        <input type="date" max={today} className="input-field mt-1" value={d.fechaCompraContrato} onChange={(e) => set({ fechaCompraContrato: e.target.value })} />
      </div>
      <div>
        <Label>Importe en euros *</Label>
        <div className="relative mt-1">
          <span className="absolute left-3 top-2.5 text-text-secondary">€</span>
          <input type="number" min={0} step={0.01} className="input-field pl-8" value={d.importeEuros || ''} onChange={(e) => set({ importeEuros: parseFloat(e.target.value) || 0 })} />
        </div>
      </div>
      <div>
        <Label>Qué se acordó o prometió *</Label>
        <textarea className="input-field mt-1 min-h-[100px]" value={d.descripcionLoQueSeAcordo} onChange={(e) => set({ descripcionLoQueSeAcordo: e.target.value })} />
      </div>
      <div>
        <Label>Qué ocurrió en realidad *</Label>
        <textarea className="input-field mt-1 min-h-[100px]" value={d.descripcionLoQueOcurrio} onChange={(e) => set({ descripcionLoQueOcurrio: e.target.value })} />
      </div>
      <div>
        <Label>Fecha en que ocurrió el problema *</Label>
        <input type="date" max={today} className="input-field mt-1" value={d.fechaProblema} onChange={(e) => set({ fechaProblema: e.target.value })} />
      </div>
      <div>
        <Label>¿Qué hiciste para intentar resolverlo? *</Label>
        <textarea className="input-field mt-1 min-h-[80px]" value={d.intentosResolucion} onChange={(e) => set({ intentosResolucion: e.target.value })} />
      </div>
    </div>
  );
}

export function Step5Docs({ data, onChange }: { data: Step5Data | null; onChange: (d: Step5Data) => void }) {
  const docs = data?.documentosDisponibles ?? [];
  const toggle = (v: DocumentoDisponible) => {
    const next = docs.includes(v) ? docs.filter((x) => x !== v) : [...docs, v];
    onChange({ documentosDisponibles: next, notasDocumentacion: data?.notasDocumentacion });
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-medium">¿Qué documentación tienes?</h2>
      <p className="mt-2 text-text-secondary">Marca los documentos que tienes disponibles.</p>
      <div className="mt-6 space-y-2">
        {DOCS.map((doc) => (
          <button
            key={doc.value}
            type="button"
            onClick={() => toggle(doc.value)}
            className={cn(
              'flex w-full items-start gap-3 rounded-xl border p-4 text-left',
              docs.includes(doc.value) ? 'border-text-primary bg-text-primary/5' : 'border-border bg-bg-surface',
            )}
          >
            <doc.icon className="mt-0.5 h-5 w-5 shrink-0 text-accent-green" />
            <div>
              <p className="font-medium">{doc.label}</p>
              <p className="text-sm text-text-secondary">{doc.desc}</p>
            </div>
          </button>
        ))}
      </div>
      <div className="mt-4">
        <Label>Notas sobre documentación (opcional)</Label>
        <textarea className="input-field mt-1" rows={2} value={data?.notasDocumentacion ?? ''} onChange={(e) => onChange({ documentosDisponibles: docs, notasDocumentacion: e.target.value })} />
      </div>
    </div>
  );
}

export function Step6Pretensiones({ data, onChange }: { data: Step6Data | null; onChange: (d: Step6Data) => void }) {
  const prets = data?.pretensiones ?? [];
  const toggle = (v: Pretension) => {
    const next = prets.includes(v) ? prets.filter((x) => x !== v) : [...prets, v];
    onChange({ pretensiones: next, notasAdicionales: data?.notasAdicionales });
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-medium">¿Qué quieres conseguir?</h2>
      <p className="mt-2 text-text-secondary">Selecciona todo lo que aplica a tu situación.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {PRETENSIONES.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => toggle(p.value)}
            className={cn(
              'flex items-center gap-3 rounded-xl border p-4 text-left',
              prets.includes(p.value) ? 'border-text-primary bg-text-primary/5' : 'border-border bg-bg-surface',
            )}
          >
            <p.icon className="h-5 w-5 text-accent-green" />
            <span className="text-sm font-medium">{p.label}</span>
          </button>
        ))}
      </div>
      <div className="mt-4">
        <Label>¿Quieres añadir algo más? (opcional)</Label>
        <textarea className="input-field mt-1" rows={3} value={data?.notasAdicionales ?? ''} onChange={(e) => onChange({ pretensiones: prets, notasAdicionales: e.target.value })} />
      </div>
    </div>
  );
}

export function Step7Revision({
  data,
  checks,
  onChecks,
  onEdit,
}: {
  data: WizardData;
  checks: boolean[];
  onChecks: (i: number, v: boolean) => void;
  onEdit: (step: number) => void;
}) {
  const truncate = (s: string, n = 100) => (s.length > n ? `${s.slice(0, n)}...` : s);
  const items = [
    { step: 1, title: 'Tipo de reclamación', body: data.step1 ? tipoLabels[data.step1.tipo] : '—' },
    { step: 2, title: 'Empresa', body: data.step2?.nombreEmpresa ?? '—' },
    { step: 3, title: 'Tus datos', body: data.step3?.nombreCompleto ?? '—' },
    { step: 4, title: 'Los hechos', body: truncate(data.step4?.descripcionLoQueOcurrio ?? '—') },
    { step: 5, title: 'Documentación', body: data.step5?.documentosDisponibles?.map((d) => documentoLabels[d]).join(', ') || '—' },
    { step: 6, title: 'Lo que solicitas', body: data.step6?.pretensiones?.map((p) => pretensionLabels[p]).join(', ') || '—' },
  ];

  const checkLabels = [
    'He revisado toda la información y es correcta y veraz.',
    'Entiendo que este documento es un borrador que debo revisar antes de presentar.',
    'Sé que Reclama no es un abogado y no me está dando asesoramiento jurídico.',
    'Soy yo quien decide si presentar esta reclamación y en qué términos.',
  ];

  return (
    <div>
      <h2 className="font-display text-2xl font-medium">Revisa tu información antes de continuar</h2>
      <p className="mt-2 text-text-secondary">Comprueba que todos los datos son correctos.</p>
      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <div key={item.step} className="card-surface flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-text-tertiary">{item.title}</p>
              <p className="mt-1">{item.body}</p>
            </div>
            <button type="button" className="text-sm text-accent-blue hover:underline" onClick={() => onEdit(item.step)}>
              Editar
            </button>
          </div>
        ))}
      </div>
      <div className="disclaimer-box mt-8 space-y-3">
        <p className="font-medium text-text-primary">Antes de continuar, confirma lo siguiente:</p>
        {checkLabels.map((label, i) => (
          <label key={label} className="flex items-start gap-3 text-sm">
            <Checkbox checked={checks[i]} onCheckedChange={(v) => onChecks(i, v === true)} className="mt-0.5" />
            {label}
          </label>
        ))}
      </div>
    </div>
  );
}
