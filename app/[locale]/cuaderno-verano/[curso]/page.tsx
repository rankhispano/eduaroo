import { notFound, redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getActivityLoaders } from '@/content/activities/registry';
import { parseCursoSlug, cursoSlug } from '@/lib/seo/slugs';
import { summerTopics } from '@/lib/resources/worksheets';
import { summerBookSeo } from '@/lib/resources/seo';
import { buildMetadata } from '@/lib/seo/metadata';
import { toSiteLocale, absoluteUrl } from '@/lib/seo/site';
import { paths } from '@/lib/seo/urls';
import { RESOURCE_UPDATED } from '@/lib/resources/catalog';
import { Link } from '@/i18n/navigation';
import Worksheet from '@/components/resources/Worksheet';
import BreadcrumbNav from '@/components/seo/BreadcrumbNav';
import JsonLd from '@/components/seo/JsonLd';
export const dynamicParams = false;
export function generateStaticParams() {
    return Object.keys(summerTopics).map((g) => ({ curso: cursoSlug(g) }));
}
export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string; curso: string }>;
}) {
    const { locale, curso } = await params;
    const grade = parseCursoSlug(curso);
    if (!grade) return {};
    return buildMetadata({
        locale: toSiteLocale(locale),
        ...summerBookSeo(grade),
        path: paths.summerBook(grade),
    });
}
export default async function Page({
    params,
}: {
    params: Promise<{ locale: string; curso: string }>;
}) {
    const { locale, curso } = await params;
    const grade = parseCursoSlug(curso);
    if (!grade) notFound();
    if (locale !== 'es') redirect(paths.summerBook(grade));
    setRequestLocale(locale);
    const sets = await Promise.all(
        summerTopics[grade].map((key) =>
            getActivityLoaders('es')[`${grade}/${key}`](),
        ),
    );
    const title = `Cuaderno de verano de ${grade}º de Primaria`;
    return (
        <>
            <BreadcrumbNav
                locale="es"
                items={[
                    { name: 'Recursos', path: paths.resources() },
                    {
                        name: 'Cuaderno de verano',
                        path: paths.resource('cuaderno-verano'),
                    },
                    { name: `${grade}º de Primaria` },
                ]}
            />
            <article className="resource-page">
                <header className="resource-hero no-print">
                    <p className="resource-eyebrow">
                        Papel, lápiz y tiempo para pensar · Gratis
                    </p>
                    <h1>{title}</h1>
                    <p className="resource-lead">
                        Una selección de cuatro temas del curso terminado:{' '}
                        {sets.map((s) => s.temaNombre).join(', ')}. Elige si
                        quieres incluir las ideas clave y las soluciones, e
                        imprime las páginas que vayas a utilizar.
                    </p>
                    <Link href={paths.curso(grade)} className="resource-link">
                        Ver todos los temas de {grade}º →
                    </Link>
                </header>
                <div className="resource-body">
                    <Worksheet sets={sets} heading={title} />
                </div>
            </article>
            <JsonLd
                data={{
                    '@type': 'LearningResource',
                    name: title,
                    description: summerBookSeo(grade).description,
                    url: absoluteUrl(paths.summerBook(grade)),
                    inLanguage: 'es',
                    educationalLevel: `${grade}º de Primaria`,
                    learningResourceType: 'Cuaderno imprimible',
                    teaches: sets.map((s) => s.temaNombre),
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
