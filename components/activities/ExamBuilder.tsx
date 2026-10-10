'use client';

import { useState } from 'react';
import RooMascot from '@/components/mascot/RooMascot';
import { useLocale, useTranslations } from 'next-intl';
import { ChevronLeft, Lightbulb, ListChecks, Repeat, Timer } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import ActivityPlayer from '@/components/activities/ActivityPlayer';
import { getActivityLoaders } from '@/content/activities/registry';
import { shuffle, toSteps, type Step } from '@/lib/curriculum/steps';
import type { ActivitySet } from '@/lib/curriculum/types';

const MAX_QUESTIONS = 30;
const perTopic = (selected: number) => Math.min(10, Math.max(4, Math.round(24 / Math.max(1, selected))));

export default function ExamBuilder({
    cursoId,
    cursoNombre,
    asignaturaId,
    asignaturaNombre,
    color,
    temas,
}: {
    cursoId: string;
    cursoNombre: string;
    asignaturaId: string;
    asignaturaNombre: string;
    color: string;
    temas: { id: string; nombre: string; key: string; count: number }[];
}) {
    const t = useTranslations('KidsMap');
    const locale = useLocale();
    const [selected, setSelected] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [exam, setExam] = useState<{ set: ActivitySet; steps: Step[] } | null>(null);

    const regionHref = `/learning/${cursoId}/${asignaturaId}`;
    const chosen = temas.filter((x) => selected.includes(x.id));
    const questions = Math.min(MAX_QUESTIONS, chosen.reduce((sum, x) => sum + Math.min(x.count, perTopic(chosen.length)), 0));

    const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

    const start = async () => {
        setLoading(true);
        const loaders = getActivityLoaders(locale);
        const sets = await Promise.all(chosen.map((x) => loaders[x.key]()));
        const n = perTopic(sets.length);
        const steps = shuffle(
            sets.flatMap((s) => shuffle(toSteps(s.activities, `${s.cursoId}/${s.asignaturaId}/${s.temaId}`)).slice(0, n)),
        ).slice(0, MAX_QUESTIONS);
        const first = sets[0];
        setExam({
            steps,
            set: {
                ...first,
                id: `examen-${cursoId}-${asignaturaId}`,
                temaId: 'examen',
                temaNombre: t('examPageTitle'),
                title: t('examSetTitle', { subject: asignaturaNombre }),
                summary: t('examSummary', { temas: chosen.map((x) => x.nombre).join(' · ') }),
                // La primera idea clave de cada tema, como repaso rápido antes de empezar
                keyIdeas: sets.flatMap((s) => s.keyIdeas.slice(0, 1)),
                activities: [],
                meta: { ...first.meta, translation: sets.every(s => s.meta.translation) ? first.meta.translation : undefined },
            },
        });
        setLoading(false);
    };

    if (exam) {
        return (
            <ActivityPlayer
                set={exam.set}
                steps={exam.steps}
                mode="exam"
                color={color}
                subjectName={asignaturaNombre}
                cursoNombre={cursoNombre}
                backHref={regionHref}
                backLabel={t('examBack')}
            />
        );
    }

    return (
        <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 pb-16 pt-6">
            <Link href={regionHref} className="inline-flex items-center gap-1 self-start text-sm font-bold text-slate-500 hover:text-indigo-600">
                <ChevronLeft className="h-4 w-4" /> {t('examBack')}
            </Link>

            <div className="flex items-end gap-2">
                <RooMascot pose="think" size={96} className="shrink-0" />
                <p className="rounded-2xl rounded-bl-sm bg-white px-4 py-3 text-lg font-bold text-slate-800 shadow-sm dark:bg-slate-900 dark:text-slate-100">
                    {t('examBubble')}
                </p>
            </div>

            <header>
                <p className="text-sm font-extrabold" style={{ color }}>
                    {cursoNombre} · {asignaturaNombre}
                </p>
                <h1 className="text-4xl font-black text-slate-900 dark:text-white">{t('examPageTitle')}</h1>
                <p className="mt-2 text-lg font-semibold text-slate-600 dark:text-slate-300">{t('examIntro')}</p>
            </header>

            {temas.length === 0 ? (
                <p className="rounded-2xl border-2 border-dashed border-slate-300 p-5 font-bold text-slate-600">{t('examNoTopics')}</p>
            ) : (
                <>
                    <div className="flex flex-wrap gap-2" role="group" aria-label={t('examPageTitle')}>
                        {temas.map((x) => {
                            const on = selected.includes(x.id);
                            return (
                                <button
                                    key={x.id}
                                    type="button"
                                    aria-pressed={on}
                                    onClick={() => toggle(x.id)}
                                    className="rounded-full border-2 px-4 py-2 text-base font-black transition"
                                    style={on ? { backgroundColor: color, borderColor: color, color: '#fff' } : { borderColor: '#CBD5E1', color: '#334155', backgroundColor: '#fff' }}
                                >
                                    {on ? '✓ ' : ''}
                                    {x.nombre}
                                </button>
                            );
                        })}
                    </div>
                    <div className="flex gap-3 text-sm font-bold">
                        <button type="button" onClick={() => setSelected(temas.map((x) => x.id))} className="text-sky-600 hover:underline">
                            {t('examSelectAll')}
                        </button>
                        <button type="button" onClick={() => setSelected([])} className="text-slate-500 hover:underline">
                            {t('examSelectNone')}
                        </button>
                    </div>

                    <ul className="grid gap-3 rounded-3xl bg-white p-5 font-bold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                        <li className="flex items-center gap-3">
                            <ListChecks className="h-6 w-6 shrink-0" style={{ color }} />
                            {chosen.length ? t('examQuestions', { count: questions }) : t('examPickOne')}
                        </li>
                        <li className="flex items-center gap-3">
                            <Timer className="h-6 w-6 shrink-0" style={{ color }} />
                            {chosen.length ? t('examMinutes', { count: Math.max(5, Math.round(questions * 0.75)) }) : '—'}
                        </li>
                        <li className="flex items-center gap-3">
                            <Lightbulb className="h-6 w-6 shrink-0" style={{ color }} />
                            {t('examKeyIdeas')}
                        </li>
                        <li className="flex items-center gap-3">
                            <Repeat className="h-6 w-6 shrink-0" style={{ color }} />
                            {t('examMistakes')}
                        </li>
                    </ul>

                    <button
                        type="button"
                        onClick={start}
                        disabled={chosen.length === 0 || loading}
                        className="rounded-2xl bg-orange-500 px-6 py-4 text-xl font-black text-white shadow-[0_5px_0_#C2410C] transition active:translate-y-1 active:shadow-none disabled:opacity-50"
                    >
                        {loading ? t('examLoading') : t('examStart')}
                    </button>
                </>
            )}
        </div>
    );
}
