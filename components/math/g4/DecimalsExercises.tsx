'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect, useCallback } from 'react';
import ExerciseFeedback, { XPGainAnimation } from '@/components/ExerciseFeedback';
import MatchingExercise from '@/components/MatchingExercise';
import { playCorrect, playIncorrect, playComplete, playStar, playLevelUp } from '@/lib/audio/soundEffects';
import { useGamificationStore } from '@/lib/gamification/store';
import { CheckCircle, XCircle, RefreshCw, Volume2, VolumeX } from 'lucide-react';

interface DecimalExercise {
    id: number;
    type: 'comparison';
    num1: number;
    num2: number;
    operator?: string;
}

export default function DecimalsExercises() {
    const t = useTranslations('DecimalsGrade4');
    const [exercises, setExercises] = useState<DecimalExercise[]>([]);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [showResults, setShowResults] = useState(false);

    // Matching Pairs for Fractions -> Decimals
    const [matchingPairs, setMatchingPairs] = useState<{ id: number, left: string, right: string }[]>([]);
    const [matchingCorrect, setMatchingCorrect] = useState(false);

    // Gamification
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackCorrect, setFeedbackCorrect] = useState<boolean | null>(null);
    const [showXPGain, setShowXPGain] = useState(false);
    const [xpGained, setXpGained] = useState(0);
    const [soundEnabled, setSoundEnabled] = useState(true);

    const generateExercises = useCallback(() => {
        const newExercises: DecimalExercise[] = [];
        let idCounter = 1;

        // 1. Comparison
        for (let i = 0; i < 5; i++) {
            let n1 = parseFloat((Math.random() * 10).toFixed(1));
            let n2 = parseFloat((Math.random() * 10).toFixed(1));
            // 20% chance to be equal
            if (Math.random() < 0.2) n2 = n1;

            newExercises.push({
                id: idCounter++,
                type: 'comparison',
                num1: n1,
                num2: n2
            });
        }
        setExercises(newExercises);
        setAnswers({});

        // 2. Matching Fractions to Decimals
        const fractions = [
            { num: 1, den: 2, dec: "0.5" },
            { num: 1, den: 4, dec: "0.25" },
            { num: 3, den: 4, dec: "0.75" },
            { num: 1, den: 10, dec: "0.1" },
            { num: 1, den: 5, dec: "0.2" }
        ];

        const pairs = fractions.map((f, i) => ({
            id: i + 1,
            left: `${f.num}/${f.den}`,
            right: f.dec
        }));
        setMatchingPairs(pairs);
        setMatchingCorrect(false);

        setShowResults(false);
    }, []);

    useEffect(() => {
        generateExercises();
    }, [generateExercises]);

    const handleCheck = () => {
        setShowResults(true);
        let score = 0;

        // 1. Comparison Score
        exercises.forEach(ex => {
            const val = answers[ex.id];
            let correct = false;
            if (ex.num1 > ex.num2 && val === '>') correct = true;
            if (ex.num1 < ex.num2 && val === '<') correct = true;
            if (ex.num1 === ex.num2 && val === '=') correct = true;
            if (correct) score++;
        });

        // 2. Matching Score (Bonus point if correct)
        if (matchingCorrect) score += 5; // Weighted more

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
        // Check if all connections are correct (id -> id)
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

                {/* Section 1: Comparison */}
                <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8 mb-8 border border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-teal-600 mb-6 border-b pb-2 border-teal-600/10">{t('comparison')}</h2>
                    <div className="grid gap-6">
                        {exercises.map(ex => {
                            const val = answers[ex.id];
                            return (
                                <div key={ex.id} className="flex items-center justify-center gap-6 text-2xl font-bold">
                                    <span className="w-16 text-right">{ex.num1}</span>
                                    <div className="flex gap-2">
                                        {['<', '=', '>'].map(op => (
                                            <button
                                                key={op}
                                                onClick={() => !showResults && setAnswers(prev => ({ ...prev, [ex.id]: op }))}
                                                className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all ${val === op ? 'bg-brand-blue text-white border-brand-blue' : 'border-gray-200 hover:border-brand-blue/50'
                                                    }`}
                                            >
                                                {op}
                                            </button>
                                        ))}
                                    </div>
                                    <span className="w-16 text-left">{ex.num2}</span>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Section 2: Matching Fractions to Decimals */}
                <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8 mb-8 border border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-purple-600 mb-6 border-b pb-2 border-purple-600/10">{t('conversion')}</h2>
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
