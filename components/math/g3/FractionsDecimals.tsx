'use client';

import { useState } from 'react';
import MatchingExercise from '@/components/MatchingExercise';
import ExerciseFeedback from '@/components/ExerciseFeedback';
import { useGamificationStore } from '@/lib/gamification/store';
import { RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export default function FractionsDecimalsExercises() {
    const t = useTranslations('MathGrade3');
    const { addXP } = useGamificationStore();
    const [seed, setSeed] = useState(0);
    const [feedback, setFeedback] = useState<{ show: boolean; isCorrect: boolean }>({ show: false, isCorrect: false });

    // Equivalent Fractions Logic
    // Left: Reduced Fraction (or Visual)
    // Right: Equivalent Fraction (or Decimal)

    // Let's do: Left side = Visual Fraction. Right side = Decimal or Equivalent.
    // For G3, user requested "Equivalent Fractions". So let's match 1/2 with 2/4.

    const PAIRS_POOL = [
        { id: 1, left: { num: 1, den: 2 }, right: { num: 2, den: 4 } },
        { id: 2, left: { num: 1, den: 3 }, right: { num: 2, den: 6 } },
        { id: 3, left: { num: 1, den: 4 }, right: { num: 2, den: 8 } },
        { id: 4, left: { num: 2, den: 3 }, right: { num: 4, den: 6 } },
        { id: 5, left: { num: 3, den: 4 }, right: { num: 6, den: 8 } },
    ];

    const currentPairs = [...PAIRS_POOL].sort(() => Math.random() - 0.5).slice(0, 3);

    const pairs = currentPairs.map((p, i) => ({
        id: p.id, // Keep original ID for logic? No, MatchingExpects 1..N usually for UI order but connection logic uses ID.
        // Actually, MatchingExercise usually maps left items to right items by ID if we pass `pairs` list.
        // Wait, if I use `pairs`, the component assumes item with id X on left matches item with id X on right.
        // So I can just re-map IDs to 1,2,3 for this session.

        numerator: p.left.num,
        denominator: p.left.den,

        // For right side, we ideally want another visual? "Equivalent Fractions" implies Visual = Visual usually.
        // Or Visual = Text (2/4).
        // Let's do Generic Text for right side to show the number "2/4".

        right: `${p.right.num}/${p.right.den}`
    }));

    const handleComplete = (connections: Record<number, number>) => {
        const isAllCorrect = Object.entries(connections).every(([leftId, rightId]) => {
            // In Matching component, if we provide `pairs` array, the left item at index I has ID=pairs[I].id
            // And it matches right item at index I (which also has ID=pairs[I].id conceptually in the logic check?)
            // Let's safely assume simple 1-1 ID match is required.
            return parseInt(leftId) === rightId;
        });

        if (isAllCorrect && Object.keys(connections).length === pairs.length) {
            addXP(25);
            new Audio('/sounds/correct.mp3').play().catch(() => { });
            setFeedback({ show: true, isCorrect: true });
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-8">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                <div className="p-6 bg-emerald-100 dark:bg-emerald-900/30 flex justify-between items-center">
                    <h2 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
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
