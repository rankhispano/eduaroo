import type { AsignaturaId } from '@/src/types';
import type { LomloeAreaCatalog, LomloeAreaId, LomloeCycle } from './types';
import matematicas from './lomloe/matematicas.json';
import lenguaCastellana from './lomloe/lengua-castellana.json';
import conocimientoMedio from './lomloe/conocimiento-medio.json';
import lenguaExtranjera from './lomloe/lengua-extranjera.json';

export const LOMLOE_CATALOG = {
    matematicas,
    'lengua-castellana': lenguaCastellana,
    'conocimiento-medio': conocimientoMedio,
    'lengua-extranjera': lenguaExtranjera,
} as unknown as Record<LomloeAreaId, LomloeAreaCatalog>;

// Naturales y Sociales se desdoblan de Conocimiento del Medio: cada una
// trabaja un subconjunto de competencias específicas y bloques de saberes.
// Este mapa se duplica en scripts/generate-activities.mjs: mantenlos iguales.
export const ASIGNATURA_LOMLOE: Record<
    AsignaturaId,
    { area: LomloeAreaId; competencies?: string[]; blocks?: string[] }
> = {
    mates: { area: 'matematicas' },
    lengua: { area: 'lengua-castellana' },
    naturales: {
        area: 'conocimiento-medio',
        competencies: ['CE1', 'CE2', 'CE3', 'CE4', 'CE5', 'CE6'],
        blocks: ['A', 'B'],
    },
    sociales: {
        area: 'conocimiento-medio',
        competencies: ['CE1', 'CE2', 'CE5', 'CE6', 'CE7', 'CE8', 'CE9'],
        blocks: ['C'],
    },
    ingles: { area: 'lengua-extranjera' },
};

export function getCycleForGrade(grade: number): LomloeCycle {
    return Math.min(3, Math.max(1, Math.ceil(grade / 2))) as LomloeCycle;
}

export function getCriterion(area: LomloeAreaId, cycle: LomloeCycle, criterionId: string) {
    return LOMLOE_CATALOG[area].cycles
        .find((c) => c.cycle === cycle)
        ?.criteria.find((c) => c.id === criterionId);
}
