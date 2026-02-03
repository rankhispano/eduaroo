'use client';

import { useState, useEffect, useCallback } from 'react';
import { useGamificationStore } from '@/lib/gamification/store';
import ExerciseFeedback from '@/components/ExerciseFeedback';
import ProgressBar from '@/components/ProgressBar';
import { Button } from '@/components/ui/button';
import { RefreshCcw, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

type QuestionType = 'coins' | 'clock';

interface MeasurementProblem {
    id: number;
    type: QuestionType;
    data: any;
    options: any[];
    correctAnswer: any;
}

export default function MeasurementExercises() {
    const t = useTranslations('MathGrade1');
    const { addXP } = useGamificationStore();
    const [problems, setProblems] = useState<MeasurementProblem[]>([]);
    const [answers, setAnswers] = useState<Record<number, any>>({});
    const [showResults, setShowResults] = useState(false);
    const [feedback, setFeedback] = useState<{ show: boolean; isCorrect: boolean }>({ show: false, isCorrect: false });
    const [seed, setSeed] = useState(0);
    const [completedCount, setCompletedCount] = useState(0);

    const formatMoney = (cents: number) => {
        if (cents >= 100) {
            const euros = cents / 100;
            return `${euros.toFixed(2)} €`;
        }
        return `${cents} ${t('cents')}`;
    };

    const generateProblems = useCallback(() => {
        const newProblems: MeasurementProblem[] = [];
        let idCounter = 1;

        // Coins (3)
        const usedTotals = new Set<number>();
        const COINS = [1, 2, 5, 10, 20, 50, 100, 200];
        while (newProblems.filter(p => p.type === 'coins').length < 3) {
            const coins: number[] = [];
            let total = 0;
            const count = Math.floor(Math.random() * 4) + 2;
            for (let i = 0; i < count; i++) {
                const coin = COINS[Math.floor(Math.random() * (Math.random() > 0.5 ? 4 : 6))];
                coins.push(coin);
                total += coin;
            }
            if (usedTotals.has(total)) continue;
            usedTotals.add(total);

            const options = new Set<number>();
            options.add(total);
            while (options.size < 4) {
                const candidate = total + (Math.floor(Math.random() * 20) - 10);
                if (candidate > 0) options.add(candidate);
            }

            newProblems.push({
                id: idCounter++,
                type: 'coins',
                data: { coins },
                options: Array.from(options).sort((a, b) => a - b),
                correctAnswer: total
            });
        }

        // Clock (3)
        const usedTimes = new Set<string>();
        while (newProblems.filter(p => p.type === 'clock').length < 3) {
            const hour = Math.floor(Math.random() * 12) + 1;
            const minute = Math.random() > 0.5 ? 0 : 30;
            const timeStr = `${hour}:${minute === 0 ? '00' : '30'}`;
            if (usedTimes.has(timeStr)) continue;
            usedTimes.add(timeStr);

            const options = new Set<string>();
            options.add(timeStr);
            while (options.size < 4) {
                const h = Math.floor(Math.random() * 12) + 1;
                const m = Math.random() > 0.5 ? 0 : 30;
                options.add(`${h}:${m === 0 ? '00' : '30'}`);
            }

            newProblems.push({
                id: idCounter++,
                type: 'clock',
                data: { hour, minute },
                options: Array.from(options).sort(),
                correctAnswer: timeStr
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

    const isCorrect = (p: MeasurementProblem) => answers[p.id] === p.correctAnswer;

    const handleCheck = () => {
        const total = problems.length;
        const score = problems.filter(p => isCorrect(p)).length;
        if (score > 0) addXP(score * 5);
        setShowResults(true);
        setCompletedCount(score);
        setFeedback({ show: true, isCorrect: score >= total * 0.7 });
    };

    // Components to render Coins
    const Coin = ({ val }: { val: number }) => {
        const size = val >= 100 ? 'w-16 h-16' : val >= 20 ? 'w-14 h-14' : 'w-12 h-12';
        const color = val >= 100 ? 'bg-yellow-400 border-yellow-600 text-yellow-800' : val >= 10 ? 'bg-yellow-300 border-yellow-500 text-yellow-800' : 'bg-orange-400 border-orange-600 text-orange-900';
        const text = val >= 100 ? (val === 100 ? '1€' : '2€') : `${val}c`;

        return (
            <div className={`${size} rounded-full ${color} border-4 flex items-center justify-center font-bold shadow-lg`}>
                {text}
            </div>
        );
    };

    // Simple Analog Clock Visual
    const Clock = ({ h, m }: { h: number; m: number }) => {
        const mDeg = m * 6;
        const hDeg = (h % 12) * 30 + m * 0.5;

        return (
            <div className="w-32 h-32 rounded-full border-8 border-gray-700 bg-white relative shadow-xl">
                {[12, 3, 6, 9].map(n => (
                    <div key={n} className={`absolute font-bold text-gray-400 ${n === 12 ? 'top-1 left-1/2 -translate-x-1/2' :
                        n === 6 ? 'bottom-1 left-1/2 -translate-x-1/2' :
                            n === 3 ? 'right-2 top-1/2 -translate-y-1/2' :
                                'left-2 top-1/2 -translate-y-1/2'
                        }`}>
                        {n}
                    </div>
                ))}
                <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-black rounded-full -translate-x-1/2 -translate-y-1/2 z-10" />
                <div
                    className="absolute top-1/2 left-1/2 w-1.5 h-10 bg-black origin-bottom -translate-x-1/2 -translate-y-full rounded-full"
                    style={{ rotate: `${hDeg}deg` }}
                />
                <div
                    className="absolute top-1/2 left-1/2 w-1 h-14 bg-sky-500 origin-bottom -translate-x-1/2 -translate-y-full rounded-full"
                    style={{ rotate: `${mDeg}deg` }}
                />
            </div>
        );
    };

    if (problems.length === 0) return null;

    const score = problems.filter(p => isCorrect(p)).length;
    const answeredCount = Object.keys(answers).length;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-brand-orange/10 rounded-xl text-brand-orange shrink-0">
                            <span className="text-2xl">📏</span>
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight">{t('measurement_title')}</h1>
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

                {/* Coins */}
                <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8 mb-8 border border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-brand-orange mb-6 border-b pb-2 border-brand-orange/10">1. {t('measurement_money_q')}</h2>
                    <div className="space-y-6">
                        {problems.filter(p => p.type === 'coins').map((p, index) => {
                            const correct = showResults && isCorrect(p);
                            const wrong = showResults && !isCorrect(p);
                            return (
                                <div key={p.id} className="flex flex-col md:flex-row items-center gap-6 border-b border-dashed border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                                    <div className="text-sm font-bold text-gray-500 dark:text-gray-400 min-w-9">{index + 1}.</div>
                                    <div className="flex flex-wrap gap-4 justify-center max-w-md">
                                        {p.data.coins.map((val: number, i: number) => (
                                            <motion.div
                                                key={i}
                                                initial={{ scale: 0, rotate: 180 }}
                                                animate={{ scale: 1, rotate: Math.random() * 360 }}
                                                transition={{ delay: i * 0.05 }}
                                            >
                                                <Coin val={val} />
                                            </motion.div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {p.options.map((opt) => {
                                            const isSelected = answers[p.id] === opt;
                                            let btnClass = 'border-2 border-gray-200 dark:border-gray-700 hover:border-brand-orange hover:bg-orange-50';
                                            if (showResults) {
                                                if (opt === p.correctAnswer) btnClass = 'bg-green-100 border-green-500 text-green-800 shadow-[0_0_10px_rgba(34,197,94,0.3)]';
                                                else if (isSelected) btnClass = 'bg-red-100 border-red-500 text-red-800 opacity-50';
                                                else btnClass = 'opacity-40 border-gray-200';
                                            } else if (isSelected) {
                                                btnClass = 'border-brand-blue bg-brand-blue/10 text-brand-blue font-bold ring-2 ring-brand-blue/20';
                                            }
                                            return (
                                                <button
                                                    key={opt}
                                                    onClick={() => !showResults && setAnswers(prev => ({ ...prev, [p.id]: opt }))}
                                                    className={`p-4 rounded-xl text-lg font-bold transition-all ${btnClass}`}
                                                >
                                                    {formatMoney(opt)}
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

                {/* Clock */}
                <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8 mb-8 border border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-brand-orange mb-6 border-b pb-2 border-brand-orange/10">2. {t('measurement_time_q')}</h2>
                    <div className="space-y-6">
                        {problems.filter(p => p.type === 'clock').map((p, index) => {
                            const correct = showResults && isCorrect(p);
                            const wrong = showResults && !isCorrect(p);
                            return (
                                <div key={p.id} className="flex flex-col md:flex-row items-center gap-6 border-b border-dashed border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                                    <div className="text-sm font-bold text-gray-500 dark:text-gray-400 min-w-9">{index + 1}.</div>
                                    <Clock h={p.data.hour} m={p.data.minute} />
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {p.options.map((opt) => {
                                            const isSelected = answers[p.id] === opt;
                                            let btnClass = 'border-2 border-gray-200 dark:border-gray-700 hover:border-brand-orange hover:bg-orange-50';
                                            if (showResults) {
                                                if (opt === p.correctAnswer) btnClass = 'bg-green-100 border-green-500 text-green-800 shadow-[0_0_10px_rgba(34,197,94,0.3)]';
                                                else if (isSelected) btnClass = 'bg-red-100 border-red-500 text-red-800 opacity-50';
                                                else btnClass = 'opacity-40 border-gray-200';
                                            } else if (isSelected) {
                                                btnClass = 'border-brand-blue bg-brand-blue/10 text-brand-blue font-bold ring-2 ring-brand-blue/20';
                                            }
                                            return (
                                                <button
                                                    key={opt}
                                                    onClick={() => !showResults && setAnswers(prev => ({ ...prev, [p.id]: opt }))}
                                                    className={`p-4 rounded-xl text-lg font-bold transition-all ${btnClass}`}
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
