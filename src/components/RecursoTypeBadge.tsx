import type { Recurso } from '@/src/types';
import { recursoIcons } from '@/src/components/icons';

const tipoBadge = {
  ejercicio: {
    label: 'Ejercicio',
    className: 'bg-blue-100 text-blue-700 ring-blue-200',
    icono: 'PenLine',
  },
  video: {
    label: 'Vídeo',
    className: 'bg-red-100 text-red-700 ring-red-200',
    icono: 'PlayCircle',
  },
  ficha: {
    label: 'Ficha',
    className: 'bg-green-100 text-green-700 ring-green-200',
    icono: 'FileText',
  },
  juego: {
    label: 'Juego',
    className: 'bg-purple-100 text-purple-700 ring-purple-200',
    icono: 'Gamepad2',
  },
  lectura: {
    label: 'Lectura',
    className: 'bg-amber-100 text-amber-800 ring-amber-200',
    icono: 'BookMarked',
  },
} satisfies Record<
  Recurso['tipo'],
  { label: string; className: string; icono: keyof typeof recursoIcons }
>;

export default function RecursoTypeBadge({ tipo }: { tipo: Recurso['tipo'] }) {
  const badge = tipoBadge[tipo];
  const Icon = recursoIcons[badge.icono];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-extrabold ring-1 ${badge.className}`}
    >
      <Icon className="h-4 w-4" aria-hidden />
      {badge.label}
    </span>
  );
}
