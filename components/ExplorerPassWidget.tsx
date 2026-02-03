'use client';

import { motion } from 'framer-motion';
import { Ticket, Star, ChevronRight, Lock, Gift } from 'lucide-react';
import { getCurrentPass } from '@/lib/gamification/explorerPass';

import { useTranslations } from 'next-intl';

export default function ExplorerPassWidget() {
    const t = useTranslations('ExplorerPass');
    const pass = getCurrentPass();
    const progressPercent = (pass.currentXP / pass.xpToNextLevel) * 100;

    return (
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                <Ticket size={200} />
            </div>

            <div className="relative z-10">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">{pass.icon}</span>
                            <span className="font-bold text-emerald-100 text-sm tracking-wider uppercase">
                                {t('title')}
                            </span>
                        </div>
                        <h2 className="text-2xl font-black">{pass.seasonName}</h2>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold border border-white/30">
                        {t('level', { level: pass.level })}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2 text-emerald-100">
                        <span>{pass.currentXP} XP</span>
                        <span>{pass.xpToNextLevel} XP</span>
                    </div>
                    <div className="h-4 bg-black/20 rounded-full overflow-hidden p-0.5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            className="h-full bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                        />
                    </div>
                </div>

                {/* Next Rewards Preview */}
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    <div className="flex-shrink-0 w-16 flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center border-2 border-yellow-400">
                            <span className="text-xl">🎒</span>
                        </div>
                        <span className="text-xs font-bold text-yellow-300">{t('level', { level: pass.level + 1 })}</span>
                    </div>
                    <div className="flex-shrink-0 w-16 flex flex-col items-center gap-2 opacity-60">
                        <div className="w-12 h-12 rounded-xl bg-black/20 flex items-center justify-center border border-white/10">
                            <Gift className="w-6 h-6" />
                        </div>
                        <span className="text-xs">{t('level', { level: pass.level + 2 })}</span>
                    </div>
                    <div className="flex-shrink-0 w-16 flex flex-col items-center gap-2 opacity-60">
                        <div className="w-12 h-12 rounded-xl bg-black/20 flex items-center justify-center border border-white/10">
                            <Lock className="w-5 h-5" />
                        </div>
                        <span className="text-xs">{t('level', { level: pass.level + 3 })}</span>
                    </div>
                </div>

                {/* Action Button */}
                <button className="mt-4 w-full bg-white text-emerald-600 font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:bg-emerald-50 transition-colors">
                    {t('viewMissions')}
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
