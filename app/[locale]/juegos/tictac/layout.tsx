import GameInfo from '@/components/seo/GameInfo';
import { GameCrumbs } from '@/components/seo/StaticCrumbs';
import { gameMetadata } from '@/lib/seo/pages';
import { toSiteLocale } from '@/lib/seo/site';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    return gameMetadata('tictac', toSiteLocale(locale));
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    return (
        <>
            <GameCrumbs locale={locale} slug="tictac" />
            {children}
            <GameInfo locale={locale} slug="tictac" />
        </>
    );
}
