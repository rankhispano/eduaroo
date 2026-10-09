// Helpers tipados de metadata. TODAS las páginas públicas construyen su Metadata con buildMetadata().
import type { Metadata, Viewport } from 'next';
import { ogImage, type OgImage } from './og-image';
import { absoluteUrl, englishIndexable, ogLocales, siteName, twitterHandle, type SiteLocale } from './site';
import { localize } from './urls';

export const TITLE_MAX = 60;
const BRAND_SUFFIX = ` | ${siteName}`;

export const defaultTitle = 'Eduaroo | Recursos de repaso de Primaria según la LOMLOE (1º a 6º)';
export const defaultDescription =
    'Ejercicios y actividades de repaso de Primaria por curso y asignatura, según la LOMLOE. Para familias y docentes: practica jugando, gratis y sin registro.';

export const viewport: Viewport = { themeColor: '#f97316' };

/** Title tal y como se verá en la pestaña: añade la marca si cabe en 60 caracteres */
export function finalTitle(title: string): string {
    if (title.includes(siteName)) return title;
    const branded = `${title}${BRAND_SUFFIX}`;
    return branded.length <= TITLE_MAX ? branded : title;
}

export interface BuildMetadataInput {
    locale: SiteLocale;
    title: string;
    description: string;
    /** Ruta lógica sin idioma (la misma que usa <Link>), p. ej. "/learning/3" */
    path: string;
    type?: 'website' | 'article';
    noindex?: boolean;
    /** Imagen Open Graph 1200×630 (por defecto, la de la home del idioma) */
    image?: OgImage;
    /** Fecha real de última modificación (solo type "article") */
    modified?: Date;
}

export function buildMetadata({ locale, title, description, path, type = 'website', noindex = false, image, modified }: BuildMetadataInput): Metadata {
    const url = absoluteUrl(localize(locale, path));
    const shown = finalTitle(title);
    // La versión inglesa no es indexable mientras no esté traducida (ver site.ts)
    const og = image ?? ogImage.home(locale);
    const images = [{ url: absoluteUrl(og.url), width: 1200, height: 630, alt: og.alt }];
    const hidden = noindex || (locale === 'en' && !englishIndexable);

    return {
        // Si la marca no cabe se usa el título sin plantilla; si cabe, la plantilla %s | Eduaroo la añade
        title: shown === title ? { absolute: title } : title,
        description,
        alternates: { canonical: url },
        robots: hidden ? { index: false, follow: true } : { index: true, follow: true },
        openGraph: {
            title: shown,
            description,
            url,
            siteName,
            locale: ogLocales[locale],
            type,
            images,
            ...(type === 'article' && modified ? { modifiedTime: modified.toISOString() } : {}),
        },
        twitter: {
            card: 'summary_large_image',
            title: shown,
            description,
            images: [{ url: images[0].url, alt: og.alt }],
            ...(twitterHandle ? { site: twitterHandle } : {}),
        },
    };
}
