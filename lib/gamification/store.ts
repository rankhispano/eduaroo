import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import {
    getLevelFromXP,
    checkLevelUp,
    calculateExerciseXP,
    calculateExerciseStars,
    SubjectProgress,
    Level
} from './xpSystem';
import {
    StreakData,
    DEFAULT_STREAK_DATA,
    updateStreak,
    checkMilestone
} from './streakSystem';

// Subject IDs
export type SubjectId = 'math' | 'language' | 'science' | 'social' | 'english';

// Achievement definition
export interface Achievement {
    id: string;
    nameKey: string;
    descriptionKey: string;
    icon: string;
    unlockedAt: string | null;
}

// Full gamification state
export interface GamificationState {
    // Core stats
    totalXP: number;
    stars: number;

    // Levels
    currentLevel: Level;

    // Streaks
    streak: StreakData;

    // Subject progress
    subjects: Record<SubjectId, SubjectProgress>;

    // Daily goals
    dailyGoal: number;
    dailyProgress: number;
    dailyGoalDate: string;

    // Achievements
    achievements: Achievement[];

    // Retry Potions (prevent losing streak/XP on bad exercise)
    retryPotions: number;
    retryPotionsResetDate: string; // Weekly reset
    maxRetryPotions: number;

    // Settings
    soundEnabled: boolean;
}

// Actions
export interface GamificationActions {
    // XP actions
    addXP: (amount: number, subjectId?: SubjectId) => void;
    addStars: (amount: number) => void;

    // Exercise completion
    completeExercise: (
        subjectId: SubjectId,
        correctCount: number,
        totalCount: number,
        isPerfect: boolean
    ) => { xpGained: number; starsGained: number; levelUp: Level | null };

    // Streak
    recordActivity: () => void;

    // Daily goals
    setDailyGoal: (goal: number) => void;
    addDailyProgress: (amount: number) => void;

    // Achievements
    unlockAchievement: (achievementId: string) => void;

    // Retry Potions
    useRetryPotion: () => boolean;
    addRetryPotion: (amount: number) => void;
    checkPotionReset: () => void;

    // Settings
    toggleSound: () => void;

    // Reset
    resetProgress: () => void;
}

// Default achievements
const DEFAULT_ACHIEVEMENTS: Achievement[] = [
    { id: 'first_exercise', nameKey: 'Achievements.first_exercise.name', descriptionKey: 'Achievements.first_exercise.desc', icon: '🎯', unlockedAt: null },
    { id: 'perfect_score', nameKey: 'Achievements.perfect_score.name', descriptionKey: 'Achievements.perfect_score.desc', icon: '⭐', unlockedAt: null },
    { id: 'streak_7', nameKey: 'Achievements.streak_7.name', descriptionKey: 'Achievements.streak_7.desc', icon: '🔥', unlockedAt: null },
    { id: 'streak_30', nameKey: 'Achievements.streak_30.name', descriptionKey: 'Achievements.streak_30.desc', icon: '👑', unlockedAt: null },
    { id: 'level_5', nameKey: 'Achievements.level_5.name', descriptionKey: 'Achievements.level_5.desc', icon: '🎯', unlockedAt: null },
    { id: 'level_10', nameKey: 'Achievements.level_10.name', descriptionKey: 'Achievements.level_10.desc', icon: '🌟', unlockedAt: null },
    { id: 'math_master', nameKey: 'Achievements.math_master.name', descriptionKey: 'Achievements.math_master.desc', icon: '🧮', unlockedAt: null },
    { id: 'daily_goal_10', nameKey: 'Achievements.daily_goal_10.name', descriptionKey: 'Achievements.daily_goal_10.desc', icon: '✅', unlockedAt: null },
];

// Default subject progress
const createDefaultSubjectProgress = (subjectId: string): SubjectProgress => ({
    subjectId,
    totalXP: 0,
    exercisesCompleted: 0,
    perfectScores: 0,
    lastActivityDate: '',
});

const DEFAULT_SUBJECTS: Record<SubjectId, SubjectProgress> = {
    math: createDefaultSubjectProgress('math'),
    language: createDefaultSubjectProgress('language'),
    science: createDefaultSubjectProgress('science'),
    social: createDefaultSubjectProgress('social'),
    english: createDefaultSubjectProgress('english'),
};

// Get today as string
const getTodayString = () => new Date().toISOString().split('T')[0];

