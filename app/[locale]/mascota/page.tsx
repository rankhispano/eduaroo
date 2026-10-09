import type { Metadata } from 'next';
import RooMascot, { type RooPose } from '@/components/mascot/RooMascot';

export const metadata: Metadata = { title: 'Conoce a Roo' };

const POSES: { pose: RooPose; name: string; use: string }[] = [
    { pose: 'idle', name: 'En reposo', use: 'Cabeceras y espacios tranquilos' },
    { pose: 'wave', name: 'Saluda', use: 'Bienvenida en Mi mapa' },
    { pose: 'celebrate', name: 'Celebra', use: 'Acierto y bloque terminado' },
    { pose: 'encourage', name: 'Anima', use: 'Fallo: «¡casi, tú puedes!»' },
    { pose: 'think', name: 'Piensa', use: 'Pistas, buscador y examen' },
    { pose: 'point', name: 'Señala', use: '«¡Aquí!» y seguir por donde ibas' },
    { pose: 'read', name: 'Lee', use: 'Ideas clave antes de practicar' },
    { pose: 'calculator', name: 'Calcula', use: 'Región de Matemáticas' },
    { pose: 'sleep', name: 'Duerme', use: 'Nada que repasar hoy' },
];

// Galería de poses de la mascota (referencia para diseño y desarrollo)
export default function Page() {
    return (
        <div className="mx-auto max-w-5xl px-4 pb-16 pt-8">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white">Conoce a Roo</h1>
            <p className="mt-2 text-lg font-semibold text-slate-600 dark:text-slate-300">
                La mascota de Eduaroo en SVG animado. Cada pose está pensada para un momento de la app.
            </p>
            <ul className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3">
                {POSES.map(({ pose, name, use }) => (
                    <li key={pose} className="flex flex-col items-center gap-2 rounded-3xl bg-white p-5 text-center shadow-sm dark:bg-slate-900">
                        <RooMascot pose={pose} size={170} />
                        <span className="text-lg font-black text-slate-900 dark:text-white">{name}</span>
                        <code className="text-xs text-slate-400">pose=&quot;{pose}&quot;</code>
                        <span className="text-sm font-semibold text-slate-500">{use}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
