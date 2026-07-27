import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
