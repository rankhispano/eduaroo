import { getTranslations } from 'next-intl/server';
import OperationsExercises from '@/components/math/g1/OperationsExercises';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'MathGrade1' });

    return {
        title: t('operations_title') || 'Sumas y Restas',
    };
}

export default function Grade1OperationsPage() {
    return <OperationsExercises />;
}
