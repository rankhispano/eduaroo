import type { ArithmeticQuestion, Operation } from './learning';

export const ROUND_SIZE = 10;
export const ANSWER_TIME = 10_000;
export const SOLUTION_TIME = 5_000;
export const SUCCESS_TIME = 800;
export const OPERATION_SYMBOLS: Record<Operation, string> = {
    sum: '+', subtract: '−', multiply: '×', divide: '÷',
};
export const OPERATION_NAMES: Record<Operation, string> = {
    sum: 'Sumas', subtract: 'Restas', multiply: 'Multiplicaciones', divide: 'Divisiones',
};
export const MENTAL_LEVELS = [
    { grade: 1, name: 'Primeros pasos', description: 'Sumas y restas hasta 20.', operations: ['sum', 'subtract'] },
    { grade: 2, name: 'Cogiendo impulso', description: 'Hasta 100 y tablas del 2, 5 y 10.', operations: ['sum', 'subtract', 'multiply'] },
    { grade: 3, name: 'Las cuatro operaciones', description: 'Hasta 200, tablas hasta el 10 y divisiones exactas.', operations: ['sum', 'subtract', 'multiply', 'divide'] },
    { grade: 4, name: 'Mente en marcha', description: 'Centenas, productos y repartos más grandes.', operations: ['sum', 'subtract', 'multiply', 'divide'] },
    { grade: 5, name: 'A por el desafío', description: 'Números de hasta 1.000 y productos con 10, 20, 25 y 50.', operations: ['sum', 'subtract', 'multiply', 'divide'] },
    { grade: 6, name: 'Mente relámpago', description: 'Hasta 10.000 con números redondos y más combinaciones.', operations: ['sum', 'subtract', 'multiply', 'divide'] },
] as const satisfies ReadonlyArray<{ grade: number; name: string; description: string; operations: readonly Operation[] }>;

export function availableOperations(grade: number): readonly Operation[] {
    return MENTAL_LEVELS.find((level) => level.grade === grade)?.operations ?? MENTAL_LEVELS[0].operations;
}

export function makeMentalQuestion(grade: number, operation: Operation, position: number, random = Math.random): ArithmeticQuestion {
    if (!availableOperations(grade).includes(operation)) throw new Error('Operación no disponible para este curso');
    const pick = <T,>(values: readonly T[]): T => values[Math.min(values.length - 1, Math.floor(random() * values.length))];
    const integer = (min: number, max: number) => min + Math.min(max - min, Math.floor(random() * (max - min + 1)));
    const tier = Math.min(2, Math.floor(position / 4));
    let a: number;
    let b: number;
    if (operation === 'sum' || operation === 'subtract') {
        const max = [[10, 15, 20], [30, 60, 100], [60, 120, 200], [200, 500, 1000], [400, 700, 1000], [2000, 5000, 10000]][grade - 1][tier];
        const step = grade === 6 ? 100 : grade >= 4 ? 10 : 1;
        // Build a total first: addition answers never exceed the course limit.
        const total = integer(2, max / step) * step;
        const part = integer(1, total / step - 1) * step;
        a = operation === 'sum' ? total - part : total;
        b = part;
    } else {
        const factor = grade === 2 ? pick([2, 5, 10])
            : grade === 3 ? integer(2, 10)
            : grade === 4 ? integer(2, 12)
            : grade === 5 ? pick([4, 5, 10, 20, 25, 50])
            : pick([6, 8, 9, 12, 15, 20, 25, 50, 100]);
        const other = integer(2, grade <= 3 ? [5, 8, 10][tier] : grade === 4 ? [10, 15, 20][tier] : [10, 15, 25][tier]);
        a = operation === 'multiply' ? factor : factor * other;
        b = operation === 'multiply' ? other : factor;
    }
    const answer = operation === 'sum' ? a + b : operation === 'subtract' ? a - b : operation === 'multiply' ? a * b : a / b;
    let explanation: string;
    if (operation === 'divide') explanation = `Piensa en la multiplicación: ${b} × ${answer} = ${a}.`;
    else if (operation === 'subtract') explanation = `Compruébalo al revés: ${b} + ${answer} = ${a}.`;
    else if (operation === 'multiply') explanation = b > 10
        ? `Separa el segundo número: ${a} × ${Math.floor(b / 10) * 10} + ${a} × ${b % 10} = ${answer}.`
        : `Piensa en ${b} grupos de ${a}: ${Array.from({ length: b }, () => a).join(' + ')} = ${answer}.`;
    else {
        const unit = a + b <= 20 ? 10 : a + b <= 100 ? 10 : 100;
        const gap = unit - (a % unit);
        explanation = gap < b
            ? `Completa ${a + gap}: ${a} + ${gap} = ${a + gap}; después suma ${b - gap}. Resultado: ${answer}.`
            : `Compruébalo con una resta: ${answer} − ${b} = ${a}.`;
    }
    return { a, b, operation, answer, remainder: 0, explanation };
}

