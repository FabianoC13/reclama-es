import type { Metadata } from 'next';
import { Inter, Lora } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DisclaimerBanner from '@/components/layout/DisclaimerBanner';

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
        <header className="site-header no-print sticky top-0 z-50">
          <DisclaimerBanner />
          <Navbar />
        </header>
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
