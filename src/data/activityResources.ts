import { getActivitySets } from '@/content/activities/registry';
import type { ActivitySetSummary } from '@/lib/curriculum/types';
import type { Recurso, Tema } from '@/src/types';

export const practiceKey = (cursoId: string, asignaturaId: string, temaId: string) =>
  `${cursoId}/${asignaturaId}/${temaId}`;

export function getPracticeSet(cursoId: string, asignaturaId: string, temaId: string, locale = 'es'): ActivitySetSummary | undefined {
  return getActivitySets(locale).find((s) => s.key === practiceKey(cursoId, asignaturaId, temaId));
}

// Añade los bloques de content/activities como primer recurso de cada tema
export function withGeneratedActivities(cursoId: string, asignaturaId: string, temas: Tema[], hrefBase: string, locale = 'es'): Tema[] {
  return temas.map((tema) => {
    const set = getPracticeSet(cursoId, asignaturaId, tema.id, locale);
    if (!set) return tema;
    const recurso: Recurso = {
      id: `practica-${set.key.replace(/\//g, '-')}`,
      titulo: set.title,
      tipo: 'ejercicio',
      url: `${hrefBase}/${set.key}`,
      descripcion: set.summary,
      duracion: `${set.estimatedMinutes} min`,
    };
    return { ...tema, recursos: [recurso, ...tema.recursos] };
  });
}

// Destino al tocar un tema: su lección (con la explicación "Recuerda" antes de empezar)
// o, si aún no tiene, su primer recurso. Sin prefijo de idioma: se usa con el Link de next-intl.
export function temaHref(cursoId: string, asignaturaId: string, tema: Tema, locale = 'es'): string | null {
  if (getPracticeSet(cursoId, asignaturaId, tema.id, locale)) return `/learning/${cursoId}/${asignaturaId}/${tema.id}`;
  const first = tema.recursos[0]?.url;
  return first ? first.replace(/^\/(es|en)(?=\/)/, '') : null;
}
