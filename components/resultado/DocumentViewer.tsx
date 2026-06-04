'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { DocumentoGenerado } from '@/lib/types';

type SectionKey = 'identificacionReclamante' | 'identificacionReclamado' | 'relacionHechos' | 'peticion' | 'lugarFecha';

const SECTIONS: { key: SectionKey; title: string }[] = [
  { key: 'identificacionReclamante', title: 'Identificación del Reclamante' },
  { key: 'identificacionReclamado', title: 'Identificación del Reclamado' },
  { key: 'relacionHechos', title: 'Relación de Hechos' },
  { key: 'peticion', title: 'Petición' },
  { key: 'lugarFecha', title: 'Lugar y Fecha' },
];

function sectionText(doc: DocumentoGenerado, key: SectionKey): string {
  if (key === 'lugarFecha') return `${doc.lugar}\n${doc.fecha}`;
  return doc[key];
}

type Props = {
  documento: DocumentoGenerado;
  onChange: (doc: DocumentoGenerado) => void;
};

export default function DocumentViewer({ documento, onChange }: Props) {
  const [editing, setEditing] = useState<SectionKey | null>(null);
  const [draft, setDraft] = useState('');

  const startEdit = (key: SectionKey) => {
    setEditing(key);
    setDraft(sectionText(documento, key));
  };

  const save = () => {
    if (!editing) return;
    if (editing === 'lugarFecha') {
      const [lugar = '', fecha = ''] = draft.split('\n');
      onChange({ ...documento, lugar: lugar.trim(), fecha: fecha.trim() });
    } else {
      onChange({ ...documento, [editing]: draft });
    }
    setEditing(null);
  };

  return (
    <div className="print-document space-y-8">
      {SECTIONS.map(({ key, title }) => (
        <section key={key} className="border-b border-border pb-6 last:border-0">
          <h3 className="mb-3 font-display text-lg font-medium">{title}</h3>
          <div className="mb-3 flex items-center justify-end gap-4 no-print">
            {editing !== key ? (
              <Button variant="ghost" size="sm" onClick={() => startEdit(key)}>
                Editar sección
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button size="sm" onClick={save}>
                  Guardar
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setEditing(null)}>
                  Cancelar
                </Button>
              </div>
            )}
          </div>
          {editing === key ? (
            <textarea
              className="input-field min-h-[120px] font-display"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
          ) : (
            <div className="whitespace-pre-wrap font-display text-base leading-relaxed">
              {sectionText(documento, key)}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
