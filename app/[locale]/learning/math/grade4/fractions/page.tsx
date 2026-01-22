import { getTranslations } from 'next-intl/server';
import FractionsExercises from '@/components/FractionsExercises';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'FractionsGrade4' });

    return {
        title: t('title'),
        description: t('description')
    };
}

export default function FractionsPage() {
    return <FractionsExercises />;
}
