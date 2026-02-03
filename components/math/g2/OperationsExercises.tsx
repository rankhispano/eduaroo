'use client';

import { useState, useEffect } from 'react';
import { useGamificationStore } from '@/lib/gamification/store';
import ExerciseFeedback from '@/components/ExerciseFeedback';
import { Button } from '@/components/ui/button';
import { RefreshCcw, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

type ProblemType = 'sum_carry' | 'mult_intro';

interface OperationsProblem {
    type: ProblemType;
    question: string;
    data: any;
    options: number[];
    correctAnswer: number;
}

export default function OperationsExercises() {
    const t = useTranslations('MathGrade2');
    const { addXP } = useGamificationStore();
    const [problem, setProblem] = useState<OperationsProblem | null>(null);
    const [seed, setSeed] = useState(0);
    const [feedback, setFeedback] = useState<{ show: boolean; isCorrect: boolean; solution?: string }>({ show: false, isCorrect: false });
    const [step, setStep] = useState(0); // For multi-step interaction if needed

    const generateProblem = () => {
        const type: ProblemType = Math.random() > 0.4 ? 'sum_carry' : 'mult_intro';

        if (type === 'sum_carry') {
            // Find two numbers that when added, have at least one carry
            let a, b;
            do {
                a = Math.floor(Math.random() * 80) + 15;
                b = Math.floor(Math.random() * 80) + 15;
            } while ((a % 10) + (b % 10) < 10); // Ensure carry in ones place

            const result = a + b;
            const options = generateOptions(result);

            setProblem({
                type: 'sum_carry',
                question: 'operations_sum_carry',
                data: { a, b },
                options,
                correctAnswer: result
            });
        } else {
            // Intro to Multiplications: Groups of items
            // "3 groups of 4"
            const groups = Math.floor(Math.random() * 4) + 2; // 2-5 groups
            const itemsPerGroup = Math.floor(Math.random() * 5) + 2; // 2-6 items
            const result = groups * itemsPerGroup;

            const options = generateOptions(result);

            setProblem({
                type: 'mult_intro',
                question: 'operations_mult_intro',
                data: { groups, itemsPerGroup, emoji: ['🍎', '🍪', '⭐', '🎈'][Math.floor(Math.random() * 4)] },
                options,
                correctAnswer: result
            });
        }
        setFeedback({ show: false, isCorrect: false });
        setStep(0);
    };

    const generateOptions = (correct: number) => {
        const opts = new Set<number>();
        opts.add(correct);
        while (opts.size < 4) {
            opts.add(correct + (Math.floor(Math.random() * 10) - 5) || correct + 1);
        }
        return Array.from(opts).sort((a, b) => a - b);
    }

    useEffect(() => {
        generateProblem();
    }, [seed]);

    const handleAnswer = (ans: number) => {
        if (!problem) return;
        const isCorrect = ans === problem.correctAnswer;

        if (isCorrect) {
            addXP(15);
            new Audio('/sounds/correct.mp3').play().catch(() => { });
        } else {
            new Audio('/sounds/incorrect.mp3').play().catch(() => { });
        }

        let sol = `${problem.correctAnswer}`;
        if (problem.type === 'mult_intro') {
            sol = `${problem.data.groups} x ${problem.data.itemsPerGroup} = ${problem.correctAnswer}`;
        }

        setFeedback({
            show: true,
            isCorrect,
            solution: isCorrect ? undefined : sol
        });
    };

    // Components
    const CarrySumVisual = ({ a, b }: { a: number, b: number }) => {
        // Decompose
        const aTens = Math.floor(a / 10);
        const aOnes = a % 10;
        const bTens = Math.floor(b / 10);
        const bOnes = b % 10;

        return (
            <div className="flex text-5xl font-black font-mono gap-4 items-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-inner border-2 border-dashed border-gray-300">
                <div className="flex flex-col items-end gap-2 text-gray-800 dark:text-gray-100">
                    <div className="text-gray-400 text-sm font-sans tracking-widest text-right w-full mb-2">{t('tens_short')} {t('ones_short')}</div>
                    <div>{aTens} {aOnes}</div>
                    <div className="flex items-center gap-2">
                        <span className="text-brand-blue text-4xl mt-1">+</span> {bTens} {bOnes}
                    </div>
                    <div className="w-full h-1 bg-gray-800 dark:bg-gray-200 mt-2"></div>
                    <div className="text-brand-blue animate-pulse">?</div>
                </div>
            </div>
        );
    };

    const MultVisual = ({ groups, items, emoji }: { groups: number, items: number, emoji: string }) => {
        return (
            <div className="flex flex-wrap gap-8 justify-center items-center">
                {Array.from({ length: groups }).map((_, g) => (
                    <div key={g} className="bg-white dark:bg-gray-800 p-4 rounded-2xl border-2 border-indigo-100 shadow-lg flex flex-wrap gap-2 w-32 justify-center relative">
                        <div className="absolute -top-3 bg-indigo-500 text-white text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">{t('group_label')} {g + 1}</div>
                        {Array.from({ length: items }).map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: g * 0.1 + i * 0.05 }}
                                className="text-2xl"
                            >
                                {emoji}
                            </motion.div>
                        ))}
                    </div>
                ))}
                <div className="flex flex-col items-center justify-center text-gray-500 font-bold text-lg">
                    <div className="text-3xl mb-1">{groups}</div>
                    <div className="whitespace-nowrap">{t('times')}</div>
                    <div className="text-3xl mt-1">{items}</div>
                </div>
            </div>
        );
    };

    if (!problem) return null;

    // Derive repeated addition string for mult
    const repeatedAdd = problem.type === 'mult_intro'
        ? Array(problem.data.groups).fill(problem.data.itemsPerGroup).join(' + ') + ' = ?'
        : '';

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                <div className="p-6 bg-pink-100 dark:bg-pink-900/30 flex justify-between items-center">
                    <h2 className="text-2xl font-black text-pink-600 dark:text-pink-400 flex items-center gap-2">
                        <span>🧮</span>
                        {t('operations_title')}
                    </h2>
                    <Button variant="ghost" size="icon" onClick={() => setSeed(s => s + 1)}>
                        <RefreshCcw className="w-5 h-5" />
                    </Button>
                </div>

                <div className="p-8 flex flex-col items-center gap-10">
                    {problem.type === 'sum_carry' ? (
                        <>
                            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">{t('operations_sum_carry')}</h3>
                            <CarrySumVisual a={problem.data.a} b={problem.data.b} />
                        </>
                    ) : (
                        <>
                            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">{t(problem.question)}</h3>
                            <MultVisual groups={problem.data.groups} items={problem.data.itemsPerGroup} emoji={problem.data.emoji} />
                            <div className="text-2xl font-mono font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-6 py-2 rounded-lg">
                                {repeatedAdd}
                            </div>
                        </>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                        {problem.options.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => handleAnswer(opt)}
                                className="p-6 rounded-2xl text-3xl font-black bg-gray-50 dark:bg-gray-800 hover:bg-pink-100 border-2 border-transparent hover:border-pink-300 transition-all shadow"
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
