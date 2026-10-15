import { describe, expect, it } from 'vitest';
import {
    ANSWER_TIME, availableOperations, makeMentalQuestion, makeMentalRound,
    mentalGameReducer, MENTAL_LEVELS, ROUND_SIZE, SOLUTION_TIME, SUCCESS_TIME,
    type MentalGame,
} from './mental-math';

function seeded(seed: number) {
    return () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 2 ** 32; };
}
const start = () => mentalGameReducer(null, { type: 'start', questions: makeMentalRound(3, availableOperations(3), seeded(42)), now: 0 })!;
const answer = (game: MentalGame, value: number, now: number) => mentalGameReducer(game, { type: 'answer', answer: value, index: game.index, now })!;
const tick = (game: MentalGame, now: number) => mentalGameReducer(game, { type: 'tick', now })!;

describe('reto de cálculo mental: preguntas por curso', () => {
    it('excluye operaciones no aprendidas y respeta la selección', () => {
        expect(availableOperations(1)).toEqual(['sum', 'subtract']);
        expect(availableOperations(2)).not.toContain('divide');
        expect(() => makeMentalQuestion(1, 'multiply', 0)).toThrow();
        expect(() => makeMentalRound(2, ['divide'])).toThrow();
        const round = makeMentalRound(1, ['sum', 'multiply'], seeded(6));
        expect(round).toHaveLength(10);
        expect(round.every((q) => q.operation === 'sum')).toBe(true);
    });
    it('genera 10 preguntas equilibradas, válidas y sin repeticiones en todos los cursos', () => {
        for (const level of MENTAL_LEVELS) {
            for (let seed = 1; seed <= 80; seed++) {
                const round = makeMentalRound(level.grade, level.operations, seeded(seed));
                expect(round).toHaveLength(ROUND_SIZE);
                expect(new Set(round.map((q) => `${q.a}:${q.operation}:${q.b}`)).size).toBe(ROUND_SIZE);
                for (const op of level.operations) {
                    const count = round.filter((q) => q.operation === op).length;
                    expect(count).toBeGreaterThanOrEqual(Math.floor(ROUND_SIZE / level.operations.length));
                    expect(count).toBeLessThanOrEqual(Math.ceil(ROUND_SIZE / level.operations.length));
                }
                for (const q of round) {
                    expect(Number.isInteger(q.answer)).toBe(true);
                    expect(q.answer).toBeGreaterThanOrEqual(0);
                    expect(q.remainder).toBe(0);
                    if (q.operation === 'sum') expect(q.a + q.b).toBe(q.answer);
                    if (q.operation === 'subtract') expect(q.a - q.b).toBe(q.answer);
                    if (q.operation === 'multiply') {
                        expect(q.a * q.b).toBe(q.answer);
                        if (level.grade === 2) expect([2, 5, 10]).toContain(q.a);
                    }
                    if (q.operation === 'divide') {
                        expect(q.b).toBeGreaterThan(0);
                        expect(q.answer * q.b).toBe(q.a);
                    }
                    if (level.grade === 1) expect(Math.max(q.a, q.b, q.answer)).toBeLessThanOrEqual(20);
                    if (level.grade === 2 && q.operation !== 'multiply') expect(Math.max(q.a, q.b, q.answer)).toBeLessThanOrEqual(100);
                }
            }
        }
    });
    it('mantiene la dificultad progresiva dentro de los límites del curso', () => {
        const first = makeMentalQuestion(1, 'sum', 0, () => 0.99);
        const last = makeMentalQuestion(1, 'sum', 9, () => 0.99);
        expect(first.answer).toBe(10);
        expect(last.answer).toBe(20);
        for (const grade of [1, 2, 3, 4, 5, 6]) {
            for (const op of availableOperations(grade)) {
                for (const random of [() => 0, () => 0.999999]) {
                    const q = makeMentalQuestion(grade, op, 9, random);
                    expect(Number.isFinite(q.answer)).toBe(true);
                    expect(q.answer).toBeGreaterThan(0);
                }
            }
        }
    });
});

