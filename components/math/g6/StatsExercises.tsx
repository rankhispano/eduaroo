'use client';

import { useState, useEffect } from 'react';
import { useGamificationStore } from '@/lib/gamification/store';
import ExerciseFeedback from '@/components/ExerciseFeedback';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';

type StatType = 'mean' | 'median' | 'mode' | 'range';

interface StatProblem {
    type: StatType;
    question: string;
    data: number[];
    options: number[];
    correctAnswer: number;
}

export default function StatsExercises() {
    const t = useTranslations('MathGrade6');
    const { addXP } = useGamificationStore();
    const [problem, setProblem] = useState<StatProblem | null>(null);
    const [seed, setSeed] = useState(0);
    const [feedback, setFeedback] = useState<{ show: boolean; isCorrect: boolean; solution?: string }>({ show: false, isCorrect: false });

    const generateProblem = () => {
        // Generate small dataset
        const len = 5; // keep it odd for median simplicity
        const data = Array.from({ length: len }, () => Math.floor(Math.random() * 9) + 1);

        // Pick type
        const types: StatType[] = ['mean', 'median', 'mode', 'range'];

        // Ensure 'mode' works well (needs repetition), or force it
        const type = types[Math.floor(Math.random() * types.length)];

        // If Mode, ensure we have a clear mode
        if (type === 'mode') {
            const modeVal = Math.floor(Math.random() * 9) + 1;
            data[0] = modeVal;
            data[1] = modeVal;
            // Rest random
        }

        // If Mean, ensure integer result or easy decimal
        if (type === 'mean') {
            // Adjust last number to make sum divisible by len
            const sumPartial = data.slice(0, len - 1).reduce((a, b) => a + b, 0);
            const remainder = sumPartial % len;
            // Calculate what data[0] should be to make total sum divisible by len (simplified logic)
            // Just regenerate data[0] such that total sum % len === 0
            // sum = sumPartial + data[last]
            // (sumPartial + x) % len = 0  => x = (len - (sumPartial % len)) % len
            const neededRemainder = (len - (sumPartial % len)) % len;
            // data[0] needs to have this remainder modulo len.
            // Let's just create a valid number.
            let x = Math.floor(Math.random() * 2) * len + neededRemainder;
            if (x === 0) x = len;
            data[len - 1] = x; // use last element
        }

        const sorted = [...data].sort((a, b) => a - b);
        let correct = 0;

        switch (type) {
            case 'mean':
                correct = data.reduce((a, b) => a + b, 0) / len;
                break;
            case 'median':
                correct = sorted[Math.floor(len / 2)];
                break;
            case 'mode':
                // Simple mode calc
                const counts: Record<number, number> = {};
                data.forEach(n => counts[n] = (counts[n] || 0) + 1);
                let maxCount = 0;
                let mode = data[0];
                for (let k in counts) {
                    if (counts[k] > maxCount) {
                        maxCount = counts[k];
                        mode = parseInt(k);
                    }
                }
                correct = mode;
                break;
            case 'range':
                correct = sorted[len - 1] - sorted[0];
                break;
        }

        const options = new Set<number>();
        options.add(correct);
        while (options.size < 4) {
            options.add(correct + Math.floor(Math.random() * 5) - 2 || correct + 1);
        }

        // Ensure confusion logic
        if (type === 'median' && options.has(sorted[0])) options.add(sorted[len - 1]); // mix min/max

        setProblem({
            type,
            question: t('stats_q', { stat: t(`stats_labels.${type}`) }),
            data,
            options: Array.from(options).sort((a, b) => a - b),
            correctAnswer: correct
        });

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

        let sol = `${problem.correctAnswer}`;
        if (problem.type === 'median') sol += t('stats_sol_sorted', { data: [...problem.data].sort((a, b) => a - b).join(', ') });
        if (problem.type === 'range') sol += ` (${Math.max(...problem.data)} - ${Math.min(...problem.data)})`;

        setFeedback({
            show: true,
            isCorrect,
            solution: isCorrect ? undefined : sol
        });
    };

    if (!problem) return null;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                <div className="p-6 bg-emerald-100 dark:bg-emerald-900/30 flex justify-between items-center">
                    <h2 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                        <span>📊</span>
                        {t('stats_title')}
                    </h2>
                    <Button variant="ghost" size="icon" onClick={() => setSeed(s => s + 1)}>
                        <RefreshCcw className="w-5 h-5" />
                    </Button>
                </div>

                <div className="p-8 flex flex-col items-center gap-10">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center">{problem.question}</h3>

                    <div className="flex gap-4 p-6 bg-slate-100 rounded-xl">
                        {problem.data.map((n, i) => (
                            <div key={i} className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl font-bold shadow border border-slate-300">
                                {n}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                        {problem.options.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => handleAnswer(opt)}
                                className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl text-xl font-bold shadow hover:bg-emerald-100 transition-colors border-2 border-transparent hover:border-emerald-400"
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
