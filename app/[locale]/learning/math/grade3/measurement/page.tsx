import { getTranslations } from 'next-intl/server';
import MeasurementExercises from '@/components/math/g3/MeasurementExercises';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'MathGrade3' });

    return {
        title: t('measurement_title') || 'Medición y Datos',
    };
}

export default function Grade3MeasurementPage() {
    return <MeasurementExercises />;
}
