'use client';

import { useState } from 'react';
import { ChevronDown, PlusCircle } from 'lucide-react';
import type { Tema } from '@/src/types';
import RecursoItem from '@/src/components/RecursoItem';

export default function TemaAccordion({
  tema,
  color,
  defaultOpen = false,
}: {
  tema: Tema;
  color: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = `tema-${tema.id}`;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-slate-50"
      >
        <div className="flex min-w-0 items-center gap-4">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg font-black text-white"
            style={{ backgroundColor: color }}
          >
            {tema.recursos.length}
          </span>
          <div className="min-w-0">
            <h2 className="text-xl font-black text-slate-900">{tema.nombre}</h2>
            <p className="text-sm font-bold text-slate-500">
              {tema.recursos.length === 1
                ? '1 recurso disponible'
                : `${tema.recursos.length} recursos disponibles`}
            </p>
          </div>
        </div>
        <ChevronDown
          className={`h-7 w-7 shrink-0 text-slate-400 transition ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      {open ? (
        <div id={panelId} className="border-t border-slate-100 bg-slate-50 p-5">
          {tema.recursos.length > 0 ? (
            <ul className="space-y-3">
              {tema.recursos.map((recurso) => (
                <RecursoItem key={recurso.id} recurso={recurso} />
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-slate-300 bg-white p-5 sm:flex-row sm:items-center">
              <PlusCircle className="h-6 w-6 shrink-0 text-slate-400" aria-hidden />
              <div>
                <p className="font-black text-slate-800">Recursos pendientes de añadir</p>
                <p className="text-sm font-semibold text-slate-500">
                  Añade ejercicios, vídeos, fichas, juegos o lecturas en `src/data/curriculum.ts`.
                </p>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}
