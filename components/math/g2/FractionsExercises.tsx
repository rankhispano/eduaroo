'use client';

import { useState } from 'react';
import MatchingExercise from '@/components/MatchingExercise';
import ExerciseFeedback from '@/components/ExerciseFeedback';
import { useGamificationStore } from '@/lib/gamification/store';
import { RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export default function FractionsExercises() {
    const t = useTranslations('MathGrade2');
    const { addXP } = useGamificationStore();
    const [seed, setSeed] = useState(0);
    const [feedback, setFeedback] = useState<{ show: boolean; isCorrect: boolean }>({ show: false, isCorrect: false });

    // Simple fractions for Grade 2
    const FRACTIONS = [
        { num: 1, den: 2 },
        { num: 1, den: 3 },
        { num: 1, den: 4 },
        { num: 2, den: 3 },
        { num: 2, den: 4 },
        { num: 3, den: 4 }
    ];

    // Select 3 random fractions for a matching round
    const currentFractions = [...FRACTIONS].sort(() => Math.random() - 0.5).slice(0, 3);

    const pairs = currentFractions.map((f, i) => ({
        id: i + 1,
        numerator: f.num,     // Used by 'fraction' type on left
        denominator: f.den,   // Used by 'fraction' type on left
        right: `${f.num}/${f.den}` // Used by 'text' type on right
    }));

    const handleComplete = (connections: Record<number, number>) => {
        // Validation logic for matching
        const isAllCorrect = Object.entries(connections).every(([leftId, rightId]) => {
            return parseInt(leftId) === rightId; // Since we map id -> id
        });

        if (isAllCorrect && Object.keys(connections).length === pairs.length) {
            addXP(20);
            new Audio('/sounds/correct.mp3').play().catch(() => { });
            setFeedback({ show: true, isCorrect: true });
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-8">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                <div className="p-6 bg-orange-100 dark:bg-orange-900/30 flex justify-between items-center">
                    <h2 className="text-2xl font-black text-orange-600 dark:text-orange-400 flex items-center gap-2">
                        <span>🍰</span>
                        {t('fractions_title')}
                    </h2>
                    <Button variant="ghost" size="icon" onClick={() => setSeed(s => s + 1)}>
                        <RefreshCcw className="w-5 h-5" />
                    </Button>
                </div>

                <div className="p-8">
                    <p className="text-center text-gray-500 mb-8 font-medium">{t('fractions_match_inst')}</p>

                    <MatchingExercise
                        key={seed}
                        pairs={pairs}
                        leftType="fraction"
                        rightType="text"
                        onUpdate={(conns) => {
                            if (Object.keys(conns).length === pairs.length) handleComplete(conns);
                        }}
                        showResults={feedback.show}
                    />
                </div>
            </div>

            <ExerciseFeedback
                show={feedback.show}
                isCorrect={feedback.isCorrect}
                onComplete={() => {
                    setFeedback({ show: false, isCorrect: false });
                    setSeed(s => s + 1);
                }}
            />
        </div>
    );
}

// NOTE: I need to verify MatchingExercise logic to pass the correct props locally.
// I will create a wrapper component inside this file to adapt the data.
