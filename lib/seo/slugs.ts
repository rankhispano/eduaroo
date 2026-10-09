// Slugs públicos de la jerarquía /primaria/{n}-primaria/{asignatura}/{tema}.
// Módulo sin dependencias: lo importa también next.config.ts para generar los redirects.

export const CURSO_IDS = ['1', '2', '3', '4', '5', '6'] as const;

// id interno (claves de content/activities, progreso guardado, registry) → slug público
export const ASIGNATURA_SLUGS: Record<string, string> = {
    lengua: 'lengua',
    mates: 'matematicas',
    naturales: 'ciencias-naturales',
    sociales: 'ciencias-sociales',
    ingles: 'ingles',
};

export const cursoSlug = (cursoId: string) => `${cursoId}-primaria`;

export const parseCursoSlug = (slug: string): string | undefined => {
    const match = /^([1-6])-primaria$/.exec(slug);
    return match?.[1];
};

export const asignaturaSlug = (asignaturaId: string) => ASIGNATURA_SLUGS[asignaturaId] ?? asignaturaId;

export const parseAsignaturaSlug = (slug: string): string | undefined =>
    Object.entries(ASIGNATURA_SLUGS).find(([, value]) => value === slug)?.[0];
