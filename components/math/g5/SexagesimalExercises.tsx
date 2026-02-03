'use client';

import { useState, useEffect } from 'react';
import { useGamificationStore } from '@/lib/gamification/store';
import ExerciseFeedback from '@/components/ExerciseFeedback';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface SexagesimalProblem {
    type: 'time_add' | 'angle_sub'; // Simplified for MVP
    question: string;
    data: any;
    options: string[];
    correctAnswer: string;
}

export default function SexagesimalExercises() {
    const t = useTranslations('MathGrade5');
    const tCommon = useTranslations('Common');
    const { addXP } = useGamificationStore();
    const [problem, setProblem] = useState<SexagesimalProblem | null>(null);
    const [seed, setSeed] = useState(0);
    const [feedback, setFeedback] = useState<{ show: boolean; isCorrect: boolean; solution?: string }>({ show: false, isCorrect: false });

    const generateProblem = () => {
        // ...
        const h1 = Math.floor(Math.random() * 3) + 1;
        const m1 = Math.floor(Math.random() * 40) + 10;

        const h2 = Math.floor(Math.random() * 2);
        const m2 = Math.floor(Math.random() * 40) + 10;

        let totalM = m1 + m2;
        let totalH = h1 + h2;

        if (totalM >= 60) {
            totalH += 1;
            totalM -= 60;
        }

        const hUnit = tCommon('units.h');
        const mUnit = tCommon('units.min');
        const correctStr = `${totalH}${hUnit} ${totalM}${mUnit}`;

        // Generate distractions
        const opts = new Set<string>();
        opts.add(correctStr);

        // Distraction 1: Just adding numbers without carry (e.g. 1h 70min)
        opts.add(`${h1 + h2}${hUnit} ${m1 + m2}${mUnit}`);
        // Distraction 2: Subtracting
        opts.add(`${Math.abs(h1 - h2)}${hUnit} ${Math.abs(m1 - m2)}${mUnit}`);
        // Distraction 3: Random
        opts.add(`${totalH}${hUnit} ${totalM + 10}${mUnit}`);

        setProblem({
            type: 'time_add',
            question: t('sexagesimal_q', {
                t1: `${h1}${hUnit} ${m1}${mUnit}`,
                t2: `${h2}${hUnit} ${m2}${mUnit}`
            }),
            data: { h1, m1, h2, m2 },
            options: Array.from(opts).sort(() => Math.random() - 0.5),
            correctAnswer: correctStr
        });

        setFeedback({ show: false, isCorrect: false });
    };

    useEffect(() => {
        generateProblem();
    }, [seed]);

    const handleAnswer = (ans: string) => {
        if (!problem) return;
        const isCorrect = ans === problem.correctAnswer;

        if (isCorrect) {
            addXP(25);
            new Audio('/sounds/correct.mp3').play().catch(() => { });
        } else {
            new Audio('/sounds/incorrect.mp3').play().catch(() => { });
        }

        setFeedback({
            show: true,
            isCorrect,
            solution: isCorrect ? undefined : t('sexagesimal_sol', { answer: problem.correctAnswer })
        });
    };

    if (!problem) return null;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                <div className="p-6 bg-slate-100 dark:bg-slate-800 flex justify-between items-center">
                    <h2 className="text-2xl font-black text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <span>⏱️</span>
                        {t('sexagesimal_title')}
                    </h2>
                    <Button variant="ghost" size="icon" onClick={() => setSeed(s => s + 1)}>
                        <RefreshCcw className="w-5 h-5" />
                    </Button>
                </div>

                <div className="p-8 flex flex-col items-center gap-10">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center whitespace-pre-line">{problem.question}</h3>

                    <div className="flex gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                        💡 {t('sexagesimal_hint')}
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full">
                        {problem.options.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => handleAnswer(opt)}
                                className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl text-xl font-bold shadow hover:bg-slate-200 transition-colors border-2 border-transparent hover:border-slate-400"
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <ExerciseFeedback
                show={feedback.show}
                isCorrect={feedback.isCorrect}
                solution={feedback.solution}
                onComplete={() => {
                    if (feedback.isCorrect) setSeed(s => s + 1);
                    else setFeedback(prev => ({ ...prev, show: false }));
                }}
            />
        </div>
    );
}
