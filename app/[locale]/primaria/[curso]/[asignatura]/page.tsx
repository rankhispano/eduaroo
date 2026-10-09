import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import TemaPath from '@/components/map/TemaPath';
import BreadcrumbNav from '@/components/seo/BreadcrumbNav';
import { LomloeSection, Prose, RelatedLinks, UpdatedOn } from '@/components/seo/HubSections';
import JsonLd from '@/components/seo/JsonLd';
import { Link } from '@/i18n/navigation';
import { catalog, getCatalogAsignatura, getCatalogCurso } from '@/lib/seo/catalog';
import { getActivityPages, latest } from '@/lib/seo/content';
import { asignaturaIntro, lomloeItems, subjectName } from '@/lib/seo/hub-content';
import { buildMetadata } from '@/lib/seo/metadata';
import { ogImage } from '@/lib/seo/og-image';
import { asignaturaParams } from '@/lib/seo/params';
import { absoluteUrl, toSiteLocale } from '@/lib/seo/site';
import { parseAsignaturaSlug, parseCursoSlug } from '@/lib/seo/slugs';
import { templates } from '@/lib/seo/templates';
import { localize, paths } from '@/lib/seo/urls';
import { getPracticeSet, withGeneratedActivities } from '@/src/data/activityResources';
import { REGIONS } from '@/src/data/regions';

type Params = Promise<{ locale: string; curso: string; asignatura: string }>;

export const dynamicParams = false;
export const generateStaticParams = asignaturaParams;

function resolve(slugs: { curso: string; asignatura: string }) {
    const cursoId = parseCursoSlug(slugs.curso);
    const asignaturaId = parseAsignaturaSlug(slugs.asignatura);
    const c = cursoId ? getCatalogCurso(cursoId) : undefined;
    const a = cursoId && asignaturaId ? getCatalogAsignatura(cursoId, asignaturaId) : undefined;
    return cursoId && asignaturaId && c && a ? { cursoId, asignaturaId, c, a } : undefined;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { locale, ...slugs } = await params;
    const found = resolve(slugs);
    if (!found) return {};
    const l = toSiteLocale(locale);
    return buildMetadata({
        locale: l,
        ...templates[l].asignatura(found.c, found.a),
        path: paths.asignatura(found.cursoId, found.asignaturaId),
        image: ogImage.asignatura(l, found.cursoId, found.asignaturaId),
    });
}

const copy = {
    es: {
        primaria: 'Primaria',
        about: (name: string, n: number) => `${name} de ${n}º de Primaria: qué vas a repasar`,
        topics: (name: string, n: number) => `Temas de ${name} de ${n}º de Primaria`,
        minutes: (n: number) => `${n} min`,
        activities: (n: number) => `${n} actividades`,
        soon: 'Próximamente',
        exam: (name: string, n: number) => `Prepara tu examen de ${name} de ${n}º de Primaria`,
        lomloe: (name: string, n: number) => `Qué se trabaja en ${name} de ${n}º según la LOMLOE`,
        sameSubject: (name: string) => `${name} en otros cursos`,
        sameSubjectLink: (name: string, g: number) => `${name} de ${g}º de Primaria`,
        sameCourse: (n: number) => `Otras asignaturas de ${n}º de Primaria`,
        courseLink: (n: number) => `Repaso de ${n}º de Primaria`,
    },
    en: {
        primaria: 'Primary',
        about: (name: string, n: number) => `${name}, Primary ${n}: what you will revise`,
        topics: (name: string, n: number) => `${name} topics for Primary ${n}`,
        minutes: (n: number) => `${n} min`,
        activities: (n: number) => `${n} activities`,
        soon: 'Coming soon',
        exam: (name: string, n: number) => `Prepare your ${name} test, Primary ${n}`,
        lomloe: (name: string, n: number) => `What ${name} covers in Primary ${n} under the LOMLOE`,
        sameSubject: (name: string) => `${name} in other years`,
        sameSubjectLink: (name: string, g: number) => `${name}, Primary ${g}`,
        sameCourse: (n: number) => `Other Primary ${n} subjects`,
        courseLink: (n: number) => `Primary ${n} revision`,
    },
} as const;

