import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ActivityPlayer from '@/components/activities/ActivityPlayer';
import { getActivityLoaders, getActivitySets } from '@/content/activities/registry';
import { getCriterion } from '@/lib/curriculum/lomloe';
import { getAsignatura, getCurso } from '@/src/data/localizedCurriculum';

type Params = Promise<{ locale: string; curso: string; asignatura: string; tema: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { locale, curso, asignatura, tema } = await params;
    const summary = getActivitySets(locale).find((s) => s.key === `${curso}/${asignatura}/${tema}`);
    const cursoData = getCurso(curso, locale);
    const asignaturaData = getAsignatura(curso, asignatura, locale);
    if (!summary || !cursoData || !asignaturaData) return {};

    return {
        title: `${summary.title} | ${asignaturaData.nombre} ${cursoData.nombre}`,
        description: summary.summary,
    };
}

export default async function Page({ params }: { params: Params }) {
    const { locale, curso, asignatura, tema } = await params;
    const loader = getActivityLoaders(locale)[`${curso}/${asignatura}/${tema}`];
    const cursoData = getCurso(curso, locale);
    const asignaturaData = getAsignatura(curso, asignatura, locale);

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
            key={`${locale}/${set.id}`}
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
