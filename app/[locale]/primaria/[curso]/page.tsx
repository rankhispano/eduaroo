import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import BreadcrumbNav from '@/components/seo/BreadcrumbNav';
import { LomloeSection, Prose, RelatedLinks, UpdatedOn } from '@/components/seo/HubSections';
import JsonLd from '@/components/seo/JsonLd';
import { Link } from '@/i18n/navigation';
import AsignaturaCard from '@/src/components/AsignaturaCard';
import { getCatalogCurso } from '@/lib/seo/catalog';
import { getActivityPages, latest } from '@/lib/seo/content';
import { cursoIntro, lomloeItems, subjectName } from '@/lib/seo/hub-content';
import { buildMetadata } from '@/lib/seo/metadata';
import { ogImage } from '@/lib/seo/og-image';
import { cursoParams } from '@/lib/seo/params';
import { absoluteUrl, toSiteLocale } from '@/lib/seo/site';
import { parseCursoSlug } from '@/lib/seo/slugs';
import { templates } from '@/lib/seo/templates';
import { localize, paths } from '@/lib/seo/urls';

type Params = Promise<{ locale: string; curso: string }>;

export const dynamicParams = false;
export const generateStaticParams = cursoParams;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { locale, curso: slug } = await params;
    const cursoId = parseCursoSlug(slug);
    const data = cursoId ? getCatalogCurso(cursoId) : undefined;
    if (!cursoId || !data) return {};
    const l = toSiteLocale(locale);
    return buildMetadata({ locale: l, ...templates[l].curso(data), path: paths.curso(cursoId), image: ogImage.curso(l, cursoId) });
}

const copy = {
    es: {
        primaria: 'Primaria',
        h1: (n: number) => `Repaso de ${n}º de Primaria: ejercicios por asignatura`,
        subjects: (n: number) => `Asignaturas de ${n}º de Primaria`,
        topics: (n: number) => `Todos los temas de ${n}º de Primaria`,
        lomloe: (n: number) => `Qué se trabaja en ${n}º de Primaria según la LOMLOE`,
        others: 'Repaso de otros cursos de Primaria',
        topicsCount: (n: number) => `${n} ${n === 1 ? 'tema' : 'temas'}`,
        course: (n: number) => `Repaso de ${n}º de Primaria`,
    },
    en: {
        primaria: 'Primary',
        h1: (n: number) => `Primary ${n} revision: exercises by subject`,
        subjects: (n: number) => `Primary ${n} subjects`,
        topics: (n: number) => `All Primary ${n} topics`,
        lomloe: (n: number) => `What is covered in Primary ${n} under the LOMLOE`,
        others: 'Revision for other Primary years',
        topicsCount: (n: number) => `${n} ${n === 1 ? 'topic' : 'topics'}`,
        course: (n: number) => `Primary ${n} revision`,
    },
} as const;

export default async function CursoPage({ params }: { params: Params }) {
    const { locale, curso: slug } = await params;
    setRequestLocale(locale);
    const cursoId = parseCursoSlug(slug);
    const data = cursoId ? getCatalogCurso(cursoId) : undefined;
    if (!cursoId || !data) notFound();

    const l = toSiteLocale(locale);
    const t = copy[l];
    const n = data.grade;
    const pages = (await getActivityPages()).filter((p) => p.cursoId === cursoId);
    const updated = latest(pages.map((p) => p.lastModified));
    const withTopics = data.asignaturas.filter((a) => a.published.length > 0);
    const others = [n - 1, n + 1].filter((g) => g >= 1 && g <= 6).concat([1, 2, 3, 4, 5, 6].filter((g) => g !== n && Math.abs(g - n) > 1));

    return (
        <>
            <BreadcrumbNav locale={l} items={[{ name: t.primaria, path: paths.primaria() }, { name: data.curso.nombre }]} />
            <div className="min-h-screen bg-slate-50 px-5 py-8 text-slate-950 sm:px-8 lg:px-12 dark:bg-slate-950 dark:text-white">
                <div className="mx-auto max-w-6xl space-y-12">
                    <header className="space-y-5">
                        <h1 className="max-w-4xl text-4xl font-black tracking-normal sm:text-5xl">{t.h1(n)}</h1>
                        <UpdatedOn date={updated} locale={l} />
                        <Prose paragraphs={cursoIntro(data, l)} />
                    </header>

                    <section aria-labelledby="asignaturas-heading">
                        <h2 id="asignaturas-heading" className="mb-5 text-2xl font-black sm:text-3xl">
                            {t.subjects(n)}
                        </h2>
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {data.asignaturas.map((a) => (
                                <AsignaturaCard key={a.asignatura.id} cursoId={cursoId} asignatura={a.asignatura} />
                            ))}
                        </div>
                    </section>

                    <section aria-labelledby="temas-heading">
                        <h2 id="temas-heading" className="mb-5 text-2xl font-black sm:text-3xl">
                            {t.topics(n)}
                        </h2>
                        <div className="grid gap-6 md:grid-cols-2">
                            {withTopics.map((a) => (
                                <div key={a.asignatura.id} className="rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-900">
                                    <h3 className="mb-3 text-xl font-black">
                                        <Link href={paths.asignatura(cursoId, a.asignatura.id)} className="text-indigo-800 hover:underline dark:text-indigo-300">
                                            {subjectName(a, l)} {n}º
                                        </Link>{' '}
                                        <span className="text-base font-semibold text-slate-600 dark:text-slate-300">· {t.topicsCount(a.published.length)}</span>
                                    </h3>
                                    <ul className="space-y-2">
                                        {a.published.map(({ tema, set }) => (
                                            <li key={tema.id}>
                                                <Link
                                                    href={paths.tema(cursoId, a.asignatura.id, tema.id)}
                                                    className="plausible-event-name=Resource+click text-lg font-semibold text-slate-800 underline decoration-slate-300 underline-offset-4 hover:text-indigo-700 hover:decoration-indigo-400 dark:text-slate-100"
                                                >
                                                    {tema.nombre}
                                                </Link>
                                                <span className="ml-2 text-sm text-slate-600 dark:text-slate-300">
                                                    {l === 'es' ? `${set.activityCount} actividades` : `${set.activityCount} activities`}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>

                    <LomloeSection heading={t.lomloe(n)} items={lomloeItems(data, withTopics, l)} locale={l} />

                    <RelatedLinks heading={t.others} links={others.map((g) => ({ name: t.course(g), path: paths.curso(String(g)) }))} />
                </div>
            </div>
            <JsonLd
                data={{
                    '@type': 'CollectionPage',
                    name: templates[l].curso(data).title,
                    url: absoluteUrl(localize(l, paths.curso(cursoId))),
                    inLanguage: l === 'es' ? 'es-ES' : 'en-GB',
                    dateModified: updated.toISOString(),
                    isPartOf: { '@type': 'WebSite', url: absoluteUrl('/') },
                    hasPart: withTopics.map((a) => ({
                        '@type': 'WebPage',
                        name: `${subjectName(a, l)} ${n}º`,
                        url: absoluteUrl(localize(l, paths.asignatura(cursoId, a.asignatura.id))),
                    })),
                }}
            />
        </>
    );
}
