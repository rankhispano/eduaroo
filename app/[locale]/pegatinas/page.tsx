import type { Metadata } from 'next';
import StickerAlbum from '@/components/map/StickerAlbum';

export const metadata: Metadata = { title: 'Mis pegatinas' };

export default function Page() {
    return <StickerAlbum />;
}
