import { getTranslations } from 'next-intl/server';
import FractionsExercises from '@/components/math/g2/FractionsExercises';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'MathGrade2' });

    return {
        title: t('fractions_title') || 'Fracciones',
    };
}

export default function Grade2FractionsPage() {
    return <FractionsExercises />;
}
