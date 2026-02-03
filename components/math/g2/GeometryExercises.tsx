'use client';

import { useState, useEffect } from 'react';
import { useGamificationStore } from '@/lib/gamification/store';
import ExerciseFeedback from '@/components/ExerciseFeedback';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

type QuestionType = 'identify_3d' | 'symmetry';

interface GeometryProblem {
    type: QuestionType;
    question: string;
    target?: string;
    options: { id: string; type: string; label?: string }[];
    correctId: string;
}

export default function GeometryExercises() {
    const t = useTranslations('MathGrade2');
    const { addXP } = useGamificationStore();
    const [problem, setProblem] = useState<GeometryProblem | null>(null);
    const [seed, setSeed] = useState(0);
    const [feedback, setFeedback] = useState<{ show: boolean; isCorrect: boolean; solution?: string }>({ show: false, isCorrect: false });

    const SHAPES_3D = ['cube', 'sphere', 'cylinder', 'cone'];
    const LABELS_3D: Record<string, string> = {
        'cube': 'Cubo',
        'sphere': 'Esfera',
        'cylinder': 'Cilindro',
        'cone': 'Cono'
    };

    const generateProblem = () => {
        // 70% chance of 3D shapes, 30% symmetry visualization (simplified)
        const type: QuestionType = Math.random() > 0.3 ? 'identify_3d' : 'symmetry';

        if (type === 'identify_3d') {
            const target = SHAPES_3D[Math.floor(Math.random() * SHAPES_3D.length)];
            const correctId = 'correct';

            // Distractions
            const distractions = SHAPES_3D.filter(s => s !== target)
                .sort(() => Math.random() - 0.5)
                .slice(0, 3);

            const options = [
                { id: correctId, type: target },
                { id: 'dist1', type: distractions[0] },
                { id: 'dist2', type: distractions[1] },
                { id: 'dist3', type: distractions[2] }
            ].sort(() => Math.random() - 0.5);

            setProblem({
                type: 'identify_3d',
                question: t('geometry_3d_q', { shape: t(`geometry_shapes.${target}`) }),
                target,
                options,
                correctId
            });
        } else {
            // Symmetry - Identify the symmetric shape
            // Simple logic: One real butterfly, one broken.
            const correctId = 'correct';
            const options = [
                { id: correctId, type: 'symmetric' },
                { id: 'wrong', type: 'asymmetric' },
            ].sort(() => Math.random() - 0.5);

            setProblem({
                type: 'symmetry',
                question: t('geometry_symmetry_q'),
                options,
                correctId
            });
        }
        setFeedback({ show: false, isCorrect: false });
    };

    useEffect(() => {
        generateProblem();
    }, [seed]);

    const handleAnswer = (id: string) => {
        if (!problem) return;
        const isCorrect = id === problem.correctId;

        if (isCorrect) {
            addXP(15);
            new Audio('/sounds/correct.mp3').play().catch(() => { });
        } else {
            new Audio('/sounds/incorrect.mp3').play().catch(() => { });
        }

        let solutionText = "";
        if (problem.type === 'identify_3d') {
            solutionText = t('geometry_3d_q', { shape: t(`geometry_shapes.${problem.target!}`) });
        } else {
            solutionText = t('geometry_symmetry_q');
        }

        setFeedback({
            show: true,
            isCorrect,
            solution: isCorrect ? undefined : solutionText
        });
    };

    const renderShape = (type: string) => {
        // ... switch case unchanged ...
        switch (type) {
            case 'cube':
                return (
                    <svg width="100" height="100" viewBox="0 0 100 100" className="stroke-indigo-600 fill-indigo-200 stroke-2">
                        <path d="M 30 30 L 70 30 L 70 70 L 30 70 Z" />
                        <path d="M 30 30 L 50 10 L 90 10 L 70 30" fill="none" />
                        <path d="M 90 10 L 90 50 L 70 70" fill="none" />
                    </svg>
                );
            case 'sphere':
                return (
                    <svg width="100" height="100" viewBox="0 0 100 100" className="stroke-blue-600 fill-blue-300 stroke-2">
                        <circle cx="50" cy="50" r="35" />
                        <ellipse cx="50" cy="50" rx="35" ry="10" fill="none" strokeOpacity="0.3" />
                        <path d="M 60 30 Q 70 40 65 50" fill="none" stroke="white" strokeWidth="3" />
                    </svg>
                );
            case 'cylinder':
                return (
                    <svg width="100" height="100" viewBox="0 0 100 100" className="stroke-teal-600 fill-teal-200 stroke-2">
                        <ellipse cx="50" cy="20" rx="30" ry="10" />
                        <path d="M 20 20 L 20 80" />
                        <path d="M 80 20 L 80 80" />
                        <ellipse cx="50" cy="80" rx="30" ry="10" />
                    </svg>
                );
            case 'cone':
                return (
                    <svg width="100" height="100" viewBox="0 0 100 100" className="stroke-orange-600 fill-orange-200 stroke-2">
                        <path d="M 50 10 L 20 80 L 80 80 Z" />
                        <ellipse cx="50" cy="80" rx="30" ry="8" />
                    </svg>
                );
            case 'symmetric':
                return (
                    <svg width="100" height="100" viewBox="0 0 100 100" className="fill-pink-300 stroke-pink-600 stroke-2">
                        <path d="M 50 20 C 20 20 10 40 50 80 C 90 40 80 20 50 20 Z" />
                        <line x1="50" y1="10" x2="50" y2="90" strokeDasharray="4 4" stroke="gray" />
                    </svg>
                );
            case 'asymmetric':
                return (
                    <svg width="100" height="100" viewBox="0 0 100 100" className="fill-purple-300 stroke-purple-600 stroke-2">
                        <path d="M 50 20 C 10 20 10 60 50 80 C 100 60 60 10 50 20 Z" />
                    </svg>
                );
            default: return null;
        }
    };

    if (!problem) return null;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                <div className="p-6 bg-indigo-100 dark:bg-indigo-900/30 flex justify-between items-center">
                    <h2 className="text-2xl font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                        <span>🧊</span>
                        {t('geometry_title')}
                    </h2>
                    <Button variant="ghost" size="icon" onClick={() => setSeed(s => s + 1)}>
                        <RefreshCcw className="w-5 h-5" />
                    </Button>
                </div>

                <div className="p-8 flex flex-col items-center gap-10">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center">{problem.question}</h3>

                    <div className="flex flex-wrap gap-8 justify-center items-center mt-4">
                        {problem.options.map((opt, i) => (
                            <motion.button
                                key={i}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleAnswer(opt.id)}
                                className="p-8 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-indigo-300 w-40 h-40 flex items-center justify-center"
                            >
                                {renderShape(opt.type)}
                            </motion.button>
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
