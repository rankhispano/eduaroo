import { getTranslations } from 'next-intl/server';
import IntegersExercises from '@/components/math/g6/IntegersExercises';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'MathGrade6' });

    return {
        title: t('integers_title') || 'Enteros y Potencias',
    };
}

export default function Grade6IntegersPage() {
    return <IntegersExercises />;
}
