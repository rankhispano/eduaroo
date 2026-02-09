import FractionsWordProblems from '@/components/math/g4/FractionsWordProblems';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'FractionsWordProblems' });

    return {
        title: t('title'),
        description: t('title')
    };
}

export default async function FractionsProblemsPage(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'FractionsWordProblems' });

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4">
             <div className="max-w-4xl mx-auto mb-6">
                <Link 
                    href="/learning/math/grade4" 
                    className="inline-flex items-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium text-sm gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {t('back')}
                </Link>
            </div>
            <FractionsWordProblems />
        </div>
    );
}
