import { notFound } from 'next/navigation';
import { asignaturaIcons } from '@/src/components/icons';
import Breadcrumb from '@/src/components/Breadcrumb';
import TemaAccordion from '@/src/components/TemaAccordion';
import { getAsignatura, getCurso } from '@/src/data/curriculum';

export default function AsignaturaTemasPage({
  cursoId,
  asignaturaId,
  basePath = '/repaso',
  homeHref = '/es',
  sectionLabel = 'Repaso',
  showLocalBreadcrumb = true,
  topicsDescription = 'temas de repaso organizados por currículo LOMLOE.',
}: {
  cursoId: string;
  asignaturaId: string;
  basePath?: string;
  homeHref?: string;
  sectionLabel?: string;
  showLocalBreadcrumb?: boolean;
  topicsDescription?: string;
}) {
  const curso = getCurso(cursoId);
  const asignatura = getAsignatura(cursoId, asignaturaId);

  if (!curso || !asignatura) {
    notFound();
  }

  const Icon = asignaturaIcons[asignatura.icono as keyof typeof asignaturaIcons];

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-950 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        {showLocalBreadcrumb ? (
          <Breadcrumb
            items={[
              { label: 'Inicio', href: homeHref },
              { label: sectionLabel, href: basePath },
              { label: curso.nombre, href: `${basePath}/${curso.id}` },
              { label: asignatura.nombre },
            ]}
          />
        ) : null}

        <header
          className="mb-8 overflow-hidden rounded-3xl p-7 text-white shadow-lg sm:p-9"
          style={{ backgroundColor: asignatura.color }}
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/20">
              <Icon className="h-12 w-12" aria-hidden />
            </span>
            <div>
              <p className="text-lg font-extrabold text-white/85">{curso.nombre}</p>
              <h1 className="text-4xl font-black tracking-normal sm:text-5xl">
                {asignatura.nombre}
              </h1>
              <p className="mt-2 text-lg font-semibold text-white/90">
                {asignatura.temas.length} {topicsDescription}
              </p>
            </div>
          </div>
        </header>

        <section className="space-y-4" aria-label={`Temas de ${asignatura.nombre}`}>
          {asignatura.temas.map((tema, index) => (
            <TemaAccordion
              key={tema.id}
              tema={tema}
              color={asignatura.color}
              defaultOpen={index === 0}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
