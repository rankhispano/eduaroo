'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect, useCallback } from 'react';
import ExerciseFeedback, { XPGainAnimation } from '@/components/ExerciseFeedback';
import MatchingExercise from '@/components/MatchingExercise';
import { playCorrect, playIncorrect, playComplete, playStar, playLevelUp } from '@/lib/audio/soundEffects';
import { useGamificationStore } from '@/lib/gamification/store';
import { CheckCircle, XCircle, RefreshCw, Volume2, VolumeX } from 'lucide-react';

interface ConversionExercise {
    id: number;
    val: number;
    from: string;
    to: string;
    factor: number;
}

export default function MeasurementExercises() {
    const t = useTranslations('MeasurementGrade4');
    const [exercises, setExercises] = useState<ConversionExercise[]>([]);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [showResults, setShowResults] = useState(false);

    // Matching Pairs for Unit Conversions
    const [matchingPairs, setMatchingPairs] = useState<{ id: number, left: string, right: string }[]>([]);
    const [matchingCorrect, setMatchingCorrect] = useState(false);

    // Gamification
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackCorrect, setFeedbackCorrect] = useState<boolean | null>(null);
    const [showXPGain, setShowXPGain] = useState(false);
    const [xpGained, setXpGained] = useState(0);
    const [soundEnabled, setSoundEnabled] = useState(true);

    const generateExercises = useCallback(() => {
        const newExercises: ConversionExercise[] = [];
        let idCounter = 1;

        // 1. Direct Conversion Inputs
        const conversions = [
            { from: 'm', to: 'cm', factor: 100 },
            { from: 'km', to: 'm', factor: 1000 },
            { from: 'kg', to: 'g', factor: 1000 },
            { from: 'l', to: 'ml', factor: 1000 }
        ];

        for (let i = 0; i < 4; i++) {
            const type = conversions[i];
            const val = Math.floor(Math.random() * 10) + 1;
            newExercises.push({
                id: idCounter++,
                val,
                from: type.from,
                to: type.to,
                factor: type.factor
            });
        }
        setExercises(newExercises);
        setAnswers({});

        // 2. Matching Units (from translations)
        const matchKeys = ['m_cm', 'km_m', 'kg_g', 'l_ml', 'cm_m'];
        const pairs = matchKeys.map((key, i) => ({
            id: i + 1,
            left: t(`matching.${key}.left`),
            right: t(`matching.${key}.right`)
        }));
        setMatchingPairs(pairs);
        setMatchingCorrect(false);

        setShowResults(false);
    }, [t]);

    useEffect(() => {
        generateExercises();
    }, [generateExercises]);

    const handleCheck = () => {
        setShowResults(true);
        let score = 0;

        // 1. Conversion Score
        exercises.forEach(ex => {
            if (parseInt(answers[ex.id]) === ex.val * ex.factor) score++;
        });

        // 2. Matching Score (Bonus)
        if (matchingCorrect) score += 5;

        const total = exercises.length + 5;
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

    const handleMatchingUpdate = (connections: Record<number, number>) => {
        const correctCount = Object.entries(connections).filter(([l, r]) => parseInt(l) === r).length;
        if (correctCount === matchingPairs.length) {
            if (!matchingCorrect && soundEnabled) playStar();
            setMatchingCorrect(true);
        } else {
            setMatchingCorrect(false);
        }
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

                {/* Section 1: Conversion Input */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {exercises.map(ex => {
                        const isCorrect = showResults && parseInt(answers[ex.id]) === ex.val * ex.factor;
                        return (
                            <div key={ex.id} className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between text-xl font-bold">
                                <div>
                                    {ex.val} <span className="text-gray-500">{t(`units_labels.${ex.from}`)}</span>
                                </div>
                                <div className="text-gray-400">=</div>
                                <div className="flex items-center gap-2">
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
                                    <span className="text-gray-500">{t(`units_labels.${ex.to}`)}</span>
                                </div>
                                {showResults && (isCorrect ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500" />)}
                            </div>
                        );
                    })}
                </div>

                {/* Section 2: Matching Units */}
                <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8 mb-8 border border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-orange-600 mb-6 border-b pb-2 border-orange-600/10">{t('conversion')}</h2>
                    <MatchingExercise
                        pairs={matchingPairs}
                        leftType="text"
                        rightType="text"
                        onUpdate={handleMatchingUpdate}
                        showResults={showResults}
                    />
                </section>

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
