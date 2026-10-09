// Enlaces relacionados de una página de tema: tema anterior y siguiente de la misma asignatura y
// curso, y el mismo tema en otros cursos (por id de tema). Anchors descriptivos, nunca "ver más".
import { catalog, getCatalogAsignatura } from './catalog';
import { subjectName } from './hub-content';
import type { SiteLocale } from './site';
import { paths } from './urls';

export interface RelatedItem {
    name: string;
    path: string;
}

export function relatedForTema(cursoId: string, asignaturaId: string, temaId: string, locale: SiteLocale): RelatedItem[] {
    const asignatura = getCatalogAsignatura(cursoId, asignaturaId);
    if (!asignatura) return [];
    const published = asignatura.published;
    const index = published.findIndex((t) => t.tema.id === temaId);
    const related: RelatedItem[] = [];

    const sibling = (offset: -1 | 1) => {
        const target = published[index + offset];
        if (!target) return;
        const label = locale === 'es' ? (offset === -1 ? 'Tema anterior' : 'Tema siguiente') : offset === -1 ? 'Previous topic' : 'Next topic';
        related.push({ name: `${label}: ${target.tema.nombre}`, path: paths.tema(cursoId, asignaturaId, target.tema.id) });
    };
    if (index !== -1) {
        sibling(-1);
        sibling(1);
    }

    for (const other of catalog) {
        if (other.curso.id === cursoId) continue;
        const match = other.asignaturas.find((a) => a.asignatura.id === asignaturaId)?.published.find((t) => t.tema.id === temaId);
        if (match) {
            const name = subjectName(asignatura, locale);
            related.push({
                name: locale === 'es' ? `${match.tema.nombre} en ${other.grade}º de Primaria (${name})` : `${match.tema.nombre} in Primary ${other.grade} (${name})`,
                path: paths.tema(other.curso.id, asignaturaId, temaId),
            });
        }
    }
    return related;
}
