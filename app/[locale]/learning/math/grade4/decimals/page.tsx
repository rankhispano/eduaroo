import DecimalsExercises from '@/components/math/g4/DecimalsExercises';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'DecimalsGrade4' });

    return {
        title: t('title'),
        description: t('description')
    };
}

export default function DecimalsPage() {
    return <DecimalsExercises />;
}