// Create the store
export const useGamificationStore = create<GamificationState & GamificationActions>()(
    persist(
        (set, get) => ({
            // Initial state
            totalXP: 0,
            stars: 0,
            currentLevel: getLevelFromXP(0),
            streak: DEFAULT_STREAK_DATA,
            subjects: DEFAULT_SUBJECTS,
            dailyGoal: 5, // Default: complete 5 exercises per day
            dailyProgress: 0,
            dailyGoalDate: getTodayString(),
            achievements: DEFAULT_ACHIEVEMENTS,

            // Retry Potions
            retryPotions: 3,
            maxRetryPotions: 3,
            retryPotionsResetDate: getTodayString(),

            soundEnabled: true,

            // Actions
            addXP: (amount, subjectId) => {
                set((state) => {
                    const newTotalXP = state.totalXP + amount;
                    const newLevel = getLevelFromXP(newTotalXP);

                    // Update subject XP if provided
                    let newSubjects = state.subjects;
                    if (subjectId) {
                        newSubjects = {
                            ...state.subjects,
                            [subjectId]: {
                                ...state.subjects[subjectId],
                                totalXP: state.subjects[subjectId].totalXP + amount,
                            },
                        };
                    }

                    return {
                        totalXP: newTotalXP,
                        currentLevel: newLevel,
                        subjects: newSubjects,
                    };
                });
            },

            addStars: (amount) => {
                set((state) => ({ stars: state.stars + amount }));
            },

            completeExercise: (subjectId, correctCount, totalCount, isPerfect) => {
                const state = get();
                const oldXP = state.totalXP;

                // Calculate rewards
                const xpGained = calculateExerciseXP(correctCount, totalCount, isPerfect);
                const starsGained = calculateExerciseStars(correctCount, totalCount, isPerfect);

                // Check level up
                const newXP = oldXP + xpGained;
                const levelUp = checkLevelUp(oldXP, newXP);

                // Update state
                set((state) => {
                    const today = getTodayString();

                    // Reset daily progress if new day
                    let dailyProgress = state.dailyProgress;
                    let dailyGoalDate = state.dailyGoalDate;
                    if (dailyGoalDate !== today) {
                        dailyProgress = 0;
                        dailyGoalDate = today;
                    }
                    dailyProgress += 1;

                    // Update subject progress
                    const subject = state.subjects[subjectId];
                    const newSubjects = {
                        ...state.subjects,
                        [subjectId]: {
                            ...subject,
                            totalXP: subject.totalXP + xpGained,
                            exercisesCompleted: subject.exercisesCompleted + 1,
                            perfectScores: isPerfect ? subject.perfectScores + 1 : subject.perfectScores,
                            lastActivityDate: today,
                        },
                    };

                    return {
                        totalXP: newXP,
                        stars: state.stars + starsGained,
                        currentLevel: getLevelFromXP(newXP),
                        subjects: newSubjects,
                        dailyProgress,
                        dailyGoalDate,
                    };
                });

                // Record activity for streak
                get().recordActivity();

                // Check for first exercise achievement
                if (get().subjects[subjectId].exercisesCompleted === 1) {
                    get().unlockAchievement('first_exercise');
                }

                // Check for perfect score achievement
                if (isPerfect) {
                    get().unlockAchievement('perfect_score');
                }

                // Check for math master
                if (subjectId === 'math' && get().subjects.math.exercisesCompleted >= 50) {
                    get().unlockAchievement('math_master');
                }

                // Check for level achievements
                if (levelUp) {
                    if (levelUp.level >= 5) get().unlockAchievement('level_5');
                    if (levelUp.level >= 10) get().unlockAchievement('level_10');
                }

                return { xpGained, starsGained, levelUp };
            },

            recordActivity: () => {
                set((state) => {
                    const newStreak = updateStreak(state.streak);

                    // Check streak milestones
                    const milestone = checkMilestone(newStreak.currentStreak);
                    if (milestone === 7) get().unlockAchievement('streak_7');
                    if (milestone === 30) get().unlockAchievement('streak_30');

                    return { streak: newStreak };
                });
            },

            setDailyGoal: (goal) => {
                set({ dailyGoal: goal });
            },

            addDailyProgress: (amount) => {
                set((state) => {
                    const today = getTodayString();

                    // Reset if new day
                    if (state.dailyGoalDate !== today) {
                        return {
                            dailyProgress: amount,
                            dailyGoalDate: today,
                        };
                    }

                    const newProgress = state.dailyProgress + amount;

                    // Check if goal completed
                    if (newProgress >= state.dailyGoal && state.dailyProgress < state.dailyGoal) {
                        // Award bonus for completing daily goal
                        get().addXP(50);
                        get().addStars(5);
                    }

                    return { dailyProgress: newProgress };
                });
            },

            unlockAchievement: (achievementId) => {
                set((state) => {
                    const achievements = state.achievements.map((a) => {
                        if (a.id === achievementId && !a.unlockedAt) {
                            return { ...a, unlockedAt: new Date().toISOString() };
                        }
                        return a;
                    });
                    return { achievements };
                });
            },

            // Retry Potions Implementation
            useRetryPotion: () => {
                const state = get();
                if (state.retryPotions > 0) {
                    set({ retryPotions: state.retryPotions - 1 });
                    return true;
                }
                return false;
            },

            addRetryPotion: (amount) => {
                set((state) => ({
                    retryPotions: Math.min(state.retryPotions + amount, state.maxRetryPotions + 5) // Allow small overflow if bought
                }));
            },

            checkPotionReset: () => {
                const state = get();
                const lastReset = new Date(state.retryPotionsResetDate);
                const today = new Date();
                const diffTime = Math.abs(today.getTime() - lastReset.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays >= 7) {
                    set({
                        retryPotions: state.maxRetryPotions,
                        retryPotionsResetDate: getTodayString()
                    });
                }
            },

            toggleSound: () => {
                set((state) => ({ soundEnabled: !state.soundEnabled }));
            },

            resetProgress: () => {
                set({
                    totalXP: 0,
                    stars: 0,
                    currentLevel: getLevelFromXP(0),
                    streak: DEFAULT_STREAK_DATA,
                    subjects: DEFAULT_SUBJECTS,
                    dailyProgress: 0,
                    dailyGoalDate: getTodayString(),
                    achievements: DEFAULT_ACHIEVEMENTS,
                });
            },
        }),
        {
            name: 'eduaroo-gamification',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

// Selector hooks for common use cases
export const useXP = () => useGamificationStore((s) => s.totalXP);
export const useStars = () => useGamificationStore((s) => s.stars);
export const useLevel = () => useGamificationStore(useShallow((s) => s.currentLevel));
export const useStreak = () => useGamificationStore(useShallow((s) => s.streak));
export const useDailyGoal = () => useGamificationStore(
    useShallow((s) => ({
        goal: s.dailyGoal,
        progress: s.dailyProgress
    }))
);
