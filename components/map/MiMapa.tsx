'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ArrowRight, Brain, Flame, Pencil, Plus, Sticker, Target, Trash2, Users } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import TemaSearch from '@/components/map/TemaSearch';
import WorldMap, { type MapRegion } from '@/components/map/WorldMap';
import RooMascot from '@/components/mascot/RooMascot';
import { useGamificationStore } from '@/lib/gamification/store';
import { getDueMistakes, listProfiles, usePracticeStore } from '@/lib/learning/practiceStore';
import { curriculum, getCurso } from '@/src/data/curriculum';
import { getPracticeSet, practiceKey, temaHref } from '@/src/data/activityResources';
import { MASCOTS, REGIONS, mascotImage } from '@/src/data/regions';
import type { AsignaturaId, CursoId } from '@/src/types';

// Fondo algo más oscuro que el color de la asignatura para que el texto blanco se lea bien
const deep = (color: string) => `color-mix(in srgb, ${color} 78%, black)`;

const SHORT: Record<AsignaturaId, string> = { lengua: 'Lengua', mates: 'Mates', naturales: 'Ciencias', sociales: 'Sociales', ingles: 'Inglés' };

function Avatar({ mascot, size = 64, wave = false }: { mascot: string; size?: number; wave?: boolean }) {
    if (mascot === 'roo' && wave) return <RooMascot pose="wave" size={size} className="-my-2 shrink-0" />;
    return (
        <span className="relative block shrink-0 overflow-hidden rounded-full border-4 border-orange-200 bg-white" style={{ width: size, height: size }}>
            <Image src={mascotImage(mascot)} alt="" fill className="object-cover" sizes={`${size}px`} />
        </span>
    );
}

function CourseChips({ value, onChange, highlight = false }: { value: CursoId | null; onChange: (c: CursoId) => void; highlight?: boolean }) {
    return (
        <div className={`flex flex-wrap gap-2 rounded-2xl ${highlight ? 'animate-pulse-soft' : ''}`} role="group">
            {curriculum.map((c) => (
                <button
                    key={c.id}
                    type="button"
                    onClick={() => onChange(c.id)}
                    aria-pressed={value === c.id}
                    className={`h-12 min-w-12 rounded-2xl px-3 text-lg font-black transition ${value === c.id ? 'bg-orange-500 text-white shadow-[0_4px_0_#C2410C]' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200'}`}
                >
                    {c.id}º
                </button>
            ))}
        </div>
    );
}

function MascotPicker({ value, onChange }: { value: string; onChange: (m: string) => void }) {
    return (
        <div className="flex flex-wrap gap-3">
            {MASCOTS.map((m) => (
                <button
                    key={m.id}
                    type="button"
                    onClick={() => onChange(m.id)}
                    aria-pressed={value === m.id}
                    className={`relative h-14 w-14 overflow-hidden rounded-full border-4 bg-white transition ${value === m.id ? 'scale-110 border-orange-400' : 'border-slate-200 opacity-80 hover:opacity-100'}`}
                >
                    <Image src={m.image} alt={m.name} fill className="object-cover" sizes="56px" />
                </button>
            ))}
        </div>
    );
}

