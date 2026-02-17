'use client';

import { useParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, Play, Lock } from 'lucide-react';
import { getProgrammingSectionUnits } from '@/lib/learning/programmingLessons';
import { notFound } from 'next/navigation';

export default function ProgrammingPhasePage() {
    const params = useParams();
    const locale = useLocale();
    const t = useTranslations();
    const sectionId = params?.sectionId as string; // e.g. 'section1'
    const phaseId = params?.phaseId as string;   // e.g. 'phase1'

    const sectionNum = parseInt(sectionId.replace('section', ''));
    if (isNaN(sectionNum)) return notFound();

    // Find the unit corresponding to this phase
    const unitId = `prog_s${sectionNum}_${phaseId}`;
    const units = getProgrammingSectionUnits(sectionNum);
    const unit = units.find(u => u.id === unitId);

    if (!unit) {
        return notFound();
    }

    // Colors and Styles based on section
    const sectionStyles: Record<number, { bg: string, text: string, border: string, hover: string }> = {
        1: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', hover: 'hover:border-emerald-400' },
        2: { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-100', hover: 'hover:border-violet-400' },
        3: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', hover: 'hover:border-amber-400' },
        4: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', hover: 'hover:border-rose-400' },
    };

    const style = sectionStyles[sectionNum] || sectionStyles[1];

    // Use translation keys
    const title = t(unit.titleKey);
    const subtitle = t(unit.descriptionKey);

    return (
        <div className={`min-h-screen ${style.bg} dark:bg-gray-900 p-6 md:p-8`}>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href={`/learning/programming/${sectionId}`} className={`p-2 hover:bg-white rounded-full dark:hover:bg-gray-800 shadow-sm transition-colors`}>
                        <ArrowLeft className={`w-6 h-6 ${style.text}`} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                            <span className="text-4xl">{unit.iconEmoji}</span>
                            {title}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            {subtitle}
                        </p>
                    </div>
                </div>

                {/* Lessons Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {unit.lessons.map((lesson, index) => (
                        <motion.div
                            key={lesson.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link href={`/learning/programming/play/${lesson.id}`}>
                                <div className={`
                                    group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border-2 ${style.border} p-5 
                                    ${style.hover} hover:shadow-lg transition-all cursor-pointer flex items-center gap-4
                                `}>
                                    <div className={`
                                        w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shrink-0
                                        ${lesson.status === 'completed'
                                            ? 'bg-yellow-100 text-yellow-600'
                                            : lesson.status === 'locked'
                                                ? 'bg-gray-100 text-gray-400'
                                                : `bg-slate-100 ${style.text} group-hover:bg-blue-500 group-hover:text-white transition-colors`}
                                    `}>
                                        {lesson.status === 'locked' ? <Lock className="w-5 h-5" /> : (index + 1)}
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                            {t(lesson.titleKey)}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                                            {t(lesson.descriptionKey)}
                                        </p>
                                    </div>

                                    {lesson.status !== 'locked' && (
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Play className="w-6 h-6 text-blue-500 fill-current" />
                                        </div>
                                    )}
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
