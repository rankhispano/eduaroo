import { useTranslations } from 'next-intl';

import { getTranslations } from 'next-intl/server';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'KidsPage' });

    return {
        title: t('title'),
        description: t('description')
    };
}

export default function KidsPage() {
    const t = useTranslations('KidsPage');
    return (
        <div className="min-h-screen bg-brand-blue/5 dark:bg-brand-blue/90 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-brand-blue dark:text-white mb-4">{t('title')}</h1>
                <p className="text-xl text-gray-700 dark:text-gray-200">{t('description')}</p>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Placeholders for games/activities */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-brand-green/20">
                        <h3 className="text-2xl font-bold text-brand-green mb-2">{t('math')}</h3>
                        <div className="h-32 bg-brand-green/10 rounded-xl mb-4"></div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-brand-orange/20">
                        <h3 className="text-2xl font-bold text-brand-orange mb-2">{t('science')}</h3>
                        <div className="h-32 bg-brand-orange/10 rounded-xl mb-4"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
