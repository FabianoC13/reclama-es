import type { DocumentoGenerado, WizardData } from './types';

const STORAGE_KEY = 'reclama_wizard_data';
const DOC_KEY = 'reclama_documento';

export const initialWizardData: WizardData = {
  step1: null,
  step2: null,
  step3: null,
  step4: null,
  step5: null,
  step6: null,
  step7Confirmed: false,
};

export function saveWizardData(data: WizardData): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

export function loadWizardData(): WizardData {
  if (typeof window === 'undefined') return initialWizardData;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return initialWizardData;
  try {
    return JSON.parse(raw) as WizardData;
  } catch {
    return initialWizardData;
  }
}

export function clearWizardData(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(DOC_KEY);
  }
}

export function saveGeneratedDocument(doc: DocumentoGenerado): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(DOC_KEY, JSON.stringify(doc));
  }
}

export function loadGeneratedDocument(): DocumentoGenerado | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(DOC_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DocumentoGenerado;
  } catch {
    return null;
  }
}
