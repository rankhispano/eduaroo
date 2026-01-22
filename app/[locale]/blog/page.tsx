import { useTranslations } from 'next-intl';

import { getTranslations } from 'next-intl/server';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'BlogPage' });

    return {
        title: t('title'),
        description: t('description')
    };
}

export default function BlogPage() {
    const t = useTranslations('BlogPage');
    return (
        <div className="min-h-screen bg-white dark:bg-black p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('title')}</h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">{t('description')}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <article className="prose dark:prose-invert">
                        <h3>Understanding Bilingual Education</h3>
                        <p className="text-sm text-gray-500">Jan 22, 2026</p>
                    </article>
                </div>
            </div>
        </div>
    );
}
