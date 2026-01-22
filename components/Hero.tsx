'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';

export default function Hero() {
    const t = useTranslations('HomePage');
    const tCommon = useTranslations('Common');

    return (
        <section className="bg-gradient-to-b from-brand-blue/10 via-brand-green/5 to-transparent dark:from-brand-blue/20 dark:to-background py-20 lg:py-32 px-4 relative overflow-hidden">
            <div className="max-w-7xl mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-block mb-4 px-4 py-1.5 rounded-full bg-brand-yellow/20 text-brand-orange font-semibold text-sm tracking-wide uppercase"
                >
                    Eduaroo 🦘
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-7xl font-extrabold text-brand-blue dark:text-white mb-6 tracking-tight"
                >
                    {t('title')}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 mb-10 max-w-2xl mx-auto"
                >
                    {t('description')}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Link
                        href="/kids"
                        className="px-8 py-4 bg-brand-orange text-white rounded-full font-bold text-lg hover:bg-orange-600 transition-transform hover:scale-105 shadow-lg shadow-brand-orange/25"
                    >
                        {tCommon('getStarted')}
                    </Link>
                    <Link
                        href="/parents"
                        className="px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-full font-bold text-lg hover:bg-gray-50 transition-transform hover:scale-105 shadow-sm"
                    >
                        For Parents
                    </Link>
                </motion.div>
            </div>

            {/* Decorative blobs */}
            <div className="absolute top-0 left-0 -ml-20 -mt-20 w-72 h-72 bg-brand-blue/20 rounded-full blur-3xl opacity-50 mix-blend-multiply dark:mix-blend-screen animate-blob" />
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-brand-green/20 rounded-full blur-3xl opacity-50 mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000" />
            <div className="absolute -bottom-20 left-20 w-72 h-72 bg-brand-yellow/20 rounded-full blur-3xl opacity-50 mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000" />
        </section>
    )
}
