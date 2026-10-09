// Constructores de ruta. Única fuente de verdad: sitemap, canonical, JSON-LD y enlaces internos
// deben usar estas funciones y no concatenar rutas a mano.
//
// Jerarquía pública (español, minúsculas, sin acentos ni ids opacos), sin barra final:
//   /primaria/{n}-primaria/{asignatura}/{tema}
// El español no lleva prefijo de idioma; el inglés cuelga de /en (ver i18n/routing.ts).
//
// Los ids internos (curso "3", asignatura "mates") se convierten a slug aquí. El código antiguo que
// aún usa rutas lógicas (/learning/3/mates) pasa por toPublicPath() en i18n/navigation.ts.

import type { SiteLocale } from './site';
import { asignaturaSlug, cursoSlug } from './slugs';

export const paths = {
    home: () => '/',
    primaria: () => '/primaria',
    curso: (curso: string) => `/primaria/${cursoSlug(curso)}`,
    asignatura: (curso: string, asignatura: string) => `/primaria/${cursoSlug(curso)}/${asignaturaSlug(asignatura)}`,
    tema: (curso: string, asignatura: string, tema: string) => `/primaria/${cursoSlug(curso)}/${asignaturaSlug(asignatura)}/${tema}`,
    examen: (curso: string, asignatura: string) => `/primaria/${cursoSlug(curso)}/${asignaturaSlug(asignatura)}/examen`,
    games: () => '/juegos',
    game: (slug: string) => `/juegos/${slug}`,
    privacy: () => '/politica-de-privacidad',
    terms: () => '/terminos',
};

export function localize(locale: SiteLocale, path: string): string {
    if (locale === 'es') return path;
    return path === '/' ? '/en' : `/en${path}`;
}

type PathBuilders = typeof paths;
type UrlBuilders = { [K in keyof PathBuilders]: (locale: SiteLocale, ...args: Parameters<PathBuilders[K]>) => string };

export const urls = Object.fromEntries(
    Object.entries(paths).map(([name, build]) => [
        name,
        (locale: SiteLocale, ...args: string[]) => localize(locale, (build as (...a: string[]) => string)(...args)),
    ]),
) as UrlBuilders;
