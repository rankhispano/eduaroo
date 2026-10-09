'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import ActivityPlayer from '@/components/activities/ActivityPlayer';
import { ACTIVITY_LOADERS } from '@/content/activities/registry';
import { getDueMistakes, usePracticeStore } from '@/lib/learning/practiceStore';
import { shuffle, toSteps, type Step } from '@/lib/curriculum/steps';
import type { ActivitySet } from '@/lib/curriculum/types';
import { getCurso } from '@/src/data/curriculum';
import RooMascot from '@/components/mascot/RooMascot';

const REVIEW_COLOR = '#EA580C';

export default function ReviewSession() {
    const t = useTranslations('KidsMap');
    const hydrated = usePracticeStore((s) => s.hydrated);
    const mistakes = usePracticeStore((s) => s.mistakes);
    const cursoId = usePracticeStore((s) => s.cursoId);
    const [session, setSession] = useState<{ set: ActivitySet; steps: Step[] } | null>(null);
    const [empty, setEmpty] = useState(false);

    useEffect(() => {
        if (!hydrated || session || empty) return;
        // Se fija la lista al empezar: lo que se acierte durante el repaso no la cambia
        const due = getDueMistakes(mistakes, 10);
        let cancelled = false;
        (async () => {
            const keys = [...new Set(due.map((m) => m.setKey))].filter((k) => ACTIVITY_LOADERS[k]);
            const sets = await Promise.all(keys.map((k) => ACTIVITY_LOADERS[k]()));
            const byKey = new Map(sets.map((s, i) => [keys[i], toSteps(s.activities, keys[i])]));
            const steps = due.flatMap((m) => byKey.get(m.setKey)?.find((st) => st.id === m.stepId) ?? []);
            if (cancelled) return;
            if (!steps.length) {
                setEmpty(true);
                return;
            }
            setSession({
                steps: shuffle(steps),
                set: {
                    ...sets[0],
                    id: 'repaso',
                    temaId: 'repaso',
                    temaNombre: t('reviewTitle'),
                    title: t('reviewTitle'),
                    summary: t('reviewSummary'),
                    keyIdeas: [],
                    activities: [],
                },
            });
        })();
        return () => {
            cancelled = true;
        };
    }, [hydrated, mistakes, session, empty, t]);

    if (session) {
        return (
            <ActivityPlayer
                set={session.set}
                steps={session.steps}
                mode="review"
                color={REVIEW_COLOR}
                subjectName={t('reviewTitle')}
                cursoNombre={getCurso(cursoId ?? '')?.nombre ?? ''}
                backHref="/"
                backLabel={t('backToMap')}
            />
        );
    }

    return (
        <div className="mx-auto flex max-w-xl flex-col items-center gap-5 px-4 py-16 text-center">
            <RooMascot pose={empty ? 'sleep' : 'think'} size={150} />
            {empty ? (
                <>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">{t('reviewEmptyTitle')}</h1>
                    <p className="text-lg font-semibold text-slate-600 dark:text-slate-300">{t('reviewEmpty')}</p>
                    <Link href="/" className="rounded-2xl bg-orange-500 px-6 py-3 text-lg font-black text-white shadow-[0_5px_0_#C2410C]">
                        {t('backToMap')}
                    </Link>
                </>
            ) : (
                <p className="text-lg font-bold text-slate-500">{t('reviewLoading')}</p>
            )}
        </div>
    );
}
