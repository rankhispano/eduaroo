import { staticPageMetadata } from '@/lib/seo/pages';
import { toSiteLocale } from '@/lib/seo/site';
import { getTranslations } from 'next-intl/server';
import StudentDashboard from '@/components/StudentDashboard';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const { locale } = await props.params;
    return staticPageMetadata('kids', toSiteLocale(locale));
}

export default function DashboardPage() {
    return <StudentDashboard />;
}
