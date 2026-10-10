import { staticPageMetadata } from '@/lib/seo/pages';
import { toSiteLocale } from '@/lib/seo/site';
import { useTranslations } from 'next-intl';
import ParentDashboard from '@/components/ParentDashboard';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const { locale } = await props.params;
    return staticPageMetadata('parents', toSiteLocale(locale));
}

export default function ParentsPage() {
    return <ParentDashboard />;
}
