// XP and Level System for Eduaroo
// Manages experience points, levels, and progression

export interface Level {
    level: number;
    nameKey: string;
    minXP: number;
    maxXP: number;
    badge: string;
}

// Level progression curve
export const LEVELS: Level[] = [
    { level: 1, nameKey: 'Levels.1', minXP: 0, maxXP: 100, badge: '🌱' },
    { level: 2, nameKey: 'Levels.2', minXP: 100, maxXP: 250, badge: '🧭' },
    { level: 3, nameKey: 'Levels.3', minXP: 250, maxXP: 500, badge: '⚔️' },
    { level: 4, nameKey: 'Levels.4', minXP: 500, maxXP: 850, badge: '📚' },
    { level: 5, nameKey: 'Levels.5', minXP: 850, maxXP: 1300, badge: '🎯' },
    { level: 6, nameKey: 'Levels.6', minXP: 1300, maxXP: 1900, badge: '🏆' },
    { level: 7, nameKey: 'Levels.7', minXP: 1900, maxXP: 2700, badge: '👑' },
    { level: 8, nameKey: 'Levels.8', minXP: 2700, maxXP: 3800, badge: '⭐' },
    { level: 9, nameKey: 'Levels.9', minXP: 3800, maxXP: 5200, badge: '🦸' },
    { level: 10, nameKey: 'Levels.10', minXP: 5200, maxXP: Infinity, badge: '🌟' },
];

// XP rewards configuration
export const XP_REWARDS = {
    exerciseCorrect: 10,
    exerciseIncorrect: 2, // Small reward for trying
    perfectExercise: 25, // Bonus for no mistakes
    dailyGoalComplete: 50,
    streakBonus: (days: number) => Math.min(days * 5, 50), // Max 50 bonus
    firstTimeActivity: 100,
    challengeComplete: 75,
};

// Stars rewards (premium currency)
export const STAR_REWARDS = {
    exerciseComplete: 1,
    perfectScore: 3,
    dailyGoal: 5,
    weeklyStreak: 10,
    levelUp: 15,
    achievement: 20,
};

/**
 * Get current level based on XP
 */
export function getLevelFromXP(xp: number): Level {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
        if (xp >= LEVELS[i].minXP) {
            return LEVELS[i];
        }
    }
    return LEVELS[0];
}

/**
 * Get XP progress within current level (0-100%)
 */
export function getLevelProgress(xp: number): number {
    const level = getLevelFromXP(xp);
    const xpInLevel = xp - level.minXP;
    const xpForLevel = level.maxXP - level.minXP;

    if (level.maxXP === Infinity) return 100;
    return Math.min((xpInLevel / xpForLevel) * 100, 100);
}

/**
 * Get XP needed for next level
 */
export function getXPToNextLevel(xp: number): number {
    const level = getLevelFromXP(xp);
    if (level.maxXP === Infinity) return 0;
    return level.maxXP - xp;
}

/**
 * Check if leveling up
 */
export function checkLevelUp(oldXP: number, newXP: number): Level | null {
    const oldLevel = getLevelFromXP(oldXP);
    const newLevel = getLevelFromXP(newXP);

    if (newLevel.level > oldLevel.level) {
        return newLevel;
    }
    return null;
}

/**
 * Calculate XP for exercise completion
 */
export function calculateExerciseXP(
    correctCount: number,
    totalCount: number,
    isPerfect: boolean
): number {
    let xp = correctCount * XP_REWARDS.exerciseCorrect;

    // Add XP for incorrect (encouragement)
    xp += (totalCount - correctCount) * XP_REWARDS.exerciseIncorrect;

    // Perfect bonus
    if (isPerfect) {
        xp += XP_REWARDS.perfectExercise;
    }

    return xp;
}

/**
 * Calculate stars for exercise completion
 */
export function calculateExerciseStars(
    correctCount: number,
    totalCount: number,
    isPerfect: boolean
): number {
    let stars = STAR_REWARDS.exerciseComplete;

    if (isPerfect) {
        stars += STAR_REWARDS.perfectScore;
    }

    return stars;
}

// Subject-specific XP tracking
export interface SubjectProgress {
    subjectId: string;
    totalXP: number;
    exercisesCompleted: number;
    perfectScores: number;
    lastActivityDate: string;
}

/**
 * Get subject level (1-10 per subject)
 */
export function getSubjectLevel(subjectXP: number): number {
    // Each subject has its own progression
    // Every 200 XP = 1 level, max level 10
    return Math.min(Math.floor(subjectXP / 200) + 1, 10);
}
