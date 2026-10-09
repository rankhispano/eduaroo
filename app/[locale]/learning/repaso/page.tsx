import type { Metadata } from 'next';
import ReviewSession from '@/components/activities/ReviewSession';

export const metadata: Metadata = { title: 'Repaso de hoy' };

export default function Page() {
    return <ReviewSession />;
}
