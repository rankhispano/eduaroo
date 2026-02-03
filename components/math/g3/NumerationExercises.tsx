'use client';

import { useState, useEffect } from 'react';
import { useGamificationStore } from '@/lib/gamification/store';
import ExerciseFeedback from '@/components/ExerciseFeedback';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface NumerationProblem {
    type: 'read' | 'sort';
    number: number;
    question: string;
    options: number[];
}

export default function NumerationExercises() {
    const t = useTranslations('MathGrade3');
    const { addXP } = useGamificationStore();
    const [problem, setProblem] = useState<NumerationProblem | null>(null);
    const [seed, setSeed] = useState(0);
    const [feedback, setFeedback] = useState<{ show: boolean; isCorrect: boolean; solution?: string }>({ show: false, isCorrect: false });
    const [userAnswer, setUserAnswer] = useState<number | null>(null);

    const generateProblem = () => {
        const type = Math.random() > 0.5 ? 'read' : 'sort';

        if (type === 'read') {
            const number = Math.floor(Math.random() * 90000) + 10000;
            const options = new Set<number>();
            options.add(number);
            while (options.size < 4) {
                const digits = number.toString().split('');
                const swapped = [...digits].sort(() => Math.random() - 0.5).join('');
                const fake = parseInt(swapped);
                if (fake !== number && fake >= 10000) options.add(fake);
                else options.add(number + Math.floor(Math.random() * 2000) - 1000);
            }

            setProblem({
                type: 'read',
                number,
                question: t('numeration_read_q'),
                options: Array.from(options).sort((a, b) => a - b)
            });
        } else {
            const nums: number[] = [];
            for (let i = 0; i < 4; i++) nums.push(Math.floor(Math.random() * 90000) + 10000);
            const biggest = Math.max(...nums);

            setProblem({
                type: 'sort',
                number: biggest,
                question: t('numeration_max_q'),
                options: nums
            });
        }

        setFeedback({ show: false, isCorrect: false });
        setUserAnswer(null);
    };

    useEffect(() => {
        generateProblem();
    }, [seed]);

    const handleAnswer = (ans: number) => {
        if (!problem) return;
        const isCorrect = ans === problem.number;
        setUserAnswer(ans);

        if (isCorrect) {
            addXP(20);
            new Audio('/sounds/correct.mp3').play().catch(() => { });
        } else {
            new Audio('/sounds/incorrect.mp3').play().catch(() => { });
        }

        setFeedback({
            show: true,
            isCorrect,
            solution: isCorrect ? undefined : `${problem.number.toLocaleString()}`
        });
    };

    if (!problem) return null;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                <div className="p-6 bg-red-100 dark:bg-red-900/30 flex justify-between items-center">
                    <h2 className="text-2xl font-black text-red-600 dark:text-red-400 flex items-center gap-2">
                        <span>🚀</span>
                        {t('numeration_title')}
                    </h2>
                    <Button variant="ghost" size="icon" onClick={() => setSeed(s => s + 1)}>
                        <RefreshCcw className="w-5 h-5" />
                    </Button>
                </div>

                <div className="p-8 flex flex-col items-center gap-12">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center">
                        {problem.question}
                    </h3>

                    {problem.type === 'read' && (
                        <div className="text-5xl font-black text-brand-blue tracking-wider bg-blue-50 dark:bg-blue-900/20 px-8 py-4 rounded-xl border-dashed border-2 border-brand-blue">
                            {problem.number.toLocaleString()}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
                        {problem.options.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => handleAnswer(opt)}
                                className={`
                                    p-8 rounded-2xl text-3xl font-bold transition-all border-b-4
                                    ${userAnswer === opt
                                        ? (opt === problem.number ? 'bg-green-500 border-green-700 text-white' : 'bg-red-500 border-red-700 text-white')
                                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:-translate-y-1 hover:border-red-400 hover:shadow-lg'
                                    }
                                `}
                            >
                                {opt.toLocaleString()}
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
