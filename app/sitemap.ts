import type { MetadataRoute } from 'next';
import { getIndexableRoutes } from '@/lib/seo/routes';
import { absoluteUrl } from '@/lib/seo/site';
import { assertValidMetadata } from '@/lib/seo/validate';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Rompe el build si hay titles/descriptions duplicados o fuera de rango
    assertValidMetadata();
    const routes = await getIndexableRoutes();
    return routes.map((route) => ({ url: absoluteUrl(route.path), lastModified: route.lastModified }));
}
