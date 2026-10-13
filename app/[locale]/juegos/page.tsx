import ResourceCards from '@/components/resources/ResourceCards';
import { resourceGuides } from '@/lib/resources/catalog';
import { GamesCrumbs } from '@/components/seo/StaticCrumbs';
import { staticPageMetadata } from '@/lib/seo/pages';
import { toSiteLocale } from '@/lib/seo/site';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Rocket, Stars, Brain, Binary, Calculator, Gamepad2, SquareAsterisk } from 'lucide-react';
import GamesList from './GamesList'; // We'll move the client logic here

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const { locale } = await props.params;
    return staticPageMetadata('games', toSiteLocale(locale));
}

export default async function GamesPage(props: { params: Promise<{ locale: string }> }) {
    const { locale } = await props.params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'GamesPage' });

    return (
        <>
        <GamesCrumbs locale={locale} />
        <div className="min-h-screen bg-brand-yellow/10 dark:bg-background p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-xl bg-brand-blue/10 text-brand-blue">
                                <Stars className="w-6 h-6" />
                            </div>
                            <h1 className="text-4xl font-bold text-brand-orange dark:text-brand-yellow">{t('seoTitle')}</h1>
                        </div>
                        <p className="text-xl text-gray-700 dark:text-gray-200 ml-1">{t('seoDesc')}</p>
                    </div>
                </div>

                <GamesList />
                {locale === 'es' && <section className="mt-12 space-y-5">
                    <h2 className="text-2xl font-black">Más juegos para practicar lo del cole</h2>
                    <p>Elige una habilidad y practica a tu ritmo: operaciones, reloj, palabras y geografía, con ejemplos y explicaciones.</p>
                    <ResourceCards guides={resourceGuides.filter(guide => ['tablas-de-multiplicar','sumas-y-restas','divisiones-para-ninos','aprender-a-leer-el-reloj','dictados-para-ninos','mapa-de-espana'].includes(guide.slug))}/>
                    <Link href="/recursos" className="resource-link">Ver todas las herramientas y recursos →</Link>
                </section>}
            </div>
        </div>
        </>
    );
}
