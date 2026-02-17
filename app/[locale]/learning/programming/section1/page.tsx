import { useTranslations, useLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import UnitPathMap from '@/components/UnitPathMap';
import { getProgrammingSectionUnits } from '@/lib/learning/programmingLessons';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale });

    return {
        title: t('Navigation.ProgrammingNavigation.section1'),
        description: t('Navigation.ProgrammingNavigation.section1_subtitle'),
    };
}

export default function ProgrammingSection1Page() {
    const t = useTranslations();
    const units = getProgrammingSectionUnits(1);

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-900 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <span className="text-5xl mb-4 block">🌍</span>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent mb-2">
                        {t('Navigation.ProgrammingNavigation.section1')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">{t('Navigation.ProgrammingNavigation.section1_subtitle')}</p>
                </div>

                <UnitPathMap
                    units={units}
                    basePath="/learning/programming/section1"
                />
            </div>
        </div>
    );
}
