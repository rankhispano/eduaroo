'use client';

import { useState, useEffect } from 'react';
import { useGamificationStore } from '@/lib/gamification/store';
import ExerciseFeedback from '@/components/ExerciseFeedback';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';

type QuestionType = 'length' | 'capacity' | 'calendar';

interface MeasurementProblem {
    type: QuestionType;
    question: string;
    data: any;
    options: any[];
    correctAnswer: any;
}

export default function MeasurementExercises() {
    const t = useTranslations('MathGrade2');
    const { addXP } = useGamificationStore();
    const [problem, setProblem] = useState<MeasurementProblem | null>(null);
    const [seed, setSeed] = useState(0);
    const [feedback, setFeedback] = useState<{ show: boolean; isCorrect: boolean; solution?: string }>({ show: false, isCorrect: false });

    const DAY_KEYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    const generateProblem = () => {
        const type: QuestionType = Math.random() < 0.33 ? 'length' : (Math.random() < 0.5 ? 'capacity' : 'calendar');

        if (type === 'length') {
            // Compare lengths conceptually or standard units? "Which is longer?" or "How many cm?"
            // Let's do ruler reading
            const lengthCm = Math.floor(Math.random() * 8) + 2; // 2 to 10cm

            const options = new Set<number>();
            options.add(lengthCm);
            while (options.size < 4) {
                const fake = Math.floor(Math.random() * 10) + 1;
                if (fake !== lengthCm) options.add(fake);
            }

            setProblem({
                type: 'length',
                question: t('measurement_length_q'),
                data: { length: lengthCm },
                options: Array.from(options).sort((a, b) => a - b),
                correctAnswer: lengthCm
            });
        } else if (type === 'capacity') {
            // Identify container that holds MORE or LESS, or Liters
            // Let's do simple Liter addition conceptual
            const bottle1 = Math.floor(Math.random() * 3) + 1;
            const bottle2 = Math.floor(Math.random() * 3) + 1;
            const total = bottle1 + bottle2;

            const options = new Set<number>();
            options.add(total);
            while (options.size < 4) {
                options.add(total + Math.floor(Math.random() * 5) - 2 || total + 1);
            }

            setProblem({
                type: 'capacity',
                question: t('measurement_capacity_q'),
                data: { b1: bottle1, b2: bottle2 },
                options: Array.from(options).sort((a, b) => a - b),
                correctAnswer: total
            });
        } else {
            // Calendar - What day comes after X?
            const dayIdx = Math.floor(Math.random() * 6); // 0-5
            const dayKey = DAY_KEYS[dayIdx];
            const nextDayKey = DAY_KEYS[dayIdx + 1];

            const options = [nextDayKey];
            while (options.length < 4) {
                const randDay = DAY_KEYS[Math.floor(Math.random() * 7)];
                if (!options.includes(randDay)) options.push(randDay);
            }

            setProblem({
                type: 'calendar',
                question: t('measurement_calendar_q', { day: t(`days.${dayKey}`) }),
                data: { dayKey: dayKey },
                options: options.sort(() => Math.random() - 0.5),
                correctAnswer: nextDayKey
            });
        }
        setFeedback({ show: false, isCorrect: false });
    };

    useEffect(() => {
        generateProblem();
    }, [seed]);

    const handleAnswer = (ans: any) => {
        if (!problem) return;
        const isCorrect = ans === problem.correctAnswer;

        if (isCorrect) {
            addXP(15);
            new Audio('/sounds/correct.mp3').play().catch(() => { });
        } else {
            new Audio('/sounds/incorrect.mp3').play().catch(() => { });
        }

        let sol = "";
        if (problem.type === 'length') sol = `${problem.correctAnswer} cm`;
        else if (problem.type === 'capacity') sol = `${problem.correctAnswer} ${t('liters_label')}`;
        else sol = t(`days.${problem.correctAnswer}`);

        setFeedback({
            show: true,
            isCorrect,
            solution: isCorrect ? undefined : sol
        });
    };

    // Visuals
    const RulerVisual = ({ len }: { len: number }) => (
        <div className="relative h-32 w-full max-w-md flex flex-col items-start justify-center">
            {/* Pencil */}
            <div className="h-4 bg-yellow-400 border border-yellow-600 rounded-l-sm relative mb-2 shadow-sm" style={{ width: `${len * 10}%` }}>
                <div className="absolute right-0 top-0 bottom-0 w-4 bg-pink-300 border-l border-pink-400 rounded-lg translate-x-1/2"></div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-full w-0 border-l-[10px] border-t-[5px] border-b-[5px] border-l-black border-t-transparent border-b-transparent transform -scale-x-100 -translate-x-full"></div>
            </div>
            {/* Ruler */}
            <div className="w-full h-12 bg-yellow-100 border border-yellow-300 relative flex font-mono text-xs">
                {Array.from({ length: 11 }).map((_, i) => (
                    <div key={i} className="flex-1 border-l border-gray-400 h-full relative group">
                        <span className="absolute bottom-1 -left-1 font-bold">{i}</span>
                        <div className="w-full h-full flex justify-between px-[10%]">
                            {[1, 2, 3, 4].map(j => <div key={j} className={`w-px bg-gray-300 ${j === 5 ? 'h-3' : 'h-2'}`}></div>)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const CapacityVisual = ({ b1, b2 }: { b1: number, b2: number }) => (
        <div className="flex gap-8 items-end justify-center">
            <Bottle liters={b1} />
            <div className="text-4xl font-bold text-blue-500">+</div>
            <Bottle liters={b2} />
        </div>
    );

    const Bottle = ({ liters }: { liters: number }) => (
        <div className="flex flex-col items-center gap-2">
            <div className="relative w-24 h-32 bg-blue-50 border-4 border-blue-400 rounded-b-xl rounded-t-md overflow-hidden">
                {/* Water Level */}
                <div className="absolute bottom-0 w-full bg-blue-400 animate-pulse" style={{ height: `${liters * 33}%` }}></div>
                {/* Markers */}
                <div className="absolute right-0 top-0 h-full flex flex-col justify-evenly pr-1 py-2">
                    <div className="w-2 h-0.5 bg-blue-800"></div>
                    <div className="w-2 h-0.5 bg-blue-800"></div>
                </div>
            </div>
            <span className="font-bold text-blue-700">{liters} L</span>
        </div>
    );

    const CalendarVisual = ({ dayKey }: { dayKey: string }) => (
        <div className="w-40 h-40 bg-white border rounded-xl shadow-lg flex flex-col overflow-hidden text-center transform rotate-2">
            <div className="bg-red-500 text-white font-bold py-2 uppercase tracking-wide">{t('today_label')}</div>
            <div className="flex-1 flex items-center justify-center text-2xl font-bold text-gray-800 px-2">
                {t(`days.${dayKey}`)}
            </div>
        </div>
    );

    if (!problem) return null;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                <div className="p-6 bg-cyan-100 dark:bg-cyan-900/30 flex justify-between items-center">
                    <h2 className="text-2xl font-black text-cyan-600 dark:text-cyan-400 flex items-center gap-2">
                        <span>🌡️</span>
                        {t('measurement_title')}
                    </h2>
                    <Button variant="ghost" size="icon" onClick={() => setSeed(s => s + 1)}>
                        <RefreshCcw className="w-5 h-5" />
                    </Button>
                </div>

                <div className="p-8 flex flex-col items-center gap-10">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center">{problem.question}</h3>

                    <div className="flex justify-center items-center py-4 w-full">
                        {problem.type === 'length' && <RulerVisual len={problem.data.length} />}
                        {problem.type === 'capacity' && <CapacityVisual b1={problem.data.b1} b2={problem.data.b2} />}
                        {problem.type === 'calendar' && (
                            <div className="flex gap-4 items-center">
                                <CalendarVisual dayKey={problem.data.dayKey} />
                                <span className="text-4xl">➡️</span>
                                <div className="w-40 h-40 border-4 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50">
                                    <span className="text-4xl text-gray-300">?</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                        {problem.options.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => handleAnswer(opt)}
                                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-xl font-bold shadow hover:bg-cyan-100 transition-colors border-2 border-transparent hover:border-cyan-400"
                            >
                                {problem.type === 'length' ? `${opt} cm` : (problem.type === 'capacity' ? `${opt} L` : t(`days.${opt}`))}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <ExerciseFeedback
                show={feedback.show}
                isCorrect={feedback.isCorrect}
                solution={feedback.solution}
                onComplete={() => {
                    if (feedback.isCorrect) setSeed(s => s + 1);
                    else setFeedback(prev => ({ ...prev, show: false }));
                }}
            />
        </div>
    );
}
