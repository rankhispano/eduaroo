import { defineRouting } from 'next-intl/routing';


export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ['en', 'es'],

    // Used when no locale matches
    defaultLocale: 'es',

    // El español (idioma principal) va sin prefijo: la home es "/" y el inglés cuelga de "/en"
    localePrefix: 'as-needed',

    // Sin detección por Accept-Language ni cookie NEXT_LOCALE: cada URL sirve siempre el mismo idioma
    // (indexable y cacheable en CDN)
    localeDetection: false,
    localeCookie: false,

    // hreflang: lo emite la metadata de cada página (lib/seo/metadata.ts), no la cabecera Link del middleware
    alternateLinks: false,
});

// Navigation exports have been moved to i18n/navigation.ts to avoid Edge Runtime issues in Middleware
