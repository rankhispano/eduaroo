import { getTranslations } from 'next-intl/server';
import SexagesimalExercises from '@/components/math/g5/SexagesimalExercises';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'MathGrade5' });

    return {
        title: t('sexagesimal_title') || 'Sistema Sexagesimal',
    };
}

export default function Grade5SexagesimalPage() {
    return <SexagesimalExercises />;
}
