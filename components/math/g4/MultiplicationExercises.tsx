'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect, useCallback } from 'react';
import ExerciseFeedback, { XPGainAnimation } from '@/components/ExerciseFeedback';
import ProgressBar from '@/components/ProgressBar';
import { playCorrect, playIncorrect, playComplete, playStar, playLevelUp } from '@/lib/audio/soundEffects';
import { useGamificationStore } from '@/lib/gamification/store';
import { CheckCircle, XCircle, Calculator, RefreshCw, Volume2, VolumeX } from 'lucide-react';

interface Exercise {
    id: number;
    type: 'fill-blank' | 'multiple-choice';
    num1: number;
    num2: number;
    options?: number[];
}

export default function MultiplicationExercises() {
    const t = useTranslations('MultiplicationGrade4');
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [showResults, setShowResults] = useState(false);

    // Gamification
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackCorrect, setFeedbackCorrect] = useState<boolean | null>(null);
    const [showXPGain, setShowXPGain] = useState(false);
    const [xpGained, setXpGained] = useState(0);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [completedCount, setCompletedCount] = useState(0);

    const generateExercises = useCallback(() => {
        const newExercises: Exercise[] = [];
        let idCounter = 1;

        // 1. Fill in blank (Multi-digit)
        for (let i = 0; i < 5; i++) {
            const num1 = Math.floor(Math.random() * 90) + 10; // 10-99
            const num2 = Math.floor(Math.random() * 9) + 2;   // 2-10
            newExercises.push({
                id: idCounter++,
                type: 'fill-blank',
                num1,
                num2
            });
        }

        // 2. Multiple Choice
        for (let i = 0; i < 5; i++) {
            const num1 = Math.floor(Math.random() * 20) + 2;
            const num2 = Math.floor(Math.random() * 10) + 2;
            const correct = num1 * num2;
            const options = [correct];
            while (options.length < 4) {
                const wrong = correct + Math.floor(Math.random() * 10) - 5;
                if (wrong > 0 && !options.includes(wrong)) options.push(wrong);
            }
            newExercises.push({
                id: idCounter++,
                type: 'multiple-choice',
                num1,
                num2,
                options: options.sort(() => Math.random() - 0.5)
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
            const correct = ex.num1 * ex.num2;
            if (parseInt(answers[ex.id]) === correct) score++;
        });

        // Gamification Logic
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

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
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

                {/* Exercises */}
                <div className="grid gap-8">
                    {exercises.map(ex => {
                        const isCorrect = showResults && parseInt(answers[ex.id]) === ex.num1 * ex.num2;

                        return (
                            <div key={ex.id} className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-4 text-2xl font-bold font-mono">
                                    <span>{ex.num1}</span>
                                    <span className="text-brand-orange">×</span>
                                    <span>{ex.num2}</span>
                                    <span>=</span>

                                    {ex.type === 'fill-blank' ? (
                                        <input
                                            type="number"
                                            className={`w-24 p-2 border-2 rounded-lg text-center ${showResults
                                                    ? (isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50')
                                                    : 'border-gray-200 focus:border-brand-blue'
                                                }`}
                                            value={answers[ex.id] || ''}
                                            onChange={(e) => setAnswers(prev => ({ ...prev, [ex.id]: e.target.value }))}
                                            disabled={showResults}
                                        />
                                    ) : (
                                        <div className="flex gap-2">
                                            {ex.options?.map(opt => (
                                                <button
                                                    key={opt}
                                                    onClick={() => !showResults && setAnswers(prev => ({ ...prev, [ex.id]: opt.toString() }))}
                                                    className={`px-4 py-2 rounded-lg border-2 transition-all ${answers[ex.id] === opt.toString()
                                                            ? 'bg-brand-blue text-white border-brand-blue'
                                                            : 'border-gray-200 hover:border-brand-blue/50'
                                                        } ${showResults && opt === ex.num1 * ex.num2 ? '!bg-green-500 !text-white !border-green-500' : ''
                                                        } ${showResults && answers[ex.id] === opt.toString() && opt !== ex.num1 * ex.num2 ? '!bg-red-500 !text-white !border-red-500' : ''
                                                        }`}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {showResults && (isCorrect ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500" />)}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer Action */}
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
