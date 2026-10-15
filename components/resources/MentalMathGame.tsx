'use client';

import { useEffect, useReducer, useRef, useState } from 'react';
import { ArrowRight, Check, ChevronLeft, Clock3, Delete, Flame, RotateCcw, Sparkles, Trophy, X, Zap } from 'lucide-react';
import {
    ANSWER_TIME, availableOperations, makeMentalRound, mentalGameReducer,
    MENTAL_LEVELS, OPERATION_NAMES, OPERATION_SYMBOLS, ROUND_SIZE, SOLUTION_TIME,
} from '@/lib/resources/mental-math';
import type { Operation } from '@/lib/resources/learning';
import styles from './MentalMathGame.module.css';

const recordKey = (grade: number, operations: readonly Operation[]) => `eduaroo:mental:v1:${grade}:${[...operations].sort().join(',')}`;
function readRecord(key: string): number {
    try {
        const value = Number(localStorage.getItem(key));
        return Number.isFinite(value) && value > 0 ? value : 0;
    } catch { return 0; }
}

export default function MentalMathGame() {
    const [grade, setGrade] = useState(1);
    const [operations, setOperations] = useState<Operation[]>(['sum', 'subtract']);
    const [answer, setAnswer] = useState('');
    const [personalBest, setPersonalBest] = useState(0);
    const [game, dispatch] = useReducer(mentalGameReducer, null);
    const input = useRef<HTMLInputElement>(null);
    const heading = useRef<HTMLHeadingElement>(null);
    const phase = game?.phase;
    const index = game?.index;
    const level = MENTAL_LEVELS[grade - 1];
    const allowed = availableOperations(grade);
    const key = recordKey(grade, operations);
    const active = phase === 'question' || phase === 'feedback';
    const last = game?.results.at(-1);
    const right = game?.results.filter((result) => result.outcome === 'correct').length ?? 0;

    useEffect(() => {
        if (!active) return;
        const tick = () => dispatch({ type: 'tick', now: Date.now() });
        const interval = window.setInterval(tick, 100);
        document.addEventListener('visibilitychange', tick);
        return () => {
            window.clearInterval(interval);
            document.removeEventListener('visibilitychange', tick);
        };
    }, [active]);

    useEffect(() => {
        if (phase === 'question') input.current?.focus({ preventScroll: true });
        if (phase === 'finished') heading.current?.focus({ preventScroll: true });
    }, [phase, index]);

    useEffect(() => {
        if (phase !== 'finished' || !game) return;
        try {
            localStorage.setItem(key, String(Math.max(readRecord(key), game.score)));
        } catch { /* The game also works when browser storage is unavailable. */ }
        if (game.results.filter((result) => result.outcome === 'correct').length >= 7 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            let cancelled = false;
            void import('canvas-confetti').then(({ default: confetti }) => {
                if (!cancelled) void confetti({ particleCount: 70, spread: 65, origin: { y: 0.65 }, colors: ['#0d9488', '#38bdf8', '#fbbf24'], disableForReducedMotion: true });
            }).catch(() => {});
            return () => { cancelled = true; };
        }
        // The score and results are final once this phase starts.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase, key]);

    function start() {
        setPersonalBest(readRecord(key));
        setAnswer('');
        dispatch({ type: 'start', questions: makeMentalRound(grade, operations), now: Date.now() });
    }
    function submit() {
        if (!game || !/^\d+$/.test(answer)) return;
        dispatch({ type: 'answer', answer: Number(answer), index: game.index, now: Date.now() });
        setAnswer('');
    }
    function selectGrade(value: number) {
        setGrade(value);
        setOperations([...availableOperations(value)]);
    }
    function toggleOperation(operation: Operation) {
        setOperations((current) => current.includes(operation) ? current.filter((op) => op !== operation) : [...current, operation]);
    }
    const equation = (a: number, operation: Operation, b: number) => `${a} ${OPERATION_SYMBOLS[operation]} ${b}`;

    return (
        <section className={`${styles.game} no-print`} aria-label="Juego de cálculo mental">
            <div className={styles.topbar}>
                <span className={styles.brand}><Zap size={18} fill="currentColor" /> RETO RELÁMPAGO</span>
                <span className={styles.course}>{grade}.º de Primaria</span>
            </div>

            {!game && (
                <div className={styles.setup}>
                    <div className={styles.intro}>
                        <span className={styles.heroIcon} aria-hidden="true"><Zap size={38} fill="currentColor" /></span>
                        <p className={styles.eyebrow}>UN RATITO DE NÚMEROS, UN GRAN RETO</p>
                        <h2>¡Enciende tu mente!</h2>
                        <p>Diez cálculos. Diez segundos por respuesta.<br />¿Hasta dónde llegará tu racha?</p>
                    </div>
                    <div className={styles.rules}>
                        <span><Sparkles size={18} /> 10 preguntas</span>
                        <span><Clock3 size={18} /> 10 s para pensar</span>
                        <span><Check size={18} /> Aprende de cada fallo</span>
                    </div>
                    <fieldset className={styles.fieldset}>
                        <legend>1. Elige tu curso</legend>
                        <div className={styles.levels}>
                            {MENTAL_LEVELS.map((item) => (
                                <button type="button" key={item.grade} aria-pressed={grade === item.grade} onClick={() => selectGrade(item.grade)}>
                                    <strong>{item.grade}.º</strong><span>Primaria</span>
                                </button>
                            ))}
                        </div>
                        <p className={styles.levelInfo}><strong>{level.name}.</strong> {level.description}</p>
                    </fieldset>
                    <fieldset className={styles.fieldset}>
                        <legend>2. ¿Qué operaciones has aprendido?</legend>
                        <p className={styles.help}>Desmarca las que todavía no hayas visto en clase.</p>
                        <div className={styles.operations}>
                            {(Object.keys(OPERATION_NAMES) as Operation[]).map((operation) => (
                                <label key={operation} className={!allowed.includes(operation) ? styles.locked : ''}>
                                    <input type="checkbox" disabled={!allowed.includes(operation)} checked={operations.includes(operation)} onChange={() => toggleOperation(operation)} />
                                    <span className={styles.operationSymbol}>{OPERATION_SYMBOLS[operation]}</span>
                                    <span>{OPERATION_NAMES[operation]}{!allowed.includes(operation) && <small>Desde {operation === 'multiply' ? '2.º' : '3.º'}</small>}</span>
                                </label>
                            ))}
                        </div>
                    </fieldset>
                    <div className={styles.startArea}>
                        <button type="button" className={styles.primary} disabled={!operations.length} onClick={start}>¡Vamos a jugar! <ArrowRight size={20} /></button>
                        <p>{operations.length ? 'Si fallas, tendrás 5 segundos para ver la solución y un truco.' : 'Elige al menos una operación para empezar.'}</p>
                        <p className={styles.help}>Las cuentas se complican poco a poco dentro de tu curso. Todas las divisiones son exactas.</p>
                    </div>
                </div>
            )}

            {game && active && (
                <div className={styles.play}>
                    <div className={styles.stats}>
                        <span>Pregunta <strong>{game.index + 1}<small> / {ROUND_SIZE}</small></strong></span>
                        <span><Trophy size={16} /> Puntos <strong>{game.score}</strong></span>
                        <span className={game.streak >= 3 ? styles.hot : ''}><Flame size={16} /> Racha <strong>{game.streak}</strong></span>
                    </div>
                    <div className={styles.steps} aria-label={`${game.results.length} de ${ROUND_SIZE} preguntas respondidas`}>
                        {game.questions.map((_, i) => <span key={i} data-state={game.results[i]?.outcome ?? (i === game.index ? 'current' : 'pending')}>
                            {game.results[i]?.outcome === 'correct' ? <Check size={13} /> : game.results[i] ? <X size={13} /> : i + 1}
                        </span>)}
                    </div>
                    <div className={styles.arena} data-feedback={phase === 'feedback' ? last?.outcome : undefined}>
                        {phase === 'question' ? (
                            <>
                                <div className={styles.timer} data-urgent={game.remaining <= 3000} role="timer" aria-label={`${Math.ceil(game.remaining / 1000)} segundos restantes`}>
                                    <Clock3 size={20} /><strong>{Math.ceil(game.remaining / 1000)}</strong><span>segundos</span>
                                </div>
                                <div className={styles.timeTrack} aria-hidden="true"><span style={{ width: `${game.remaining / ANSWER_TIME * 100}%` }} data-urgent={game.remaining <= 3000} /></div>
                                <p className={styles.prompt} aria-live="polite" aria-atomic="true">Pregunta {game.index + 1}: ¿cuánto es?</p>
                                <p className={styles.equation} aria-label={equation(game.questions[game.index].a, game.questions[game.index].operation, game.questions[game.index].b)}>{equation(game.questions[game.index].a, game.questions[game.index].operation, game.questions[game.index].b)} <span>= ?</span></p>
                                <form onSubmit={(event) => { event.preventDefault(); submit(); }} className={styles.answerForm}>
                                    <label className={styles.answerLabel}>
                                        <span className="sr-only">Tu respuesta</span>
                                        <input ref={input} type="text" inputMode="numeric" pattern="[0-9]*" autoComplete="off" enterKeyHint="send" maxLength={6} placeholder="Tu respuesta" value={answer} onChange={(event) => setAnswer(event.target.value.replace(/\D/g, '').slice(0, 6))} />
                                    </label>
                                    <button className={styles.primary} disabled={!answer}>Responder <ArrowRight size={20} /></button>
                                </form>
                                <div className={styles.keypad} aria-label="Teclado numérico">
                                    {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'delete'].map((digit) => (
                                        <button key={digit} type="button" aria-label={digit === 'clear' ? 'Borrar respuesta' : digit === 'delete' ? 'Borrar última cifra' : digit} onClick={() => setAnswer((value) => digit === 'clear' ? '' : digit === 'delete' ? value.slice(0, -1) : (value + digit).slice(0, 6))}>
                                            {digit === 'clear' ? 'C' : digit === 'delete' ? <Delete size={20} /> : digit}
                                        </button>
                                    ))}
                                </div>
                                <p className={styles.keyboardHint}>También puedes escribir y pulsar Intro ↵</p>
                            </>
                        ) : last && (
                            <div className={styles.feedback} role="status" aria-live="polite" aria-atomic="true">
                                <span className={styles.feedbackIcon}>{last.outcome === 'correct' ? <Check size={36} /> : last.outcome === 'timeout' ? <Clock3 size={36} /> : <Sparkles size={36} />}</span>
                                <h3>{last.outcome === 'correct' ? (game.streak >= 3 ? '¡Estás en racha!' : '¡Bien hecho!') : last.outcome === 'timeout' ? '¡Se acabó el tiempo!' : '¡De esta aprendemos!'}</h3>
                                <p className={styles.solution}>{equation(last.question.a, last.question.operation, last.question.b)} = <strong>{last.question.answer}</strong></p>
                                {last.outcome === 'correct' ? <p className={styles.points}>+{last.points} puntos <Zap size={18} /></p> : <>
                                    {last.outcome === 'wrong' && <p>Tu respuesta: {last.answer}</p>}
                                    <p className={styles.tip}><strong>Un truco para la próxima</strong>{last.question.explanation}</p>
                                </>}
                            </div>
                        )}
                    </div>
                    {phase === 'feedback' && last?.outcome !== 'correct' && (
                        <div className={styles.next}>
                            <p>{game.index === ROUND_SIZE - 1 ? 'Tu resultado' : 'Siguiente cálculo'} en {Math.ceil(game.remaining / 1000)} s</p>
                            <div className={styles.timeTrack}><span style={{ width: `${game.remaining / SOLUTION_TIME * 100}%` }} /></div>
                        </div>
                    )}
                    <button type="button" className={styles.back} onClick={() => dispatch({ type: 'reset' })}><ChevronLeft size={16} /> Volver a elegir nivel</button>
                </div>
            )}

            {game && phase === 'finished' && (
                <div className={styles.results}>
                    <span className={styles.heroIcon} aria-hidden="true"><Trophy size={38} /></span>
                    <p className={styles.eyebrow}>RETO COMPLETADO</p>
                    <h2 tabIndex={-1} ref={heading}>{right === 10 ? '¡Una mente relámpago!' : right >= 7 ? '¡Menuda energía mental!' : '¡Cada intento te hace mejorar!'}</h2>
                    <p>Has acertado <strong>{right} de {ROUND_SIZE}</strong>. {right === 10 ? '¡Pleno de aciertos!' : 'Vuelve a intentarlo y supera tu marca.'}</p>
                    <div className={styles.resultStats}>
                        <div><Trophy size={22} /><strong>{game.score}</strong><span>puntos</span></div>
                        <div><Flame size={22} /><strong>{game.bestStreak}</strong><span>mejor racha</span></div>
                        <div><Zap size={22} /><strong>{Math.max(personalBest, game.score)}</strong><span>récord personal</span></div>
                    </div>
                    {game.score > personalBest && <p className={styles.record}><Sparkles size={18} /> ¡Nuevo récord para este curso y estas operaciones!</p>}
                    <p className={styles.help}>100 puntos por acierto, hasta 50 por rapidez y hasta 50 por racha. El récord se guarda en este navegador.</p>
                    <div className={styles.resultActions}>
                        <button type="button" className={styles.primary} onClick={start}><RotateCcw size={18} /> Jugar otra vez</button>
                        <button type="button" className={styles.secondary} onClick={() => dispatch({ type: 'reset' })}>Cambiar nivel</button>
                    </div>
                    <div className={styles.review}>
                        <h3>{right === ROUND_SIZE ? 'Tus 10 aciertos' : 'Aprende de tus fallos'}</h3>
                        <p>{right === ROUND_SIZE ? '¡Así se hace! Estas son las cuentas que has resuelto.' : 'Ahora sin reloj: mira el truco y prueba a resolverlos de nuevo de cabeza.'}</p>
                        {game.results.filter((result) => right === ROUND_SIZE || result.outcome !== 'correct').map((result, i) => (
                            <div className={styles.reviewItem} key={i}>
                                <p><strong>{equation(result.question.a, result.question.operation, result.question.b)} = {result.question.answer}</strong><span>{result.outcome === 'timeout' ? 'Sin tiempo' : result.outcome === 'wrong' ? `Respondiste ${result.answer}` : '✓ Correcto'}</span></p>
                                <p>{result.question.explanation}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
