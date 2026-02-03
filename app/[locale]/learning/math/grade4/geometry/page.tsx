import GeometryExercises from '@/components/math/g4/GeometryExercises';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'GeometryGrade4' });

    return {
        title: t('title'),
        description: t('description')
    };
}

export default function GeometryPage() {
    return <GeometryExercises />;
}
