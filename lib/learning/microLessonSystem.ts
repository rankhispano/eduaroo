// Micro-Lesson System for Eduaroo
// Estructuras y lógica para micro-lecciones de 5-8 minutos

export type LessonStatus = 'locked' | 'available' | 'in_progress' | 'completed' | 'mastered';
export type LessonType = 'diagnostic' | 'lesson' | 'practice' | 'challenge' | 'review';

export interface MicroLesson {
    id: string;
    unitId: string;
    order: number;
    type: LessonType;
    titleKey: string;
    descriptionKey: string;
    durationMinutes: number; // 5-8 min
    exerciseCount: number;
    xpReward: number;
    starsReward: number;
    status: LessonStatus;
    completedAt?: string;
    score?: number; // 0-100
    timeSpentSeconds?: number;
    // Programming-specific fields (optional)
    challengeKey?: string;
    hintKey?: string;
    requiredBlocks?: string[];
}

export interface LearningUnit {
    id: string;
    subjectId: string;
    gradeLevel: number; // 1-6
    order: number;
    titleKey: string;
    descriptionKey: string;
    iconEmoji: string;
    lessons: MicroLesson[];
    prerequisites: string[]; // Unit IDs
    status: LessonStatus;
    progress: number; // 0-100
    slug?: string;
    path?: string;
}

// Lesson type configurations
export const LESSON_TYPE_CONFIG: Record<LessonType, {
    emoji: string;
    colorClass: string;
    durationRange: [number, number];
    xpMultiplier: number;
}> = {
    diagnostic: {
        emoji: '🎯',
        colorClass: 'from-purple-500 to-indigo-600',
        durationRange: [2, 3],
        xpMultiplier: 1.0,
    },
    lesson: {
        emoji: '📚',
        colorClass: 'from-blue-500 to-cyan-600',
        durationRange: [5, 8],
        xpMultiplier: 1.0,
    },
    practice: {
        emoji: '✏️',
        colorClass: 'from-green-500 to-emerald-600',
        durationRange: [5, 7],
        xpMultiplier: 1.2,
    },
    challenge: {
        emoji: '⚔️',
        colorClass: 'from-orange-500 to-red-600',
        durationRange: [5, 8],
        xpMultiplier: 1.5,
    },
    review: {
        emoji: '🔄',
        colorClass: 'from-teal-500 to-cyan-600',
        durationRange: [3, 5],
        xpMultiplier: 0.8,
    },
};

// Default unit structure for any topic
export function createDefaultUnitStructure(
    unitId: string,
    subjectId: string,
    titleKey: string
): MicroLesson[] {
    const baseId = `${unitId}_lesson`;

    return [
        {
            id: `${baseId}_0`,
            unitId,
            order: 0,
            type: 'diagnostic',
            titleKey: 'Lessons.default.diagnostic.title',
            descriptionKey: 'Lessons.default.diagnostic.description',
            durationMinutes: 2,
            exerciseCount: 5,
            xpReward: 10,
            starsReward: 1,
            status: 'available',
        },
        {
            id: `${baseId}_1`,
            unitId,
            order: 1,
            type: 'lesson',
            titleKey: 'Lessons.default.intro.title',
            descriptionKey: 'Lessons.default.intro.description',
            durationMinutes: 5,
            exerciseCount: 8,
            xpReward: 20,
            starsReward: 2,
            status: 'locked',
        },
        {
            id: `${baseId}_2`,
            unitId,
            order: 2,
            type: 'practice',
            titleKey: 'Lessons.default.guided_practice.title',
            descriptionKey: 'Lessons.default.guided_practice.description',
            durationMinutes: 6,
            exerciseCount: 10,
            xpReward: 25,
            starsReward: 2,
            status: 'locked',
        },
        {
            id: `${baseId}_3`,
            unitId,
            order: 3,
            type: 'lesson',
            titleKey: 'Lessons.default.deep_dive.title',
            descriptionKey: 'Lessons.default.deep_dive.description',
            durationMinutes: 5,
            exerciseCount: 8,
            xpReward: 20,
            starsReward: 2,
            status: 'locked',
        },
        {
            id: `${baseId}_4`,
            unitId,
            order: 4,
            type: 'practice',
            titleKey: 'Lessons.default.independent_practice.title',
            descriptionKey: 'Lessons.default.independent_practice.description',
            durationMinutes: 7,
            exerciseCount: 12,
            xpReward: 30,
            starsReward: 3,
            status: 'locked',
        },
        {
            id: `${baseId}_5`,
            unitId,
            order: 5,
            type: 'challenge',
            titleKey: 'Lessons.default.mastery_challenge.title',
            descriptionKey: 'Lessons.default.mastery_challenge.description',
            durationMinutes: 8,
            exerciseCount: 15,
            xpReward: 50,
            starsReward: 5,
            status: 'locked',
        },
    ];
}

// Calculate unit progress based on lessons
export function calculateUnitProgress(lessons: MicroLesson[]): number {
    if (lessons.length === 0) return 0;
    const completed = lessons.filter(l => l.status === 'completed' || l.status === 'mastered').length;
    return Math.round((completed / lessons.length) * 100);
}

// Get next available lesson
export function getNextAvailableLesson(lessons: MicroLesson[]): MicroLesson | null {
    return lessons.find(l => l.status === 'available') || null;
}

// Unlock next lesson after completion
export function unlockNextLesson(lessons: MicroLesson[], completedLessonId: string): MicroLesson[] {
    const completedIndex = lessons.findIndex(l => l.id === completedLessonId);
    if (completedIndex === -1 || completedIndex === lessons.length - 1) return lessons;

    return lessons.map((lesson, index) => {
        if (index === completedIndex + 1 && lesson.status === 'locked') {
            return { ...lesson, status: 'available' as LessonStatus };
        }
        return lesson;
    });
}

// Check if lesson can be started
export function canStartLesson(lesson: MicroLesson): boolean {
    return lesson.status === 'available' || lesson.status === 'in_progress';
}

// Mark lesson as completed
export function completeLesson(
    lesson: MicroLesson,
    score: number,
    timeSpentSeconds: number
): MicroLesson {
    const isMastered = score >= 90;
    return {
        ...lesson,
        status: isMastered ? 'mastered' : 'completed',
        completedAt: new Date().toISOString(),
        score,
        timeSpentSeconds,
    };
}

// Format duration for display
export function formatDuration(minutes: number): string {
    if (minutes < 1) return '< 1 min';
    return `${minutes} min`;
}

// Get status badge info
export function getStatusBadge(status: LessonStatus): { textKey: string; emoji: string; colorClass: string } {
    const badges: Record<LessonStatus, { textKey: string; emoji: string; colorClass: string }> = {
        locked: { textKey: 'Common.status.locked', emoji: '🔒', colorClass: 'bg-gray-400' },
        available: { textKey: 'Common.status.available', emoji: '▶️', colorClass: 'bg-green-500' },
        in_progress: { textKey: 'Common.status.in_progress', emoji: '⏳', colorClass: 'bg-yellow-500' },
        completed: { textKey: 'Common.status.completed', emoji: '✅', colorClass: 'bg-blue-500' },
        mastered: { textKey: 'Common.status.mastered', emoji: '⭐', colorClass: 'bg-purple-500' },
    };
    return badges[status];
}
