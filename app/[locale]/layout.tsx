import { NextIntlClientProvider, hasLocale } from 'next-intl';
import type { Metadata } from 'next';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { defaultDescription, defaultTitle } from '@/lib/seo/metadata';
import { ogLocales, siteName, siteUrl } from '@/lib/seo/site';
import { templates } from '@/lib/seo/templates';
import { notFound } from 'next/navigation';
import { routing } from '../../i18n/routing';
import Navbar from '@/components/Navbar';
import Breadcrumbs from '@/components/Breadcrumbs';
import { ThemeProvider } from '@/components/ThemeProvider';
import AnimatedKangaroo from '@/components/AnimatedKangaroo';
import Footer from '@/components/Footer';
import KidsTabBar from '@/components/KidsTabBar';
import PracticeStoreHydrator from '@/components/PracticeStoreHydrator';
import { RolesProvider } from '@/lib/auth/RolesContext';


// El sitio no usa formato de fechas relativas (useNow): valor fijo para no depender de la petición
const BUILD_NOW = new Date(0);

export const dynamicParams = false;

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export { viewport } from '@/lib/seo/metadata';

// Valores por defecto del sitio. Cada página fija su propio title, description, canonical y
// Open Graph con buildMetadata(); aquí solo van los comunes (no canonical: heredaría la home).
export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await props.params;
    const es = locale !== 'en';

    return {
        metadataBase: new URL(siteUrl),
        applicationName: siteName,
        title: { default: es ? defaultTitle : templates.en.home().title, template: `%s | ${siteName}` },
        description: es ? defaultDescription : templates.en.home().description,
        openGraph: { siteName, locale: ogLocales[es ? 'es' : 'en'], type: 'website' },
        formatDetection: { telephone: false, email: false, address: false },
    };
}

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    // Ensure that the incoming `locale` is valid
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    setRequestLocale(locale);

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages({ locale });

    // Todas las props del provider son explícitas: así no lee cabeceras y las páginas se generan estáticas
    return (
        <NextIntlClientProvider locale={locale} messages={messages} formats={{}} timeZone="Europe/Madrid" now={BUILD_NOW}>
            <RolesProvider>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <Navbar />
                    <Breadcrumbs />
                    <main className="min-h-screen">
                        {children}
                    </main>
                    <div className="relative">
                        <AnimatedKangaroo />
                        <Footer />
                    </div>
                    <KidsTabBar />
                    <PracticeStoreHydrator />
                </ThemeProvider>
            </RolesProvider>
        </NextIntlClientProvider>
    );
}
