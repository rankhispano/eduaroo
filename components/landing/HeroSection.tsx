'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import AnimatedCloud from './AnimatedCloud';
import SchoolIllustration from './SchoolIllustration';
import CTAButton from './CTAButton';
import { Link } from '@/i18n/navigation';

export default function HeroSection() {
    const t = useTranslations('HomePage');

    return (
        <section className="relative min-h-screen overflow-hidden">
            {/* Sky gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#7DD3FC] via-[#A5E6F3] to-[#7DD3FC]" />

            {/* Animated clouds */}
            {/* Animated clouds - Tweaked for better coverage and initial state */}
            {/* Some clouds start visible on screen with negative delays */}
            <AnimatedCloud size="large" speed={60} delay={-30} top="5%" />
            <AnimatedCloud size="medium" speed={45} delay={-15} top="15%" />
            <AnimatedCloud size="large" speed={65} delay={0} top="8%" />
            <AnimatedCloud size="medium" speed={50} delay={-5} top="22%" />
            <AnimatedCloud size="small" speed={40} delay={-20} top="12%" />

            {/* Hills */}
            <div className="absolute md:bottom-0 bottom-8 left-0 right-0 h-[40%]">
                {/* Back hill */}
                <svg className="absolute bottom-0 w-full scale-x-[-1] hidden xl:block" viewBox="0 0 1440 500" preserveAspectRatio="none">
                    <path
                        d="M0,500 L0,200 Q360,50 720,200 Q1080,350 1440,150 L1440,500 Z"
                        fill="#2D8B47"
                    />
                </svg>
                <svg className="absolute bottom-0 w-full scale-x-[-1] hidden lg:block xl:hidden" viewBox="0 0 1440 600" preserveAspectRatio="none">
                    <path
                        d="M0,600 L0,200 Q360,50 720,200 Q1080,350 1440,150 L1440,600 Z"
                        fill="#2D8B47"
                    />
                </svg>
                <svg className="absolute bottom-0 w-full scale-x-[-1] hidden md:block lg:hidden" viewBox="0 0 1440 700" preserveAspectRatio="none">
                    <path
                        d="M0,700 L0,200 Q360,50 720,200 Q1080,350 1440,150 L1440,700 Z"
                        fill="#2D8B47"
                    />
                </svg>
                <svg className="absolute bottom-0 w-full scale-x-[-1] block md:hidden" viewBox="0 0 1440 800" preserveAspectRatio="none">
                    <path
                        d="M0,800 L0,200 Q360,50 720,200 Q1080,350 1440,150 L1440,800 Z"
                        fill="#2D8B47"
                    />
                </svg>
            </div>

            {/* Bottom clouds wave */}
            <div className="absolute bottom-0 left-0 right-0 z-20">
                <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-24">
                    <path
                        d="M0,120 L0,60 Q180,20 360,60 Q540,100 720,60 Q900,20 1080,60 Q1260,100 1440,60 L1440,120 Z"
                        fill="#0f5824ff"
                    />
                </svg>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 md:pt-24 md:pb-32 min-h-screen flex items-center">
                <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
                    {/* Left: Text content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="text-left"
                    >
                        <motion.h1
                            className="text-5xl md:text-6xl lg:text-7xl font-black text-[#1E3A5F] leading-tight mb-6 drop-shadow-sm"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            {t('title')}
                        </motion.h1>

                        <motion.p
                            className="text-xl md:text-2xl text-[#1E3A5F]/90 mb-8 max-w-lg leading-relaxed font-medium"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            {t('description')}
                        </motion.p>

                        <Link href="/learning">
                            <CTAButton>
                                {t('cta')}
                            </CTAButton>
                        </Link>
                    </motion.div>

                    {/* Right: School illustration */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex justify-center lg:justify-end"
                    >
                        <SchoolIllustration />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
