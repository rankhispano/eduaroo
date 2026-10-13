'use client';
import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import type { PracticeQuestion } from '@/lib/resources/types';

export default function ResourceQuiz({
    questions,
    assessment = false,
}: {
    questions: PracticeQuestion[];
    assessment?: boolean;
}) {
    const [grade, setGrade] = useState(
        assessment ? '2' : (questions[0]?.grade ?? '1'),
    );
    const [index, setIndex] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [results, setResults] = useState<
        { q: PracticeQuestion; correct: boolean }[]
    >([]);
    const [finished, setFinished] = useState(false);
    const sourceGrade = assessment
        ? String(Math.max(1, Number(grade) - 1))
        : grade;
    const available = questions.filter((q) => q.grade === sourceGrade);
    const q = available[index];
    function reset(nextGrade: string) {
        setGrade(nextGrade);
        setIndex(0);
        setSelected(null);
        setResults([]);
        setFinished(false);
    }
    function answer(value: number) {
        if (selected !== null) return;
        setSelected(value);
        setResults([...results, { q, correct: value === q.answer }]);
    }
    return (
        <section
            className="resource-tool no-print"
            aria-label={assessment ? 'Repaso orientativo' : 'Práctica rápida'}
        >
            <h2 className="text-2xl font-black">
                {assessment
                    ? '¿Qué curso vas a empezar?'
                    : 'Prueba una actividad'}
            </h2>
            <label className="resource-label">
                {assessment ? 'Curso que empieza' : 'Curso de la actividad'}
                <select
                    className="resource-input"
                    value={grade}
                    onChange={(e) => reset(e.target.value)}
                >
                    {(assessment
                        ? ['2', '3', '4', '5', '6']
                        : [...new Set(questions.map((q) => q.grade))]
                    ).map((g) => (
                        <option key={g} value={g}>
                            {g}º de Primaria
                        </option>
                    ))}
                </select>
            </label>
            {assessment && (
                <p className="text-sm">
                    Muestra de Matemáticas y Lengua de {sourceGrade}º. Para
                    empezar 1º, utiliza el juego de conteo y formas enlazado al
                    final de esta página.
                </p>
            )}
            {finished ? (
                <div aria-live="polite" className="space-y-4">
                    <h3 className="text-xl font-bold">
                        {results.filter((r) => r.correct).length} de{' '}
                        {available.length} respuestas correctas en esta muestra
                    </h3>
                    {assessment &&
                        ['mates', 'lengua'].map((subject) => {
                            const group = results.filter(
                                (r) => r.q.subject === subject,
                            );
                            return (
                                <p key={subject}>
                                    {subject === 'mates'
                                        ? 'Matemáticas'
                                        : 'Lengua'}
                                    : {group.filter((r) => r.correct).length} /{' '}
                                    {group.length}
                                </p>
                            );
                        })}
                    <p>
                        Estas preguntas son una muestra breve. Revisa las
                        explicaciones y elige qué tema quieres practicar
                        después.
                    </p>
                    <ul className="space-y-2">
                        {results.map((r) => (
                            <li key={r.q.id}>
                                <Link href={r.q.href} className="resource-link">
                                    {r.correct ? '✓' : '↻'} {r.q.topic}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <button
                        className="resource-button"
                        onClick={() => reset(grade)}
                    >
                        Volver a empezar
                    </button>
                </div>
            ) : q ? (
                <div className="space-y-4">
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-300">
                        {index + 1} / {available.length} · {q.topic}
                    </p>
                    {q.passage && (
                        <p className="whitespace-pre-line rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
                            {q.passage}
                        </p>
                    )}
                    <h3 className="text-xl font-bold">{q.prompt}</h3>
                    {q.sentence && <p>{q.sentence}</p>}
                    <div className="grid gap-3 sm:grid-cols-2">
                        {q.options.map((option, i) => (
                            <button
                                key={i}
                                disabled={selected !== null}
                                onClick={() => answer(i)}
                                className={`rounded-xl border-2 p-4 text-left font-bold disabled:opacity-90 ${selected !== null && i === q.answer ? 'border-emerald-600 bg-emerald-50 text-emerald-950' : selected === i ? 'border-rose-500 bg-rose-50 text-rose-950' : 'border-slate-200 hover:border-sky-500 dark:border-slate-700'}`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                    {selected !== null && (
                        <div
                            aria-live="polite"
                            className="space-y-3 rounded-xl bg-sky-50 p-4 text-slate-900"
                        >
                            <p className="font-bold">
                                {selected === q.answer
                                    ? '¡Bien pensado!'
                                    : 'Vamos a revisarlo.'}
                            </p>
                            <p>{q.explanation}</p>
                            <button
                                className="resource-button"
                                onClick={() => {
                                    if (index + 1 >= available.length)
                                        setFinished(true);
                                    else setIndex(index + 1);
                                    setSelected(null);
                                }}
                            >
                                {index + 1 >= available.length
                                    ? 'Ver resultado'
                                    : 'Siguiente actividad'}
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <p>
                    No hay una muestra para esta selección. Abre uno de los
                    temas del catálogo.
                </p>
            )}
        </section>
    );
}
