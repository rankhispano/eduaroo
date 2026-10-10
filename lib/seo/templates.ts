// Plantillas de title y description generadas desde los datos (curso, asignatura, tema).
// Reglas: title ≤ 60 caracteres (con marca si cabe), description 130–155, únicas por URL,
// sin relleno de palabras clave. "LOMLOE" solo donde es cierto: los bloques de actividades se
// generan a partir de los criterios de evaluación del RD 157/2022 (currículo LOMLOE de Primaria).

import type { CatalogAsignatura, CatalogCurso } from './catalog';
import { defaultDescription, finalTitle, TITLE_MAX } from './metadata';
import type { SiteLocale } from './site';

export const DESCRIPTION_MIN = 130;
export const DESCRIPTION_MAX = 155;

export interface SeoText {
    title: string;
    description: string;
}

const sentence = (text: string) => (/[.!?…]$/.test(text.trim()) ? text.trim() : `${text.trim()}.`);

/**
 * Elige la primera description candidata (de más rica a más simple) que cae en el rango
 * 130–155. Si ninguna encaja, la más larga que no pase de 155 o, como último recurso, la
 * primera recortada en el último límite de palabra.
 */
export function pickDescription(candidates: string[]): string {
    const inRange = candidates.find((c) => c.length >= DESCRIPTION_MIN && c.length <= DESCRIPTION_MAX);
    if (inRange) return inRange;
    const fitting = candidates.filter((c) => c.length <= DESCRIPTION_MAX).sort((x, y) => y.length - x.length)[0];
    if (fitting) return fitting;
    const cut = candidates[0].slice(0, DESCRIPTION_MAX - 1);
    return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}

/** Combina cabeceras y colas (de más a menos ricas) en candidatos ordenados */
const combine = (heads: string[], tails: string[]) =>
    heads.flatMap((head) => tails.map((tail) => [sentence(head), tail && sentence(tail)].filter(Boolean).join(' ')));

/** Primer título candidato cuyo resultado final (con marca si cabe) no supera 60 caracteres */
export function fitTitle(candidates: string[]): string {
    return candidates.find((c) => finalTitle(c).length <= TITLE_MAX) ?? candidates[candidates.length - 1];
}

const join = (items: string[]) => (items.length <= 1 ? (items[0] ?? '') : `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`);

// --- Español -----------------------------------------------------------------------------

const es = {
    home: (): SeoText => ({
        title: 'Eduaroo | Recursos de repaso de Primaria LOMLOE, 1º a 6º',
        description: defaultDescription,
    }),

    cursos: (): SeoText => ({
        title: 'Repaso de Primaria por cursos: de 1º a 6º según la LOMLOE',
        description:
            'Elige curso, de 1º a 6º de Primaria, y repasa Lengua, Matemáticas, Naturales, Sociales e Inglés con ejercicios que se corrigen al momento, según la LOMLOE.',
    }),

    curso: (c: CatalogCurso): SeoText => {
        const n = c.grade;
        const subjects = c.asignaturas.filter((a) => a.published.length > 0).map((a) => a.asignatura.nombre);
        return {
            title: `Repaso de ${n}º de Primaria LOMLOE: ejercicios online`,
            description: pickDescription(
                combine(
                    [`Ejercicios de repaso de ${n}º de Primaria con corrección inmediata: ${join(subjects)}`, `Ejercicios de repaso de ${n}º de Primaria con corrección inmediata`],
                    [`${c.publishedCount} temas y ${c.activityCount} actividades según la LOMLOE. Practica gratis`, `${c.publishedCount} temas según la LOMLOE. Practica gratis`, 'Según la LOMLOE. Practica gratis', ''],
                ),
            ),
        };
    },

    asignatura: (c: CatalogCurso, a: CatalogAsignatura): SeoText => {
        const n = c.grade;
        const topics = a.published.slice(0, 3).map((t) => t.tema.nombre);
        return {
            title: `${a.asignatura.nombre} ${n}º de Primaria: ejercicios de repaso`,
            description: pickDescription(
                combine(
                    [3, 2, 1, 0].map((k) =>
                        k > 0
                            ? `Repasa ${a.asignatura.nombre} de ${n}º de Primaria con ${a.published.length} temas, entre ellos ${join(topics.slice(0, k))}`
                            : `Repasa ${a.asignatura.nombre} de ${n}º de Primaria con ${a.published.length} temas`,
                    ),
                    [`${a.activityCount} actividades con corrección inmediata según la LOMLOE. Practica gratis`, `${a.activityCount} actividades con corrección inmediata según la LOMLOE`, 'Practica gratis según la LOMLOE', 'Practica gratis'],
                ),
            ),
        };
    },

    tema: (c: CatalogCurso, a: CatalogAsignatura, temaNombre: string, summary: string, activityCount: number): SeoText => ({
        title: fitTitle([
            `${temaNombre} – ${a.asignatura.nombre} ${c.grade}º Primaria`,
            `${temaNombre} – ${a.asignatura.nombre} ${c.grade}º`,
            `${temaNombre} (${c.grade}º Primaria)`,
            `${temaNombre} – ${c.grade}º Primaria`,
            temaNombre,
        ]),
        description: pickDescription(
            combine(
                [summary],
                [
                    `${activityCount} actividades de ${a.asignatura.nombre} de ${c.grade}º de Primaria con corrección inmediata. Practica gratis`,
                    `${activityCount} actividades de ${a.asignatura.nombre} de ${c.grade}º de Primaria con corrección inmediata`,
                    `${activityCount} actividades de ${c.grade}º de Primaria con corrección inmediata. Practica gratis`,
                    `${activityCount} actividades con corrección inmediata. Practica gratis`,
                    `${activityCount} actividades con corrección inmediata`,
                    'Practica gratis',
                    '',
                ],
            ),
        ),
    }),

    examen: (c: CatalogCurso, a: CatalogAsignatura): SeoText => ({
        title: `Prepara tu examen de ${a.asignatura.nombre} ${c.grade}º de Primaria`,
        description: `Elige los temas de ${a.asignatura.nombre} de ${c.grade}º de Primaria que entran en tu examen y repásalos de una sola vez con ejercicios que se corrigen al momento.`,
    }),
};

