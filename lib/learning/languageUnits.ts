import { LearningUnit } from './microLessonSystem';

export const LANGUAGE_GRADE_4_UNITS: LearningUnit[] = [
    {
        id: 'lang_g4_texts_words',
        subjectId: 'language',
        gradeLevel: 4,
        order: 1,
        titleKey: 'LanguageGrade4.texts_words_title',
        descriptionKey: 'LanguageGrade4.texts_words_description',
        iconEmoji: '📝',
        lessons: [], // No micro-lessons for this one yet, it's a standalone page
        prerequisites: [],
        status: 'available',
        progress: 0,
        slug: 'texts-and-words',
        path: '/learning/language/grade4/texts-and-words'
    }
];

// Get all units for a grade
export function getLanguageUnitsForGrade(gradeLevel: number): LearningUnit[] {
    return LANGUAGE_GRADE_4_UNITS.filter(u => u.gradeLevel === gradeLevel);
}
