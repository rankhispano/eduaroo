// Parámetros de generateStaticParams para el árbol /learning: solo existen las combinaciones reales,
// el resto responde 404 (dynamicParams = false) sin renderizar.
import { ACTIVITY_SETS } from '@/content/activities/registry';
import { curriculum } from '@/src/data/curriculum';
import { locales } from './site';

export const cursoParams = () => locales.flatMap((locale) => curriculum.map((curso) => ({ locale, curso: curso.id })));

export const asignaturaParams = () =>
    locales.flatMap((locale) =>
        curriculum.flatMap((curso) => curso.asignaturas.map((asignatura) => ({ locale, curso: curso.id, asignatura: asignatura.id }))),
    );

export const temaParams = () =>
    locales.flatMap((locale) =>
        ACTIVITY_SETS.map((set) => ({ locale, curso: set.cursoId, asignatura: set.asignaturaId, tema: set.temaId })),
    );
