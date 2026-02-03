import { getTranslations } from 'next-intl/server';
import NumerationExercises from '@/components/math/g3/NumerationExercises';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'MathGrade3' });

    return {
        title: t('numeration_title') || 'Números Grandes',
    };
}

export default function Grade3NumerationPage() {
    return <NumerationExercises />;
}
