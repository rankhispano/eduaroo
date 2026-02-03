import { getTranslations } from 'next-intl/server';
import GalaxyMathFuel from '@/components/games/GalaxyMathFuel';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'GalaxyMathFuelPage' });

    return {
        title: t('title'),
        description: t('description')
    };
}

export default function GalaxyMathFuelPage() {
    return <GalaxyMathFuel />;
}
