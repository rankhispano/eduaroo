'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Star, Target } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { usePracticeStore } from '@/lib/learning/practiceStore';
import { practiceKey, temaHref } from '@/src/data/activityResources';
import type { CursoId, Tema } from '@/src/types';

// Camino en zigzag: desplazamiento horizontal de cada parada respecto al centro (px)
const OFFSETS = [0, 70, 112, 70, 0, -70, -112, -70];
const STEP_Y = 132;
const WIDTH = 340;

function Stars({ value, className = '' }: { value: number; className?: string }) {
    const t = useTranslations('KidsMap');
    return (
        <span className={`inline-flex gap-0.5 ${className}`} aria-label={t('starsProgress', { earned: value, possible: 3 })}>
            {[1, 2, 3].map((n) => (
                <Star key={n} className={`h-4 w-4 ${n <= value ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300 dark:text-slate-600'}`} />
            ))}
        </span>
    );
}

export default function TemaPath({
    cursoId,
    cursoNombre,
    asignaturaId,
    asignaturaNombre,
    color,
    region,
    mascotImage,
    temas,
    practiceTemaIds,
}: {
    cursoId: string;
    cursoNombre: string;
    asignaturaId: string;
    asignaturaNombre: string;
    color: string;
    region: string;
    mascotImage: string;
    temas: Tema[];
    practiceTemaIds: string[];
}) {
    const t = useTranslations('KidsMap');
    const locale = useLocale();
    const topics = usePracticeStore((s) => s.topics);
    const lastTopicKey = usePracticeStore((s) => s.lastTopicKey);
    const hydrated = usePracticeStore((s) => s.hydrated);
    const profileCurso = usePracticeStore((s) => s.cursoId);
    const rememberCurso = usePracticeStore((s) => s.setCurso);

    const starsOf = (temaId: string): number => topics[practiceKey(cursoId, asignaturaId, temaId)]?.stars ?? 0;
    const earned = practiceTemaIds.reduce((sum, id) => sum + starsOf(id), 0);
    const possible = practiceTemaIds.length * 3;

    // Parada recomendada: el último tema jugado de esta asignatura o, si no, el primero sin estrellas
    const lastHere = lastTopicKey?.startsWith(`${cursoId}/${asignaturaId}/`) ? lastTopicKey.split('/')[2] : null;
    const recommended = lastHere ?? temas.find((x) => starsOf(x.id) === 0)?.id ?? temas[0]?.id;

    // Si llega desde el menú sin haber elegido curso, se recuerda este
    useEffect(() => {
        if (hydrated && !profileCurso) rememberCurso(cursoId as CursoId);
    }, [hydrated, profileCurso, rememberCurso, cursoId]);

    const points = temas.map((_, i) => ({ x: WIDTH / 2 + OFFSETS[i % OFFSETS.length], y: 48 + i * STEP_Y }));
    const height = points.length ? points[points.length - 1].y + 110 : 0;
    const pathD = points
        .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `C ${points[i - 1].x} ${points[i - 1].y + 70}, ${p.x} ${p.y - 70}, ${p.x} ${p.y}`))
        .join(' ');

    return (
        <div className="mx-auto max-w-3xl px-4 pb-16 pt-6">
            <header className="relative mb-6 overflow-hidden rounded-3xl p-5 text-white shadow-lg sm:p-7" style={{ backgroundColor: `color-mix(in srgb, ${color} 78%, black)` }}>
                <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-4 border-white/80 bg-white sm:h-24 sm:w-24">
                        <Image src={mascotImage} alt="" fill className="object-cover" sizes="96px" />
                    </div>
                    <div className="min-w-0 flex-1">
                        {/* El h1 de la página es "curso · asignatura" (lo que busca quien llega); el nombre de la región es el título visual */}
                        <h1 className="text-sm font-extrabold text-white">
                            {cursoNombre} · {asignaturaNombre}
                        </h1>
                        <p className="text-3xl font-black leading-tight sm:text-4xl">{region}</p>
                        {possible > 0 ? (
                            <div className="mt-2 max-w-xs">
                                <p className="text-sm font-black">{t('starsProgress', { earned, possible })}</p>
                                <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-white/30">
                                    <div className="h-full rounded-full bg-yellow-300" style={{ width: `${(earned / possible) * 100}%` }} />
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
                {practiceTemaIds.length > 0 ? (
                    <Link
                        href={`/learning/${cursoId}/${asignaturaId}/examen`}
                        className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 font-black shadow-[0_4px_0_rgba(0,0,0,0.18)] transition hover:brightness-95 active:translate-y-1 active:shadow-none"
                        style={{ color }}
                    >
                        <Target className="h-5 w-5" /> {t('prepareExam')}
                    </Link>
                ) : null}
            </header>

            <div className="relative mx-auto" style={{ width: WIDTH, maxWidth: '100%', height }}>
                <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${WIDTH} ${height}`} preserveAspectRatio="none" aria-hidden>
                    <path d={pathD} fill="none" stroke={color} strokeOpacity={0.25} strokeWidth={12} strokeLinecap="round" strokeDasharray="2 20" />
                </svg>
                {temas.map((tema, i) => {
                    const stars = starsOf(tema.id);
                    const isRecommended = tema.id === recommended;
                    const { x, y } = points[i];
                    const href = temaHref(cursoId, asignaturaId, tema, locale);
                    const nodeClass = `group absolute flex w-28 -translate-x-1/2 -translate-y-9 flex-col items-center gap-1 ${href ? '' : 'cursor-default opacity-60'}`;
                    const nodeStyle = { left: `${(x / WIDTH) * 100}%`, top: y };
                    const label = href ? `${tema.nombre}: ${t('starsProgress', { earned: stars, possible: 3 })}` : `${tema.nombre}: ${t('comingSoon')}`;
                    const content = (
                        <>
                            <span
                                className={`relative flex h-[72px] w-[72px] items-center justify-center rounded-full border-4 text-2xl font-black transition group-hover:scale-105 ${isRecommended ? 'animate-pulse-soft' : ''}`}
                                style={
                                    stars > 0
                                        ? { backgroundColor: color, borderColor: color, color: '#fff', boxShadow: '0 5px 0 rgba(15,23,42,0.25)' }
                                        : { backgroundColor: '#fff', borderColor: isRecommended ? '#F97316' : color, color, boxShadow: isRecommended ? '0 5px 0 #C2410C, 0 0 0 8px rgba(249,115,22,0.18)' : '0 5px 0 rgba(15,23,42,0.12)' }
                                }
                            >
                                {stars === 3 ? '★' : i + 1}
                                {isRecommended ? (
                                    <span className="absolute -right-6 -top-3 rounded-full bg-orange-500 px-2 py-0.5 text-xs font-black text-white shadow">{t('here')}</span>
                                ) : null}
                            </span>
                            <span className="rounded-lg bg-white/90 px-1.5 text-center text-xs font-extrabold leading-tight text-slate-800 [overflow-wrap:anywhere] shadow-sm dark:bg-slate-900/90 dark:text-slate-100">
                                {tema.nombre}
                            </span>
                            <Stars value={stars} />
                        </>
                    );
                    // Al tocar un tema se abre directamente su lección; si aún no tiene contenido, no lleva a ningún sitio
                    return href ? (
                        <Link key={tema.id} href={href} className={nodeClass} style={nodeStyle} aria-label={label}>
                            {content}
                        </Link>
                    ) : (
                        <span key={tema.id} className={nodeClass} style={nodeStyle} aria-label={label} title={t('comingSoon')}>
                            {content}
                        </span>
                    );
                })}
            </div>

        </div>
    );
}
