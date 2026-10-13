import { notFound, redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { resourceGuides, getResourceGuide } from '@/lib/resources/catalog';
import { buildMetadata } from '@/lib/seo/metadata';
import { toSiteLocale } from '@/lib/seo/site';
import { paths } from '@/lib/seo/urls';
import ResourcePage from '@/components/resources/ResourcePage';
export const dynamicParams = false;
export function generateStaticParams() {
    return resourceGuides.map((guide) => ({ resource: guide.slug }));
}
export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string; resource: string }>;
}) {
    const { locale, resource } = await params;
    const guide = getResourceGuide(resource);
    if (!guide) return {};
    return buildMetadata({
        locale: toSiteLocale(locale),
        title: guide.title,
        description: guide.description,
        path: paths.resource(guide.slug),
    });
}
export default async function Page({
    params,
}: {
    params: Promise<{ locale: string; resource: string }>;
}) {
    const { locale, resource } = await params;
    const guide = getResourceGuide(resource);
    if (!guide) notFound();
    if (locale !== 'es') redirect(paths.resource(resource));
    setRequestLocale(locale);
    return <ResourcePage guide={guide} />;
}
