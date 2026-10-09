import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

import type { NextConfig } from "next";

const canonicalHost = 'www.eduaroo.com';
const apexHost = 'eduaroo.com';

const nextConfig: NextConfig = {
  // Política de URLs: sin barra final (/x/ → /x con redirect permanente) y un único host canónico
  trailingSlash: false,
  poweredByHeader: false,
  async headers() {
    const assets = 'public, max-age=604800, stale-while-revalidate=86400';
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      // Imágenes y juegos de /public: no llevan hash en el nombre, caché larga con revalidación
      ...['/mascots/:path*', '/games/:path*', '/icons/:path*'].map((source) => ({
        source,
        headers: [{ key: 'Cache-Control', value: assets }],
      })),
    ];
  },
  // Las páginas de selección antiguas de Matemáticas y Lengua llevan ahora a su
  // curso/asignatura; los ejercicios (/learning/math/gradeN/<tema>) siguen igual
  // y se enlazan como recursos de cada tema en src/data/curriculum.ts.
  async redirects() {
    return [
      // apex → www en un solo salto (http o https), sin cadenas
      {
        source: '/:path*',
        has: [{ type: 'host' as const, value: apexHost }],
        destination: `https://${canonicalHost}/:path*`,
        statusCode: 301,
      },
      // http → https en el host canónico (detrás de proxy: cabecera x-forwarded-proto)
      {
        source: '/:path*',
        has: [
          { type: 'host' as const, value: canonicalHost },
          { type: 'header' as const, key: 'x-forwarded-proto', value: 'http' },
        ],
        destination: `https://${canonicalHost}/:path*`,
        statusCode: 301,
      },
      { source: '/:locale(es|en)/learning/math', destination: '/:locale/learning', permanent: false },
      { source: '/:locale(es|en)/learning/math/grade:grade(\\d)', destination: '/:locale/learning/:grade/mates', permanent: false },
      { source: '/:locale(es|en)/learning/language', destination: '/:locale/learning', permanent: false },
      { source: '/:locale(es|en)/learning/language/grade:grade(\\d)', destination: '/:locale/learning/:grade/lengua', permanent: false },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/politica-de-privacidad',
        destination: '/es/privacy',
      },
      {
        source: '/es/politica-de-privacidad',
        destination: '/es/privacy',
      },
      {
        source: '/en/privacy-policy',
        destination: '/en/privacy',
      },
      {
        source: '/privacy-policy',
        destination: '/en/privacy',
      },
    ];
  },
};

export default withNextIntl(nextConfig);
