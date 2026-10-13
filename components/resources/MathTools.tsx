'use client';
import { useState } from 'react';
import {
    angleName,
    fromRoman,
    makeArithmetic,
    toRoman,
    type ArithmeticQuestion,
    type Operation,
} from '@/lib/resources/learning';

const symbols: Record<Operation, string> = {
    sum: '+',
    subtract: '−',
    multiply: '×',
    divide: '÷',
};
export function ArithmeticTool({ slug }: { slug: string }) {
    const initial: Operation =
        slug === 'tablas-de-multiplicar'
            ? 'multiply'
            : slug === 'divisiones-para-ninos'
              ? 'divide'
              : 'sum';
    const [operation, setOperation] = useState<Operation>(initial);
    const [level, setLevel] = useState(1);
    const [table, setTable] = useState(2);
    const [question, setQuestion] = useState<ArithmeticQuestion | null>(null);
    const [answer, setAnswer] = useState('');
    const [remainder, setRemainder] = useState('');
    const [checked, setChecked] = useState(false);
    const [score, setScore] = useState({ right: 0, total: 0 });
    function next(op = operation, difficulty = level, chosenTable = table) {
        setQuestion(
            makeArithmetic(
                op,
                slug === 'tablas-de-multiplicar' ? 3 : difficulty,
                slug === 'tablas-de-multiplicar' ? chosenTable : 0,
            ),
        );
        setAnswer('');
        setRemainder('');
        setChecked(false);
    }
    function configure(op: Operation, difficulty: number, chosenTable: number) {
        setOperation(op);
        setLevel(difficulty);
        setTable(chosenTable);
        setScore({ right: 0, total: 0 });
        setQuestion(null);
        setChecked(false);
    }
    const correct =
        question &&
        answer.trim() !== '' &&
        Number(answer) === question.answer &&
        (operation !== 'divide' ||
            (remainder.trim() !== '' &&
                Number(remainder) === question.remainder));
    return (
        <section className="resource-tool no-print">
            <h2 className="text-2xl font-black">Practica a tu ritmo</h2>
            <p>
                Sin límite de tiempo. Comprueba la respuesta y lee cómo
                resolverla.
            </p>
            <div className="flex flex-wrap gap-4">
                {(slug === 'sumas-y-restas' || slug === 'calculo-mental') && (
                    <label className="resource-label">
                        Operación
                        <select
                            className="resource-input"
                            value={operation}
                            onChange={(e) =>
                                configure(
                                    e.target.value as Operation,
                                    level,
                                    table,
                                )
                            }
                        >
                            {(slug === 'sumas-y-restas'
                                ? ['sum', 'subtract']
                                : Object.keys(symbols)
                            ).map((op) => (
                                <option key={op} value={op}>
                                    {
                                        (
                                            {
                                                sum: 'Sumas',
                                                subtract: 'Restas',
                                                multiply: 'Multiplicaciones',
                                                divide: 'Divisiones',
                                            } as Record<string, string>
                                        )[op]
                                    }
                                </option>
                            ))}
                        </select>
                    </label>
                )}
                {slug === 'tablas-de-multiplicar' ? (
                    <label className="resource-label">
                        Tabla
                        <select
                            className="resource-input"
                            value={table}
                            onChange={(e) =>
                                configure(
                                    operation,
                                    level,
                                    Number(e.target.value),
                                )
                            }
                        >
                            <option value={0}>Todas mezcladas</option>
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i} value={i + 1}>
                                    Tabla del {i + 1}
                                </option>
                            ))}
                        </select>
                    </label>
                ) : (
                    <label className="resource-label">
                        Dificultad
                        <select
                            className="resource-input"
                            value={level}
                            onChange={(e) =>
                                configure(
                                    operation,
                                    Number(e.target.value),
                                    table,
                                )
                            }
                        >
                            {[1, 2, 3].map((n) => (
                                <option key={n} value={n}>
                                    {operation === 'divide'
                                        ? [
                                              'Exactas',
                                              'Con resto',
                                              'Cocientes mayores',
                                          ][n - 1]
                                        : operation === 'multiply'
                                          ? [
                                                'Factores hasta 5',
                                                'Factores hasta 10',
                                                'Factores hasta 12',
                                            ][n - 1]
                                          : [
                                                'Números hasta 10',
                                                'Números hasta 20',
                                                'Números de dos cifras',
                                            ][n - 1]}
                                </option>
                            ))}
                        </select>
                    </label>
                )}
            </div>
            {!question ? (
                <button className="resource-button" onClick={() => next()}>
                    Empezar a practicar
                </button>
            ) : (
                <form
                    className="space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (checked) return;
                        setChecked(true);
                        setScore({
                            total: score.total + 1,
                            right: score.right + (correct ? 1 : 0),
                        });
                    }}
                >
                    <p className="text-4xl font-black">
                        {question.a} {symbols[operation]} {question.b} = ?
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <label className="resource-label">
                            {operation === 'divide'
                                ? 'Cociente'
                                : 'Tu respuesta'}
                            <input
                                autoComplete="off"
                                className="resource-input max-w-40"
                                inputMode="numeric"
                                type="number"
                                step="1"
                                min="0"
                                required
                                value={answer}
                                disabled={checked}
                                onChange={(e) => setAnswer(e.target.value)}
                            />
                        </label>
                        {operation === 'divide' && (
                            <label className="resource-label">
                                Resto
                                <input
                                    className="resource-input max-w-40"
                                    inputMode="numeric"
                                    type="number"
                                    step="1"
                                    min="0"
                                    required
                                    value={remainder}
                                    disabled={checked}
                                    onChange={(e) =>
                                        setRemainder(e.target.value)
                                    }
                                />
                            </label>
                        )}
                    </div>
                    {!checked ? (
                        <button className="resource-button" type="submit">
                            Comprobar
                        </button>
                    ) : (
                        <div className="space-y-3" aria-live="polite">
                            <p className="font-bold">
                                {correct
                                    ? '¡Correcto!'
                                    : 'Revisa el resultado.'}
                            </p>
                            <p>{question.explanation}</p>
                            <button
                                className="resource-button"
                                type="button"
                                onClick={() => next()}
                            >
                                Otra operación
                            </button>
                        </div>
                    )}
                    <p className="text-sm">
                        Aciertos: {score.right} / {score.total}
                    </p>
                </form>
            )}
            {slug === 'tablas-de-multiplicar' && (
                <details>
                    <summary className="cursor-pointer font-bold">
                        Consultar{' '}
                        {table ? `la tabla del ${table}` : 'todas las tablas'}
                    </summary>
                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                        {(table
                            ? [table]
                            : Array.from({ length: 12 }, (_, i) => i + 1)
                        ).map((n) => (
                            <div key={n}>
                                <h3 className="font-bold">Tabla del {n}</h3>
                                {Array.from({ length: 12 }, (_, i) => (
                                    <p key={i} className="text-base">
                                        {n} × {i + 1} = {n * (i + 1)}
                                    </p>
                                ))}
                            </div>
                        ))}
                    </div>
                </details>
            )}
        </section>
    );
}

