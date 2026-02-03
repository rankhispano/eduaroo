import { getTranslations } from 'next-intl/server';
import MeasurementExercises from '@/components/math/g1/MeasurementExercises';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'MathGrade1' });

    return {
        title: t('measurement_title') || 'Medición',
    };
}

export default function Grade1MeasurementPage() {
    return <MeasurementExercises />;
}
