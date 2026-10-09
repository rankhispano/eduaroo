'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Check, X } from 'lucide-react';

export default function TrueFalseActivity({
    answer,
    disabled,
    onAnswer,
}: {
    answer: boolean;
    disabled: boolean;
    onAnswer: (isCorrect: boolean) => void;
}) {
    const t = useTranslations('Activities');
    const [selected, setSelected] = useState<boolean | null>(null);

    const choose = (value: boolean) => {
        if (disabled || selected !== null) return;
        setSelected(value);
        onAnswer(value === answer);
    };

    const buttons = [
        { value: true, label: t('true'), Icon: Check, base: 'hover:bg-green-50 hover:border-green-400' },
        { value: false, label: t('false'), Icon: X, base: 'hover:bg-red-50 hover:border-red-400' },
    ];

    return (
        <div className="grid w-full max-w-xl grid-cols-2 gap-4">
            {buttons.map(({ value, label, Icon, base }) => {
                let state = `bg-gray-50 dark:bg-gray-800 border-transparent ${base} dark:hover:bg-gray-700`;
                if (selected !== null && value === answer) state = 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900/30 dark:text-green-300';
                else if (selected === value) state = 'bg-red-100 border-red-400 text-red-800 dark:bg-red-900/30 dark:text-red-300';
                else if (selected !== null) state = 'bg-gray-50 border-transparent opacity-60 dark:bg-gray-800';

                return (
                    <motion.button
                        key={label}
                        type="button"
                        onClick={() => choose(value)}
                        disabled={disabled || selected !== null}
                        whileTap={{ scale: 0.97 }}
                        className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-6 text-2xl font-black shadow transition-colors ${state}`}
                    >
                        <Icon className="h-10 w-10" />
                        {label}
                    </motion.button>
                );
            })}
        </div>
    );
}
