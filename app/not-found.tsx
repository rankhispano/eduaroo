// Server Component 
// actually not-found.tsx can be server.
// Let's try server component.

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import NotFoundContent from '@/components/NotFoundContent';
import './globals.css';

export default async function NotFound() {
    // Default to English for global 404
    const messages = await getMessages({ locale: 'en' });

    return (
        <html lang="en">
            <body className="font-sans antialiased">
                <NextIntlClientProvider locale="en" messages={messages}>
                    <NotFoundContent />
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
