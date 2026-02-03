import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '../../i18n/routing';
import Navbar from '@/components/Navbar';
import '../globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import AnimatedKangaroo from '@/components/AnimatedKangaroo';
import Footer from '@/components/Footer';
import { RolesProvider } from '@/lib/auth/RolesContext';

import { getTranslations } from 'next-intl/server';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'HomePage' });

    return {
        title: {
            template: '%s | Eduaroo',
            default: 'Eduaroo'
        },
        description: t('description'),
        alternates: {
            languages: {
                'en': '/en',
                'es': '/es'
            }
        }
    };
}

import { Lexend } from 'next/font/google';

const lexend = Lexend({
    subsets: ['latin'],
    variable: '--font-lexend',
    display: 'swap',
});

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning>
            <body className={`${lexend.variable} font-sans text-lg`}>
                <NextIntlClientProvider messages={messages}>
                    <RolesProvider>
                        <ThemeProvider
                            attribute="class"
                            defaultTheme="system"
                            enableSystem
                            disableTransitionOnChange
                        >
                            <Navbar />
                            <main className="min-h-screen">
                                {children}
                            </main>
                            <div className="relative">
                                <AnimatedKangaroo />
                                <Footer />
                            </div>
                        </ThemeProvider>
                    </RolesProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
