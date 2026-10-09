// Resumen de qué marca el currículo oficial (RD 157/2022) para una asignatura y curso.
// Los datos salen del catálogo oficial ya incluido en lib/curriculum/lomloe/*.json
// (generado con scripts/parse-rd157.py a partir del texto del BOE): aquí no se inventa nada.
import { ASIGNATURA_LOMLOE, LOMLOE_CATALOG, getCycleForGrade } from '@/lib/curriculum/lomloe';
import type { LomloeCycle } from '@/lib/curriculum/types';

export interface LomloeSummary {
    areaName: string;
    cycle: LomloeCycle;
    cycleGrades: number[];
    /** Títulos de los bloques de saberes básicos del ciclo, sin la letra inicial */
    blocks: string[];
    criteriaCount: number;
    competencyCount: number;
}

export const LOMLOE_SOURCE = {
    name: 'Real Decreto 157/2022, de 1 de marzo, por el que se establecen la ordenación y las enseñanzas mínimas de la Educación Primaria',
    shortName: 'Real Decreto 157/2022',
    url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2022-3296',
};

// Algunos títulos oficiales son muy largos: se muestra solo la parte que nombra el bloque
const shortBlockTitle = (title: string) => title.replace(/^[A-Z]\.\s*/, '').split(' en el marco')[0];

export function getLomloeSummary(asignaturaId: string, grade: number): LomloeSummary | undefined {
    const mapping = ASIGNATURA_LOMLOE[asignaturaId as keyof typeof ASIGNATURA_LOMLOE];
    if (!mapping) return undefined;
    const area = LOMLOE_CATALOG[mapping.area];
    const cycle = getCycleForGrade(grade);
    const data = area.cycles.find((c) => c.cycle === cycle);
    if (!data) return undefined;

    const blocks = data.basicKnowledge.filter((b) => !mapping.blocks || mapping.blocks.includes(b.id));
    const competencies = area.competencies.filter((c) => !mapping.competencies || mapping.competencies.includes(c.id));
    return {
        areaName: area.name,
        cycle,
        cycleGrades: data.grades,
        blocks: blocks.map((b) => shortBlockTitle(b.title)),
        criteriaCount: data.criteria.filter((c) => competencies.some((comp) => comp.id === c.competency)).length,
        competencyCount: competencies.length,
    };
}
