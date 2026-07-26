'use client';

import Link from 'next/link';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-10">
      <section className="max-w-xl rounded-3xl bg-white p-8 text-center shadow-sm">
        <h1 className="text-3xl font-black text-slate-950">Curso o asignatura no disponible</h1>
        <p className="mt-3 text-lg font-semibold text-slate-600">
          Puede que la ruta no exista todavía. Vuelve al inicio para navegar desde el selector.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="rounded-xl bg-blue-600 px-5 py-3 font-extrabold text-white transition hover:bg-blue-700"
          >
            Reintentar
          </button>
          <Link
            href="/"
            className="rounded-xl bg-slate-100 px-5 py-3 font-extrabold text-slate-900 transition hover:bg-slate-200"
          >
            Volver al inicio
          </Link>
        </div>
      </section>
    </main>
  );
}
