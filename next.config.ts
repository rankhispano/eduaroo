import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Las páginas de selección antiguas de Matemáticas y Lengua llevan ahora a su
  // curso/asignatura; los ejercicios (/learning/math/gradeN/<tema>) siguen igual
  // y se enlazan como recursos de cada tema en src/data/curriculum.ts.
  async redirects() {
    return [
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
