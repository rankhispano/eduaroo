'use client';

import { motion } from 'framer-motion';
import { Star, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { useXP, useStars, useLevel, useDailyGoal } from '@/lib/gamification/store';
import { getLevelProgress, getXPToNextLevel } from '@/lib/gamification/xpSystem';
import { CircularProgress } from '@/components/ProgressBar';

export default function XPWidget() {
    const totalXP = useXP();
    const stars = useStars();
    const level = useLevel();
    const { goal, progress } = useDailyGoal();

    const levelProgress = getLevelProgress(totalXP);
    const xpToNext = getXPToNextLevel(totalXP);
    const dailyComplete = progress >= goal;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden"
        >
            {/* Background decoration */}
            <div className="absolute -right-6 -bottom-6 opacity-10">
                <Sparkles className="w-40 h-40" />
            </div>

            <div className="relative z-10">
                {/* Level and badge */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl">
                            {level.badge}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">Nivel {level.level}</h3>
                            <p className="text-sm opacity-80">{level.nameEs}</p>
                        </div>
                    </div>

                    {/* Stars display */}
                    <div className="flex items-center gap-2 bg-yellow-400/20 rounded-full px-3 py-1.5">
                        <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                        <motion.span
                            key={stars}
                            initial={{ scale: 1.3 }}
                            animate={{ scale: 1 }}
                            className="font-bold text-yellow-300"
                        >
                            {stars}
                        </motion.span>
                    </div>
                </div>

                {/* XP display */}
                <div className="bg-white/10 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-300" />
                            <span className="font-medium">Experiencia</span>
                        </div>
                        <motion.span
                            key={totalXP}
                            initial={{ scale: 1.2, color: '#fef08a' }}
                            animate={{ scale: 1, color: '#ffffff' }}
                            className="font-bold text-xl"
                        >
                            {totalXP.toLocaleString()} XP
                        </motion.span>
                    </div>

                    {/* Level progress bar */}
                    <div className="space-y-1">
                        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-yellow-300 to-amber-400 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${levelProgress}%` }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                            />
                        </div>
                        <div className="flex justify-between text-xs opacity-70">
                            <span>{Math.round(levelProgress)}% completado</span>
                            <span>{xpToNext > 0 ? `${xpToNext} XP para nivel ${level.level + 1}` : '¡Nivel máximo!'}</span>
                        </div>
                    </div>
                </div>

                {/* Daily goal */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="w-4 h-4" />
                            <span className="font-medium">Meta diaria</span>
                        </div>
                        <p className="text-sm opacity-80">
                            {progress}/{goal} ejercicios
                            {dailyComplete && <span className="ml-2">✅</span>}
                        </p>
                    </div>
                    <CircularProgress
                        percentage={(progress / goal) * 100}
                        size={60}
                        strokeWidth={6}
                    />
                </div>
            </div>
        </motion.div>
    );
}
