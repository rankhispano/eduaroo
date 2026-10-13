import { resourcesSeo } from '@/lib/resources/seo';
import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { resourceGroups } from '@/lib/resources/catalog';
import { buildMetadata } from '@/lib/seo/metadata';
import { toSiteLocale, absoluteUrl } from '@/lib/seo/site';
import { paths } from '@/lib/seo/urls';
import { getActivitySets } from '@/content/activities/registry';
import ResourceDirectory from '@/components/resources/ResourceDirectory';
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
        ...resourcesSeo,
        path: paths.resources(),
    });
}
export default async function Page({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    if (locale !== 'es') redirect(paths.resources());
    setRequestLocale(locale);
    const sets = getActivitySets('es');
    const count = sets.reduce((sum, set) => sum + set.activityCount, 0);
    return (
        <>
            <BreadcrumbNav locale="es" items={[{ name: 'Recursos gratis' }]} />
            <article className="resource-page">
                <header className="resource-hero">
                    <p className="resource-eyebrow">
                        La biblioteca de Roo · Gratis y sin registro
                    </p>
                    <h1>Recursos educativos para aprender a tu ritmo</h1>
                    <p className="resource-lead">
                        Encuentra una actividad para hoy: juegos, herramientas,
                        fichas con soluciones y recorridos por curso. Elige lo
                        que quieres practicar y sigue desde la pantalla o el
                        papel.
                    </p>
                    <div className="grid max-w-xl grid-cols-3 gap-4 rounded-2xl bg-white p-5 dark:bg-slate-900">
                        {[
                            [sets.length, 'temas publicados'],
                            [count.toLocaleString('es-ES'), 'actividades'],
                            [6, 'cursos de Primaria'],
                        ].map(([n, label]) => (
                            <div key={label}>
                                <span className="block text-2xl font-black text-sky-800 dark:text-sky-300">
                                    {n}
                                </span>
                                <span className="text-xs font-bold">
                                    {label}
                                </span>
                            </div>
                        ))}
                    </div>
                    <nav
                        aria-label="Categorías de recursos"
                        className="mt-6 flex flex-wrap gap-2"
                    >
                        {resourceGroups.map((group, i) => (
                            <a
                                key={group}
                                className="resource-button-secondary"
                                href={`#grupo-${i}`}
                            >
                                {group}
                            </a>
                        ))}
                    </nav>
                </header>
                <div className="resource-body">
                    <ResourceDirectory />
                    <section className="rounded-2xl bg-white p-6 dark:bg-slate-900">
                        <h2 className="mb-3 text-2xl font-black">
                            Del recurso al tema completo
                        </h2>
                        <p>
                            Las guías y herramientas conectan con los temas del
                            catálogo de Primaria. Cada tema incluye un
                            recordatorio, actividades con corrección y
                            explicaciones. Las fichas conservan esos mismos
                            ejercicios y ofrecen un solucionario opcional para
                            trabajar sin pantalla.
                        </p>
                    </section>
                </div>
            </article>
            <JsonLd
                data={{
                    '@type': 'CollectionPage',
                    name: resourcesSeo.title,
                    url: absoluteUrl(paths.resources()),
                    description: resourcesSeo.description,
                    inLanguage: 'es',
                    isAccessibleForFree: true,
                }}
            />
        </>
    );
}
