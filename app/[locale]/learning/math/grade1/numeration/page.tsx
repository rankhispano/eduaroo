import { getTranslations } from 'next-intl/server';
import NumerationExercises from '@/components/math/g1/NumerationExercises';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'MathGrade1' });

    return {
        title: t('numeration_title') || 'Numeración 0-99',
    };
}

export default function Grade1NumerationPage() {
    return <NumerationExercises />;
}
