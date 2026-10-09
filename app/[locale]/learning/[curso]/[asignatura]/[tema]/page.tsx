import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ActivityPlayer from '@/components/activities/ActivityPlayer';
import { ACTIVITY_LOADERS, ACTIVITY_SETS } from '@/content/activities/registry';
import { getCriterion } from '@/lib/curriculum/lomloe';
import { temaParams } from '@/lib/seo/params';
import { getAsignatura, getCurso } from '@/src/data/curriculum';

type Params = Promise<{ locale: string; curso: string; asignatura: string; tema: string }>;

export const dynamicParams = false;
export const generateStaticParams = temaParams;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { curso, asignatura, tema } = await params;
    const summary = ACTIVITY_SETS.find((s) => s.key === `${curso}/${asignatura}/${tema}`);
    const cursoData = getCurso(curso);
    const asignaturaData = getAsignatura(curso, asignatura);
    if (!summary || !cursoData || !asignaturaData) return {};

    return {
        title: `${summary.title} | ${asignaturaData.nombre} ${cursoData.nombre}`,
        description: summary.summary,
    };
}

export default async function Page({ params }: { params: Params }) {
    const { locale, curso, asignatura, tema } = await params;
    setRequestLocale(locale);
    const loader = ACTIVITY_LOADERS[`${curso}/${asignatura}/${tema}`];
    const cursoData = getCurso(curso);
    const asignaturaData = getAsignatura(curso, asignatura);

    if (!loader || !cursoData || !asignaturaData) {
        notFound();
    }

    const set = await loader();
    const criteria = set.lomloe.criteria.map((id) => ({
        id,
        text: getCriterion(set.lomloe.area, set.lomloe.cycle, id)?.text ?? '',
    }));

    return (
        <ActivityPlayer
            set={set}
            color={asignaturaData.color}
            subjectName={asignaturaData.nombre}
            cursoNombre={cursoData.nombre}
            backHref={`/learning/${curso}/${asignatura}`}
            criteria={criteria}
            extras={asignaturaData.temas.find((x) => x.id === tema)?.recursos ?? []}
        />
    );
}
