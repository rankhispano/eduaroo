'use client';

import Link from 'next/link';
import { ChevronRight } from '@/src/components/icons';
import type { Curso } from '@/src/types';
import { useNavStore } from '@/src/store/useNavStore';

const cursoStyles: Record<string, string> = {
  '1': 'bg-blue-50 border-blue-100 text-blue-700',
  '2': 'bg-sky-100 border-sky-200 text-sky-800',
  '3': 'bg-cyan-100 border-cyan-200 text-cyan-800',
  '4': 'bg-indigo-100 border-indigo-200 text-indigo-800',
  '5': 'bg-blue-200 border-blue-300 text-blue-900',
  '6': 'bg-indigo-200 border-indigo-300 text-indigo-950',
};

export default function CursoCard({
  curso,
  basePath = '/repaso',
  levelLabel = 'Primaria',
  subjectsLabel = 'asignaturas',
}: {
  curso: Curso;
  basePath?: string;
  levelLabel?: string;
  subjectsLabel?: string;
}) {
  const setCurso = useNavStore((state) => state.setCurso);

  return (
    <Link
      href={`${basePath}/${curso.id}`}
      onClick={() => setCurso(curso.id)}
      className={`group flex min-h-44 flex-col justify-between rounded-2xl border-2 p-6 shadow-sm transition duration-200 hover:scale-[1.03] hover:shadow-xl ${cursoStyles[curso.id]}`}
      aria-label={`Ir a ${curso.nombre}`}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="text-7xl font-black leading-none">{curso.id}º</span>
        <span className="rounded-full bg-white/80 p-2 shadow-sm transition group-hover:translate-x-1">
          <ChevronRight className="h-7 w-7" aria-hidden />
        </span>
      </div>
      <div>
        <p className="text-2xl font-extrabold">{levelLabel}</p>
        <p className="mt-1 text-base font-semibold opacity-75">
          {curso.asignaturas.length} {subjectsLabel}
        </p>
      </div>
    </Link>
  );
}
