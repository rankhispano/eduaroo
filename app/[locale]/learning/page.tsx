'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Sparkles, ChevronRight, Lock } from 'lucide-react';

// Mascot and Region configuration
const REGIONS = [
    {
        id: 'math',
        image: '/mascots/roo.png',
        gradient: 'from-blue-500 to-purple-600',
        bgLight: 'bg-blue-50',
        href: '/learning/math',
        available: true,
    },
    {
        id: 'language',
        image: '/mascots/loro.png',
        gradient: 'from-green-500 to-emerald-600',
        bgLight: 'bg-green-50',
        href: '/learning/language',
        available: true,
    },
    /*{
        id: 'programming',
        image: '/mascots/byte.png',
        gradient: 'from-violet-500 to-fuchsia-600',
        bgLight: 'bg-violet-50',
        href: '/learning/programming',
        available: true,
    },*/
    {
        id: 'science',
        image: '/mascots/otto.png',
        gradient: 'from-teal-500 to-cyan-600',
        bgLight: 'bg-teal-50',
        href: '/learning/science',
        available: false,
    },
    {
        id: 'english',
        image: '/mascots/polly.png',
        gradient: 'from-yellow-500 to-orange-500',
        bgLight: 'bg-yellow-50',
        href: '/learning/english',
        available: false,
    },
    {
        id: 'social',
        image: '/mascots/hugo.png',
        gradient: 'from-amber-600 to-yellow-700',
        bgLight: 'bg-amber-50',
        href: '/learning/social',
        available: false,
    },
];

export default function LearningPage() {
    const t = useTranslations('LearningPage');

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            {/* Hero Section */}
            <div className="relative overflow-hidden py-12 px-6 md:px-12">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4"
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium shadow-lg">
                            <Sparkles className="w-4 h-4" />
                            {t('title')}
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4"
                    >
                        🌍 Exploradores del Conocimiento
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
                    >
                        {t('description')}
                    </motion.p>
                </div>
            </div>

            {/* Regions Grid */}
            <div className="max-w-7xl mx-auto px-6 pb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {REGIONS.map((region, index) => (
                        <motion.div
                            key={region.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + index * 0.1 }}
                        >
                            {region.available ? (
                                <Link href={region.href}>
                                    <div className={`group relative overflow-hidden rounded-3xl ${region.bgLight} dark:bg-gray-800 p-6 pb-2 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition-all hover:shadow-2xl hover:-translate-y-2 cursor-pointer h-full`}>
                                        {/* Gradient overlay on hover */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${region.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />

                                        {/* Mascot Image */}
                                        <div className="relative w-full aspect-square mb-4">
                                            <Image
                                                src={region.image}
                                                alt={t(`regions.${region.id}.mascot`)}
                                                fill
                                                className="object-contain drop-shadow-lg group-hover:scale-105 transition-transform"
                                            />
                                        </div>

                                        {/* Region Name */}
                                        <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${region.gradient} text-white text-xs font-bold mb-2`}>
                                            {t(`regions.${region.id}.region`)}
                                        </div>

                                        {/* Mascot Name */}
                                        <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">
                                            {t(`regions.${region.id}.mascot`)}
                                        </h3>

                                        {/* CTA */}
                                        <div className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors mt-2">
                                            {t('explore')}
                                            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            ) : (
                                <div className={`relative overflow-hidden rounded-3xl bg-gray-100 dark:bg-gray-800/50 p-6 pb-2 opacity-60 h-full`}>
                                    {/* Lock badge */}
                                    <div className="absolute top-4 right-4 bg-gray-400 text-white p-2 rounded-full">
                                        <Lock className="w-4 h-4" />
                                    </div>

                                    {/* Mascot Image (grayscale) */}
                                    <div className="relative w-full aspect-square mb-4 grayscale">
                                        <Image
                                            src={region.image}
                                            alt={t(`regions.${region.id}.mascot`)}
                                            fill
                                            className="object-contain opacity-70"
                                        />
                                    </div>

                                    {/* Region Name */}
                                    <div className="inline-block px-3 py-1 rounded-full bg-gray-400 text-white text-xs font-bold mb-2">
                                        {t(`regions.${region.id}.region`)}
                                    </div>

                                    {/* Mascot Name */}
                                    <h3 className="font-bold text-gray-500 dark:text-gray-400 text-lg mb-1">
                                        {t(`regions.${region.id}.mascot`)}
                                    </h3>

                                    {/* Coming Soon */}
                                    <p className="text-sm text-gray-400">
                                        {t('comingSoon')}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
