'use client';

import { useState, useEffect } from 'react';
import { useGamificationStore } from '@/lib/gamification/store';
import ExerciseFeedback from '@/components/ExerciseFeedback';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';

type IntPowerType = 'integers' | 'powers';

interface IntProblem {
    type: IntPowerType;
    question: string;
    data: any;
    options: number[];
    correctAnswer: number;
}

export default function IntegersExercises() {
    const t = useTranslations('MathGrade6');
    const { addXP } = useGamificationStore();
    const [problem, setProblem] = useState<IntProblem | null>(null);
    const [seed, setSeed] = useState(0);
    const [feedback, setFeedback] = useState<{ show: boolean; isCorrect: boolean; solution?: string }>({ show: false, isCorrect: false });

    const generateProblem = () => {
        const type: IntPowerType = Math.random() > 0.5 ? 'integers' : 'powers';

        if (type === 'integers') {
            // Elevator logic: "You are on floor 2 and go down 3 floors. Where are you?"
            const start = Math.floor(Math.random() * 5); // 0 to 4
            const down = Math.floor(Math.random() * 4) + start + 1; // Ensure negative result
            const correct = start - down;

            const options = new Set<number>();
            options.add(correct);
            options.add(start + down);
            options.add(down - start);
            options.add(correct - 1);

            setProblem({
                type: 'integers',
                question: t('integers_elevator_q', { start, down }),
                data: { start, down },
                options: Array.from(options).sort((a, b) => a - b),
                correctAnswer: correct
            });
        } else {
            // Powers: 3^2, 5^2, 2^3
            const base = Math.floor(Math.random() * 5) + 2;
            const exp = Math.random() > 0.7 ? 3 : 2;
            const correct = Math.pow(base, exp);

            const options = new Set<number>();
            options.add(correct);
            options.add(base * exp); // Classic mistake
            options.add(Math.pow(base + 1, exp));
            options.add(Math.pow(base, exp + 1));

            setProblem({
                type: 'powers',
                question: t('integers_power_q', { base, exp, sup: exp === 2 ? '²' : '³' }),
                data: { base, exp },
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
        if (problem.type === 'integers') {
            solution = `${problem.data.start} - ${problem.data.down} = ${problem.correctAnswer}`;
        } else {
            solution = `${problem.data.base} x ${problem.data.base}${problem.data.exp === 3 ? ` x ${problem.data.base}` : ''} = ${problem.correctAnswer}`;
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
                <div className="p-6 bg-cyan-100 dark:bg-cyan-900/30 flex justify-between items-center">
                    <h2 className="text-2xl font-black text-cyan-600 dark:text-cyan-400 flex items-center gap-2">
                        <span>📉</span>
                        {t('integers_title')}
                    </h2>
                    <Button variant="ghost" size="icon" onClick={() => setSeed(s => s + 1)}>
                        <RefreshCcw className="w-5 h-5" />
                    </Button>
                </div>

                <div className="p-8 flex flex-col items-center gap-10">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center">{problem.question}</h3>

                    <div className="text-6xl font-black text-cyan-500 bg-cyan-50 p-6 rounded-2xl border-2 border-cyan-200">
                        {problem.type === 'integers' ? '🏢' : `${problem.data.base}${problem.data.exp === 2 ? '²' : '³'}`}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                        {problem.options.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => handleAnswer(opt)}
                                className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl text-xl font-bold shadow hover:bg-cyan-100 transition-colors border-2 border-transparent hover:border-cyan-400"
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
