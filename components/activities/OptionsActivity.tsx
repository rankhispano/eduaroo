'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

// Opción múltiple: sirve para "choice", "fill-blank" y las preguntas de "reading"
export default function OptionsActivity({
    options,
    answer,
    sentence,
    disabled,
    onAnswer,
}: {
    options: string[];
    answer: number;
    sentence?: string;
    disabled: boolean;
    onAnswer: (isCorrect: boolean) => void;
}) {
    const [selected, setSelected] = useState<number | null>(null);

    const choose = (index: number) => {
        if (disabled || selected !== null) return;
        setSelected(index);
        onAnswer(index === answer);
    };

    const [before, after] = sentence ? sentence.split('___') : ['', ''];
    const filled = selected !== null ? options[answer] : null;

    return (
        <div className="flex w-full flex-col items-center gap-8">
            {sentence ? (
                <p className="rounded-2xl bg-slate-50 px-6 py-5 text-center text-2xl font-bold leading-relaxed text-gray-800 dark:bg-gray-800 dark:text-gray-100">
                    {before}
                    <span
                        className={`mx-1 inline-block min-w-24 border-b-4 px-2 ${filled ? 'border-green-500 text-green-600 dark:text-green-400' : 'border-indigo-400 text-transparent'}`}
                    >
                        {filled ?? '___'}
                    </span>
                    {after}
                </p>
            ) : null}

            <div className={`grid w-full gap-4 ${options.length === 4 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-3'}`}>
                {options.map((option, index) => {
                    const isAnswer = index === answer;
                    const isSelected = index === selected;
                    let state = 'bg-gray-50 dark:bg-gray-800 border-transparent hover:bg-indigo-100 hover:border-indigo-400 dark:hover:bg-indigo-900/30';
                    if (selected !== null && isAnswer) state = 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900/30 dark:text-green-300';
                    else if (isSelected) state = 'bg-red-100 border-red-400 text-red-800 dark:bg-red-900/30 dark:text-red-300';
                    else if (selected !== null) state = 'bg-gray-50 border-transparent opacity-60 dark:bg-gray-800';

                    return (
                        <motion.button
                            key={option}
                            type="button"
                            onClick={() => choose(index)}
                            disabled={disabled || selected !== null}
                            whileTap={{ scale: 0.97 }}
                            animate={isSelected && !isAnswer ? { x: [0, -8, 8, -8, 8, 0] } : {}}
                            className={`rounded-xl border-2 p-5 text-xl font-bold shadow transition-colors ${state}`}
                        >
                            {option}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
