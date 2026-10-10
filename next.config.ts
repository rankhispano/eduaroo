import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

import type { NextConfig } from "next";
import { legacyRedirects } from "./lib/seo/redirects";

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
  // Redirects 301 de las URLs antiguas a las nuevas (mapa completo en URL_MAP.md). Cada regla lleva
  // directamente al destino final para no encadenar saltos; la regla genérica /es/* va la última.
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
      ...legacyRedirects(),
    ];
  },
};

export default withNextIntl(nextConfig);
