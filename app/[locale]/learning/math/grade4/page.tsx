import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import UnitPathMap from '@/components/UnitPathMap';
import { getUnitsForGrade } from '@/lib/learning/sampleUnits';

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
    const units = getUnitsForGrade(4);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black p-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black text-brand-blue mb-2">{t('title')}</h1>
                    <p className="text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
                </div>

                <UnitPathMap
                    units={units}
                    basePath="/learning/math/grade4"
                />
            </div>
        </div>
    );
}
