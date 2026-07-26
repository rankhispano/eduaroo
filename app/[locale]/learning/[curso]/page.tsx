import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import CursoAsignaturasPage from '@/app/(repasa)/_views/CursoAsignaturasPage';
import { getCurso } from '@/src/data/curriculum';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string; curso: string }>;
}): Promise<Metadata> {
    const { locale, curso } = await params;
    const t = await getTranslations({ locale, namespace: 'LearningPage' });
    const cursoData = getCurso(curso);

    return {
        title: cursoData ? `${cursoData.nombre} | ${t('title')}` : t('courseNotFound'),
        description: cursoData ? t('courseSeo', { course: cursoData.nombre }) : undefined,
    };
}

export default async function Page({
    params,
}: {
    params: Promise<{ locale: string; curso: string }>;
}) {
    const { locale, curso } = await params;
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
