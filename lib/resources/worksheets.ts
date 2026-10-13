import { getActivitySets } from '@/content/activities/registry';
import { parseAsignaturaSlug, parseCursoSlug } from '@/lib/seo/slugs';
export function getWorksheetSummary(
    curso: string,
    asignatura: string,
    tema: string,
) {
    const grade = parseCursoSlug(curso);
    const subject = parseAsignaturaSlug(asignatura);
    return getActivitySets('es').find(
        (set) =>
            set.cursoId === grade &&
            set.asignaturaId === subject &&
            set.temaId === tema,
    );
}
export const summerTopics: Record<string, string[]> = {
    '1': [
        'mates/numeros-del-0-al-99',
        'mates/suma-sin-llevadas',
        'lengua/lectura-de-silabas',
        'lengua/mayusculas-y-signos-de-puntuacion',
    ],
    '2': [
        'mates/suma-con-llevadas',
        'mates/tablas-del-2-5-y-10',
        'lengua/lectura-comprensiva-de-textos-breves',
        'lengua/coma-y-punto',
    ],
    '3': [
        'mates/division-exacta-e-inexacta',
        'mates/fracciones',
        'lengua/el-texto-descriptivo',
        'lengua/silaba-tonica-y-atona',
    ],
    '4': [
        'mates/division-por-dos-cifras',
        'mates/fracciones-equivalentes',
        'lengua/ortografia-b-v-h-g-j',
        'lengua/personajes-espacio-y-tiempo',
    ],
    '5': [
        'mates/porcentajes',
        'mates/angulos-y-tipos',
        'lengua/texto-argumentativo-y-expositivo',
        'lengua/las-clases-de-palabras',
    ],
    '6': [
        'mates/numeros-racionales',
        'mates/porcentajes-calculo-y-aplicaciones',
        'lengua/el-texto-argumentativo-tesis-y-argumentos',
        'lengua/ortografia-completa',
    ],
};
