import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import UnitPathMap from '@/components/UnitPathMap';
import { getLanguageUnitsForGrade } from '@/lib/learning/languageUnits';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'LanguageGrade4' });

    return {
        title: t('title'),
        description: t('subtitle')
    };
}

export default function LanguageGrade4Page() {
    const t = useTranslations('LanguageGrade4');
    const units = getLanguageUnitsForGrade(4);

    return (
        <div className="min-h-screen bg-orange-50 dark:bg-black p-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black text-orange-600 mb-2">{t('title')}</h1>
                    <p className="text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
                </div>

                <UnitPathMap
                    units={units}
                    basePath="/learning/language/grade4"
                />
            </div>
        </div>
    );
}
