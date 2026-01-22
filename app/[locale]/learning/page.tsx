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
                        <Card key={subject.id} subject={subject} t={t} />
                    ))}
                </div>
            </div>
        </div>
    );
}

import { Calculator, BookOpen, FlaskConical, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Link as I18nLink } from '@/i18n/routing';

function Card({ subject, t }: { subject: any, t: any }) {
    const icons = {
        Calculator,
        BookOpen,
        FlaskConical,
        Users
    };
    const Icon = icons[subject.icon as keyof typeof icons];

    return (
        <I18nLink href={subject.href} className="group bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col h-full hover:-translate-y-1">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${subject.bg}`}>
                <Icon className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-brand-blue transition-colors">
                {t(`subjects.${subject.id}`)}
            </h3>

            <p className="text-gray-500 dark:text-gray-400 mb-6 flex-grow">
                {t(`subjects.${subject.id}Desc`)}
            </p>

            <div className="flex items-center gap-2 font-bold text-sm text-brand-blue group-hover:translate-x-1 transition-transform">
                {t('explore')}
                <ArrowRight className="w-4 h-4" />
            </div>
        </I18nLink>
    );
}
