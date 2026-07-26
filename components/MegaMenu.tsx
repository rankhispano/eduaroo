'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { curriculum } from '@/src/data/curriculum';
import { asignaturaIcons } from '@/src/components/icons';

export default function MegaMenu() {
    const t = useTranslations('Navigation');
    const [isOpen, setIsOpen] = useState(false);
    const [activeCursoId, setActiveCursoId] = useState<string>(curriculum[0]?.id ?? '1');
    const triggerRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const activeCurso = curriculum.find((curso) => curso.id === activeCursoId) ?? curriculum[0];

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
                {t('courses')}
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
                            className="fixed inset-0 top-16 bg-black/20 dark:bg-black/40 z-50"
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
                                    {/* Left Column: Courses */}
                                    <div className="w-52 shrink-0 border-r border-gray-100 dark:border-gray-800 pr-4">
                                        <div className="space-y-1">
                                            {curriculum.map((curso) => (
                                                <button
                                                    key={curso.id}
                                                    type="button"
                                                    onMouseEnter={() => setActiveCursoId(curso.id)}
                                                    onClick={() => setActiveCursoId(curso.id)}
                                                    className={
                                                        `flex w-full items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ` +
                                                        `${activeCursoId === curso.id
                                                            ? 'bg-brand-blue/10 text-brand-blue'
                                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`
                                                    }
                                                >
                                                    <div className="flex items-center gap-2.5">
                                                        <div className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-black ${activeCursoId === curso.id ? 'bg-brand-blue/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
                                                            {curso.id}
                                                        </div>
                                                        <span className="font-medium text-sm">{curso.nombre}</span>
                                                    </div>
                                                    <ChevronRight className={`w-4 h-4 transition-opacity ${activeCursoId === curso.id ? 'opacity-100' : 'opacity-0'}`} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Right Column: Subjects Content */}
                                    <div className="flex-1 pl-2">
                                        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <span className="w-6 h-px bg-gray-200 dark:bg-gray-700"></span>
                                            {t('subjectsOf', { course: activeCurso?.nombre })}
                                        </h3>

                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                            {activeCurso?.asignaturas.map((asignatura) => {
                                                const Icon = asignaturaIcons[asignatura.icono as keyof typeof asignaturaIcons];

                                                return (
                                                    <Link
                                                        key={asignatura.id}
                                                        href={`/learning/${activeCurso.id}/${asignatura.id}`}
                                                        onClick={() => setIsOpen(false)}
                                                        className="group flex items-center justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-gray-700 transition-all duration-200 hover:border-brand-blue/20 hover:bg-brand-blue/10 hover:text-brand-blue dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:border-brand-blue/30 dark:hover:bg-brand-blue/10"
                                                    >
                                                        <div className="flex min-w-0 items-center gap-3">
                                                            <span
                                                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-gray-900"
                                                                style={{ color: asignatura.color }}
                                                            >
                                                                <Icon className="h-5 w-5" />
                                                            </span>
                                                            <span className="truncate text-sm font-semibold">{asignatura.nombre}</span>
                                                        </div>
                                                        <ChevronRight className="h-4 w-4 shrink-0 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
                                                    </Link>
                                                );
                                            })}
                                        </div>
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
