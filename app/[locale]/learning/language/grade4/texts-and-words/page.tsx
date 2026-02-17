'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { RefreshCw, BookOpen, CheckCircle, XCircle, ChevronLeft, Volume2, VolumeX, HelpCircle, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressBar from '@/components/ProgressBar';
import { playCorrect, playIncorrect, playComplete } from '@/lib/audio/soundEffects';

// --- TYPES ---

type ExerciseType = 'select' | 'match' | 'classify' | 'pronoun-analysis';

interface BaseExercise {
    id: number;
    type: ExerciseType;
    instructionKey: string;
}

interface SelectExercise extends BaseExercise {
    type: 'select';
    questionText: string;
    options: { id: string; text: string; isCorrect: boolean }[];
}

interface MatchExercise extends BaseExercise {
    type: 'match';
    pairs: { id: string; left: string; right: string }[];
}

interface ClassifyExercise extends BaseExercise {
    type: 'classify';
    items: { id: string; text: string; category: string }[];
    categories: { id: string; label: string }[];
}

interface PronounAnalysisExercise extends BaseExercise {
    type: 'pronoun-analysis';
    pronoun: string;
    correctPerson: 1 | 2 | 3;
    correctNumber: 'singular' | 'plural';
}

type Exercise = SelectExercise | MatchExercise | ClassifyExercise | PronounAnalysisExercise;

// --- DATA ---

const PRONOUNS_DATA = [
    { text: 'Yo', person: 1, number: 'singular' },
    { text: 'Tú', person: 2, number: 'singular' },
    { text: 'Él', person: 3, number: 'singular' },
    { text: 'Ella', person: 3, number: 'singular' },
    { text: 'Nosotros', person: 1, number: 'plural' },
    { text: 'Vosotros', person: 2, number: 'plural' },
    { text: 'Ellos', person: 3, number: 'plural' },
    { text: 'Ellas', person: 3, number: 'plural' },
] as const;

