// URL pública y texto alternativo de las imágenes Open Graph (las genera app/og/**, ver og.tsx).
import { getAsignatura } from '@/src/data/localizedCurriculum';
import type { SiteLocale } from './site';

export interface OgImage {
    url: string;
    alt: string;
}

const esLocale = (locale: SiteLocale) => locale === 'es';

export const ogImage = {
    home: (locale: SiteLocale): OgImage => ({
        url: `/og/${locale}`,
        alt: esLocale(locale) ? 'Eduaroo: repaso de Primaria de 1º a 6º según la LOMLOE' : 'Eduaroo: primary school revision, years 1 to 6',
    }),
    curso: (locale: SiteLocale, curso: string): OgImage => ({
        url: `/og/${locale}/${curso}`,
        alt: esLocale(locale) ? `Eduaroo: repaso de ${curso}º de Primaria` : `Eduaroo: Primary ${curso} revision`,
    }),
    asignatura: (locale: SiteLocale, curso: string, asignatura: string): OgImage => {
        const nombre = getAsignatura(curso, asignatura, locale)?.nombre ?? asignatura;
        return {
            url: `/og/${locale}/${curso}/${asignatura}`,
            alt: esLocale(locale) ? `Eduaroo: ${nombre} de ${curso}º de Primaria` : `Eduaroo: ${nombre}, Primary ${curso}`,
        };
    },
};
