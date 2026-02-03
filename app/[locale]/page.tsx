'use client';

import HeroSection from '@/components/landing/HeroSection';
import { useTranslations } from 'next-intl';

export default function HomePage() {
    const t = useTranslations('HomePage');

    // Default to student dashboard always
    return <HeroSection />;
}
