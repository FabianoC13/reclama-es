'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
const FLOW_PATHS = ['/reclamacion', '/resultado'];
const DISCLAIMER_KEY = 'reclama_disclaimer_dismissed';

function isFlowPath(pathname: string | null) {
  if (!pathname) return false;
  return FLOW_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export default function SiteHeader() {
  const pathname = usePathname();
  const inFlow = isFlowPath(pathname);
  const onHome = pathname === '/';
  const [menuOpen, setMenuOpen] = useState(false);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);

  useEffect(() => {
    setDisclaimerOpen(!localStorage.getItem(DISCLAIMER_KEY));
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const dismissDisclaimer = () => {
    localStorage.setItem(DISCLAIMER_KEY, '1');
    setDisclaimerOpen(false);
  };

  const navLink = (hash: string, label: string) => (
    <Link
      href={onHome ? hash : `/${hash}`}
      className="text-sm font-medium text-text-secondary hover:text-text-primary"
    >
      {label}
    </Link>
  );

  return (
    <header className="site-header no-print sticky top-0 z-50 flex flex-col border-b border-border bg-bg-surface shadow-sm">
      {disclaimerOpen && !inFlow && (
        <div className="flex shrink-0 items-center justify-center gap-2 border-b border-border bg-text-primary px-4 py-2 text-center text-xs text-bg-surface sm:text-sm">
          <span className="max-w-4xl">
            Reclama es asistencia administrativa, no asesoramiento jurídico. Para consejo legal,
            consulta a un abogado.
          </span>
          <button
            type="button"
            onClick={dismissDisclaimer}
            className="shrink-0 rounded p-1 hover:bg-white/10"
            aria-label="Cerrar aviso"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <nav className="w-full shrink-0 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="font-display text-xl font-medium text-text-primary">
            Reclama
          </Link>

          {inFlow ? (
            <Link
              href="/"
              className="text-sm font-medium text-text-secondary hover:text-text-primary"
            >
              Salir
            </Link>
          ) : (
            <>
              <div className="hidden items-center gap-6 md:flex">
                {navLink('#como-funciona', 'Cómo funciona')}
                {navLink('#procedimientos', 'Procedimientos')}
                {navLink('#guia-envio', 'Guía de envío')}
                {navLink('#presentar-sede', 'Sede Madrid')}
                <Button asChild size="sm">
                  <Link href="/reclamacion">Empezar reclamación</Link>
                </Button>
              </div>

              <button
                type="button"
                className="rounded-lg border border-border p-2 md:hidden"
                onClick={() => setMenuOpen(true)}
                aria-label="Abrir menú"
              >
                <Menu className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </nav>

      {menuOpen && !inFlow && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-bg-surface p-6 md:hidden">
          <div className="mb-8 flex items-center justify-between">
            <span className="font-display text-xl">Reclama</span>
            <button type="button" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex flex-col gap-4">
            <Link href={onHome ? '#como-funciona' : '/#como-funciona'} onClick={() => setMenuOpen(false)}>
              Cómo funciona
            </Link>
            <Link href={onHome ? '#procedimientos' : '/#procedimientos'} onClick={() => setMenuOpen(false)}>
              Procedimientos
            </Link>
            <Link href={onHome ? '#guia-envio' : '/#guia-envio'} onClick={() => setMenuOpen(false)}>
              Guía de envío
            </Link>
            <Link href={onHome ? '#presentar-sede' : '/#presentar-sede'} onClick={() => setMenuOpen(false)}>
              Sede Madrid
            </Link>
            <Button asChild size="lg" className="mt-4 w-full">
              <Link href="/reclamacion" onClick={() => setMenuOpen(false)}>
                Empezar reclamación
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
