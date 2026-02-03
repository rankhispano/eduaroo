'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import ExerciseFeedback from '@/components/ExerciseFeedback';
import ProgressBar from '@/components/ProgressBar';
import { useGamificationStore } from '@/lib/gamification/store';
import { Button } from '@/components/ui/button';
import { RefreshCcw, CheckCircle, XCircle } from 'lucide-react';

type NumerationType = 'count' | 'series' | 'order';

interface NumerationProblem {
    id: number;
    type: NumerationType;
    data: any;
    correctAnswer: number | string;
    options: Array<number | string>;
}

export default function NumerationExercises() {
    const t = useTranslations('MathGrade1');
    const { addXP } = useGamificationStore();

    const [problems, setProblems] = useState<NumerationProblem[]>([]);
    const [answers, setAnswers] = useState<Record<number, number | string>>({});
    const [showResults, setShowResults] = useState(false);
    const [feedback, setFeedback] = useState<{ show: boolean; isCorrect: boolean }>({ show: false, isCorrect: false });
    const [seed, setSeed] = useState(0);
    const [completedCount, setCompletedCount] = useState(0);

    const generateProblems = useCallback(() => {
        const newProblems: NumerationProblem[] = [];
        let idCounter = 1;

        // Count (3)
        const usedCounts = new Set<number>();
        while (newProblems.filter(p => p.type === 'count').length < 3) {
            const count = Math.floor(Math.random() * 10) + 1;
            if (usedCounts.has(count)) continue;
            usedCounts.add(count);
            const options = Array.from({ length: 3 }, () => Math.floor(Math.random() * 10) + 1)
                .concat(count)
                .filter((v, i, arr) => arr.indexOf(v) === i)
                .slice(0, 4)
                .sort(() => Math.random() - 0.5);
            newProblems.push({
                id: idCounter++,
                type: 'count',
                data: { count },
                correctAnswer: count,
                options
            });
        }

        // Series (3)
        const usedSeries = new Set<string>();
        while (newProblems.filter(p => p.type === 'series').length < 3) {
            const start = Math.floor(Math.random() * 80);
            const step = Math.floor(Math.random() * 5) + 1;
            const key = `${start}-${step}`;
            if (usedSeries.has(key)) continue;
            usedSeries.add(key);
            const correct = start + step * 3;
            const options = [correct, correct + 1, correct - 1, correct + step]
                .filter((v, i, arr) => arr.indexOf(v) === i)
                .sort(() => Math.random() - 0.5);
            newProblems.push({
                id: idCounter++,
                type: 'series',
                data: { sequence: [start, start + step, start + step * 2] },
                correctAnswer: correct,
                options
            });
        }

        // Order (2)
        const usedOrders = new Set<string>();
        while (newProblems.filter(p => p.type === 'order').length < 2) {
            const numSet = new Set<number>();
            while (numSet.size < 3) numSet.add(Math.floor(Math.random() * 20) + 1);
            const nums = Array.from(numSet);
            const sorted = [...nums].sort((a, b) => a - b);
            const key = sorted.join('-');
            if (usedOrders.has(key)) continue;
            usedOrders.add(key);
            const correct = sorted.join(', ');
            const shuffled1 = [...sorted].sort(() => Math.random() - 0.5).join(', ');
            const shuffled2 = [...sorted].reverse().join(', ');
            const options = Array.from(new Set([correct, shuffled1, shuffled2]))
                .slice(0, 3)
                .sort(() => Math.random() - 0.5);
            newProblems.push({
                id: idCounter++,
                type: 'order',
                data: { nums },
                correctAnswer: correct,
                options
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

    const isCorrect = (p: NumerationProblem) => answers[p.id] === p.correctAnswer;

    const handleCheck = () => {
        const total = problems.length;
        const score = problems.filter(p => isCorrect(p)).length;
        if (score > 0) addXP(score * 5);
        setShowResults(true);
        setCompletedCount(score);
        setFeedback({ show: true, isCorrect: score >= total * 0.7 });
    };

    if (problems.length === 0) return null;

    const score = problems.filter(p => isCorrect(p)).length;
    const answeredCount = Object.keys(answers).length;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-brand-blue/10 rounded-xl text-brand-blue shrink-0">
                            <span className="text-2xl">🔢</span>
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight">{t('numeration_title')}</h1>
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

                {/* Count */}
                <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8 mb-8 border border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-brand-blue mb-6 border-b pb-2 border-brand-blue/10">1. {t('numeration_count')}</h2>
                    <div className="space-y-6">
                        {problems.filter(p => p.type === 'count').map((p, index) => {
                            const correct = showResults && isCorrect(p);
                            const wrong = showResults && !isCorrect(p);
                            return (
                                <div key={p.id} className="flex flex-col md:flex-row items-center gap-6 border-b border-dashed border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                                    <div className="text-sm font-bold text-gray-500 dark:text-gray-400 min-w-9">{index + 1}.</div>
                                    <div className="flex flex-wrap gap-3 justify-center py-2 min-w-55">
                                        {Array.from({ length: p.data.count }).map((_, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="text-4xl"
                                            >
                                                🍎
                                            </motion.div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {p.options.map((opt) => {
                                            const isSelected = answers[p.id] === opt;
                                            let btnClass = 'border-2 border-gray-200 dark:border-gray-700 hover:border-brand-blue hover:bg-blue-50';
                                            if (showResults) {
                                                if (opt === p.correctAnswer) btnClass = 'bg-green-100 border-green-500 text-green-800 shadow-[0_0_10px_rgba(34,197,94,0.3)]';
                                                else if (isSelected) btnClass = 'bg-red-100 border-red-500 text-red-800 opacity-50';
                                                else btnClass = 'opacity-40 border-gray-200';
                                            } else if (isSelected) {
                                                btnClass = 'border-brand-blue bg-brand-blue/10 text-brand-blue font-bold ring-2 ring-brand-blue/20';
                                            }
                                            return (
                                                <button
                                                    key={String(opt)}
                                                    onClick={() => !showResults && setAnswers(prev => ({ ...prev, [p.id]: opt }))}
                                                    className={`p-4 rounded-2xl text-2xl font-bold transition-all ${btnClass}`}
                                                >
                                                    {opt}
                                                </button>
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

                {/* Series */}
                <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8 mb-8 border border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-brand-blue mb-6 border-b pb-2 border-brand-blue/10">2. {t('numeration_series')}</h2>
                    <div className="space-y-6">
                        {problems.filter(p => p.type === 'series').map((p, index) => {
                            const correct = showResults && isCorrect(p);
                            const wrong = showResults && !isCorrect(p);
                            return (
                                <div key={p.id} className="flex flex-col md:flex-row items-center gap-6 border-b border-dashed border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                                    <div className="text-sm font-bold text-gray-500 dark:text-gray-400 min-w-9">{index + 1}.</div>
                                    <div className="flex gap-3 justify-center items-center py-2 text-3xl font-bold font-mono">
                                        {p.data.sequence.map((n: number, i: number) => (
                                            <div key={i} className="bg-gray-100 dark:bg-gray-800 p-3 rounded-xl shadow-sm border-2 border-gray-200">
                                                {n}
                                            </div>
                                        ))}
                                        <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl shadow-inner border-2 border-dashed border-blue-400 text-blue-500">?</div>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {p.options.map((opt) => {
                                            const isSelected = answers[p.id] === opt;
                                            let btnClass = 'border-2 border-gray-200 dark:border-gray-700 hover:border-brand-blue hover:bg-blue-50';
                                            if (showResults) {
                                                if (opt === p.correctAnswer) btnClass = 'bg-green-100 border-green-500 text-green-800 shadow-[0_0_10px_rgba(34,197,94,0.3)]';
                                                else if (isSelected) btnClass = 'bg-red-100 border-red-500 text-red-800 opacity-50';
                                                else btnClass = 'opacity-40 border-gray-200';
                                            } else if (isSelected) {
                                                btnClass = 'border-brand-blue bg-brand-blue/10 text-brand-blue font-bold ring-2 ring-brand-blue/20';
                                            }
                                            return (
                                                <button
                                                    key={String(opt)}
                                                    onClick={() => !showResults && setAnswers(prev => ({ ...prev, [p.id]: opt }))}
                                                    className={`p-4 rounded-2xl text-2xl font-bold transition-all ${btnClass}`}
                                                >
                                                    {opt}
                                                </button>
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

                {/* Order */}
                <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8 mb-8 border border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-brand-blue mb-6 border-b pb-2 border-brand-blue/10">3. {t('numeration_order')}</h2>
                    <div className="space-y-6">
                        {problems.filter(p => p.type === 'order').map((p, index) => {
                            const correct = showResults && isCorrect(p);
                            const wrong = showResults && !isCorrect(p);
                            return (
                                <div key={p.id} className="flex flex-col md:flex-row items-center gap-6 border-b border-dashed border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                                    <div className="text-sm font-bold text-gray-500 dark:text-gray-400 min-w-9">{index + 1}.</div>
                                    <div className="flex gap-3 text-3xl font-bold font-mono">
                                        {p.data.nums.map((n: number, i: number) => (
                                            <div key={i} className="bg-gray-100 dark:bg-gray-800 p-3 rounded-xl shadow-sm border-2 border-gray-200">
                                                {n}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        {p.options.map((opt) => {
                                            const isSelected = answers[p.id] === opt;
                                            let btnClass = 'border-2 border-gray-200 dark:border-gray-700 hover:border-brand-blue hover:bg-blue-50';
                                            if (showResults) {
                                                if (opt === p.correctAnswer) btnClass = 'bg-green-100 border-green-500 text-green-800 shadow-[0_0_10px_rgba(34,197,94,0.3)]';
                                                else if (isSelected) btnClass = 'bg-red-100 border-red-500 text-red-800 opacity-50';
                                                else btnClass = 'opacity-40 border-gray-200';
                                            } else if (isSelected) {
                                                btnClass = 'border-brand-blue bg-brand-blue/10 text-brand-blue font-bold ring-2 ring-brand-blue/20';
                                            }
                                            return (
                                                <button
                                                    key={String(opt)}
                                                    onClick={() => !showResults && setAnswers(prev => ({ ...prev, [p.id]: opt }))}
                                                    className={`px-4 py-3 rounded-xl text-lg font-bold transition-all ${btnClass}`}
                                                >
                                                    {opt}
                                                </button>
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
