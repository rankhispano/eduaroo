import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import ActivityPlayer from '@/components/activities/ActivityPlayer';
import BreadcrumbNav from '@/components/seo/BreadcrumbNav';
import { RelatedLinks, UpdatedOn } from '@/components/seo/HubSections';
import { ACTIVITY_LOADERS } from '@/content/activities/registry';
import { getCriterion } from '@/lib/curriculum/lomloe';
import { getCatalogAsignatura, getCatalogCurso } from '@/lib/seo/catalog';
import { getActivityPages } from '@/lib/seo/content';
import { subjectName } from '@/lib/seo/hub-content';
import { buildMetadata } from '@/lib/seo/metadata';
import { ogImage } from '@/lib/seo/og-image';
import { temaParams } from '@/lib/seo/params';
import { relatedForTema } from '@/lib/seo/related';
import { toSiteLocale } from '@/lib/seo/site';
import { parseAsignaturaSlug, parseCursoSlug } from '@/lib/seo/slugs';
import { templates } from '@/lib/seo/templates';
import { paths } from '@/lib/seo/urls';

type Params = Promise<{ locale: string; curso: string; asignatura: string; tema: string }>;

export const dynamicParams = false;
export const generateStaticParams = temaParams;

async function resolve(slugs: { curso: string; asignatura: string; tema: string }) {
    const cursoId = parseCursoSlug(slugs.curso);
    const asignaturaId = parseAsignaturaSlug(slugs.asignatura);
    if (!cursoId || !asignaturaId) return undefined;
    const c = getCatalogCurso(cursoId);
    const a = getCatalogAsignatura(cursoId, asignaturaId);
    const summary = (await getActivityPages()).find((s) => s.key === `${cursoId}/${asignaturaId}/${slugs.tema}`);
    const temaNombre = a?.temas.find((x) => x.tema.id === slugs.tema)?.tema.nombre;
    return c && a && summary && temaNombre ? { cursoId, asignaturaId, temaId: slugs.tema, c, a, summary, temaNombre } : undefined;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { locale, ...slugs } = await params;
    const found = await resolve(slugs);
    if (!found) return {};
    const l = toSiteLocale(locale);

    return buildMetadata({
        locale: l,
        ...templates[l].tema(found.c, found.a, found.temaNombre, found.summary.summary, found.summary.activityCount),
        path: paths.tema(found.cursoId, found.asignaturaId, found.temaId),
        image: ogImage.asignatura(l, found.cursoId, found.asignaturaId),
        type: 'article',
        modified: found.summary.lastModified,
    });
}

const copy = {
    es: {
        primaria: 'Primaria',
        related: 'Sigue practicando',
        hubs: (name: string, n: number) => ({ subject: `Todos los temas de ${name} de ${n}º de Primaria`, course: `Repaso de ${n}º de Primaria` }),
    },
    en: {
        primaria: 'Primary',
        related: 'Keep practising',
        hubs: (name: string, n: number) => ({ subject: `All ${name} topics for Primary ${n}`, course: `Primary ${n} revision` }),
    },
} as const;

export default async function TemaPage({ params }: { params: Params }) {
    const { locale, ...slugs } = await params;
    setRequestLocale(locale);
    const found = await resolve(slugs);
    const loader = found ? ACTIVITY_LOADERS[found.summary.key] : undefined;
    if (!found || !loader) notFound();

    const { cursoId, asignaturaId, temaId, c, a, summary, temaNombre } = found;
    const l = toSiteLocale(locale);
    const t = copy[l];
    const name = subjectName(a, l);

    const set = await loader();
    const criteria = set.lomloe.criteria.map((id) => ({
        id,
        text: getCriterion(set.lomloe.area, set.lomloe.cycle, id)?.text ?? '',
    }));

    const hubs = t.hubs(name, c.grade);
    const related = [
        { name: hubs.subject, path: paths.asignatura(cursoId, asignaturaId) },
        { name: hubs.course, path: paths.curso(cursoId) },
        ...relatedForTema(cursoId, asignaturaId, temaId, l),
    ];

    return (
        <>
            <BreadcrumbNav
                locale={l}
                items={[
                    { name: t.primaria, path: paths.primaria() },
                    { name: c.curso.nombre, path: paths.curso(cursoId) },
                    { name, path: paths.asignatura(cursoId, asignaturaId) },
                    { name: temaNombre },
                ]}
            />
            <ActivityPlayer
                set={set}
                color={a.asignatura.color}
                subjectName={a.asignatura.nombre}
                cursoNombre={c.curso.nombre}
                backHref={paths.asignatura(cursoId, asignaturaId)}
                criteria={criteria}
                extras={a.asignatura.temas.find((x) => x.id === temaId)?.recursos ?? []}
            />
            <div className="mx-auto max-w-4xl space-y-8 px-4 pb-20 pt-4 text-slate-950 dark:text-white">
                <UpdatedOn date={summary.lastModified} locale={l} />
                <RelatedLinks heading={t.related} links={related} />
            </div>
        </>
    );
}
