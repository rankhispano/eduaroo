import { ChevronRight, Home } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { absoluteUrl, type SiteLocale } from '@/lib/seo/site';
import { localize } from '@/lib/seo/urls';
import JsonLd from './JsonLd';

export interface Crumb {
    name: string;
    /** Ruta pública sin idioma (lib/seo/urls.ts). La última migaja (página actual) no lleva enlace. */
    path?: string;
}

const homeLabel: Record<SiteLocale, string> = { es: 'Inicio', en: 'Home' };
const navLabel: Record<SiteLocale, string> = { es: 'Migas de pan', en: 'Breadcrumb' };

// Migas de pan visibles (nav + ol semánticos) y BreadcrumbList JSON-LD con las mismas URLs.
export default function BreadcrumbNav({ locale, items }: { locale: SiteLocale; items: Crumb[] }) {
    const trail: Crumb[] = [{ name: homeLabel[locale], path: '/' }, ...items];

    return (
        <>
            <nav aria-label={navLabel[locale]} className="border-b border-slate-200 bg-slate-50 py-3 dark:border-gray-800 dark:bg-black">
                <ol className="container mx-auto flex items-center overflow-x-auto whitespace-nowrap px-4 text-sm text-slate-600 dark:text-slate-300">
                    {trail.map((crumb, index) => {
                        const last = index === trail.length - 1;
                        return (
                            <li key={`${crumb.name}-${index}`} className="flex items-center">
                                {index > 0 ? <ChevronRight className="mx-2 h-4 w-4 shrink-0 text-slate-400" aria-hidden /> : null}
                                {last || !crumb.path ? (
                                    <span aria-current="page" className="font-semibold text-slate-900 dark:text-slate-100">
                                        {crumb.name}
                                    </span>
                                ) : (
                                    <Link href={crumb.path} className="flex items-center hover:text-indigo-700 hover:underline">
                                        {index === 0 ? <Home className="mr-1 h-4 w-4" aria-hidden /> : null}
                                        {crumb.name}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </nav>
            <JsonLd
                data={{
                    '@type': 'BreadcrumbList',
                    itemListElement: trail.map((crumb, index) => ({
                        '@type': 'ListItem',
                        position: index + 1,
                        name: crumb.name,
                        ...(crumb.path ? { item: absoluteUrl(localize(locale, crumb.path)) } : {}),
                    })),
                }}
            />
        </>
    );
}
