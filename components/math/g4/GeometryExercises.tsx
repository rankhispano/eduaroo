'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect, useCallback } from 'react';
import ExerciseFeedback, { XPGainAnimation } from '@/components/ExerciseFeedback';
import { playCorrect, playIncorrect, playComplete, playStar, playLevelUp } from '@/lib/audio/soundEffects';
import { useGamificationStore } from '@/lib/gamification/store';
import { CheckCircle, XCircle, RefreshCw, Volume2, VolumeX } from 'lucide-react';

interface ShapeExercise {
    id: number;
    type: 'shape';
    shapeKey: string;
    options: string[];
}

interface AngleExercise {
    id: number;
    type: 'angle';
    angleType: 'acute' | 'right' | 'obtuse';
    angleDeg: number;
}

type Exercise = ShapeExercise | AngleExercise;

export default function GeometryExercises() {
    const t = useTranslations('GeometryGrade4');
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [showResults, setShowResults] = useState(false);

    // Gamification
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackCorrect, setFeedbackCorrect] = useState<boolean | null>(null);
    const [showXPGain, setShowXPGain] = useState(false);
    const [xpGained, setXpGained] = useState(0);
    const [soundEnabled, setSoundEnabled] = useState(true);

    const generateExercises = useCallback(() => {
        const newExercises: Exercise[] = [];
        let idCounter = 1;

        // 1. Shapes
        const shapes = ['triangle', 'square', 'rectangle', 'pentagon', 'hexagon', 'circle'];
        for (let i = 0; i < 3; i++) {
            const shapeKey = shapes[Math.floor(Math.random() * shapes.length)];
            const options = [shapeKey];
            while (options.length < 3) {
                const wrong = shapes[Math.floor(Math.random() * shapes.length)];
                if (!options.includes(wrong)) options.push(wrong);
            }
            newExercises.push({
                id: idCounter++,
                type: 'shape',
                shapeKey,
                options: options.sort(() => Math.random() - 0.5)
            });
        }

        // 2. Angles
        for (let i = 0; i < 3; i++) {
            const types = ['acute', 'right', 'obtuse'] as const;
            const type = types[Math.floor(Math.random() * types.length)];
            let deg = 90;
            if (type === 'acute') deg = Math.floor(Math.random() * 80) + 10; // 10-89
            if (type === 'obtuse') deg = Math.floor(Math.random() * 80) + 91; // 91-170

            newExercises.push({
                id: idCounter++,
                type: 'angle',
                angleType: type,
                angleDeg: deg
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
            const val = answers[ex.id];
            if (ex.type === 'shape' && val === ex.shapeKey) score++;
            if (ex.type === 'angle' && val === ex.angleType) score++;
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

    const renderShape = (key: string) => {
        const props = { className: "w-24 h-24 stroke-brand-blue stroke-2 fill-brand-blue/20" };
        switch (key) {
            case 'triangle': return <svg viewBox="0 0 100 100" {...props}><polygon points="50,10 90,90 10,90" /></svg>;
            case 'square': return <svg viewBox="0 0 100 100" {...props}><rect x="10" y="10" width="80" height="80" /></svg>;
            case 'rectangle': return <svg viewBox="0 0 100 100" {...props}><rect x="10" y="25" width="80" height="50" /></svg>;
            case 'pentagon': return <svg viewBox="0 0 100 100" {...props}><polygon points="50,10 90,40 75,90 25,90 10,40" /></svg>;
            case 'hexagon': return <svg viewBox="0 0 100 100" {...props}><polygon points="50,10 90,30 90,70 50,90 10,70 10,30" /></svg>;
            case 'circle': return <svg viewBox="0 0 100 100" {...props}><circle cx="50" cy="50" r="40" /></svg>;
            default: return null;
        }
    };

    const renderAngle = (deg: number) => {
        // Draw line 1 at 0 degrees, line 2 at -deg degrees (SVG coordinates y-down)
        // Center is 50,80
        const r = 40;
        const x2 = 50 + r * Math.cos(-deg * Math.PI / 180);
        const y2 = 80 + r * Math.sin(-deg * Math.PI / 180);

        return (
            <svg viewBox="0 0 100 100" className="w-32 h-32 stroke-brand-orange stroke-2 fill-none mb-2">
                <line x1="50" y1="80" x2="90" y2="80" />
                <line x1="50" y1="80" x2={x2} y2={y2} />
                <path d={`M 65 80 A 15 15 0 0 0 ${50 + 15 * Math.cos(-deg * Math.PI / 180)} ${80 + 15 * Math.sin(-deg * Math.PI / 180)}`} className="stroke-gray-400 stroke-1" />
                <text x="50" y="95" className="fill-gray-500 text-xs text-center" textAnchor="middle">{deg}°</text>
            </svg>
        );
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {exercises.map(ex => {
                        const val = answers[ex.id];
                        const isCorrect = showResults &&
                            ((ex.type === 'shape' && val === ex.shapeKey) ||
                                (ex.type === 'angle' && val === ex.angleType));

                        return (
                            <div key={ex.id} className={`bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border-2 transition-all flex flex-col items-center
                                ${showResults && isCorrect ? 'border-green-500 ring-1 ring-green-500' : 'border-gray-100 dark:border-gray-800'}
                                ${showResults && !isCorrect ? 'border-red-500 ring-1 ring-red-500' : ''}
                            `}>
                                <div className="mb-4 flex items-center justify-center h-32 w-full">
                                    {ex.type === 'shape' ? renderShape(ex.shapeKey) : renderAngle(ex.angleDeg)}
                                </div>

                                <h3 className="text-sm font-semibold text-gray-500 mb-3">
                                    {ex.type === 'shape' ? t('identifyShape') : t('identifyAngle')}
                                </h3>

                                <div className="flex flex-col gap-2 w-full">
                                    {ex.type === 'shape' ? (
                                        ex.options.map(opt => (
                                            <button
                                                key={opt}
                                                onClick={() => !showResults && setAnswers(prev => ({ ...prev, [ex.id]: opt }))}
                                                className={`px-3 py-2 rounded-lg text-sm border transition-all ${val === opt
                                                        ? 'bg-brand-blue text-white border-brand-blue'
                                                        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100'
                                                    }`}
                                            >
                                                {t(`shapes.${opt}`)}
                                            </button>
                                        ))
                                    ) : (
                                        ['acute', 'right', 'obtuse'].map(opt => (
                                            <button
                                                key={opt}
                                                onClick={() => !showResults && setAnswers(prev => ({ ...prev, [ex.id]: opt }))}
                                                className={`px-3 py-2 rounded-lg text-sm border transition-all ${val === opt
                                                        ? 'bg-brand-blue text-white border-brand-blue'
                                                        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100'
                                                    }`}
                                            >
                                                {t(`angles.${opt}`)}
                                            </button>
                                        ))
                                    )}
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
