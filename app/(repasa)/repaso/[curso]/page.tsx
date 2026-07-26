import type { Metadata } from 'next';
import CursoAsignaturasPage from '@/app/(repasa)/_views/CursoAsignaturasPage';
import { getCurso } from '@/src/data/curriculum';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ curso: string }>;
}): Promise<Metadata> {
  const { curso } = await params;
  const cursoData = getCurso(curso);

  return {
    title: cursoData ? cursoData.nombre : 'Curso no encontrado',
    description: cursoData
      ? `Asignaturas y recursos de repaso para ${cursoData.nombre}.`
      : undefined,
  };
}

export default async function Page({ params }: { params: Promise<{ curso: string }> }) {
  const { curso } = await params;
  return <CursoAsignaturasPage cursoId={curso} basePath="/repaso" />;
}
