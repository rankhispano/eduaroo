'use client';
import { useState } from 'react';
import regions from '@/content/resources/spain-map.json';
export default function SpainMap() {
    const [quiz, setQuiz] = useState(false);
    const [index, setIndex] = useState(0);
    const [selected, setSelected] = useState('');
    const [feedback, setFeedback] = useState('');
    const [correct, setCorrect] = useState<string[]>([]);
    const target = regions[index];
    function choose(id: string) {
        setSelected(id);
        const region = regions.find((r) => r.id === id)!;
        if (quiz) {
            const right = id === target.id;
            setFeedback(
                right
                    ? `¡Correcto! Has localizado ${target.name}.`
                    : `Has señalado ${region.name}. Busca ${target.name} e inténtalo de nuevo.`,
            );
            if (right && !correct.includes(id)) setCorrect([...correct, id]);
        } else setFeedback(region.name);
    }
    return (
        <section className="resource-tool no-print">
            <h2 className="text-2xl font-black">Explora el mapa de España</h2>
            <button
                className="resource-button-secondary"
                onClick={() => {
                    setQuiz(!quiz);
                    setFeedback('');
                    setSelected('');
                    setCorrect([]);
                    setIndex(0);
                }}
            >
                {quiz ? 'Explorar libremente' : 'Practicar localización'}
            </button>
            {quiz && (
                <p className="text-xl font-bold">
                    Encuentra: {target.name} · Localizadas: {correct.length} /
                    19
                </p>
            )}
            <svg
                viewBox="0 0 580 525"
                role="group"
                aria-label="Mapa interactivo de comunidades y ciudades autónomas de España"
                className="mx-auto w-full max-w-2xl rounded-xl bg-sky-50"
            >
                <rect
                    x="25"
                    y="410"
                    width="210"
                    height="100"
                    rx="8"
                    fill="none"
                    stroke="#64748b"
                    strokeDasharray="4"
                />
                <text x="40" y="430" fontSize="14" fill="#334155">
                    Canarias (desplazada)
                </text>
                {regions.map((region) => (
                    <path
                        key={region.id}
                        d={region.path}
                        fill={
                            selected === region.id
                                ? '#f97316'
                                : correct.includes(region.id)
                                  ? '#059669'
                                  : '#bae6fd'
                        }
                        stroke="#0369a1"
                        strokeWidth="1.2"
                        fillRule="evenodd"
                        tabIndex={0}
                        role="button"
                        aria-label={region.name}
                        className="cursor-pointer hover:fill-sky-300 focus:fill-amber-300 focus:outline-none"
                        onClick={() => choose(region.id)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                choose(region.id);
                            }
                        }}
                    >
                        <title>{region.name}</title>
                    </path>
                ))}
            </svg>
            <p aria-live="polite" className="min-h-7 font-bold">
                {feedback || 'Selecciona una región en el mapa o en la lista.'}
            </p>
            {quiz && correct.includes(target.id) && (
                <button
                    className="resource-button"
                    onClick={() => {
                        setIndex((index + 1) % regions.length);
                        setSelected('');
                        setFeedback('');
                    }}
                >
                    Siguiente región
                </button>
            )}
            <details>
                <summary className="cursor-pointer font-bold">
                    Lista accesible: 17 comunidades y 2 ciudades
                </summary>
                <div className="mt-4 flex flex-wrap gap-2">
                    {regions.map((region) => (
                        <button
                            key={region.id}
                            className="resource-button-secondary"
                            onClick={() => choose(region.id)}
                        >
                            {region.name}
                        </button>
                    ))}
                </div>
            </details>
            <p className="text-xs text-slate-600 dark:text-slate-300">
                Mapa educativo simplificado. Límites de{' '}
                <a
                    className="underline"
                    href="https://github.com/codeforgermany/click_that_hood/blob/main/public/data/spain-communities.geojson"
                >
                    Click That ’Hood / CartoDB
                </a>
                , adaptados para Eduaroo. Canarias se muestra fuera de su
                posición real.
            </p>
        </section>
    );
}
