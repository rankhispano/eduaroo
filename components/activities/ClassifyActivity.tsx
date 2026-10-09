'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

const CATEGORY_COLORS = [
    'border-sky-300 bg-sky-50 dark:border-sky-700 dark:bg-sky-900/20',
    'border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/20',
    'border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-900/20',
];

// Clasificar por toques (funciona en tablet y móvil): toca una tarjeta y después su grupo
export default function ClassifyActivity({
    categories,
    items,
    disabled,
    onAnswer,
}: {
    categories: string[];
    items: { text: string; category: number }[];
    disabled: boolean;
    onAnswer: (isCorrect: boolean) => void;
}) {
    const t = useTranslations('Activities');
    // El componente se monta de nuevo en cada actividad, así que basta con barajar al iniciar
    const [shuffled] = useState(() => items.map((item, id) => ({ ...item, id })).sort(() => Math.random() - 0.5));
    const [placed, setPlaced] = useState<Record<number, number>>({});
    const [selected, setSelected] = useState<number | null>(null);
    const [checked, setChecked] = useState(false);

    const locked = disabled || checked;
    const pending = shuffled.filter((item) => placed[item.id] === undefined);

    const place = (category: number) => {
        if (locked || selected === null) return;
        setPlaced((prev) => ({ ...prev, [selected]: category }));
        setSelected(null);
    };

    const unplace = (id: number) => {
        if (locked) return;
        setPlaced((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
    };

    const check = () => {
        setChecked(true);
        onAnswer(shuffled.every((item) => placed[item.id] === item.category));
    };

    const renderCard = (item: (typeof shuffled)[number], inCategory = false) => {
        let state = 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700';
        if (checked) {
            state = placed[item.id] === item.category
                ? 'bg-green-100 border-green-500 dark:bg-green-900/30'
                : 'bg-red-100 border-red-400 dark:bg-red-900/30';
        } else if (selected === item.id) {
            state = 'bg-indigo-100 border-indigo-500 ring-4 ring-indigo-200 dark:bg-indigo-900/40 dark:ring-indigo-800';
        }
        return (
            <motion.button
                key={item.id}
                layout
                type="button"
                disabled={locked}
                onClick={(e) => {
                    e.stopPropagation();
                    if (inCategory) unplace(item.id);
                    else setSelected(selected === item.id ? null : item.id);
                }}
                className={`rounded-xl border-2 px-4 py-3 text-lg font-bold text-gray-800 shadow-sm transition-colors dark:text-gray-100 ${state}`}
            >
                {item.text}
                {checked && placed[item.id] !== item.category ? (
                    <span className="block text-xs font-bold text-red-700 dark:text-red-300">→ {categories[item.category]}</span>
                ) : null}
            </motion.button>
        );
    };

    return (
        <div className="flex w-full flex-col gap-6">
            <p className="text-center text-sm font-bold text-slate-500">{t('classifyHelp')}</p>

            {pending.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-300 p-4 dark:border-gray-700">
                    {pending.map((item) => renderCard(item))}
                </div>
            ) : null}

            <div className={`grid gap-4 ${categories.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
                {categories.map((category, index) => (
                    <div
                        key={category}
                        role="button"
                        tabIndex={locked ? -1 : 0}
                        onClick={() => place(index)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') place(index);
                        }}
                        aria-label={`${t('placeIn')} ${category}`}
                        className={`flex min-h-36 flex-col gap-3 rounded-2xl border-2 p-4 transition ${CATEGORY_COLORS[index]} ${selected !== null && !locked ? 'cursor-pointer ring-4 ring-indigo-100 dark:ring-indigo-900' : ''}`}
                    >
                        <h4 className="text-center text-lg font-black text-gray-800 dark:text-gray-100">{category}</h4>
                        <div className="flex flex-wrap justify-center gap-2">
                            {shuffled
                                .filter((item) => placed[item.id] === index)
                                .map((item) => renderCard(item, true))}
                        </div>
                    </div>
                ))}
            </div>

            {!checked ? (
                <Button size="lg" onClick={check} disabled={disabled || pending.length > 0} className="self-center">
                    {t('check')}
                </Button>
            ) : null}
        </div>
    );
}
