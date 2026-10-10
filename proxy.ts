import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// El español no lleva prefijo (/primaria/...) y el inglés cuelga de /en. Las redirecciones de URLs antiguas
// (con /es, /learning, /repaso...) están en next.config.ts y se aplican antes que este middleware.
export default createMiddleware(routing);

export const config = {
    // Match all pathnames except for
    // - … if they start with `/api`, `/og` (imágenes Open Graph), `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    matcher: ['/((?!api|og|_next|_vercel|.*\\..*).*)']
};
