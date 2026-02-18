import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'GamesPage.calculateTargetMessages' });

    return {
        title: t('meta_title'),
        description: t('meta_description')
    };
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
