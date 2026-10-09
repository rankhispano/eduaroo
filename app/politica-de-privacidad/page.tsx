import { staticPageMetadata } from '@/lib/seo/pages';
import PrivacyPage from '../[locale]/privacy/page';

export async function generateMetadata() {
    return staticPageMetadata('privacy', 'es');
}

export default function PoliticaDePrivacidadPage() {
    return <PrivacyPage params={Promise.resolve({ locale: 'es' })} />;
}
