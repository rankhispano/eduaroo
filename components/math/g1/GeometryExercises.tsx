'use client';

import { useState, useEffect, useCallback } from 'react';
import { useGamificationStore } from '@/lib/gamification/store';
import ExerciseFeedback from '@/components/ExerciseFeedback';
import ProgressBar from '@/components/ProgressBar';
import { Button } from '@/components/ui/button';
import { RefreshCcw, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

type QuestionType = 'identify_shape' | 'open_closed';

interface GeometryProblem {
    id: number;
    type: QuestionType;
    target: string;
    options: { id: string; type: string }[];
    correctId: string;
}

export default function GeometryExercises() {
    const t = useTranslations('MathGrade1');
    const { addXP } = useGamificationStore();
    const [problems, setProblems] = useState<GeometryProblem[]>([]);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [showResults, setShowResults] = useState(false);
    const [feedback, setFeedback] = useState<{ show: boolean; isCorrect: boolean }>({ show: false, isCorrect: false });
    const [seed, setSeed] = useState(0);
    const [completedCount, setCompletedCount] = useState(0);

    const SHAPES = ['circle', 'square', 'triangle', 'rectangle'];

    const generateProblems = useCallback(() => {
        const newProblems: GeometryProblem[] = [];
        let idCounter = 1;

        // Identify shape (4)
        const usedShapes = new Set<string>();
        while (newProblems.filter(p => p.type === 'identify_shape').length < 4) {
            const targetShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
            if (usedShapes.has(targetShape)) continue;
            usedShapes.add(targetShape);
            const distractions = SHAPES.filter(s => s !== targetShape)
                .sort(() => Math.random() - 0.5)
                .slice(0, 3);
            const options = [
                { id: 'correct', type: targetShape },
                { id: 'dist1', type: distractions[0] },
                { id: 'dist2', type: distractions[1] },
                { id: 'dist3', type: distractions[2] }
            ].sort(() => Math.random() - 0.5);

            newProblems.push({
                id: idCounter++,
                type: 'identify_shape',
                target: targetShape,
                options,
                correctId: 'correct'
            });
        }

        // Open/Closed (2)
        const usedOpenClosed = new Set<string>();
        while (newProblems.filter(p => p.type === 'open_closed').length < 2) {
            const isOpenTarget = Math.random() > 0.5;
            const target = isOpenTarget ? 'open_label' : 'closed_label';
            if (usedOpenClosed.has(target)) continue;
            usedOpenClosed.add(target);
            const options = [
                { id: 'correct', type: isOpenTarget ? 'open_line' : 'closed_shape' },
                { id: 'wrong', type: isOpenTarget ? 'closed_shape' : 'open_line' }
            ].sort(() => Math.random() - 0.5);

            newProblems.push({
                id: idCounter++,
                type: 'open_closed',
                target,
                options,
                correctId: 'correct'
            });
        }

        setProblems(newProblems);
        setAnswers({});
        setShowResults(false);
        setCompletedCount(0);
    }, []);

    useEffect(() => {
        generateProblems();
    }, [generateProblems, seed]);

    const isCorrect = (p: GeometryProblem) => answers[p.id] === p.correctId;

    const handleCheck = () => {
        const total = problems.length;
        const score = problems.filter(p => isCorrect(p)).length;
        if (score > 0) addXP(score * 5);
        setShowResults(true);
        setCompletedCount(score);
        setFeedback({ show: true, isCorrect: score >= total * 0.7 });
    };

    const renderShape = (type: string) => {
        switch (type) {
            case 'circle':
                return <div className="w-24 h-24 rounded-full bg-red-400 border-4 border-red-600" />;
            case 'square':
                return <div className="w-24 h-24 bg-blue-400 border-4 border-blue-600" />;
            case 'triangle':
                return <div className="w-0 h-0 border-l-50 border-r-50 border-b-100 border-l-transparent border-r-transparent border-b-green-500 hover:border-b-green-600" />;
            case 'rectangle':
                return <div className="w-32 h-20 bg-yellow-400 border-4 border-yellow-600" />;
            case 'open_line':
                return (
                    <svg width="100" height="100" viewBox="0 0 100 100" className="stroke-purple-500 stroke-[5px] fill-none">
                        <path d="M 10 10 Q 50 90 90 10" />
                    </svg>
                );
            case 'closed_shape':
                return (
                    <svg width="100" height="100" viewBox="0 0 100 100" className="stroke-orange-500 stroke-[5px] fill-orange-200">
                        <path d="M 20 20 L 80 20 L 80 80 L 20 80 Z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    if (problems.length === 0) return null;

    const score = problems.filter(p => isCorrect(p)).length;
    const answeredCount = Object.keys(answers).length;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-600/10 rounded-xl text-purple-600 shrink-0">
                            <span className="text-2xl">📐</span>
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight">{t('geometry_title')}</h1>
                            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">{t('subtitle')}</p>
                        </div>
                    </div>
                    <Button onClick={() => setSeed(s => s + 1)} className="flex items-center justify-center gap-2 px-4 py-3 bg-brand-blue text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md font-bold">
                        <RefreshCcw className="w-4 h-4" />
                        {t('generateNew')}
                    </Button>
                </div>

                <div className="mb-8">
                    <ProgressBar
                        current={showResults ? completedCount : answeredCount}
                        total={problems.length}
                        showStars={true}
                        label={showResults ? t('score', { score, total: problems.length }) : t('progressLabel')}
                    />
                </div>

                {/* Identify shapes */}
                <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8 mb-8 border border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-purple-600 mb-6 border-b pb-2 border-purple-600/10">1. {t('geometry_title')}</h2>
                    <div className="space-y-6">
                        {problems.filter(p => p.type === 'identify_shape').map((p, index) => {
                            const correct = showResults && isCorrect(p);
                            const wrong = showResults && !isCorrect(p);
                            return (
                                <div key={p.id} className="flex flex-col md:flex-row items-center gap-6 border-b border-dashed border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                                    <div className="text-sm font-bold text-gray-500 dark:text-gray-400 min-w-9">{index + 1}.</div>
                                    <div className="text-lg font-bold text-gray-700 dark:text-gray-200 min-w-50">
                                        {t('geometry_shape_q', { shape: t(`geometry_shapes.${p.target}`) })}
                                    </div>
                                    <div className="flex flex-wrap gap-6 justify-center items-center">
                                        {p.options.map((opt, i) => {
                                            const isSelected = answers[p.id] === opt.id;
                                            let btnClass = 'border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 hover:bg-purple-50';
                                            if (showResults) {
                                                if (opt.id === p.correctId) btnClass = 'border-green-500 bg-green-50';
                                                else if (isSelected) btnClass = 'border-red-500 bg-red-50 opacity-60';
                                                else btnClass = 'opacity-40 border-gray-200';
                                            } else if (isSelected) {
                                                btnClass = 'border-purple-500 bg-purple-50 text-purple-700 font-bold ring-2 ring-purple-200';
                                            }
                                            return (
                                                <motion.button
                                                    key={i}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => !showResults && setAnswers(prev => ({ ...prev, [p.id]: opt.id }))}
                                                    className={`p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md transition-all ${btnClass}`}
                                                >
                                                    {renderShape(opt.type)}
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                    <div className="ml-auto">
                                        {correct && <CheckCircle className="w-6 h-6 text-green-500" />}
                                        {wrong && <XCircle className="w-6 h-6 text-red-500" />}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Open / Closed */}
                <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8 mb-8 border border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-purple-600 mb-6 border-b pb-2 border-purple-600/10">2. {t('geometry_open_closed_q', { type: t('geometry_shapes.open') })}</h2>
                    <div className="space-y-6">
                        {problems.filter(p => p.type === 'open_closed').map((p, index) => {
                            const correct = showResults && isCorrect(p);
                            const wrong = showResults && !isCorrect(p);
                            return (
                                <div key={p.id} className="flex flex-col md:flex-row items-center gap-6 border-b border-dashed border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                                    <div className="text-sm font-bold text-gray-500 dark:text-gray-400 min-w-9">{index + 1}.</div>
                                    <div className="text-lg font-bold text-gray-700 dark:text-gray-200 min-w-50">
                                        {t('geometry_open_closed_q', { type: t(`geometry_shapes.${p.target}`) })}
                                    </div>
                                    <div className="flex flex-wrap gap-6 justify-center items-center">
                                        {p.options.map((opt, i) => {
                                            const isSelected = answers[p.id] === opt.id;
                                            let btnClass = 'border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 hover:bg-purple-50';
                                            if (showResults) {
                                                if (opt.id === p.correctId) btnClass = 'border-green-500 bg-green-50';
                                                else if (isSelected) btnClass = 'border-red-500 bg-red-50 opacity-60';
                                                else btnClass = 'opacity-40 border-gray-200';
                                            } else if (isSelected) {
                                                btnClass = 'border-purple-500 bg-purple-50 text-purple-700 font-bold ring-2 ring-purple-200';
                                            }
                                            return (
                                                <motion.button
                                                    key={i}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => !showResults && setAnswers(prev => ({ ...prev, [p.id]: opt.id }))}
                                                    className={`p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md transition-all ${btnClass}`}
                                                >
                                                    {renderShape(opt.type)}
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                    <div className="ml-auto">
                                        {correct && <CheckCircle className="w-6 h-6 text-green-500" />}
                                        {wrong && <XCircle className="w-6 h-6 text-red-500" />}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <div className="mt-8 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div className="text-lg font-bold">
                        {showResults && (
                            <span className={`${score === problems.length ? 'text-green-600' : 'text-brand-orange'} text-xl`}>
                                {t('score', { score, total: problems.length })}
                            </span>
                        )}
                    </div>
                    <button onClick={handleCheck} className="px-8 py-3 rounded-xl font-bold bg-brand-green text-white shadow-lg shadow-brand-green/30 hover:bg-green-600 hover:scale-105 transition-all">
                        {t('checkAnswers')}
                    </button>
                </div>
            </div>

            <ExerciseFeedback
                show={feedback.show}
                isCorrect={feedback.isCorrect}
                onComplete={() => setFeedback(prev => ({ ...prev, show: false }))}
            />
        </div>
    );
}
