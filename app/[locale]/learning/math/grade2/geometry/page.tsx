import { getTranslations } from 'next-intl/server';
import GeometryExercises from '@/components/math/g2/GeometryExercises';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'MathGrade2' });

    return {
        title: t('geometry_title') || 'Geometría 3D',
    };
}

export default function Grade2GeometryPage() {
    return <GeometryExercises />;
}
