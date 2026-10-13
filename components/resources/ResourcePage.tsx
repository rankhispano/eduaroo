import SummerPlan from './SummerPlan';
import type { ResourceGuide } from '@/lib/resources/catalog';
import { getResourceGuide, RESOURCE_UPDATED } from '@/lib/resources/catalog';
import {
    selectResourceTopics,
    getPracticeQuestions,
} from '@/lib/resources/topics';
import { paths } from '@/lib/seo/urls';
import { absoluteUrl } from '@/lib/seo/site';
import { Link } from '@/i18n/navigation';
import BreadcrumbNav from '@/components/seo/BreadcrumbNav';
import JsonLd from '@/components/seo/JsonLd';
import ResourceTool from './ResourceTool';
import TopicBrowser from './TopicBrowser';
import ResourceQuiz from './ResourceQuiz';
import ResourceCards from './ResourceCards';
import { getActivitySets } from '@/content/activities/registry';
export default async function ResourcePage({
    guide,
}: {
    guide: ResourceGuide;
}) {
    const topics = selectResourceTopics(guide);
    const assessment = guide.tool === 'assessment';
    const needsQuestions =
        assessment || (!guide.tool && guide.slug !== 'fichas-para-imprimir');
    const questions = needsQuestions
        ? await getPracticeQuestions(
              assessment
                  ? getActivitySets('es').filter(
                        (s) =>
                            s.asignaturaId === 'mates' ||
                            s.asignaturaId === 'lengua',
                    )
                  : topics,
              assessment ? 8 : 4,
          )
        : [];
    return (
        <>
            <BreadcrumbNav
                locale="es"
                items={[
                    { name: 'Recursos gratis', path: paths.resources() },
                    { name: guide.label },
                ]}
            />
            <article className="resource-page">
                <header className="resource-hero no-print">
                    <p className="resource-eyebrow">
                        {guide.icon} {guide.group} · {guide.ages}
                    </p>
                    <h1>{guide.title}</h1>
                    <p className="resource-lead">{guide.intro}</p>
                    <div className="flex flex-wrap gap-3">
                        <a
                            href={guide.tool ? '#herramienta' : '#temas'}
                            className="resource-button"
                        >
                            {guide.tool
                                ? 'Empezar ahora'
                                : 'Elegir una actividad'}{' '}
                            →
                        </a>
                        <Link
                            className="resource-button-secondary"
                            href={paths.resource('fichas-para-imprimir')}
                        >
                            Fichas con soluciones
                        </Link>
                    </div>
                    <p className="mt-5 text-sm text-slate-600 dark:text-slate-300">
                        Gratis · Sin registro · Contenido de Eduaroo ·
                        Actualizado el{' '}
                        <time dateTime="2026-10-13">13 de octubre de 2026</time>
                    </p>
                </header>
                <div className="resource-body">
                    {guide.tool && (
                        <div id="herramienta" className="scroll-mt-24">
                            <ResourceTool guide={guide} />
                            {assessment && (
                                <ResourceQuiz
                                    questions={questions}
                                    assessment
                                />
                            )}
                        </div>
                    )}
                    {!guide.tool &&
                        guide.slug !== 'fichas-para-imprimir' &&
                        questions.length > 0 && (
                            <ResourceQuiz questions={questions} />
                        )}
                    <section className="no-print grid gap-6 md:grid-cols-2">
                        <div className="rounded-2xl bg-white p-6 dark:bg-slate-900">
                            <h2 className="mb-4 text-2xl font-black">
                                Cómo trabajarlo paso a paso
                            </h2>
                            <ol className="list-decimal space-y-4 pl-5">
                                {guide.steps.map((step) => (
                                    <li key={step}>{step}</li>
                                ))}
                            </ol>
                        </div>
                        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-6 text-slate-900">
                            <h2 className="mb-4 text-2xl font-black">
                                Un ejemplo resuelto
                            </h2>
                            <p className="mb-3">{guide.example[0]}</p>
                            <p className="mb-3 text-2xl font-black text-sky-800">
                                {guide.example[1]}
                            </p>
                            <p>{guide.example[2]}</p>
                        </div>
                    </section>
                    <aside className="no-print rounded-xl border-l-4 border-amber-500 bg-amber-50 p-5 text-slate-900">
                        <h2 className="mb-2 text-lg font-bold">
                            Para acompañar la práctica
                        </h2>
                        <p>{guide.pitfall}</p>
                    </aside>
                    {guide.slug === 'repaso-verano' && <SummerPlan />}
                    {topics.length > 0 && (
                        <TopicBrowser
                            topics={topics}
                            printFirst={guide.slug === 'fichas-para-imprimir'}
                        />
                    )}
                    {assessment && (
                        <Link
                            href={paths.resource('juegos-para-ninos-de-5-anos')}
                            className="resource-link no-print"
                        >
                            Para empezar 1º: conteo y formas →
                        </Link>
                    )}
                    <section className="no-print space-y-3">
                        <h2 className="text-2xl font-black">
                            Preguntas frecuentes
                        </h2>
                        {guide.faq.map(([question, answer]) => (
                            <details
                                key={question}
                                className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
                            >
                                <summary className="cursor-pointer font-bold">
                                    {question}
                                </summary>
                                <p className="mt-3">{answer}</p>
                            </details>
                        ))}
                    </section>
                    <section className="no-print space-y-5">
                        <h2 className="text-2xl font-black">
                            Recursos que conectan con este tema
                        </h2>
                        <ResourceCards
                            guides={guide.related
                                .map(getResourceGuide)
                                .filter(
                                    (g): g is ResourceGuide => g !== undefined,
                                )}
                        />
                    </section>
                    <p className="no-print text-sm text-slate-600 dark:text-slate-300">
                        Los temas del catálogo toman como referencia el
                        currículo español de Primaria. La selección por curso es
                        orientativa y puede variar entre centros. Consulta{' '}
                        <Link href={paths.about()} className="underline">
                            cómo se prepara el contenido de Eduaroo
                        </Link>{' '}
                        y{' '}
                        <a
                            href="https://www.boe.es/buscar/act.php?id=BOE-A-2022-3296"
                            className="underline"
                        >
                            el Real Decreto 157/2022
                        </a>
                        .
                    </p>
                </div>
            </article>
            <JsonLd
                data={[
                    {
                        '@type': 'LearningResource',
                        '@id':
                            absoluteUrl(paths.resource(guide.slug)) +
                            '#recurso',
                        name: guide.title,
                        description: guide.description,
                        url: absoluteUrl(paths.resource(guide.slug)),
                        inLanguage: 'es',
                        isAccessibleForFree: true,
                        educationalLevel: guide.ages,
                        teaches: guide.label,
                        audience: {
                            '@type': 'EducationalAudience',
                            educationalRole: 'student',
                        },
                        datePublished: RESOURCE_UPDATED.toISOString(),
                        publisher: {
                            '@type': 'Organization',
                            name: 'Eduaroo',
                            url: absoluteUrl('/'),
                        },
                        learningResourceType: guide.tool
                            ? 'Herramienta educativa'
                            : 'Guía de práctica',
                        dateModified: RESOURCE_UPDATED.toISOString(),
                        provider: {
                            '@type': 'Organization',
                            name: 'Eduaroo',
                            url: absoluteUrl('/'),
                        },
                    },
                    {
                        '@type': 'FAQPage',
                        mainEntity: guide.faq.map(([question, answer]) => ({
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
