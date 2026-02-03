'use client';

import { useState, useEffect } from 'react';
import { useGamificationStore } from '@/lib/gamification/store';
import ExerciseFeedback from '@/components/ExerciseFeedback';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';

type PropType = 'rule_three' | 'percentage';

interface PropProblem {
    type: PropType;
    question: string;
    data: any;
    options: number[];
    correctAnswer: number;
}

export default function ProportionalityExercises() {
    const t = useTranslations('MathGrade6');
    const tCommon = useTranslations('Common');
    const { addXP } = useGamificationStore();
    const [problem, setProblem] = useState<PropProblem | null>(null);
    const [seed, setSeed] = useState(0);
    const [feedback, setFeedback] = useState<{ show: boolean; isCorrect: boolean; solution?: string }>({ show: false, isCorrect: false });

    const generateProblem = () => {
        const type: PropType = Math.random() > 0.5 ? 'rule_three' : 'percentage';

        if (type === 'rule_three') {
            // "If 2 apples cost 4€, how much for 5 apples?"
            const unit = Math.floor(Math.random() * 5) + 2; // base cost
            const q1 = Math.floor(Math.random() * 3) + 2;
            const q2 = q1 + Math.floor(Math.random() * 4) + 1;

            const cost1 = q1 * unit;
            const correct = q2 * unit;

            const options = new Set<number>();
            options.add(correct);
            while (options.size < 4) {
                options.add(correct + (Math.floor(Math.random() * 5) - 2) * unit || correct + unit);
            }

            setProblem({
                type: 'rule_three',
                question: t('prop_rule_three_q', { q1, cost1, q2 }),
                data: { q1, cost1, q2 },
                options: Array.from(options).sort((a, b) => a - b),
                correctAnswer: correct
            });
        } else {
            // Percentages: "50% of 200" or "Discount"
            const pct = [10, 20, 25, 50][Math.floor(Math.random() * 4)];
            const total = Math.floor(Math.random() * 20 + 2) * 10; // multiple of 10

            const correct = (pct / 100) * total;

            const options = new Set<number>();
            options.add(correct);
            while (options.size < 4) {
                options.add(correct + Math.floor(Math.random() * 10) - 5 || correct + 1);
            }

            setProblem({
                type: 'percentage',
                question: t('prop_pct_q', { pct, total }),
                data: { pct, total },
                options: Array.from(options).sort((a, b) => a - b),
                correctAnswer: correct
            });
        }
        setFeedback({ show: false, isCorrect: false });
    };

    useEffect(() => {
        generateProblem();
    }, [seed]);

    const handleAnswer = (ans: number) => {
        if (!problem) return;
        const isCorrect = ans === problem.correctAnswer;

        if (isCorrect) {
            addXP(30);
            new Audio('/sounds/correct.mp3').play().catch(() => { });
        } else {
            new Audio('/sounds/incorrect.mp3').play().catch(() => { });
        }

        let solution = "";
        if (problem.type === 'rule_three') {
            const { q1, cost1, q2 } = problem.data;
            solution = t('prop_sol_rule_three', { unit: cost1 / q1, q2, total: problem.correctAnswer });
        } else {
            solution = t('prop_sol_pct', { total: problem.data.total, factor: problem.data.pct / 100, answer: problem.correctAnswer });
        }

        setFeedback({
            show: true,
            isCorrect,
            solution: isCorrect ? undefined : solution
        });
    };

    if (!problem) return null;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                <div className="p-6 bg-pink-100 dark:bg-pink-900/30 flex justify-between items-center">
                    <h2 className="text-2xl font-black text-pink-600 dark:text-pink-400 flex items-center gap-2">
                        <span>⚖️</span>
                        {t('proportionality_title')}
                    </h2>
                    <Button variant="ghost" size="icon" onClick={() => setSeed(s => s + 1)}>
                        <RefreshCcw className="w-5 h-5" />
                    </Button>
                </div>

                <div className="p-8 flex flex-col items-center gap-10">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center">{problem.question}</h3>

                    <div className="text-8xl py-4">{problem.type === 'rule_three' ? '🍰' : '%'}</div>

                    <div className="grid grid-cols-2 gap-4 w-full">
                        {problem.options.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => handleAnswer(opt)}
                                className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl text-xl font-bold shadow hover:bg-pink-100 transition-colors border-2 border-transparent hover:border-pink-400"
                            >
                                {opt} {tCommon('units.euro')}
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
