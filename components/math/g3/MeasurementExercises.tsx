'use client';

import { useState, useEffect } from 'react';
import { useGamificationStore } from '@/lib/gamification/store';
import ExerciseFeedback from '@/components/ExerciseFeedback';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

type QuestionType = 'bar_chart' | 'money_word';

interface MeasurementProblem {
    type: QuestionType;
    question: string;
    data: any;
    options: any[];
    correctAnswer: any;
}

export default function MeasurementExercises() {
    const t = useTranslations('MathGrade3');
    const { addXP } = useGamificationStore();
    const [problem, setProblem] = useState<MeasurementProblem | null>(null);
    const [seed, setSeed] = useState(0);
    const [feedback, setFeedback] = useState<{ show: boolean; isCorrect: boolean; solution?: string }>({ show: false, isCorrect: false });

    const generateProblem = () => {
        const type: QuestionType = Math.random() > 0.5 ? 'bar_chart' : 'money_word';

        if (type === 'bar_chart') {
            const categories = ['red', 'blue', 'green', 'yellow'];
            const values = categories.map(() => Math.floor(Math.random() * 8) + 2);

            // Pick a question: "Who has the most?" or "How many Blue?"
            if (Math.random() > 0.5) {
                // Find category with max
                const maxVal = Math.max(...values);
                const winnerIdx = values.indexOf(maxVal); // Simple tie-breaking: first one
                const correct = t(`colors.${categories[winnerIdx]}`);

                setProblem({
                    type: 'bar_chart',
                    question: t('measurement_bar_q_max'),
                    data: { categories, values },
                    options: categories.map(c => t(`colors.${c}`)).sort(() => Math.random() - 0.5),
                    correctAnswer: correct
                });
            } else {
                // How many for X?
                const targetIdx = Math.floor(Math.random() * categories.length);
                const correct = values[targetIdx];
                const colorLabel = t(`colors.${categories[targetIdx]}`);

                const options = new Set<number>();
                options.add(correct);
                while (options.size < 4) options.add(Math.floor(Math.random() * 10) + 1);

                setProblem({
                    type: 'bar_chart',
                    question: t('measurement_bar_q_count', { color: colorLabel }),
                    data: { categories, values },
                    options: Array.from(options).sort((a, b) => a - b),
                    correctAnswer: correct
                });
            }
        } else {
            // Money Word Problem
            // "Maria has 20€ and spends 5€. How much left?"
            const items = [
                { id: 'ball', cost: 5 },
                { id: 'book', cost: 12 },
                { id: 'icecream', cost: 3 },
                { id: 'toy', cost: 15 }
            ];
            const item = items[Math.floor(Math.random() * items.length)];
            const itemName = t(`items.${item.id}`);
            const wallet = Math.floor(Math.random() * 20) + item.cost + 5; // Ensure enough money
            const correct = wallet - item.cost;

            const options = new Set<number>();
            options.add(correct);
            while (options.size < 4) options.add(correct + Math.floor(Math.random() * 10) - 5);

            setProblem({
                type: 'money_word',
                question: t('measurement_money_q', { wallet, item: itemName, cost: item.cost }),
                data: { wallet, cost: item.cost },
                options: Array.from(options).sort((a, b) => a - b),
                correctAnswer: correct
            });
        }
        setFeedback({ show: false, isCorrect: false });
    };

    useEffect(() => {
        generateProblem();
    }, [seed]);

    const handleAnswer = (ans: any) => {
        if (!problem) return;
        const isCorrect = ans === problem.correctAnswer;

        if (isCorrect) {
            addXP(20);
            new Audio('/sounds/correct.mp3').play().catch(() => { });
        } else {
            new Audio('/sounds/incorrect.mp3').play().catch(() => { });
        }

        setFeedback({
            show: true,
            isCorrect,
            solution: isCorrect ? undefined : (typeof problem.correctAnswer === 'number' && problem.type === 'money_word' ? `${problem.correctAnswer}€` : `${problem.correctAnswer}`)
        });
    };

    // Visuals
    const BarChart = ({ cats, vals }: { cats: string[], vals: number[] }) => (
        <div className="flex items-end gap-6 h-48 border-b-2 border-l-2 border-gray-400 p-4">
            {cats.map((cat, i) => (
                <div key={i} className="flex flex-col items-center gap-2 w-16 group">
                    <div className="relative w-full bg-blue-100 rounded-t-md overflow-hidden flex items-end h-40">
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${vals[i] * 10}%` }}
                            className={`w-full ${cat === 'red' ? 'bg-red-400' :
                                cat === 'blue' ? 'bg-blue-400' :
                                    cat === 'green' ? 'bg-green-400' : 'bg-yellow-400'
                                }`}
                        />
                    </div>
                    <span className="text-xs font-bold rotate-45 origin-left translate-y-2">{t(`colors.${cat}`)}</span>
                </div>
            ))}
        </div>
    );

    if (!problem) return null;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                <div className="p-6 bg-violet-100 dark:bg-violet-900/30 flex justify-between items-center">
                    <h2 className="text-2xl font-black text-violet-600 dark:text-violet-400 flex items-center gap-2">
                        <span>📊</span>
                        {t('measurement_title')}
                    </h2>
                    <Button variant="ghost" size="icon" onClick={() => setSeed(s => s + 1)}>
                        <RefreshCcw className="w-5 h-5" />
                    </Button>
                </div>

                <div className="p-8 flex flex-col items-center gap-10">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 text-center">{problem.question}</h3>

                    <div className="flex justify-center items-center py-4 w-full">
                        {problem.type === 'bar_chart' ? (
                            <BarChart cats={problem.data.categories} vals={problem.data.values} />
                        ) : (
                            <div className="text-8xl">💶</div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                        {problem.options.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => handleAnswer(opt)}
                                className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl text-xl font-bold shadow hover:bg-violet-100 transition-colors border-2 border-transparent hover:border-violet-400"
                            >
                                {problem.type === 'money_word' ? `${opt}€` : opt}
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
