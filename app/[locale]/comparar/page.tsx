import { compareSeo } from '@/lib/resources/seo';
import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { comparisons } from '@/lib/resources/comparisons';
import { buildMetadata } from '@/lib/seo/metadata';
import { toSiteLocale, absoluteUrl } from '@/lib/seo/site';
import { paths } from '@/lib/seo/urls';
import BreadcrumbNav from '@/components/seo/BreadcrumbNav';
import JsonLd from '@/components/seo/JsonLd';
export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    return buildMetadata({
        locale: toSiteLocale(locale),
        ...compareSeo,
        path: paths.compare(),
    });
}
export default async function Page({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    if (locale !== 'es') redirect(paths.compare());
    setRequestLocale(locale);
    return (
        <>
            <BreadcrumbNav locale="es" items={[{ name: 'Comparativas' }]} />
            <article className="resource-page">
                <header className="resource-hero">
                    <p className="resource-eyebrow">Para elegir con criterio</p>
                    <h1>Compara plataformas de aprendizaje para niños</h1>
                    <p className="resource-lead">
                        La edad, el idioma y el tipo de acompañamiento cambian
                        lo que necesitas. Estas tres comparativas explican dónde
                        encaja Eduaroo y qué ofrece cada alternativa, con
                        enlaces a sus fuentes oficiales.
                    </p>
                </header>
                <div className="resource-body">
                    <div className="grid gap-5 md:grid-cols-3">
                        {comparisons.map((c) => (
                            <Link
                                href={paths.comparison(c.slug)}
                                key={c.slug}
                                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
                            >
                                <span className="mb-5 text-4xl" aria-hidden>
                                    {c.icon}
                                </span>
                                <h2 className="text-2xl font-black">
                                    Eduaroo vs {c.name}
                                </h2>
                                <p className="mt-4 flex-1 text-base text-slate-600 dark:text-slate-300">
                                    {c.intro}
                                </p>
                                <span className="resource-link mt-6">
                                    Leer comparativa →
                                </span>
                            </Link>
                        ))}
                    </div>
                    <section className="space-y-4">
                        <h2 className="text-2xl font-black">
                            Cómo se han preparado las comparativas
                        </h2>
                        <p>
                            Información consultada el 13 de octubre de 2026. Las
                            características de otras plataformas proceden de sus
                            páginas públicas; no hemos evaluado sus cuentas de
                            pago ni medido sus resultados educativos. Las
                            funciones de Eduaroo se describen a partir del
                            proyecto actual.
                        </p>
                        <p>
                            Separamos las funciones disponibles de las
                            demostraciones. Cuando un precio depende del país o
                            del plan, enlazamos las condiciones del proveedor.
                            Cada artículo reconoce las ventajas de ambas
                            propuestas y las diferencias que afectan a la
                            elección.
                        </p>
                    </section>
                    <Link
                        className="resource-button w-fit"
                        href={paths.resources()}
                    >
                        Explorar los recursos de Eduaroo →
                    </Link>
                </div>
            </article>
            <JsonLd
                data={{
                    '@type': 'CollectionPage',
                    name: compareSeo.title,
                    inLanguage: 'es',
                    url: absoluteUrl(paths.compare()),
                    mainEntity: {
                        '@type': 'ItemList',
                        itemListElement: comparisons.map((c, i) => ({
                            '@type': 'ListItem',
                            position: i + 1,
                            name: `Eduaroo vs ${c.name}`,
                            url: absoluteUrl(paths.comparison(c.slug)),
                        })),
                    },
                }}
            />
        </>
    );
}
