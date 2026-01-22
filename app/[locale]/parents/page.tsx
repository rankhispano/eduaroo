import { useTranslations } from 'next-intl';

import { getTranslations } from 'next-intl/server';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'ParentsPage' });

    return {
        title: t('title'),
        description: t('description')
    };
}

export default function ParentsPage() {
    const t = useTranslations('ParentsPage');
    return (
        <div className="min-h-screen bg-white dark:bg-black p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('title')}</h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">{t('description')}</p>

                <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800">
                    <h2 className="text-2xl font-semibold mb-4">{t('features')}</h2>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                        <li>Progress Reports</li>
                        <li>Custom Learning Paths</li>
                        <li>Usage Analytics</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
