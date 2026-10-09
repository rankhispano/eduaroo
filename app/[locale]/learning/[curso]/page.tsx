import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import CursoAsignaturasPage from '@/app/(repasa)/_views/CursoAsignaturasPage';
import { cursoParams } from '@/lib/seo/params';
import { ogImage } from '@/lib/seo/og-image';
import { getCatalogCurso } from '@/lib/seo/catalog';
import { buildMetadata } from '@/lib/seo/metadata';
import { toSiteLocale } from '@/lib/seo/site';
import { templates } from '@/lib/seo/templates';
import { paths } from '@/lib/seo/urls';

export const dynamicParams = false;
export const generateStaticParams = cursoParams;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string; curso: string }>;
}): Promise<Metadata> {
    const { locale, curso } = await params;
    const data = getCatalogCurso(curso);
    if (!data) return {};
    const l = toSiteLocale(locale);
    return buildMetadata({ locale: l, ...templates[l].curso(data), path: paths.curso(curso), image: ogImage.curso(l, curso) });
}

export default async function Page({
    params,
}: {
    params: Promise<{ locale: string; curso: string }>;
}) {
    const { locale, curso } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'LearningPage' });

    return (
        <CursoAsignaturasPage
            cursoId={curso}
            basePath={`/${locale}/learning`}
            homeHref={`/${locale}`}
            sectionLabel={t('title')}
            showLocalBreadcrumb={false}
            selectedLabel={t('selectedCourse')}
            chooseSubjectLabel={t('chooseSubject')}
            description={t('chooseSubjectDescription')}
        />
    );
}
