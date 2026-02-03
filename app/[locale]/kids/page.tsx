import { getTranslations } from 'next-intl/server';
import StudentDashboard from '@/components/StudentDashboard';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'Dashboard' });

    return {
        title: 'Mi Progreso',
        description: 'Tu panel de progreso y logros en Eduaroo'
    };
}

export default function DashboardPage() {
    return <StudentDashboard />;
}
