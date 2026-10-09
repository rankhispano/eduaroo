'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

function shuffleUntilDifferent(items: string[]) {
    let shuffled = [...items];
    for (let i = 0; i < 10 && shuffled.every((item, idx) => item === items[idx]); i++) {
        shuffled = [...items].sort(() => Math.random() - 0.5);
    }
    return shuffled;
}

export default function OrderActivity({
    items,
    disabled,
    onAnswer,
}: {
    items: string[];
    disabled: boolean;
    onAnswer: (isCorrect: boolean) => void;
}) {
    const t = useTranslations('Activities');
    const [order, setOrder] = useState(() => shuffleUntilDifferent(items));
    const [checked, setChecked] = useState(false);

    const move = (index: number, delta: number) => {
        const target = index + delta;
        if (target < 0 || target >= order.length) return;
        const next = [...order];
        [next[index], next[target]] = [next[target], next[index]];
        setOrder(next);
    };

    const check = () => {
        setChecked(true);
        onAnswer(order.every((item, idx) => item === items[idx]));
    };

    const locked = disabled || checked;

    return (
        <div className="flex w-full max-w-2xl flex-col gap-4">
            <p className="text-center text-sm font-bold text-slate-500">{t('orderHelp')}</p>
            <ol className="flex flex-col gap-3">
                {order.map((item, index) => {
                    const right = item === items[index];
                    const state = checked
                        ? right
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/30'
                            : 'border-red-400 bg-red-50 dark:bg-red-900/30'
                        : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800';
                    return (
                        <motion.li
                            layout
                            key={item}
                            className={`flex items-center gap-3 rounded-xl border-2 p-3 shadow-sm ${state}`}
                        >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-lg font-black text-white">
                                {index + 1}
                            </span>
                            <span className="flex-1 text-lg font-bold text-gray-800 dark:text-gray-100">{item}</span>
                            <div className="flex gap-1">
                                <Button variant="ghost" size="icon" aria-label={t('moveUp')} disabled={locked || index === 0} onClick={() => move(index, -1)}>
                                    <ArrowUp className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon" aria-label={t('moveDown')} disabled={locked || index === order.length - 1} onClick={() => move(index, 1)}>
                                    <ArrowDown className="h-5 w-5" />
                                </Button>
                            </div>
                        </motion.li>
                    );
                })}
            </ol>
            {checked && !order.every((item, idx) => item === items[idx]) ? (
                <div className="rounded-xl bg-slate-50 p-4 dark:bg-gray-800">
                    <p className="mb-2 text-sm font-bold text-slate-500">{t('correctOrder')}</p>
                    <ol className="list-decimal space-y-1 pl-6 font-bold text-gray-800 dark:text-gray-100">
                        {items.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ol>
                </div>
            ) : null}
            {!checked ? (
                <Button size="lg" onClick={check} disabled={disabled} className="self-center">
                    {t('check')}
                </Button>
            ) : null}
        </div>
    );
}
