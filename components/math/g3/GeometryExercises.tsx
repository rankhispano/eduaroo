'use client';

import { useState, useEffect } from 'react';
import { useGamificationStore } from '@/lib/gamification/store';
import ExerciseFeedback from '@/components/ExerciseFeedback';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

type QuestionType = 'polygon_sides' | 'circle_parts';

interface GeometryProblem {
    type: QuestionType;
    question: string;
    data: any;
    options: any[]; // string or number
    correctAnswer: any;
}

export default function GeometryExercises() {
    const t = useTranslations('MathGrade3');
    const { addXP } = useGamificationStore();
    const [problem, setProblem] = useState<GeometryProblem | null>(null);
    const [seed, setSeed] = useState(0);
    const [feedback, setFeedback] = useState<{ show: boolean; isCorrect: boolean; solution?: string }>({ show: false, isCorrect: false });

    const POLYGONS = [
        { id: 'triangle', sides: 3, path: 'M 50 10 L 10 90 L 90 90 Z' },
        { id: 'square', sides: 4, path: 'M 20 20 L 80 20 L 80 80 L 20 80 Z' },
        { id: 'pentagon', sides: 5, path: 'M 50 10 L 90 40 L 75 90 L 25 90 L 10 40 Z' },
        { id: 'hexagon', sides: 6, path: 'M 30 10 L 70 10 L 90 50 L 70 90 L 30 90 L 10 50 Z' },
    ];

    const CIRCLE_PARTS = [
        { id: 'center' },
        { id: 'radius' },
        { id: 'diameter' },
        { id: 'circumference' }
    ];

    const generateProblem = () => {
        const type: QuestionType = Math.random() > 0.5 ? 'polygon_sides' : 'circle_parts';

        if (type === 'polygon_sides') {
            const poly = POLYGONS[Math.floor(Math.random() * POLYGONS.length)];
            const correct = poly.sides;

            const options = new Set<number>();
            options.add(correct);
            while (options.size < 4) {
                const fake = Math.floor(Math.random() * 5) + 3;
                options.add(fake);
            }

            setProblem({
                type: 'polygon_sides',
                question: t('geometry_polygon_q'),
                data: { poly },
                options: Array.from(options).sort((a, b) => a - b),
                correctAnswer: correct
            });
        } else {
            // Identify circle part
            const part = CIRCLE_PARTS[Math.floor(Math.random() * CIRCLE_PARTS.length)];

            // We need localized labels for options
            const options = CIRCLE_PARTS.map(p => t(`geometry_parts.${p.id}`)).sort(() => Math.random() - 0.5);
            const correct = t(`geometry_parts.${part.id}`);

            setProblem({
                type: 'circle_parts',
                question: t('geometry_circle_q'),
                data: { partId: part.id },
                options,
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
            addXP(15);
            new Audio('/sounds/correct.mp3').play().catch(() => { });
        } else {
            new Audio('/sounds/incorrect.mp3').play().catch(() => { });
        }

        setFeedback({
            show: true,
            isCorrect,
            solution: isCorrect ? undefined : `${problem.correctAnswer}`
        });
    };

    // Visuals
    const PolygonVisual = ({ poly }: { poly: any }) => (
        <svg width="150" height="150" viewBox="0 0 100 100" className="stroke-teal-600 fill-teal-100 stroke-[3px]">
            <path d={poly.path} />
        </svg>
    );

    const CircleVisual = ({ partId }: { partId: string }) => (
        <svg width="150" height="150" viewBox="0 0 100 100">
            {/* Base Circle */}
            <circle cx="50" cy="50" r="40" className={`stroke-[3px] fill-white ${partId === 'circumference' ? 'stroke-red-500' : 'stroke-gray-300'}`} />

            {partId === 'center' && (
                <circle cx="50" cy="50" r="4" className="fill-red-500" />
            )}

            {partId === 'radius' && (
                <>
                    <circle cx="50" cy="50" r="2" className="fill-gray-400" />
                    <line x1="50" y1="50" x2="90" y2="50" className="stroke-red-500 stroke-[3px]" />
                </>
            )}

            {partId === 'diameter' && (
                <line x1="10" y1="50" x2="90" y2="50" className="stroke-red-500 stroke-[3px]" />
            )}
        </svg>
    );

    if (!problem) return null;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                <div className="p-6 bg-teal-100 dark:bg-teal-900/30 flex justify-between items-center">
                    <h2 className="text-2xl font-black text-teal-600 dark:text-teal-400 flex items-center gap-2">
                        <span>📐</span>
                        {t('geometry_title')}
                    </h2>
                    <Button variant="ghost" size="icon" onClick={() => setSeed(s => s + 1)}>
                        <RefreshCcw className="w-5 h-5" />
                    </Button>
                </div>

                <div className="p-8 flex flex-col items-center gap-10">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 text-center">{problem.question}</h3>

                    <div className="flex justify-center items-center py-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl w-full max-w-sm">
                        {problem.type === 'polygon_sides'
                            ? <PolygonVisual poly={problem.data.poly} />
                            : <CircleVisual partId={problem.data.partId} />
                        }
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full">
                        {problem.options.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => handleAnswer(opt)}
                                className="p-6 bg-white dark:bg-gray-700 rounded-xl text-xl font-bold shadow hover:bg-teal-100 dark:hover:bg-teal-900/40 transition-colors border-2 border-transparent hover:border-teal-400"
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
