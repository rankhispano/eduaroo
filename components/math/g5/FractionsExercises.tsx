'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect, useCallback } from 'react';
import FractionVisual from '@/components/math/shared/FractionVisual';
import ExerciseFeedback, { XPGainAnimation } from '@/components/ExerciseFeedback';
import ProgressBar from '@/components/ProgressBar';
import { playCorrect, playIncorrect, playComplete, playStar, playLevelUp } from '@/lib/audio/soundEffects';
import { useGamificationStore } from '@/lib/gamification/store';
import { CheckCircle, XCircle, Calculator, RefreshCw, Volume2, VolumeX } from 'lucide-react';

interface EquivalenceExercise {
    id: number;
    type: 'equivalence';
    numerator: number;
    denominator: number;
    correctOption: { num: number; den: number };
    options: { num: number; den: number }[];
}

interface ComparisonExercise {
    id: number;
    type: 'comparison';
    left: { num: number; den: number };
    right: { num: number; den: number };
    correctSymbol: '>' | '<' | '=';
}

type Exercise = EquivalenceExercise | ComparisonExercise;

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateFraction = () => {
    const den = randomInt(2, 12);
    const num = randomInt(1, den - 1);
    return { num, den };
};

const areEquivalent = (aNum: number, aDen: number, bNum: number, bDen: number) =>
    aNum * bDen === bNum * aDen;

const compareFractions = (aNum: number, aDen: number, bNum: number, bDen: number) => {
    const diff = aNum * bDen - bNum * aDen;
    return diff === 0 ? 0 : diff > 0 ? 1 : -1;
};

const generateEquivalentOptions = (
    baseNum: number,
    baseDen: number,
    correctOption: { num: number; den: number }
) => {
    const opts = [{ ...correctOption }];
    while (opts.length < 4) {
        const { num, den } = generateFraction();
        if (areEquivalent(baseNum, baseDen, num, den)) continue;
        if (opts.some(o => o.num === num && o.den === den)) continue;
        opts.push({ num, den });
    }
    return opts.sort(() => Math.random() - 0.5);
};

const generateComparisonExercise = (): ComparisonExercise => {
    const left = generateFraction();
    const desiredSymbols: Array<'>' | '<' | '='> = ['>', '<', '='];
    const desired = desiredSymbols[randomInt(0, desiredSymbols.length - 1)];
    let right = generateFraction();

    if (desired === '=') {
        const factor = randomInt(2, 4);
        right = { num: left.num * factor, den: left.den * factor };
    } else {
        let attempts = 0;
        while (attempts < 60) {
            right = generateFraction();
            const cmp = compareFractions(left.num, left.den, right.num, right.den);
            if ((desired === '>' && cmp > 0) || (desired === '<' && cmp < 0)) break;
            attempts++;
        }
    }

    return {
        id: 0,
        type: 'comparison',
        left,
        right,
        correctSymbol: desired
    };
};

