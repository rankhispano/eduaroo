import { curriculum } from './curriculum';
import { getActivitySets } from '@/content/activities/registry';
import type { AsignaturaId, Curso } from '@/src/types';

const SUBJECTS_EN: Record<AsignaturaId, string> = {
    lengua: 'Spanish Language', mates: 'Mathematics', naturales: 'Natural Sciences',
    sociales: 'Social Sciences', ingles: 'English',
};

// Translate labels, keeping Spanish primary grades, curriculum and topic ids.
export function getCurriculum(locale = 'es'): Curso[] {
    if (locale !== 'en') return curriculum;
    const topics = new Map(getActivitySets('en').map(set => [set.key, set.temaNombre]));
    return curriculum.map(curso => ({
        ...curso,
        nombre: `Primary ${curso.id}`,
        asignaturas: curso.asignaturas.map(asignatura => ({
            ...asignatura,
            nombre: SUBJECTS_EN[asignatura.id],
            temas: asignatura.temas.map(tema => ({
                ...tema,
                nombre: topics.get(`${curso.id}/${asignatura.id}/${tema.id}`) ?? tema.nombre,
            })),
        })),
    }));
}

export function getCurso(cursoId: string, locale = 'es') {
    return getCurriculum(locale).find(curso => curso.id === cursoId);
}

export function getAsignatura(cursoId: string, asignaturaId: string, locale = 'es') {
    return getCurso(cursoId, locale)?.asignaturas.find(asignatura => asignatura.id === asignaturaId);
}
