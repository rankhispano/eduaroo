// Metadata de las páginas estáticas del sitio (juegos, legales, secciones personales).
// `noindex` = páginas personales (progreso en el navegador), de demostración o sin contenido propio.
import type { Metadata } from 'next';
import { getGameSeo } from './games';
import { buildMetadata } from './metadata';
import type { SiteLocale } from './site';
import { paths } from './urls';

interface StaticPage {
    path: string;
    noindex: boolean;
    es: { title: string; description: string };
    en: { title: string; description: string };
}

export const staticPages = {
    games: {
        path: '/games',
        noindex: false,
        es: {
            title: 'Juegos educativos gratis de Primaria',
            description:
                'Colección de juegos educativos gratuitos para niños de Primaria: matemáticas, lógica y lengua. Practica jugando con mecanografía, cálculo, sílabas y más.',
        },
        en: {
            title: 'Free educational games for primary school',
            description:
                'A collection of free educational games for primary school children: maths, logic and language. Practise by playing with typing, calculation, syllables and more.',
        },
    },
    privacy: {
        path: '/privacy',
        noindex: true,
        es: {
            title: 'Política de privacidad',
            description: 'Política de privacidad de Eduaroo: qué datos se tratan, cómo se protegen y cómo contactar con nosotros para ejercer tus derechos.',
        },
        en: {
            title: 'Privacy policy',
            description: 'Eduaroo privacy policy: what data is processed, how it is protected and how to contact us to exercise your rights.',
        },
    },
    terms: {
        path: '/terms',
        noindex: true,
        es: {
            title: 'Términos de servicio',
            description: 'Términos de servicio de Eduaroo: condiciones de uso del sitio y de las actividades educativas para familias, docentes y alumnos.',
        },
        en: {
            title: 'Terms of service',
            description: 'Eduaroo terms of service: conditions of use for the website and the educational activities for families, teachers and students.',
        },
    },
    blog: {
        path: '/blog',
        noindex: true,
        es: { title: 'Blog de Eduaroo', description: 'Novedades, consejos de estudio y recursos de repaso de Primaria de Eduaroo para familias y docentes.' },
        en: { title: 'Eduaroo blog', description: 'News, study tips and primary school revision resources from Eduaroo for families and teachers.' },
    },
    kids: {
        path: '/kids',
        noindex: true,
        es: { title: 'Mi progreso', description: 'Tu panel de progreso y logros en Eduaroo.' },
        en: { title: 'My progress', description: 'Your progress and achievements dashboard in Eduaroo.' },
    },
    kidsStore: {
        path: '/kids/store',
        noindex: true,
        es: { title: 'Tienda y avatar', description: 'Personaliza tu avatar y desbloquea objetos con las estrellas que ganas practicando en Eduaroo.' },
        en: { title: 'Store and avatar', description: 'Customise your avatar and unlock items with the stars you earn by practising in Eduaroo.' },
    },
    mascota: {
        path: '/mascota',
        noindex: true,
        es: { title: 'Conoce a Roo', description: 'Roo es la mascota de Eduaroo: una galería con todas sus poses animadas.' },
        en: { title: 'Meet Roo', description: 'Roo is the Eduaroo mascot: a gallery with all of its animated poses.' },
    },
    parents: {
        path: '/parents',
        noindex: true,
        es: { title: 'Panel para familias (demostración)', description: 'Vista de demostración del panel para familias de Eduaroo.' },
        en: { title: 'Family dashboard (demo)', description: 'Demo view of the Eduaroo family dashboard.' },
    },
    teachers: {
        path: '/teachers',
        noindex: true,
        es: { title: 'Panel para docentes (demostración)', description: 'Vista de demostración del panel para docentes de Eduaroo, con datos de ejemplo.' },
        en: { title: 'Teacher dashboard (demo)', description: 'Demo view of the Eduaroo teacher dashboard, with sample data.' },
    },
    pegatinas: {
        path: '/pegatinas',
        noindex: true,
        es: { title: 'Mis pegatinas', description: 'Tu álbum de pegatinas de Eduaroo: colecciona una por cada tema que completas.' },
        en: { title: 'My stickers', description: 'Your Eduaroo sticker album: collect one for every topic you complete.' },
    },
} satisfies Record<string, StaticPage>;

export type StaticPageKey = keyof typeof staticPages;

export function staticPageMetadata(key: StaticPageKey, locale: SiteLocale): Metadata {
    const page = staticPages[key];
    return buildMetadata({ locale, ...page[locale], path: page.path, noindex: page.noindex });
}

export function gameMetadata(slug: string, locale: SiteLocale): Metadata {
    const game = getGameSeo(slug, locale);
    if (!game) return {};
    return buildMetadata({ locale, ...game, path: paths.game(slug) });
}
