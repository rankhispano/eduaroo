import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import ExamBuilder from '@/components/activities/ExamBuilder';
import BreadcrumbNav from '@/components/seo/BreadcrumbNav';
import { getCatalogAsignatura, getCatalogCurso } from '@/lib/seo/catalog';
import { subjectName } from '@/lib/seo/hub-content';
import { buildMetadata } from '@/lib/seo/metadata';
import { ogImage } from '@/lib/seo/og-image';
import { asignaturaParams } from '@/lib/seo/params';
import { toSiteLocale } from '@/lib/seo/site';
import { parseAsignaturaSlug, parseCursoSlug } from '@/lib/seo/slugs';
import { templates } from '@/lib/seo/templates';
import { paths } from '@/lib/seo/urls';

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
    // Herramienta sin contenido propio: se enlaza desde el hub de la asignatura pero no se indexa
    return buildMetadata({
        locale: l,
        ...templates[l].examen(found.c, found.a),
        path: paths.examen(found.cursoId, found.asignaturaId),
        noindex: true,
        image: ogImage.asignatura(l, found.cursoId, found.asignaturaId),
    });
}

export default async function Page({ params }: { params: Params }) {
    const { locale, ...slugs } = await params;
    setRequestLocale(locale);
    const found = resolve(slugs);
    if (!found) notFound();

    const { cursoId, asignaturaId, c, a } = found;
    const l = toSiteLocale(locale);
    const temas = a.published.map(({ tema, set }) => ({ id: tema.id, nombre: tema.nombre, key: set.key, count: set.activityCount }));

    return (
        <>
            <BreadcrumbNav
                locale={l}
                items={[
                    { name: l === 'es' ? 'Primaria' : 'Primary', path: paths.primaria() },
                    { name: c.curso.nombre, path: paths.curso(cursoId) },
                    { name: subjectName(a, l), path: paths.asignatura(cursoId, asignaturaId) },
                    { name: l === 'es' ? 'Prepara tu examen' : 'Prepare your test' },
                ]}
            />
            <ExamBuilder
                cursoId={cursoId}
                cursoNombre={c.curso.nombre}
                asignaturaId={asignaturaId}
                asignaturaNombre={a.asignatura.nombre}
                color={a.asignatura.color}
                temas={temas}
            />
        </>
    );
}
