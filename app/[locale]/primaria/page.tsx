import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import BreadcrumbNav from '@/components/seo/BreadcrumbNav';
import { Prose, RelatedLinks, UpdatedOn } from '@/components/seo/HubSections';
import JsonLd from '@/components/seo/JsonLd';
import CursoCard from '@/src/components/CursoCard';
import { getCatalog } from '@/lib/seo/catalog';
import { getActivityPages, latest } from '@/lib/seo/content';
import { buildMetadata } from '@/lib/seo/metadata';
import { absoluteUrl, toSiteLocale } from '@/lib/seo/site';
import { templates } from '@/lib/seo/templates';
import { localize, paths } from '@/lib/seo/urls';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await props.params;
    const l = toSiteLocale(locale);
    return buildMetadata({ locale: l, ...templates[l].cursos(), path: paths.primaria() });
}

const copy = {
    es: {
        crumb: 'Primaria',
        kicker: '¡A practicar!',
        h1: 'Repaso de Primaria por cursos, de 1º a 6º',
        prompt: '¿En qué curso estás? Elige tu curso y encuentra lo que estás dando en clase para practicarlo jugando.',
        intro: [
            'Eduaroo reúne ejercicios de repaso de Educación Primaria organizados por curso y asignatura: Lengua Castellana, Matemáticas, Ciencias Naturales, Ciencias Sociales e Inglés.',
            'Cada curso tiene su propia página con los temas que se pueden practicar, una explicación de lo que se trabaja según la LOMLOE y enlaces directos a cada actividad.',
        ],
        listHeading: 'Elige tu curso',
        subjects: 'asignaturas',
        level: 'Primaria',
        courseLink: (n: number) => `Repaso de ${n}º de Primaria`,
    },
    en: {
        crumb: 'Primary',
        kicker: "Let's practise!",
        h1: 'Primary school revision by year, 1 to 6',
        prompt: 'Which year are you in? Pick your year and find what you are learning in class to practise it by playing.',
        intro: [
            'Eduaroo gathers Primary Education revision exercises organised by year and subject: Spanish Language, Mathematics, Natural Sciences, Social Sciences and English.',
            'Each year has its own page with the topics you can practise, an explanation of what is covered under the LOMLOE and direct links to every activity.',
        ],
        listHeading: 'Pick your year',
        subjects: 'subjects',
        level: 'Primary',
        courseLink: (n: number) => `Primary ${n} revision`,
    },
} as const;

export default async function PrimariaPage(props: { params: Promise<{ locale: string }> }) {
    const { locale } = await props.params;
    setRequestLocale(locale);
    const l = toSiteLocale(locale);
    const t = copy[l];
    const catalog = getCatalog(l);
    const updated = latest((await getActivityPages(l)).map((p) => p.lastModified));

    return (
        <>
            <BreadcrumbNav locale={l} items={[{ name: t.crumb }]} />
            <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50 px-5 py-8 text-slate-950 sm:px-8 lg:px-12">
                <div className="mx-auto max-w-6xl space-y-10">
                    <header className="rounded-3xl bg-white p-7 shadow-sm sm:p-9">
                        <p className="mb-3 text-lg font-extrabold text-indigo-700">{t.kicker}</p>
                        <h1 className="max-w-3xl text-4xl font-black tracking-normal sm:text-5xl">{t.h1}</h1>
                        <p className="mt-4 max-w-2xl text-xl font-semibold text-slate-700">{t.prompt}</p>
                        <div className="mt-6">
                            <Prose paragraphs={[...t.intro]} />
                        </div>
                        <div className="mt-6">
                            <UpdatedOn date={updated} locale={l} />
                        </div>
                    </header>

                    <section aria-labelledby="cursos-heading">
                        <h2 id="cursos-heading" className="sr-only">
                            {t.listHeading}
                        </h2>
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {catalog.map((c) => (
                                <CursoCard key={c.curso.id} curso={c.curso} levelLabel={t.level} subjectsLabel={t.subjects} />
                            ))}
                        </div>
                    </section>

                    <RelatedLinks
                        heading={t.listHeading}
                        links={catalog.map((c) => ({ name: t.courseLink(c.grade), path: paths.curso(c.curso.id) }))}
                    />
                </div>
            </div>
            <JsonLd
                data={{
                    '@type': 'CollectionPage',
                    name: templates[l].cursos().title,
                    url: absoluteUrl(localize(l, paths.primaria())),
                    inLanguage: l === 'es' ? 'es-ES' : 'en-GB',
                    hasPart: catalog.map((c) => ({ '@type': 'WebPage', name: t.courseLink(c.grade), url: absoluteUrl(localize(l, paths.curso(c.curso.id))) })),
                }}
            />
        </>
    );
}
