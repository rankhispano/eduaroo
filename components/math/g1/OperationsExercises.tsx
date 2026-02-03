'use client';

import { useState, useEffect, useCallback } from 'react';
import { useGamificationStore } from '@/lib/gamification/store';
import ExerciseFeedback from '@/components/ExerciseFeedback';
import ProgressBar from '@/components/ProgressBar';
import { Button } from '@/components/ui/button';
import { RefreshCcw, CheckCircle, XCircle, Calculator } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface OperationProblem {
    id: number;
    type: 'sum' | 'sub';
    a: number;
    b: number;
    result: number;
    options: number[];
}

export default function OperationsExercises() {
    const t = useTranslations('MathGrade1');
    const { addXP } = useGamificationStore();
    const [problems, setProblems] = useState<OperationProblem[]>([]);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [showResults, setShowResults] = useState(false);
    const [feedback, setFeedback] = useState<{ show: boolean; isCorrect: boolean }>({ show: false, isCorrect: false });
    const [seed, setSeed] = useState(0);
    const [completedCount, setCompletedCount] = useState(0);

    const generateOptions = (result: number) => {
        const options = new Set<number>();
        options.add(result);
        while (options.size < 4) {
            const offset = Math.floor(Math.random() * 5) - 2;
            const fake = result + offset;
            if (fake >= 0 && fake !== result) options.add(fake);
        }
        return Array.from(options).sort(() => Math.random() - 0.5);
    };

    const generateProblems = useCallback(() => {
        const newProblems: OperationProblem[] = [];
        const used = new Set<string>();
        let idCounter = 1;

        while (newProblems.length < 8) {
            const type: 'sum' | 'sub' = Math.random() > 0.5 ? 'sum' : 'sub';
            let a = 0;
            let b = 0;
            if (type === 'sum') {
                a = Math.floor(Math.random() * 10) + 1;
                b = Math.floor(Math.random() * 10) + 1;
                if (a + b > 20) continue;
            } else {
                a = Math.floor(Math.random() * 15) + 5;
                b = Math.floor(Math.random() * (a - 1)) + 1;
            }
            const key = `${type}-${a}-${b}`;
            if (used.has(key)) continue;
            used.add(key);
            const result = type === 'sum' ? a + b : a - b;
            newProblems.push({ id: idCounter++, type, a, b, result, options: generateOptions(result) });
        }

        setProblems(newProblems);
        setAnswers({});
        setShowResults(false);
        setCompletedCount(0);
    }, []);

    useEffect(() => {
        generateProblems();
    }, [generateProblems, seed]);

    const isCorrect = (p: OperationProblem) => answers[p.id] === p.result;

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
                        <div className="p-3 bg-brand-green/10 rounded-xl text-brand-green shrink-0">
                            <Calculator className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight">{t('operations_title')}</h1>
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

                <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8 mb-8 border border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-brand-green mb-6 border-b pb-2 border-brand-green/10">{t('operations_section')}</h2>
                    <div className="space-y-6">
                        {problems.map((p, index) => {
                            const correct = showResults && isCorrect(p);
                            const wrong = showResults && !isCorrect(p);
                            return (
                                <div key={p.id} className="flex flex-col md:flex-row items-center gap-6 border-b border-dashed border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                                    <div className="text-sm font-bold text-gray-500 dark:text-gray-400 min-w-9">{index + 1}.</div>
                                    <div className="flex items-center gap-4 text-4xl font-black text-gray-800 dark:text-gray-100">
                                        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-xl min-w-18 text-center">{p.a}</div>
                                        <div className="text-brand-blue">{p.type === 'sum' ? '+' : '-'}</div>
                                        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-xl min-w-18 text-center">{p.b}</div>
                                        <div>=</div>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {p.options.map((opt) => {
                                            const isSelected = answers[p.id] === opt;
                                            let btnClass = 'border-2 border-gray-200 dark:border-gray-700 hover:border-brand-green hover:bg-green-50';
                                            if (showResults) {
                                                if (opt === p.result) btnClass = 'bg-green-100 border-green-500 text-green-800 shadow-[0_0_10px_rgba(34,197,94,0.3)]';
                                                else if (isSelected) btnClass = 'bg-red-100 border-red-500 text-red-800 opacity-50';
                                                else btnClass = 'opacity-40 border-gray-200';
                                            } else if (isSelected) {
                                                btnClass = 'border-brand-blue bg-brand-blue/10 text-brand-blue font-bold ring-2 ring-brand-blue/20';
                                            }
                                            return (
                                                <button
                                                    key={opt}
                                                    onClick={() => !showResults && setAnswers(prev => ({ ...prev, [p.id]: opt }))}
                                                    className={`w-20 h-16 rounded-xl text-2xl font-bold transition-all ${btnClass}`}
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
