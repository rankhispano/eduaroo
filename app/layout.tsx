import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-lexend',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Repasa Primaria',
    default: 'Repasa Primaria',
  },
  description: 'Recursos de repaso para Educación Primaria en España según la LOMLOE.',
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
