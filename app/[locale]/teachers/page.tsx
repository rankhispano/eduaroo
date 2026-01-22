import { useTranslations } from 'next-intl';

import { getTranslations } from 'next-intl/server';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'TeachersPage' });

    return {
        title: t('title'),
        description: t('description')
    };
}

export default function TeachersPage() {
    const t = useTranslations('TeachersPage');
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('title')}</h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">{t('description')}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-black p-6 rounded-lg shadow">
                        <h3 className="text-xl font-bold mb-2">{t('resources')}</h3>
                        <p>Access lesson plans and printable worksheets.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
