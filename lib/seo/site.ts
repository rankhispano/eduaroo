// Constantes únicas del sitio. Cualquier URL absoluta, nombre o locale SEO sale de aquí.

export const siteUrl = 'https://www.eduaroo.com';
export const siteName = 'Eduaroo';
export const legalName = 'Archivados Network S.L.';
export const contactEmail = 'nicolas@archivados.com';

export const defaultLocale = 'es';
export const locales = ['es', 'en'] as const;
export type SiteLocale = (typeof locales)[number];

// Código OpenGraph por idioma
export const ogLocales: Record<SiteLocale, string> = { es: 'es_ES', en: 'en_GB' };

// Cuenta de X/Twitter del sitio. Vacío mientras el equipo no confirme una (se omite twitter:site).
export const twitterHandle: string | undefined = undefined;

// El inglés ya tiene los 238 bloques traducidos, pero no está revisado: se mantiene noindex, fuera del sitemap y
// sin hreflang. Para abrirlo: poner true, añadir alternates.languages en buildMetadata y mover <html lang>.
export const englishIndexable = false;

export const isSiteLocale = (value: string): value is SiteLocale => (locales as readonly string[]).includes(value);

export const toSiteLocale = (value: string): SiteLocale => (isSiteLocale(value) ? value : defaultLocale);

export function absoluteUrl(path: string): string {
    if (/^https?:\/\//.test(path)) return path;
    return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}
