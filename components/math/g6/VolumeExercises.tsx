'use client';

import { useState, useEffect } from 'react';
import { useGamificationStore } from '@/lib/gamification/store';
import ExerciseFeedback from '@/components/ExerciseFeedback';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';

type VolType = 'volume_cube' | 'circle_area'; // Kept 'circle_area' for type consistency though logic uses prism

interface VolProblem {
    type: VolType;
    question: string;
    data: any;
    options: number[];
    correctAnswer: number;
}

export default function VolumeExercises() {
    const t = useTranslations('MathGrade6');
    const tCommon = useTranslations('Common');
    const { addXP } = useGamificationStore();
    const [problem, setProblem] = useState<VolProblem | null>(null);
    const [seed, setSeed] = useState(0);
    const [feedback, setFeedback] = useState<{ show: boolean; isCorrect: boolean; solution?: string }>({ show: false, isCorrect: false });

    const generateProblem = () => {
        const type: VolType = Math.random() > 0.6 ? 'volume_cube' : 'circle_area';

        if (type === 'volume_cube') {
            const side = Math.floor(Math.random() * 5) + 2;
            const correct = side * side * side;

            const options = new Set<number>();
            options.add(correct);
            options.add(side * side); // Area mistake
            options.add(side * 6); // Perimeterish
            options.add(correct + 10);

            setProblem({
                type: 'volume_cube',
                question: t('volume_cube_q', { side }),
                data: { side },
                options: Array.from(options).sort((a, b) => a - b),
                correctAnswer: correct
            });
        } else {
            // Prism logic
            const w = Math.floor(Math.random() * 4) + 2;
            const h = Math.floor(Math.random() * 4) + 2;
            const d = Math.floor(Math.random() * 4) + 2;
            const correct = w * h * d;

            const options = new Set<number>();
            options.add(correct);
            while (options.size < 4) options.add(Math.floor(Math.random() * 20) + correct - 10 || correct + 1);

            setProblem({
                type: 'volume_cube', // reuse type logic key for convenience in state if needed, but visual uses data.
                question: t('volume_box_q', { w, h, d }),
                data: { w, h, d, isPrism: true },
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

        setFeedback({
            show: true,
            isCorrect,
            solution: isCorrect ? undefined : `${problem.correctAnswer} ${tCommon('units.m3')}`
        });
    };

    // Visuals
    const CubeVisual = ({ data }: { data: any }) => (
        <div className="relative w-32 h-32">
            {/* Simple CSS Cube representation */}
            <div className="w-20 h-20 border-2 border-black bg-blue-200 absolute top-8 left-4 z-10 flex items-center justify-center">
                {data.isPrism ? `${data.w}x${data.h}` : data.side}
            </div>
            <div className="w-20 h-20 border-2 border-black bg-blue-100 absolute top-4 left-8 z-0"></div>
            <div className="absolute top-8 left-24 w-8 h-20 border-2 border-black bg-blue-300 skew-y-12 origin-top-left transform translate-x-0.5"></div>
        </div>
    );

    if (!problem) return null;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                <div className="p-6 bg-indigo-100 dark:bg-indigo-900/30 flex justify-between items-center">
                    <h2 className="text-2xl font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                        <span>📦</span>
                        {t('volume_title')}
                    </h2>
                    <Button variant="ghost" size="icon" onClick={() => setSeed(s => s + 1)}>
                        <RefreshCcw className="w-5 h-5" />
                    </Button>
                </div>

                <div className="p-8 flex flex-col items-center gap-10">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center">{problem.question}</h3>

                    <div className="p-4 bg-gray-50 rounded-xl">
                        <CubeVisual data={problem.data} />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                        {problem.options.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => handleAnswer(opt)}
                                className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl text-xl font-bold shadow hover:bg-indigo-100 transition-colors border-2 border-transparent hover:border-indigo-400"
                            >
                                {opt} {tCommon('units.m3')}
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
