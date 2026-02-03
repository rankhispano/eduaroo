'use client';

import { useState, useEffect } from 'react';
import { useGamificationStore } from '@/lib/gamification/store';
import ExerciseFeedback from '@/components/ExerciseFeedback';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface NumerationProblem {
    type: 'identify_blocks';
    number: number;
    hundreds: number;
    tens: number;
    ones: number;
    options: number[];
}

export default function NumerationExercises() {
    const t = useTranslations('MathGrade2');
    const { addXP } = useGamificationStore();
    const [problem, setProblem] = useState<NumerationProblem | null>(null);
    const [seed, setSeed] = useState(0);
    const [feedback, setFeedback] = useState<{ show: boolean; isCorrect: boolean; solution?: string }>({ show: false, isCorrect: false });
    const [userAnswer, setUserAnswer] = useState<number | null>(null);

    const generateProblem = () => {
        // Generate number between 100 and 999
        const hundreds = Math.floor(Math.random() * 9) + 1; // 1-9
        const tens = Math.floor(Math.random() * 10);        // 0-9
        const ones = Math.floor(Math.random() * 10);        // 0-9

        const number = hundreds * 100 + tens * 10 + ones;

        // Options
        const options = new Set<number>();
        options.add(number);
        while (options.size < 4) {
            // Generate tricky options like swapping digits
            const r = Math.random();
            let fake = 0;
            if (r < 0.3) fake = hundreds * 100 + ones * 10 + tens; // Swap ten/one
            else if (r < 0.6) fake = tens * 100 + hundreds * 10 + ones; // Swap hun/ten
            else fake = number + Math.floor(Math.random() * 20) - 10;

            if (fake !== number && fake > 0) options.add(fake);
            else options.add(Math.floor(Math.random() * 900) + 100);
        }

        setProblem({
            type: 'identify_blocks',
            number,
            hundreds,
            tens,
            ones,
            options: Array.from(options).sort((a, b) => a - b)
        });
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
            addXP(15);
            new Audio('/sounds/correct.mp3').play().catch(() => { });
        } else {
            new Audio('/sounds/incorrect.mp3').play().catch(() => { });
        }

        setFeedback({
            show: true,
            isCorrect,
            solution: isCorrect ? undefined : `${problem.number}`
        });
    };

    // Block Visuals
    const BlockHundred = () => (
        <div className="w-24 h-24 bg-green-500 border-2 border-green-700 grid grid-cols-10 grid-rows-10 gap-px p-0.5 shadow-lg transform hover:scale-110 transition-transform">
            {Array.from({ length: 100 }).map((_, i) => <div key={i} className="bg-green-300 rounded-[1px]" />)}
        </div>
    );

    const BlockTen = () => (
        <div className="w-6 h-24 bg-blue-500 border-2 border-blue-700 flex flex-col gap-px p-0.5 shadow-md transform hover:scale-110 transition-transform">
            {Array.from({ length: 10 }).map((_, i) => <div key={i} className="bg-blue-300 flex-1 rounded-[1px]" />)}
        </div>
    );

    const BlockOne = () => (
        <div className="w-6 h-6 bg-yellow-500 border-2 border-yellow-700 p-1 shadow-sm transform hover:scale-110 transition-transform">
            <div className="w-full h-full bg-yellow-300 rounded-[1px]" />
        </div>
    );

    if (!problem) return null;

    return (
        <div className="max-w-5xl mx-auto p-4">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                <div className="p-6 bg-indigo-100 dark:bg-indigo-900/30 flex justify-between items-center">
                    <h2 className="text-2xl font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                        <span>🔢</span>
                        {t('numeration_title')}
                    </h2>
                    <Button variant="ghost" size="icon" onClick={() => setSeed(s => s + 1)}>
                        <RefreshCcw className="w-5 h-5" />
                    </Button>
                </div>

                <div className="p-8 flex flex-col items-center gap-10">
                    <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400">{t('numeration_q')}</h3>

                    <div className="flex flex-wrap justify-center items-end gap-12 py-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl w-full">
                        {/* Hundreds */}
                        <div className="flex flex-wrap gap-2 max-w-[300px] justify-center">
                            {Array.from({ length: problem.hundreds }).map((_, i) => <motion.div key={`h-${i}`} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.05 }}><BlockHundred /></motion.div>)}
                        </div>

                        {/* Tens */}
                        <div className="flex gap-2">
                            {Array.from({ length: problem.tens }).map((_, i) => <motion.div key={`t-${i}`} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + i * 0.05 }}><BlockTen /></motion.div>)}
                        </div>

                        {/* Ones */}
                        <div className="flex flex-wrap gap-2 max-w-[100px]">
                            {Array.from({ length: problem.ones }).map((_, i) => <motion.div key={`o-${i}`} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1 + i * 0.05 }}><BlockOne /></motion.div>)}
                        </div>
                    </div>

                    {/* Hint Labels (initially hidden or subtle?) -> Let's show them as count */}
                    <div className="flex gap-16 text-sm font-bold text-gray-400 uppercase tracking-widest text-center">
                        <div className="min-w-[100px]">{problem.hundreds} {t('hundreds')}</div>
                        <div className="min-w-[60px]">{problem.tens} {t('tens')}</div>
                        <div className="min-w-[60px]">{problem.ones} {t('ones')}</div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-4">
                        {problem.options.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => handleAnswer(opt)}
                                className={`
                            p-6 rounded-2xl text-4xl font-black transition-all border-b-4
                            ${userAnswer === opt
                                        ? (opt === problem.number ? 'bg-green-500 border-green-700 text-white' : 'bg-red-500 border-red-700 text-white')
                                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:-translate-y-1 hover:border-indigo-400'
                                    }
                        `}
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
