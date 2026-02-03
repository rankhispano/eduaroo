'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { ChevronDown, ChevronRight, BookOpen, Calculator, FlaskConical, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function MegaMenu() {
    const t = useTranslations('Navigation');
    const [isOpen, setIsOpen] = useState(false);
    const [activeSubject, setActiveSubject] = useState<string | null>('math');
    const triggerRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Hardcoded structure for now, matching the request
    const subjects = [
        { id: 'language', icon: BookOpen, label: t('language'), active: false },
        { id: 'math', icon: Calculator, label: t('math'), active: true, href: '/learning/math' },
        { id: 'science', icon: FlaskConical, label: t('science'), active: false },
        { id: 'social', icon: Users, label: t('social'), active: false },
    ];

    const levels = {
        math: [
            { id: 'grade1', label: t('levels.grade1'), href: '/learning/math/grade1', active: true },
            { id: 'grade2', label: t('levels.grade2'), href: '/learning/math/grade2', active: true },
            { id: 'grade3', label: t('levels.grade3'), href: '/learning/math/grade3', active: true },
            { id: 'grade4', label: t('levels.grade4'), href: '/learning/math/grade4', active: true },
            { id: 'grade5', label: t('levels.grade5'), href: '/learning/math/grade5', active: true },
            { id: 'grade6', label: t('levels.grade6'), href: '/learning/math/grade6', active: true },
        ]
    };

    // Handle click outside to close menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                triggerRef.current &&
                !triggerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <>
            <button
                ref={triggerRef}
                onMouseEnter={() => setIsOpen(true)}
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:text-brand-blue dark:hover:text-brand-blue font-medium transition-all duration-200 ${isOpen ? 'text-brand-blue bg-brand-blue/10' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
                {t('subjects')}
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="fixed inset-0 top-16 bg-black/20 dark:bg-black/40 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Full-width mega menu */}
                        <motion.div
                            ref={menuRef}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="fixed left-0 right-0 top-16 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-xl"
                            onMouseLeave={() => setIsOpen(false)}
                        >
                            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="flex py-6 gap-6">
                                    {/* Left Column: Subjects */}
                                    <div className="w-52 shrink-0 border-r border-gray-100 dark:border-gray-800 pr-4">
                                        <div className="space-y-1">
                                            {subjects.map((subject) => (
                                                <Link
                                                    key={subject.id}
                                                    href={subject.href || '#'}
                                                    onMouseEnter={() => setActiveSubject(subject.id)}
                                                    onClick={() => setIsOpen(false)}
                                                    className={
                                                        `flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ` +
                                                        `${activeSubject === subject.id
                                                            ? 'bg-brand-blue/10 text-brand-blue'
                                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`
                                                    }
                                                >
                                                    <div className="flex items-center gap-2.5">
                                                        <div className={`p-1.5 rounded-md ${activeSubject === subject.id ? 'bg-brand-blue/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
                                                            <subject.icon className="w-4 h-4" />
                                                        </div>
                                                        <span className="font-medium text-sm">{subject.label}</span>
                                                    </div>
                                                    <ChevronRight className={`w-4 h-4 transition-opacity ${activeSubject === subject.id ? 'opacity-100' : 'opacity-0'}`} />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Right Column: Levels Content */}
                                    <div className="flex-1 pl-2">
                                        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <span className="w-6 h-px bg-gray-200 dark:bg-gray-700"></span>
                                            {t('levels.primary')}
                                        </h3>

                                        {activeSubject === 'math' ? (
                                            <div className="flex flex-wrap gap-3">
                                                {levels.math.map((level) => (
                                                    <Link
                                                        key={level.id}
                                                        href={level.href}
                                                        onClick={() => setIsOpen(false)}
                                                        className={`
                                                            group flex items-center gap-2.5 px-4 py-2.5 rounded-lg transition-all duration-200
                                                            ${level.active
                                                                ? 'bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/15 border border-brand-blue/20'
                                                                : 'bg-gray-50 dark:bg-gray-800/50 text-gray-400 cursor-not-allowed'}
                                                        `}
                                                    >
                                                        <span className={`w-1.5 h-1.5 rounded-full ${level.active ? 'bg-brand-blue' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
                                                        <span className="font-medium text-sm">{level.label}</span>
                                                        {level.active && (
                                                            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        )}
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="inline-flex items-center py-3 px-4 rounded-lg bg-gray-50 dark:bg-gray-800/30 border border-dashed border-gray-200 dark:border-gray-700">
                                                <p className="text-gray-400 dark:text-gray-500 text-sm">
                                                    {t('selectMath')}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
