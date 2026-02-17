// Programming Lessons Data for Eduaroo
// 4 Sections × 60 lessons = 240 total lessons

import { MicroLesson, LearningUnit, LessonType } from './microLessonSystem';
import { SECTION_2_LESSONS } from './programmingLessonsS2';
import { SECTION_3_LESSONS } from './programmingLessonsS3';
import { SECTION_4_LESSONS } from './programmingLessonsS4';

// Helper to create a programming lesson compactly
export function pLesson(
    sectionId: string,
    order: number,
    type: LessonType,
    titleKey: string,
    descriptionKey: string,
    challengeKey: string,
    hintKey: string,
    requiredBlocks: string[],
    duration: number = 5,
    exercises: number = 4,
    xp: number = 20,
    stars: number = 2,
): MicroLesson {
    return {
        id: `prog_${sectionId}_l${order}`,
        unitId: `prog_${sectionId}`,
        order,
        type,
        titleKey,
        descriptionKey,
        durationMinutes: duration,
        exerciseCount: exercises,
        xpReward: xp,
        starsReward: stars,
        status: 'available',
        challengeKey,
        hintKey,
        requiredBlocks,
    };
}

// ─────────────────────────────────────────────
// SECTION 1: EL EXPLORADOR (Secuenciación)
// ─────────────────────────────────────────────
export const SECTION_1_LESSONS: MicroLesson[] = [
    // Fase 1: Primeros pasos y la Rejilla (1-10)
    pLesson('s1', 1, 'lesson', 'Lessons.programming.s1.l1.title', 'Lessons.programming.s1.l1.description', 'Lessons.programming.s1.l1.challenge', 'Lessons.programming.s1.l1.hint', ['mover_derecha'], 3, 2, 10, 1),
    pLesson('s1', 2, 'lesson', 'Lessons.programming.s1.l2.title', 'Lessons.programming.s1.l2.description', 'Lessons.programming.s1.l2.challenge', 'Lessons.programming.s1.l2.hint', ['mover_izquierda'], 3, 2, 10, 1),
    pLesson('s1', 3, 'lesson', 'Lessons.programming.s1.l3.title', 'Lessons.programming.s1.l3.description', 'Lessons.programming.s1.l3.challenge', 'Lessons.programming.s1.l3.hint', ['mover_derecha'], 3, 3, 15, 1),
    pLesson('s1', 4, 'lesson', 'Lessons.programming.s1.l4.title', 'Lessons.programming.s1.l4.description', 'Lessons.programming.s1.l4.challenge', 'Lessons.programming.s1.l4.hint', ['mover_arriba'], 3, 2, 10, 1),
    pLesson('s1', 5, 'lesson', 'Lessons.programming.s1.l5.title', 'Lessons.programming.s1.l5.description', 'Lessons.programming.s1.l5.challenge', 'Lessons.programming.s1.l5.hint', ['mover_abajo'], 3, 2, 10, 1),
    pLesson('s1', 6, 'practice', 'Lessons.programming.s1.l6.title', 'Lessons.programming.s1.l6.description', 'Lessons.programming.s1.l6.challenge', 'Lessons.programming.s1.l6.hint', ['mover_derecha', 'mover_arriba'], 4, 4, 20, 2),
    pLesson('s1', 7, 'practice', 'Lessons.programming.s1.l7.title', 'Lessons.programming.s1.l7.description', 'Lessons.programming.s1.l7.challenge', 'Lessons.programming.s1.l7.hint', ['mover_derecha', 'mover_arriba', 'mover_abajo'], 4, 4, 20, 2),
    pLesson('s1', 8, 'practice', 'Lessons.programming.s1.l8.title', 'Lessons.programming.s1.l8.description', 'Lessons.programming.s1.l8.challenge', 'Lessons.programming.s1.l8.hint', ['mover_derecha', 'mover_arriba', 'mover_izquierda', 'mover_abajo'], 5, 4, 25, 2),
    pLesson('s1', 9, 'lesson', 'Lessons.programming.s1.l9.title', 'Lessons.programming.s1.l9.description', 'Lessons.programming.s1.l9.challenge', 'Lessons.programming.s1.l9.hint', ['borrar_todo'], 3, 2, 10, 1),
    pLesson('s1', 10, 'challenge', 'Lessons.programming.s1.l10.title', 'Lessons.programming.s1.l10.description', 'Lessons.programming.s1.l10.challenge', 'Lessons.programming.s1.l10.hint', ['mover_derecha', 'mover_arriba', 'mover_abajo'], 5, 5, 30, 3),

    // Fase 2: El Artista / La Pluma (11-20)
    pLesson('s1', 11, 'lesson', 'Lessons.programming.s1.l11.title', 'Lessons.programming.s1.l11.description', 'Lessons.programming.s1.l11.challenge', 'Lessons.programming.s1.l11.hint', ['bajar_lapiz', 'mover_derecha'], 4, 3, 15, 1),
    pLesson('s1', 12, 'lesson', 'Lessons.programming.s1.l12.title', 'Lessons.programming.s1.l12.description', 'Lessons.programming.s1.l12.challenge', 'Lessons.programming.s1.l12.hint', ['subir_lapiz', 'mover_derecha'], 4, 3, 15, 1),
    pLesson('s1', 13, 'practice', 'Lessons.programming.s1.l13.title', 'Lessons.programming.s1.l13.description', 'Lessons.programming.s1.l13.challenge', 'Lessons.programming.s1.l13.hint', ['bajar_lapiz', 'subir_lapiz', 'mover_derecha'], 5, 4, 20, 2),
    pLesson('s1', 14, 'lesson', 'Lessons.programming.s1.l14.title', 'Lessons.programming.s1.l14.description', 'Lessons.programming.s1.l14.challenge', 'Lessons.programming.s1.l14.hint', ['color_rojo', 'bajar_lapiz', 'mover_derecha'], 4, 3, 15, 1),
    pLesson('s1', 15, 'lesson', 'Lessons.programming.s1.l15.title', 'Lessons.programming.s1.l15.description', 'Lessons.programming.s1.l15.challenge', 'Lessons.programming.s1.l15.hint', ['grosor', 'bajar_lapiz', 'mover_derecha'], 4, 3, 15, 1),
    pLesson('s1', 16, 'practice', 'Lessons.programming.s1.l16.title', 'Lessons.programming.s1.l16.description', 'Lessons.programming.s1.l16.challenge', 'Lessons.programming.s1.l16.hint', ['color_rojo', 'color_verde', 'color_azul', 'bajar_lapiz', 'subir_lapiz', 'mover_derecha'], 5, 4, 20, 2),
    pLesson('s1', 17, 'practice', 'Lessons.programming.s1.l17.title', 'Lessons.programming.s1.l17.description', 'Lessons.programming.s1.l17.challenge', 'Lessons.programming.s1.l17.hint', ['bajar_lapiz', 'color_azul', 'mover_derecha', 'mover_arriba', 'mover_izquierda', 'mover_abajo'], 6, 5, 25, 2),
    pLesson('s1', 18, 'practice', 'Lessons.programming.s1.l18.title', 'Lessons.programming.s1.l18.description', 'Lessons.programming.s1.l18.challenge', 'Lessons.programming.s1.l18.hint', ['bajar_lapiz', 'mover_abajo', 'mover_derecha'], 5, 4, 20, 2),
    pLesson('s1', 19, 'practice', 'Lessons.programming.s1.l19.title', 'Lessons.programming.s1.l19.description', 'Lessons.programming.s1.l19.challenge', 'Lessons.programming.s1.l19.hint', ['bajar_lapiz', 'subir_lapiz', 'mover_derecha', 'mover_abajo', 'mover_izquierda'], 6, 6, 25, 2),
    pLesson('s1', 20, 'challenge', 'Lessons.programming.s1.l20.title', 'Lessons.programming.s1.l20.description', 'Lessons.programming.s1.l20.challenge', 'Lessons.programming.s1.l20.hint', ['bajar_lapiz', 'subir_lapiz', 'color_rojo', 'color_azul', 'mover_derecha', 'mover_abajo'], 7, 6, 35, 3),

    // Fase 3: Giros y Grados (21-30)
    pLesson('s1', 21, 'lesson', 'Lessons.programming.s1.l21.title', 'Lessons.programming.s1.l21.description', 'Lessons.programming.s1.l21.challenge', 'Lessons.programming.s1.l21.hint', ['girar_derecha_90'], 4, 3, 15, 1),
    pLesson('s1', 22, 'lesson', 'Lessons.programming.s1.l22.title', 'Lessons.programming.s1.l22.description', 'Lessons.programming.s1.l22.challenge', 'Lessons.programming.s1.l22.hint', ['girar_izquierda_90'], 4, 3, 15, 1),
    pLesson('s1', 23, 'practice', 'Lessons.programming.s1.l23.title', 'Lessons.programming.s1.l23.description', 'Lessons.programming.s1.l23.challenge', 'Lessons.programming.s1.l23.hint', ['bajar_lapiz', 'mover_derecha', 'girar_derecha_90', 'mover_abajo'], 5, 4, 20, 2),
    pLesson('s1', 24, 'practice', 'Lessons.programming.s1.l24.title', 'Lessons.programming.s1.l24.description', 'Lessons.programming.s1.l24.challenge', 'Lessons.programming.s1.l24.hint', ['bajar_lapiz', 'subir_lapiz', 'girar_derecha_90', 'girar_izquierda_90'], 5, 5, 25, 2),
    pLesson('s1', 25, 'lesson', 'Lessons.programming.s1.l25.title', 'Lessons.programming.s1.l25.description', 'Lessons.programming.s1.l25.challenge', 'Lessons.programming.s1.l25.hint', ['girar_45'], 4, 3, 15, 1),
    pLesson('s1', 26, 'practice', 'Lessons.programming.s1.l26.title', 'Lessons.programming.s1.l26.description', 'Lessons.programming.s1.l26.challenge', 'Lessons.programming.s1.l26.hint', ['bajar_lapiz', 'mover_derecha', 'girar_derecha_90'], 5, 5, 25, 2),
    pLesson('s1', 27, 'practice', 'Lessons.programming.s1.l27.title', 'Lessons.programming.s1.l27.description', 'Lessons.programming.s1.l27.challenge', 'Lessons.programming.s1.l27.hint', ['bajar_lapiz', 'girar_derecha_90', 'girar_izquierda_90', 'girar_45'], 6, 6, 30, 2),
    pLesson('s1', 28, 'practice', 'Lessons.programming.s1.l28.title', 'Lessons.programming.s1.l28.description', 'Lessons.programming.s1.l28.challenge', 'Lessons.programming.s1.l28.hint', ['mover_derecha', 'mover_arriba', 'girar_derecha_90'], 5, 5, 25, 2),
    pLesson('s1', 29, 'practice', 'Lessons.programming.s1.l29.title', 'Lessons.programming.s1.l29.description', 'Lessons.programming.s1.l29.challenge', 'Lessons.programming.s1.l29.hint', ['mover_derecha', 'mover_arriba', 'mover_abajo', 'girar_derecha_90'], 6, 5, 25, 2),
    pLesson('s1', 30, 'challenge', 'Lessons.programming.s1.l30.title', 'Lessons.programming.s1.l30.description', 'Lessons.programming.s1.l30.challenge', 'Lessons.programming.s1.l30.hint', ['mover_derecha', 'mover_arriba', 'mover_abajo', 'mover_izquierda', 'girar_derecha_90', 'girar_izquierda_90'], 7, 6, 35, 3),

    // Fase 4: Disfraces y Apariencia (31-40)
    pLesson('s1', 31, 'lesson', 'Lessons.programming.s1.l31.title', 'Lessons.programming.s1.l31.description', 'Lessons.programming.s1.l31.challenge', 'Lessons.programming.s1.l31.hint', ['decir'], 3, 2, 10, 1),
    pLesson('s1', 32, 'lesson', 'Lessons.programming.s1.l32.title', 'Lessons.programming.s1.l32.description', 'Lessons.programming.s1.l32.challenge', 'Lessons.programming.s1.l32.hint', ['pensar'], 3, 2, 10, 1),
    pLesson('s1', 33, 'lesson', 'Lessons.programming.s1.l33.title', 'Lessons.programming.s1.l33.description', 'Lessons.programming.s1.l33.challenge', 'Lessons.programming.s1.l33.hint', ['cambiar_disfraz'], 4, 3, 15, 1),
    pLesson('s1', 34, 'lesson', 'Lessons.programming.s1.l34.title', 'Lessons.programming.s1.l34.description', 'Lessons.programming.s1.l34.challenge', 'Lessons.programming.s1.l34.hint', ['cambiar_fondo'], 4, 3, 15, 1),
    pLesson('s1', 35, 'lesson', 'Lessons.programming.s1.l35.title', 'Lessons.programming.s1.l35.description', 'Lessons.programming.s1.l35.challenge', 'Lessons.programming.s1.l35.hint', ['efecto_fantasma'], 4, 3, 15, 1),
    pLesson('s1', 36, 'lesson', 'Lessons.programming.s1.l36.title', 'Lessons.programming.s1.l36.description', 'Lessons.programming.s1.l36.challenge', 'Lessons.programming.s1.l36.hint', ['cambiar_tamaño'], 4, 3, 15, 1),
    pLesson('s1', 37, 'lesson', 'Lessons.programming.s1.l37.title', 'Lessons.programming.s1.l37.description', 'Lessons.programming.s1.l37.challenge', 'Lessons.programming.s1.l37.hint', ['cambiar_tamaño'], 4, 3, 15, 1),
    pLesson('s1', 38, 'practice', 'Lessons.programming.s1.l38.title', 'Lessons.programming.s1.l38.description', 'Lessons.programming.s1.l38.challenge', 'Lessons.programming.s1.l38.hint', ['cambiar_disfraz', 'cambiar_tamaño', 'efecto_fantasma'], 5, 4, 20, 2),
    pLesson('s1', 39, 'practice', 'Lessons.programming.s1.l39.title', 'Lessons.programming.s1.l39.description', 'Lessons.programming.s1.l39.challenge', 'Lessons.programming.s1.l39.hint', ['decir', 'cambiar_disfraz', 'mover_derecha'], 5, 5, 25, 2),
    pLesson('s1', 40, 'challenge', 'Lessons.programming.s1.l40.title', 'Lessons.programming.s1.l40.description', 'Lessons.programming.s1.l40.challenge', 'Lessons.programming.s1.l40.hint', ['cambiar_fondo', 'decir', 'cambiar_tamaño', 'cambiar_disfraz'], 6, 6, 35, 3),

    // Fase 5: Sonidos y Ritmos (41-50)
    pLesson('s1', 41, 'lesson', 'Lessons.programming.s1.l41.title', 'Lessons.programming.s1.l41.description', 'Lessons.programming.s1.l41.challenge', 'Lessons.programming.s1.l41.hint', ['tocar_sonido'], 3, 2, 10, 1),
    pLesson('s1', 42, 'lesson', 'Lessons.programming.s1.l42.title', 'Lessons.programming.s1.l42.description', 'Lessons.programming.s1.l42.challenge', 'Lessons.programming.s1.l42.hint', ['tocar_nota'], 3, 2, 10, 1),
    pLesson('s1', 43, 'lesson', 'Lessons.programming.s1.l43.title', 'Lessons.programming.s1.l43.description', 'Lessons.programming.s1.l43.challenge', 'Lessons.programming.s1.l43.hint', ['tocar_nota', 'esperar'], 4, 3, 15, 1),
    pLesson('s1', 44, 'practice', 'Lessons.programming.s1.l44.title', 'Lessons.programming.s1.l44.description', 'Lessons.programming.s1.l44.challenge', 'Lessons.programming.s1.l44.hint', ['tocar_nota', 'esperar'], 5, 4, 20, 2),
    pLesson('s1', 45, 'practice', 'Lessons.programming.s1.l45.title', 'Lessons.programming.s1.l45.description', 'Lessons.programming.s1.l45.challenge', 'Lessons.programming.s1.l45.hint', ['mover_derecha', 'tocar_nota'], 5, 4, 20, 2),
    pLesson('s1', 46, 'practice', 'Lessons.programming.s1.l46.title', 'Lessons.programming.s1.l46.description', 'Lessons.programming.s1.l46.challenge', 'Lessons.programming.s1.l46.hint', ['tocar_sonido', 'esperar'], 5, 4, 20, 2),
    pLesson('s1', 47, 'practice', 'Lessons.programming.s1.l47.title', 'Lessons.programming.s1.l47.description', 'Lessons.programming.s1.l47.challenge', 'Lessons.programming.s1.l47.hint', ['mover_derecha', 'mover_arriba', 'tocar_nota'], 5, 5, 25, 2),
    pLesson('s1', 48, 'practice', 'Lessons.programming.s1.l48.title', 'Lessons.programming.s1.l48.description', 'Lessons.programming.s1.l48.challenge', 'Lessons.programming.s1.l48.hint', ['decir', 'tocar_nota', 'esperar'], 5, 5, 25, 2),
    pLesson('s1', 49, 'practice', 'Lessons.programming.s1.l49.title', 'Lessons.programming.s1.l49.description', 'Lessons.programming.s1.l49.challenge', 'Lessons.programming.s1.l49.hint', ['tocar_nota', 'mover_derecha', 'cambiar_disfraz', 'esperar'], 6, 6, 30, 2),
    pLesson('s1', 50, 'challenge', 'Lessons.programming.s1.l50.title', 'Lessons.programming.s1.l50.description', 'Lessons.programming.s1.l50.challenge', 'Lessons.programming.s1.l50.hint', ['tocar_nota', 'tocar_sonido', 'cambiar_disfraz', 'efecto_fantasma', 'mover_derecha'], 7, 6, 35, 3),

    // Fase 6: Proyecto Final (51-60)
    pLesson('s1', 51, 'lesson', 'Lessons.programming.s1.l51.title', 'Lessons.programming.s1.l51.description', 'Lessons.programming.s1.l51.challenge', 'Lessons.programming.s1.l51.hint', ['decir'], 4, 2, 15, 1),
    pLesson('s1', 52, 'practice', 'Lessons.programming.s1.l52.title', 'Lessons.programming.s1.l52.description', 'Lessons.programming.s1.l52.challenge', 'Lessons.programming.s1.l52.hint', ['cambiar_fondo'], 4, 3, 15, 1),
    pLesson('s1', 53, 'practice', 'Lessons.programming.s1.l53.title', 'Lessons.programming.s1.l53.description', 'Lessons.programming.s1.l53.challenge', 'Lessons.programming.s1.l53.hint', ['cambiar_disfraz', 'cambiar_tamaño'], 4, 3, 15, 2),
    pLesson('s1', 54, 'practice', 'Lessons.programming.s1.l54.title', 'Lessons.programming.s1.l54.description', 'Lessons.programming.s1.l54.challenge', 'Lessons.programming.s1.l54.hint', ['mover_derecha', 'cambiar_disfraz'], 5, 4, 20, 2),
    pLesson('s1', 55, 'practice', 'Lessons.programming.s1.l55.title', 'Lessons.programming.s1.l55.description', 'Lessons.programming.s1.l55.challenge', 'Lessons.programming.s1.l55.hint', ['decir', 'esperar'], 4, 3, 15, 2),
    pLesson('s1', 56, 'practice', 'Lessons.programming.s1.l56.title', 'Lessons.programming.s1.l56.description', 'Lessons.programming.s1.l56.challenge', 'Lessons.programming.s1.l56.hint', ['bajar_lapiz', 'color_rojo', 'mover_derecha', 'girar_derecha_90'], 5, 4, 20, 2),
    pLesson('s1', 57, 'practice', 'Lessons.programming.s1.l57.title', 'Lessons.programming.s1.l57.description', 'Lessons.programming.s1.l57.challenge', 'Lessons.programming.s1.l57.hint', ['tocar_nota', 'esperar'], 5, 4, 20, 2),
    pLesson('s1', 58, 'practice', 'Lessons.programming.s1.l58.title', 'Lessons.programming.s1.l58.description', 'Lessons.programming.s1.l58.challenge', 'Lessons.programming.s1.l58.hint', ['cambiar_tamaño', 'efecto_fantasma', 'esperar'], 5, 4, 20, 2),
    pLesson('s1', 59, 'practice', 'Lessons.programming.s1.l59.title', 'Lessons.programming.s1.l59.description', 'Lessons.programming.s1.l59.challenge', 'Lessons.programming.s1.l59.hint', ['cambiar_fondo', 'mover_derecha', 'decir', 'tocar_nota', 'bajar_lapiz'], 6, 5, 25, 2),
    pLesson('s1', 60, 'challenge', 'Lessons.programming.s1.l60.title', 'Lessons.programming.s1.l60.description', 'Lessons.programming.s1.l60.challenge', 'Lessons.programming.s1.l60.hint', ['cambiar_fondo', 'cambiar_disfraz', 'mover_derecha', 'decir', 'tocar_nota', 'bajar_lapiz', 'cambiar_tamaño'], 8, 8, 50, 5),
];

