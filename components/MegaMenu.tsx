'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { ChevronDown, ChevronRight, BookOpen, Calculator, Globe, FlaskConical, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function MegaMenu() {
    const t = useTranslations('Navigation');
    const [isOpen, setIsOpen] = useState(false);
    const [activeSubject, setActiveSubject] = useState<string | null>('math');

    // Hardcoded structure for now, matching the request
    const subjects = [
        { id: 'language', icon: BookOpen, label: t('language'), active: false },
        { id: 'math', icon: Calculator, label: t('math'), active: true },
        { id: 'science', icon: FlaskConical, label: t('science'), active: false },
        { id: 'social', icon: Users, label: t('social'), active: false },
    ];

    const levels = {
        math: [
            { id: 'grade4', label: t('levels.grade4'), href: '/learning/math/grade4', active: true },
            /* Hidden other grades for now
            { id: 'grade1', label: t('levels.grade1'), href: '#', active: false },
            { id: 'grade2', label: t('levels.grade2'), href: '#', active: false },
            { id: 'grade3', label: t('levels.grade3'), href: '#', active: false },
            { id: 'grade5', label: t('levels.grade5'), href: '#', active: false },
            { id: 'grade6', label: t('levels.grade6'), href: '#', active: false },
            */
        ]
    };

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <button
                className={`flex items-center gap-1 px-3 py-2 rounded-md text-gray-700 hover:text-brand-blue font-medium transition-colors ${isOpen ? 'text-brand-blue bg-brand-blue/5' : ''}`}
            >
                {t('subjects')}
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 w-[600px] bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 flex mt-2"
                    >
                        {/* Left Column: Subjects */}
                        <div className="w-1/3 bg-gray-50 dark:bg-gray-800/50 p-2 border-r border-gray-100 dark:border-gray-800">
                            {subjects.map((subject) => (
                                <div
                                    key={subject.id}
                                    onMouseEnter={() => setActiveSubject(subject.id)}
                                    className={`
                      flex items-center justify-between px-3 py-3 rounded-lg cursor-pointer transition-colors
                      ${activeSubject === subject.id
                                            ? 'bg-white dark:bg-gray-800 text-brand-blue shadow-sm'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}
                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        <subject.icon className="w-5 h-5" />
                                        <span className="font-medium text-sm">{subject.label}</span>
                                    </div>
                                    {activeSubject === subject.id && <ChevronRight className="w-4 h-4" />}
                                </div>
                            ))}
                        </div>

                        {/* Right Column: Levels */}
                        <div className="w-2/3 p-6">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                                {t('levels.primary')}
                            </h3>

                            {activeSubject === 'math' ? (
                                <div className="flex flex-col gap-2">
                                    {levels.math.map((level) => (
                                        <Link
                                            key={level.id}
                                            href={level.href}
                                            className={`
                            block py-2 text-sm font-medium transition-colors hover:text-brand-blue
                            ${level.active ? 'text-brand-blue font-bold' : 'text-gray-400 cursor-not-allowed'}
                         `}
                                        >
                                            {level.label}
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm italic">
                                    <p>{t('selectMath')}</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
