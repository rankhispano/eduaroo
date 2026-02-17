// Spaced Repetition System for Eduaroo
// Based on a simplified Leitner system adapted for children

export interface ReviewItem {
    id: string;
    topic: string; // e.g., 'fractions', 'multiplication'
    subjectId: string;
    question: string;
    correctAnswer: string;
    lastReviewed: string; // ISO date
    nextReview: string; // ISO date
    box: number; // Leitner box 1-5
    streak: number; // Consecutive correct answers
    totalAttempts: number;
    correctAttempts: number;
    questionKey?: string;
}

// Intervals in days for each Leitner box (adapted for kids - shorter intervals)
export const REVIEW_INTERVALS: Record<number, number> = {
    1: 1,   // Box 1: Review tomorrow
    2: 3,   // Box 2: Review in 3 days
    3: 7,   // Box 3: Review in 1 week
    4: 14,  // Box 4: Review in 2 weeks
    5: 30,  // Box 5: Review in 1 month
};

// Maximum box level
export const MAX_BOX = 5;

// Calculate next review date based on box level
export function calculateNextReview(box: number): string {
    const days = REVIEW_INTERVALS[box] || 1;
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + days);
    return nextDate.toISOString().split('T')[0];
}

// Update item after correct answer
export function onCorrectAnswer(item: ReviewItem): ReviewItem {
    const newBox = Math.min(item.box + 1, MAX_BOX);
    return {
        ...item,
        box: newBox,
        streak: item.streak + 1,
        lastReviewed: new Date().toISOString().split('T')[0],
        nextReview: calculateNextReview(newBox),
        totalAttempts: item.totalAttempts + 1,
        correctAttempts: item.correctAttempts + 1,
    };
}

// Update item after incorrect answer
export function onIncorrectAnswer(item: ReviewItem): ReviewItem {
    // Go back to box 1 on incorrect answer
    return {
        ...item,
        box: 1,
        streak: 0,
        lastReviewed: new Date().toISOString().split('T')[0],
        nextReview: calculateNextReview(1),
        totalAttempts: item.totalAttempts + 1,
    };
}

// Get items due for review today
export function getItemsDueToday(items: ReviewItem[]): ReviewItem[] {
    const today = new Date().toISOString().split('T')[0];
    return items.filter(item => item.nextReview <= today);
}

// Get items for daily review session (max 5 items, prioritize lowest boxes)
export function getDailyReviewItems(items: ReviewItem[], maxItems: number = 5): ReviewItem[] {
    const dueItems = getItemsDueToday(items);

    // Sort by box (lower boxes first = more urgent) and then by next review date
    const sorted = dueItems.sort((a, b) => {
        if (a.box !== b.box) return a.box - b.box;
        return a.nextReview.localeCompare(b.nextReview);
    });

    return sorted.slice(0, maxItems);
}

// Calculate mastery percentage for a topic
export function calculateMastery(items: ReviewItem[]): number {
    if (items.length === 0) return 0;

    // Mastery based on average box level (box 5 = 100% mastery)
    const avgBox = items.reduce((sum, item) => sum + item.box, 0) / items.length;
    return Math.round((avgBox / MAX_BOX) * 100);
}

// Create a new review item from an exercise
export function createReviewItem(
    topic: string,
    subjectId: string,
    question: string,
    correctAnswer: string,
    questionKey?: string
): ReviewItem {
    const today = new Date().toISOString().split('T')[0];
    return {
        id: `${topic}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        topic,
        subjectId,
        question,
        questionKey,
        correctAnswer,
        lastReviewed: today,
        nextReview: calculateNextReview(1), // Start in box 1
        box: 1,
        streak: 0,
        totalAttempts: 0,
        correctAttempts: 0,
    };
}

// Sample fraction questions for review
export const FRACTION_REVIEW_QUESTIONS: Omit<ReviewItem, 'id' | 'lastReviewed' | 'nextReview' | 'box' | 'streak' | 'totalAttempts' | 'correctAttempts'>[] = [
    { topic: 'fractions', subjectId: 'math', question: '¿Qué fracción representa 1 parte de 2?', questionKey: 'DailyReview.fractions_q1', correctAnswer: '1/2' },
    { topic: 'fractions', subjectId: 'math', question: '¿Qué fracción representa 2 partes de 4?', questionKey: 'DailyReview.fractions_q2', correctAnswer: '2/4' },
    { topic: 'fractions', subjectId: 'math', question: '¿Qué fracción representa 3 partes de 8?', questionKey: 'DailyReview.fractions_q3', correctAnswer: '3/8' },
    { topic: 'fractions', subjectId: 'math', question: '¿1/2 es igual a qué otra fracción?', questionKey: 'DailyReview.fractions_q4', correctAnswer: '2/4' },
    { topic: 'fractions', subjectId: 'math', question: '¿Cuál es mayor: 1/2 o 1/4?', questionKey: 'DailyReview.fractions_q5', correctAnswer: '1/2' },
    { topic: 'fractions', subjectId: 'math', question: '¿Cuántos cuartos hay en un entero?', questionKey: 'DailyReview.fractions_q6', correctAnswer: '4' },
    { topic: 'fractions', subjectId: 'math', question: '¿Qué fracción representa la mitad?', questionKey: 'DailyReview.fractions_q7', correctAnswer: '1/2' },
    { topic: 'fractions', subjectId: 'math', question: 'Si divides una pizza en 8 partes y comes 3, ¿qué fracción comiste?', questionKey: 'DailyReview.fractions_q8', correctAnswer: '3/8' },
];

// Initialize review items from sample questions
export function initializeFractionReviewItems(): ReviewItem[] {
    const today = new Date().toISOString().split('T')[0];
    return FRACTION_REVIEW_QUESTIONS.map((q, index) => ({
        ...q,
        id: `fractions_${index}`,
        lastReviewed: today,
        nextReview: today, // Available immediately
        box: 1,
        streak: 0,
        totalAttempts: 0,
        correctAttempts: 0,
    }));
}

// Get review stats
export function getReviewStats(items: ReviewItem[]) {
    const dueToday = getItemsDueToday(items).length;
    const mastered = items.filter(i => i.box === MAX_BOX).length;
    const learning = items.filter(i => i.box > 1 && i.box < MAX_BOX).length;
    const needsWork = items.filter(i => i.box === 1).length;

    return {
        total: items.length,
        dueToday,
        mastered,
        learning,
        needsWork,
        masteryPercentage: calculateMastery(items),
    };
}
