import { getTranslations } from 'next-intl/server';
import StatsExercises from '@/components/math/g6/StatsExercises';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'MathGrade6' });

    return {
        title: t('stats_title') || 'Estadística',
    };
}

export default function Grade6StatsPage() {
    return <StatsExercises />;
}
