import { renderAsignaturaOg } from '@/lib/seo/og';
import { asignaturaParams } from '@/lib/seo/params';
import { toSiteLocale } from '@/lib/seo/site';

export const dynamicParams = false;
export const generateStaticParams = asignaturaParams;

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string; curso: string; asignatura: string }> }) {
    const { locale, curso, asignatura } = await params;
    return (await renderAsignaturaOg(toSiteLocale(locale), curso, asignatura)) ?? new Response('Not found', { status: 404 });
}
