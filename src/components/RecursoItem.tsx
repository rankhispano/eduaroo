import { Clock, ExternalLink } from 'lucide-react';
import type { Recurso } from '@/src/types';
import RecursoTypeBadge from '@/src/components/RecursoTypeBadge';

export default function RecursoItem({ recurso }: { recurso: Recurso }) {
  return (
    <li className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
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
        target="_blank"
        rel="noreferrer"
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-base font-extrabold text-white transition hover:bg-slate-700"
      >
        Ir al recurso
        <ExternalLink className="h-5 w-5" aria-hidden />
      </a>
    </li>
  );
}
