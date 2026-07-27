import { defineRouting } from 'next-intl/routing';


export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ['en', 'es'],

    // Used when no locale matches
    defaultLocale: 'es'
});

// Navigation exports have been moved to i18n/navigation.ts to avoid Edge Runtime issues in Middleware
