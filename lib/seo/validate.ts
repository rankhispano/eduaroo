// Validación en build de los textos SEO generados desde plantillas: longitudes y duplicados.
// Se ejecuta desde app/sitemap.ts, así que un título repetido o fuera de rango rompe `next build`.
import { catalog } from './catalog';
import { finalTitle } from './metadata';
import { staticPages } from './pages';
import { englishIndexable } from './site';
import { localize, paths } from './urls';
import { DESCRIPTION_MAX, DESCRIPTION_MIN, templates, type SeoText } from './templates';

const TITLE_RANGE = [30, 60] as const;

export interface SeoIssue {
    path: string;
    problem: string;
}

export function validateGeneratedMetadata(): SeoIssue[] {
    const entries: { path: string; text: SeoText }[] = [{ path: paths.home(), text: templates.es.home() }, { path: paths.primaria(), text: templates.es.cursos() }];

    for (const c of catalog) {
        entries.push({ path: paths.curso(c.curso.id), text: templates.es.curso(c) });
        for (const a of c.asignaturas) {
            if (a.published.length === 0) continue;
            entries.push({ path: paths.asignatura(c.curso.id, a.asignatura.id), text: templates.es.asignatura(c, a) });
            for (const { tema, set } of a.published) {
                entries.push({
                    path: paths.tema(c.curso.id, a.asignatura.id, tema.id),
                    text: templates.es.tema(c, a, tema.nombre, set.summary, set.activityCount),
                });
            }
        }
    }
    for (const page of Object.values(staticPages)) {
        if (!page.noindex) entries.push({ path: page.path, text: page.es });
    }
    if (englishIndexable) entries.push({ path: localize('en', paths.home()), text: templates.en.home() });

    const issues: SeoIssue[] = [];
    const titles = new Map<string, string>();
    const descriptions = new Map<string, string>();

    for (const { path, text } of entries) {
        const title = finalTitle(text.title);
        if (title.length < TITLE_RANGE[0] || title.length > TITLE_RANGE[1]) {
            issues.push({ path, problem: `title de ${title.length} caracteres (30–60): "${title}"` });
        }
        if (text.description.length < DESCRIPTION_MIN || text.description.length > DESCRIPTION_MAX) {
            issues.push({ path, problem: `description de ${text.description.length} caracteres (${DESCRIPTION_MIN}–${DESCRIPTION_MAX})` });
        }
        const sameTitle = titles.get(title);
        if (sameTitle) issues.push({ path, problem: `title duplicado con ${sameTitle}: "${title}"` });
        titles.set(title, path);
        const sameDescription = descriptions.get(text.description);
        if (sameDescription) issues.push({ path, problem: `description duplicada con ${sameDescription}` });
        descriptions.set(text.description, path);
    }
    return issues;
}

export function assertValidMetadata(): void {
    const issues = validateGeneratedMetadata();
    if (issues.length > 0) {
        const list = issues.map((i) => `  - ${i.path}: ${i.problem}`).join('\n');
        throw new Error(`SEO: ${issues.length} problemas en title/description generados:\n${list}`);
    }
}
