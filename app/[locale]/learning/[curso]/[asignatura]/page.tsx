import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import TemaPath from '@/components/map/TemaPath';
import { getAsignatura, getCurso } from '@/src/data/localizedCurriculum';
import { getPracticeSet, withGeneratedActivities } from '@/src/data/activityResources';
import { getRegions } from '@/src/data/regions';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string; curso: string; asignatura: string }>;
}): Promise<Metadata> {
    const { locale, curso, asignatura } = await params;
    const t = await getTranslations({ locale, namespace: 'LearningPage' });
    const cursoData = getCurso(curso, locale);
    const asignaturaData = getAsignatura(curso, asignatura, locale);

    return {
        title:
            cursoData && asignaturaData
                ? `${asignaturaData.nombre} | ${cursoData.nombre}`
                : t('subjectNotFound'),
        description:
            cursoData && asignaturaData
                ? t('subjectSeo', { subject: asignaturaData.nombre, course: cursoData.nombre })
                : undefined,
    };
}

export default async function Page({
    params,
}: {
    params: Promise<{ locale: string; curso: string; asignatura: string }>;
}) {
    const { locale, curso, asignatura } = await params;
    const cursoData = getCurso(curso, locale);
    const asignaturaData = getAsignatura(curso, asignatura, locale);

    if (!cursoData || !asignaturaData) {
        notFound();
    }

    const temas = withGeneratedActivities(curso, asignatura, asignaturaData.temas, `/${locale}/learning`, locale);
    const region = getRegions(locale)[asignaturaData.id];

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
            practiceTemaIds={asignaturaData.temas.filter((x) => getPracticeSet(curso, asignatura, x.id, locale)).map((x) => x.id)}
        />
    );
}
