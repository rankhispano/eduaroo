import { renderHomeOg } from '@/lib/seo/og';
import { locales, toSiteLocale } from '@/lib/seo/site';

export const dynamicParams = false;
export const generateStaticParams = () => locales.map((locale) => ({ locale }));

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    return renderHomeOg(toSiteLocale(locale));
}
