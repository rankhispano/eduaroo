import { useTranslations } from 'next-intl';

import { getTranslations } from 'next-intl/server';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'LearningPage' });

    return {
        title: t('title'),
        description: t('description')
    };
}

import SubjectCard from '@/components/SubjectCard';

export default function LearningPage() {
    const t = useTranslations('LearningPage');
    const subjects = [
        { id: 'math', icon: 'Calculator', href: '/learning/math', bg: 'bg-brand-blue/10 text-brand-blue' },
        { id: 'language', icon: 'BookOpen', href: '#', bg: 'bg-brand-orange/10 text-brand-orange' },
        { id: 'science', icon: 'FlaskConical', href: '#', bg: 'bg-brand-green/10 text-brand-green' },
        { id: 'social', icon: 'Users', href: '#', bg: 'bg-purple-100 text-purple-600' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('title')}</h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">{t('description')}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {subjects.map((subject) => (
                        <SubjectCard
                            key={subject.id}
                            subject={subject}
                            title={t(`subjects.${subject.id}`)}
                            description={t(`subjects.${subject.id}Desc`)}
                            exploreText={t('explore')}
                            comingSoonText={t('comingSoon')}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
