// Constructores de ruta. Única fuente de verdad: sitemap, canonical, JSON-LD y enlaces internos
// deben usar estas funciones y no concatenar rutas a mano.
//  - `paths`: ruta lógica sin idioma, para el <Link> de next-intl (que añade el prefijo de idioma).
//  - `urls`: ruta pública con idioma, para canonical, sitemap y JSON-LD.
// Política: sin barra final (trailingSlash: false en next.config.ts).

import type { SiteLocale } from './site';

export const paths = {
    home: () => '/',
    learning: () => '/learning',
    curso: (curso: string) => `/learning/${curso}`,
    asignatura: (curso: string, asignatura: string) => `/learning/${curso}/${asignatura}`,
    tema: (curso: string, asignatura: string, tema: string) => `/learning/${curso}/${asignatura}/${tema}`,
    examen: (curso: string, asignatura: string) => `/learning/${curso}/${asignatura}/examen`,
    games: () => '/games',
    game: (slug: string) => `/games/${slug}`,
    privacy: () => '/privacy',
    terms: () => '/terms',
};

export function localize(locale: SiteLocale, path: string): string {
    const prefix = `/${locale}`;
    return path === '/' ? prefix : `${prefix}${path}`;
}

type PathBuilders = typeof paths;
type UrlBuilders = { [K in keyof PathBuilders]: (locale: SiteLocale, ...args: Parameters<PathBuilders[K]>) => string };

export const urls = Object.fromEntries(
    Object.entries(paths).map(([name, build]) => [
        name,
        (locale: SiteLocale, ...args: string[]) => localize(locale, (build as (...a: string[]) => string)(...args)),
    ]),
) as UrlBuilders;
