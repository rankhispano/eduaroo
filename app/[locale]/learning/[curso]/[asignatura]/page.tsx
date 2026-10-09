import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import TemaPath from '@/components/map/TemaPath';
import { getAsignatura, getCurso } from '@/src/data/curriculum';
import { getPracticeSet, withGeneratedActivities } from '@/src/data/activityResources';
import { REGIONS } from '@/src/data/regions';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string; curso: string; asignatura: string }>;
}): Promise<Metadata> {
    const { locale, curso, asignatura } = await params;
    const t = await getTranslations({ locale, namespace: 'LearningPage' });
    const cursoData = getCurso(curso);
    const asignaturaData = getAsignatura(curso, asignatura);

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
