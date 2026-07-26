import type { Metadata } from 'next';
import CursoCard from '@/src/components/CursoCard';
import { curriculum } from '@/src/data/curriculum';

export const metadata: Metadata = {
  title: 'Repaso por curso',
  description: 'Recursos de repaso de Educación Primaria organizados por curso, asignatura y tema.',
};

export default function RepasoHomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-indigo-50 px-5 py-8 text-slate-950 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex flex-col gap-8 rounded-3xl bg-white p-7 shadow-sm sm:p-9 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-8 inline-flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-black text-white">
                R
              </span>
              <span className="text-2xl font-black text-slate-950">Repasa Primaria</span>
            </div>
            <p className="mb-3 text-lg font-extrabold text-blue-600">Recursos LOMLOE</p>
            <h1 className="max-w-3xl text-4xl font-black tracking-normal sm:text-6xl">
              ¿Qué curso estás estudiando?
            </h1>
          </div>
          <p className="max-w-sm text-lg font-semibold text-slate-600">
            Entra por curso, elige asignatura y encuentra el tema que quieres repasar.
          </p>
        </header>

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Cursos de Primaria">
          {curriculum.map((curso) => (
            <CursoCard key={curso.id} curso={curso} basePath="/repaso" />
          ))}
        </section>

        <footer className="mt-12 rounded-2xl bg-white p-5 text-center text-base font-bold text-slate-500 shadow-sm">
          Recursos preparados para repasar según la LOMLOE
        </footer>
      </div>
    </main>
  );
}
