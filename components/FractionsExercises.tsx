'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect, useCallback, useRef } from 'react';
import FractionVisual from '@/components/FractionVisual';
import MatchingExercise from '@/components/MatchingExercise';
import { CheckCircle, XCircle, Calculator, RefreshCw } from 'lucide-react';

type ExerciseType = 'fill-blank' | 'multiple-choice' | 'matching' | 'text-choice' | 'text-matching';

interface BaseExercise {
    id: number;
    type: ExerciseType;
    numerator: number;
    denominator: number;
}

interface FillBlankExercise extends BaseExercise {
    type: 'fill-blank';
    visualType: 'circle';
}

interface MultipleChoiceExercise extends BaseExercise {
    type: 'multiple-choice';
    visualType: 'bar';
    options: { num: number; den: number }[];
}

interface MatchingExerciseGroup {
    id: number;
    type: 'matching';
    pairs: { id: number; numerator: number; denominator: number }[];
}

interface TextChoiceExercise extends BaseExercise {
    type: 'text-choice';
    visualType: 'bar';
    options: string[]; // Text options like "Dos tercios", "Un medio"
    correctKey: string; // The key like "2_3"
}

interface TextMatchingGroup {
    id: number;
    type: 'text-matching';
    pairs: { id: number; numerator: number; denominator: number; textKey: string }[];
}

type Exercise = FillBlankExercise | MultipleChoiceExercise | MatchingExerciseGroup | TextChoiceExercise | TextMatchingGroup;

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Available fraction keys for text exercises
const AVAILABLE_FRACTION_KEYS = [
    '1_2', '1_3', '2_3', '1_4', '2_4', '3_4',
    '1_5', '2_5', '3_5', '4_5',
    '1_6', '2_6', '3_6', '4_6', '5_6',
    '1_8', '3_8', '5_8', '7_8',
    '1_9', '4_9', '7_9',
    '1_10', '3_10', '6_10', '9_10'
];

const parseFractionKey = (key: string) => {
    const [num, den] = key.split('_').map(Number);
    return { num, den };
};

const generateFraction = () => {
    const den = randomInt(2, 10);
    const num = randomInt(1, den - 1);
    return { num, den };
};

const generateOptions = (correctNum: number, correctDen: number) => {
    const opts = [{ num: correctNum, den: correctDen }];
    while (opts.length < 3) {
        const { num, den } = generateFraction();
        if (!opts.some(o => o.num === num && o.den === den)) {
            opts.push({ num, den });
        }
    }
    return opts.sort(() => Math.random() - 0.5);
};

// Generate text options (3 options, one correct)
const generateTextOptions = (correctKey: string): string[] => {
    const options = [correctKey];
    const available = AVAILABLE_FRACTION_KEYS.filter(k => k !== correctKey);
    while (options.length < 3 && available.length > 0) {
        const idx = randomInt(0, available.length - 1);
        options.push(available.splice(idx, 1)[0]);
    }
    return options.sort(() => Math.random() - 0.5);
};

