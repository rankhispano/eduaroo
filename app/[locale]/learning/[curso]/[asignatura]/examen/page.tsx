import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import ExamBuilder from '@/components/activities/ExamBuilder';
import { getAsignatura, getCurso } from '@/src/data/localizedCurriculum';
import { getPracticeSet } from '@/src/data/activityResources';

type Params = Promise<{ locale: string; curso: string; asignatura: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { locale, curso, asignatura } = await params;
    const asignaturaData = getAsignatura(curso, asignatura, locale);
    const cursoData = getCurso(curso, locale);
    const t = await getTranslations({ locale, namespace: 'KidsMap' });
    if (!asignaturaData || !cursoData) return {};
    return { title: `${t('examPageTitle')} · ${asignaturaData.nombre} | ${cursoData.nombre}` };
}

export default async function Page({ params }: { params: Params }) {
    const { locale, curso, asignatura } = await params;
    const cursoData = getCurso(curso, locale);
    const asignaturaData = getAsignatura(curso, asignatura, locale);
    if (!cursoData || !asignaturaData) notFound();

    const temas = asignaturaData.temas.flatMap((tema) => {
        const set = getPracticeSet(curso, asignatura, tema.id, locale);
        return set ? [{ id: tema.id, nombre: tema.nombre, key: set.key, count: set.activityCount }] : [];
    });

    return (
        <ExamBuilder
            key={`${locale}/${curso}/${asignatura}`}
            cursoId={curso}
            cursoNombre={cursoData.nombre}
            asignaturaId={asignatura}
            asignaturaNombre={asignaturaData.nombre}
            color={asignaturaData.color}
            temas={temas}
        />
    );
}
