'use client';

import { motion } from 'framer-motion';
import { Flame, Shield, Calendar, Trophy } from 'lucide-react';
import { useStreak } from '@/lib/gamification/store';
import { getStreakEmoji, getNextMilestone, isStreakAtRisk } from '@/lib/gamification/streakSystem';

export default function StreakWidget() {
    const streak = useStreak();
    const emoji = getStreakEmoji(streak.currentStreak);
    const nextMilestone = getNextMilestone(streak.currentStreak);
    const atRisk = isStreakAtRisk(streak);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative overflow-hidden rounded-2xl p-6 ${atRisk
                    ? 'bg-gradient-to-br from-amber-500 to-orange-600'
                    : 'bg-gradient-to-br from-orange-500 to-red-600'
                } text-white shadow-lg`}
        >
            {/* Background decoration */}
            <div className="absolute -right-4 -top-4 opacity-10">
                <Flame className="w-32 h-32" />
            </div>

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold opacity-90">Racha Diaria</h3>
                    {streak.shieldsAvailable > 0 && (
                        <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-1">
                            <Shield className="w-4 h-4" />
                            <span className="text-sm font-medium">{streak.shieldsAvailable}</span>
                        </div>
                    )}
                </div>

                {/* Main streak display */}
                <div className="flex items-center gap-4 mb-4">
                    <motion.div
                        key={streak.currentStreak}
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        className="text-5xl"
                    >
                        {emoji}
                    </motion.div>
                    <div>
                        <motion.span
                            key={streak.currentStreak}
                            initial={{ scale: 1.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-4xl font-black"
                        >
                            {streak.currentStreak}
                        </motion.span>
                        <span className="text-lg font-medium opacity-80 ml-2">
                            {streak.currentStreak === 1 ? 'día' : 'días'}
                        </span>
                    </div>
                </div>

                {/* At risk warning */}
                {atRisk && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/20 rounded-lg px-3 py-2 mb-4 flex items-center gap-2"
                    >
                        <Flame className="w-4 h-4 animate-pulse" />
                        <span className="text-sm font-medium">¡No pierdas tu racha! Completa un ejercicio hoy.</span>
                    </motion.div>
                )}

                {/* Progress to next milestone */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm opacity-80">
                        <span>Siguiente hito</span>
                        <span className="font-bold">{nextMilestone} días</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-white rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(streak.currentStreak / nextMilestone) * 100}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                        />
                    </div>
                </div>

                {/* Stats row */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/20 text-sm">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 opacity-70" />
                        <span>Récord: <strong>{streak.longestStreak}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 opacity-70" />
                        <span>Total: <strong>{streak.totalDaysActive}</strong> días</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
