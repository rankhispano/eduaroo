'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { RefreshCw, CheckCircle, ChevronLeft } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import confetti from 'canvas-confetti';
import { playCorrect, playIncorrect, playComplete } from '@/lib/audio/soundEffects';

// --- TYPES ---

type ExerciseType = 'select' | 'match' | 'classify' | 'pronoun-analysis' | 'demonstrative-analysis';

type Gender = 'masculine' | 'feminine' | 'neutral';
type NumberType = 'singular' | 'plural';
type Distance = 'near' | 'middle' | 'far';

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
    correctNumber: NumberType;
    correctGender: Gender;
}

interface DemonstrativeAnalysisExercise extends BaseExercise {
    type: 'demonstrative-analysis';
    word: string;
    correctDistance: Distance;
    correctGender: Gender;
    correctNumber: NumberType;
}

type Exercise = SelectExercise | MatchExercise | ClassifyExercise | PronounAnalysisExercise | DemonstrativeAnalysisExercise;

// --- DATA ---

const PRONOUNS_DATA = [
    { text: 'Yo', person: 1, number: 'singular', gender: 'neutral' },
    { text: 'Tú', person: 2, number: 'singular', gender: 'neutral' },
    { text: 'Él', person: 3, number: 'singular', gender: 'masculine' },
    { text: 'Ella', person: 3, number: 'singular', gender: 'feminine' },
    { text: 'Nosotros', person: 1, number: 'plural', gender: 'masculine' },
    { text: 'Nosotras', person: 1, number: 'plural', gender: 'feminine' },
    { text: 'Ellos', person: 3, number: 'plural', gender: 'masculine' },
    { text: 'Ellas', person: 3, number: 'plural', gender: 'feminine' },
    { text: 'Ello', person: 3, number: 'singular', gender: 'neutral' },
] as const;

const DEMONSTRATIVES_DATA = [
    // Close (Cerca)
    { text: 'Este', distance: 'near', gender: 'masculine', number: 'singular' },
    { text: 'Esta', distance: 'near', gender: 'feminine', number: 'singular' },
    { text: 'Esto', distance: 'near', gender: 'neutral', number: 'singular' },
    { text: 'Estos', distance: 'near', gender: 'masculine', number: 'plural' },
    { text: 'Estas', distance: 'near', gender: 'feminine', number: 'plural' },
    // Middle (Distancia Media)
    { text: 'Ese', distance: 'middle', gender: 'masculine', number: 'singular' },
    { text: 'Esa', distance: 'middle', gender: 'feminine', number: 'singular' },
    { text: 'Eso', distance: 'middle', gender: 'neutral', number: 'singular' },
    { text: 'Esos', distance: 'middle', gender: 'masculine', number: 'plural' },
    { text: 'Esas', distance: 'middle', gender: 'feminine', number: 'plural' },
    // Far (Lejos)
    { text: 'Aquel', distance: 'far', gender: 'masculine', number: 'singular' },
    { text: 'Aquella', distance: 'far', gender: 'feminine', number: 'singular' },
    { text: 'Aquello', distance: 'far', gender: 'neutral', number: 'singular' },
    { text: 'Aquellos', distance: 'far', gender: 'masculine', number: 'plural' },
    { text: 'Aquellas', distance: 'far', gender: 'feminine', number: 'plural' },
] as const;


