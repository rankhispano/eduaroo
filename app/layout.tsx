import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import { defaultDescription, defaultTitle } from '@/lib/seo/metadata';
import './globals.css';

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-lexend',
  display: 'swap',
});

// Título y descripción globales: el layout [locale] los refina por idioma y cada página fija los suyos
export const metadata: Metadata = {
  title: { template: '%s | Eduaroo', default: defaultTitle },
  description: defaultDescription,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${nunito.variable} bg-slate-50 font-sans text-lg text-slate-950`}>
        {children}
      </body>
    </html>
  );
}
