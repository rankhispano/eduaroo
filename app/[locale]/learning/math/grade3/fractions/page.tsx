import { getTranslations } from 'next-intl/server';
import FractionsDecimalsExercises from '@/components/math/g3/FractionsDecimals';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'MathGrade3' });

    return {
        title: t('fractions_title') || 'Fracciones y Decimales',
    };
}

export default function Grade3FractionsPage() {
    return <FractionsDecimalsExercises />;
}