// Helper to get section units for the UnitPathMap
function createSectionUnit(
    sectionNum: number,
    phaseNum: number,
    order: number,
    titleKey: string,
    descriptionKey: string,
    iconEmoji: string,
    lessons: MicroLesson[],
): LearningUnit {
    return {
        id: `prog_s${sectionNum}_phase${phaseNum}`,
        subjectId: 'programming',
        gradeLevel: sectionNum,
        order,
        titleKey,
        descriptionKey,
        iconEmoji,
        lessons,
        prerequisites: phaseNum > 1 ? [`prog_s${sectionNum}_phase${phaseNum - 1}`] : [],
        status: 'available',
        progress: 0,
    };
}

// Export section units for the UnitPathMap
export function getProgrammingSectionUnits(sectionNum: number): LearningUnit[] {
    switch (sectionNum) {
        case 1:
            return [
                createSectionUnit(1, 1, 1, 'Navigation.ProgrammingNavigation.prog_s1_phase1', 'Navigation.ProgrammingNavigation.prog_s1_phase1_desc', '🚶', SECTION_1_LESSONS.slice(0, 10)),
                createSectionUnit(1, 2, 2, 'Navigation.ProgrammingNavigation.prog_s1_phase2', 'Navigation.ProgrammingNavigation.prog_s1_phase2_desc', '🎨', SECTION_1_LESSONS.slice(10, 20)),
                createSectionUnit(1, 3, 3, 'Navigation.ProgrammingNavigation.prog_s1_phase3', 'Navigation.ProgrammingNavigation.prog_s1_phase3_desc', '🔄', SECTION_1_LESSONS.slice(20, 30)),
                createSectionUnit(1, 4, 4, 'Navigation.ProgrammingNavigation.prog_s1_phase4', 'Navigation.ProgrammingNavigation.prog_s1_phase4_desc', '🎭', SECTION_1_LESSONS.slice(30, 40)),
                createSectionUnit(1, 5, 5, 'Navigation.ProgrammingNavigation.prog_s1_phase5', 'Navigation.ProgrammingNavigation.prog_s1_phase5_desc', '🎵', SECTION_1_LESSONS.slice(40, 50)),
                createSectionUnit(1, 6, 6, 'Navigation.ProgrammingNavigation.prog_s1_phase6', 'Navigation.ProgrammingNavigation.prog_s1_phase6_desc', '🏆', SECTION_1_LESSONS.slice(50, 60)),
            ];
        case 2:
            return [
                createSectionUnit(2, 1, 1, 'Navigation.ProgrammingNavigation.prog_s2_phase1', 'Navigation.ProgrammingNavigation.prog_s2_phase1_desc', '🔁', SECTION_2_LESSONS.slice(0, 15)),
                createSectionUnit(2, 2, 2, 'Navigation.ProgrammingNavigation.prog_s2_phase2', 'Navigation.ProgrammingNavigation.prog_s2_phase2_desc', '♾️', SECTION_2_LESSONS.slice(15, 25)),
                createSectionUnit(2, 3, 3, 'Navigation.ProgrammingNavigation.prog_s2_phase3', 'Navigation.ProgrammingNavigation.prog_s2_phase3_desc', '⌨️', SECTION_2_LESSONS.slice(25, 40)),
                createSectionUnit(2, 4, 4, 'Navigation.ProgrammingNavigation.prog_s2_phase4', 'Navigation.ProgrammingNavigation.prog_s2_phase4_desc', '💬', SECTION_2_LESSONS.slice(40, 50)),
                createSectionUnit(2, 5, 5, 'Navigation.ProgrammingNavigation.prog_s2_phase5', 'Navigation.ProgrammingNavigation.prog_s2_phase5_desc', '🏆', SECTION_2_LESSONS.slice(50, 60)),
            ];
        case 3:
            return [
                createSectionUnit(3, 1, 1, 'Navigation.ProgrammingNavigation.prog_s3_phase1', 'Navigation.ProgrammingNavigation.prog_s3_phase1_desc', '📡', SECTION_3_LESSONS.slice(0, 10)),
                createSectionUnit(3, 2, 2, 'Navigation.ProgrammingNavigation.prog_s3_phase2', 'Navigation.ProgrammingNavigation.prog_s3_phase2_desc', '❓', SECTION_3_LESSONS.slice(10, 25)),
                createSectionUnit(3, 3, 3, 'Navigation.ProgrammingNavigation.prog_s3_phase3', 'Navigation.ProgrammingNavigation.prog_s3_phase3_desc', '🔀', SECTION_3_LESSONS.slice(25, 35)),
                createSectionUnit(3, 4, 4, 'Navigation.ProgrammingNavigation.prog_s3_phase4', 'Navigation.ProgrammingNavigation.prog_s3_phase4_desc', '🧮', SECTION_3_LESSONS.slice(35, 50)),
                createSectionUnit(3, 5, 5, 'Navigation.ProgrammingNavigation.prog_s3_phase5', 'Navigation.ProgrammingNavigation.prog_s3_phase5_desc', '🏆', SECTION_3_LESSONS.slice(50, 60)),
            ];
        case 4:
            return [
                createSectionUnit(4, 1, 1, 'Navigation.ProgrammingNavigation.prog_s4_phase1', 'Navigation.ProgrammingNavigation.prog_s4_phase1_desc', '📦', SECTION_4_LESSONS.slice(0, 15)),
                createSectionUnit(4, 2, 2, 'Navigation.ProgrammingNavigation.prog_s4_phase2', 'Navigation.ProgrammingNavigation.prog_s4_phase2_desc', '👥', SECTION_4_LESSONS.slice(15, 30)),
                createSectionUnit(4, 3, 3, 'Navigation.ProgrammingNavigation.prog_s4_phase3', 'Navigation.ProgrammingNavigation.prog_s4_phase3_desc', '🧩', SECTION_4_LESSONS.slice(30, 40)),
                createSectionUnit(4, 4, 4, 'Navigation.ProgrammingNavigation.prog_s4_phase4', 'Navigation.ProgrammingNavigation.prog_s4_phase4_desc', '🍎', SECTION_4_LESSONS.slice(40, 50)),
                createSectionUnit(4, 5, 5, 'Navigation.ProgrammingNavigation.prog_s4_phase5', 'Navigation.ProgrammingNavigation.prog_s4_phase5_desc', '🏆', SECTION_4_LESSONS.slice(50, 60)),
            ];
        default:
            return [];
    }
}

