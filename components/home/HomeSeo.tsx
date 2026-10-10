import { Link } from '@/i18n/navigation';
import JsonLd, { type JsonLdNode } from '@/components/seo/JsonLd';
import { Prose, UpdatedOn } from '@/components/seo/HubSections';
import { getCatalog } from '@/lib/seo/catalog';
import { getActivityPages, latest } from '@/lib/seo/content';
import { absoluteUrl, contactEmail, legalName, type SiteLocale, siteName } from '@/lib/seo/site';
import { localize, paths } from '@/lib/seo/urls';

const copy = {
    es: {
        h1: 'Recursos de repaso de Primaria, de 1º a 6º, según la LOMLOE',
        intro: (topics: number, activities: number) => [
            `Eduaroo es un portal gratuito de repaso para Educación Primaria. Reúne ${topics} temas con ${activities} actividades interactivas de Lengua Castellana, Matemáticas, Ciencias Naturales, Ciencias Sociales e Inglés, organizados de 1º a 6º y alineados con los criterios de evaluación de la LOMLOE.`,
            'Está pensado para que los niños practiquen lo que han aprendido en el colegio y para que las familias y los docentes encuentren con rapidez los ejercicios del curso y la asignatura que necesitan. Cada actividad se corrige al momento y explica la respuesta.',
            'Elige tu curso para ver las asignaturas y los temas disponibles. También hay juegos educativos para practicar cálculo, lectura, mecanografía o la hora de forma divertida.',
        ],
        coursesHeading: 'Repaso de Primaria por cursos',
        course: (n: number) => `Repaso de ${n}º de Primaria`,
        courseMeta: (subjects: number, topics: number) => `${subjects} asignaturas · ${topics} temas`,
        gamesHeading: 'Juegos educativos',
        gamesText: 'Además del repaso por cursos, Eduaroo incluye juegos educativos gratuitos para practicar de forma divertida.',
        gamesLink: 'Ver los juegos educativos de Primaria',
    },
    en: {
        h1: 'Primary school revision resources, years 1 to 6, aligned with the LOMLOE',
        intro: (topics: number, activities: number) => [
            `Eduaroo is a free revision portal for Spanish Primary Education. It gathers ${topics} topics with ${activities} interactive activities in Spanish Language, Mathematics, Natural Sciences, Social Sciences and English, organised from Primary 1 to 6 and aligned with the LOMLOE evaluation criteria.`,
            'It is designed for children to practise what they have learnt at school, and for families and teachers to quickly find exercises for the year and subject they need. Every activity is marked instantly and explains the answer.',
            'Pick your year to see the available subjects and topics. There are also educational games to practise calculation, reading, typing or telling the time in a fun way.',
        ],
        coursesHeading: 'Primary revision by year',
        course: (n: number) => `Primary ${n} revision`,
        courseMeta: (subjects: number, topics: number) => `${subjects} subjects · ${topics} topics`,
        gamesHeading: 'Educational games',
        gamesText: 'Besides revision by year, Eduaroo includes free educational games to practise in a fun way.',
        gamesLink: 'See the educational games for primary school',
    },
} as const;

// Contenido de la portada servido en el HTML (la parte interactiva "Mi mapa" se hidrata en cliente)
export default async function HomeSeo({ locale }: { locale: SiteLocale }) {
    const t = copy[locale];
    const catalog = getCatalog(locale);
    const pages = await getActivityPages(locale);
    const updated = latest(pages.map((p) => p.lastModified));
    const topics = catalog.reduce((sum, c) => sum + c.publishedCount, 0);
    const activities = catalog.reduce((sum, c) => sum + c.activityCount, 0);
    const inLanguage = locale === 'es' ? 'es-ES' : 'en-GB';

    return (
        <>
            <section className="bg-slate-50 px-5 py-14 text-slate-950 dark:bg-slate-950 dark:text-white sm:px-8 lg:px-12" aria-labelledby="home-h1">
                <div className="mx-auto max-w-6xl space-y-10">
                    <header className="space-y-5">
                        <h1 id="home-h1" className="max-w-4xl text-3xl font-black tracking-normal sm:text-5xl">
                            {t.h1}
                        </h1>
                        <UpdatedOn date={updated} locale={locale} />
                        <Prose paragraphs={[...t.intro(topics, activities)]} />
                    </header>

                    <section aria-labelledby="home-cursos">
                        <h2 id="home-cursos" className="mb-5 text-2xl font-black sm:text-3xl">
                            {t.coursesHeading}
                        </h2>
                        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {catalog.map((c) => (
                                <li key={c.curso.id}>
                                    <Link
                                        href={paths.curso(c.curso.id)}
                                        className="block rounded-2xl border-2 border-slate-100 bg-white p-4 transition hover:border-indigo-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                                    >
                                        <span className="block text-xl font-black text-indigo-800 dark:text-indigo-300">{t.course(c.grade)}</span>
                                        <span className="block text-sm font-semibold text-slate-600 dark:text-slate-300">
                                            {t.courseMeta(c.asignaturas.filter((a) => a.published.length > 0).length, c.publishedCount)}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section aria-labelledby="home-juegos" className="max-w-3xl space-y-3">
                        <h2 id="home-juegos" className="text-2xl font-black sm:text-3xl">
                            {t.gamesHeading}
                        </h2>
                        <p className="text-lg text-slate-700 dark:text-slate-200">{t.gamesText}</p>
                        <Link href={paths.games()} className="text-lg font-bold text-indigo-800 underline dark:text-indigo-300">
                            {t.gamesLink}
                        </Link>
                    </section>
                </div>
            </section>
            <JsonLd data={homeGraph(locale, inLanguage)} />
        </>
    );
}

// Organization + WebSite (sin SearchAction: no hay buscador interno indexable)
function homeGraph(locale: SiteLocale, inLanguage: string): JsonLdNode[] {
    const url = absoluteUrl(localize(locale, paths.home()));
    return [
        {
            '@type': 'Organization',
            '@id': `${absoluteUrl('/')}#organization`,
            name: siteName,
            legalName,
            url: absoluteUrl('/'),
            logo: absoluteUrl('/icons/icon-512.png'),
            email: contactEmail,
        },
        {
            '@type': 'WebSite',
            '@id': `${absoluteUrl('/')}#website`,
            name: siteName,
            url,
            inLanguage,
            publisher: { '@id': `${absoluteUrl('/')}#organization` },
        },
    ];
}
