import { notFound, redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import {
    getActivitySets,
    getActivityLoaders,
} from '@/content/activities/registry';
import { cursoSlug, asignaturaSlug } from '@/lib/seo/slugs';
import { getWorksheetSummary } from '@/lib/resources/worksheets';
import { worksheetSeo } from '@/lib/resources/topics';
import { RESOURCE_UPDATED } from '@/lib/resources/catalog';
import { buildMetadata } from '@/lib/seo/metadata';
import { toSiteLocale, absoluteUrl } from '@/lib/seo/site';
import { paths } from '@/lib/seo/urls';
import { Link } from '@/i18n/navigation';
import Worksheet from '@/components/resources/Worksheet';
import BreadcrumbNav from '@/components/seo/BreadcrumbNav';
import JsonLd from '@/components/seo/JsonLd';
export const dynamicParams = false;
export function generateStaticParams() {
    return getActivitySets('es').map((s) => ({
        curso: cursoSlug(s.cursoId),
        asignatura: asignaturaSlug(s.asignaturaId),
        tema: s.temaId,
    }));
}
type Params = {
    locale: string;
    curso: string;
    asignatura: string;
    tema: string;
};
export async function generateMetadata({
    params,
}: {
    params: Promise<Params>;
}) {
    const p = await params;
    const set = getWorksheetSummary(p.curso, p.asignatura, p.tema);
    if (!set) return {};
    return buildMetadata({
        locale: toSiteLocale(p.locale),
        ...worksheetSeo(set),
        path: paths.worksheet(set.cursoId, set.asignaturaId, set.temaId),
    });
}
export default async function Page({ params }: { params: Promise<Params> }) {
    const p = await params;
    const summary = getWorksheetSummary(p.curso, p.asignatura, p.tema);
    if (!summary) notFound();
    const path = paths.worksheet(
        summary.cursoId,
        summary.asignaturaId,
        summary.temaId,
    );
    if (p.locale !== 'es') redirect(path);
    setRequestLocale(p.locale);
    const set = await getActivityLoaders('es')[summary.key]();
    return (
        <>
            <BreadcrumbNav
                locale="es"
                items={[
                    { name: 'Recursos', path: paths.resources() },
                    {
                        name: 'Fichas para imprimir',
                        path: paths.resource('fichas-para-imprimir'),
                    },
                    { name: `${summary.cursoId}º · ${summary.temaNombre}` },
                ]}
            />
            <article className="resource-page">
                <header className="resource-hero no-print">
                    <p className="resource-eyebrow">
                        Ficha gratis · {summary.cursoId}º de Primaria · A4
                    </p>
                    <h1>
                        {summary.temaNombre}: ficha de {summary.cursoId}º para
                        imprimir
                    </h1>
                    <p className="resource-lead">
                        {summary.summary} Esta ficha contiene{' '}
                        {summary.activityCount} actividades del tema, espacio
                        para responder y un solucionario que puedes añadir al
                        final.
                    </p>
                    <Link
                        href={paths.tema(
                            summary.cursoId,
                            summary.asignaturaId,
                            summary.temaId,
                        )}
                        className="resource-link"
                    >
                        Practicar este tema en pantalla →
                    </Link>
                </header>
                <div className="resource-body">
                    <Worksheet
                        sets={[set]}
                        heading={`${summary.temaNombre} · ${summary.cursoId}º de Primaria`}
                    />
                </div>
            </article>
            <JsonLd
                data={{
                    '@type': 'LearningResource',
                    name: `Ficha ${summary.cursoId}º: ${summary.temaNombre}`,
                    description: worksheetSeo(summary).description,
                    url: absoluteUrl(path),
                    inLanguage: 'es',
                    educationalLevel: `${summary.cursoId}º de Primaria`,
                    learningResourceType: 'Ficha imprimible',
                    teaches: summary.temaNombre,
                    audience: {
                        '@type': 'EducationalAudience',
                        educationalRole: 'student',
                    },
                    isAccessibleForFree: true,
                    datePublished: RESOURCE_UPDATED.toISOString(),
                    dateModified: RESOURCE_UPDATED.toISOString(),
                    publisher: {
                        '@type': 'Organization',
                        name: 'Eduaroo',
                        url: absoluteUrl('/'),
                    },
                }}
            />
        </>
    );
}
