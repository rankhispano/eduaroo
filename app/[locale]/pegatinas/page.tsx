import { staticPageMetadata } from '@/lib/seo/pages';
import { toSiteLocale } from '@/lib/seo/site';
import StickerAlbum from '@/components/map/StickerAlbum';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const { locale } = await props.params;
    return staticPageMetadata('pegatinas', toSiteLocale(locale));
}

export default function Page() {
    return <StickerAlbum />;
}