const SUBJECTS_EN: Record<string, string> = {
    lengua: 'Spanish Language',
    mates: 'Mathematics',
    naturales: 'Natural Sciences',
    sociales: 'Social Sciences',
    ingles: 'English',
};
const subjectEn = (a: CatalogAsignatura) => SUBJECTS_EN[a.asignatura.id] ?? a.asignatura.nombre;

// --- Inglés (versión noindex mientras no haya traducción completa) ---------------------------

const en = {
    home: (): SeoText => ({
        title: 'Eduaroo | Spanish Primary School Revision, Years 1–6',
        description:
            'Revision exercises and activities for Spanish primary school (years 1 to 6), aligned with the LOMLOE curriculum. Practise by playing, free and with no sign-up.',
    }),
    cursos: (): SeoText => ({
        title: 'Primary School Revision by Year, 1 to 6 (LOMLOE)',
        description:
            'Pick a year from Primary 1 to Primary 6 and revise Spanish, Maths, Natural Science, Social Science and English with exercises that are marked straight away.',
    }),
    curso: (c: CatalogCurso): SeoText => ({
        title: `Primary ${c.grade} Revision (LOMLOE): Online Exercises`,
        description: pickDescription(
            combine(
                [`Revision exercises for Primary ${c.grade} in Spain with instant feedback`],
                [`${c.publishedCount} topics and ${c.activityCount} activities aligned with the LOMLOE curriculum. Free, no sign-up`, `${c.publishedCount} topics aligned with the LOMLOE curriculum. Free`, ''],
            ),
        ),
    }),
    asignatura: (c: CatalogCurso, a: CatalogAsignatura): SeoText => ({
        title: `${subjectEn(a)} Primary ${c.grade}: Revision Exercises`,
        description: pickDescription(
            combine(
                [`Revise ${subjectEn(a)} for Primary ${c.grade} in Spain with ${a.published.length} topics and instant feedback`],
                [`${a.activityCount} activities aligned with the LOMLOE curriculum. Practise for free`, `${a.activityCount} activities aligned with the LOMLOE curriculum`, 'Practise for free', ''],
            ),
        ),
    }),
    tema: (c: CatalogCurso, a: CatalogAsignatura, temaNombre: string, summary: string, activityCount: number): SeoText => ({
        title: `${temaNombre} – ${subjectEn(a)} Primary ${c.grade}`,
        description: pickDescription(
            combine([summary], [`${activityCount} activities with instant feedback for Primary ${c.grade}. Practise for free`, `${activityCount} activities with instant feedback`, '']),
        ),
    }),
    examen: (c: CatalogCurso, a: CatalogAsignatura): SeoText => ({
        title: `Get ready for your ${subjectEn(a)} test, Primary ${c.grade}`,
        description: `Choose the ${subjectEn(a)} topics for your Primary ${c.grade} test and revise them all in one go with exercises that are marked straight away.`,
    }),
};

export const templates = { es, en } satisfies Record<SiteLocale, unknown>;
