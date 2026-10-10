// Tipos del currículo LOMLOE (RD 157/2022) y de las actividades generadas.
// El catálogo oficial vive en lib/curriculum/lomloe/*.json (ver scripts/parse-rd157.py).

import type { AsignaturaId, CursoId } from '@/src/types';

// --- Catálogo LOMLOE ---

export type LomloeAreaId =
    | 'matematicas'
    | 'lengua-castellana'
    | 'conocimiento-medio'
    | 'lengua-extranjera';

export type LomloeCycle = 1 | 2 | 3;

export interface LomloeCompetency {
    id: string; // 'CE1'
    number: number;
    text: string;
    descriptors: string[]; // Descriptores del Perfil de salida: 'STEM1', 'CCL2'...
}

export interface LomloeCriterion {
    id: string; // '2.3'
    competency: string; // 'CE2'
    text: string;
}

export interface LomloeKnowledgeSection {
    title: string;
    items: string[];
}

export interface LomloeKnowledgeBlock {
    id: string; // 'A'
    title: string;
    sections: LomloeKnowledgeSection[];
}

export interface LomloeCycleData {
    cycle: LomloeCycle;
    grades: number[];
    criteria: LomloeCriterion[];
    basicKnowledge: LomloeKnowledgeBlock[];
}

export interface LomloeAreaCatalog {
    area: LomloeAreaId;
    name: string;
    source: string;
    sourceUrl: string;
    competencies: LomloeCompetency[];
    cycles: LomloeCycleData[];
}

// --- Actividades ---

export type ActivityType =
    | 'choice'
    | 'true-false'
    | 'fill-blank'
    | 'match'
    | 'classify'
    | 'order'
    | 'reading';

export type ActivityLocale = 'es' | 'en';

interface ActivityBase {
    id: string;
    type: ActivityType;
    prompt: string;
    explanation: string; // Feedback formativo tras responder
    hint?: string;
    lang?: 'es' | 'en'; // Idioma del contenido (para la lectura en voz alta)
    contentLang?: ActivityLocale; // Ejemplos y lecturas en español dentro de instrucciones en inglés
}

export interface ChoiceActivity extends ActivityBase {
    type: 'choice';
    options: string[];
    answer: number;
}

export interface TrueFalseActivity extends ActivityBase {
    type: 'true-false';
    answer: boolean;
}

export interface FillBlankActivity extends ActivityBase {
    type: 'fill-blank';
    sentence: string; // Contiene '___' donde va la respuesta
    options: string[];
    answer: number;
}

export interface MatchActivity extends ActivityBase {
    type: 'match';
    pairs: { left: string; right: string }[];
}

export interface ClassifyActivity extends ActivityBase {
    type: 'classify';
    categories: string[];
    items: { text: string; category: number }[];
}

export interface OrderActivity extends ActivityBase {
    type: 'order';
    items: string[]; // En el orden correcto
}

export interface ReadingActivity extends ActivityBase {
    type: 'reading';
    title: string;
    text: string;
    questions: { prompt: string; options: string[]; answer: number; explanation: string }[];
}

export type Activity =
    | ChoiceActivity
    | TrueFalseActivity
    | FillBlankActivity
    | MatchActivity
    | ClassifyActivity
    | OrderActivity
    | ReadingActivity;

export interface ActivitySetLomloe {
    area: LomloeAreaId;
    cycle: LomloeCycle;
    competencies: string[];
    criteria: string[];
    descriptors: string[];
    basicKnowledge: string[]; // 'A. Sentido numérico › Cantidad'
}

export interface ActivitySet {
    id: string;
    cursoId: CursoId;
    asignaturaId: AsignaturaId;
    temaId: string;
    temaNombre: string;
    title: string;
    summary: string;
    keyIdeas: string[]; // Microlección "Recuerda" antes de practicar
    lomloe: ActivitySetLomloe;
    activities: Activity[];
    meta: {
        generator: string;
        model: string;
        generatedAt: string;
        reviewed: boolean; // Pasa a true cuando un docente lo revisa
        translation?: {
            generator: string;
            model: string;
            translatedAt: string;
            sourceLocale: 'es';
            targetLocale: 'en';
            sourceHash: string;
            validation?: 'manual-review' | 'blind-solutions';
        };
    };
}

export interface ActivitySetSummary {
    key: string; // `${cursoId}/${asignaturaId}/${temaId}`
    cursoId: CursoId;
    asignaturaId: AsignaturaId;
    temaId: string;
    temaNombre: string;
    title: string;
    summary: string;
    activityCount: number;
    estimatedMinutes: number;
}
