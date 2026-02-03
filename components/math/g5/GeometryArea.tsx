'use client';

import { useState, useEffect } from 'react';
import { useGamificationStore } from '@/lib/gamification/store';
import ExerciseFeedback from '@/components/ExerciseFeedback';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface GeometryProblem {
    type: 'area_rect' | 'area_tri';
    question: string;
    data: { width: number, height: number, base?: number };
    options: number[];
    correctAnswer: number;
}

export default function GeometryArea() {
    const t = useTranslations('MathGrade5');
    const tCommon = useTranslations('Common');
    const { addXP } = useGamificationStore();
    const [problem, setProblem] = useState<GeometryProblem | null>(null);
    const [seed, setSeed] = useState(0);
    const [feedback, setFeedback] = useState<{ show: boolean; isCorrect: boolean; solution?: string }>({ show: false, isCorrect: false });

    const generateProblem = () => {
        const type = Math.random() > 0.5 ? 'area_rect' : 'area_tri';

        const w = Math.floor(Math.random() * 8) + 3;
        const h = Math.floor(Math.random() * 8) + 3;

        let correct = 0;
        let question = "";

        if (type === 'area_rect') {
            correct = w * h;
            question = t('geometry_area_rect_q');
        } else {
            correct = (w * h) / 2; // w=base, h=height
            if (!Number.isInteger(correct)) {
                // Force integer area for simplicity if needed, or handle decimals
                // let's stick to simple
                return generateProblem(); // Retry
            }
            question = t('geometry_area_tri_q');
        }

        const options = new Set<number>();
        options.add(correct);
        while (options.size < 4) {
            options.add(correct + Math.floor(Math.random() * 10) - 5 || correct + 1);
        }

        // Add common mistake: Perimeter instead of Area
        const perimeter = type === 'area_rect' ? 2 * (w + h) : w + h + Math.sqrt(w * w + h * h); // approx
        if (perimeter !== correct) options.add(Math.floor(perimeter));

        setProblem({
            type,
            question,
            data: { width: w, height: h },
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
            addXP(25);
            new Audio('/sounds/correct.mp3').play().catch(() => { });
        } else {
            new Audio('/sounds/incorrect.mp3').play().catch(() => { });
        }

        let formula = problem.type === 'area_rect' ? t('geometry_rect_formula') : t('geometry_tri_formula');
        setFeedback({
            show: true,
            isCorrect,
            solution: isCorrect ? undefined : `${formula}.\nResult: ${problem.correctAnswer} ${tCommon('units.m2')}`
        });
    };

    // Visuals
    const ShapeVisual = ({ type, w, h }: { type: string, w: number, h: number }) => (
        <div className="relative border-2 border-gray-800 bg-blue-100 flex items-center justify-center"
            style={{
                width: `${w * 20}px`,
                height: `${h * 20}px`,
                clipPath: type === 'area_tri' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none'
            }}
        >
            {/* Labels - positioned absolutely relative to container wrapper usually, but here simple centered text */}
        </div>
    );

    if (!problem) return null;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                <div className="p-6 bg-lime-100 dark:bg-lime-900/30 flex justify-between items-center">
                    <h2 className="text-2xl font-black text-lime-700 dark:text-lime-400 flex items-center gap-2">
                        <span>📐</span>
                        {t('geometry_title')}
                    </h2>
                    <Button variant="ghost" size="icon" onClick={() => setSeed(s => s + 1)}>
                        <RefreshCcw className="w-5 h-5" />
                    </Button>
                </div>

                <div className="p-8 flex flex-col items-center gap-10">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center">{problem.question}</h3>

                    <div className="relative p-10 bg-gray-50 rounded-xl">
                        <ShapeVisual type={problem.type} w={problem.data.width} h={problem.data.height} />

                        {/* Dimensions Labels - overlaid */}
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 font-mono text-xs text-gray-500">
                            {/* Height label is harder with pure CSS clip-path triangle, skipping exact placement for speed */}
                        </div>
                        <div className="mt-4 text-center font-bold text-gray-600">
                            {t('geometry_base')}: {problem.data.width} m | {t('geometry_height')}: {problem.data.height} m
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                        {problem.options.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => handleAnswer(opt)}
                                className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl text-xl font-bold shadow hover:bg-lime-200 transition-colors border-2 border-transparent hover:border-lime-400"
                            >
                                {opt} {tCommon('units.m2')}
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
