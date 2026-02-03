import { getTranslations } from 'next-intl/server';
import ProportionalityExercises from '@/components/math/g6/ProportionalityExercises';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'MathGrade6' });

    return {
        title: t('proportionality_title') || 'Proporcionalidad',
    };
}

export default function Grade6ProportionalityPage() {
    return <ProportionalityExercises />;
}
