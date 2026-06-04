const CASE_ID_KEY = 'reclama_case_id';

export function saveCaseId(id: string): void {
  if (typeof window !== 'undefined') sessionStorage.setItem(CASE_ID_KEY, id);
}

export function loadCaseId(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(CASE_ID_KEY);
}
