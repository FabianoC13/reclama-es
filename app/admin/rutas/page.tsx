'use client';

import { useState } from 'react';

type Route = {
  id: string;
  routeName: string;
  routeSlug: string;
  verificationStatus: string;
  lastVerifiedAt: string | null;
  requiresElectronicId: boolean;
  authority: { municipality: string | null; shortName: string };
};

export default function AdminRutasPage() {
  const [secret, setSecret] = useState('');
  const [routes, setRoutes] = useState<Route[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setError(null);
    const res = await fetch('/api/admin/official-routes', {
      headers: { 'x-admin-secret': secret },
    });
    if (!res.ok) {
      setError('No autorizado o ADMIN_SECRET no configurado');
      return;
    }
    const data = await res.json();
    setRoutes(data.routes);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="font-display text-3xl">Registro de rutas oficiales</h1>
      <p className="mt-2 text-sm text-text-secondary">Uso interno. No exponer notas internas al usuario.</p>
      <div className="mt-6 flex gap-2">
        <input
          type="password"
          className="input-field max-w-xs"
          placeholder="ADMIN_SECRET"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
        />
        <button type="button" className="btn-primary rounded-lg px-4 py-2 text-sm" onClick={load}>
          Cargar rutas
        </button>
      </div>
      {error && <p className="mt-4 text-sm text-danger">{error}</p>}
      <table className="mt-8 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="py-2">Municipio</th>
            <th className="py-2">Autoridad</th>
            <th className="py-2">Ruta</th>
            <th className="py-2">Estado</th>
            <th className="py-2">Verificado</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((r) => (
            <tr key={r.id} className="border-b border-border/50">
              <td className="py-2">{r.authority.municipality ?? '—'}</td>
              <td className="py-2">{r.authority.shortName}</td>
              <td className="py-2">{r.routeName}</td>
              <td className="py-2">
                <span
                  className={
                    r.verificationStatus === 'verified'
                      ? 'text-accent-green'
                      : 'text-warning'
                  }
                >
                  {r.verificationStatus}
                </span>
              </td>
              <td className="py-2">
                {r.lastVerifiedAt ? new Date(r.lastVerifiedAt).toLocaleDateString('es-ES') : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
