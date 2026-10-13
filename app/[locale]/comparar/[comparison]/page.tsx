import { notFound, redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { comparisons, getComparison } from '@/lib/resources/comparisons';
import { RESOURCE_UPDATED } from '@/lib/resources/catalog';
import { buildMetadata } from '@/lib/seo/metadata';
import { toSiteLocale, absoluteUrl } from '@/lib/seo/site';
import { paths } from '@/lib/seo/urls';
import BreadcrumbNav from '@/components/seo/BreadcrumbNav';
import JsonLd from '@/components/seo/JsonLd';
export const dynamicParams = false;
export function generateStaticParams() {
    return comparisons.map((c) => ({ comparison: c.slug }));
}
export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string; comparison: string }>;
}) {
    const { locale, comparison } = await params;
    const c = getComparison(comparison);
    if (!c) return {};
    return buildMetadata({
        locale: toSiteLocale(locale),
        title: c.title,
        description: c.description,
        path: paths.comparison(c.slug),
        type: 'article',
        modified: RESOURCE_UPDATED,
    });
}
export default async function Page({
    params,
}: {
    params: Promise<{ locale: string; comparison: string }>;
}) {
    const { locale, comparison } = await params;
    const c = getComparison(comparison);
    if (!c) notFound();
    if (locale !== 'es') redirect(paths.comparison(comparison));
    setRequestLocale(locale);
    return (
        <>
            <BreadcrumbNav
                locale="es"
                items={[
                    { name: 'Comparativas', path: paths.compare() },
                    { name: `Eduaroo vs ${c.name}` },
                ]}
            />
            <article className="resource-page">
                <header className="resource-hero">
                    <p className="resource-eyebrow">
                        {c.icon} Comparativa · Fuentes consultadas el 13 de
                        octubre de 2026
                    </p>
                    <h1>Eduaroo vs {c.name}</h1>
                    <p className="resource-lead">{c.intro}</p>
                    <a href="#diferencias" className="resource-button w-fit">
                        Ver las diferencias →
                    </a>
                </header>
                <div className="resource-body">
                    <section className="rounded-2xl border border-sky-200 bg-sky-50 p-6 text-slate-900">
                        <h2 className="mb-3 text-2xl font-black">
                            Qué opción puede encajar
                        </h2>
                        <p>{c.verdict}</p>
                    </section>
                    <section
                        id="diferencias"
                        className="scroll-mt-24 space-y-4"
                    >
                        <h2 className="text-2xl font-black">
                            Compara lo que necesitas
                        </h2>
                        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
                            <table className="w-full min-w-[580px] text-left text-base">
                                <caption className="sr-only">
                                    Características de Eduaroo y {c.name}
                                </caption>
                                <thead className="bg-slate-900 text-white">
                                    <tr>
                                        {['Criterio', 'Eduaroo', c.name].map(
                                            (label) => (
                                                <th
                                                    className="p-4"
                                                    key={label}
                                                    scope="col"
                                                >
                                                    {label}
                                                </th>
                                            ),
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {c.rows.map(([label, ours, theirs]) => (
                                        <tr
                                            key={label}
                                            className="border-t border-slate-200 bg-white align-top dark:border-slate-700 dark:bg-slate-900"
                                        >
                                            <th className="p-4" scope="row">
                                                {label}
                                            </th>
                                            <td className="bg-sky-50 p-4 text-slate-900">
                                                {ours}
                                            </td>
                                            <td className="p-4">{theirs}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="text-sm">
                            Datos de {c.name}:{' '}
                            {c.sources.map((source, i) => (
                                <span key={source.url}>
                                    {i > 0 ? ' · ' : ''}
                                    <a
                                        className="resource-link"
                                        href={source.url}
                                    >
                                        {source.label}
                                    </a>
                                </span>
                            ))}
                            . Los planes y condiciones pueden cambiar.
                        </p>
                    </section>
                    <div className="grid gap-6 md:grid-cols-2">
                        {[
                            ['Eduaroo puede encajar si…', c.chooseEduaroo],
                            [`${c.name} puede encajar si…`, c.chooseOther],
                        ].map(([heading, items]) => (
                            <section
                                key={heading as string}
                                className="rounded-2xl bg-white p-6 dark:bg-slate-900"
                            >
                                <h2 className="mb-4 text-2xl font-black">
                                    {heading}
                                </h2>
                                <ul className="list-disc space-y-3 pl-5">
                                    {(items as string[]).map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </section>
                        ))}
                    </div>
                    {c.sections.map((section) => (
                        <section
                            key={section.heading}
                            className="max-w-4xl space-y-3"
                        >
                            <h2 className="text-2xl font-black">
                                {section.heading}
                            </h2>
                            <p>
                                {section.text}{' '}
                                {section.source !== undefined && (
                                    <a
                                        className="resource-link text-sm"
                                        href={c.sources[section.source].url}
                                    >
                                        Fuente:{' '}
                                        {c.sources[section.source].label}.
                                    </a>
                                )}
                            </p>
                        </section>
                    ))}
                    <section className="space-y-3">
                        <h2 className="text-2xl font-black">
                            Preguntas frecuentes
                        </h2>
                        {c.faq.map(([question, answer]) => (
                            <details
                                key={question}
                                className="rounded-xl border bg-white p-5 dark:border-slate-700 dark:bg-slate-900"
                            >
                                <summary className="cursor-pointer font-bold">
                                    {question}
                                </summary>
                                <p className="mt-3">{answer}</p>
                            </details>
                        ))}
                    </section>
                    <section className="rounded-2xl bg-slate-900 p-7 text-white">
                        <h2 className="mb-3 text-2xl font-black">
                            Prueba un tema y decide con una experiencia real
                        </h2>
                        <p className="mb-5">
                            Abre una actividad de tu curso, consulta su
                            explicación o prepara una ficha. El catálogo de
                            Eduaroo se utiliza gratis y sin registro.
                        </p>
                        <Link
                            className="resource-button"
                            href={paths.primaria()}
                        >
                            Elegir curso →
                        </Link>
                    </section>
                    <section className="space-y-3">
                        <h2 className="text-2xl font-black">
                            Otras comparativas
                        </h2>
                        <ul className="space-y-2">
                            {comparisons
                                .filter((other) => other.slug !== c.slug)
                                .map((other) => (
                                    <li key={other.slug}>
                                        <Link
                                            className="resource-link"
                                            href={paths.comparison(other.slug)}
                                        >
                                            Eduaroo vs {other.name} →
                                        </Link>
                                    </li>
                                ))}
                        </ul>
                    </section>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                        Comparativa escrita por Eduaroo. Describe información
                        pública, no una prueba independiente de resultados.
                        Consulta{' '}
                        <Link href={paths.about()} className="underline">
                            quién está detrás del proyecto
                        </Link>
                        .
                    </p>
                </div>
            </article>
            <JsonLd
                data={[
                    {
                        '@type': 'Article',
                        headline: c.title,
                        description: c.description,
                        url: absoluteUrl(paths.comparison(c.slug)),
                        datePublished: RESOURCE_UPDATED.toISOString(),
                        dateModified: RESOURCE_UPDATED.toISOString(),
                        inLanguage: 'es',
                        author: {
                            '@type': 'Organization',
                            name: 'Eduaroo',
                            url: absoluteUrl(paths.about()),
                        },
                        publisher: {
                            '@type': 'Organization',
                            name: 'Eduaroo',
                            url: absoluteUrl('/'),
                        },
                    },
                    {
                        '@type': 'FAQPage',
                        mainEntity: c.faq.map(([question, answer]) => ({
                            '@type': 'Question',
                            name: question,
                            acceptedAnswer: { '@type': 'Answer', text: answer },
                        })),
                    },
                ]}
            />
        </>
    );
}
