export interface PassTask {
    id: string;
    descriptionEs: string;
    targetCount: number;
    currentCount: number;
    completed: boolean;
    rewardXP: number;
}

export interface ExplorerPass {
    id: string;
    seasonName: string; // e.g., "Temporada de la Selva", "Semana del Espacio"
    startDate: string;
    endDate: string;
    themeColor: string; // Tailwind color class e.g., "emerald"
    icon: string; // Emoji or icon name
    level: number; // Current level in the pass (1-30)
    maxLevel: number;
    currentXP: number;
    xpToNextLevel: number;
    isPremium: boolean; // For "Plus" track if we add it
    tasks: PassTask[];
}

// Helper to get current active pass (simulated)
export const getCurrentPass = (): ExplorerPass => {
    return {
        id: 'season_jungle_1',
        seasonName: 'Temporada Selvática',
        startDate: '2025-02-01',
        endDate: '2025-02-28',
        themeColor: 'emerald',
        icon: '🌿',
        level: 4,
        maxLevel: 20,
        currentXP: 350,
        xpToNextLevel: 500,
        isPremium: false,
        tasks: [
            {
                id: 'task_1',
                descriptionEs: 'Completa 3 lecciones de Matemáticas',
                targetCount: 3,
                currentCount: 1,
                completed: false,
                rewardXP: 100
            },
            {
                id: 'task_2',
                descriptionEs: 'Consigue 2 puntuaciones perfectas',
                targetCount: 2,
                currentCount: 2,
                completed: true,
                rewardXP: 150
            },
            {
                id: 'task_3',
                descriptionEs: 'Practica durante 15 minutos',
                targetCount: 15,
                currentCount: 10,
                completed: false,
                rewardXP: 75
            }
        ]
    };
};
