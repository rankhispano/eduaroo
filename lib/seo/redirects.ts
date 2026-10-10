// Redirects 301 de las URLs antiguas a la jerarquía /primaria/{n}-primaria/{asignatura}/{tema}.
// Módulo sin alias de ruta: lo importa next.config.ts. Cada regla va directa al destino final.
import { ASIGNATURA_SLUGS } from './slugs';

export interface LegacyRedirect {
    source: string;
    destination: string;
    statusCode: 301;
}

const redirect = (source: string, destination: string): LegacyRedirect => ({ source, destination, statusCode: 301 });

// Prefijos antiguos: sin idioma (se redirigía con middleware a /es), /es y /en
const PREFIXES = [
    { from: '', to: '' },
    { from: '/es', to: '' },
    { from: '/en', to: '/en' },
] as const;

export function legacyRedirects(): LegacyRedirect[] {
    const rules: LegacyRedirect[] = [];

    for (const { from, to } of PREFIXES) {
        // Árbol /learning/{curso}/{asignatura}/{tema}
        rules.push(redirect(`${from}/learning`, `${to}/primaria`));
        rules.push(redirect(`${from}/learning/:curso([1-6])`, `${to}/primaria/:curso-primaria`));
        for (const [id, slug] of Object.entries(ASIGNATURA_SLUGS)) {
            rules.push(redirect(`${from}/learning/:curso([1-6])/${id}/:rest*`, `${to}/primaria/:curso-primaria/${slug}/:rest*`));
        }
        // Selectores antiguos de Matemáticas y Lengua
        rules.push(redirect(`${from}/learning/math`, `${to}/primaria`));
        rules.push(redirect(`${from}/learning/language`, `${to}/primaria`));
        rules.push(redirect(`${from}/learning/math/grade:grade([1-6])`, `${to}/primaria/:grade-primaria/matematicas`));
        rules.push(redirect(`${from}/learning/language/grade:grade([1-6])`, `${to}/primaria/:grade-primaria/lengua`));
        // Juegos y páginas legales con nombre en español
        rules.push(redirect(`${from}/games`, `${to}/juegos`));
        rules.push(redirect(`${from}/games/:slug([^/.]+)`, `${to}/juegos/:slug`));
        rules.push(redirect(`${from}/privacy`, `${to}/politica-de-privacidad`));
        rules.push(redirect(`${from}/privacy-policy`, `${to}/politica-de-privacidad`));
        rules.push(redirect(`${from}/terms`, `${to}/terminos`));
    }

    // "Repasa Primaria" (/repaso) duplicaba las páginas de curso y asignatura
    rules.push(redirect('/repaso', '/primaria'));
    rules.push(redirect('/repaso/:curso([1-6])', '/primaria/:curso-primaria'));
    for (const [id, slug] of Object.entries(ASIGNATURA_SLUGS)) {
        rules.push(redirect(`/repaso/:curso([1-6])/${id}`, `/primaria/:curso-primaria/${slug}`));
    }

    // El español ya no lleva prefijo: /es/x → /x (va la última, tras las reglas específicas)
    rules.push(redirect('/es', '/'));
    rules.push(redirect('/es/:path*', '/:path*'));

    return rules;
}
