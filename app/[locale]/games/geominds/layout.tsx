import { gameMetadata } from '@/lib/seo/pages';
import { toSiteLocale } from '@/lib/seo/site';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    return gameMetadata('geominds', toSiteLocale(locale));
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