export function makeMentalRound(grade: number, chosen: readonly Operation[], random = Math.random): ArithmeticQuestion[] {
    const operations = [...new Set(chosen)].filter((op) => availableOperations(grade).includes(op));
    if (!operations.length) throw new Error('Elige al menos una operación');
    const schedule = Array.from({ length: ROUND_SIZE }, (_, index) => operations[index % operations.length]);
    for (let i = schedule.length - 1; i > 0; i--) {
        const j = Math.min(i, Math.floor(random() * (i + 1)));
        [schedule[i], schedule[j]] = [schedule[j], schedule[i]];
    }
    const seen = new Set<string>();
    return schedule.map((operation, index) => {
        let question: ArithmeticQuestion;
        let key: string;
        let attempts = 0;
        do {
            question = makeMentalQuestion(grade, operation, index, random);
            key = `${question.a}:${operation}:${question.b}`;
        } while (seen.has(key) && ++attempts < 40);
        seen.add(key);
        return question;
    });
}

export interface MentalResult {
    question: ArithmeticQuestion;
    answer: number | null;
    outcome: 'correct' | 'wrong' | 'timeout';
    elapsed: number;
    points: number;
}
export interface MentalGame {
    questions: ArithmeticQuestion[];
    index: number;
    phase: 'question' | 'feedback' | 'finished';
    deadline: number;
    remaining: number;
    results: MentalResult[];
    score: number;
    streak: number;
    bestStreak: number;
}
export type MentalAction =
    | { type: 'start'; questions: ArithmeticQuestion[]; now: number }
    | { type: 'answer'; answer: number; index: number; now: number }
    | { type: 'tick'; now: number }
    | { type: 'reset' };

function resolve(game: MentalGame, answer: number | null, now: number): MentalGame {
    const expired = now >= game.deadline;
    const correct = !expired && answer === game.questions[game.index].answer;
    const streak = correct ? game.streak + 1 : 0;
    const elapsed = expired ? ANSWER_TIME : Math.max(0, ANSWER_TIME - (game.deadline - now));
    const points = correct ? 100 + Math.ceil((ANSWER_TIME - elapsed) / 1000) * 5 + Math.min(streak - 1, 5) * 10 : 0;
    return {
        ...game, phase: 'feedback', deadline: now + (correct ? SUCCESS_TIME : SOLUTION_TIME),
        remaining: correct ? SUCCESS_TIME : SOLUTION_TIME,
        score: game.score + points, streak, bestStreak: Math.max(game.bestStreak, streak),
        results: [...game.results, { question: game.questions[game.index], answer: expired ? null : answer, outcome: correct ? 'correct' : expired ? 'timeout' : 'wrong', elapsed, points }],
    };
}

export function mentalGameReducer(game: MentalGame | null, action: MentalAction): MentalGame | null {
    if (action.type === 'reset') return null;
    if (action.type === 'start') return {
        questions: action.questions, index: 0, phase: 'question', deadline: action.now + ANSWER_TIME,
        remaining: ANSWER_TIME, results: [], score: 0, streak: 0, bestStreak: 0,
    };
    if (!game || game.phase === 'finished') return game;
    if (action.type === 'answer') {
        if (game.phase !== 'question' || game.index !== action.index || !Number.isFinite(action.answer)) return game;
        return resolve(game, action.answer, action.now);
    }
    if (game.phase === 'question' && action.now >= game.deadline) return resolve(game, null, action.now);
    if (game.phase === 'feedback' && action.now >= game.deadline) {
        if (game.index + 1 === game.questions.length) return { ...game, phase: 'finished', remaining: 0 };
        return { ...game, phase: 'question', index: game.index + 1, deadline: action.now + ANSWER_TIME, remaining: ANSWER_TIME };
    }
    return { ...game, remaining: Math.max(0, game.deadline - action.now) };
}
