'use client';

import { motion } from 'framer-motion';
import { useRoles } from '@/lib/auth/RolesContext';
import {
    Clock,
    Calendar,
    TrendingUp,
    Award,
    AlertCircle,
    CheckCircle2,
    BarChart3
} from 'lucide-react';

import { useTranslations } from 'next-intl';

export default function ParentDashboard() {
    const t = useTranslations('ParentDashboard');
    const { childrenData } = useRoles();
    const selectedChild = childrenData[0]; // Default to first child for now

    // Mock data for parent view
    const stats = [
        { label: t('timeThisWeek'), value: '3h 45m', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: t('exercisesCompleted'), value: '42', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
        { label: t('currentStreak'), value: `5 ${t('days')}`, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
    ];

    const weeklyProgress = [
        { day: 'L', minutes: 45 },
        { day: 'M', minutes: 30 },
        { day: 'X', minutes: 60 },
        { day: 'J', minutes: 20 },
        { day: 'V', minutes: 45 },
        { day: 'S', minutes: 15 },
        { day: 'D', minutes: 0 },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {t('greeting')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {t.rich('intro', {
                            name: selectedChild.name,
                            bold: (chunks) => <span className="font-bold text-brand-blue">{chunks}</span>
                        })}
                    </p>
                </div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${stat.bg}`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                        {stat.label}
                                    </p>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {stat.value}
                                    </h3>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Weekly Activity Chart */}
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-gray-400" />
                                {t('weeklyActivity')}
                            </h2>
                            <select className="text-sm bg-gray-50 dark:bg-gray-700 border-none rounded-lg px-3 py-1">
                                <option>{t('thisWeek')}</option>
                                <option>{t('lastWeek')}</option>
                            </select>
                        </div>

                        <div className="h-64 flex items-end justify-between gap-2">
                            {weeklyProgress.map((day, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                    <div className="w-full bg-blue-50 dark:bg-gray-700 rounded-t-lg relative h-full">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${(day.minutes / 60) * 100}%` }}
                                            className="absolute bottom-0 w-full bg-blue-500 rounded-t-lg transition-all"
                                        />
                                    </div>
                                    <span className="text-xs font-bold text-gray-400">{day.day}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Achievements & Alerts */}
                    <div className="space-y-6">
                        {/* Achievements */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Award className="w-5 h-5 text-yellow-500" />
                                {t('recentAchievements')}
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-xl">
                                        🔥
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-900 dark:text-white">Semana de Fuego</h4>
                                        <p className="text-xs text-gray-500">Racha de 7 días alcanzada</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-xl">
                                        ⭐
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-900 dark:text-white">Perfección</h4>
                                        <p className="text-xs text-gray-500">100% en Fracciones</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Focus Areas */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-orange-500" />
                                {t('areasForImprovement')}
                            </h2>
                            <div className="space-y-3">
                                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-xl border border-orange-100 dark:border-orange-800">
                                    <h4 className="font-bold text-sm text-orange-800 dark:text-orange-300 mb-1">Fracciones Equivalentes</h4>
                                    <p className="text-xs text-orange-600 dark:text-orange-400">
                                        Le está costando un poco (3 intentos fallidos).
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
