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

// El inglés solo tiene 2 de 240 bloques traducidos: se mantiene noindex y sin hreflang
// hasta que haya contenido real. Cambiar a true cuando se complete la traducción.
export const englishIndexable = false;

export const isSiteLocale = (value: string): value is SiteLocale => (locales as readonly string[]).includes(value);

export const toSiteLocale = (value: string): SiteLocale => (isSiteLocale(value) ? value : defaultLocale);

export function absoluteUrl(path: string): string {
    if (/^https?:\/\//.test(path)) return path;
    return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}
