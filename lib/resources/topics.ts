import {
    getActivitySets,
    getActivityLoaders,
} from '@/content/activities/registry';
import type { ActivitySetSummary } from '@/lib/curriculum/types';
import type { ResourceGuide } from './catalog';
import type { PracticeQuestion } from './types';
import { paths } from '@/lib/seo/urls';

export function selectResourceTopics(
    guide: ResourceGuide,
): ActivitySetSummary[] {
    const pattern = guide.match ? new RegExp(guide.match) : undefined;
    return getActivitySets('es').filter(
        (set) =>
            (!guide.subject || set.asignaturaId === guide.subject) &&
            (!guide.grades || guide.grades.includes(set.cursoId)) &&
            (!pattern || pattern.test(set.temaId)),
    );
}
export function worksheetSeo(set: ActivitySetSummary) {
    const subjects: Record<string, string> = {
        mates: 'Mates',
        lengua: 'Lengua',
        ingles: 'Inglés',
        naturales: 'Naturales',
        sociales: 'Sociales',
    };
    const prefix = `Ficha ${set.cursoId}º ${subjects[set.asignaturaId]}: `;
    const max = 60 - prefix.length;
    const title =
        prefix +
        (set.temaNombre.length > max
            ? `${set.temaNombre.slice(0, max - 1).trim()}…`
            : set.temaNombre);
    const descriptionPrefix = `Ficha ${set.cursoId}º de ${subjects[set.asignaturaId]}: `;
    const suffix =
        '. Ejercicios gratis para imprimir en A4, con espacio para responder, soluciones explicadas y práctica online.';
    const topicLimit = 155 - descriptionPrefix.length - suffix.length;
    const shortened = set.temaNombre.slice(0, topicLimit - 1);
    const topic =
        set.temaNombre.length <= topicLimit
            ? set.temaNombre
            : `${shortened.slice(0, shortened.lastIndexOf(' ') > 8 ? shortened.lastIndexOf(' ') : shortened.length).trim()}…`;
    let description = descriptionPrefix + topic + suffix;
    if (description.length < 130) description += ' En Eduaroo.';
    return { title, description };
}
export async function getPracticeQuestions(
    sets: ActivitySetSummary[],
    countPerGrade = 5,
): Promise<PracticeQuestion[]> {
    const output: PracticeQuestion[] = [];
    // Distribute the short sample across topics rather than taking five questions from one set.
    for (const grade of ['1', '2', '3', '4', '5', '6']) {
        const inGrade = sets.filter((set) => set.cursoId === grade);
        const subjects = [...new Set(inGrade.map((set) => set.asignaturaId))];
        const candidates = Array.from(
            {
                length: Math.max(
                    0,
                    ...subjects.map(
                        (subject) =>
                            inGrade.filter(
                                (set) => set.asignaturaId === subject,
                            ).length,
                    ),
                ),
            },
            (_, i) =>
                subjects.map(
                    (subject) =>
                        inGrade.filter((set) => set.asignaturaId === subject)[
                            i
                        ],
                ),
        )
            .flat()
            .filter((set): set is ActivitySetSummary => set !== undefined);
        for (const summary of candidates) {
            if (output.filter((q) => q.grade === grade).length >= countPerGrade)
                break;
            const set = await getActivityLoaders('es')[summary.key]();
            const activity = set.activities.find(
                (a) =>
                    a.type === 'choice' ||
                    a.type === 'fill-blank' ||
                    a.type === 'true-false' ||
                    a.type === 'reading',
            );
            if (!activity) continue;
            const base = {
                id: summary.key + '/' + activity.id,
                grade,
                subject: summary.asignaturaId,
                topic: summary.temaNombre,
                href: paths.tema(grade, summary.asignaturaId, summary.temaId),
            };
            if (activity.type === 'reading') {
                const q = activity.questions[0];
                output.push({
                    ...base,
                    prompt: q.prompt,
                    options: q.options,
                    answer: q.answer,
                    explanation: q.explanation,
                    passage: activity.text,
                });
            } else if (activity.type === 'true-false')
                output.push({
                    ...base,
                    prompt: activity.prompt,
                    options: ['Verdadero', 'Falso'],
                    answer: activity.answer ? 0 : 1,
                    explanation: activity.explanation,
                });
            else if (
                activity.type === 'choice' ||
                activity.type === 'fill-blank'
            )
                output.push({
                    ...base,
                    prompt: activity.prompt,
                    options: activity.options,
                    answer: activity.answer,
                    explanation: activity.explanation,
                    ...(activity.type === 'fill-blank'
                        ? { sentence: activity.sentence }
                        : {}),
                });
        }
    }
    return output;
}
