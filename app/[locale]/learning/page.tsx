import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import CursoCard from '@/src/components/CursoCard';
import { curriculum } from '@/src/data/curriculum';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await props.params;
    const t = await getTranslations({ locale, namespace: 'LearningPage' });

    return {
        title: t('title'),
        description: t('description'),
    };
}

export default async function LearningPage(props: { params: Promise<{ locale: string }> }) {
    const { locale } = await props.params;
    const t = await getTranslations({ locale, namespace: 'LearningPage' });
    const basePath = `/${locale}/learning`;

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50 px-5 py-8 text-slate-950 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-6xl">
                <header className="mb-10 flex flex-col gap-8 rounded-3xl bg-white p-7 shadow-sm sm:p-9 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="mb-8 inline-flex items-center gap-3">
                            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue text-2xl font-black text-white">
                                E
                            </span>
                            <span className="text-2xl font-black text-slate-950">Eduaroo</span>
                        </div>
                        <p className="mb-3 text-lg font-extrabold text-brand-blue">{t('courseKicker')}</p>
                        <h1 className="max-w-3xl text-4xl font-black tracking-normal sm:text-6xl">
                            {t('courseTitle')}
                        </h1>
                    </div>
                    <p className="max-w-sm text-lg font-semibold text-slate-600">
                        {t('courseDescription')}
                    </p>
                </header>

                <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label={t('courseTitle')}>
                    {curriculum.map((curso) => (
                        <CursoCard
                            key={curso.id}
                            curso={curso}
                            basePath={basePath}
                            levelLabel={t('primaryLabel')}
                            subjectsLabel={t('subjectsLabel')}
                        />
                    ))}
                </section>
            </div>
        </div>
    );
}
