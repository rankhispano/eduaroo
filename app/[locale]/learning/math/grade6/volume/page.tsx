import { getTranslations } from 'next-intl/server';
import VolumeExercises from '@/components/math/g6/VolumeExercises';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'MathGrade6' });

    return {
        title: t('volume_title') || 'Volumen y 3D',
    };
}

export default function Grade6VolumePage() {
    return <VolumeExercises />;
}