// Programming sections metadata for the world map
export const PROGRAMMING_SECTIONS = [
    {
        id: 'section1',
        num: 1,
        emoji: '🌍',
        titleKey: 'Navigation.ProgrammingNavigation.section1',
        subtitleKey: 'Navigation.ProgrammingNavigation.section1_subtitle',
        descriptionKey: 'Navigation.ProgrammingNavigation.section1_desc',
        gradient: 'from-emerald-400 to-cyan-500',
        bgLight: 'bg-emerald-50',
        lessons: 60,
        available: true,
    },
    {
        id: 'section2',
        num: 2,
        emoji: '⏳',
        titleKey: 'Navigation.ProgrammingNavigation.section2',
        subtitleKey: 'Navigation.ProgrammingNavigation.section2_subtitle',
        descriptionKey: 'Navigation.ProgrammingNavigation.section2_desc',
        gradient: 'from-violet-400 to-purple-500',
        bgLight: 'bg-violet-50',
        lessons: 60,
        available: true,
    },
    {
        id: 'section3',
        num: 3,
        emoji: '🔎',
        titleKey: 'Navigation.ProgrammingNavigation.section3',
        subtitleKey: 'Navigation.ProgrammingNavigation.section3_subtitle',
        descriptionKey: 'Navigation.ProgrammingNavigation.section3_desc',
        gradient: 'from-amber-400 to-orange-500',
        bgLight: 'bg-amber-50',
        lessons: 60,
        available: true,
    },
    {
        id: 'section4',
        num: 4,
        emoji: '🏗️',
        titleKey: 'Navigation.ProgrammingNavigation.section4',
        subtitleKey: 'Navigation.ProgrammingNavigation.section4_subtitle',
        descriptionKey: 'Navigation.ProgrammingNavigation.section4_desc',
        gradient: 'from-rose-400 to-pink-500',
        bgLight: 'bg-rose-50',
        lessons: 60,
        available: true,
    },
];

