'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import MatchingExercise from '@/components/MatchingExercise';
import { Button } from '@/components/ui/button';

export default function MatchActivity({
    pairs,
    disabled,
    onAnswer,
}: {
    pairs: { left: string; right: string }[];
    disabled: boolean;
    onAnswer: (isCorrect: boolean) => void;
}) {
    const t = useTranslations('Activities');
    // Memorizado: MatchingExercise vuelve a barajar cuando cambia la referencia de "pairs"
    const matchingPairs = useMemo(() => pairs.map((p, id) => ({ id, left: p.left, right: p.right })), [pairs]);
    const [connections, setConnections] = useState<Record<number, number>>({});
    const [checked, setChecked] = useState(false);

    const complete = Object.keys(connections).length === pairs.length;

    const check = () => {
        setChecked(true);
        onAnswer(Object.entries(connections).every(([left, right]) => Number(left) === right));
    };

    return (
        <div className="flex w-full flex-col gap-4">
            <p className="text-center text-sm font-bold text-slate-500">{t('matchHelp')}</p>
            <MatchingExercise
                pairs={matchingPairs}
                onUpdate={setConnections}
                showResults={checked}
                leftType="text"
                rightType="text"
            />
            {!checked ? (
                <Button size="lg" onClick={check} disabled={disabled || !complete} className="self-center">
                    {t('check')}
                </Button>
            ) : null}
        </div>
    );
}
