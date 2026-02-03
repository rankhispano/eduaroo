'use client';

import { useState, useEffect } from 'react';
import { useGamificationStore } from '@/lib/gamification/store';
import ExerciseFeedback from '@/components/ExerciseFeedback';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion'; // Kept import though not apparently used in original snippet, maybe used in return
import { useTranslations } from 'next-intl';

type QuestionType = 'prime_composite' | 'divisibility' | 'decimal_mult';

interface ArithmeticProblem {
    type: QuestionType;
    question: string;
    data: any;
    options: any[];
    correctAnswer: any;
}

export default function ArithmeticExercises() {
    const t = useTranslations('MathGrade5');
    const { addXP } = useGamificationStore();
    const [problem, setProblem] = useState<ArithmeticProblem | null>(null);
    const [seed, setSeed] = useState(0);
    const [feedback, setFeedback] = useState<{ show: boolean; isCorrect: boolean; solution?: string }>({ show: false, isCorrect: false });

    const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
    const COMPOSITES = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24, 25, 26, 27, 28, 30];

    const generateProblem = () => {
        const type: QuestionType = Math.random() < 0.33 ? 'prime_composite' : (Math.random() < 0.5 ? 'divisibility' : 'decimal_mult');

        if (type === 'prime_composite') {
            // Identify if X is Prime or Composite
            const isPrime = Math.random() > 0.5;
            const num = isPrime
                ? PRIMES[Math.floor(Math.random() * PRIMES.length)]
                : COMPOSITES[Math.floor(Math.random() * COMPOSITES.length)];

            setProblem({
                type: 'prime_composite',
                question: t('arithmetic_prime_q', { num }),
                data: { num },
                options: [t('prime'), t('composite')],
                correctAnswer: isPrime ? t('prime') : t('composite')
            });
        } else if (type === 'divisibility') {
            // Which number is divisible by 2, 3, or 5?
            const divisor = [2, 3, 5][Math.floor(Math.random() * 3)];

            // Generate a correct answer
            let correct = divisor * (Math.floor(Math.random() * 20) + 2);

            // Generate distractions not divisible by divisor
            const options = new Set<number>();
            options.add(correct);
            while (options.size < 4) {
                const fake = Math.floor(Math.random() * 100) + 10;
                if (fake % divisor !== 0 && fake !== correct) options.add(fake);
            }

            setProblem({
                type: 'divisibility',
                question: t('arithmetic_div_q', { divisor }),
                data: { divisor },
                options: Array.from(options).sort((a, b) => a - b),
                correctAnswer: correct
            });
        } else {
            // Decimal Multiplication: 2.5 x 4 or similar simple ones
            const a = (Math.floor(Math.random() * 20) + 1) / 10; // 0.1 to 2.0
            const b = Math.floor(Math.random() * 5) + 2; // integer 2 to 6
            const correct = parseFloat((a * b).toFixed(2));

            const options = new Set<number>();
            options.add(correct);
            while (options.size < 4) {
                const fake = parseFloat((correct + (Math.random() > 0.5 ? 0.1 : -0.1) * Math.floor(Math.random() * 5 + 1)).toFixed(2));
                if (fake > 0 && fake !== correct) options.add(fake);
            }

            setProblem({
                type: 'decimal_mult',
                question: t('arithmetic_calc_q', { a, b }),
                data: { a, b },
                options: Array.from(options).sort((a, b) => a - b),
                correctAnswer: correct
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
            addXP(25);
            new Audio('/sounds/correct.mp3').play().catch(() => { });
        } else {
            new Audio('/sounds/incorrect.mp3').play().catch(() => { });
        }

        let explanation = "";
        if (problem.type === 'prime_composite') {
            const num = problem.data.num;
            if (problem.correctAnswer === t('prime')) explanation = t('arithmetic_prime_yes', { num });
            else explanation = t('arithmetic_prime_no', { num, div: findDivisor(num) });
        } else if (problem.type === 'divisibility') {
            explanation = t('arithmetic_div_expl', { divisor: problem.data.divisor });
        } else {
            explanation = `${problem.data.a} x ${problem.data.b} = ${problem.correctAnswer}`;
        }

        setFeedback({
            show: true,
            isCorrect,
            solution: isCorrect ? undefined : explanation
        });
    };

    const findDivisor = (n: number) => {
        for (let i = 2; i < n; i++) if (n % i === 0) return i;
        return n;
    };

    if (!problem) return null;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                <div className="p-6 bg-purple-100 dark:bg-purple-900/30 flex justify-between items-center">
                    <h2 className="text-2xl font-black text-purple-600 dark:text-purple-400 flex items-center gap-2">
                        <span>🔢</span>
                        {t('arithmetic_title')}
                    </h2>
                    <Button variant="ghost" size="icon" onClick={() => setSeed(s => s + 1)}>
                        <RefreshCcw className="w-5 h-5" />
                    </Button>
                </div>

                <div className="p-8 flex flex-col items-center gap-10">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center">{problem.question}</h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full justify-center">
                        {problem.options.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => handleAnswer(opt)}
                                className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl text-xl font-bold shadow hover:bg-purple-100 transition-colors border-2 border-transparent hover:border-purple-400"
                            >
                                {opt}
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
