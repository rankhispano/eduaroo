import { HeroSection } from '@/components/landing';
import { useTranslations } from 'next-intl';

import { getTranslations } from 'next-intl/server';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'HomePage' });

    return {
        title: t('title'),
        description: t('description')
    };
}

export default function HomePage() {
    return (
        <main className="min-h-screen bg-white dark:bg-black">
            <HeroSection />
            <div className="max-w-7xl mx-auto px-4 py-16">
                {/* Further content sections */}
            </div>
        </main>
    );
}
