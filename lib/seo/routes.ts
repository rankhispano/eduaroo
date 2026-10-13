// Lista de páginas públicas indexables. La usan el sitemap y los tests de CI.
// Solo entran URLs 200, canónicas e indexables (sin noindex ni parámetros).

import { resourceGuides, RESOURCE_UPDATED } from '@/lib/resources/catalog';
import { comparisons } from '@/lib/resources/comparisons';
import { summerTopics } from '@/lib/resources/worksheets';
import { getActivitySets } from '@/content/activities/registry';
import { curriculum } from '@/src/data/curriculum';
import { getActivityPages, latest } from './content';
import { GAMES_LAST_MODIFIED, games, INFO_PAGES_LAST_MODIFIED } from './games';
import { englishIndexable, locales, type SiteLocale } from './site';
import { urls } from './urls';

export interface IndexableRoute {
    path: string;
    lastModified: Date;
}

export const indexableLocales = (): SiteLocale[] => (englishIndexable ? [...locales] : ['es']);

export async function getIndexableRoutes(): Promise<IndexableRoute[]> {
    const routes: IndexableRoute[] = [];

    for (const locale of indexableLocales()) {
        const pages = await getActivityPages();
        const all = latest(pages.map((p) => p.lastModified));

        routes.push({ path: urls.home(locale), lastModified: all });
        routes.push({ path: urls.primaria(locale), lastModified: all });

        for (const curso of curriculum) {
            const delCurso = pages.filter((p) => p.cursoId === curso.id);
            if (delCurso.length === 0) continue;
            routes.push({ path: urls.curso(locale, curso.id), lastModified: latest(delCurso.map((p) => p.lastModified)) });
            for (const asignatura of curso.asignaturas) {
                const delTema = delCurso.filter((p) => p.asignaturaId === asignatura.id);
                if (delTema.length === 0) continue;
                routes.push({
                    path: urls.asignatura(locale, curso.id, asignatura.id),
                    lastModified: latest(delTema.map((p) => p.lastModified)),
                });
                for (const set of delTema) {
                    routes.push({ path: urls.tema(locale, set.cursoId, set.asignaturaId, set.temaId), lastModified: set.lastModified });
                }
            }
        }

        routes.push({ path: urls.about(locale), lastModified: INFO_PAGES_LAST_MODIFIED });
        routes.push({ path: urls.contact(locale), lastModified: INFO_PAGES_LAST_MODIFIED });
        routes.push({ path: urls.games(locale), lastModified: GAMES_LAST_MODIFIED });
        for (const game of games) routes.push({ path: urls.game(locale, game), lastModified: GAMES_LAST_MODIFIED });
    }

    // La biblioteca nueva está escrita en español; no inventamos versiones inglesas indexables.
    routes.push({ path: urls.resources('es'), lastModified: RESOURCE_UPDATED }, { path: urls.compare('es'), lastModified: RESOURCE_UPDATED });
    for (const guide of resourceGuides) routes.push({ path: urls.resource('es', guide.slug), lastModified: RESOURCE_UPDATED });
    for (const comparison of comparisons) routes.push({ path: urls.comparison('es', comparison.slug), lastModified: RESOURCE_UPDATED });
    for (const set of getActivitySets('es')) {
        routes.push({ path: urls.worksheet('es', set.cursoId, set.asignaturaId, set.temaId), lastModified: RESOURCE_UPDATED });
    }
    for (const grade of Object.keys(summerTopics)) routes.push({ path: urls.summerBook('es', grade), lastModified: RESOURCE_UPDATED });
    return routes;
}