export default async function AsignaturaPage({ params }: { params: Params }) {
    const { locale, ...slugs } = await params;
    setRequestLocale(locale);
    const found = resolve(slugs);
    if (!found) notFound();

    const { cursoId, asignaturaId, c, a } = found;
    const l = toSiteLocale(locale);
    const t = copy[l];
    const n = c.grade;
    const name = subjectName(a, l);
    const region = REGIONS[a.asignatura.id];
    const temas = withGeneratedActivities(cursoId, asignaturaId, a.asignatura.temas, '/learning');
    const pages = (await getActivityPages()).filter((p) => p.cursoId === cursoId && p.asignaturaId === asignaturaId);
    const updated = latest(pages.map((p) => p.lastModified));

    const sameSubject = catalog.filter((o) => o.curso.id !== cursoId && o.asignaturas.some((x) => x.asignatura.id === asignaturaId && x.published.length > 0));
    const sameCourse = c.asignaturas.filter((x) => x.asignatura.id !== asignaturaId && x.published.length > 0);

    return (
        <>
            <BreadcrumbNav
                locale={l}
                items={[
                    { name: t.primaria, path: paths.primaria() },
                    { name: c.curso.nombre, path: paths.curso(cursoId) },
                    { name },
                ]}
            />
            <TemaPath
                cursoId={cursoId}
                cursoNombre={c.curso.nombre}
                asignaturaId={asignaturaId}
                asignaturaNombre={a.asignatura.nombre}
                color={a.asignatura.color}
                region={region.region}
                mascotImage={region.image}
                temas={temas}
                practiceTemaIds={a.asignatura.temas.filter((x) => getPracticeSet(cursoId, asignaturaId, x.id)).map((x) => x.id)}
            />

            <div className="mx-auto max-w-5xl space-y-12 px-4 pb-20 pt-4 text-slate-950 dark:text-white">
                <section aria-labelledby="about-heading" className="space-y-4">
                    <h2 id="about-heading" className="text-2xl font-black sm:text-3xl">
                        {t.about(name, n)}
                    </h2>
                    <UpdatedOn date={updated} locale={l} />
                    <Prose paragraphs={asignaturaIntro(c, a, l)} />
                </section>

                <section aria-labelledby="topics-heading">
                    <h2 id="topics-heading" className="mb-5 text-2xl font-black sm:text-3xl">
                        {t.topics(name, n)}
                    </h2>
                    <ul className="space-y-3">
                        {a.temas.map(({ tema, set }) => (
                            <li key={tema.id} className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900">
                                {set ? (
                                    <>
                                        <Link href={paths.tema(cursoId, asignaturaId, tema.id)} className="text-xl font-extrabold text-indigo-800 hover:underline dark:text-indigo-300">
                                            {tema.nombre}
                                        </Link>
                                        <p className="mt-1 text-base text-slate-700 dark:text-slate-200">{set.summary}</p>
                                        <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
                                            {t.activities(set.activityCount)} · {t.minutes(set.estimatedMinutes)}
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-xl font-extrabold text-slate-600 dark:text-slate-300">
                                        {tema.nombre} <span className="text-sm font-semibold">· {t.soon}</span>
                                    </p>
                                )}
                            </li>
                        ))}
                    </ul>
                    {a.published.length > 0 ? (
                        <p className="mt-5">
                            <Link href={paths.examen(cursoId, asignaturaId)} className="text-lg font-bold text-indigo-800 underline dark:text-indigo-300">
                                {t.exam(name, n)}
                            </Link>
                        </p>
                    ) : null}
                </section>

                <LomloeSection heading={t.lomloe(name, n)} items={lomloeItems(c, [a], l)} locale={l} />

                <RelatedLinks heading={t.sameCourse(n)} links={[
                    { name: t.courseLink(n), path: paths.curso(cursoId) },
                    ...sameCourse.map((x) => ({ name: t.sameSubjectLink(subjectName(x, l), n), path: paths.asignatura(cursoId, x.asignatura.id) })),
                ]} />
                <RelatedLinks
                    heading={t.sameSubject(name)}
                    links={sameSubject.map((o) => ({ name: t.sameSubjectLink(name, o.grade), path: paths.asignatura(o.curso.id, asignaturaId) }))}
                />
            </div>
            <JsonLd
                data={{
                    '@type': 'CollectionPage',
                    name: templates[l].asignatura(c, a).title,
                    url: absoluteUrl(localize(l, paths.asignatura(cursoId, asignaturaId))),
                    inLanguage: l === 'es' ? 'es-ES' : 'en-GB',
                    dateModified: updated.toISOString(),
                    isPartOf: { '@type': 'WebPage', url: absoluteUrl(localize(l, paths.curso(cursoId))) },
                    hasPart: a.published.map(({ tema }) => ({
                        '@type': 'WebPage',
                        name: tema.nombre,
                        url: absoluteUrl(localize(l, paths.tema(cursoId, asignaturaId, tema.id))),
                    })),
                }}
            />
        </>
    );
}
