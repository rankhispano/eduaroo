'use client';
import { useState } from 'react';
import type { Activity, ActivitySet } from '@/lib/curriculum/types';
import { PrintButton } from './PrintTools';

function Prompt({ activity }: { activity: Activity }) {
    switch (activity.type) {
        case 'choice':
            return (
                <ul>
                    {activity.options.map((option, i) => (
                        <li key={i}>□ {option}</li>
                    ))}
                </ul>
            );
        case 'true-false':
            return <p>□ Verdadero &nbsp; □ Falso</p>;
        case 'fill-blank':
            return (
                <>
                    <p>{activity.sentence}</p>
                    <p>Opciones: {activity.options.join(' · ')}</p>
                </>
            );
        case 'match': {
            const right = activity.pairs.map((pair) => pair.right);
            return (
                <div className="grid grid-cols-2 gap-5">
                    <ul>
                        {activity.pairs.map((pair, i) => (
                            <li key={i}>
                                {i + 1}. {pair.left} ____
                            </li>
                        ))}
                    </ul>
                    <ul>
                        {[...right.slice(1), right[0]].map((value, i) => (
                            <li key={i}>
                                {String.fromCharCode(65 + i)}. {value}
                            </li>
                        ))}
                    </ul>
                </div>
            );
        }
        case 'order':
            return (
                <>
                    <p>Ordena estos elementos:</p>
                    <ul>
                        {[...activity.items].reverse().map((item, i) => (
                            <li key={i}>___ {item}</li>
                        ))}
                    </ul>
                </>
            );
        case 'classify':
            return (
                <>
                    <p>Categorías: {activity.categories.join(' · ')}</p>
                    <ul>
                        {activity.items.map((item, i) => (
                            <li key={i}>{item.text}: __________________</li>
                        ))}
                    </ul>
                </>
            );
        case 'reading':
            return (
                <>
                    <h4 className="font-bold">{activity.title}</h4>
                    <p className="whitespace-pre-line">{activity.text}</p>
                    {activity.questions.map((q, i) => (
                        <div className="mt-3 print-keep" key={i}>
                            <p className="font-bold">
                                {i + 1}. {q.prompt}
                            </p>
                            <ul>
                                {q.options.map((option, j) => (
                                    <li key={j}>□ {option}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </>
            );
    }
}
function Solution({ activity }: { activity: Activity }) {
    switch (activity.type) {
        case 'choice':
        case 'fill-blank':
            return (
                <p>
                    <strong>{activity.options[activity.answer]}</strong> ·{' '}
                    {activity.explanation}
                </p>
            );
        case 'true-false':
            return (
                <p>
                    <strong>{activity.answer ? 'Verdadero' : 'Falso'}</strong> ·{' '}
                    {activity.explanation}
                </p>
            );
        case 'match':
            return (
                <>
                    <p>
                        {activity.pairs
                            .map((p) => `${p.left} → ${p.right}`)
                            .join('; ')}
                    </p>
                    <p>{activity.explanation}</p>
                </>
            );
        case 'order':
            return (
                <>
                    <p>{activity.items.join(' → ')}</p>
                    <p>{activity.explanation}</p>
                </>
            );
        case 'classify':
            return (
                <>
                    <p>
                        {activity.items
                            .map(
                                (item) =>
                                    `${item.text}: ${activity.categories[item.category]}`,
                            )
                            .join('; ')}
                    </p>
                    <p>{activity.explanation}</p>
                </>
            );
        case 'reading':
            return (
                <>
                    {activity.questions.map((q, i) => (
                        <p key={i}>
                            <strong>
                                {i + 1}. {q.options[q.answer]}
                            </strong>{' '}
                            · {q.explanation}
                        </p>
                    ))}
                </>
            );
    }
}
export default function Worksheet({
    sets,
    heading,
}: {
    sets: ActivitySet[];
    heading: string;
}) {
    const [solutions, setSolutions] = useState(false);
    const [ideas, setIdeas] = useState(true);
    return (
        <section className="resource-tool">
            <div className="no-print space-y-3">
                <h2 className="text-2xl font-black">Prepara la impresión</h2>
                <label className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        checked={ideas}
                        onChange={(e) => setIdeas(e.target.checked)}
                    />
                    Incluir ideas clave
                </label>
                <label className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        checked={solutions}
                        onChange={(e) => setSolutions(e.target.checked)}
                    />
                    Incluir solucionario al final
                </label>
                <PrintButton />
                <p className="text-sm">
                    Se imprimen las hojas de actividades y, si lo activas, el
                    solucionario. En el navegador elige A4 y «Guardar como PDF»
                    para descargarlo.
                </p>
            </div>
            <div className="print-sheet rounded-xl border bg-white p-5 text-base text-slate-900 sm:p-8">
                <h2 className="text-2xl font-bold">{heading}</h2>
                <p className="my-4 text-sm">
                    Nombre: __________________________ Fecha: ______________
                </p>
                {sets.map((set) => (
                    <section key={set.id} className="worksheet-topic">
                        <h3 className="mb-3 text-xl font-bold">
                            {set.cursoId}º · {set.temaNombre}
                        </h3>
                        {ideas && (
                            <div className="print-keep mb-5 rounded-lg border p-3">
                                <h4 className="font-bold">Recuerda</h4>
                                <ul className="list-disc pl-5">
                                    {set.keyIdeas.map((idea) => (
                                        <li key={idea}>{idea}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {set.activities.map((activity, i) => (
                            <div
                                key={activity.id}
                                className={`mb-6 ${activity.type === 'reading' ? '' : 'print-keep'}`}
                            >
                                <h4 className="mb-2 font-bold">
                                    {i + 1}. {activity.prompt}
                                </h4>
                                <Prompt activity={activity} />
                                {activity.type !== 'reading' && (
                                    <div className="mt-2 h-10 border-b border-slate-300" />
                                )}
                            </div>
                        ))}
                    </section>
                ))}
                {solutions && (
                    <section className="worksheet-solutions">
                        <h2 className="mb-5 text-2xl font-bold">
                            Solucionario · Eduaroo
                        </h2>
                        {sets.map((set) => (
                            <div key={set.id}>
                                <h3 className="my-4 text-xl font-bold">
                                    {set.temaNombre}
                                </h3>
                                {set.activities.map((activity, i) => (
                                    <div
                                        key={activity.id}
                                        className="print-keep mb-4"
                                    >
                                        <h4 className="font-bold">
                                            Actividad {i + 1}
                                        </h4>
                                        <Solution activity={activity} />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </section>
                )}
                <p className="mt-6 text-xs">
                    eduaroo.com · Recursos gratuitos de repaso de Primaria.
                </p>
            </div>
        </section>
    );
}
