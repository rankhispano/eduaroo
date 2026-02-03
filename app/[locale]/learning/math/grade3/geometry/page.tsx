import { getTranslations } from 'next-intl/server';
import GeometryExercises from '@/components/math/g3/GeometryExercises';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'MathGrade3' });

    return {
        title: t('geometry_title') || 'Geometría',
    };
}

export default function Grade3GeometryPage() {
    return <GeometryExercises />;
}
