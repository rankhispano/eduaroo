'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCircle, ChevronLeft, RefreshCw, Theater } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Link } from '@/i18n/navigation';
import { playComplete, playCorrect, playIncorrect } from '@/lib/audio/soundEffects';

type Scene = {
    title: string;
    place: string;
    characters: string[];
    lines: string[];
    questions: { text: string; options: string[]; correct: string }[];
};

type ElementQuestion = {
    term: string;
    definition: string;
    options: string[];
};

const SCENES: Scene[] = [
    {
        title: 'La mochila perdida',
        place: 'Patio del colegio, durante el recreo.',
        characters: ['Laura', 'Dani', 'Sofía'],
        lines: [
            'Laura: Mirad, hay una mochila debajo del banco.',
            'Dani: Quizá alguien la olvidó al salir corriendo.',
            'Sofía: Busquemos una etiqueta antes de llevarla a la profesora.',
            'Laura: Aquí pone Clara. Está en cuarto B.',
            'Dani: Entonces podemos devolverla ahora mismo.',
        ],
        questions: [
            { text: '¿Dónde ocurre la escena?', options: ['En el patio', 'En la biblioteca', 'En el comedor'], correct: 'En el patio' },
            { text: '¿Qué encuentran los personajes?', options: ['Una mochila', 'Un libro roto', 'Un balón'], correct: 'Una mochila' },
            { text: '¿A quién pertenece?', options: ['A Clara', 'A Laura', 'A Dani'], correct: 'A Clara' },
        ],
    },
    {
        title: 'El ensayo sorpresa',
        place: 'Aula de música, por la tarde.',
        characters: ['Bruno', 'Marta', 'Maestra'],
        lines: [
            'Maestra: Hoy ensayaremos la escena final.',
            'Bruno: Yo todavía me pongo nervioso al hablar alto.',
            'Marta: Podemos practicar contigo antes de empezar.',
            'Maestra: Buena idea. En teatro ayudarse es parte del trabajo.',
            'Bruno: Gracias. Esta vez miraré al público.',
        ],
        questions: [
            { text: '¿Qué van a ensayar?', options: ['La escena final', 'Una canción', 'Una noticia'], correct: 'La escena final' },
            { text: '¿Quién se pone nervioso?', options: ['Bruno', 'Marta', 'La maestra'], correct: 'Bruno' },
            { text: '¿Qué consejo aparece en la escena?', options: ['Ayudarse en equipo', 'Correr por el escenario', 'Hablar sin mirar'], correct: 'Ayudarse en equipo' },
        ],
    },
    {
        title: 'La caja de disfraces',
        place: 'Biblioteca del colegio.',
        characters: ['Irene', 'Noa', 'Bibliotecario'],
        lines: [
            'Bibliotecario: Esta caja tiene disfraces antiguos de otras obras.',
            'Irene: Este sombrero parece de detective.',
            'Noa: Y esta capa puede servir para una reina.',
            'Bibliotecario: Recordad escribir acotaciones para indicar los movimientos.',
            'Irene: Entonces pondremos que el detective entra despacio.',
        ],
        questions: [
            { text: '¿Qué hay en la caja?', options: ['Disfraces', 'Diccionarios', 'Instrumentos'], correct: 'Disfraces' },
            { text: '¿Dónde ocurre la escena?', options: ['En la biblioteca', 'En el patio', 'En un teatro'], correct: 'En la biblioteca' },
            { text: '¿Para qué sirven las acotaciones?', options: ['Para indicar movimientos', 'Para borrar diálogos', 'Para cambiar el título'], correct: 'Para indicar movimientos' },
        ],
    },
];

const THEATRE_ELEMENTS = [
    { term: 'Personajes', definition: 'Seres que aparecen en la obra.' },
    { term: 'Diálogo', definition: 'Conversación entre personajes.' },
    { term: 'Escenario', definition: 'Lugar donde se representa la obra.' },
    { term: 'Acotaciones', definition: 'Indicaciones sobre gestos, entradas o movimientos.' },
    { term: 'Actores', definition: 'Personas que interpretan a los personajes.' },
];

const REPRESENTATION_TIPS = [
    { text: 'Hablar con voz clara para que el público entienda.', correct: true },
    { text: 'Dar la espalda al público durante toda la escena.', correct: false },
    { text: 'Ensayar antes de representar la obra.', correct: true },
    { text: 'Escuchar a los compañeros cuando hablan.', correct: true },
    { text: 'Interrumpir si otro personaje se equivoca.', correct: false },
    { text: 'Usar objetos sencillos si ayudan a comprender la escena.', correct: true },
];

