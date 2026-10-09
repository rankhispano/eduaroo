import { gameMetadata } from '@/lib/seo/pages';
import { toSiteLocale } from '@/lib/seo/site';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    return gameMetadata('syllable-quest', toSiteLocale(locale));
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
