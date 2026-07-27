import PrivacyPage from '../[locale]/privacy/page';

export async function generateMetadata() {
    return {
        title: 'Política de Privacidad | Eduaroo',
        description: 'Política de privacidad oficial de Eduaroo: Tablas de Multiplicar. Transparencia sobre datos locales, AdMob infantil y compras Premium.'
    };
}

export default function PoliticaDePrivacidadPage() {
    return <PrivacyPage params={Promise.resolve({ locale: 'es' })} />;
}
