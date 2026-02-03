import { getTranslations } from 'next-intl/server';
import OperationsExercises from '@/components/math/g2/OperationsExercises';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'MathGrade2' });

    return {
        title: t('operations_title') || 'Operaciones',
    };
}

export default function Grade2OperationsPage() {
    return <OperationsExercises />;
}
