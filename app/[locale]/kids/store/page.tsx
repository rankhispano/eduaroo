import { staticPageMetadata } from '@/lib/seo/pages';
import { toSiteLocale } from '@/lib/seo/site';
import { getTranslations } from 'next-intl/server';
import AvatarBuilder from '@/components/AvatarBuilder';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const { locale } = await props.params;
    return staticPageMetadata('kidsStore', toSiteLocale(locale));
}

export default function StorePage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
                <AvatarBuilder />
            </div>
        </div>
    );
}
