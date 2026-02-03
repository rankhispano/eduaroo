import { getTranslations } from 'next-intl/server';
import MeasurementExercises from '@/components/math/g2/MeasurementExercises';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'MathGrade2' });

    return {
        title: t('measurement_title') || 'Medición',
    };
}

export default function Grade2MeasurementPage() {
    return <MeasurementExercises />;
}