export default function FractionsExercises() {
    const t = useTranslations('FractionsGrade5');

    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [showResults, setShowResults] = useState(false);

    // Gamification states
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackCorrect, setFeedbackCorrect] = useState<boolean | null>(null);
    const [showXPGain, setShowXPGain] = useState(false);
    const [xpGained, setXpGained] = useState(0);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [completedCount, setCompletedCount] = useState(0);

    const generateExercises = useCallback(() => {
        const newExercises: Exercise[] = [];
        let idCounter = 1;
        const usedFractions = new Set<string>();

        // 1. Equivalent fractions (5 exercises — more challenging for 5th grade)
        for (let i = 0; i < 5; i++) {
            let { num, den } = generateFraction();
            let fractionKey = `${num}_${den}`;
            while (usedFractions.has(fractionKey)) {
                const frac = generateFraction();
                num = frac.num;
                den = frac.den;
                fractionKey = `${num}_${den}`;
            }
            usedFractions.add(fractionKey);
            const factor = randomInt(2, 5);
            const correctOption = { num: num * factor, den: den * factor };
            newExercises.push({
                id: idCounter++,
                type: 'equivalence',
                numerator: num,
                denominator: den,
                correctOption,
                options: generateEquivalentOptions(num, den, correctOption)
            });
        }

        // 2. Compare fractions (5 exercises)
        for (let i = 0; i < 5; i++) {
            const comparison = generateComparisonExercise();
            newExercises.push({
                ...comparison,
                id: idCounter++
            });
        }

        setExercises(newExercises);
        setAnswers({});
        setShowResults(false);
    }, []);

    useEffect(() => {
        generateExercises();
    }, [generateExercises]);

    const handleOptionSelect = (id: number, option: { num: number; den: number } | string) => {
        setAnswers(prev => ({ ...prev, [id]: typeof option === 'string' ? option : JSON.stringify(option) }));
        setShowResults(false);
    };

    const isCorrect = (ex: Exercise) => {
        const ans = answers[ex.id];
        if (!ans) return false;
        if (ex.type === 'equivalence') {
            const selected = JSON.parse(ans);
            return selected.num === ex.correctOption.num && selected.den === ex.correctOption.den;
        }
        if (ex.type === 'comparison') {
            return ans === ex.correctSymbol;
        }
        return false;
    };

    const getScoreInternal = () => {
        let score = 0;
        let total = 0;
        let answered = 0;
        exercises.forEach(ex => {
            total++;
            if (answers[ex.id] !== undefined && answers[ex.id] !== '') answered++;
            if (isCorrect(ex)) score++;
        });
        return { score, total, answered };
    };

    const checkAnswers = () => {
        setShowResults(true);

        const { score, total, answered } = getScoreInternal();
        const isPerfect = score === total;
        const isGood = score >= total * 0.7;

        const minAnsweredRatio = 0.8;
        const minScoreRatio = 0.2;
        const hasAnsweredEnough = answered >= total * minAnsweredRatio;
        const hasMinScore = score >= total * minScoreRatio;
        const earnedRewards = hasAnsweredEnough && hasMinScore;

        if (soundEnabled) {
            if (isPerfect) {
                playComplete();
            } else if (isGood) {
                playCorrect();
            } else {
                playIncorrect();
            }
        }

        setFeedbackCorrect(isGood);
        setShowFeedback(true);

        if (earnedRewards) {
            const completeExercise = useGamificationStore.getState().completeExercise;
            const result = completeExercise('math', score, total, isPerfect);
            setXpGained(result.xpGained);

            if (result.levelUp && soundEnabled) {
                setTimeout(() => playLevelUp(), 500);
            }

            setTimeout(() => {
                setShowXPGain(true);
                if (soundEnabled) playStar();
                setTimeout(() => setShowXPGain(false), 2000);
            }, 800);
        } else {
            setXpGained(0);
        }

        setCompletedCount(score);
    };

    const getScore = () => {
        let score = 0;
        let total = 0;
        exercises.forEach(ex => {
            total++;
            if (isCorrect(ex)) score++;
        });
        return { score, total };
    };

    const { score, total } = getScore();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-brand-orange/10 rounded-xl text-brand-orange flex-shrink-0">
                            <Calculator className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight">{t('title')}</h1>
                            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">{t('description')}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSoundEnabled(!soundEnabled)}
                            className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            title={soundEnabled ? 'Silenciar' : 'Activar sonido'}
                        >
                            {soundEnabled ? <Volume2 className="w-5 h-5 text-gray-600 dark:text-gray-400" /> : <VolumeX className="w-5 h-5 text-gray-400" />}
                        </button>
                        <button onClick={generateExercises} className="flex items-center justify-center gap-2 px-4 py-3 bg-brand-blue text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md font-bold">
                            <RefreshCw className="w-4 h-4" />
                            {t('generateNew')}
                        </button>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <ProgressBar
                        current={completedCount}
                        total={total}
                        showStars={true}
                        label={showResults ? t('score', { score, total }) : 'Progreso'}
                    />
                </div>

                {/* Section 1: Equivalent Fractions */}
                <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8 mb-8 border border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-indigo-600 mb-6 border-b pb-2 border-indigo-600/10">{t('equivalence')}</h2>
                    <div className="space-y-8">
                        {exercises.filter(e => e.type === 'equivalence').map((ex) => {
                            const correct = showResults && isCorrect(ex);
                            const wrong = showResults && !isCorrect(ex);
                            const eEx = ex as EquivalenceExercise;
                            return (
                                <div key={ex.id} className="flex flex-col md:flex-row items-center gap-8 border-b border-dashed border-gray-200 dark:border-gray-700 pb-8 last:border-0 last:pb-0">
                                    <div className="flex-shrink-0"><FractionVisual numerator={eEx.numerator} denominator={eEx.denominator} type="bar" size={180} color="#6366f1" /></div>
                                    <div className="flex items-center gap-2 text-2xl font-bold text-gray-700 dark:text-gray-300">
                                        <div className="flex flex-col items-center">
                                            <span>{eEx.numerator}</span>
                                            <span className="w-8 h-0.5 bg-current my-1"></span>
                                            <span>{eEx.denominator}</span>
                                        </div>
                                        <span className="mx-2">=</span>
                                        <span className="text-lg text-gray-400">?</span>
                                    </div>
                                    <div className="flex gap-4">
                                        {eEx.options.map((opt, idx) => {
                                            const isSelected = answers[ex.id] === JSON.stringify(opt);
                                            const isOptionCorrect =
                                                opt.num === eEx.correctOption.num && opt.den === eEx.correctOption.den;
                                            let btnClass = "border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-500 hover:bg-indigo-50";
                                            if (showResults) {
                                                if (isOptionCorrect) btnClass = "bg-green-100 border-green-500 text-green-800 shadow-[0_0_10px_rgba(34,197,94,0.3)]";
                                                else if (isSelected) btnClass = "bg-red-100 border-red-500 text-red-800 opacity-50";
                                                else btnClass = "opacity-40 border-gray-200";
                                            } else if (isSelected) btnClass = "border-indigo-500 bg-indigo-50 text-indigo-700 font-bold ring-2 ring-indigo-200";
                                            return (
                                                <button key={idx} onClick={() => handleOptionSelect(ex.id, opt)} disabled={showResults} className={`flex flex-col items-center justify-center w-20 h-24 rounded-xl transition-all duration-200 ${btnClass}`}>
                                                    <span className="text-xl">{opt.num}</span>
                                                    <span className="w-10 h-0.5 bg-current my-1 rounded-full"></span>
                                                    <span className="text-xl">{opt.den}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="ml-auto">
                                        {correct && <CheckCircle className="w-8 h-8 text-green-500" />}
                                        {wrong && <XCircle className="w-8 h-8 text-red-500" />}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Section 2: Compare Fractions */}
                <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8 mb-8 border border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-sky-600 mb-6 border-b pb-2 border-sky-600/10">{t('comparison')}</h2>
                    <div className="space-y-8">
                        {exercises.filter(e => e.type === 'comparison').map((ex) => {
                            const correct = showResults && isCorrect(ex);
                            const wrong = showResults && !isCorrect(ex);
                            const cEx = ex as ComparisonExercise;
                            const symbols: Array<'>' | '<' | '='> = ['>', '<', '='];
                            return (
                                <div key={ex.id} className="flex flex-col md:flex-row items-center gap-8 border-b border-dashed border-gray-200 dark:border-gray-700 pb-8 last:border-0 last:pb-0">
                                    <div className="flex-shrink-0">
                                        <div className="w-24 h-24 rounded-2xl bg-white dark:bg-gray-800 border-2 border-sky-200 dark:border-sky-500/30 flex items-center justify-center">
                                            <div className="flex flex-col items-center text-2xl font-bold font-mono text-sky-600 dark:text-sky-300">
                                                <span>{cEx.left.num}</span>
                                                <span className="w-10 h-0.5 bg-current my-1"></span>
                                                <span>{cEx.left.den}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        {symbols.map((sym) => {
                                            const isSelected = answers[ex.id] === sym;
                                            const isOptionCorrect = sym === cEx.correctSymbol;
                                            let btnClass = "border-2 border-gray-200 dark:border-gray-700 hover:border-sky-500 hover:bg-sky-50";
                                            if (showResults) {
                                                if (isOptionCorrect) btnClass = "bg-green-100 border-green-500 text-green-800";
                                                else if (isSelected) btnClass = "bg-red-100 border-red-500 text-red-800 opacity-50";
                                                else btnClass = "opacity-40 border-gray-200";
                                            } else if (isSelected) btnClass = "border-sky-500 bg-sky-50 text-sky-700 font-bold ring-2 ring-sky-200";
                                            return (
                                                <button key={sym} onClick={() => handleOptionSelect(ex.id, sym)} disabled={showResults} className={`w-14 h-14 rounded-xl text-2xl font-bold transition-all duration-200 ${btnClass}`}>
                                                    {sym}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="flex-shrink-0">
                                        <div className="w-24 h-24 rounded-2xl bg-white dark:bg-gray-800 border-2 border-sky-200 dark:border-sky-500/30 flex items-center justify-center">
                                            <div className="flex flex-col items-center text-2xl font-bold font-mono text-sky-600 dark:text-sky-300">
                                                <span>{cEx.right.num}</span>
                                                <span className="w-10 h-0.5 bg-current my-1"></span>
                                                <span>{cEx.right.den}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ml-auto">
                                        {correct && <CheckCircle className="w-8 h-8 text-green-500" />}
                                        {wrong && <XCircle className="w-8 h-8 text-red-500" />}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Actions */}
                <div className="mt-8 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div className="text-lg font-bold">
                        {showResults && (
                            <div className="flex flex-col">
                                <span className={`${score === total ? 'text-green-600' : 'text-brand-orange'} text-xl`}>{t('score', { score, total })}</span>
                                <span className="text-sm font-medium text-gray-500">
                                    {score === total && t('feedback.perfect')}
                                    {score >= total * 0.7 && score < total && t('feedback.great')}
                                    {score >= total * 0.4 && score < total * 0.7 && t('feedback.good')}
                                    {score < total * 0.4 && t('feedback.tryAgain')}
                                </span>
                            </div>
                        )}
                    </div>
                    <button onClick={checkAnswers} className="px-8 py-3 rounded-xl font-bold bg-brand-green text-white shadow-lg shadow-brand-green/30 hover:bg-green-600 hover:scale-105 transition-all">{t('checkAnswers')}</button>
                </div>
            </div>

            {/* Feedback Overlays */}
            <ExerciseFeedback
                isCorrect={feedbackCorrect}
                show={showFeedback}
                onComplete={() => setShowFeedback(false)}
            />
            <XPGainAnimation amount={xpGained} show={showXPGain} />
        </div>
    );
}
