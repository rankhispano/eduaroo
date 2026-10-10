// Parámetros de generateStaticParams para el árbol /primaria: solo existen las combinaciones reales,
// el resto responde 404 (dynamicParams = false) sin renderizar. Los parámetros son los slugs públicos.
import { getActivitySets } from '@/content/activities/registry';
import { curriculum } from '@/src/data/curriculum';
import { locales } from './site';
import { asignaturaSlug, cursoSlug } from './slugs';

export const cursoParams = () => locales.flatMap((locale) => curriculum.map((curso) => ({ locale, curso: cursoSlug(curso.id) })));

export const asignaturaParams = () =>
    locales.flatMap((locale) =>
        curriculum.flatMap((curso) =>
            curso.asignaturas.map((asignatura) => ({ locale, curso: cursoSlug(curso.id), asignatura: asignaturaSlug(asignatura.id) })),
        ),
    );

export const temaParams = () =>
    locales.flatMap((locale) =>
        getActivitySets(locale).map((set) => ({
            locale,
            curso: cursoSlug(set.cursoId),
            asignatura: asignaturaSlug(set.asignaturaId),
            tema: set.temaId,
        })),
    );
