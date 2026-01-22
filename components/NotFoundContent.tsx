'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import Mascot from '@/components/landing/Mascot';
import { Home } from 'lucide-react';

export default function NotFoundContent() {
    const t = useTranslations('NotFound');

    return (
        <div className="min-h-[80vh] bg-[#7DD3FC] flex flex-col items-center justify-center relative overflow-hidden rounded-3xl m-4">
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#7DD3FC] via-[#A5E6F3] to-[#7DD3FC]" />

            {/* Hills */}
            <div className="absolute bottom-0 left-0 right-0 h-[30%] z-0">
                <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 300" preserveAspectRatio="none">
                    <path d="M0,300 L0,180 Q400,80 800,180 Q1200,280 1440,120 L1440,300 Z" fill="#22C55E" />
                </svg>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center p-6">

                {/* Jumping Mascot */}
                <motion.div
                    className="mb-12"
                    animate={{
                        x: [-100, 100, -100],
                        y: [0, -50, 0, -50, 0],
                        rotate: [0, 5, -5, 5, 0]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <div className="scale-150">
                        <Mascot />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <h1 className="text-4xl md:text-6xl font-black text-[#1E3A5F] mb-4 drop-shadow-sm">
                        {t('title')}
                    </h1>

                    <p className="text-xl text-[#1E3A5F]/80 mb-8 max-w-md mx-auto font-medium">
                        {t('description')}
                    </p>

                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-brand-orange text-white rounded-full font-bold text-lg shadow-lg hover:bg-orange-600 hover:scale-105 transition-all"
                    >
                        <Home className="w-5 h-5" />
                        {t('home')}
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
