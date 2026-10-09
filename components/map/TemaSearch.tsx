'use client';

import { useId, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { curriculum } from '@/src/data/curriculum';
import { temaHref } from '@/src/data/activityResources';

const normalize = (text: string) =>
    text
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase();

type Result = { key: string; href: string; tema: string; asignatura: string; curso: string; color: string; sameCourse: boolean };

// "¿Qué estás dando en clase?": busca entre todos los temas, primero los del curso del niño
export default function TemaSearch({ cursoId }: { cursoId?: string | null }) {
    const t = useTranslations('KidsMap');
    const inputId = useId();
    const [query, setQuery] = useState('');

    const index = useMemo<Result[]>(
        () =>
            curriculum.flatMap((curso) =>
                curso.asignaturas.flatMap((asignatura) =>
                    asignatura.temas.map((tema) => ({
                        key: `${curso.id}/${asignatura.id}/${tema.id}`,
                        href: temaHref(curso.id, asignatura.id, tema) ?? `/learning/${curso.id}/${asignatura.id}`,
                        tema: tema.nombre,
                        asignatura: asignatura.nombre,
                        curso: curso.nombre,
                        color: asignatura.color,
                        sameCourse: curso.id === cursoId,
                    })),
                ),
            ),
        [cursoId],
    );

    const words = normalize(query).split(/\s+/).filter((w) => w.length > 1);
    const results = words.length
        ? index
            .filter((r) => {
                const haystack = normalize(`${r.tema} ${r.asignatura}`);
                return words.every((w) => haystack.includes(w));
            })
            .sort((a, b) => Number(b.sameCourse) - Number(a.sameCourse))
            .slice(0, 6)
        : [];

    return (
        <div className="relative">
            <label htmlFor={inputId} className="sr-only">
                {t('searchLabel')}
            </label>
            <div className="flex items-center gap-3 rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 shadow-sm focus-within:border-orange-400 dark:border-slate-700 dark:bg-slate-900">
                <Search className="h-6 w-6 shrink-0 text-slate-400" aria-hidden />
                <input
                    id={inputId}
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    className="w-full bg-transparent text-lg font-bold text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                    autoComplete="off"
                />
            </div>
            {words.length ? (
                <ul className="mt-2 overflow-hidden rounded-2xl border-2 border-slate-100 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
                    {results.length ? (
                        results.map((r) => (
                            <li key={r.key}>
                                <Link href={r.href} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800">
                                    <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: r.color }} aria-hidden />
                                    <span className="min-w-0 flex-1">
                                        <span className="block font-black text-slate-900 dark:text-white">{r.tema}</span>
                                        <span className="block text-sm font-semibold text-slate-500">
                                            {r.asignatura} · {r.curso}
                                        </span>
                                    </span>
                                </Link>
                            </li>
                        ))
                    ) : (
                        <li className="px-4 py-3 font-semibold text-slate-500">{t('searchEmpty')}</li>
                    )}
                </ul>
            ) : null}
        </div>
    );
}
