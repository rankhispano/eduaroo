// Pasos jugables: cada pregunta de una lectura se convierte en un paso con el texto visible.
// Los usan el reproductor de actividades, el modo examen y el repaso de fallos.

import type { Activity, ReadingActivity } from './types';

export type ReadingStep = {
    id: string;
    type: 'reading-question';
    prompt: string;
    options: string[];
    answer: number;
    explanation: string;
    lang?: 'es' | 'en';
    hint?: undefined;
    passage: { title: string; text: string };
};

// setKey: `${cursoId}/${asignaturaId}/${temaId}` del bloque del que sale el paso
export type Step = (Exclude<Activity, ReadingActivity> | ReadingStep) & { setKey: string };

export function toSteps(activities: Activity[], setKey: string): Step[] {
    return activities.flatMap((activity): Step[] =>
        activity.type === 'reading'
            ? activity.questions.map((q, i) => ({
                id: `${activity.id}-q${i + 1}`,
                type: 'reading-question' as const,
                prompt: q.prompt,
                options: q.options,
                answer: q.answer,
                explanation: q.explanation,
                lang: activity.lang,
                passage: { title: activity.title, text: activity.text },
                setKey,
            }))
            : [{ ...activity, setKey }],
    );
}

export function shuffle<T>(items: T[]): T[] {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

// Una estrella por terminar, dos por acertar el 70 % y tres por el 90 %
export function starsFor(correct: number, total: number): 1 | 2 | 3 {
    const ratio = total > 0 ? correct / total : 0;
    if (ratio >= 0.9) return 3;
    if (ratio >= 0.7) return 2;
    return 1;
}
