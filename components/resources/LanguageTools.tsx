'use client';
import { useEffect, useState } from 'react';
import {
    compareDictation,
    dictationTexts,
    pronouns,
    syllableBank,
    verbModels,
} from '@/lib/resources/learning';
import { PrintButton } from './PrintTools';

export function DictationTool() {
    const [grade, setGrade] = useState('1');
    const [index, setIndex] = useState(0);
    const [written, setWritten] = useState('');
    const [checked, setChecked] = useState(false);
    const [model, setModel] = useState(false);
    const [audioError, setAudioError] = useState('');
    const text = dictationTexts[grade][index];
    const comparison = compareDictation(text, written);
    useEffect(
        () => () => {
            window.speechSynthesis?.cancel();
        },
        [],
    );
    function speak() {
        if (!('speechSynthesis' in window)) {
            setAudioError(
                'Este navegador no ofrece lectura en voz alta. Muestra el modelo para que lo lea una persona adulta.',
            );
            return;
        }
        window.speechSynthesis.cancel();
        const message = new SpeechSynthesisUtterance(text);
        message.lang = 'es-ES';
        message.rate = 0.75;
        message.onerror = () =>
            setAudioError(
                'No se pudo reproducir la voz. Puedes mostrar el modelo para que lo lea una persona adulta.',
            );
        setAudioError('');
        window.speechSynthesis.speak(message);
    }
    function reset() {
        window.speechSynthesis?.cancel();
        setWritten('');
        setChecked(false);
        setModel(false);
        setAudioError('');
    }
    return (
        <section className="resource-tool">
            <div className="no-print space-y-4">
                <h2 className="text-2xl font-black">Escucha y escribe</h2>
                <label className="resource-label">
                    Curso
                    <select
                        className="resource-input"
                        value={grade}
                        onChange={(e) => {
                            setGrade(e.target.value);
                            setIndex(0);
                            reset();
                        }}
                    >
                        {Object.keys(dictationTexts).map((g) => (
                            <option key={g} value={g}>
                                {g}º de Primaria
                            </option>
                        ))}
                    </select>
                </label>
                <div className="flex flex-wrap gap-3">
                    <button className="resource-button" onClick={speak}>
                        Escuchar el dictado
                    </button>
                    <button
                        className="resource-button-secondary"
                        onClick={() => setModel(!model)}
                    >
                        {model
                            ? 'Ocultar modelo'
                            : 'Mostrar modelo para un adulto'}
                    </button>
                </div>
                {audioError && <p role="status">{audioError}</p>}
                {model && (
                    <p className="rounded-lg bg-sky-50 p-4 text-slate-900">
                        {text}
                    </p>
                )}
                <form
                    className="space-y-3"
                    onSubmit={(e) => {
                        e.preventDefault();
                        setChecked(true);
                    }}
                >
                    <label className="resource-label">
                        Escribe la frase que has oído
                        <textarea
                            className="resource-input"
                            rows={3}
                            required
                            spellCheck={false}
                            autoCorrect="off"
                            autoCapitalize="off"
                            maxLength={500}
                            value={written}
                            onChange={(e) => {
                                setWritten(e.target.value);
                                setChecked(false);
                            }}
                        />
                    </label>
                    <button className="resource-button">
                        Comparar con el modelo
                    </button>
                </form>
                {checked && (
                    <div aria-live="polite" className="space-y-3">
                        <p className="font-bold">
                            {comparison.exact
                                ? '¡Coincide con el modelo!'
                                : 'Compara las diferencias con el modelo.'}
                        </p>
                        <p>
                            {comparison.model.map((word, i) => (
                                <span
                                    key={i}
                                    className={`mr-1 inline-block rounded px-1 ${comparison.matches[i] ? 'bg-emerald-100 text-emerald-950' : 'bg-amber-100 text-amber-950'}`}
                                >
                                    {word}{' '}
                                </span>
                            ))}
                        </p>
                        <p className="text-sm">
                            Las palabras marcadas en amarillo difieren en esta
                            posición. Si añadiste o quitaste una palabra, revisa
                            también las que van después. Se respetan tildes,
                            mayúsculas y puntuación.
                        </p>
                        {comparison.answer.length > comparison.model.length && (
                            <p>
                                Tu versión tiene{' '}
                                {comparison.answer.length -
                                    comparison.model.length}{' '}
                                palabras más que el modelo.
                            </p>
                        )}
                    </div>
                )}
                <div className="flex flex-wrap gap-3">
                    <button
                        className="resource-button-secondary"
                        onClick={() => {
                            setIndex(
                                (index + 1) % dictationTexts[grade].length,
                            );
                            reset();
                        }}
                    >
                        Siguiente dictado ({index + 1}/
                        {dictationTexts[grade].length})
                    </button>
                    <PrintButton />
                </div>
            </div>
            <div className="print-sheet print-only">
                <h3>Dictados de {grade}º · Eduaroo</h3>
                {dictationTexts[grade].map((sentence, i) => (
                    <div className="print-keep" key={sentence}>
                        <p>
                            {i + 1}. {sentence}
                        </p>
                        <div className="handwriting-line" />
                        <div className="handwriting-line" />
                    </div>
                ))}
            </div>
        </section>
    );
}
export function SyllablesTool() {
    const [word, setWord] = useState('mariposa');
    const [show, setShow] = useState(false);
    const [guess, setGuess] = useState('');
    const [checked, setChecked] = useState(false);
    const syllables = syllableBank[word];
    return (
        <section className="resource-tool no-print">
            <h2 className="text-2xl font-black">Banco de palabras revisadas</h2>
            <p>
                Explora {Object.keys(syllableBank).length} palabras. Pronuncia
                una, cuenta sus sílabas y comprueba después.
            </p>
            <label className="resource-label">
                Palabra
                <select
                    className="resource-input"
                    value={word}
                    onChange={(e) => {
                        setWord(e.target.value);
                        setShow(false);
                        setChecked(false);
                        setGuess('');
                    }}
                >
                    {Object.keys(syllableBank).map((w) => (
                        <option key={w}>{w}</option>
                    ))}
                </select>
            </label>
            <p className="text-3xl font-black">{word}</p>
            <form
                className="space-y-3"
                onSubmit={(e) => {
                    e.preventDefault();
                    setChecked(true);
                    setShow(true);
                }}
            >
                <label className="resource-label">
                    ¿Cuántas sílabas tiene?
                    <input
                        className="resource-input max-w-32"
                        type="number"
                        min="1"
                        max="8"
                        required
                        value={guess}
                        onChange={(e) => setGuess(e.target.value)}
                    />
                </label>
                <button className="resource-button">Comprobar sílabas</button>
            </form>
            {show && (
                <div aria-live="polite">
                    <p className="text-2xl font-bold">
                        {syllables.join(' · ')}
                    </p>
                    <p>
                        {checked && Number(guess) === syllables.length
                            ? '¡Correcto! '
                            : ''}
                        {syllables.length}{' '}
                        {syllables.length === 1 ? 'sílaba' : 'sílabas'}.
                    </p>
                </div>
            )}
        </section>
    );
}
const tenseNames: Record<string, string> = {
    presente: 'Presente',
    preterito: 'Pretérito perfecto simple',
    futuro: 'Futuro simple',
};
export function VerbsTool() {
    const [verb, setVerb] = useState('hablar');
    const [tense, setTense] = useState('presente');
    const [person, setPerson] = useState(0);
    const [written, setWritten] = useState('');
    const [checked, setChecked] = useState(false);
    const forms = verbModels[verb][tense];
    function reset() {
        setWritten('');
        setChecked(false);
    }
    return (
        <section className="resource-tool no-print">
            <h2 className="text-2xl font-black">Conjuga un verbo</h2>
            <div className="flex flex-wrap gap-3">
                <label className="resource-label">
                    Verbo
                    <select
                        className="resource-input"
                        value={verb}
                        onChange={(e) => {
                            setVerb(e.target.value);
                            reset();
                        }}
                    >
                        {Object.keys(verbModels).map((v) => (
                            <option key={v}>{v}</option>
                        ))}
                    </select>
                </label>
                <label className="resource-label">
                    Tiempo
                    <select
                        className="resource-input"
                        value={tense}
                        onChange={(e) => {
                            setTense(e.target.value);
                            reset();
                        }}
                    >
                        {Object.entries(tenseNames).map(([t, label]) => (
                            <option key={t} value={t}>
                                {label}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="resource-label">
                    Persona
                    <select
                        className="resource-input"
                        value={person}
                        onChange={(e) => {
                            setPerson(Number(e.target.value));
                            reset();
                        }}
                    >
                        {pronouns.map((p, i) => (
                            <option key={p} value={i}>
                                {p}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <form
                className="space-y-3"
                onSubmit={(e) => {
                    e.preventDefault();
                    setChecked(true);
                }}
            >
                <label className="resource-label">
                    {pronouns[person]} + {verb} · {tenseNames[tense]}
                    <input
                        className="resource-input"
                        spellCheck={false}
                        autoComplete="off"
                        required
                        value={written}
                        onChange={(e) => {
                            setWritten(e.target.value);
                            setChecked(false);
                        }}
                    />
                </label>
                <button className="resource-button">
                    Comprobar conjugación
                </button>
            </form>
            {checked && (
                <p aria-live="polite">
                    {written.trim().normalize('NFC').toLowerCase() ===
                    forms[person]
                        ? '¡Correcto!'
                        : `La forma es «${forms[person]}». Revisa la persona y el tiempo.`}
                </p>
            )}
            <details>
                <summary className="cursor-pointer font-bold">
                    Ver el modelo completo
                </summary>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-base">
                    {pronouns.map((p, i) => (
                        <div key={p}>
                            <dt>{p}</dt>
                            <dd className="font-bold">{forms[i]}</dd>
                        </div>
                    ))}
                </dl>
            </details>
        </section>
    );
}
export function PreschoolTool() {
    const [count, setCount] = useState(4);
    const [shape, setShape] = useState('⭐');
    const [answer, setAnswer] = useState<number | null>(null);
    return (
        <section className="resource-tool no-print">
            <h2 className="text-2xl font-black">Cuenta y busca formas</h2>
            <p>Una persona adulta puede leer: ¿cuántos dibujos hay?</p>
            <label className="resource-label">
                Dibujos
                <select
                    className="resource-input"
                    value={shape}
                    onChange={(e) => {
                        setShape(e.target.value);
                        setAnswer(null);
                    }}
                >
                    <option value="⭐">Estrellas</option>
                    <option value="🔵">Círculos azules</option>
                    <option value="🔺">Triángulos</option>
                    <option value="🟩">Cuadrados verdes</option>
                </select>
            </label>
            <div
                className="flex max-w-sm flex-wrap gap-4 text-4xl"
                aria-label={`${count} dibujos`}
            >
                {Array.from({ length: count }, (_, i) => (
                    <span key={i}>{shape}</span>
                ))}
            </div>
            <div className="flex flex-wrap gap-2">
                {Array.from({ length: 10 }, (_, i) => (
                    <button
                        className="resource-button-secondary"
                        aria-label={`${i + 1} dibujos`}
                        key={i}
                        onClick={() => setAnswer(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
            {answer !== null && (
                <p aria-live="polite">
                    {answer === count
                        ? '¡Los has contado todos!'
                        : `Vamos a contarlos señalando cada dibujo. Hay ${count}.`}
                </p>
            )}
            <button
                className="resource-button"
                onClick={() => {
                    setCount(1 + Math.floor(Math.random() * 10));
                    setAnswer(null);
                }}
            >
                Otro grupo
            </button>
        </section>
    );
}
