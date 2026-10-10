import type { Metadata } from 'next';

// Ejercicios heredados: herramientas interactivas con poco texto. Se enlazan desde cada tema,
// pero no se indexan hasta que tengan contenido propio.
export const metadata: Metadata = { robots: { index: false, follow: true } };

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
