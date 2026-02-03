'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {
    BookOpen,
    Calculator,
    FlaskConical,
    Globe,
    Users,
    ChevronRight,
    Sparkles
} from 'lucide-react';
import XPWidget from '@/components/XPWidget';
import StreakWidget from '@/components/StreakWidget';
import AchievementsWidget from '@/components/AchievementsWidget';
import PotionWidget from '@/components/PotionWidget';
import DailyReview from '@/components/DailyReview';
import { useGamificationStore } from '@/lib/gamification/store';
import { getSubjectLevel } from '@/lib/gamification/xpSystem';

// Subject configuration
const SUBJECTS = [
    { id: 'math', icon: Calculator, color: 'bg-blue-500', lightBg: 'bg-blue-50', href: '/learning/math', emoji: '🧮' },
    { id: 'language', icon: BookOpen, color: 'bg-orange-500', lightBg: 'bg-orange-50', href: '/learning/language', emoji: '📖' },
    { id: 'science', icon: FlaskConical, color: 'bg-green-500', lightBg: 'bg-green-50', href: '/learning/science', emoji: '🔬' },
    { id: 'english', icon: Globe, color: 'bg-purple-500', lightBg: 'bg-purple-50', href: '/learning/english', emoji: '🌍' },
    { id: 'social', icon: Users, color: 'bg-pink-500', lightBg: 'bg-pink-50', href: '/learning/social', emoji: '🏛️' },
];

const SUBJECT_NAMES: Record<string, { es: string; en: string }> = {
    math: { es: 'Matemáticas', en: 'Math' },
    language: { es: 'Lengua', en: 'Language' },
    science: { es: 'Ciencias', en: 'Science' },
    english: { es: 'Inglés', en: 'English' },
    social: { es: 'Sociales', en: 'Social Studies' },
};

export default function StudentDashboard() {
    const t = useTranslations('Dashboard');
    const subjects = useGamificationStore((s) => s.subjects);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black p-6 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-4"
                >
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-4xl">🦘</span>
                            <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
                                {t('greeting')}
                            </h1>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            {t('question')}
                        </p>
                    </div>

                    {/* Header Widgets */}
                    <div className="flex items-center gap-3">
                        <PotionWidget />
                    </div>
                </motion.div>

                {/* Daily Review */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <DailyReview />
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <XPWidget />
                    <StreakWidget />
                </div>

                {/* Subjects Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                >
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-500" />
                        {t('subjects')}
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        {SUBJECTS.map((subject, index) => {
                            const subjectData = subjects[subject.id as keyof typeof subjects];
                            const subjectLevel = getSubjectLevel(subjectData?.totalXP || 0);
                            const isAvailable = subject.id === 'math';

                            return (
                                <motion.div
                                    key={subject.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + index * 0.05 }}
                                >
                                    {isAvailable ? (
                                        <Link href={subject.href}>
                                            <div className={`group relative overflow-hidden rounded-2xl ${subject.lightBg} dark:bg-gray-800 p-5 border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all hover:shadow-lg cursor-pointer`}>
                                                <div className={`absolute top-3 right-3 ${subject.color} text-white text-xs font-bold px-2 py-1 rounded-full`}>
                                                    {t('level')} {subjectLevel}
                                                </div>

                                                <div className="text-3xl mb-3">{subject.emoji}</div>
                                                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                                                    {SUBJECT_NAMES[subject.id]?.es || subject.id}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                                    {subjectData?.exercisesCompleted || 0} {t('exercises')}
                                                </p>

                                                <div className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                                    {t('continue')}
                                                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </Link>
                                    ) : (
                                        <div className="relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800/50 p-5 opacity-60">
                                            <div className="absolute top-3 right-3 bg-gray-400 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                {t('comingSoon')}
                                            </div>

                                            <div className="text-3xl mb-3 grayscale">{subject.emoji}</div>
                                            <h3 className="font-bold text-gray-600 dark:text-gray-400 mb-1">
                                                {SUBJECT_NAMES[subject.id]?.es || subject.id}
                                            </h3>
                                            <p className="text-sm text-gray-400 dark:text-gray-500">
                                                {t('comingSoon')}
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Achievements */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <AchievementsWidget />
                </motion.div>
            </div>
        </div>
    );
}
