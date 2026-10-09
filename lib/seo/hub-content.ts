// Textos de las páginas hub (curso y asignatura): se generan desde los datos del catálogo y del
// currículo oficial. Nada de claims sin base: cada cifra sale de content/activities o del RD 157/2022.
import type { CatalogAsignatura, CatalogCurso } from './catalog';
import { getLomloeSummary, LOMLOE_SOURCE } from './lomloe';
import type { SiteLocale } from './site';

const join = (items: string[], and: string) => (items.length <= 1 ? (items[0] ?? '') : `${items.slice(0, -1).join(', ')} ${and} ${items[items.length - 1]}`);

const cycleLabel = (locale: SiteLocale, cycle: number, grades: number[]) =>
    locale === 'es'
        ? `${['primer', 'segundo', 'tercer'][cycle - 1]} ciclo (${grades.map((g) => `${g}º`).join(' y ')})`
        : `cycle ${cycle} (years ${grades.join(' and ')})`;

export function formatDate(date: Date, locale: SiteLocale): string {
    return new Intl.DateTimeFormat(locale === 'es' ? 'es-ES' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Madrid' }).format(date);
}

const averageMinutes = (sets: { estimatedMinutes: number }[]) =>
    sets.length === 0 ? 9 : Math.round(sets.reduce((sum, s) => sum + s.estimatedMinutes, 0) / sets.length);

const nameEn: Record<string, string> = {
    lengua: 'Spanish Language',
    mates: 'Mathematics',
    naturales: 'Natural Sciences',
    sociales: 'Social Sciences',
    ingles: 'English',
};
export const subjectName = (a: CatalogAsignatura, locale: SiteLocale) => (locale === 'es' ? a.asignatura.nombre : (nameEn[a.asignatura.id] ?? a.asignatura.nombre));

// --- Curso ------------------------------------------------------------------------------------

export function cursoIntro(c: CatalogCurso, locale: SiteLocale): string[] {
    const n = c.grade;
    const withContent = c.asignaturas.filter((a) => a.published.length > 0);
    const minutes = averageMinutes(withContent.flatMap((a) => a.published.map((t) => t.set)));
    const subjects = join(withContent.map((a) => subjectName(a, locale)), locale === 'es' ? 'y' : 'and');

    if (locale === 'en') {
        return [
            `Here are the Primary ${n} revision exercises from Eduaroo, organised by subject: ${subjects}. There are ${c.publishedCount} topics with ${c.activityCount} activities to practise what is taught in class.`,
            `Each topic is a short session of about ${minutes} minutes. It starts with a summary of the key ideas, and after every answer the page explains why it is right or wrong, so mistakes become a chance to learn.`,
            'It is designed for families and teachers who want to revise or reinforce what has been covered at school: pick a single topic, or build a test by mixing several topics of one subject. There is no sign-up; progress is saved in the browser itself.',
        ];
    }
    return [
        `Aquí encontrarás los ejercicios de repaso de ${n}º de Primaria de Eduaroo, organizados por asignatura: ${subjects}. En total hay ${c.publishedCount} temas con ${c.activityCount} actividades para practicar lo que se trabaja en clase.`,
        `Cada tema es una sesión corta, de unos ${minutes} minutos. Empieza con un resumen de las ideas clave y, después de cada respuesta, se explica por qué es correcta o incorrecta, de modo que los errores sirven para aprender. Las actividades son variadas: elegir la respuesta, completar huecos, relacionar, ordenar o clasificar.`,
        'Está pensado para familias y docentes que quieren repasar o reforzar lo visto en el aula: se puede elegir un tema concreto o preparar un examen mezclando varios temas de una asignatura. No hace falta registrarse: el progreso se guarda en el propio navegador.',
    ];
}

// --- Asignatura -------------------------------------------------------------------------------

export function asignaturaIntro(c: CatalogCurso, a: CatalogAsignatura, locale: SiteLocale): string[] {
    const n = c.grade;
    const name = subjectName(a, locale);
    const minutes = averageMinutes(a.published.map((t) => t.set));
    const examples = join(a.published.slice(0, 3).map((t) => t.tema.nombre), locale === 'es' ? 'y' : 'and');
    const lomloe = getLomloeSummary(a.asignatura.id, n);

    if (locale === 'en') {
        return [
            `This page lists the ${a.published.length} ${name} topics for Primary ${n} that you can already practise on Eduaroo, including ${examples}, with ${a.activityCount} activities in total.`,
            `Every topic takes about ${minutes} minutes: a quick reminder of the key ideas, then activities with instant feedback and an explanation after each answer. Mistakes can be repeated at the end of the session.`,
            'To get the most out of it, start with the topic being covered in class, repeat it if some answers were wrong, and use “Prepare your test” when you want to mix several topics.',
            ...(lomloe ? [`The topics follow the LOMLOE evaluation criteria for ${lomloe.areaName} in ${cycleLabel(locale, lomloe.cycle, lomloe.cycleGrades)}.`] : []),
        ];
    }
    return [
        `En esta página tienes los ${a.published.length} temas de ${name} de ${n}º de Primaria que ya se pueden practicar en Eduaroo, entre ellos ${examples}, con ${a.activityCount} actividades en total.`,
        `Cada tema dura unos ${minutes} minutos: un recordatorio rápido de las ideas clave y después actividades con corrección inmediata y una explicación tras cada respuesta. Los errores se pueden repetir al final de la sesión.`,
        'Para sacarle partido, conviene empezar por el tema que se esté dando en clase, repetirlo si hay respuestas falladas y usar «Prepara tu examen» cuando se quieran mezclar varios temas.',
        ...(lomloe ? [`Los temas siguen los criterios de evaluación del currículo LOMLOE de ${lomloe.areaName} para el ${cycleLabel(locale, lomloe.cycle, lomloe.cycleGrades)} de Primaria.`] : []),
    ];
}

// --- Bloque "Qué se trabaja según la LOMLOE" ----------------------------------------------------

export interface LomloeBlockItem {
    subject: string;
    text: string;
}

export function lomloeItems(c: CatalogCurso, asignaturas: CatalogAsignatura[], locale: SiteLocale): LomloeBlockItem[] {
    return asignaturas.flatMap((a) => {
        const summary = getLomloeSummary(a.asignatura.id, c.grade);
        if (!summary) return [];
        const blocks = join(summary.blocks, locale === 'es' ? 'y' : 'and');
        const cycle = cycleLabel(locale, summary.cycle, summary.cycleGrades);
        const split =
            a.asignatura.id === 'naturales' || a.asignatura.id === 'sociales'
                ? locale === 'es'
                    ? ' Eduaroo separa este área en Ciencias Naturales y Ciencias Sociales.'
                    : ' Eduaroo splits this area into Natural Sciences and Social Sciences.'
                : '';
        return [
            {
                subject: subjectName(a, locale),
                text:
                    locale === 'es'
                        ? `Área oficial: ${summary.areaName}, ${cycle}. Bloques de saberes básicos: ${blocks}. El ciclo recoge ${summary.criteriaCount} criterios de evaluación.${split}`
                        : `Official area: ${summary.areaName}, ${cycle}. Basic knowledge blocks: ${blocks}. The cycle sets ${summary.criteriaCount} evaluation criteria.${split}`,
            },
        ];
    });
}

export const lomloeNote = (locale: SiteLocale) =>
    locale === 'es'
        ? {
              intro: `Resumen basado en el ${LOMLOE_SOURCE.shortName} (enseñanzas mínimas de la Educación Primaria). Cada comunidad autónoma desarrolla estas enseñanzas en su propio decreto, por lo que el detalle puede variar: consulta el de tu comunidad.`,
              linkLabel: `${LOMLOE_SOURCE.name} (BOE)`,
          }
        : {
              intro: `Summary based on ${LOMLOE_SOURCE.shortName} (minimum teaching requirements for Primary Education). Each autonomous community develops them in its own decree, so details may vary: check the one for your region.`,
              linkLabel: `${LOMLOE_SOURCE.name} (BOE)`,
          };
