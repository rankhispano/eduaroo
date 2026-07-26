import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import AsignaturaTemasPage from '@/app/(repasa)/_views/AsignaturaTemasPage';
import { getAsignatura, getCurso } from '@/src/data/curriculum';

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
    const t = await getTranslations({ locale, namespace: 'LearningPage' });

    return (
        <AsignaturaTemasPage
            cursoId={curso}
            asignaturaId={asignatura}
            basePath={`/${locale}/learning`}
            homeHref={`/${locale}`}
            sectionLabel={t('title')}
            showLocalBreadcrumb={false}
            topicsDescription={t('topicsDescription')}
        />
    );
}
