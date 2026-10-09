import { staticPageMetadata } from '@/lib/seo/pages';
import { toSiteLocale } from '@/lib/seo/site';
import { useTranslations } from 'next-intl';
import TeacherDashboard from '@/components/TeacherDashboard';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const { locale } = await props.params;
    return staticPageMetadata('teachers', toSiteLocale(locale));
}

export default function TeachersPage() {
    return <TeacherDashboard />;
}