describe('reto de cálculo mental: reloj y transiciones', () => {
    it('concede exactamente 10 segundos y muestra la solución 5 segundos tras un fallo', () => {
        let game = start();
        expect(game.deadline).toBe(ANSWER_TIME);
        game = answer(game, game.questions[0].answer + 1, 1234);
        expect(game.results[0].outcome).toBe('wrong');
        expect(game.phase).toBe('feedback');
        expect(game.deadline).toBe(1234 + SOLUTION_TIME);
        expect(tick(game, game.deadline - 1).phase).toBe('feedback');
        game = tick(game, game.deadline);
        expect(game.phase).toBe('question');
        expect(game.index).toBe(1);
        expect(game.remaining).toBe(ANSWER_TIME);
    });
    it('agota el tiempo incluso si los ticks se retrasan o llega una respuesta al límite', () => {
        let game = start();
        expect(tick(game, ANSWER_TIME - 1).phase).toBe('question');
        game = answer(game, game.questions[0].answer, ANSWER_TIME);
        expect(game.results[0].outcome).toBe('timeout');
        expect(game.results[0].answer).toBeNull();
        expect(game.score).toBe(0);
        const delayed = tick(start(), 60_000);
        expect(delayed.results).toHaveLength(1);
        expect(delayed.phase).toBe('feedback');
        expect(delayed.deadline).toBe(65_000);
    });
    it('rechaza envíos duplicados y eventos de preguntas anteriores', () => {
        let game = start();
        game = answer(game, game.questions[0].answer, 2000);
        const duplicate = answer(game, game.questions[0].answer, 2001);
        expect(duplicate).toBe(game);
        game = tick(game, game.deadline);
        const stale = mentalGameReducer(game, { type: 'answer', answer: game.questions[1].answer, index: 0, now: 3000 });
        expect(stale).toBe(game);
        expect(game.results).toHaveLength(1);
    });
    it('avanza tras un acierto, suma bonificaciones y reinicia la racha tras fallar', () => {
        let game = start();
        game = answer(game, game.questions[0].answer, 1500);
        expect(game.score).toBe(145);
        expect(game.streak).toBe(1);
        expect(game.deadline).toBe(1500 + SUCCESS_TIME);
        game = tick(game, game.deadline);
        game = answer(game, game.questions[1].answer, game.deadline - 8000);
        expect(game.score).toBe(295);
        expect(game.bestStreak).toBe(2);
        game = tick(game, game.deadline);
        game = answer(game, -1, game.deadline - 9000);
        expect(game.score).toBe(295);
        expect(game.streak).toBe(0);
        expect(game.bestStreak).toBe(2);
    });
    it.each(['correct', 'wrong', 'timeout'] as const)('termina en 10 preguntas con última respuesta %s', (outcome) => {
        let game = start();
        for (let i = 0; i < ROUND_SIZE; i++) {
            expect(game.index).toBe(i);
            const correct = i < 9 || outcome === 'correct';
            game = outcome === 'timeout' && i === 9
                ? tick(game, game.deadline)
                : answer(game, game.questions[i].answer + (correct ? 0 : 1), game.deadline - 5000);
            expect(game.results).toHaveLength(i + 1);
            expect(game.phase).toBe('feedback');
            if (!correct) expect(tick(game, game.deadline - 1).phase).toBe('feedback');
            game = tick(game, game.deadline);
        }
        expect(game.phase).toBe('finished');
        expect(game.results).toHaveLength(10);
        expect(tick(game, 1_000_000)).toBe(game);
    });
    it('cancela el reloj y limpia la sesión al volver a elegir nivel', () => {
        const idle = mentalGameReducer(start(), { type: 'reset' });
        expect(idle).toBeNull();
        expect(mentalGameReducer(idle, { type: 'tick', now: 100000 })).toBeNull();
    });
});