const WRITING_PROMPTS = [
    'Un grupo encuentra una mochila perdida en el patio.',
    'Tres amigos preparan una obra para la fiesta del colegio.',
    'Una clase descubre una caja de disfraces en la biblioteca.',
    'Dos alumnos ayudan a otro a vencer los nervios antes de actuar.',
];

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

export default function TheatrePage() {
    const [scene, setScene] = useState<Scene>(SCENES[0]);
    const [elementOptions, setElementOptions] = useState<ElementQuestion[]>([]);
    const [tips, setTips] = useState<typeof REPRESENTATION_TIPS>([]);
    const [writingPrompt, setWritingPrompt] = useState(WRITING_PROMPTS[0]);
    const [answers, setAnswers] = useState<Record<string, string | boolean>>({});
    const [script, setScript] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);

    const generateExercises = useCallback(() => {
        const nextScene = shuffle(SCENES)[0];
        setScene({
            ...nextScene,
            questions: nextScene.questions.map((question) => ({ ...question, options: shuffle(question.options) })),
        });
        setElementOptions(
            shuffle(THEATRE_ELEMENTS).slice(0, 4).map((element) => ({
                ...element,
                options: shuffle([
                    element.definition,
                    ...shuffle(THEATRE_ELEMENTS.filter((item) => item.definition !== element.definition))
                        .slice(0, 2)
                        .map((item) => item.definition),
                ]),
            })),
        );
        setTips(shuffle(REPRESENTATION_TIPS).slice(0, 4));
        setWritingPrompt(shuffle(WRITING_PROMPTS)[0]);
        setAnswers({});
        setScript('');
        setShowResults(false);
        setScore(0);
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        generateExercises();
    }, [generateExercises]);

    const scriptChecks = useMemo(() => {
        const characterMentions = (script.match(/:/g) ?? []).length;
        return [
            { label: 'Tiene al menos 3 intervenciones con nombre y dos puntos', done: characterMentions >= 3 },
            { label: 'Incluye una acotación entre paréntesis', done: /\(.+\)/.test(script) },
            { label: 'Tiene un problema o una pequeña situación teatral', done: script.trim().split(/\s+/).length >= 35 },
        ];
    }, [script]);

    const checkAnswers = () => {
        let correct = 0;
        let total = 0;

        scene.questions.forEach((question, index) => {
            total++;
            if (answers[`q-${index}`] === question.correct) correct++;
        });

        elementOptions.forEach((element) => {
            total++;
            if (answers[`element-${element.term}`] === element.definition) correct++;
        });

        tips.forEach((tip, index) => {
            total++;
            if (answers[`tip-${index}`] === tip.correct) correct++;
        });

        scriptChecks.forEach((check) => {
            total++;
            if (check.done) correct++;
        });

        setScore(Math.round((correct / total) * 100));
        setShowResults(true);

        if (correct === total) {
            playComplete();
            confetti({ particleCount: 140, spread: 70, origin: { y: 0.65 } });
        } else if (correct > total / 2) {
            playCorrect();
        } else {
            playIncorrect();
        }
    };

    const optionClass = (key: string, option: string | boolean, correct: string | boolean) => {
        const selected = answers[key] === option;
        if (!showResults) return selected ? 'border-rose-500 bg-rose-50 text-rose-800' : 'border-slate-200 hover:border-rose-300 hover:bg-rose-50';
        if (option === correct) return 'border-green-500 bg-green-50 text-green-800';
        if (selected) return 'border-red-500 bg-red-50 text-red-800';
        return 'border-slate-200 bg-white text-slate-400 opacity-60';
    };

    return (
        <main className="min-h-screen bg-rose-50 px-4 py-6 text-slate-900 md:px-8">
            <div className="mx-auto max-w-4xl">
                <header className="mb-8 flex items-center justify-between gap-4 rounded-2xl border border-rose-100 bg-white p-4 shadow-sm">
                    <div className="flex min-w-0 items-center gap-4">
                        <Link href="/learning/4/lengua" className="rounded-lg p-2 transition hover:bg-slate-100" aria-label="Volver">
                            <ChevronLeft className="h-6 w-6 text-slate-500" />
                        </Link>
                        <div className="min-w-0">
                            <h1 className="flex items-center gap-2 text-xl font-black text-slate-900 md:text-2xl">
                                <Theater className="h-6 w-6 text-rose-500" />
                                Teatro
                            </h1>
                            <p className="text-sm font-semibold text-slate-500">Comprende, representa y escribe una escena.</p>
                        </div>
                    </div>
                    <button
                        onClick={generateExercises}
                        className="inline-flex items-center gap-2 rounded-xl bg-rose-100 px-4 py-2 font-black text-rose-700 transition hover:bg-rose-200"
                    >
                        <RefreshCw className="h-5 w-5" />
                        <span className="hidden sm:inline">Cambiar</span>
                    </button>
                </header>

                <section className="space-y-8">
                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm font-black uppercase text-rose-500">Comprensión teatral</p>
                        <h2 className="mt-2 text-2xl font-black text-slate-900">{scene.title}</h2>
                        <p className="mt-1 font-semibold text-slate-500">Escena: {scene.place}</p>
                        <p className="mt-1 font-semibold text-slate-500">Personajes: {scene.characters.join(', ')}</p>
                        <div className="mt-4 space-y-2 rounded-xl bg-slate-50 p-4 font-semibold text-slate-700">
                            {scene.lines.map((line) => (
                                <p key={line}>{line}</p>
                            ))}
                        </div>
                        <div className="mt-5 space-y-5">
                            {scene.questions.map((question, index) => (
                                <div key={question.text}>
                                    <h3 className="font-black text-slate-800">{question.text}</h3>
                                    <div className="mt-2 grid gap-3 sm:grid-cols-3">
                                        {question.options.map((option) => (
                                            <button
                                                key={option}
                                                disabled={showResults}
                                                onClick={() => setAnswers((current) => ({ ...current, [`q-${index}`]: option }))}
                                                className={`rounded-xl border-2 p-3 font-bold transition ${optionClass(`q-${index}`, option, question.correct)}`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </article>

                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm font-black uppercase text-rose-500">Elementos del teatro</p>
                        <div className="mt-4 space-y-4">
                            {elementOptions.map((element) => (
                                <div key={element.term}>
                                    <h2 className="text-lg font-black text-slate-900">{element.term}</h2>
                                    <div className="mt-2 grid gap-3 md:grid-cols-2">
                                        {element.options.map((definition) => (
                                                <button
                                                    key={definition}
                                                    disabled={showResults}
                                                    onClick={() => setAnswers((current) => ({ ...current, [`element-${element.term}`]: definition }))}
                                                    className={`rounded-xl border-2 p-3 text-left font-bold transition ${optionClass(`element-${element.term}`, definition, element.definition)}`}
                                                >
                                                    {definition}
                                                </button>
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </article>

                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm font-black uppercase text-rose-500">Representación teatral</p>
                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                            {tips.map((tip, index) => (
                                <div key={tip.text} className="rounded-xl border border-slate-200 p-4">
                                    <p className="font-bold text-slate-800">{tip.text}</p>
                                    <div className="mt-3 flex gap-3">
                                        {[true, false].map((value) => (
                                            <button
                                                key={String(value)}
                                                disabled={showResults}
                                                onClick={() => setAnswers((current) => ({ ...current, [`tip-${index}`]: value }))}
                                                className={`flex-1 rounded-xl border-2 p-3 font-black transition ${optionClass(`tip-${index}`, value, tip.correct)}`}
                                            >
                                                {value ? 'Sí' : 'No'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </article>

                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm font-black uppercase text-rose-500">Escribe una escena</p>
                        <h2 className="mt-2 text-xl font-black text-slate-900">{writingPrompt}</h2>
                        <textarea
                            value={script}
                            disabled={showResults}
                            onChange={(event) => setScript(event.target.value)}
                            className="mt-4 min-h-52 w-full rounded-xl border-2 border-slate-200 p-4 font-semibold outline-none transition focus:border-rose-400"
                            placeholder={'Título: ...\nPersonajes: ...\nEscena: ...\nLaura: ...\n(Dani entra despacio.)'}
                        />
                        <div className="mt-4 grid gap-3 md:grid-cols-3">
                            {scriptChecks.map((check) => (
                                <div key={check.label} className={`rounded-xl border-2 p-3 text-sm font-bold ${showResults && check.done ? 'border-green-500 bg-green-50 text-green-800' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                                    {check.label}
                                </div>
                            ))}
                        </div>
                    </article>
                </section>

                <footer className="mt-8 rounded-2xl bg-white p-4 shadow-sm">
                    {showResults ? (
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-black uppercase text-slate-400">Resultado</p>
                                <p className="text-3xl font-black text-slate-900">{score}% correcto</p>
                            </div>
                            <button onClick={generateExercises} className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-6 py-3 font-black text-white transition hover:bg-rose-500">
                                <RefreshCw className="h-5 w-5" />
                                Practicar más
                            </button>
                        </div>
                    ) : (
                        <button onClick={checkAnswers} className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-rose-600 px-6 py-4 text-xl font-black text-white shadow-[0_5px_0_#be123c] transition hover:bg-rose-500 active:translate-y-1 active:shadow-[0_2px_0_#be123c]">
                            <CheckCircle className="h-6 w-6" />
                            Corregir
                        </button>
                    )}
                </footer>
            </div>
        </main>
    );
}
