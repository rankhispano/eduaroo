import { renderCursoOg } from '@/lib/seo/og';
import { cursoParams } from '@/lib/seo/params';
import { toSiteLocale } from '@/lib/seo/site';

export const dynamicParams = false;
export const generateStaticParams = cursoParams;

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string; curso: string }> }) {
    const { locale, curso } = await params;
    return (await renderCursoOg(toSiteLocale(locale), curso)) ?? new Response('Not found', { status: 404 });
}
