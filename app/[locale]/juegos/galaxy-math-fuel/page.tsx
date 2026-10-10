import GalaxyMathFuel from '@/components/games/GalaxyMathFuel';
import GameInfo from '@/components/seo/GameInfo';
import { GameCrumbs } from '@/components/seo/StaticCrumbs';
import { gameMetadata } from '@/lib/seo/pages';
import { toSiteLocale } from '@/lib/seo/site';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const { locale } = await props.params;
    return gameMetadata('galaxy-math-fuel', toSiteLocale(locale));
}

export default async function GalaxyMathFuelPage(props: { params: Promise<{ locale: string }> }) {
    const { locale } = await props.params;
    return (
        <>
            <GameCrumbs locale={locale} slug="galaxy-math-fuel" />
            <GalaxyMathFuel />
            <GameInfo locale={locale} slug="galaxy-math-fuel" />
        </>
    );
}
