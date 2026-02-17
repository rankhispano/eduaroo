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
                            {unlocked.length}/{achievements.length} {t('Achievements.unlocked') || 'unlocked'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Achievements grid */}
            <div className="grid grid-cols-4 gap-3">
                {/* Unlocked achievements */}
                {unlocked.map((achievement, index) => (
                    <motion.div
                        key={achievement.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="relative group"
                    >
                        <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform cursor-pointer">
                            {achievement.icon}
                            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5">
                                <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                        </div>

                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                                <p className="font-bold">{t(achievement.nameKey)}</p>
                                <p className="opacity-70">{t(achievement.descriptionKey)}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* Locked achievements */}
                {locked.map((achievement) => (
                    <div
                        key={achievement.id}
                        className="relative group"
                    >
                        <div className="w-full aspect-square rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-2xl opacity-50 cursor-pointer group-hover:opacity-70 transition-opacity">
                            <Lock className="w-6 h-6 text-gray-400" />
                        </div>

                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                                <p className="font-bold">???</p>
                                <p className="opacity-70">{t(achievement.descriptionKey)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
