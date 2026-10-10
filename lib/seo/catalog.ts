// Vista del currículo con los bloques de actividades publicados. Fuente de datos de hubs,
// plantillas de metadata, enlaces relacionados y JSON-LD.
import { getActivitySets } from '@/content/activities/registry';
import type { ActivitySetSummary } from '@/lib/curriculum/types';
import { getCurriculum } from '@/src/data/localizedCurriculum';
import type { Asignatura, Curso, Tema } from '@/src/types';
import type { SiteLocale } from './site';

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

function buildCatalog(locale: SiteLocale): CatalogCurso[] {
    const setsByKey = new Map(getActivitySets(locale).map((set) => [set.key, set]));
    return getCurriculum(locale).map((curso) => {
        const asignaturas = curso.asignaturas.map((asignatura): CatalogAsignatura => {
            const temas = asignatura.temas.map((tema) => ({ tema, set: setsByKey.get(`${curso.id}/${asignatura.id}/${tema.id}`) }));
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
}

// Los nombres de curso, asignatura y tema salen de src/data/localizedCurriculum (es o en); los bloques,
// de content/activities (es) o content/activities/en
const catalogs = new Map<SiteLocale, CatalogCurso[]>();

export function getCatalog(locale: SiteLocale = 'es'): CatalogCurso[] {
    let catalog = catalogs.get(locale);
    if (!catalog) {
        catalog = buildCatalog(locale);
        catalogs.set(locale, catalog);
    }
    return catalog;
}

export const getCatalogCurso = (cursoId: string, locale: SiteLocale = 'es') => getCatalog(locale).find((c) => c.curso.id === cursoId);

export const getCatalogAsignatura = (cursoId: string, asignaturaId: string, locale: SiteLocale = 'es') =>
    getCatalogCurso(cursoId, locale)?.asignaturas.find((a) => a.asignatura.id === asignaturaId);

/** Catálogo en español (idioma indexable) */
export const catalog = getCatalog('es');
