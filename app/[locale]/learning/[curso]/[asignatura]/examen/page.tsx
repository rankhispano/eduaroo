import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ExamBuilder from '@/components/activities/ExamBuilder';
import { ogImage } from '@/lib/seo/og-image';
import { getCatalogAsignatura, getCatalogCurso } from '@/lib/seo/catalog';
import { buildMetadata } from '@/lib/seo/metadata';
import { asignaturaParams } from '@/lib/seo/params';
import { toSiteLocale } from '@/lib/seo/site';
import { templates } from '@/lib/seo/templates';
import { paths } from '@/lib/seo/urls';
import { getAsignatura, getCurso } from '@/src/data/curriculum';
import { getPracticeSet } from '@/src/data/activityResources';

type Params = Promise<{ locale: string; curso: string; asignatura: string }>;

export const dynamicParams = false;
export const generateStaticParams = asignaturaParams;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { locale, curso, asignatura } = await params;
    const c = getCatalogCurso(curso);
    const a = getCatalogAsignatura(curso, asignatura);
    if (!c || !a) return {};
    const l = toSiteLocale(locale);
    // Herramienta sin contenido propio: se enlaza desde el hub de la asignatura pero no se indexa
    return buildMetadata({ locale: l, ...templates[l].examen(c, a), path: paths.examen(curso, asignatura), noindex: true, image: ogImage.asignatura(l, curso, asignatura) });
}

export default async function Page({ params }: { params: Params }) {
    const { curso, asignatura } = await params;
    const cursoData = getCurso(curso);
    const asignaturaData = getAsignatura(curso, asignatura);
    if (!cursoData || !asignaturaData) notFound();

    const temas = asignaturaData.temas.flatMap((tema) => {
        const set = getPracticeSet(curso, asignatura, tema.id);
        return set ? [{ id: tema.id, nombre: tema.nombre, key: set.key, count: set.activityCount }] : [];
    });

    return (
        <ExamBuilder
            cursoId={curso}
            cursoNombre={cursoData.nombre}
            asignaturaId={asignatura}
            asignaturaNombre={asignaturaData.nombre}
            color={asignaturaData.color}
            temas={temas}
        />
    );
}
