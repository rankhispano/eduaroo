import { getTranslations } from 'next-intl/server';
import ArithmeticExercises from '@/components/math/g5/ArithmeticExercises';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'MathGrade5' });

    return {
        title: t('arithmetic_title') || 'Aritmética Avanzada',
    };
}

export default function Grade5ArithmeticPage() {
    return <ArithmeticExercises />;
}