export function getProgrammingLessonById(id: string): MicroLesson | undefined {
    // Collect all lessons from all sections
    const allLessons = [
        ...SECTION_1_LESSONS,
        ...SECTION_2_LESSONS,
        ...SECTION_3_LESSONS,
        ...SECTION_4_LESSONS
    ];
    return allLessons.find(l => l.id === id);
}

export function getPhaseUrlForLesson(lessonId: string): string {
    const lesson = getProgrammingLessonById(lessonId);
    if (!lesson) return '/learning/programming';

    // Parse section from lesson ID: prog_s1_l1 -> s1
    const sectionMatch = lessonId.match(/prog_s(\d+)_l/);
    if (!sectionMatch) return '/learning/programming';

    const sectionNum = parseInt(sectionMatch[1]);
    const units = getProgrammingSectionUnits(sectionNum);

    // Find unit containing this lesson
    const unit = units.find(u => u.lessons.some(l => l.id === lessonId));

    if (!unit) return `/learning/programming/section${sectionNum}`;

    // Parse phase from unit ID: prog_s1_phase1 -> phase1
    const phaseMatch = unit.id.match(/phase(\d+)/);
    if (phaseMatch) {
        return `/learning/programming/section${sectionNum}/${phaseMatch[0]}`;
    }

    return `/learning/programming/section${sectionNum}`;
}
