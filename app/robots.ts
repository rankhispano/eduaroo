import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/seo/site';

// Se permite todo lo público (incluidos /_next/static, CSS y JS). Las páginas personales o de
// demostración usan meta noindex (no Disallow) para que los buscadores puedan leer la directiva.
export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/preview/', '/admin/', '/*?q=', '/*?search=', '/*?s='],
            },
        ],
        sitemap: absoluteUrl('/sitemap.xml'),
    };
}
