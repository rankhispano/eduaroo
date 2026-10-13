'use client';
import { useState } from 'react';
import type { ActivitySetSummary } from '@/lib/curriculum/types';
import { Link } from '@/i18n/navigation';
import { paths } from '@/lib/seo/urls';
const subjects: Record<string, string> = {
    mates: 'Matemáticas',
    lengua: 'Lengua Castellana',
    ingles: 'Inglés',
    naturales: 'Ciencias Naturales',
    sociales: 'Ciencias Sociales',
};
export default function TopicBrowser({
    topics,
    printFirst = false,
}: {
    topics: ActivitySetSummary[];
    printFirst?: boolean;
}) {
    const [grade, setGrade] = useState('all');
    const [subject, setSubject] = useState('all');
    const [query, setQuery] = useState('');
    const normalize = (text: string) =>
        text
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();
    const shown = topics.filter(
        (t) =>
            (grade === 'all' || t.cursoId === grade) &&
            (subject === 'all' || t.asignaturaId === subject) &&
            normalize(t.temaNombre).includes(normalize(query)),
    );
    return (
        <section id="temas" className="space-y-6 no-print">
            <h2 className="text-2xl font-black">
                {printFirst ? 'Elige tu ficha' : 'Sigue practicando por curso'}
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
                <label className="resource-label">
                    Curso
                    <select
                        className="resource-input"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                    >
                        <option value="all">Todos los cursos</option>
                        {[...new Set(topics.map((t) => t.cursoId))]
                            .sort()
                            .map((g) => (
                                <option key={g} value={g}>
                                    {g}º de Primaria
                                </option>
                            ))}
                    </select>
                </label>
                <label className="resource-label">
                    Asignatura
                    <select
                        className="resource-input"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    >
                        <option value="all">Todas las asignaturas</option>
                        {[...new Set(topics.map((t) => t.asignaturaId))].map(
                            (s) => (
                                <option key={s} value={s}>
                                    {subjects[s]}
                                </option>
                            ),
                        )}
                    </select>
                </label>
                <label className="resource-label">
                    Buscar tema
                    <input
                        className="resource-input"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Fracciones, lectura…"
                    />
                </label>
            </div>
            <p
                aria-live="polite"
                className="text-sm text-slate-600 dark:text-slate-300"
            >
                {shown.length} temas disponibles
            </p>
            {['1', '2', '3', '4', '5', '6'].map((g) => {
                const group = shown.filter((t) => t.cursoId === g);
                if (!group.length) return null;
                return (
                    <details
                        key={g}
                        open={
                            grade !== 'all' ||
                            topics.length < 35 ||
                            query !== ''
                        }
                        className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
                    >
                        <summary className="cursor-pointer text-xl font-black">
                            {g}º de Primaria{' '}
                            <span className="text-sm font-normal">
                                · {group.length} temas
                            </span>
                        </summary>
                        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                            {group.map((topic) => (
                                <li
                                    key={topic.key}
                                    className="rounded-xl border border-slate-100 p-4 dark:border-slate-700"
                                >
                                    <span className="text-xs font-bold text-sky-700 dark:text-sky-300">
                                        {subjects[topic.asignaturaId]}
                                    </span>
                                    <h3 className="my-2 text-lg font-bold">
                                        <Link
                                            href={
                                                printFirst
                                                    ? paths.worksheet(
                                                          topic.cursoId,
                                                          topic.asignaturaId,
                                                          topic.temaId,
                                                      )
                                                    : paths.tema(
                                                          topic.cursoId,
                                                          topic.asignaturaId,
                                                          topic.temaId,
                                                      )
                                            }
                                            className="hover:underline"
                                        >
                                            {topic.temaNombre}
                                        </Link>
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-300">
                                        {topic.summary}
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-4 text-sm font-bold">
                                        <Link
                                            className="resource-link"
                                            href={paths.tema(
                                                topic.cursoId,
                                                topic.asignaturaId,
                                                topic.temaId,
                                            )}
                                        >
                                            Practicar · {topic.activityCount}{' '}
                                            actividades
                                        </Link>
                                        <Link
                                            className="resource-link"
                                            href={paths.worksheet(
                                                topic.cursoId,
                                                topic.asignaturaId,
                                                topic.temaId,
                                            )}
                                        >
                                            Imprimir ficha
                                        </Link>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </details>
                );
            })}
            {!shown.length && (
                <p>
                    Prueba con otro curso, asignatura o palabra. Puedes borrar
                    la búsqueda para ver todos los temas.
                </p>
            )}
        </section>
    );
}
