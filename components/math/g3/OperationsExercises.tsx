'use client';

import { useState, useEffect } from 'react';
import { useGamificationStore } from '@/lib/gamification/store';
import ExerciseFeedback from '@/components/ExerciseFeedback';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

type OpsType = 'multiplication' | 'division';

interface OperationsProblem {
    type: OpsType;
    question: string;
    data: any;
    options: number[];
    correctAnswer: number;
}

export default function OperationsExercises() {
    const t = useTranslations('MathGrade3');
    const { addXP } = useGamificationStore();
    const [problem, setProblem] = useState<OperationsProblem | null>(null);
    const [seed, setSeed] = useState(0);
    const [feedback, setFeedback] = useState<{ show: boolean; isCorrect: boolean; solution?: string }>({ show: false, isCorrect: false });

    const generateProblem = () => {
        const type: OpsType = Math.random() > 0.5 ? 'multiplication' : 'division';

        if (type === 'multiplication') {
            const rows = Math.floor(Math.random() * 5) + 2;
            const cols = Math.floor(Math.random() * 5) + 2;
            const result = rows * cols;

            const options = generateOptions(result);

            setProblem({
                type: 'multiplication',
                question: t('operations_mult_q'),
                data: { rows, cols },
                options,
                correctAnswer: result
            });
        } else {
            const divisors = [2, 3, 4, 5];
            const divisor = divisors[Math.floor(Math.random() * divisors.length)];
            const quotient = Math.floor(Math.random() * 4) + 2;
            const dividend = divisor * quotient;

            const options = generateOptions(quotient);

            setProblem({
                type: 'division',
                question: t('operations_div_q', { dividend, divisor }),
                data: { total: dividend, groups: divisor },
                options,
                correctAnswer: quotient
            });
        }
        setFeedback({ show: false, isCorrect: false });
    };

    const generateOptions = (correct: number) => {
        const opts = new Set<number>();
        opts.add(correct);
        while (opts.size < 4) {
            opts.add(correct + (Math.floor(Math.random() * 8) - 4) || correct + 1);
        }
        return Array.from(opts).sort((a, b) => a - b);
    };

    useEffect(() => {
        generateProblem();
    }, [seed]);

    const handleAnswer = (ans: number) => {
        if (!problem) return;
        const isCorrect = ans === problem.correctAnswer;

        if (isCorrect) {
            addXP(20);
            new Audio('/sounds/correct.mp3').play().catch(() => { });
        } else {
            new Audio('/sounds/incorrect.mp3').play().catch(() => { });
        }

        let solution = "";
        if (problem.type === 'multiplication') {
            solution = `${problem.data.rows} ${t('rows')} x ${problem.data.cols} ${t('cols')} = ${problem.correctAnswer}`;
        } else {
            solution = `${problem.data.total} ÷ ${problem.data.groups} = ${problem.correctAnswer}`;
        }

        setFeedback({
            show: true,
            isCorrect,
            solution: isCorrect ? undefined : solution
        });
    };

    const MultiplicationGrid = ({ rows, cols }: { rows: number, cols: number }) => (
        <div className="flex flex-col gap-1 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-inner">
            {Array.from({ length: rows }).map((_, r) => (
                <div key={r} className="flex gap-1">
                    {Array.from({ length: cols }).map((_, c) => (
                        <motion.div
                            key={c}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: r * 0.1 + c * 0.05 }}
                            className="w-12 h-12 bg-indigo-500 rounded-lg shadow-sm border border-indigo-600 hover:bg-indigo-400 transition-colors"
                        />
                    ))}
                </div>
            ))}
            <div className="mt-2 text-center text-gray-500 font-mono text-sm">
                {rows} x {cols}
            </div>
        </div>
    );

    const DivisionVisual = ({ total, groups }: { total: number, groups: number }) => (
        <div className="flex flex-col items-center gap-6">
            <div className="flex flex-wrap gap-2 justify-center max-w-[200px] p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-dashed border-yellow-300">
                {Array.from({ length: total }).map((_, i) => (
                    <span key={i} className="text-xl">🍬</span>
                ))}
            </div>

            <div className="text-2xl">⬇️</div>

            <div className="flex gap-4">
                {Array.from({ length: groups }).map((_, i) => (
                    <div key={i} className="w-24 h-24 bg-white dark:bg-gray-800 border-2 border-gray-300 rounded-full flex items-center justify-center shadow-lg relative">
                        <span className="text-3xl text-gray-200">👤</span>
                        <div className="absolute -bottom-6 text-sm text-gray-400 whitespace-nowrap">{t('child')} {i + 1}</div>
                    </div>
                ))}
            </div>
        </div>
    );

    if (!problem) return null;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                <div className="p-6 bg-indigo-100 dark:bg-indigo-900/30 flex justify-between items-center">
                    <h2 className="text-2xl font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                        <span>➗</span>
                        {t('operations_title')}
                    </h2>
                    <Button variant="ghost" size="icon" onClick={() => setSeed(s => s + 1)}>
                        <RefreshCcw className="w-5 h-5" />
                    </Button>
                </div>

                <div className="p-8 flex flex-col items-center gap-10">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 text-center">{problem.question}</h3>

                    <div className="flex justify-center items-center py-4">
                        {problem.type === 'multiplication'
                            ? <MultiplicationGrid rows={problem.data.rows} cols={problem.data.cols} />
                            : <DivisionVisual total={problem.data.total} groups={problem.data.groups} />
                        }
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                        {problem.options.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => handleAnswer(opt)}
                                className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl text-3xl font-bold shadow hover:bg-indigo-100 transition-colors border-2 border-transparent hover:border-indigo-400"
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