export default function TextsAndWordsPage() {
    const t = useTranslations('LanguageGrade4.texts_words');
    const tCommon = useTranslations('Common');

    // --- STATE ---
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [userAnswers, setUserAnswers] = useState<Record<number, any>>({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    const [completedSteps, setCompletedSteps] = useState(0); // For global progress bar if needed

    // --- GAME LOGIC ---

    const generateExercises = useCallback(() => {
        const newExercises: Exercise[] = [];
        let idCounter = 1;

        // 1. TEXT TYPES (Select)
        // Randomized selection of scenarios
        const textScenarios = [
            { q: 'ex1_q1', type: 'letter' },
            { q: 'ex1_q2', type: 'diary' },
            { q: 'ex1_q3', type: 'letter' },
            { q: 'ex1_q4', type: 'diary' },
        ].sort(() => 0.5 - Math.random()).slice(0, 3); // Pick 3

        textScenarios.forEach(scen => {
            newExercises.push({
                id: idCounter++,
                type: 'select',
                instructionKey: 'ex1_title',
                questionText: t(scen.q), // We need to assume t() works here or pass keys. Using t() for now.
                options: [
                    { id: 'diary', text: t('diary'), isCorrect: scen.type === 'diary' },
                    { id: 'letter', text: t('letter'), isCorrect: scen.type === 'letter' }
                ].sort(() => 0.5 - Math.random())
            });
        });

        // 2. PREFIXES (Match/Select) - Converted to Select for simplicity in this iteration or keep Match?
        // Let's use Select for "Complete the word"
        const prefixData = [
            { base: 'peinar', correct: 'Des', options: ['Des', 'Sub', 'In'] },
            { base: 'campeón', correct: 'Sub', options: ['Re', 'Sub', 'Pre'] },
            { base: 'humano', correct: 'In', options: ['In', 'Des', 'Re'] },
        ].sort(() => 0.5 - Math.random()).slice(0, 2);

        prefixData.forEach(item => {
            newExercises.push({
                id: idCounter++,
                type: 'select',
                instructionKey: 'ex2_title', // "Prefixes and Suffixes"
                questionText: `...${item.base}`, // Show as "...peinar"
                options: item.options.map(opt => ({
                    id: opt,
                    text: opt,
                    isCorrect: opt === item.correct
                })).sort(() => 0.5 - Math.random())
            });
        });

        // 3. SUFFIXES
        const suffixData = [
            { base: 'Flor', correct: 'ero', options: ['ero', 'ble', 'oso'] },
            { base: 'Camin', correct: 'ante', options: ['ante', 'ito', 'ción'] },
        ].sort(() => 0.5 - Math.random()).slice(0, 2);

        suffixData.forEach(item => {
            newExercises.push({
                id: idCounter++,
                type: 'select',
                instructionKey: 'ex2_title',
                questionText: `${item.base}...`, // Show as "Flor..."
                options: item.options.map(opt => ({
                    id: opt,
                    text: opt,
                    isCorrect: opt === item.correct
                })).sort(() => 0.5 - Math.random())
            });
        });


        // 4. MATCHING (Prefixes to meanings or definitions - simplified here as Prefix to Word for valid construction)
        // Let's create a Matching pair set
        const matchPairs = [
            { left: 'Re-', right: 'hacer' }, // Rehacer
            { left: 'Pre-', right: 'historia' }, // Prehistoria
            { left: 'Sub-', right: 'marino' }, // Submarino
            { left: 'Des-', right: 'ordenado' }, // Desordenado
        ].sort(() => 0.5 - Math.random()).slice(0, 3); // Pick 3 pairs

        newExercises.push({
            id: idCounter++,
            type: 'match',
            instructionKey: 'ex3_title',
            pairs: matchPairs.map((p, idx) => ({ id: `p${idx}`, left: p.left, right: p.right }))
        });

        // 5. PRONOUN ANALYSIS (New Logic for "Exercise 5")
        // Pick 2 random pronouns to analyze
        const randomPronouns = [...PRONOUNS_DATA].sort(() => 0.5 - Math.random()).slice(0, 2);

        randomPronouns.forEach(p => {
            newExercises.push({
                id: idCounter++,
                type: 'pronoun-analysis',
                instructionKey: 'ex5_title',
                pronoun: p.text,
                correctPerson: p.person as 1 | 2 | 3,
                correctNumber: p.number as 'singular' | 'plural'
            });
        });

        setExercises(newExercises);
        setUserAnswers({});
        setShowResults(false);
        setScore(0);
        window.scrollTo(0, 0);

    }, [t]); // Depend on t to regenerate if language changes

    useEffect(() => {
        generateExercises();
    }, [generateExercises]);


    // --- HANDLERS ---

    const handleAnswer = (exerciseId: number, answer: any) => {
        if (showResults) return;
        setUserAnswers(prev => ({ ...prev, [exerciseId]: answer }));
    };

    const checkAnswers = () => {
        let newScore = 0;
        let totalScore = 0;

        exercises.forEach(ex => {
            const answer = userAnswers[ex.id];

            if (ex.type === 'select') {
                totalScore++;
                const correctOpt = ex.options.find(o => o.isCorrect);
                if (answer === correctOpt?.id) newScore++;
            }
            else if (ex.type === 'match') {
                totalScore += ex.pairs.length;
                // Answer format: { [leftId]: rightId }
                if (answer) {
                    ex.pairs.forEach(pair => {
                        // Find which right text corresponds to this pair's right text (since ids are dynamic/mapped)
                        // Actually simpler: MatchExercise component should return connections mapping left->right
                        // And we check if pair.left connected to pair.right
                        if (answer[pair.left] === pair.right) newScore++;
                    });
                }
            }
            else if (ex.type === 'pronoun-analysis') {
                totalScore++; // Or 2 points? Let's say 1 point for full correctness
                if (answer && answer.person === ex.correctPerson && answer.number === ex.correctNumber) {
                    newScore++;
                }
            }
        });

        setScore(Math.round((newScore / totalScore) * 100)); // Normalize to 0-100 or keep raw? Let's keep raw for now or use percentage?
        // Let's store raw score count vs total count for now
        setShowResults(true);

        if (newScore === totalScore) {
            playComplete();
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            });
        } else if (newScore > totalScore / 2) {
            playCorrect();
        } else {
            playIncorrect();
        }
    };

    // --- RENDER HELPERS ---

    const renderSelect = (ex: SelectExercise) => {
        const userAnswer = userAnswers[ex.id];
        const isCorrect = showResults && ex.options.find(o => o.isCorrect)?.id === userAnswer;

        return (
            <div className="space-y-4">
                <div className="bg-white p-6 rounded-2xl border-2 border-orange-100 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">{ex.questionText}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {ex.options.map(opt => {
                            let statusClass = "border-gray-200 hover:border-orange-300 hover:bg-orange-50";
                            if (showResults) {
                                if (opt.isCorrect) statusClass = "bg-green-100 border-green-500 text-green-800 shadow-[0_0_10px_rgba(34,197,94,0.3)]";
                                else if (userAnswer === opt.id) statusClass = "bg-red-100 border-red-500 text-red-800 opacity-50";
                                else statusClass = "opacity-40 border-gray-200";
                            } else if (userAnswer === opt.id) {
                                statusClass = "bg-orange-100 border-orange-500 text-orange-800 shadow-md transform scale-[1.02]";
                            }

                            return (
                                <button
                                    key={opt.id}
                                    onClick={() => handleAnswer(ex.id, opt.id)}
                                    disabled={showResults}
                                    className={`p-4 rounded-xl border-2 font-bold text-lg transition-all duration-200 ${statusClass}`}
                                >
                                    {opt.text}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    const renderPronounAnalysis = (ex: PronounAnalysisExercise) => {
        const answer = userAnswers[ex.id] || { person: null, number: null };
        const isCorrect = showResults && answer.person === ex.correctPerson && answer.number === ex.correctNumber;
        const isMissed = showResults && !isCorrect;

        return (
            <div className={`bg-white p-6 rounded-2xl border-2 shadow-sm transition-all ${isCorrect ? 'border-green-500 bg-green-50' : isMissed ? 'border-red-500 bg-red-50' : 'border-indigo-100'}`}>
                <div className="text-center mb-6">
                    <div className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-2">{t('analyze_pronoun')}</div>
                    <div className="text-4xl font-black text-indigo-900">{ex.pronoun}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Person */}
                    <div className="bg-indigo-50/50 p-4 rounded-xl">
                        <div className="text-xs font-bold text-center text-indigo-400 uppercase mb-3">{t('person')}</div>
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3].map(p => (
                                <button
                                    key={p}
                                    onClick={() => handleAnswer(ex.id, { ...answer, person: p })}
                                    disabled={showResults}
                                    className={`w-12 h-12 rounded-lg font-bold border-2 transition-all ${answer.person === p
                                        ? 'bg-indigo-500 border-indigo-600 text-white shadow-lg scale-110'
                                        : 'bg-white border-indigo-200 text-indigo-400 hover:border-indigo-400'
                                        } ${showResults && ex.correctPerson === p ? 'ring-4 ring-green-400 z-10' : ''}`}
                                >
                                    {p}º
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Number */}
                    <div className="bg-pink-50/50 p-4 rounded-xl">
                        <div className="text-xs font-bold text-center text-pink-400 uppercase mb-3">{t('number')}</div>
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => handleAnswer(ex.id, { ...answer, number: 'singular' })}
                                disabled={showResults}
                                className={`px-4 py-2 rounded-lg font-bold border-2 text-sm transition-all ${answer.number === 'singular'
                                    ? 'bg-pink-500 border-pink-600 text-white shadow-lg'
                                    : 'bg-white border-pink-200 text-pink-400 hover:border-pink-400'
                                    } ${showResults && ex.correctNumber === 'singular' ? 'ring-4 ring-green-400 z-10' : ''}`}
                            >
                                {t('singular')}
                            </button>
                            <button
                                onClick={() => handleAnswer(ex.id, { ...answer, number: 'plural' })}
                                disabled={showResults}
                                className={`px-4 py-2 rounded-lg font-bold border-2 text-sm transition-all ${answer.number === 'plural'
                                    ? 'bg-pink-500 border-pink-600 text-white shadow-lg'
                                    : 'bg-white border-pink-200 text-pink-400 hover:border-pink-400'
                                    } ${showResults && ex.correctNumber === 'plural' ? 'ring-4 ring-green-400 z-10' : ''}`}
                            >
                                {t('plural')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // --- COMPONENT FOR MATCHING EXERCISE ---
    // (Defining it inside for simplicity/closure access, usually moving to separate file is better but keeping focused here)
    const MatchingExerciseRenderer = ({ exercise }: { exercise: MatchExercise }) => {
        const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
        const connections = userAnswers[exercise.id] || {}; // { [leftString]: rightString }

        const handleLeftClick = (left: string) => {
            if (showResults) return;
            // If already connected, disconnect
            if (connections[left]) {
                const newConn = { ...connections };
                delete newConn[left];
                handleAnswer(exercise.id, newConn);
                return;
            }
            setSelectedLeft(left);
        };

        const handleRightClick = (right: string) => {
            if (showResults) return;
            if (!selectedLeft) return;

            // Connect selectedLeft to this right
            const newConn = { ...connections, [selectedLeft]: right };
            handleAnswer(exercise.id, newConn);
            setSelectedLeft(null);
        };

        return (
            <div className="bg-white p-6 rounded-2xl border-2 border-teal-100 shadow-sm">
                <div className="flex justify-between gap-8 relative">
                    {/* Lines SVG Overlay could go here but simple button state is often clearer for accessibility/mobile */}

                    {/* Left Column */}
                    <div className="flex flex-col gap-4 flex-1">
                        {exercise.pairs.map(pair => {
                            const isConnected = !!connections[pair.left];
                            const isSelected = selectedLeft === pair.left;
                            // Check correctness if showing results
                            let statusClass = "bg-white border-gray-200 text-gray-600 hover:border-teal-300";

                            if (showResults) {
                                if (isConnected && connections[pair.left] === pair.right) {
                                    statusClass = "bg-green-100 border-green-500 text-green-700";
                                } else if (isConnected) {
                                    statusClass = "bg-red-100 border-red-500 text-red-700 opacity-50";
                                }
                            } else {
                                if (isSelected) statusClass = "bg-teal-500 border-teal-600 text-white ring-4 ring-teal-200";
                                else if (isConnected) statusClass = "bg-teal-50 border-teal-400 text-teal-700";
                            }

                            return (
                                <button
                                    key={pair.left}
                                    onClick={() => handleLeftClick(pair.left)}
                                    disabled={showResults}
                                    className={`p-4 rounded-xl border-2 font-bold text-lg transition-all ${statusClass}`}
                                >
                                    {pair.left}
                                </button>
                            );
                        })}
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-4 flex-1">
                        {/* We randomize right column visuals so they don't align perfectly? Or keep aligned and let randomization happen at data level?
                            The data `pairs` is aligned. We should probably shuffle the visuals for the right side.
                            For simplicity, let's just render them. Ideally we need a shuffled list of right items.
                         */}
                        {useMemo(() => [...exercise.pairs].sort(() => 0.5 - Math.random()), [exercise.id]).map(pair => {
                            // Find which left item is connected to this right item
                            const connectedLeft = Object.keys(connections).find(key => connections[key] === pair.right);

                            let statusClass = "bg-white border-gray-200 text-gray-600 hover:border-teal-300";
                            if (showResults) {
                                // Find the correct left for this right
                                const correctLeft = exercise.pairs.find(p => p.right === pair.right)?.left;
                                if (connectedLeft && connectedLeft === correctLeft) {
                                    statusClass = "bg-green-100 border-green-500 text-green-700";
                                } else if (connectedLeft) {
                                    statusClass = "bg-red-100 border-red-500 text-red-700 opacity-50";
                                }
                            } else {
                                if (connectedLeft) statusClass = "bg-teal-50 border-teal-400 text-teal-700";
                                else if (selectedLeft) statusClass = "bg-white border-teal-200 border-dashed text-gray-400 hover:bg-teal-50 hover:border-solid hover:text-teal-600";
                            }

                            return (
                                <button
                                    key={pair.right}
                                    onClick={() => handleRightClick(pair.right)}
                                    disabled={showResults}
                                    className={`p-4 rounded-xl border-2 font-bold text-lg transition-all ${statusClass}`}
                                >
                                    {pair.right}
                                    {connectedLeft && !showResults && <span className="ml-2 text-xs opacity-50">({connectedLeft})</span>}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };


    return (
        <div className="min-h-screen bg-orange-50 font-sans p-4 md:p-8 pb-32">

            {/* Header */}
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border-b-4 border-orange-200 p-4 flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/learning/language/grade4" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ChevronLeft className="w-6 h-6 text-gray-500" />
                    </Link>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-gray-800">{t('title')}</h1>
                        <p className="text-gray-500 text-sm">{t('subtitle')}</p>
                    </div>
                </div>

                <button onClick={() => { generateExercises(); window.scrollTo(0, 0); }} className="flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-xl font-bold hover:bg-orange-200 transition">
                    <RefreshCw size={18} />
                    <span className="hidden sm:inline">{t('reset')}</span>
                </button>
            </div>

            {/* Exercises Feed */}
            <div className="max-w-3xl mx-auto space-y-12">
                {exercises.map((ex, index) => (
                    <div key={ex.id} className="relative">
                        {/* Circle Number */}
                        <div className="absolute -left-4 -top-4 md:-left-12 md:top-0 w-10 h-10 bg-white border-2 border-orange-200 rounded-full flex items-center justify-center font-bold text-orange-400 shadow-sm z-10">
                            {index + 1}
                        </div>

                        <div className="mb-4 ml-2">
                            <h2 className="text-lg font-bold text-gray-600 uppercase tracking-wider">{t(ex.instructionKey)}</h2>
                        </div>

                        {ex.type === 'select' && renderSelect(ex as SelectExercise)}
                        {ex.type === 'match' && <MatchingExerciseRenderer exercise={ex as MatchExercise} />}
                        {ex.type === 'pronoun-analysis' && renderPronounAnalysis(ex as PronounAnalysisExercise)}
                    </div>
                ))}
            </div>

            {/* Footer Check Button - Static at end of content */}
            <div className="mt-12 p-4 bg-white rounded-2xl border-t border-gray-200 shadow-sm">
                <div className="max-w-3xl mx-auto flex gap-4 items-center">
                    {showResults ? (
                        <div className="flex-1 flex items-center justify-between animate-fade-in">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-400 uppercase">Resultado</span>
                                <span className="text-2xl font-black text-gray-800">
                                    {Object.values(userAnswers).filter((_, i) => exercises[i] && exercises[i].type !== 'match' /* Simplified scoring check logic needed here or passed from state */).length > 0 ? '' : ''}
                                    {/* Score display logic is complex to inline, reusing score state */}
                                    {score}% Correcto
                                </span>
                            </div>
                            <button
                                onClick={generateExercises}
                                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-500 transition-transform active:scale-95 flex items-center gap-2"
                            >
                                <RefreshCw size={20} />
                                Practicar más
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={checkAnswers}
                            className="w-full py-4 bg-orange-500 text-white rounded-xl font-black text-xl shadow-[0_5px_0_#c2410c] hover:bg-orange-400 active:translate-y-1 active:shadow-[0_2px_0_#c2410c] transition-all flex items-center justify-center gap-3"
                        >
                            <CheckCircle size={24} />
                            {tCommon('checkAnswers') || "Corregir"}
                        </button>
                    )}
                </div>
            </div>

        </div>
    );
}
