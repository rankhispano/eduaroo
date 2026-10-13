'use client';
import { useState } from 'react';
export function PrintButton() {
    return (
        <button
            type="button"
            className="resource-button no-print"
            onClick={() => window.print()}
        >
            Imprimir o guardar como PDF
        </button>
    );
}
export function HandwritingTool() {
    const [text, setText] = useState('La luna brilla.\nAprendo cada día.');
    const [size, setSize] = useState(32);
    const [guide, setGuide] = useState('lines');
    const [copies, setCopies] = useState(2);
    return (
        <section className="resource-tool">
            <div className="no-print space-y-4">
                <h2 className="text-2xl font-black">
                    Prepara tu ficha de escritura
                </h2>
                <label className="resource-label">
                    Texto del modelo (una frase por línea)
                    <textarea
                        className="resource-input"
                        maxLength={500}
                        rows={3}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </label>
                <div className="flex flex-wrap gap-4">
                    <label className="resource-label">
                        Tamaño
                        <select
                            className="resource-input"
                            value={size}
                            onChange={(e) => setSize(Number(e.target.value))}
                        >
                            {[24, 32, 40].map((n) => (
                                <option key={n} value={n}>
                                    {n} px
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="resource-label">
                        Pauta
                        <select
                            className="resource-input"
                            value={guide}
                            onChange={(e) => setGuide(e.target.value)}
                        >
                            <option value="lines">Dos líneas</option>
                            <option value="grid">Cuadrícula</option>
                        </select>
                    </label>
                    <label className="resource-label">
                        Renglones para copiar
                        <select
                            className="resource-input"
                            value={copies}
                            onChange={(e) => setCopies(Number(e.target.value))}
                        >
                            {[1, 2, 3].map((n) => (
                                <option key={n}>{n}</option>
                            ))}
                        </select>
                    </label>
                </div>
                <PrintButton />
            </div>
            <div className="print-sheet rounded-xl border bg-white p-6 text-slate-900">
                <h3 className="mb-3 text-xl font-bold">
                    Mi ficha de caligrafía · Eduaroo
                </h3>
                <p className="mb-6 text-sm">
                    Nombre: ____________________ Fecha: ______________
                </p>
                {text
                    .split('\n')
                    .filter((line) => line.trim())
                    .slice(0, 8)
                    .map((line, i) => (
                        <div key={i} className="print-keep mb-6">
                            <p
                                style={{
                                    fontSize: size,
                                    lineHeight: '1.6',
                                    fontFamily: 'Arial, sans-serif',
                                    overflowWrap: 'anywhere',
                                }}
                            >
                                {line}
                            </p>
                            {Array.from({ length: copies }, (_, j) => (
                                <div
                                    key={j}
                                    className={`handwriting-line ${guide === 'grid' ? 'handwriting-grid' : ''}`}
                                    style={{ height: size * 1.8 }}
                                />
                            ))}
                        </div>
                    ))}
                <p className="mt-4 text-xs">
                    eduaroo.com · Copia el modelo a tu ritmo.
                </p>
            </div>
        </section>
    );
}
const weekdays = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
];
export function TimetableTool() {
    const [days, setDays] = useState(5);
    const [rows, setRows] = useState(6);
    const [cells, setCells] = useState<Record<string, string>>({});
    const [hours, setHours] = useState<Record<string, string>>({});
    return (
        <section className="resource-tool">
            <div className="no-print space-y-4">
                <h2 className="text-2xl font-black">Tu horario semanal</h2>
                <div className="flex flex-wrap gap-4">
                    <label className="resource-label">
                        Días
                        <select
                            className="resource-input"
                            value={days}
                            onChange={(e) => setDays(Number(e.target.value))}
                        >
                            <option value="5">Lunes a viernes</option>
                            <option value="7">Semana completa</option>
                        </select>
                    </label>
                    <label className="resource-label">
                        Franjas
                        <select
                            className="resource-input"
                            value={rows}
                            onChange={(e) => setRows(Number(e.target.value))}
                        >
                            {[4, 5, 6, 7, 8].map((n) => (
                                <option key={n}>{n}</option>
                            ))}
                        </select>
                    </label>
                </div>
                <PrintButton />
                <p className="text-sm">
                    Edita las casillas. Para conservar el horario, guárdalo como
                    PDF antes de cerrar la página. Puedes elegir orientación
                    horizontal al imprimir.
                </p>
            </div>
            <div className="overflow-x-auto">
                <div className="print-sheet timetable-sheet rounded-xl bg-white p-4 text-slate-900">
                    <h3 className="mb-2 text-xl font-bold">
                        Mi horario escolar · Eduaroo
                    </h3>
                    <p className="mb-5 text-sm">
                        Nombre: _______________________ Curso: ________
                    </p>
                    <table className="w-full min-w-[600px] table-fixed border-collapse text-sm">
                        <thead>
                            <tr>
                                <th className="w-24 border p-2" scope="col">
                                    Hora
                                </th>
                                {weekdays.slice(0, days).map((day) => (
                                    <th
                                        scope="col"
                                        className="border bg-sky-50 p-2"
                                        key={day}
                                    >
                                        {day}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: rows }, (_, row) => (
                                <tr key={row}>
                                    <th scope="row" className="border p-1">
                                        <input
                                            className="no-print w-full rounded p-1 text-sm"
                                            aria-label={`Hora de la franja ${row + 1}`}
                                            value={hours[row] ?? ''}
                                            placeholder="09:00"
                                            maxLength={30}
                                            onChange={(e) =>
                                                setHours({
                                                    ...hours,
                                                    [row]: e.target.value,
                                                })
                                            }
                                        />
                                        <span className="print-only">
                                            {hours[row] || '________'}
                                        </span>
                                    </th>
                                    {weekdays.slice(0, days).map((day) => (
                                        <td
                                            className="border p-1 align-top"
                                            key={day}
                                        >
                                            <textarea
                                                aria-label={`${day}, franja ${row + 1}`}
                                                maxLength={80}
                                                className="no-print h-20 w-full resize-none rounded p-1"
                                                value={
                                                    cells[`${row}/${day}`] ?? ''
                                                }
                                                onChange={(e) =>
                                                    setCells({
                                                        ...cells,
                                                        [`${row}/${day}`]:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                            <span className="print-only whitespace-pre-wrap break-words">
                                                {cells[`${row}/${day}`] || ' '}
                                            </span>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p className="mt-4 text-xs">eduaroo.com</p>
                </div>
            </div>
        </section>
    );
}