// Component for Text Matching (fraction numbers to text)
function TextMatchingExercise({
    pairs,
    onUpdate,
    showResults,
    t
}: {
    pairs: { id: number; numerator: number; denominator: number; textKey: string }[];
    onUpdate: (connections: Record<number, number>) => void;
    showResults: boolean;
    t: any;
}) {
    const [leftItems, setLeftItems] = useState<typeof pairs>([]);
    const [rightItems, setRightItems] = useState<typeof pairs>([]);
    const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
    const [connections, setConnections] = useState<Record<number, number>>({});
    const containerRef = useRef<HTMLDivElement>(null);
    const [svgLines, setSvgLines] = useState<{ x1: number; y1: number; x2: number; y2: number; color: string; width?: number; dash?: number }[]>([]);

    useEffect(() => {
        setLeftItems([...pairs].sort(() => Math.random() - 0.5));
        setRightItems([...pairs].sort(() => Math.random() - 0.5));
        setConnections({});
        setSelectedLeft(null);
    }, [pairs]);

    useEffect(() => {
        if (!containerRef.current) return;
        const newLines: { x1: number, y1: number, x2: number, y2: number, color: string, width: number, dash: number }[] = [];

        // 1. User Connections
        Object.entries(connections).forEach(([leftId, rightId]) => {
            const lEl = document.getElementById(`text-frac-${leftId}`);
            const rEl = document.getElementById(`text-name-${rightId}`);
            if (!lEl || !rEl || !containerRef.current) return;
            const containerRect = containerRef.current.getBoundingClientRect();
            const lRect = lEl.getBoundingClientRect();
            const rRect = rEl.getBoundingClientRect();
            let color = "#3b82f6";
            if (showResults) {
                color = parseInt(leftId) === rightId ? "#22c55e" : "#ef4444";
            }
            newLines.push({
                x1: lRect.right - containerRect.left,
                y1: lRect.top + lRect.height / 2 - containerRect.top,
                x2: rRect.left - containerRect.left,
                y2: rRect.top + rRect.height / 2 - containerRect.top,
                color,
                width: 3,
                dash: 0
            });
        });

        // 2. Correct Solution Connections (if needed)
        if (showResults) {
            pairs.forEach(pair => {
                const leftId = pair.id;
                const rightId = pair.id;

                const userConnectedTo = connections[leftId];
                if (userConnectedTo === rightId) return; // Already correct

                const lEl = document.getElementById(`text-frac-${leftId}`);
                const rEl = document.getElementById(`text-name-${rightId}`);
                if (!lEl || !rEl || !containerRef.current) return;
                const containerRect = containerRef.current.getBoundingClientRect();
                const lRect = lEl.getBoundingClientRect();
                const rRect = rEl.getBoundingClientRect();

                newLines.unshift({
                    x1: lRect.right - containerRect.left,
                    y1: lRect.top + lRect.height / 2 - containerRect.top,
                    x2: rRect.left - containerRect.left,
                    y2: rRect.top + rRect.height / 2 - containerRect.top,
                    color: "#22c55e",
                    width: 2,
                    dash: 5
                });
            });
        }

        // Use functional state update to avoid dependency issues if any, though explicit set is fine here
        setSvgLines(newLines);
    }, [connections, leftItems, rightItems, showResults]);

    const handleLeftClick = (id: number) => {
        if (showResults) return;
        setSelectedLeft(id);
        const next = { ...connections };
        delete next[id];
        setConnections(next);
        onUpdate(next);
    };

    const handleRightClick = (id: number) => {
        if (showResults) return;
        if (selectedLeft !== null) {
            const next = { ...connections, [selectedLeft]: id };
            setConnections(next);
            onUpdate(next);
            setSelectedLeft(null);
        }
    };

    return (
        <div className="relative flex justify-between gap-24 p-4" ref={containerRef}>
            <svg className="absolute inset-0 pointer-events-none w-full h-full" style={{ zIndex: 10 }}>
                {svgLines.map((line, i) => (
                    <line key={i} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke={line.color} strokeWidth={line.width || 3} strokeDasharray={line.dash || 0} strokeLinecap="round" />
                ))}
            </svg>

            {/* Left: Numeric Fractions */}
            <div className="flex flex-col gap-6 w-2/5">
                {leftItems.map((item) => {
                    const isSelected = selectedLeft === item.id;
                    const isConnected = connections[item.id] !== undefined;
                    return (
                        <div
                            key={item.id}
                            id={`text-frac-${item.id}`}
                            onClick={() => handleLeftClick(item.id)}
                            className={`flex items-center justify-center h-20 rounded-xl border-2 bg-white dark:bg-gray-800 cursor-pointer transition-all z-20
                                ${isSelected ? 'border-brand-blue ring-2 ring-brand-blue/20' : 'border-gray-200 dark:border-gray-700 hover:border-brand-blue/50'}
                                ${isConnected && !isSelected ? 'border-brand-blue/50' : ''}
                            `}
                        >
                            <div className="flex flex-col items-center text-2xl font-bold font-mono text-gray-800 dark:text-gray-200">
                                <span>{item.numerator}</span>
                                <span className="w-8 h-0.5 bg-current my-1"></span>
                                <span>{item.denominator}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Right: Text Names */}
            <div className="flex flex-col gap-6 w-2/5">
                {rightItems.map((item) => {
                    const isConnected = Object.values(connections).includes(item.id);
                    return (
                        <div
                            key={item.id}
                            id={`text-name-${item.id}`}
                            onClick={() => handleRightClick(item.id)}
                            className={`flex items-center justify-center h-20 rounded-xl border-2 bg-white dark:bg-gray-800 cursor-pointer transition-all z-20
                                ${isConnected ? 'border-brand-blue/50' : 'border-gray-200 dark:border-gray-700 hover:border-brand-blue/50'}
                            `}
                        >
                            <span className="text-base font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                                {t(`fractionNames.${item.textKey}`)}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function FractionsExercises() {
    const t = useTranslations('FractionsGrade4');

    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [answers, setAnswers] = useState<Record<number, any>>({});
    const [showResults, setShowResults] = useState(false);
    const [matchingAnswers, setMatchingAnswers] = useState<Record<number, Record<number, number>>>({});
    const [textMatchingAnswers, setTextMatchingAnswers] = useState<Record<number, Record<number, number>>>({});

    const generateExercises = useCallback(() => {
        const newExercises: Exercise[] = [];
        let idCounter = 1;

        // 1. Fill in blank (4 exercises)
        for (let i = 0; i < 4; i++) {
            const { num, den } = generateFraction();
            newExercises.push({
                id: idCounter++,
                type: 'fill-blank',
                numerator: num,
                denominator: den,
                visualType: 'circle'
            });
        }

        // 2. Multiple Choice with numbers (3 exercises)
        for (let i = 0; i < 3; i++) {
            const { num, den } = generateFraction();
            newExercises.push({
                id: idCounter++,
                type: 'multiple-choice',
                numerator: num,
                denominator: den,
                visualType: 'bar',
                options: generateOptions(num, den)
            });
        }

        // 3. Matching visual to number (1 group with 4 pairs)
        const matchingPairs = [];
        const baseMatchingId = 100;
        for (let i = 0; i < 4; i++) {
            const { num, den } = generateFraction();
            matchingPairs.push({ id: baseMatchingId + i, numerator: num, denominator: den });
        }
        newExercises.push({
            id: idCounter++,
            type: 'matching',
            pairs: matchingPairs
        });

        // 4. Text Choice - See visual, choose text name (3 exercises)
        const usedTextKeys = new Set<string>();
        for (let i = 0; i < 3; i++) {
            let key = AVAILABLE_FRACTION_KEYS[randomInt(0, AVAILABLE_FRACTION_KEYS.length - 1)];
            while (usedTextKeys.has(key)) {
                key = AVAILABLE_FRACTION_KEYS[randomInt(0, AVAILABLE_FRACTION_KEYS.length - 1)];
            }
            usedTextKeys.add(key);
            const { num, den } = parseFractionKey(key);
            newExercises.push({
                id: idCounter++,
                type: 'text-choice',
                numerator: num,
                denominator: den,
                visualType: 'bar',
                options: generateTextOptions(key),
                correctKey: key
            });
        }

        // 5. Text Matching - Match fraction number to text (1 group with 4 pairs)
        const textMatchPairs = [];
        const baseTextMatchId = 200;
        const usedTextMatchKeys = new Set<string>();
        for (let i = 0; i < 4; i++) {
            let key = AVAILABLE_FRACTION_KEYS[randomInt(0, AVAILABLE_FRACTION_KEYS.length - 1)];
            while (usedTextMatchKeys.has(key)) {
                key = AVAILABLE_FRACTION_KEYS[randomInt(0, AVAILABLE_FRACTION_KEYS.length - 1)];
            }
            usedTextMatchKeys.add(key);
            const { num, den } = parseFractionKey(key);
            textMatchPairs.push({ id: baseTextMatchId + i, numerator: num, denominator: den, textKey: key });
        }
        newExercises.push({
            id: idCounter++,
            type: 'text-matching',
            pairs: textMatchPairs
        });

        setExercises(newExercises);
        setAnswers({});
        setMatchingAnswers({});
        setTextMatchingAnswers({});
        setShowResults(false);
    }, []);

    useEffect(() => {
        generateExercises();
    }, [generateExercises]);

    const handleInputChange = (id: number, field: 'num' | 'den', value: string) => {
        setAnswers(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
        setShowResults(false);
    };

    const handleOptionSelect = (id: number, option: { num: number; den: number } | string) => {
        setAnswers(prev => ({ ...prev, [id]: typeof option === 'string' ? option : JSON.stringify(option) }));
        setShowResults(false);
    };

    const handleMatchingUpdate = (exerciseId: number, connections: Record<number, number>) => {
        setMatchingAnswers(prev => ({ ...prev, [exerciseId]: connections }));
        setShowResults(false);
    };

    const handleTextMatchingUpdate = (exerciseId: number, connections: Record<number, number>) => {
        setTextMatchingAnswers(prev => ({ ...prev, [exerciseId]: connections }));
        setShowResults(false);
    };

    const checkAnswers = () => setShowResults(true);

    const isCorrect = (ex: Exercise) => {
        if (ex.type === 'matching') {
            const conn = matchingAnswers[ex.id] || {};
            if (Object.keys(conn).length !== ex.pairs.length) return false;
            return Object.entries(conn).every(([visId, fracId]) => parseInt(visId) === fracId);
        }
        if (ex.type === 'text-matching') {
            const conn = textMatchingAnswers[ex.id] || {};
            if (Object.keys(conn).length !== ex.pairs.length) return false;
            return Object.entries(conn).every(([leftId, rightId]) => parseInt(leftId) === rightId);
        }
        const ans = answers[ex.id];
        if (!ans) return false;
        if (ex.type === 'fill-blank') {
            return parseInt(ans.num) === ex.numerator && parseInt(ans.den) === ex.denominator;
        } else if (ex.type === 'multiple-choice') {
            const selected = JSON.parse(ans);
            return selected.num === ex.numerator && selected.den === ex.denominator;
        } else if (ex.type === 'text-choice') {
            return ans === ex.correctKey;
        }
        return false;
    };

    const getScore = () => {
        let score = 0;
        let total = 0;
        exercises.forEach(ex => {
            if (ex.type === 'matching') {
                total += ex.pairs.length;
                const conn = matchingAnswers[ex.id] || {};
                ex.pairs.forEach(p => { if (conn[p.id] === p.id) score++; });
            } else if (ex.type === 'text-matching') {
                total += ex.pairs.length;
                const conn = textMatchingAnswers[ex.id] || {};
                ex.pairs.forEach(p => { if (conn[p.id] === p.id) score++; });
            } else {
                total++;
                if (isCorrect(ex)) score++;
            }
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
                    <button onClick={generateExercises} className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-3 bg-brand-blue text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md font-bold">
                        <RefreshCw className="w-4 h-4" />
                        {t('generateNew')}
                    </button>
                </div>

                {/* Section 1: Fill in blank */}
                <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8 mb-8 border border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-brand-blue mb-6 border-b pb-2 border-brand-blue/10">{t('fillInTheBlank')}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12">
                        {exercises.filter(e => e.type === 'fill-blank').map((ex) => {
                            const correct = showResults && isCorrect(ex);
                            const wrong = showResults && !isCorrect(ex);
                            const fEx = ex as FillBlankExercise;
                            return (
                                <div key={ex.id} className="flex items-center gap-6 justify-center p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <FractionVisual numerator={fEx.numerator} denominator={fEx.denominator} type="circle" color="#f97316" />
                                    <div className="flex items-center gap-2 text-2xl font-bold text-gray-700 dark:text-gray-300">
                                        <span>=</span>
                                        <div className="flex flex-col items-center gap-2">
                                            <input type="number" className={`no-spinner w-14 h-12 text-center border-2 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:border-brand-blue transition-colors ${correct ? 'border-green-500 bg-green-50 text-green-700' : ''} ${wrong ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 dark:border-gray-700'}`} value={answers[ex.id]?.num || ''} onChange={(e) => handleInputChange(ex.id, 'num', e.target.value)} aria-label="Numerator" />
                                            <div className="w-14 h-0.5 bg-gray-800 dark:bg-gray-200 rounded-full"></div>
                                            <input type="number" className={`no-spinner w-14 h-12 text-center border-2 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:border-brand-blue transition-colors ${correct ? 'border-green-500 bg-green-50 text-green-700' : ''} ${wrong ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 dark:border-gray-700'}`} value={answers[ex.id]?.den || ''} onChange={(e) => handleInputChange(ex.id, 'den', e.target.value)} aria-label="Denominator" />
                                        </div>
                                        {correct && <CheckCircle className="w-6 h-6 text-green-500 ml-2" />}
                                        {wrong && (
                                            <div className="flex items-center gap-2 ml-2">
                                                <XCircle className="w-6 h-6 text-red-500" />
                                                <div className="flex flex-col items-center opacity-70">
                                                    <span className="text-sm font-bold text-green-600">{fEx.numerator}</span>
                                                    <div className="w-4 h-0.5 bg-green-600 rounded-full"></div>
                                                    <span className="text-sm font-bold text-green-600">{fEx.denominator}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Section 2: Multiple Choice with numbers */}
                <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8 mb-8 border border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-brand-green mb-6 border-b pb-2 border-brand-green/10">{t('multipleChoice')}</h2>
                    <div className="space-y-8">
                        {exercises.filter(e => e.type === 'multiple-choice').map((ex) => {
                            const correct = showResults && isCorrect(ex);
                            const wrong = showResults && !isCorrect(ex);
                            const mEx = ex as MultipleChoiceExercise;
                            return (
                                <div key={ex.id} className="flex flex-col md:flex-row items-center gap-8 border-b border-dashed border-gray-200 dark:border-gray-700 pb-8 last:border-0 last:pb-0">
                                    <div className="flex-shrink-0"><FractionVisual numerator={mEx.numerator} denominator={mEx.denominator} type="bar" size={200} color="#0ea5e9" /></div>
                                    <div className="flex gap-4">
                                        {mEx.options.map((opt, idx) => {
                                            const isSelected = answers[ex.id] === JSON.stringify(opt);
                                            const isOptionCorrect = opt.num === mEx.numerator && opt.den === mEx.denominator;
                                            let btnClass = "border-2 border-gray-200 dark:border-gray-700 hover:border-brand-green hover:bg-green-50";
                                            if (showResults) {
                                                if (isOptionCorrect) btnClass = "bg-green-100 border-green-500 text-green-800 shadow-[0_0_10px_rgba(34,197,94,0.3)]";
                                                else if (isSelected) btnClass = "bg-red-100 border-red-500 text-red-800 opacity-50";
                                                else btnClass = "opacity-40 border-gray-200";
                                            } else if (isSelected) btnClass = "border-brand-blue bg-brand-blue/10 text-brand-blue font-bold ring-2 ring-brand-blue/20";
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

                {/* Section 3: Matching Visual to Number */}
                {exercises.filter(e => e.type === 'matching').map((ex) => {
                    const matEx = ex as MatchingExerciseGroup;
                    return (
                        <section key={ex.id} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8 mb-8 border border-gray-100 dark:border-gray-800">
                            <h2 className="text-xl font-bold text-brand-orange mb-6 border-b pb-2 border-brand-orange/10">{t('matching')}</h2>
                            <MatchingExercise pairs={matEx.pairs} onUpdate={(connections) => handleMatchingUpdate(ex.id, connections)} showResults={showResults} />
                        </section>
                    );
                })}

                {/* Section 4: Text Choice - Visual to Text Name */}
                <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8 mb-8 border border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-purple-600 mb-6 border-b pb-2 border-purple-600/10">{t('textChoice')}</h2>
                    <div className="space-y-8">
                        {exercises.filter(e => e.type === 'text-choice').map((ex) => {
                            const correct = showResults && isCorrect(ex);
                            const wrong = showResults && !isCorrect(ex);
                            const tEx = ex as TextChoiceExercise;
                            return (
                                <div key={ex.id} className="flex flex-col md:flex-row items-center gap-8 border-b border-dashed border-gray-200 dark:border-gray-700 pb-8 last:border-0 last:pb-0">
                                    <div className="flex-shrink-0"><FractionVisual numerator={tEx.numerator} denominator={tEx.denominator} type="bar" size={180} color="#8b5cf6" /></div>
                                    <div className="flex flex-col gap-2 flex-1">
                                        {tEx.options.map((optKey, idx) => {
                                            const isSelected = answers[ex.id] === optKey;
                                            const isOptionCorrect = optKey === tEx.correctKey;
                                            let btnClass = "border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 hover:bg-purple-50";
                                            if (showResults) {
                                                if (isOptionCorrect) btnClass = "bg-green-100 border-green-500 text-green-800";
                                                else if (isSelected) btnClass = "bg-red-100 border-red-500 text-red-800 opacity-50";
                                                else btnClass = "opacity-40 border-gray-200";
                                            } else if (isSelected) btnClass = "border-purple-500 bg-purple-50 text-purple-700 font-bold ring-2 ring-purple-200";
                                            return (
                                                <button key={idx} onClick={() => handleOptionSelect(ex.id, optKey)} disabled={showResults} className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${btnClass}`}>
                                                    <span className="text-base">{String.fromCharCode(97 + idx)}) {t(`fractionNames.${optKey}`)}</span>
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

                {/* Section 5: Text Matching - Number to Text */}
                {exercises.filter(e => e.type === 'text-matching').map((ex) => {
                    const tmEx = ex as TextMatchingGroup;
                    return (
                        <section key={ex.id} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8 mb-8 border border-gray-100 dark:border-gray-800">
                            <h2 className="text-xl font-bold text-teal-600 mb-6 border-b pb-2 border-teal-600/10">{t('textMatching')}</h2>
                            <TextMatchingExercise pairs={tmEx.pairs} onUpdate={(connections) => handleTextMatchingUpdate(ex.id, connections)} showResults={showResults} t={t} />
                        </section>
                    );
                })}

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
        </div>
    );
}
