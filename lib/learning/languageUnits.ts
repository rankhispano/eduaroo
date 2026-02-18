import { LearningUnit } from './microLessonSystem';

export const LANGUAGE_GRADE_4_UNITS: LearningUnit[] = [
    {
        id: 'lang_g4_comm_grammar',
        subjectId: 'language',
        gradeLevel: 4,
        order: 1,
        titleKey: 'LanguageGrade4.communication_grammar_title',
        descriptionKey: 'LanguageGrade4.communication_grammar_description',
        iconEmoji: '📝',
        lessons: [], // No micro-lessons for this one yet, it's a standalone page
        prerequisites: [],
        status: 'available',
        progress: 0,
        slug: 'communication-grammar',
        path: '/learning/language/grade4/communication-grammar'
    }
];

// Get all units for a grade
export function getLanguageUnitsForGrade(gradeLevel: number): LearningUnit[] {
    return LANGUAGE_GRADE_4_UNITS.filter(u => u.gradeLevel === gradeLevel);
}
