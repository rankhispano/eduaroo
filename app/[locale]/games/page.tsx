import { useTranslations } from 'next-intl';

import { getTranslations } from 'next-intl/server';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'GamesPage' });

    return {
        title: t('title'),
        description: t('description')
    };
}

export default function GamesPage() {
    const t = useTranslations('GamesPage');
    return (
        <div className="min-h-screen bg-brand-yellow/10 dark:bg-background p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-brand-orange dark:text-brand-yellow mb-4">{t('title')}</h1>
                <p className="text-xl text-gray-700 dark:text-gray-200 mb-8">{t('description')}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="aspect-square bg-white dark:bg-gray-800 rounded-xl shadow-md flex items-center justify-center text-4xl">
                            🎮 {i}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
