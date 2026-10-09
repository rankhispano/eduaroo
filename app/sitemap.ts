import type { MetadataRoute } from 'next';
import { getIndexableRoutes } from '@/lib/seo/routes';
import { absoluteUrl } from '@/lib/seo/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const routes = await getIndexableRoutes();
    return routes.map((route) => ({ url: absoluteUrl(route.path), lastModified: route.lastModified }));
}
