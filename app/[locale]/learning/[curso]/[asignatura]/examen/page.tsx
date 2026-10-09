import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ExamBuilder from '@/components/activities/ExamBuilder';
import { getAsignatura, getCurso } from '@/src/data/curriculum';
import { getPracticeSet } from '@/src/data/activityResources';

type Params = Promise<{ locale: string; curso: string; asignatura: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { curso, asignatura } = await params;
    const asignaturaData = getAsignatura(curso, asignatura);
    const cursoData = getCurso(curso);
    if (!asignaturaData || !cursoData) return {};
    return { title: `Prepara tu examen de ${asignaturaData.nombre} | ${cursoData.nombre}` };
}

export default async function Page({ params }: { params: Params }) {
    const { curso, asignatura } = await params;
    const cursoData = getCurso(curso);
    const asignaturaData = getAsignatura(curso, asignatura);
    if (!cursoData || !asignaturaData) notFound();

    const temas = asignaturaData.temas.flatMap((tema) => {
        const set = getPracticeSet(curso, asignatura, tema.id);
        return set ? [{ id: tema.id, nombre: tema.nombre, key: set.key, count: set.activityCount }] : [];
    });

    return (
        <ExamBuilder
            cursoId={curso}
            cursoNombre={cursoData.nombre}
            asignaturaId={asignatura}
            asignaturaNombre={asignaturaData.nombre}
            color={asignaturaData.color}
            temas={temas}
        />
    );
}
