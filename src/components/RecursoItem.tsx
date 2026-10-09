import { ArrowRight, Clock, ExternalLink } from 'lucide-react';
import type { Recurso } from '@/src/types';
import RecursoTypeBadge from '@/src/components/RecursoTypeBadge';

const actionLabel: Record<Recurso['tipo'], string> = {
  ejercicio: 'Practicar',
  juego: 'Jugar',
  video: 'Ver vídeo',
  lectura: 'Leer',
  ficha: 'Abrir ficha',
};

export default function RecursoItem({ recurso, color = '#4F46E5' }: { recurso: Recurso; color?: string }) {
  const isExternal = /^https?:\/\//.test(recurso.url);

  return (
    <li className="flex flex-col gap-4 rounded-2xl border-2 border-slate-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <RecursoTypeBadge tipo={recurso.tipo} />
          {recurso.duracion ? (
            <span className="inline-flex items-center gap-1 text-sm font-bold text-slate-500">
              <Clock className="h-4 w-4" aria-hidden />
              {recurso.duracion}
            </span>
          ) : null}
        </div>
        <h3 className="text-lg font-black text-slate-900">{recurso.titulo}</h3>
        {recurso.descripcion ? (
          <p className="mt-1 text-base text-slate-600">{recurso.descripcion}</p>
        ) : null}
      </div>
      <a
        href={recurso.url}
        {...(isExternal ? { target: '_blank', rel: 'noreferrer' } : {})}
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl px-6 py-3 text-lg font-black text-white transition hover:brightness-110 active:translate-y-1 active:shadow-none"
        // Oscurecido para que el texto blanco se lea también sobre el verde y el ámbar
        style={{ backgroundColor: `color-mix(in srgb, ${color} 70%, black)`, boxShadow: '0 4px 0 rgba(15, 23, 42, 0.3)' }}
      >
        {actionLabel[recurso.tipo]}
        {isExternal ? <ExternalLink className="h-5 w-5" aria-hidden /> : <ArrowRight className="h-5 w-5" aria-hidden />}
      </a>
    </li>
  );
}
