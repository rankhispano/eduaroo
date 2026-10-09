import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import TemaPath from '@/components/map/TemaPath';
import { ogImage } from '@/lib/seo/og-image';
import { getCatalogAsignatura, getCatalogCurso } from '@/lib/seo/catalog';
import { buildMetadata } from '@/lib/seo/metadata';
import { asignaturaParams } from '@/lib/seo/params';
import { toSiteLocale } from '@/lib/seo/site';
import { templates } from '@/lib/seo/templates';
import { paths } from '@/lib/seo/urls';
import { getAsignatura, getCurso } from '@/src/data/curriculum';
import { getPracticeSet, withGeneratedActivities } from '@/src/data/activityResources';
import { REGIONS } from '@/src/data/regions';

export const dynamicParams = false;
export const generateStaticParams = asignaturaParams;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string; curso: string; asignatura: string }>;
}): Promise<Metadata> {
    const { locale, curso, asignatura } = await params;
    const c = getCatalogCurso(curso);
    const a = getCatalogAsignatura(curso, asignatura);
    if (!c || !a) return {};
    const l = toSiteLocale(locale);
    return buildMetadata({ locale: l, ...templates[l].asignatura(c, a), path: paths.asignatura(curso, asignatura), image: ogImage.asignatura(l, curso, asignatura) });
}

export default async function Page({
    params,
}: {
    params: Promise<{ locale: string; curso: string; asignatura: string }>;
}) {
    const { locale, curso, asignatura } = await params;
    setRequestLocale(locale);
    const cursoData = getCurso(curso);
    const asignaturaData = getAsignatura(curso, asignatura);

    if (!cursoData || !asignaturaData) {
        notFound();
    }

    const temas = withGeneratedActivities(curso, asignatura, asignaturaData.temas, `/${locale}/learning`);
    const region = REGIONS[asignaturaData.id];

    return (
        <TemaPath
            cursoId={curso}
            cursoNombre={cursoData.nombre}
            asignaturaId={asignatura}
            asignaturaNombre={asignaturaData.nombre}
            color={asignaturaData.color}
            region={region.region}
            mascotImage={region.image}
            temas={temas}
            practiceTemaIds={asignaturaData.temas.filter((x) => getPracticeSet(curso, asignatura, x.id)).map((x) => x.id)}
        />
    );
}
