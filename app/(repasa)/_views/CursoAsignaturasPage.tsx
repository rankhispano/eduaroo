import { notFound } from 'next/navigation';
import AsignaturaCard from '@/src/components/AsignaturaCard';
import Breadcrumb from '@/src/components/Breadcrumb';
import { getCurso } from '@/src/data/curriculum';

export default function CursoAsignaturasPage({
  cursoId,
  basePath = '/repaso',
  homeHref = '/es',
  sectionLabel = 'Repaso',
  showLocalBreadcrumb = true,
  selectedLabel = 'Curso seleccionado',
  chooseSubjectLabel = 'Elige una asignatura',
  description = 'Cada asignatura reúne los temas principales de repaso organizados para este curso.',
}: {
  cursoId: string;
  basePath?: string;
  homeHref?: string;
  sectionLabel?: string;
  showLocalBreadcrumb?: boolean;
  selectedLabel?: string;
  chooseSubjectLabel?: string;
  description?: string;
}) {
  const curso = getCurso(cursoId);

  if (!curso) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-950 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        {showLocalBreadcrumb ? (
          <Breadcrumb
            items={[
              { label: 'Inicio', href: homeHref },
              { label: sectionLabel, href: basePath },
              { label: curso.nombre },
            ]}
          />
        ) : null}

        <header className="mb-10">
          <p className="mb-2 text-lg font-extrabold text-blue-600">{selectedLabel}</p>
          <h1 className="text-4xl font-black tracking-normal sm:text-5xl">
            {curso.nombre} — {chooseSubjectLabel}
          </h1>
          <p className="mt-4 max-w-2xl text-lg font-semibold text-slate-600">
            {description}
          </p>
        </header>

        <section
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          aria-label={`Asignaturas de ${curso.nombre}`}
        >
          {curso.asignaturas.map((asignatura) => (
            <AsignaturaCard
              key={asignatura.id}
              cursoId={curso.id}
              asignatura={asignatura}
              basePath={basePath}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
