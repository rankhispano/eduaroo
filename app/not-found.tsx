import { NextIntlClientProvider } from 'next-intl';
import NotFoundContent from '@/components/NotFoundContent';
import messages from '@/messages/es.json';

// 404 para rutas fuera de /[locale]; se sirve en español, el idioma por defecto del sitio.
// Props del provider explícitas: si no, lee cabeceras y vuelve dinámicas todas las páginas.
export default function NotFound() {
    return (
        <NextIntlClientProvider locale="es" messages={messages} formats={{}} timeZone="Europe/Madrid" now={new Date(0)}>
            <NotFoundContent />
        </NextIntlClientProvider>
    );
}
