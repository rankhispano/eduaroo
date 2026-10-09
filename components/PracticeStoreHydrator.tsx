'use client';

import { useEffect } from 'react';
import { usePracticeStore } from '@/lib/learning/practiceStore';

// Carga el progreso guardado en el navegador tras el primer render
export default function PracticeStoreHydrator() {
    useEffect(() => {
        void usePracticeStore.persist.rehydrate();
    }, []);
    return null;
}
