import type { Metadata } from 'next';
import ReviewSession from '@/components/activities/ReviewSession';

// Sesión personal (depende del progreso guardado en el navegador): no se indexa
export const metadata: Metadata = { title: 'Repaso de hoy', robots: { index: false, follow: true } };

export default function Page() {
    return <ReviewSession />;
}
