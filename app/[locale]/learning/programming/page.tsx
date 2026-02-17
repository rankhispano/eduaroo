'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { Code2, ArrowRight, Lock } from 'lucide-react';
import { PROGRAMMING_SECTIONS } from '@/lib/learning/programmingLessons';

export default function ProgrammingSelectionPage() {
    const t = useTranslations('ProgrammingSelection');
    const tl = useTranslations();

    return (
        <div className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-fuchsia-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-6 md:p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 mb-10"
                >
                    <div className="p-3 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-2xl text-white shadow-lg">
                        <Code2 className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white">
                            {t('title')}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300">{t('description')}</p>
                    </div>
                </motion.div>

                {/* Worlds Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {PROGRAMMING_SECTIONS.map((section, index) => {
                        const title = tl(section.titleKey);
                        const subtitle = tl(section.subtitleKey);
                        const desc = tl(section.descriptionKey);

                        return (
                            <motion.div
                                key={section.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + index * 0.1 }}
                            >
                                {section.available ? (
                                    <Link href={`/learning/programming/${section.id}`}>
                                        <div className={`group relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-all hover:shadow-2xl hover:-translate-y-1 cursor-pointer h-full`}>
                                            {/* Gradient Header */}
                                            <div className={`bg-gradient-to-r ${section.gradient} p-6 pb-8`}>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-5xl">{section.emoji}</span>
                                                    <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm">
                                                        {t('world', { num: section.num })}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-6 -mt-4 relative">
                                                <div className="bg-white dark:bg-gray-700 rounded-2xl p-4 shadow-md">
                                                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-1">
                                                        {title}
                                                    </h3>
                                                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                                                        {subtitle}
                                                    </p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                                                        {desc}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-bold text-gray-400">
                                                            {section.lessons} {t('lessons')}
                                                        </span>
                                                        <div className="flex items-center text-sm font-semibold text-gray-600 dark:text-gray-300 group-hover:text-violet-600 transition-colors">
                                                            {t('start')}
                                                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ) : (
                                    <div className="relative overflow-hidden rounded-3xl bg-gray-100 dark:bg-gray-800/50 opacity-60 h-full">
                                        <div className="bg-gray-400 p-6 pb-8">
                                            <div className="flex items-center justify-between">
                                                <span className="text-5xl grayscale">{section.emoji}</span>
                                                <Lock className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                        <div className="p-6 -mt-4 relative">
                                            <div className="bg-white dark:bg-gray-700 rounded-2xl p-4">
                                                <h3 className="text-xl font-bold text-gray-500">{title}</h3>
                                                <p className="text-sm text-gray-400 mt-1">
                                                    {t('comingSoon')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
