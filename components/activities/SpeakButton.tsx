'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { Volume2, Square } from 'lucide-react';
import { useTranslations } from 'next-intl';

const subscribe = () => () => {};
const isSupported = () => 'speechSynthesis' in window;

// Lectura en voz alta (DUA): ayuda a quien todavía no lee con soltura.
// Con autoPlay lee el texto al aparecer (Peques de 1º-2º).
export default function SpeakButton({ text, lang = 'es', autoPlay = false }: { text: string; lang?: 'es' | 'en'; autoPlay?: boolean }) {
    const t = useTranslations('Activities');
    const supported = useSyncExternalStore(subscribe, isSupported, () => false);
    const [speaking, setSpeaking] = useState(false);

    const speak = () => {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text.replace(/_{2,}/g, '...'));
        utterance.lang = lang === 'en' ? 'en-GB' : 'es-ES';
        utterance.rate = 0.9;
        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => setSpeaking(false);
        utterance.onerror = () => setSpeaking(false);
        synth.cancel();
        synth.speak(utterance);
    };

    useEffect(() => {
        if (autoPlay && 'speechSynthesis' in window) speak();
        return () => {
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        };
        // Solo al montar: cada actividad monta su propio botón
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!supported) return null;

    const toggle = () => {
        if (speaking) {
            window.speechSynthesis.cancel();
            setSpeaking(false);
            return;
        }
        speak();
    };

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label={speaking ? t('stop') : t('listen')}
            title={speaking ? t('stop') : t('listen')}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-slate-600 shadow ring-1 ring-slate-200 transition hover:bg-slate-100 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-700"
        >
            {speaking ? <Square className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
    );
}
