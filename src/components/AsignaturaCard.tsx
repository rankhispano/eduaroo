'use client';

import Image from 'next/image';
import Link from 'next/link';
import { asignaturaIcons, ChevronRight } from '@/src/components/icons';
import { useNavStore } from '@/src/store/useNavStore';
import type { Asignatura } from '@/src/types';
import { REGIONS } from '@/src/data/regions';


export default function AsignaturaCard({
  cursoId,
  asignatura,
  basePath = '/repaso',
}: {
  cursoId: string;
  asignatura: Asignatura;
  basePath?: string;
}) {
  const setAsignatura = useNavStore((state) => state.setAsignatura);
  const Icon = asignaturaIcons[asignatura.icono as keyof typeof asignaturaIcons];
  const kingdom = REGIONS[asignatura.id];

  return (
    <Link
      href={`${basePath}/${cursoId}/${asignatura.id}`}
      onClick={() => setAsignatura(asignatura.id)}
      className={`group relative flex items-center gap-4 overflow-hidden rounded-3xl border-2 border-transparent p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-white hover:shadow-2xl sm:flex-col sm:items-stretch sm:gap-0 sm:p-6 sm:pb-5 ${kingdom.bg}`}
      style={{ boxShadow: `0 12px 32px ${asignatura.color}18` }}
      aria-label={`Ver temas de ${asignatura.nombre}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${kingdom.gradient} opacity-0 transition group-hover:opacity-10`} />
      <div className="relative mb-4 hidden items-center justify-between sm:flex">
        <span className={`rounded-full bg-gradient-to-r ${kingdom.gradient} px-3 py-1 text-xs font-black text-white`}>
          {kingdom.region}
        </span>
        <span className="rounded-full bg-white/80 p-2 shadow-sm">
          <Icon className="h-5 w-5" style={{ color: asignatura.color }} aria-hidden />
        </span>
      </div>

      <div
        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-4 bg-white shadow-md transition group-hover:scale-105 sm:mx-auto sm:mb-5 sm:h-44 sm:w-44 sm:border-[6px]"
        style={{ borderColor: asignatura.color }}
      >
        <Image
          src={kingdom.image}
          alt=""
          fill
          className="object-cover"
          sizes="(min-width: 640px) 176px, 80px"
        />
      </div>

      <div className="relative min-w-0 flex-1">
        <p className="mb-1 text-xs font-black uppercase tracking-wide sm:hidden" style={{ color: asignatura.color }}>
          {kingdom.region}
        </p>
        <h2 className="text-xl font-black text-slate-900 sm:text-2xl">{asignatura.nombre}</h2>
        <div className="mt-2 flex items-center justify-between gap-3 sm:mt-3">
          <span
            className="rounded-full px-3 py-1 text-sm font-extrabold text-white"
            style={{ backgroundColor: asignatura.color }}
          >
            {asignatura.temas.length} temas
          </span>
          <span className="flex items-center gap-1 text-sm font-black text-slate-600">
            <span className="hidden sm:inline">Explorar</span>
            <ChevronRight className="h-5 w-5 transition group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}
