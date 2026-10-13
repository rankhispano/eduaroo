import { getActivitySets } from '@/content/activities/registry';
import { Link } from '@/i18n/navigation';
import { paths } from '@/lib/seo/urls';

const weeks = [
    {
        title: 'Semana 1 · Recuperar lo conocido',
        math: /numeros|suma|fracciones|operaciones/,
        language: /lectura|comprension|texto|cuento/,
        offline:
            'Lee un cuento que tengas en casa y explica qué parte te ha gustado.',
    },
    {
        title: 'Semana 2 · Calcular y escribir',
        math: /suma|resta|tablas|multiplicacion|division|operaciones|porcentajes/,
        language: /escritura|dictado|ortografia|puntuacion|coma|verbo/,
        offline:
            'Escribe una nota o una postal y revisa las palabras que te hayan generado dudas.',
    },
    {
        title: 'Semana 3 · Observar y explicar',
        math: /figuras|longitud|perimetro|area|masa|angulos|volumen|cuerpos|coordenadas/,
        language:
            /nombre|adjetivo|sinonimos|clases-de-palabras|generos|comunicacion|vocales|articulo/,
        offline:
            'Dibuja un objeto de casa y describe su forma y sus características.',
    },
    {
        title: 'Semana 4 · Resolver y revisar',
        math: /series|fracciones|algebra|probabilidad|estadistica/,
        language: /texto|lectura|comprension|cuento|personajes|generos/,
        offline:
            'Inventa un problema para otra persona y explica la solución con un dibujo.',
    },
];

export default function SummerPlan() {
    const topics = getActivitySets('es');
    return (
        <section className="no-print space-y-4">
            <h2 className="text-2xl font-black">
                Plan de cuatro semanas por curso
            </h2>
            <p>
                Abre tu curso para ver la propuesta. Puedes cambiar el orden,
                repetir un tema o escoger otro del catálogo.
            </p>
            {['1', '2', '3', '4', '5', '6'].map((grade) => {
                const inGrade = topics.filter(
                    (topic) => topic.cursoId === grade,
                );
                return (
                    <details
                        key={grade}
                        className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
                    >
                        <summary className="cursor-pointer text-xl font-black">
                            Repaso de {grade}º de Primaria
                        </summary>
                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            {weeks.map((week) => {
                                const math =
                                    inGrade.find(
                                        (t) =>
                                            t.asignaturaId === 'mates' &&
                                            week.math.test(t.temaId),
                                    ) ??
                                    inGrade.find(
                                        (t) => t.asignaturaId === 'mates',
                                    )!;
                                const language =
                                    inGrade.find(
                                        (t) =>
                                            t.asignaturaId === 'lengua' &&
                                            week.language.test(t.temaId),
                                    ) ??
                                    inGrade.find(
                                        (t) => t.asignaturaId === 'lengua',
                                    )!;
                                return (
                                    <div
                                        key={week.title}
                                        className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"
                                    >
                                        <h3 className="mb-3 font-bold">
                                            {week.title}
                                        </h3>
                                        <ul className="space-y-2 text-base">
                                            {[math, language].map((topic) => (
                                                <li key={topic.key}>
                                                    <Link
                                                        className="resource-link"
                                                        href={paths.tema(
                                                            grade,
                                                            topic.asignaturaId,
                                                            topic.temaId,
                                                        )}
                                                    >
                                                        {topic.temaNombre}
                                                    </Link>{' '}
                                                    <Link
                                                        href={paths.worksheet(
                                                            grade,
                                                            topic.asignaturaId,
                                                            topic.temaId,
                                                        )}
                                                        className="resource-link text-sm"
                                                    >
                                                        (ficha)
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                        <p className="mt-3 text-sm">
                                            <strong>Sin pantalla:</strong>{' '}
                                            {week.offline}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                        <Link
                            href={paths.summerBook(grade)}
                            className="resource-link mt-5 inline-block"
                        >
                            Preparar cuaderno imprimible de {grade}º →
                        </Link>
                    </details>
                );
            })}
        </section>
    );
}
