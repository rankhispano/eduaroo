'use client';

import { motion } from 'framer-motion';
import { Trophy, Lock, CheckCircle } from 'lucide-react';
import { useGamificationStore } from '@/lib/gamification/store';
import { useTranslations } from 'next-intl';

export default function AchievementsWidget() {
    const t = useTranslations();
    const achievements = useGamificationStore((s) => s.achievements);

    const unlocked = achievements.filter(a => a.unlockedAt !== null);
    const locked = achievements.filter(a => a.unlockedAt === null);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                        <Trophy className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('Achievements.title')}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {unlocked.length}/{achievements.length} {t('Achievements.unlocked')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Achievements grid: los bloqueados se ven atenuados con su nombre, para saber qué conseguir */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[...unlocked, ...locked].map((achievement, index) => {
                    const isUnlocked = achievement.unlockedAt !== null;
                    return (
                        <motion.div
                            key={achievement.id}
                            initial={isUnlocked ? { scale: 0 } : false}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className={`flex items-center gap-3 rounded-2xl p-3 ${isUnlocked ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-gray-50 dark:bg-gray-800/60'}`}
                        >
                            <div
                                className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${isUnlocked ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-md' : 'bg-gray-200 grayscale opacity-60 dark:bg-gray-700'}`}
                            >
                                {achievement.icon}
                                {isUnlocked ? (
                                    <span className="absolute -bottom-1 -right-1 rounded-full bg-green-500 p-0.5">
                                        <CheckCircle className="h-3 w-3 text-white" />
                                    </span>
                                ) : (
                                    <span className="absolute -bottom-1 -right-1 rounded-full bg-gray-400 p-0.5">
                                        <Lock className="h-3 w-3 text-white" />
                                    </span>
                                )}
                            </div>
                            <div className="min-w-0">
                                <p className={`text-sm font-bold leading-tight ${isUnlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                                    {t(achievement.nameKey)}
                                </p>
                                <p className="text-xs leading-tight text-gray-500 dark:text-gray-400">{t(achievement.descriptionKey)}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}
