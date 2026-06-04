'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav
        className={cn(
          'no-print fixed left-0 right-0 top-0 z-50 transition-all duration-300',
          scrolled
            ? 'border-b border-border bg-bg-surface/95 py-3 backdrop-blur-md'
            : 'bg-transparent py-4',
        )}
        style={{ top: 'var(--banner-offset, 0px)' }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="font-display text-xl font-medium text-text-primary">
            Reclama
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link href="/#como-funciona" className="text-sm font-medium text-text-secondary hover:text-text-primary">
              Cómo funciona
            </Link>
            <Link href="/procedimientos" className="text-sm font-medium text-text-secondary hover:text-text-primary">
              Procedimientos
            </Link>
            <Link href="/guia-envio" className="text-sm font-medium text-text-secondary hover:text-text-primary">
              Guía de envío
            </Link>
            <Button asChild>
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
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] bg-bg-primary p-6 md:hidden">
          <div className="mb-8 flex items-center justify-between">
            <span className="font-display text-xl">Reclama</span>
            <button type="button" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex flex-col gap-4">
            <Link href="/#como-funciona" onClick={() => setMenuOpen(false)} className="text-lg">
              Cómo funciona
            </Link>
            <Link href="/procedimientos" onClick={() => setMenuOpen(false)} className="text-lg">
              Procedimientos
            </Link>
            <Link href="/guia-envio" onClick={() => setMenuOpen(false)} className="text-lg">
              Guía de envío
            </Link>
            <Button asChild size="lg" className="mt-4 w-full">
              <Link href="/reclamacion" onClick={() => setMenuOpen(false)}>
                Empezar reclamación
              </Link>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
