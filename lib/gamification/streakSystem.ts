// Streak System for Eduaroo
// Manages daily streaks with forgiveness mechanism

export interface StreakData {
    currentStreak: number;
    longestStreak: number;
    lastActivityDate: string | null;
    shieldsAvailable: number;  // Forgiveness shields
    totalDaysActive: number;
}

// Default streak data for new users
export const DEFAULT_STREAK_DATA: StreakData = {
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: null,
    shieldsAvailable: 1,
    totalDaysActive: 0,
};

// Streak milestones for rewards
export const STREAK_MILESTONES = [3, 7, 14, 30, 50, 100, 365];

/**
 * Get today's date as YYYY-MM-DD string
 */
export function getTodayDateString(): string {
    return new Date().toISOString().split('T')[0];
}

/**
 * Get yesterday's date as YYYY-MM-DD string
 */
export function getYesterdayDateString(): string {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
}

/**
 * Calculate days between two date strings
 */
export function daysBetween(date1: string, date2: string): number {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Check and update streak based on activity
 */
export function updateStreak(data: StreakData): StreakData {
    const today = getTodayDateString();
    const yesterday = getYesterdayDateString();

    // First activity ever
    if (!data.lastActivityDate) {
        return {
            ...data,
            currentStreak: 1,
            longestStreak: Math.max(1, data.longestStreak),
            lastActivityDate: today,
            totalDaysActive: 1,
        };
    }

    // Already logged today
    if (data.lastActivityDate === today) {
        return data;
    }

    // Logged yesterday - continue streak
    if (data.lastActivityDate === yesterday) {
        const newStreak = data.currentStreak + 1;
        return {
            ...data,
            currentStreak: newStreak,
            longestStreak: Math.max(newStreak, data.longestStreak),
            lastActivityDate: today,
            totalDaysActive: data.totalDaysActive + 1,
        };
    }

    // Missed days - check if we can use shield
    const daysMissed = daysBetween(data.lastActivityDate, today) - 1;

    if (daysMissed === 1 && data.shieldsAvailable > 0) {
        // Use shield to maintain streak
        const newStreak = data.currentStreak + 1;
        return {
            ...data,
            currentStreak: newStreak,
            longestStreak: Math.max(newStreak, data.longestStreak),
            lastActivityDate: today,
            shieldsAvailable: data.shieldsAvailable - 1,
            totalDaysActive: data.totalDaysActive + 1,
        };
    }

    // Streak broken - reset
    return {
        ...data,
        currentStreak: 1,
        lastActivityDate: today,
        totalDaysActive: data.totalDaysActive + 1,
    };
}

/**
 * Check if streak is at risk (no activity today, had activity yesterday)
 */
export function isStreakAtRisk(data: StreakData): boolean {
    if (!data.lastActivityDate) return false;

    const today = getTodayDateString();
    const yesterday = getYesterdayDateString();

    return data.lastActivityDate === yesterday && data.currentStreak > 0;
}

/**
 * Check if user has achieved a milestone
 */
export function checkMilestone(streak: number): number | null {
    return STREAK_MILESTONES.includes(streak) ? streak : null;
}

/**
 * Get next milestone for current streak
 */
export function getNextMilestone(streak: number): number {
    for (const milestone of STREAK_MILESTONES) {
        if (milestone > streak) return milestone;
    }
    return STREAK_MILESTONES[STREAK_MILESTONES.length - 1];
}

/**
 * Get streak emoji based on length
 */
export function getStreakEmoji(streak: number): string {
    if (streak >= 365) return '🌟';
    if (streak >= 100) return '💎';
    if (streak >= 50) return '🏆';
    if (streak >= 30) return '👑';
    if (streak >= 14) return '⚡';
    if (streak >= 7) return '🔥';
    if (streak >= 3) return '✨';
    return '🌱';
}

/**
 * Award weekly shield (called every week)
 */
export function awardWeeklyShield(data: StreakData): StreakData {
    return {
        ...data,
        shieldsAvailable: Math.min(data.shieldsAvailable + 1, 3), // Max 3 shields
    };
}