export default function MiMapa() {
    const t = useTranslations('KidsMap');
    const store = usePracticeStore();
    const { name, mascot, cursoId, topics, lastTopicKey, mistakes, setName, setMascot, setCurso, switchProfile, addProfile, removeProfile, activeProfileId } = store;
    const profiles = listProfiles(store);
    const streak = useGamificationStore((s) => s.streak.currentStreak);

    const [panel, setPanel] = useState<'none' | 'edit' | 'profiles' | 'new'>('none');
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [draft, setDraft] = useState<{ name: string; mascot: string; cursoId: CursoId | null }>({ name: '', mascot: 'roo', cursoId: null });
    const [highlightCourse, setHighlightCourse] = useState(false);
    const courseRef = useRef<HTMLDivElement>(null);

    const curso = cursoId ? getCurso(cursoId) : undefined;
    const starsOf = (asignaturaId: string, temaId: string): number => (cursoId ? topics[practiceKey(cursoId, asignaturaId, temaId)]?.stars ?? 0 : 0);

    // Sin curso elegido, tocar una región lleva al selector de curso
    const askCourse = () => {
        setPanel('none');
        window.setTimeout(() => courseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
        setHighlightCourse(true);
        window.setTimeout(() => setHighlightCourse(false), 2400);
    };

    // "Seguir por donde ibas": último tema jugado de este curso o, si no hay, el primero con actividades
    const [lastCurso, lastAsig, lastTema] = lastTopicKey?.split('/') ?? [];
    const continueTarget = (() => {
        if (!curso || !cursoId) return null;
        if (lastCurso === cursoId) {
            const asignatura = curso.asignaturas.find((a) => a.id === lastAsig);
            const tema = asignatura?.temas.find((x) => x.id === lastTema);
            if (asignatura && tema) return { asignatura, tema, isNew: false };
        }
        for (const asignatura of curso.asignaturas) {
            const tema = asignatura.temas.find((x) => getPracticeSet(cursoId, asignatura.id, x.id));
            if (tema) return { asignatura, tema, isNew: true };
        }
        return null;
    })();

    const due = getDueMistakes(mistakes).length;
    const stickers = cursoId ? Object.entries(topics).filter(([key, p]) => key.startsWith(`${cursoId}/`) && p.stars === 3).length : 0;

    // Datos de las regiones del mapa (con o sin curso)
    const asignaturas = (curso ?? curriculum[0]).asignaturas;
    const regions: MapRegion[] = asignaturas.map((a) => {
        const withPractice = cursoId ? a.temas.filter((x) => getPracticeSet(cursoId, a.id, x.id)) : [];
        return {
            id: a.id,
            region: REGIONS[a.id].region,
            shortName: SHORT[a.id],
            color: a.color,
            image: REGIONS[a.id].image,
            earned: withPractice.reduce((sum, x) => sum + starsOf(a.id, x.id), 0),
            possible: withPractice.length * 3,
            href: cursoId ? `/learning/${cursoId}/${a.id}` : null,
        };
    });

    const openNew = () => {
        setDraft({ name: '', mascot: 'roo', cursoId: null });
        setPanel('new');
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-sky-100 via-sky-50 to-white px-4 pb-16 pt-6 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
            <div className="mx-auto flex max-w-5xl flex-col gap-6">
                {/* Saludo, perfil y curso */}
                <section className="flex flex-wrap items-center gap-4 rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-900">
                    <Avatar mascot={mascot} wave />
                    <div className="min-w-0 flex-1">
                        {/* El h1 de la portada está en HomeSeo (servidor): aquí es un saludo */}
                        <h2 className="text-2xl font-black text-slate-900 sm:text-3xl dark:text-white">
                            {name ? t('hello', { name }) : t('helloNoName')}
                        </h2>
                        <p className="font-bold text-slate-500">{curso ? curso.nombre : t('chooseCourseHint')}</p>
                    </div>
                    <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                        <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-orange-100 px-3 py-1.5 font-black text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">
                            <Flame className="h-5 w-5" /> {streak > 0 ? t('streak', { count: streak }) : t('streakStart')}
                        </span>
                        <button
                            type="button"
                            onClick={() => setPanel(panel === 'profiles' ? 'none' : 'profiles')}
                            className="inline-flex h-10 items-center gap-1 rounded-full px-3 font-bold text-slate-500 ring-1 ring-slate-200 hover:bg-slate-100 sm:ring-0 dark:ring-slate-700 dark:hover:bg-slate-800"
                            aria-expanded={panel === 'profiles'}
                            aria-label={t('switchProfile')}
                        >
                            <Users className="h-4 w-4" />
                            <span className="hidden sm:inline">{t('switchProfile')}</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setConfirmDelete(false);
                                setPanel(panel === 'edit' ? 'none' : 'edit');
                            }}
                            className="inline-flex h-10 items-center gap-1 rounded-full px-3 font-bold text-slate-500 ring-1 ring-slate-200 hover:bg-slate-100 sm:ring-0 dark:ring-slate-700 dark:hover:bg-slate-800"
                            aria-expanded={panel === 'edit'}
                            aria-label={t('customize')}
                        >
                            <Pencil className="h-4 w-4" />
                            <span className="hidden sm:inline">{t('customize')}</span>
                        </button>
                    </div>

                    {/* Sin curso: se pregunta aquí mismo */}
                    {!curso && panel === 'none' ? (
                        <div ref={courseRef} className="flex w-full flex-col gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                            <p className="text-lg font-black text-slate-800 dark:text-slate-100">{t('courseLabel')}</p>
                            <CourseChips value={cursoId} onChange={setCurso} highlight={highlightCourse} />
                        </div>
                    ) : null}

                    {/* Cambiar de perfil */}
                    {panel === 'profiles' ? (
                        <div className="flex w-full flex-col gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                            <p className="text-lg font-black text-slate-800 dark:text-slate-100">{t('profilesTitle')}</p>
                            <div className="flex flex-wrap gap-3">
                                {profiles.map((p) => (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => {
                                            switchProfile(p.id);
                                            setPanel('none');
                                        }}
                                        aria-pressed={p.id === activeProfileId}
                                        className={`flex items-center gap-2 rounded-2xl border-2 p-2 pr-4 transition ${p.id === activeProfileId ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20' : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'}`}
                                    >
                                        <Avatar mascot={p.mascot} size={44} />
                                        <span className="text-left">
                                            <span className="block font-black text-slate-900 dark:text-white">{p.name || t('noName')}</span>
                                            <span className="block text-sm font-bold text-slate-500">{p.cursoId ? getCurso(p.cursoId)?.nombre : t('noCourse')}</span>
                                        </span>
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    onClick={openNew}
                                    className="flex items-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 p-2 pr-4 font-black text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                                        <Plus className="h-6 w-6" />
                                    </span>
                                    {t('addProfile')}
                                </button>
                            </div>
                        </div>
                    ) : null}

                    {/* Nuevo perfil */}
                    {panel === 'new' ? (
                        <form
                            className="flex w-full flex-col gap-4 border-t border-slate-100 pt-4 dark:border-slate-800"
                            onSubmit={(e) => {
                                e.preventDefault();
                                addProfile(draft);
                                setPanel('none');
                            }}
                        >
                            <p className="text-lg font-black text-slate-800 dark:text-slate-100">{t('newProfileTitle')}</p>
                            <label className="flex flex-col gap-1 font-bold text-slate-700 dark:text-slate-200">
                                {t('nameLabel')}
                                <input
                                    id="new-kid-name"
                                    value={draft.name}
                                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                                    placeholder={t('namePlaceholder')}
                                    maxLength={20}
                                    className="max-w-xs rounded-xl border-2 border-slate-200 px-3 py-2 text-lg dark:border-slate-700 dark:bg-slate-800"
                                />
                            </label>
                            <div className="flex flex-col gap-2">
                                <p className="font-bold text-slate-700 dark:text-slate-200">{t('courseLabel')}</p>
                                <CourseChips value={draft.cursoId} onChange={(c) => setDraft({ ...draft, cursoId: c })} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="font-bold text-slate-700 dark:text-slate-200">{t('mascotLabel')}</p>
                                <MascotPicker value={draft.mascot} onChange={(m) => setDraft({ ...draft, mascot: m })} />
                            </div>
                            <div className="flex gap-2">
                                <button type="submit" className="rounded-xl bg-orange-500 px-5 py-2 font-black text-white shadow-[0_4px_0_#C2410C]">
                                    {t('createProfile')}
                                </button>
                                <button type="button" onClick={() => setPanel('profiles')} className="rounded-xl px-5 py-2 font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                                    {t('cancel')}
                                </button>
                            </div>
                        </form>
                    ) : null}

                    {/* Personalizar el perfil activo */}
                    {panel === 'edit' ? (
                        <div className="flex w-full flex-col gap-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                            <label className="flex flex-col gap-1 font-bold text-slate-700 dark:text-slate-200">
                                {t('nameLabel')}
                                <input
                                    id="kid-name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={t('namePlaceholder')}
                                    maxLength={20}
                                    className="max-w-xs rounded-xl border-2 border-slate-200 px-3 py-2 text-lg dark:border-slate-700 dark:bg-slate-800"
                                />
                            </label>
                            <div className="flex flex-col gap-2">
                                <p className="font-bold text-slate-700 dark:text-slate-200">{t('courseLabel')}</p>
                                <CourseChips value={cursoId} onChange={setCurso} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="font-bold text-slate-700 dark:text-slate-200">{t('mascotLabel')}</p>
                                <MascotPicker value={mascot} onChange={setMascot} />
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <button type="button" onClick={() => setPanel('none')} className="rounded-xl bg-slate-900 px-5 py-2 font-black text-white dark:bg-white dark:text-slate-900">
                                    {t('done')}
                                </button>
                                {confirmDelete ? (
                                    <>
                                        <span className="font-bold text-red-600">{t('deleteConfirm')}</span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                removeProfile(activeProfileId);
                                                setConfirmDelete(false);
                                                setPanel('none');
                                            }}
                                            className="rounded-xl bg-red-600 px-4 py-2 font-black text-white"
                                        >
                                            {t('deleteYes')}
                                        </button>
                                        <button type="button" onClick={() => setConfirmDelete(false)} className="rounded-xl px-4 py-2 font-bold text-slate-500">
                                            {t('cancel')}
                                        </button>
                                    </>
                                ) : (
                                    <button type="button" onClick={() => setConfirmDelete(true)} className="inline-flex items-center gap-1 rounded-xl px-4 py-2 font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
                                        <Trash2 className="h-4 w-4" /> {t('deleteProfile')}
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : null}
                </section>

                {curso && cursoId ? (
                    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                        <div className="flex flex-col gap-4">
                            {/* Seguir por donde ibas */}
                            {continueTarget ? (
                                <Link
                                    href={temaHref(cursoId, continueTarget.asignatura.id, continueTarget.tema) ?? `/learning/${cursoId}/${continueTarget.asignatura.id}`}
                                    className="group flex flex-col gap-2 rounded-3xl p-5 text-white shadow-[0_6px_0_rgba(15,23,42,0.25)] transition active:translate-y-1 active:shadow-none"
                                    style={{ backgroundColor: deep(continueTarget.asignatura.color) }}
                                >
                                    <span className="text-sm font-extrabold text-white/85">
                                        {continueTarget.isNew ? t('startTitle') : t('continueTitle')} · {continueTarget.asignatura.nombre}
                                    </span>
                                    <span className="text-2xl font-black leading-tight sm:text-3xl">{continueTarget.tema.nombre}</span>
                                    <span className="text-lg text-yellow-300" aria-hidden>
                                        {'★'.repeat(starsOf(continueTarget.asignatura.id, continueTarget.tema.id))}
                                        <span className="text-white/35">{'★'.repeat(3 - starsOf(continueTarget.asignatura.id, continueTarget.tema.id))}</span>
                                    </span>
                                    <span className="inline-flex items-center gap-2 self-start rounded-2xl bg-white px-5 py-2 text-lg font-black shadow-[0_4px_0_rgba(0,0,0,0.18)]" style={{ color: continueTarget.asignatura.color }}>
                                        {t('continueCta')} <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
                                    </span>
                                </Link>
                            ) : null}

                            <TemaSearch cursoId={cursoId} />
                        </div>

                        <div className="flex flex-col gap-4">
                            {/* Repaso de hoy */}
                            {due > 0 ? (
                                <Link href="/learning/repaso" className="flex items-center gap-4 rounded-3xl bg-amber-100 p-4 transition hover:brightness-95 dark:bg-amber-900/30">
                                    <Brain className="h-10 w-10 shrink-0 text-amber-600" />
                                    <span className="min-w-0 flex-1">
                                        <span className="block text-lg font-black text-slate-900 dark:text-white">{t('reviewTitle')}</span>
                                        <span className="block font-semibold text-slate-600 dark:text-slate-300">{t('reviewCount', { count: due })}</span>
                                    </span>
                                    <ArrowRight className="h-6 w-6 text-amber-700" />
                                </Link>
                            ) : (
                                <div className="flex items-center gap-4 rounded-3xl bg-white p-4 dark:bg-slate-900">
                                    <Brain className="h-10 w-10 shrink-0 text-slate-300" />
                                    <span>
                                        <span className="block font-black text-slate-800 dark:text-white">{t('reviewEmptyTitle')}</span>
                                        <span className="block text-sm font-semibold text-slate-500">{t('reviewEmpty')}</span>
                                    </span>
                                </div>
                            )}

                            {/* ¿Tienes examen? */}
                            <div className="rounded-3xl bg-white p-4 dark:bg-slate-900">
                                <p className="flex items-center gap-2 text-lg font-black text-slate-900 dark:text-white">
                                    <Target className="h-6 w-6 text-orange-500" /> {t('examTitle')}
                                </p>
                                <p className="mb-3 text-sm font-semibold text-slate-500">{t('examText')}</p>
                                <div className="flex flex-wrap gap-2">
                                    {curso.asignaturas.map((a) => (
                                        <Link
                                            key={a.id}
                                            href={`/learning/${cursoId}/${a.id}/examen`}
                                            className="rounded-full border-2 px-3 py-1 text-sm font-black transition hover:bg-slate-50 dark:hover:bg-slate-800"
                                            style={{ borderColor: a.color, color: a.color }}
                                        >
                                            {a.nombre}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <Link href="/pegatinas" className="flex items-center gap-4 rounded-3xl bg-white p-4 transition hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800">
                                <Sticker className="h-10 w-10 shrink-0 text-pink-500" />
                                <span className="min-w-0 flex-1">
                                    <span className="block text-lg font-black text-slate-900 dark:text-white">{t('stickersTitle')}</span>
                                    <span className="block font-semibold text-slate-500">{t('stickersText', { count: stickers })}</span>
                                </span>
                                <ArrowRight className="h-6 w-6 text-slate-400" />
                            </Link>
                        </div>
                    </div>
                ) : (
                    <TemaSearch cursoId={null} />
                )}

                {/* Mapa ilustrado con las cinco regiones */}
                <section>
                    <h2 className="mb-3 text-2xl font-black text-slate-900 dark:text-white">{t('mapTitle')}</h2>
                    <WorldMap regions={regions} onNeedCourse={askCourse} />
                </section>
            </div>
        </div>
    );
}
