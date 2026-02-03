import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Rocket, Stars } from 'lucide-react';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'GamesPage' });

    return {
        title: t('title'),
        description: t('description')
    };
}

export default function GamesPage() {
    const t = useTranslations('GamesPage');
    return (
        <div className="min-h-screen bg-brand-yellow/10 dark:bg-background p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-xl bg-brand-blue/10 text-brand-blue">
                        <Stars className="w-6 h-6" />
                    </div>
                    <h1 className="text-4xl font-bold text-brand-orange dark:text-brand-yellow">{t('title')}</h1>
                </div>
                <p className="text-xl text-gray-700 dark:text-gray-200 mb-10">{t('description')}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Link
                        href="/games/galaxy-math-fuel"
                        className="group relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-slate-900 via-slate-950 to-black p-6 text-white shadow-lg transition-transform hover:-translate-y-1"
                    >
                        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/40 via-transparent to-transparent" />
                        <div className="relative z-10 flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300">
                                    <Rocket className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{t('galaxyMathFuelTitle')}</h2>
                                    <p className="text-sm text-blue-200/80">{t('galaxyMathFuelTag')}</p>
                                </div>
                            </div>
                            <p className="text-sm text-slate-200/90 leading-relaxed">{t('galaxyMathFuelDesc')}</p>
                            <div className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-blue-200 group-hover:text-white transition-colors">
                                {t('playNow')}
                                <span className="text-lg">→</span>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
