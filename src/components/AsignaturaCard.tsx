'use client';

import Image from 'next/image';
import Link from 'next/link';
import { asignaturaIcons, ChevronRight } from '@/src/components/icons';
import { useNavStore } from '@/src/store/useNavStore';
import type { Asignatura } from '@/src/types';

const kingdomConfig = {
  lengua: {
    image: '/mascots/loro.png',
    region: 'Bosque de las Palabras',
    bg: 'bg-green-50',
    gradient: 'from-green-500 to-emerald-600',
  },
  mates: {
    image: '/mascots/roo.png',
    region: 'Montañas de Números',
    bg: 'bg-blue-50',
    gradient: 'from-blue-500 to-purple-600',
  },
  naturales: {
    image: '/mascots/otto.png',
    region: 'Laboratorio Submarino',
    bg: 'bg-teal-50',
    gradient: 'from-teal-500 to-cyan-600',
  },
  sociales: {
    image: '/mascots/hugo.png',
    region: 'Ciudad del Tiempo',
    bg: 'bg-amber-50',
    gradient: 'from-amber-500 to-yellow-600',
  },
  ingles: {
    image: '/mascots/polly.png',
    region: 'Isla de los Idiomas',
    bg: 'bg-rose-50',
    gradient: 'from-red-500 to-orange-500',
  },
} as const;

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
  const kingdom = kingdomConfig[asignatura.id];

  return (
    <Link
      href={`${basePath}/${cursoId}/${asignatura.id}`}
      onClick={() => setAsignatura(asignatura.id)}
      className={`group relative flex min-h-72 flex-col overflow-hidden rounded-3xl border-2 border-transparent p-6 pb-4 shadow-sm transition duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:border-white hover:shadow-2xl ${kingdom.bg}`}
      style={{ boxShadow: `0 12px 32px ${asignatura.color}18` }}
      aria-label={`Ver temas de ${asignatura.nombre}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${kingdom.gradient} opacity-0 transition group-hover:opacity-10`} />
      <div className="relative mb-3 flex items-center justify-between">
        <span className={`rounded-full bg-gradient-to-r ${kingdom.gradient} px-3 py-1 text-xs font-black text-white`}>
          {kingdom.region}
        </span>
        <span className="rounded-full bg-white/80 p-2 shadow-sm">
          <Icon className="h-5 w-5" style={{ color: asignatura.color }} aria-hidden />
        </span>
      </div>

      <div className="relative mb-4 aspect-square w-full flex-1">
        <Image
          src={kingdom.image}
          alt={asignatura.nombre}
          fill
          className="object-contain drop-shadow-lg transition group-hover:scale-105"
          sizes="(min-width: 1024px) 260px, (min-width: 640px) 45vw, 80vw"
        />
      </div>

      <div className="relative">
        <h2 className="text-2xl font-black text-slate-900">{asignatura.nombre}</h2>
        <div className="mt-3 flex items-center justify-between gap-3">
        <span
          className="rounded-full px-3 py-1 text-sm font-extrabold text-white"
          style={{ backgroundColor: asignatura.color }}
        >
          {asignatura.temas.length} temas
        </span>
          <span className="flex items-center gap-1 text-sm font-black text-slate-600">
            Explorar
            <ChevronRight className="h-5 w-5 transition group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}
