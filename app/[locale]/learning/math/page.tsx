import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Calculator, ArrowRight, GraduationCap } from 'lucide-react';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'MathSelection' });

    return {
        title: t('title'),
        description: t('description')
    };
}

export default function MathSelectionPage() {
    const t = useTranslations('MathSelection');
    const tNav = useTranslations('Navigation');

    // Grades configuration
    const grades = [
        { id: 'grade1', active: false },
        { id: 'grade2', active: false },
        { id: 'grade3', active: false },
        { id: 'grade4', active: true, href: '/learning/math/grade4' },
        { id: 'grade5', active: false },
        { id: 'grade6', active: false },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-brand-blue/10 rounded-xl text-brand-blue">
                        <Calculator className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
                        <p className="text-gray-600 dark:text-gray-300">{t('description')}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {grades.map((grade) => (
                        <Link
                            key={grade.id}
                            href={grade.active ? grade.href! : '#'}
                            className={`
                                relative overflow-hidden rounded-2xl p-8 border transition-all duration-300 flex flex-col items-center justify-center gap-4 text-center group
                                ${grade.active
                                    ? 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer'
                                    : 'bg-gray-100 dark:bg-gray-800/50 border-transparent opacity-60 cursor-not-allowed grayscale'}
                            `}
                        >
                            <div className={`p-4 rounded-full ${grade.active ? 'bg-brand-blue/10 text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors' : 'bg-gray-200 text-gray-400'}`}>
                                <GraduationCap className="w-8 h-8" />
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {tNav(`levels.${grade.id}`)}
                            </h3>

                            {grade.active && (
                                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                    <ArrowRight className="w-6 h-6 text-brand-blue" />
                                </div>
                            )}

                            {!grade.active && (
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 border border-gray-300 px-2 py-1 rounded">Coming Soon</span>
                            )}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
