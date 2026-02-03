'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect, useCallback } from 'react';
import ExerciseFeedback, { XPGainAnimation } from '@/components/ExerciseFeedback';
import { playCorrect, playIncorrect, playComplete, playStar, playLevelUp } from '@/lib/audio/soundEffects';
import { useGamificationStore } from '@/lib/gamification/store';
import { CheckCircle, XCircle, RefreshCw, Volume2, VolumeX } from 'lucide-react';

interface DivisionProblem {
    id: number;
    dividend: number;
    divisor: number;
    quotient: number;
    remainder: number;
}

export default function DivisionExercises() {
    const t = useTranslations('DivisionGrade4');
    const [exercises, setExercises] = useState<DivisionProblem[]>([]);
    const [answers, setAnswers] = useState<Record<number, { q: string, r: string }>>({});
    const [showResults, setShowResults] = useState(false);

    // Gamification
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackCorrect, setFeedbackCorrect] = useState<boolean | null>(null);
    const [showXPGain, setShowXPGain] = useState(false);
    const [xpGained, setXpGained] = useState(0);
    const [soundEnabled, setSoundEnabled] = useState(true);

    const generateExercises = useCallback(() => {
        const newExercises: DivisionProblem[] = [];
        let idCounter = 1;

        for (let i = 0; i < 10; i++) {
            const divisor = Math.floor(Math.random() * 8) + 2; // 2-9
            const quotient = Math.floor(Math.random() * 10) + 1; // 1-10
            const remainder = Math.floor(Math.random() * divisor); // 0 to divisor-1
            const dividend = divisor * quotient + remainder;

            newExercises.push({
                id: idCounter++,
                dividend,
                divisor,
                quotient,
                remainder
            });
        }

        setExercises(newExercises);
        setAnswers({});
        setShowResults(false);
    }, []);

    useEffect(() => {
        generateExercises();
    }, [generateExercises]);

    const handleCheck = () => {
        setShowResults(true);
        let score = 0;
        exercises.forEach(ex => {
            const userQ = parseInt(answers[ex.id]?.q || '0');
            const userR = parseInt(answers[ex.id]?.r || '0');
            if (userQ === ex.quotient && userR === ex.remainder) score++;
        });

        const total = exercises.length;
        const isGamePassed = score >= total * 0.6;

        if (soundEnabled) {
            isGamePassed ? (score === total ? playComplete() : playCorrect()) : playIncorrect();
        }

        setFeedbackCorrect(isGamePassed);
        setShowFeedback(true);

        if (isGamePassed) {
            const { xpGained, levelUp } = useGamificationStore.getState().completeExercise('math', score, total, score === total);
            setXpGained(xpGained);
            if (levelUp && soundEnabled) setTimeout(() => playLevelUp(), 500);
            setTimeout(() => setShowXPGain(true), 800);
        }
    };

    const handleInput = (id: number, field: 'q' | 'r', val: string) => {
        setAnswers(prev => ({
            ...prev,
            [id]: { ...(prev[id] || { q: '', r: '' }), [field]: val }
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
                        <p className="text-gray-600 dark:text-gray-400">{t('description')}</p>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full">
                            {soundEnabled ? <Volume2 /> : <VolumeX />}
                        </button>
                        <button onClick={generateExercises} className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg">
                            <RefreshCw className="w-4 h-4" /> {t('generateNew')}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {exercises.map(ex => {
                        const userQ = answers[ex.id]?.q;
                        const userR = answers[ex.id]?.r;
                        const isCorrect = showResults &&
                            parseInt(userQ || '0') === ex.quotient &&
                            parseInt(userR || '0') === ex.remainder;

                        return (
                            <div key={ex.id} className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                <div className="text-2xl font-bold font-mono">
                                    {ex.dividend} <span className="text-brand-orange">÷</span> {ex.divisor}
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col items-center">
                                        <input
                                            type="number"
                                            placeholder="Q"
                                            className={`w-16 p-2 border-2 rounded-lg text-center ${showResults && parseInt(userQ || '0') !== ex.quotient ? 'border-red-500 bg-red-50' : 'border-gray-200'
                                                } ${isCorrect ? 'border-green-500 bg-green-50' : ''}`}
                                            value={userQ || ''}
                                            onChange={(e) => handleInput(ex.id, 'q', e.target.value)}
                                            disabled={showResults}
                                        />
                                        <span className="text-xs text-gray-500 mt-1">{t('quotient')}</span>
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <input
                                            type="number"
                                            placeholder="R"
                                            className={`w-16 p-2 border-2 rounded-lg text-center ${showResults && parseInt(userR || '0') !== ex.remainder ? 'border-red-500 bg-red-50' : 'border-gray-200'
                                                } ${isCorrect ? 'border-green-500 bg-green-50' : ''}`}
                                            value={userR || ''}
                                            onChange={(e) => handleInput(ex.id, 'r', e.target.value)}
                                            disabled={showResults}
                                        />
                                        <span className="text-xs text-gray-500 mt-1">{t('remainder')}</span>
                                    </div>

                                    {showResults && (isCorrect ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500" />)}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-8 flex justify-end">
                    <button onClick={handleCheck} className="px-8 py-3 bg-green-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform">
                        {t('checkAnswers')}
                    </button>
                </div>
            </div>

            <ExerciseFeedback show={showFeedback} isCorrect={feedbackCorrect} onComplete={() => setShowFeedback(false)} />
            <XPGainAnimation show={showXPGain} amount={xpGained} />
        </div>
    );
}
