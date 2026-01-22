import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import {
    Briefcase,
    Notebook,
    PieChart,
    Receipt,
    Box,
    DraftingCompass
} from 'lucide-react';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'MathGrade4' });

    return {
        title: t('title'),
        description: t('title')
    };
}

export default function MathGrade4Page() {
    const t = useTranslations('MathGrade4');
    const topics = t.raw('topics'); // Get raw object to iterate keys if structure matches, else direct access

    const topicList = [
        {
            id: 'multiplication',
            label: t('topics.multiplication'),
            desc: t('topics.multiplicationDesc'),
            icon: Briefcase,
            color: 'bg-yellow-100 text-yellow-600 border-yellow-200',
            active: false
        },
        {
            id: 'division',
            label: t('topics.division'),
            desc: t('topics.divisionDesc'),
            icon: Notebook,
            color: 'bg-green-100 text-green-600 border-green-200',
            active: false
        },
        {
            id: 'fractions',
            label: t('topics.fractions'),
            desc: t('topics.fractionsDesc'),
            icon: PieChart,
            color: 'bg-amber-100 text-amber-600 border-amber-200',
            active: true
        },
        {
            id: 'decimals',
            label: t('topics.decimals'),
            desc: t('topics.decimalsDesc'),
            icon: Receipt, // Close visual match to check/bill
            color: 'bg-emerald-100 text-emerald-600 border-emerald-200',
            active: false
        },
        {
            id: 'geometry',
            label: t('topics.geometry'),
            desc: t('topics.geometryDesc'),
            icon: Box,
            color: 'bg-sky-100 text-sky-600 border-sky-200',
            active: false
        },
        {
            id: 'measurement',
            label: t('topics.measurement'),
            desc: t('topics.measurementDesc'),
            icon: DraftingCompass,
            color: 'bg-orange-50 text-orange-600 border-orange-200',
            active: false
        }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-black p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-brand-blue mb-8">{t('title')}</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {topicList.map((topic) => (
                        <div
                            key={topic.id}
                            className={`
                 relative p-8 rounded-2xl border transition-all duration-300
                 ${topic.color}
                 ${topic.active
                                    ? 'hover:scale-[1.02] cursor-pointer shadow-sm hover:shadow-md'
                                    : 'opacity-70 cursor-not-allowed grayscale-[0.3]'}
               `}
                        >
                            <div className="flex flex-col h-full bg-transparent">
                                <div className="mb-6">
                                    <topic.icon className="w-12 h-12 stroke-[1.5]" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-800 mb-1">
                                        {topic.label}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-700 font-medium">
                                        {topic.desc}
                                    </p>
                                </div>
                            </div>

                            {/* Clickable overlay link only for active topics */}
                            {topic.active && (
                                <Link href={`/learning/math/grade4/${topic.id}`} className="absolute inset-0" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
