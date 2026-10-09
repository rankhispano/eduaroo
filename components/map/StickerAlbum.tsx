'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { usePracticeStore } from '@/lib/learning/practiceStore';
import { curriculum, getCurso } from '@/src/data/curriculum';
import { getPracticeSet, practiceKey } from '@/src/data/activityResources';
import { REGIONS } from '@/src/data/regions';

// Cada tema con tres estrellas desbloquea la pegatina de su región
export default function StickerAlbum() {
    const t = useTranslations('KidsMap');
    const topics = usePracticeStore((s) => s.topics);
    const profileCurso = usePracticeStore((s) => s.cursoId);
    const [picked, setPicked] = useState<string | null>(null);
    const cursoId = picked ?? profileCurso ?? '1';
    const curso = getCurso(cursoId);
    if (!curso) return null;

    const rows = curso.asignaturas.map((a) => ({
        asignatura: a,
        temas: a.temas.filter((x) => getPracticeSet(cursoId, a.id, x.id)),
    }));
    const total = rows.reduce((sum, r) => sum + r.temas.length, 0);
    const earned = rows.reduce((sum, r) => sum + r.temas.filter((x) => topics[practiceKey(cursoId, r.asignatura.id, x.id)]?.stars === 3).length, 0);

    return (
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 pb-16 pt-6">
            <header>
                <h1 className="text-4xl font-black text-slate-900 dark:text-white">{t('stickersPageTitle')}</h1>
                <p className="mt-2 text-lg font-semibold text-slate-600 dark:text-slate-300">{t('stickersIntro')}</p>
            </header>

            <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t('stickersCourse')}>
                {curriculum.map((c) => (
                    <button
                        key={c.id}
                        type="button"
                        onClick={() => setPicked(c.id)}
                        aria-pressed={c.id === cursoId}
                        className={`rounded-full px-4 py-2 font-black transition ${c.id === cursoId ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300'}`}
                    >
                        {c.id}º
                    </button>
                ))}
                <span className="ml-auto rounded-full bg-pink-100 px-4 py-2 font-black text-pink-700 dark:bg-pink-900/40 dark:text-pink-300">
                    {t('stickersCount', { earned, total })}
                </span>
            </div>

            {rows.map(({ asignatura, temas }) =>
                temas.length ? (
                    <section key={asignatura.id} className="rounded-3xl bg-white p-5 dark:bg-slate-900">
                        <h2 className="mb-4 text-xl font-black" style={{ color: asignatura.color }}>
                            {REGIONS[asignatura.id].region} · {asignatura.nombre}
                        </h2>
                        <ul className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-8">
                            {temas.map((tema, i) => {
                                const got = topics[practiceKey(cursoId, asignatura.id, tema.id)]?.stars === 3;
                                return (
                                    <li key={tema.id}>
                                        <Link href={`/learning/${cursoId}/${asignatura.id}/${tema.id}`} className="flex flex-col items-center gap-2 text-center">
                                            {got ? (
                                                <span
                                                    className={`relative block aspect-square w-full max-w-24 overflow-hidden rounded-full border-4 bg-white shadow-lg ${i % 2 ? 'rotate-6' : '-rotate-6'}`}
                                                    style={{ borderColor: asignatura.color }}
                                                >
                                                    <Image src={REGIONS[asignatura.id].image} alt="" fill className="object-cover" sizes="96px" />
                                                </span>
                                            ) : (
                                                <span
                                                    className="flex aspect-square w-full max-w-24 items-center justify-center rounded-full border-4 border-dashed border-slate-200 text-3xl font-black text-slate-300 dark:border-slate-700 dark:text-slate-600"
                                                    aria-label={t('stickerLocked')}
                                                >
                                                    ?
                                                </span>
                                            )}
                                            <span className={`text-xs font-extrabold leading-tight [overflow-wrap:anywhere] ${got ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400'}`}>
                                                {tema.nombre}
                                            </span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </section>
                ) : null,
            )}
        </div>
    );
}