export default function TextsAndWordsPage() {
    const t = useTranslations('LanguageGrade4.communication_grammar');
    const tCommon = useTranslations('Common');

    // --- STATE ---
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [userAnswers, setUserAnswers] = useState<Record<number, any>>({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);

    // --- GAME LOGIC ---

    const generateExercises = useCallback(() => {
        const newExercises: Exercise[] = [];
        let idCounter = 1;

        // 1. TEXT TYPES (Select)
        const textScenarios = [
            { q: 'ex1_q1', type: 'letter' },
            { q: 'ex1_q2', type: 'diary' },
            { q: 'ex1_q3', type: 'letter' },
            { q: 'ex1_q4', type: 'diary' },
        ].sort(() => 0.5 - Math.random()).slice(0, 2);

        textScenarios.forEach(scen => {
            newExercises.push({
                id: idCounter++,
                type: 'select',
                instructionKey: 'ex1_title',
                questionText: t(scen.q),
                options: [
                    { id: 'diary', text: t('diary'), isCorrect: scen.type === 'diary' },
                    { id: 'letter', text: t('letter'), isCorrect: scen.type === 'letter' }
                ].sort(() => 0.5 - Math.random())
            });
        });

        // 2. PREFIXES / SUFFIXES (Select)
        const wordData = [
            { base: 'peinar', correct: 'Des', options: ['Des', 'Sub', 'In'], type: 'prefix' },
            { base: 'campeón', correct: 'Sub', options: ['Re', 'Sub', 'Pre'], type: 'prefix' },
            { base: 'humano', correct: 'In', options: ['In', 'Des', 'Re'], type: 'prefix' },
            { base: 'visible', correct: 'In', options: ['In', 'Des', 'Im'], type: 'prefix' },
            { base: 'Flor', correct: 'ero', options: ['ero', 'ble', 'oso'], type: 'suffix' },
            { base: 'Camin', correct: 'ante', options: ['ante', 'ito', 'ción'], type: 'suffix' },
        ].sort(() => 0.5 - Math.random()).slice(0, 3);

        wordData.forEach(item => {
            newExercises.push({
                id: idCounter++,
                type: 'select',
                instructionKey: 'ex2_title', // "Complete with prefix/suffix"
                questionText: item.type === 'prefix' ? `...${item.base}` : `${item.base}...`,
                options: item.options.map(opt => ({
                    id: opt,
                    text: opt,
                    isCorrect: opt === item.correct
                })).sort(() => 0.5 - Math.random())
            });
        });

        // 3. MATCHING (Prefixes to Words)
        const matchData = [
            { left: 'Re-', right: 'hacer' },
            { left: 'Pre-', right: 'historia' },
            { left: 'Sub-', right: 'marino' },
            { left: 'Des-', right: 'ordenado' },
            { left: 'Bi-', right: 'cicleta' },
            { left: 'Tri-', right: 'ángulo' },
            { left: 'Anti-', right: 'virus' },
            { left: 'Semi-', right: 'círculo' },
        ].sort(() => 0.5 - Math.random()).slice(0, 4); // Pick 4 pairs 

        newExercises.push({
            id: idCounter++,
            type: 'match',
            instructionKey: 'ex3_title',
            pairs: matchData.map((p, idx) => ({ id: `p${idx}`, left: p.left, right: p.right }))
        });

        // 4. PRONOUN ANALYSIS (4 exercises)
        const randomPronouns = [...PRONOUNS_DATA].sort(() => 0.5 - Math.random()).slice(0, 4);
        randomPronouns.forEach(p => {
            newExercises.push({
                id: idCounter++,
                type: 'pronoun-analysis',
                instructionKey: 'ex5_title',
                pronoun: p.text,
                correctPerson: p.person as 1 | 2 | 3,
                correctNumber: p.number as NumberType,
                correctGender: p.gender as Gender
            });
        });

        // 5. DEMONSTRATIVE ANALYSIS (4 exercises)
        const randomDemonstratives = [...DEMONSTRATIVES_DATA].sort(() => 0.5 - Math.random()).slice(0, 4);
        randomDemonstratives.forEach(d => {
            newExercises.push({
                id: idCounter++,
                type: 'demonstrative-analysis',
                instructionKey: 'analyze_demonstrative',
                word: d.text,
                correctDistance: d.distance as Distance,
                correctGender: d.gender as Gender,
                correctNumber: d.number as NumberType
            });
        });

        setExercises(newExercises);
        setUserAnswers({});
        setShowResults(false);
        setScore(0);
        window.scrollTo(0, 0);

    }, [t]);

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
                if (answer) {
                    // answer is { leftStr: rightStr }
                    ex.pairs.forEach(pair => {
                        if (answer[pair.left] === pair.right) newScore++;
                    });
                }
            }
            else if (ex.type === 'pronoun-analysis') {
                totalScore += 3; // Person + Number + Gender
                if (answer) {
                    if (answer.person === ex.correctPerson) newScore++;
                    if (answer.number === ex.correctNumber) newScore++;
                    if (answer.gender === ex.correctGender) newScore++;
                }
            }
            else if (ex.type === 'demonstrative-analysis') {
                totalScore += 3; // Distance + Number + Gender
                if (answer) {
                    if (answer.distance === ex.correctDistance) newScore++;
                    if (answer.number === ex.correctNumber) newScore++;
                    if (answer.gender === ex.correctGender) newScore++;
                }
            }
        });

        setScore(Math.round((newScore / totalScore) * 100));
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
        const answer = userAnswers[ex.id] || { person: null, number: null, gender: null };
        const isPersonCorrect = showResults && answer.person === ex.correctPerson;
        const isNumberCorrect = showResults && answer.number === ex.correctNumber;
        const isGenderCorrect = showResults && answer.gender === ex.correctGender;
        const isAllCorrect = isPersonCorrect && isNumberCorrect && isGenderCorrect;

        return (
            <div className={`bg-white p-6 rounded-2xl border-2 shadow-sm transition-all ${isAllCorrect ? 'border-green-500 bg-green-50' : showResults ? 'border-red-200' : 'border-indigo-100'}`}>
                <div className="text-center mb-6">
                    <div className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-2">{t('analyze_pronoun')}</div>
                    <div className="text-4xl font-black text-indigo-900">{ex.pronoun}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Person */}
                    <div className={`p-4 rounded-xl ${showResults && !isPersonCorrect ? 'bg-red-50' : 'bg-indigo-50/50'}`}>
                        <div className="text-xs font-bold text-center text-indigo-400 uppercase mb-3">{t('person')}</div>
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3].map(p => (
                                <button
                                    key={p}
                                    onClick={() => handleAnswer(ex.id, { ...answer, person: p })}
                                    disabled={showResults}
                                    className={`w-12 h-12 rounded-lg font-bold border-2 transition-all ${answer.person === p
                                        ? 'bg-indigo-500 border-indigo-600 text-white shadow-lg'
                                        : 'bg-white border-indigo-200 text-indigo-400 hover:border-indigo-400'
                                        } ${showResults && ex.correctPerson === p ? 'ring-2 ring-green-500 ring-offset-2' : ''}`}
                                >
                                    {p}º
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Gender */}
                    <div className={`p-4 rounded-xl ${showResults && !isGenderCorrect ? 'bg-red-50' : 'bg-purple-50/50'}`}>
                        <div className="text-xs font-bold text-center text-purple-400 uppercase mb-3">{t('gender')}</div>
                        <div className="flex flex-col gap-2">
                            {(['masculine', 'feminine', 'neutral'] as const).map(g => (
                                <button
                                    key={g}
                                    onClick={() => handleAnswer(ex.id, { ...answer, gender: g })}
                                    disabled={showResults}
                                    className={`px-3 py-2 rounded-lg font-bold border-2 text-sm transition-all ${answer.gender === g
                                        ? 'bg-purple-500 border-purple-600 text-white shadow-lg'
                                        : 'bg-white border-purple-200 text-purple-400 hover:border-purple-400'
                                        } ${showResults && ex.correctGender === g ? 'ring-2 ring-green-500 ring-offset-2' : ''}`}
                                >
                                    {t(g)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Number */}
                    <div className={`p-4 rounded-xl ${showResults && !isNumberCorrect ? 'bg-red-50' : 'bg-pink-50/50'}`}>
                        <div className="text-xs font-bold text-center text-pink-400 uppercase mb-3">{t('number')}</div>
                        <div className="flex flex-col gap-2">
                            {(['singular', 'plural'] as const).map(n => (
                                <button
                                    key={n}
                                    onClick={() => handleAnswer(ex.id, { ...answer, number: n })}
                                    disabled={showResults}
                                    className={`px-4 py-2 rounded-lg font-bold border-2 text-sm transition-all ${answer.number === n
                                        ? 'bg-pink-500 border-pink-600 text-white shadow-lg'
                                        : 'bg-white border-pink-200 text-pink-400 hover:border-pink-400'
                                        } ${showResults && ex.correctNumber === n ? 'ring-2 ring-green-500 ring-offset-2' : ''}`}
                                >
                                    {t(n)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderDemonstrativeAnalysis = (ex: DemonstrativeAnalysisExercise) => {
        const answer = userAnswers[ex.id] || { distance: null, gender: null, number: null };
        const isDistanceCorrect = showResults && answer.distance === ex.correctDistance;
        const isGenderCorrect = showResults && answer.gender === ex.correctGender;
        const isNumberCorrect = showResults && answer.number === ex.correctNumber;
        const isAllCorrect = isDistanceCorrect && isGenderCorrect && isNumberCorrect;

        return (
            <div className={`bg-white p-6 rounded-2xl border-2 shadow-sm transition-all ${isAllCorrect ? 'border-green-500 bg-green-50' : showResults ? 'border-red-200' : 'border-blue-100'}`}>
                <div className="text-center mb-6">
                    <div className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-2">{t('analyze_demonstrative')}</div>
                    <div className="text-4xl font-black text-blue-900">{ex.word}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Distance */}
                    <div className={`p-4 rounded-xl ${showResults && !isDistanceCorrect ? 'bg-red-50' : 'bg-blue-50/50'}`}>
                        <div className="text-xs font-bold text-center text-blue-400 uppercase mb-3">{t('distance')}</div>
                        <div className="flex flex-col gap-2">
                            {(['near', 'middle', 'far'] as const).map(d => (
                                <button
                                    key={d}
                                    onClick={() => handleAnswer(ex.id, { ...answer, distance: d })}
                                    disabled={showResults}
                                    className={`px-3 py-2 rounded-lg font-bold border-2 text-sm transition-all ${answer.distance === d
                                        ? 'bg-blue-500 border-blue-600 text-white shadow-lg'
                                        : 'bg-white border-blue-200 text-blue-400 hover:border-blue-400'
                                        } ${showResults && ex.correctDistance === d ? 'ring-2 ring-green-500 ring-offset-2' : ''}`}
                                >
                                    {t(d)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Gender */}
                    <div className={`p-4 rounded-xl ${showResults && !isGenderCorrect ? 'bg-red-50' : 'bg-purple-50/50'}`}>
                        <div className="text-xs font-bold text-center text-purple-400 uppercase mb-3">{t('gender')}</div>
                        <div className="flex flex-col gap-2">
                            {(['masculine', 'feminine', 'neutral'] as const).map(g => (
                                <button
                                    key={g}
                                    onClick={() => handleAnswer(ex.id, { ...answer, gender: g })}
                                    disabled={showResults}
                                    className={`px-3 py-2 rounded-lg font-bold border-2 text-sm transition-all ${answer.gender === g
                                        ? 'bg-purple-500 border-purple-600 text-white shadow-lg'
                                        : 'bg-white border-purple-200 text-purple-400 hover:border-purple-400'
                                        } ${showResults && ex.correctGender === g ? 'ring-2 ring-green-500 ring-offset-2' : ''}`}
                                >
                                    {t(g)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Number */}
                    <div className={`p-4 rounded-xl ${showResults && !isNumberCorrect ? 'bg-red-50' : 'bg-pink-50/50'}`}>
                        <div className="text-xs font-bold text-center text-pink-400 uppercase mb-3">{t('number')}</div>
                        <div className="flex flex-col gap-2">
                            {(['singular', 'plural'] as const).map(n => (
                                <button
                                    key={n}
                                    onClick={() => handleAnswer(ex.id, { ...answer, number: n })}
                                    disabled={showResults}
                                    className={`px-4 py-2 rounded-lg font-bold border-2 text-sm transition-all ${answer.number === n
                                        ? 'bg-pink-500 border-pink-600 text-white shadow-lg'
                                        : 'bg-white border-pink-200 text-pink-400 hover:border-pink-400'
                                        } ${showResults && ex.correctNumber === n ? 'ring-2 ring-green-500 ring-offset-2' : ''}`}
                                >
                                    {t(n)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // --- COMPONENT FOR MATCHING EXERCISE WITH SVG LINES ---
    const MatchingExerciseRenderer = ({ exercise }: { exercise: MatchExercise }) => {
        const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
        const connections = userAnswers[exercise.id] || {};
        const containerRef = useRef<HTMLDivElement>(null);
        const [svgLines, setSvgLines] = useState<{ x1: number, y1: number, x2: number, y2: number, color: string, dash?: number }[]>([]);

        // Shuffled right items (stable per exercise ID)
        // Shuffled right items (stable per exercise ID)
        // We use a ref to store the shuffled items so they don't change on re-renders unless the exercise changes
        const rightItemsRef = useRef<{ id: string; left: string; right: string }[]>([]);
        const lastExerciseIdRef = useRef<number | null>(null);

        if (lastExerciseIdRef.current !== exercise.id) {
            rightItemsRef.current = [...exercise.pairs].sort(() => 0.5 - Math.random());
            lastExerciseIdRef.current = exercise.id;
        }

        const rightItems = rightItemsRef.current;

        useEffect(() => {
            if (!containerRef.current) return;
            const newLines: any[] = [];
            const containerRect = containerRef.current.getBoundingClientRect();

            // 1. User Connections
            Object.entries(connections).forEach(([left, right]) => {
                const lEl = document.getElementById(`match-left-${left}`);
                const rEl = document.getElementById(`match-right-${right}`);
                if (!lEl || !rEl) return;

                const lRect = lEl.getBoundingClientRect();
                const rRect = rEl.getBoundingClientRect();

                let color = "#3b82f6"; // Blue
                if (showResults) {
                    // Find correct pair
                    const pair = exercise.pairs.find(p => p.left === left);
                    if (pair && pair.right === right) color = "#22c55e"; // Green
                    else color = "#ef4444"; // Red
                }

                newLines.push({
                    x1: lRect.right - containerRect.left,
                    y1: lRect.top + lRect.height / 2 - containerRect.top,
                    x2: rRect.left - containerRect.left,
                    y2: rRect.top + rRect.height / 2 - containerRect.top,
                    color,
                    dash: 0
                });
            });

            // 2. Correct Solution Lines (if missed/wrong)
            if (showResults) {
                exercise.pairs.forEach(pair => {
                    // check if user got it right
                    if (connections[pair.left] === pair.right) return;

                    const lEl = document.getElementById(`match-left-${pair.left}`);
                    const rEl = document.getElementById(`match-right-${pair.right}`);
                    if (!lEl || !rEl) return;

                    const lRect = lEl.getBoundingClientRect();
                    const rRect = rEl.getBoundingClientRect();

                    newLines.unshift({ // Add behind user lines
                        x1: lRect.right - containerRect.left,
                        y1: lRect.top + lRect.height / 2 - containerRect.top,
                        x2: rRect.left - containerRect.left,
                        y2: rRect.top + rRect.height / 2 - containerRect.top,
                        color: "#22c55e",
                        dash: 5 // Dashed line
                    });
                });
            }

            setSvgLines(newLines);
        }, [connections, showResults, rightItems, exercise.pairs]);

        const handleLeftClick = (left: string) => {
            if (showResults) return;
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
            // Find if this right is already connected to another left, if so, disconnect that one
            const currentConnectedLeft = Object.keys(connections).find(l => connections[l] === right);
            if (currentConnectedLeft) {
                const newConn = { ...connections };
                delete newConn[currentConnectedLeft];
                if (selectedLeft) {
                    // If we have a selected left, replace the connection
                    newConn[selectedLeft] = right;
                    handleAnswer(exercise.id, newConn);
                    setSelectedLeft(null);
                } else {
                    // Just disconnect
                    handleAnswer(exercise.id, newConn);
                }
                return;
            }

            if (!selectedLeft) return;
            const newConn = { ...connections, [selectedLeft]: right };
            handleAnswer(exercise.id, newConn);
            setSelectedLeft(null);
        };

        return (
            <div className="bg-white p-6 rounded-2xl border-2 border-teal-100 shadow-sm relative" ref={containerRef}>
                <svg className="absolute inset-0 pointer-events-none w-full h-full" style={{ zIndex: 10 }}>
                    {svgLines.map((line, i) => (
                        <line
                            key={i}
                            x1={line.x1}
                            y1={line.y1}
                            x2={line.x2}
                            y2={line.y2}
                            stroke={line.color}
                            strokeWidth={3}
                            strokeDasharray={line.dash || 0}
                            strokeLinecap="round"
                        />
                    ))}
                </svg>

                <div className="flex justify-between gap-16 md:gap-32 relative z-20">
                    {/* Left Column */}
                    <div className="flex flex-col gap-6 flex-1">
                        {exercise.pairs.map(pair => {
                            const isConnected = !!connections[pair.left];
                            const isSelected = selectedLeft === pair.left;
                            let statusClass = "bg-white border-2 border-gray-200 text-gray-700 hover:border-teal-400";

                            if (showResults) {
                                // Just style for disabled state mostly, colors come from lines
                                statusClass = "bg-gray-50 border-gray-200 text-gray-400";
                            } else {
                                if (isSelected) statusClass = "bg-teal-500 border-teal-600 text-white ring-4 ring-teal-200";
                                else if (isConnected) statusClass = "bg-teal-50 border-teal-400 text-teal-700";
                            }

                            return (
                                <button
                                    key={pair.left}
                                    id={`match-left-${pair.left}`}
                                    onClick={() => handleLeftClick(pair.left)}
                                    disabled={showResults}
                                    className={`h-16 flex items-center justify-center rounded-xl font-bold text-lg transition-all shadow-sm ${statusClass}`}
                                >
                                    {pair.left}
                                </button>
                            );
                        })}
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-6 flex-1">
                        {rightItems.map(pair => {
                            const connectedLeft = Object.keys(connections).find(key => connections[key] === pair.right);
                            let statusClass = "bg-white border-2 border-gray-200 text-gray-700 hover:border-teal-400";

                            if (showResults) {
                                statusClass = "bg-gray-50 border-gray-200 text-gray-400";
                            } else {
                                if (connectedLeft) statusClass = "bg-teal-50 border-teal-400 text-teal-700";
                                else if (selectedLeft) statusClass = "bg-white border-teal-200 border-dashed text-gray-400 hover:bg-teal-50 hover:border-solid hover:text-teal-600";
                            }

                            return (
                                <button
                                    key={pair.right}
                                    id={`match-right-${pair.right}`}
                                    onClick={() => handleRightClick(pair.right)}
                                    disabled={showResults}
                                    className={`h-16 flex items-center justify-center rounded-xl font-bold text-lg transition-all shadow-sm ${statusClass}`}
                                >
                                    {pair.right}
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
                        {ex.type === 'demonstrative-analysis' && renderDemonstrativeAnalysis(ex as DemonstrativeAnalysisExercise)}
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
