import type { Metadata } from 'next';
import { Inter, Lora } from 'next/font/google';
import './globals.css';
import SiteHeader from '@/components/layout/SiteHeader';
import Footer from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600'],
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Reclama — Tu asistente para reclamaciones en España',
  description:
    'Rellena tu hoja de reclamación de forma fácil y rápida. Información general y asistencia administrativa — no asesoramiento jurídico.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${lora.variable}`}>
      <body>
        <SiteHeader />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
