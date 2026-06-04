'use client';

import { useEffect } from 'react';

export default function RedirectToHash({ hash }: { hash: string }) {
  const base = process.env.NEXT_PUBLIC_GITHUB_PAGES === 'true' ? '/reclama-es' : '';

  useEffect(() => {
    window.location.replace(`${base}/${hash}`);
  }, [hash, base]);

  return (
    <main className="py-20 text-center text-text-secondary">
      <p>Redirigiendo…</p>
    </main>
  );
}
