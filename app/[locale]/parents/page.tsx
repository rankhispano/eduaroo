import { useTranslations } from 'next-intl';
import ParentDashboard from '@/components/ParentDashboard';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    // We can reuse messages or specific metadata for this page
    return {
        title: 'Eduaroo | Parents',
    };
}

export default function ParentsPage() {
    return <ParentDashboard />;
}
