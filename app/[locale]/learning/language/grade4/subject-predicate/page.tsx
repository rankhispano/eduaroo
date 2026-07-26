'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCircle, ChevronLeft, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Link } from '@/i18n/navigation';
import { playComplete, playCorrect, playIncorrect } from '@/lib/audio/soundEffects';

type SentenceItem = {
    sentence: string;
    subject: string;
    predicate: string;
};

type CompleteItem = {
    prompt: string;
    answerType: 'subject' | 'predicate';
    examples: string[];
};

type Exercise =
    | { id: number; type: 'identify'; item: SentenceItem }
    | { id: number; type: 'choose-subject'; item: SentenceItem; options: string[] }
    | { id: number; type: 'complete'; item: CompleteItem };

const SENTENCES: SentenceItem[] = [
    { sentence: 'La bibliotecaria ordena los cuentos nuevos.', subject: 'La bibliotecaria', predicate: 'ordena los cuentos nuevos' },
    { sentence: 'Los alumnos preparan una exposición sobre animales.', subject: 'Los alumnos', predicate: 'preparan una exposición sobre animales' },
    { sentence: 'Mi primo juega al baloncesto los sábados.', subject: 'Mi primo', predicate: 'juega al baloncesto los sábados' },
    { sentence: 'El tren llegó puntual a la estación.', subject: 'El tren', predicate: 'llegó puntual a la estación' },
    { sentence: 'Claudia y Marcos escriben una historia de aventuras.', subject: 'Claudia y Marcos', predicate: 'escriben una historia de aventuras' },
    { sentence: 'Las nubes cubren la montaña al atardecer.', subject: 'Las nubes', predicate: 'cubren la montaña al atardecer' },
    { sentence: 'El equipo celebra la victoria en el patio.', subject: 'El equipo', predicate: 'celebra la victoria en el patio' },
    { sentence: 'La abuela cocina croquetas para la familia.', subject: 'La abuela', predicate: 'cocina croquetas para la familia' },
    { sentence: 'Los girasoles miran hacia el sol.', subject: 'Los girasoles', predicate: 'miran hacia el sol' },
    { sentence: 'El cartero dejó una carta en el buzón.', subject: 'El cartero', predicate: 'dejó una carta en el buzón' },
    { sentence: 'Paula lee una noticia muy interesante.', subject: 'Paula', predicate: 'lee una noticia muy interesante' },
    { sentence: 'Los músicos ensayan antes del concierto.', subject: 'Los músicos', predicate: 'ensayan antes del concierto' },
];

const COMPLETE_ITEMS: CompleteItem[] = [
    { prompt: '__________ visitan el museo por la mañana.', answerType: 'subject', examples: ['Los niños', 'Mis amigas', 'Los turistas'] },
    { prompt: '__________ duerme debajo de la mesa.', answerType: 'subject', examples: ['El perro', 'Mi gato', 'La mascota'] },
    { prompt: '__________ explican el problema en la pizarra.', answerType: 'subject', examples: ['Las profesoras', 'Dos alumnos', 'Mis compañeros'] },
    { prompt: 'El jardinero __________.', answerType: 'predicate', examples: ['riega las flores', 'planta un árbol', 'barre las hojas'] },
    { prompt: 'Ana y Luis __________.', answerType: 'predicate', examples: ['preparan una escena', 'juegan en el parque', 'leen un cómic'] },
    { prompt: 'La tormenta __________.', answerType: 'predicate', examples: ['asustó a los vecinos', 'llegó por la noche', 'mojó las calles'] },
];

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

