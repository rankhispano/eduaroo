import { getGameSeo } from '@/lib/seo/games';
import { toSiteLocale } from '@/lib/seo/site';
import { paths } from '@/lib/seo/urls';
import BreadcrumbNav from './BreadcrumbNav';

const gamesLabel = { es: 'Juegos educativos', en: 'Educational games' } as const;

export function GamesCrumbs({ locale }: { locale: string }) {
    const l = toSiteLocale(locale);
    return <BreadcrumbNav locale={l} items={[{ name: gamesLabel[l] }]} />;
}

export function GameCrumbs({ locale, slug }: { locale: string; slug: string }) {
    const l = toSiteLocale(locale);
    // "Astro Type: juego de mecanografía…" → "Astro Type"
    const name = getGameSeo(slug, l)?.title.split(':')[0] ?? slug;
    return <BreadcrumbNav locale={l} items={[{ name: gamesLabel[l], path: paths.games() }, { name }]} />;
}

export function LegalCrumbs({ locale, name }: { locale: string; name: string }) {
    return <BreadcrumbNav locale={toSiteLocale(locale)} items={[{ name }]} />;
}
