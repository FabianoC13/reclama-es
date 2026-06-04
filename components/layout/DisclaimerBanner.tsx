'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const STORAGE_KEY = 'reclama_disclaimer_dismissed';

export default function DisclaimerBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    setVisible(!dismissed);
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="disclaimer-banner no-print border-b border-border bg-text-primary px-4 py-2 text-center text-xs text-bg-surface sm:text-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-2">
        <span>
          Reclama es una herramienta de asistencia administrativa. No proporciona asesoramiento
          jurídico. Para consejo legal, consulta a un abogado.
        </span>
        <button
          type="button"
          onClick={dismiss}
          className="ml-2 shrink-0 rounded p-1 hover:bg-white/10"
          aria-label="Cerrar aviso"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
