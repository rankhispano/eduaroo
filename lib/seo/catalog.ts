// Vista del currículo con los bloques de actividades publicados. Fuente de datos de hubs,
// plantillas de metadata, enlaces relacionados y JSON-LD.
import { ACTIVITY_SETS } from '@/content/activities/registry';
import type { ActivitySetSummary } from '@/lib/curriculum/types';
import { curriculum } from '@/src/data/curriculum';
import type { Asignatura, Curso, Tema } from '@/src/types';

export interface CatalogTema {
    tema: Tema;
    set?: ActivitySetSummary;
}

export type PublishedTema = CatalogTema & { set: ActivitySetSummary };

export interface CatalogAsignatura {
    asignatura: Asignatura;
    temas: CatalogTema[];
    /** Temas con actividades publicadas */
    published: PublishedTema[];
    activityCount: number;
}

export interface CatalogCurso {
    curso: Curso;
    grade: number;
    asignaturas: CatalogAsignatura[];
    publishedCount: number;
    activityCount: number;
}

const setsByKey = new Map(ACTIVITY_SETS.map((set) => [set.key, set]));

export const getSet = (curso: string, asignatura: string, tema: string) => setsByKey.get(`${curso}/${asignatura}/${tema}`);

export const catalog: CatalogCurso[] = curriculum.map((curso) => {
    const asignaturas = curso.asignaturas.map((asignatura): CatalogAsignatura => {
        const temas = asignatura.temas.map((tema) => ({ tema, set: getSet(curso.id, asignatura.id, tema.id) }));
        const published = temas.filter((t): t is PublishedTema => t.set !== undefined);
        return { asignatura, temas, published, activityCount: published.reduce((sum, t) => sum + t.set.activityCount, 0) };
    });
    return {
        curso,
        grade: Number(curso.id),
        asignaturas,
        publishedCount: asignaturas.reduce((sum, a) => sum + a.published.length, 0),
        activityCount: asignaturas.reduce((sum, a) => sum + a.activityCount, 0),
    };
});

export const getCatalogCurso = (cursoId: string) => catalog.find((c) => c.curso.id === cursoId);

export const getCatalogAsignatura = (cursoId: string, asignaturaId: string) =>
    getCatalogCurso(cursoId)?.asignaturas.find((a) => a.asignatura.id === asignaturaId);
