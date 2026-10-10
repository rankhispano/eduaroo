'use client';

import MiMapa from '@/components/map/MiMapa';
import RooMascot from '@/components/mascot/RooMascot';
import { usePracticeStore } from '@/lib/learning/practiceStore';

// La portada es siempre "Mi mapa"; mientras se lee el progreso del navegador se muestra a Roo
export default function HomePage() {
    const hydrated = usePracticeStore((s) => s.hydrated);

    if (!hydrated) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center bg-linear-to-b from-sky-100 to-white dark:from-slate-950 dark:to-slate-900">
                <RooMascot pose="wave" size={140} />
            </div>
        );
    }
    return <MiMapa />;
}