function ClockFace({ hour, minute }: { hour: number; minute: number }) {
    return (
        <svg
            viewBox="0 0 240 240"
            className="mx-auto w-full max-w-72"
            role="img"
            aria-label={`Reloj: ${hour}:${String(minute).padStart(2, '0')}`}
        >
            <circle
                cx="120"
                cy="120"
                r="110"
                fill="#f0f9ff"
                stroke="#0369a1"
                strokeWidth="5"
            />
            {Array.from({ length: 12 }, (_, i) => {
                const angle = ((i + 1) * Math.PI) / 6;
                return (
                    <text
                        key={i}
                        x={120 + 90 * Math.sin(angle)}
                        y={126 - 90 * Math.cos(angle)}
                        textAnchor="middle"
                        fontSize="18"
                        fontWeight="bold"
                        fill="#0f172a"
                    >
                        {i + 1}
                    </text>
                );
            })}
            <line
                x1="120"
                y1="120"
                x2="120"
                y2="65"
                stroke="#0f172a"
                strokeWidth="8"
                strokeLinecap="round"
                transform={`rotate(${hour * 30 + minute / 2} 120 120)`}
            />
            <line
                x1="120"
                y1="120"
                x2="120"
                y2="38"
                stroke="#0284c7"
                strokeWidth="5"
                strokeLinecap="round"
                transform={`rotate(${minute * 6} 120 120)`}
            />
            <circle cx="120" cy="120" r="6" fill="#f97316" />
        </svg>
    );
}
export function ClockTool() {
    const [hour, setHour] = useState(8);
    const [minute, setMinute] = useState(30);
    const [quiz, setQuiz] = useState(false);
    const [guess, setGuess] = useState('');
    const [checked, setChecked] = useState(false);
    const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    return (
        <section className="resource-tool no-print">
            <h2 className="text-2xl font-black">Explora las horas</h2>
            <ClockFace hour={hour} minute={minute} />
            {quiz ? (
                <form
                    className="space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        setChecked(true);
                    }}
                >
                    <label className="resource-label">
                        ¿Qué hora ves? (de 01:00 a 12:59)
                        <input
                            className="resource-input"
                            type="text"
                            inputMode="text"
                            placeholder="08:30"
                            pattern="(0?[1-9]|1[0-2]):[0-5][0-9]"
                            required
                            value={guess}
                            onChange={(e) => {
                                setGuess(e.target.value);
                                setChecked(false);
                            }}
                        />
                    </label>
                    <button className="resource-button">Comprobar hora</button>
                    {checked && (
                        <p aria-live="polite">
                            {guess.padStart(5, '0') === time
                                ? '¡Correcto!'
                                : `El reloj marca ${time}. Mira primero la aguja corta y después los minutos.`}
                        </p>
                    )}
                </form>
            ) : (
                <>
                    <p className="text-center text-4xl font-black">{time}</p>
                    <label className="resource-label">
                        Hora: {hour}
                        <input
                            type="range"
                            min="1"
                            max="12"
                            value={hour}
                            onChange={(e) => setHour(Number(e.target.value))}
                        />
                    </label>
                    <label className="resource-label">
                        Minutos: {minute}
                        <input
                            type="range"
                            min="0"
                            max="55"
                            step="5"
                            value={minute}
                            onChange={(e) => setMinute(Number(e.target.value))}
                        />
                    </label>
                </>
            )}
            <div className="flex flex-wrap gap-3">
                <button
                    className="resource-button-secondary"
                    onClick={() => {
                        setQuiz(!quiz);
                        setChecked(false);
                        setGuess('');
                    }}
                >
                    {' '}
                    {quiz ? 'Volver a explorar' : 'Adivinar la hora'}
                </button>
                {quiz && (
                    <button
                        className="resource-button-secondary"
                        onClick={() => {
                            setHour(1 + Math.floor(Math.random() * 12));
                            setMinute(Math.floor(Math.random() * 12) * 5);
                            setChecked(false);
                            setGuess('');
                        }}
                    >
                        Otro reloj
                    </button>
                )}
            </div>
        </section>
    );
}
export function FractionTool() {
    const [denominator, setDenominator] = useState(8);
    const [numerator, setNumerator] = useState(3);
    return (
        <section className="resource-tool no-print">
            <h2 className="text-2xl font-black">Construye una fracción</h2>
            <div
                className="flex h-20 overflow-hidden rounded-xl border-2 border-sky-800"
                role="img"
                aria-label={`${numerator} de ${denominator} partes iguales coloreadas`}
            >
                {Array.from({ length: denominator }, (_, i) => (
                    <div
                        key={i}
                        className={`flex-1 border-r border-sky-800 last:border-0 ${i < numerator ? 'bg-sky-600' : 'bg-white'}`}
                    />
                ))}
            </div>
            <p className="text-center text-4xl font-black">
                {numerator} / {denominator}
            </p>
            <label className="resource-label">
                Denominador: {denominator}
                <input
                    type="range"
                    min="1"
                    max="12"
                    value={denominator}
                    onChange={(e) => {
                        setDenominator(Number(e.target.value));
                        setNumerator(
                            Math.min(numerator, Number(e.target.value)),
                        );
                    }}
                />
            </label>
            <label className="resource-label">
                Numerador: {numerator}
                <input
                    type="range"
                    min="0"
                    max={denominator}
                    value={numerator}
                    onChange={(e) => setNumerator(Number(e.target.value))}
                />
            </label>
            <p>
                La unidad tiene {denominator} partes iguales. Has coloreado{' '}
                {numerator}.{' '}
                {numerator === denominator
                    ? 'Está coloreada la unidad entera.'
                    : numerator === 0
                      ? 'Ninguna parte está coloreada.'
                      : ''}
            </p>
        </section>
    );
}
export function RomanTool() {
    const [value, setValue] = useState('44');
    const arabic = /^\d+$/.test(value.trim());
    const result = arabic ? toRoman(Number(value)) : fromRoman(value);
    return (
        <section className="resource-tool no-print">
            <h2 className="text-2xl font-black">
                Conversor de números romanos
            </h2>
            <label className="resource-label">
                Número del 1 al 3999 o número romano
                <input
                    className="resource-input"
                    maxLength={20}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="44 o XLIV"
                />
            </label>
            <p aria-live="polite" className="text-2xl font-bold">
                {result !== undefined
                    ? `${value.trim().toUpperCase()} = ${result}`
                    : 'Escribe un número del 1 al 3999 o una forma romana válida. Por ejemplo: XLIX.'}
            </p>
            <div className="flex flex-wrap gap-4">
                {Object.entries({
                    I: 1,
                    V: 5,
                    X: 10,
                    L: 50,
                    C: 100,
                    D: 500,
                    M: 1000,
                }).map(([symbol, n]) => (
                    <span
                        key={symbol}
                        className="rounded-lg bg-sky-50 p-3 font-bold text-slate-900"
                    >
                        {symbol} = {n}
                    </span>
                ))}
            </div>
        </section>
    );
}
export function AngleTool() {
    const [degrees, setDegrees] = useState(120);
    const radians = (degrees * Math.PI) / 180;
    const x = 160 + 110 * Math.cos(radians),
        y = 150 - 110 * Math.sin(radians);
    const arcX = 160 + 50 * Math.cos(radians),
        arcY = 150 - 50 * Math.sin(radians);
    return (
        <section className="resource-tool no-print">
            <h2 className="text-2xl font-black">Mueve el ángulo</h2>
            <svg
                viewBox="0 0 320 300"
                className="mx-auto w-full max-w-80"
                role="img"
                aria-label={`Ángulo ${angleName(degrees).toLowerCase()} de ${degrees} grados`}
            >
                {degrees === 360 ? (
                    <circle
                        cx="160"
                        cy="150"
                        r="50"
                        fill="#bae6fd"
                        stroke="#0284c7"
                    />
                ) : (
                    <path
                        d={`M160 150 L210 150 A50 50 0 ${degrees > 180 ? 1 : 0} 0 ${arcX} ${arcY} Z`}
                        fill="#bae6fd"
                        stroke="#0284c7"
                    />
                )}
                <line
                    x1="160"
                    y1="150"
                    x2="280"
                    y2="150"
                    stroke="#0f172a"
                    strokeWidth="5"
                />
                <line
                    x1="160"
                    y1="150"
                    x2={x}
                    y2={y}
                    stroke="#0369a1"
                    strokeWidth="5"
                />
                <circle cx="160" cy="150" r="5" fill="#f97316" />
            </svg>
            <p className="text-center text-3xl font-black">
                {degrees}° · {angleName(degrees)}
            </p>
            <label className="resource-label">
                Medida en grados
                <input
                    type="range"
                    min="0"
                    max="360"
                    step="5"
                    value={degrees}
                    onChange={(e) => setDegrees(Number(e.target.value))}
                />
            </label>
            <div className="flex flex-wrap gap-2">
                {[0, 45, 90, 120, 180, 270, 360].map((n) => (
                    <button
                        className="resource-button-secondary"
                        key={n}
                        onClick={() => setDegrees(n)}
                    >
                        {n}°
                    </button>
                ))}
            </div>
        </section>
    );
}
