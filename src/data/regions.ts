import type { AsignaturaId } from '@/src/types';

// Cada asignatura es una región del mundo de Roo, con su mascota
export const REGIONS: Record<
  AsignaturaId,
  { region: string; mascot: string; image: string; bg: string; gradient: string }
> = {
  lengua: {
    region: 'Bosque de las Palabras',
    mascot: 'Loro Literato',
    image: '/mascots/badges/loro.jpg',
    bg: 'bg-green-50',
    gradient: 'from-green-500 to-emerald-600',
  },
  mates: {
    region: 'Montañas de Números',
    mascot: 'Roo el Calculador',
    image: '/mascots/badges/roo.jpg',
    bg: 'bg-blue-50',
    gradient: 'from-blue-500 to-purple-600',
  },
  naturales: {
    region: 'Laboratorio Submarino',
    mascot: 'Otto el Científico',
    image: '/mascots/badges/otto.jpg',
    bg: 'bg-teal-50',
    gradient: 'from-teal-500 to-cyan-600',
  },
  sociales: {
    region: 'Ciudad del Tiempo',
    mascot: 'Hugo el Historiador',
    image: '/mascots/badges/hugo.jpg',
    bg: 'bg-amber-50',
    gradient: 'from-amber-500 to-yellow-600',
  },
  ingles: {
    region: 'Isla de los Idiomas',
    mascot: 'Polly Políglota',
    image: '/mascots/badges/polly.jpg',
    bg: 'bg-rose-50',
    gradient: 'from-red-500 to-orange-500',
  },
};

export const MASCOTS = [
  { id: 'roo', name: 'Roo', image: '/mascots/badges/roo.jpg' },
  { id: 'loro', name: 'Loro', image: '/mascots/badges/loro.jpg' },
  { id: 'otto', name: 'Otto', image: '/mascots/badges/otto.jpg' },
  { id: 'hugo', name: 'Hugo', image: '/mascots/badges/hugo.jpg' },
  { id: 'polly', name: 'Polly', image: '/mascots/badges/polly.jpg' },
] as const;

export type MascotId = (typeof MASCOTS)[number]['id'];

export function mascotImage(id: string) {
  return MASCOTS.find((m) => m.id === id)?.image ?? MASCOTS[0].image;
}
