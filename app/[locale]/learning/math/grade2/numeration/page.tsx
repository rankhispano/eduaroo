import { getTranslations } from 'next-intl/server';
import NumerationExercises from '@/components/math/g2/NumerationExercises';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'MathGrade2' });

    return {
        title: t('numeration_title') || 'Numeración 0-999',
    };
}

export default function Grade2NumerationPage() {
    return <NumerationExercises />;
}