export default function SubjectPredicatePage() {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);

    const generateExercises = useCallback(() => {
        let id = 1;
        const selected = shuffle(SENTENCES);
        const identify = selected.slice(0, 4).map((item): Exercise => ({ id: id++, type: 'identify', item }));
        const choose = selected.slice(4, 8).map((item): Exercise => {
            const distractors = shuffle(SENTENCES.filter((candidate) => candidate.subject !== item.subject))
                .slice(0, 2)
                .map((candidate) => candidate.subject);

            return {
                id: id++,
                type: 'choose-subject',
                item,
                options: shuffle([item.subject, item.predicate, ...distractors]).slice(0, 4),
            };
        });
        const complete = shuffle(COMPLETE_ITEMS).slice(0, 3).map((item): Exercise => ({ id: id++, type: 'complete', item }));

        setExercises(shuffle([...identify, ...choose, ...complete]));
        setAnswers({});
        setShowResults(false);
        setScore(0);
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        generateExercises();
    }, [generateExercises]);

    const totalAutoScore = useMemo(
        () => exercises.filter((exercise) => exercise.type !== 'complete').length,
        [exercises],
    );

    const checkAnswers = () => {
        let correct = 0;

        exercises.forEach((exercise) => {
            if (exercise.type === 'identify') {
                if (answers[exercise.id] === `${exercise.item.subject}|${exercise.item.predicate}`) correct++;
            }

            if (exercise.type === 'choose-subject') {
                if (answers[exercise.id] === exercise.item.subject) correct++;
            }
        });

        setScore(totalAutoScore === 0 ? 0 : Math.round((correct / totalAutoScore) * 100));
        setShowResults(true);

        if (correct === totalAutoScore) {
            playComplete();
            confetti({ particleCount: 120, spread: 65, origin: { y: 0.7 } });
        } else if (correct > totalAutoScore / 2) {
            playCorrect();
        } else {
            playIncorrect();
        }
    };

    const resultClass = (exercise: Exercise, value: string) => {
        const selected = answers[exercise.id] === value;
        let correct = false;

        if (exercise.type === 'identify') correct = value === `${exercise.item.subject}|${exercise.item.predicate}`;
        if (exercise.type === 'choose-subject') correct = value === exercise.item.subject;

        if (!showResults) return selected ? 'border-blue-500 bg-blue-50 text-blue-800 shadow-sm' : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50';
        if (correct) return 'border-green-500 bg-green-50 text-green-800';
        if (selected) return 'border-red-500 bg-red-50 text-red-800';
        return 'border-slate-200 bg-white text-slate-400 opacity-60';
    };

    return (
        <main className="min-h-screen bg-blue-50 px-4 py-6 text-slate-900 md:px-8">
            <div className="mx-auto max-w-3xl">
                <header className="mb-8 flex items-center justify-between gap-4 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
                    <div className="flex min-w-0 items-center gap-4">
                        <Link href="/learning/4/lengua" className="rounded-lg p-2 transition hover:bg-slate-100" aria-label="Volver">
                            <ChevronLeft className="h-6 w-6 text-slate-500" />
                        </Link>
                        <div className="min-w-0">
                            <h1 className="text-xl font-black text-slate-900 md:text-2xl">Sujeto y predicado</h1>
                            <p className="text-sm font-semibold text-slate-500">Identifica, elige y completa oraciones.</p>
                        </div>
                    </div>
                    <button
                        onClick={generateExercises}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-100 px-4 py-2 font-black text-blue-700 transition hover:bg-blue-200"
                    >
                        <RefreshCw className="h-5 w-5" />
                        <span className="hidden sm:inline">Cambiar</span>
                    </button>
                </header>

                <section className="space-y-8">
                    {exercises.map((exercise, index) => (
                        <article key={exercise.id} className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <span className="absolute -left-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full border-2 border-blue-100 bg-white font-black text-blue-500">
                                {index + 1}
                            </span>

                            {exercise.type === 'identify' ? (
                                <div className="space-y-4">
                                    <p className="text-sm font-black uppercase text-blue-500">Separa la oración</p>
                                    <h2 className="text-xl font-black text-slate-900">{exercise.item.sentence}</h2>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {[
                                            `${exercise.item.subject}|${exercise.item.predicate}`,
                                            `${exercise.item.predicate}|${exercise.item.subject}`,
                                        ].map((value) => {
                                            const [subject, predicate] = value.split('|');
                                            return (
                                                <button
                                                    key={value}
                                                    disabled={showResults}
                                                    onClick={() => setAnswers((current) => ({ ...current, [exercise.id]: value }))}
                                                    className={`rounded-xl border-2 p-4 text-left font-bold transition ${resultClass(exercise, value)}`}
                                                >
                                                    <span className="block text-xs uppercase text-current opacity-70">Sujeto</span>
                                                    <span className="block">{subject}</span>
                                                    <span className="mt-3 block text-xs uppercase text-current opacity-70">Predicado</span>
                                                    <span className="block">{predicate}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : null}

                            {exercise.type === 'choose-subject' ? (
                                <div className="space-y-4">
                                    <p className="text-sm font-black uppercase text-blue-500">Elige el sujeto</p>
                                    <h2 className="text-xl font-black text-slate-900">{exercise.item.sentence}</h2>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {exercise.options.map((option) => (
                                            <button
                                                key={option}
                                                disabled={showResults}
                                                onClick={() => setAnswers((current) => ({ ...current, [exercise.id]: option }))}
                                                className={`rounded-xl border-2 p-4 font-bold transition ${resultClass(exercise, option)}`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : null}

                            {exercise.type === 'complete' ? (
                                <div className="space-y-4">
                                    <p className="text-sm font-black uppercase text-blue-500">
                                        Completa con un {exercise.item.answerType === 'subject' ? 'sujeto' : 'predicado'}
                                    </p>
                                    <h2 className="text-xl font-black text-slate-900">{exercise.item.prompt}</h2>
                                    <input
                                        value={answers[exercise.id] ?? ''}
                                        onChange={(event) => setAnswers((current) => ({ ...current, [exercise.id]: event.target.value }))}
                                        disabled={showResults}
                                        placeholder={exercise.item.answerType === 'subject' ? 'Escribe un sujeto...' : 'Escribe un predicado...'}
                                        className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 font-semibold outline-none transition focus:border-blue-400"
                                    />
                                    {showResults ? (
                                        <p className="rounded-xl bg-amber-50 p-3 text-sm font-bold text-amber-800">
                                            Ejemplos válidos: {exercise.item.examples.join(', ')}.
                                        </p>
                                    ) : null}
                                </div>
                            ) : null}
                        </article>
                    ))}
                </section>

                <footer className="mt-8 rounded-2xl bg-white p-4 shadow-sm">
                    {showResults ? (
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-black uppercase text-slate-400">Resultado automático</p>
                                <p className="text-3xl font-black text-slate-900">{score}% correcto</p>
                                <p className="text-sm font-semibold text-slate-500">Las respuestas abiertas se revisan con los ejemplos.</p>
                            </div>
                            <button onClick={generateExercises} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-black text-white transition hover:bg-blue-500">
                                <RefreshCw className="h-5 w-5" />
                                Practicar más
                            </button>
                        </div>
                    ) : (
                        <button onClick={checkAnswers} className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-6 py-4 text-xl font-black text-white shadow-[0_5px_0_#1d4ed8] transition hover:bg-blue-500 active:translate-y-1 active:shadow-[0_2px_0_#1d4ed8]">
                            <CheckCircle className="h-6 w-6" />
                            Corregir
                        </button>
                    )}
                </footer>
            </div>
        </main>
    );
}
