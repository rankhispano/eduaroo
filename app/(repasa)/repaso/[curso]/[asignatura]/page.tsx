import type { Metadata } from 'next';
import AsignaturaTemasPage from '@/app/(repasa)/_views/AsignaturaTemasPage';
import { getAsignatura, getCurso } from '@/src/data/curriculum';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ curso: string; asignatura: string }>;
}): Promise<Metadata> {
  const { curso, asignatura } = await params;
  const cursoData = getCurso(curso);
  const asignaturaData = getAsignatura(curso, asignatura);

  return {
    title:
      cursoData && asignaturaData
        ? `${asignaturaData.nombre} | ${cursoData.nombre}`
        : 'Asignatura no encontrada',
    description:
      cursoData && asignaturaData
        ? `Temas y recursos de ${asignaturaData.nombre} para ${cursoData.nombre}.`
        : undefined,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ curso: string; asignatura: string }>;
}) {
  const { curso, asignatura } = await params;
  return <AsignaturaTemasPage cursoId={curso} asignaturaId={asignatura} basePath="/repaso" />;
}
