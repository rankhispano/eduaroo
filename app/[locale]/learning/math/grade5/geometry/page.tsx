import { getTranslations } from 'next-intl/server';
import GeometryArea from '@/components/math/g5/GeometryArea';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'MathGrade5' });

    return {
        title: t('geometry_title') || 'Áreas y Poliedros',
    };
}

export default function Grade5GeometryPage() {
    return <GeometryArea />;
}
