import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import HomeMap from '@/components/home/HomeMap';
import { buildMetadata } from '@/lib/seo/metadata';
import { toSiteLocale } from '@/lib/seo/site';
import { templates } from '@/lib/seo/templates';
import { paths } from '@/lib/seo/urls';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await props.params;
    const l = toSiteLocale(locale);
    return buildMetadata({ locale: l, ...templates[l].home(), path: paths.home() });
}

export default async function HomePage(props: { params: Promise<{ locale: string }> }) {
    const { locale } = await props.params;
    setRequestLocale(locale);
    return <HomeMap />;
}
