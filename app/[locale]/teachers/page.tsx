import { useTranslations } from 'next-intl';
import TeacherDashboard from '@/components/TeacherDashboard';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    return {
        title: 'Eduaroo | Teachers',
    };
}

export default function TeachersPage() {
    return <TeacherDashboard />;
}
