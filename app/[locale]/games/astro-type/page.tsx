'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, Play, Trophy, RotateCcw, ShieldAlert, Zap, Star, LayoutGrid, Gamepad2, Heart, Flame, Rocket, Skull } from 'lucide-react';
import { Tooltip } from '@/components/ui/tooltip';
import { Link } from '@/i18n/navigation';
import NextImage from 'next/image';
import { useTranslations } from 'next-intl';

/**
 * --- CONFIGURACIÓN Y DATOS ---
 */

const APP_TITLE = "ASTROTYPE";

// Piscinas de palabras ampliadas para mayor variedad
const WORD_POOLS = {
    1: [ // Índices (F, J) - Combinaciones abstractas para memoria muscular
        'f', 'j', 'ff', 'jj', 'jf', 'fj', 'fjf', 'jfj', 'jjf', 'ffj', 'fff', 'jjj', 'fjfj', 'jfjf', 'jff', 'fjj'
    ],
    2: [ // Medios (D, K) + F, J - Primeras sílabas
        'da', 'ka', 'dad', 'kad', 'fad', 'jak', 'dak', 'faj', 'kaka', 'jada', 'daka', 'fada', 'kaja', 'df', 'jk', 'fd'
    ],
    3: [ // Anulares (S, L) + anteriores - Palabras reales simples
        'sal', 'las', 'ala', 'all', 'fall', 'flask', 'ask', 'sad', 'dad', 'lad', 'salsa', 'fals', 'lass', 'salad', 'hall', 'has', 'dash', 'slash', 'flash'
    ],
    4: [ // Meñiques (A, Ñ, ;) + anteriores
        'ana', 'aña', 'ala', 'alala', 'faja', 'jajaja', 'sana', 'lana', 'nana', 'dada', 'fala', 'ala', 'kalan', 'ñame', 'ñandu', 'saña', 'jass', 'fasa'
    ],
    5: [ // Fila Superior (QWERTY...) - Inglés y Español mezclado por teclas comunes
        'top', 'tree', 'try', 'toy', 'you', 'we', 'are', 'were', 'root', 'route', 'power', 'tower', 'quit', 'quiet', 'write', 'type', 'pero', 'tu', 'yo', 'rio', 'tio'
    ],
    6: [ // Fila Inferior (ZXCV...)
        'zone', 'van', 'ban', 'man', 'moon', 'name', 'back', 'cab', 'zack', 'axon', 'bann', 'vroom', 'zero', 'axe', 'box', 'nube', 'boca', 'vac', 'moco', 'zorro'
    ],
    7: [ // Mayúsculas y Frases cortas
        'Hola', 'Mundo', 'Sol', 'Luna', 'Mar', 'Luz', 'Roma', 'Paris', 'Ana', 'Jose', 'El', 'La', 'Un', 'Una', 'Tres', 'Gato', 'Perro', 'Casa', 'Avion', 'Nave'
    ],
    8: [ // Símbolos y Números
        '123', '456', '789', '100%', '(#)', '$10', '1+1=2', 'a@b.com', 'www.', 'http', '(*)', '3.14', '10:00', 'R2-D2', 'C-3PO', '< >', '{ }', '[ ]', '50%'
    ]
};

const CURRICULUM = [
    { id: 1, pool: 1, minWpm: 5 },
    { id: 2, pool: 2, minWpm: 7 },
    { id: 3, pool: 3, minWpm: 9 },
    { id: 4, pool: 4, minWpm: 11 },
    { id: 5, pool: 5, minWpm: 13 },
    { id: 6, pool: 6, minWpm: 15 },
    { id: 7, pool: 7, minWpm: 18 },
    { id: 8, pool: 8, minWpm: 20 },
];

// Función para generar lección aleatoria MEJORADA
const generateLesson = (levelId: number) => {
    const pool = WORD_POOLS[levelId as keyof typeof WORD_POOLS] || WORD_POOLS[1];
    let lesson: string[] = [];
    let lastWord = '';

    // Generamos 25 palabras para que la sesión dure un poco más
    for (let i = 0; i < 25; i++) {
        let randomWord;
        // Evitar repetición inmediata (back-to-back duplicates)
        do {
            randomWord = pool[Math.floor(Math.random() * pool.length)];
        } while (randomWord === lastWord && pool.length > 1);

        lesson.push(randomWord);
        lastWord = randomWord;
    }
    return lesson.join(' ');
};

const FINGER_MAP: Record<string, string> = {
    'q': 'bg-red-400', 'a': 'bg-red-400', 'z': 'bg-red-400', '1': 'bg-red-400',
    'w': 'bg-orange-400', 's': 'bg-orange-400', 'x': 'bg-orange-400', '2': 'bg-orange-400',
    'e': 'bg-yellow-400', 'd': 'bg-yellow-400', 'c': 'bg-yellow-400', '3': 'bg-yellow-400',
    'r': 'bg-green-400', 'f': 'bg-green-400', 'v': 'bg-green-400', '4': 'bg-green-400',
    't': 'bg-green-400', 'g': 'bg-green-400', 'b': 'bg-green-400', '5': 'bg-green-400',
    'y': 'bg-sky-400', 'h': 'bg-sky-400', 'n': 'bg-sky-400', '6': 'bg-sky-400',
    'u': 'bg-sky-400', 'j': 'bg-sky-400', 'm': 'bg-sky-400', '7': 'bg-sky-400',
    'i': 'bg-blue-400', 'k': 'bg-blue-400', ',': 'bg-blue-400', '8': 'bg-blue-400',
    'o': 'bg-indigo-400', 'l': 'bg-indigo-400', '.': 'bg-indigo-400', '9': 'bg-indigo-400',
    'p': 'bg-purple-400', 'ñ': 'bg-purple-400', ';': 'bg-purple-400', '-': 'bg-purple-400',
    '0': 'bg-purple-400', '/': 'bg-purple-400', "'": 'bg-purple-400'
};

/**
 * COMPONENTES DE UI
 */
const Letter = React.memo(({ char, status, isActive }: { char: string, status: string, isActive: boolean }) => {
    let baseClasses = "font-mono text-3xl transition-all duration-200 px-0.5 rounded-md ";
    if (isActive) baseClasses += "border-b-4 border-yellow-400 bg-slate-700 animate-pulse text-white scale-110 ";
    else if (status === 'correct') baseClasses += "text-green-400 ";
    else if (status === 'incorrect') baseClasses += "text-red-400 bg-red-900/20 ";
    else baseClasses += "text-slate-500 ";

    return <span className={baseClasses}>{char === ' ' ? '␣' : char}</span>;
});
Letter.displayName = 'Letter';

const VirtualKeyboard = ({ activeKey, t }: { activeKey: string, t: any }) => {
    const rows = [
        ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ñ'],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.']
    ];
    return (
        <div className="w-full max-w-4xl mx-auto p-4 bg-slate-800 rounded-3xl shadow-xl border-b-8 border-slate-950 mt-8 select-none scale-90 md:scale-100">
            <div className="flex flex-col gap-2 items-center">
                {rows.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex gap-2">
                        {row.map((keyChar) => {
                            const isMatch = activeKey.toLowerCase() === keyChar;
                            const fingerColor = FINGER_MAP[keyChar] || 'bg-slate-600';
                            return (
                                <div key={keyChar} className={`flex items-center justify-center w-8 h-8 md:w-12 md:h-12 rounded-xl text-lg font-bold uppercase transition-all duration-150 ${isMatch ? `${fingerColor} text-white transform -translate-y-1 scale-110 shadow-lg` : 'bg-slate-700 text-slate-400 border-b-4 border-slate-900'}`}>{keyChar}</div>
                            );
                        })}
                    </div>
                ))}
                <div className={`mt-2 w-48 md:w-64 h-10 md:h-12 rounded-xl flex items-center justify-center transition-all ${activeKey === ' ' ? 'bg-purple-500 text-white' : 'bg-slate-700 border-b-4 border-slate-900 text-slate-500'}`}>{t('space')}</div>
            </div>
        </div>
    );
};

/**
 * --- APP PRINCIPAL ---
 */
export default function AstroTypePage() {
    const t = useTranslations('GamesPage.astroTypeMessages');
    // Navigation State
    const [view, setView] = useState<'menu' | 'lesson' | 'arcade-select' | 'arcade-game' | 'results'>('menu');

    // Lesson State
    const [levelIndex, setLevelIndex] = useState(0);
    const [lessonText, setLessonText] = useState('');
    const [input, setInput] = useState('');
    const [startTime, setStartTime] = useState<number | null>(null);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [xp, setXp] = useState(0);
    const [errors, setErrors] = useState(0);
    const [lessonResult, setLessonResult] = useState<'won' | 'lost'>('won');

    // Arcade State (Visual)
    const [arcadeMode, setArcadeMode] = useState<'letters' | 'words'>('letters');
    const [lives, setLives] = useState(3);
    const [score, setScore] = useState(0);
    const [fallingItems, setFallingItems] = useState<{ id: number, text: string, x: number, y: number, speed: number }[]>([]);
    const [arcadeInput, setArcadeInput] = useState('');

    // Arcade Refs (Lógica física para el loop)
    const itemsRef = useRef<{ id: number, text: string, x: number, y: number, speed: number }[]>([]);
    const lastTimeRef = useRef<number>(0);
    const spawnTimerRef = useRef<number>(0);
    const spawnRateRef = useRef<number>(2000);
    const gameRunningRef = useRef(false);
    const animationFrameRef = useRef<number>(0);
    const arcadeModeRef = useRef<'letters' | 'words'>('letters'); // Para acceso dentro del loop

    // Estadísticas Globales
    const [careerStats, setCareerStats] = useState({ gamesPlayed: 0, avgWpm: 0, avgAcc: 0 });

    // Persistencia XP y Stats
    useEffect(() => {
        const savedXp = localStorage.getItem('spaceType_xp');
        if (savedXp) setXp(parseInt(savedXp));

        const savedStats = localStorage.getItem('spaceType_stats');
        if (savedStats) {
            setCareerStats(JSON.parse(savedStats));
        }
    }, []);

    // Actualizar refs cuando cambia el modo
    useEffect(() => {
        arcadeModeRef.current = arcadeMode;
    }, [arcadeMode]);

    /**
     * --- LÓGICA MODO LECCIÓN ---
     */
    const startLesson = (idx: number) => {
        setLevelIndex(idx);
        setLessonText(generateLesson(CURRICULUM[idx].id));
        setInput('');
        setStartTime(null);
        setErrors(0);
        setWpm(0);
        setAccuracy(100);
        setView('lesson');
    };

    const handleLessonKey = useCallback((e: KeyboardEvent) => {
        if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(e.key)) return;
        if (e.key === 'Backspace') return;

        if (!startTime) setStartTime(Date.now());

        const expectedChar = lessonText[input.length];

        if (e.key.toLowerCase() === expectedChar.toLowerCase()) {
            // Keep the original casing in input history? Or use expectedChar?
            // Using e.key keeps what the user actually typed.
            const newInput = input + e.key;
            setInput(newInput);

            // Check win
            if (newInput.length === lessonText.length) {
                const timeMin = (Date.now() - (startTime || Date.now())) / 60000;
                const finalWpm = Math.round((newInput.length / 5) / (timeMin || 1 / 60)); // Avoid infinity
                const finalAcc = Math.max(0, Math.round(((newInput.length - errors) / newInput.length) * 100));

                setWpm(finalWpm);
                setAccuracy(finalAcc);

                const passed = finalWpm >= CURRICULUM[levelIndex].minWpm && finalAcc > 80;
                if (passed) {
                    const newXp = xp + 50;
                    setXp(newXp);
                    localStorage.setItem('spaceType_xp', newXp.toString());
                }

                // Update Career Stats (Only count if it's a "real" attempt, win or lose, but maybe only significant ones?)
                // Let's count all completed attempts
                setCareerStats(prev => {
                    const newGames = prev.gamesPlayed + 1;
                    // Weighted average
                    const newAvgWpm = Math.round(((prev.avgWpm * prev.gamesPlayed) + finalWpm) / newGames);
                    const newAvgAcc = Math.round(((prev.avgAcc * prev.gamesPlayed) + finalAcc) / newGames);

                    const newStats = { gamesPlayed: newGames, avgWpm: newAvgWpm, avgAcc: newAvgAcc };
                    localStorage.setItem('spaceType_stats', JSON.stringify(newStats));
                    return newStats;
                });

                setLessonResult(passed ? 'won' : 'lost');
                setView('results');
            }
        } else {
            setErrors(prev => prev + 1);
        }
    }, [input, lessonText, startTime, errors, levelIndex, xp]);

    /**
     * --- LÓGICA MODO ARCADE (Caída) ---
     */
    const startArcade = (mode: 'letters' | 'words') => {
        setArcadeMode(mode);
        setLives(3);
        setScore(0);
        setFallingItems([]);
        itemsRef.current = [];
        setArcadeInput('');

        // Reset Refs
        spawnRateRef.current = 2000;
        spawnTimerRef.current = 0;
        lastTimeRef.current = performance.now();
        gameRunningRef.current = true;

        setView('arcade-game');

        // Iniciar Loop
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    const gameLoop = (time: number) => {
        if (!gameRunningRef.current) return;

        const deltaTime = time - lastTimeRef.current;
        lastTimeRef.current = time;

        // 1. Spawning Logic
        spawnTimerRef.current += deltaTime;
        if (spawnTimerRef.current > spawnRateRef.current) {
            spawnTimerRef.current = 0;

            // Dificultad incremental
            spawnRateRef.current = Math.max(400, spawnRateRef.current - 20);

            const id = Date.now() + Math.random();
            const x = Math.random() * 80 + 10; // 10% a 90% width

            let text = '';
            if (arcadeModeRef.current === 'letters') {
                const chars = 'abcdefghijklmnopqrstuvwxyz';
                text = chars[Math.floor(Math.random() * chars.length)];
            } else {
                // Usar palabras de todos los pools
                const allWords = Object.values(WORD_POOLS).flat();
                text = allWords[Math.floor(Math.random() * allWords.length)];
            }

            itemsRef.current.push({
                id,
                text,
                x,
                y: -10, // Empezar un poco arriba
                speed: 0.15 + (Math.random() * 0.1) // Velocidad base + random
            });
        }

        // 2. Physics & Logic
        const nextItems: typeof itemsRef.current = [];
        let livesLost = 0;

        itemsRef.current.forEach(item => {
            // Mover
            item.y += item.speed * (deltaTime / 10); // Ajuste de velocidad por delta

            // Check suelo
            if (item.y > 95) {
                livesLost++;
            } else {
                nextItems.push(item);
            }
        });

        itemsRef.current = nextItems;

        // 3. Update React State (para renderizar)
        // Solo actualizamos el estado si ha pasado suficiente tiempo para mantener 60fps aprox y no saturar React
        setFallingItems([...itemsRef.current]);

        // 4. Game Over Check
        if (livesLost > 0) {
            setLives(prev => {
                const newLives = prev - livesLost;
                if (newLives <= 0) {
                    gameRunningRef.current = false;
                    setLessonResult('lost'); // Usamos esto para marcar que perdimos
                    setView('results');
                }
                return newLives;
            });
        }

        if (gameRunningRef.current) {
            animationFrameRef.current = requestAnimationFrame(gameLoop);
        }
    };

    const handleArcadeKey = useCallback((e: KeyboardEvent) => {
        if (view !== 'arcade-game') return;

        const char = e.key.toLowerCase();
        if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(e.key)) return;

        if (arcadeMode === 'letters') {
            // Buscar coincidencia en itemsRef (estado actual real)
            const matchIndex = itemsRef.current.findIndex(item => item.text.toLowerCase() === char);

            if (matchIndex !== -1) {
                // Hit!
                itemsRef.current.splice(matchIndex, 1);
                setScore(s => s + 10);
                // Efecto visual instantáneo
                setFallingItems([...itemsRef.current]);
            }
        } else {
            // Modo Palabras
            if (char === 'Enter' || char === ' ') {
                setArcadeInput('');
            } else if (char === 'Backspace') {
                setArcadeInput(prev => prev.slice(0, -1));
            } else if (char.length === 1) {
                setArcadeInput(prev => {
                    const nextInput = prev + char;

                    // Buscar coincidencia completa
                    const matchIndex = itemsRef.current.findIndex(item => item.text.toLowerCase() === nextInput);
                    if (matchIndex !== -1) {
                        // Palabra completa!
                        itemsRef.current.splice(matchIndex, 1);
                        setScore(s => s + 50);
                        setFallingItems([...itemsRef.current]);
                        return ''; // Limpiar input
                    }
                    return nextInput;
                });
            }
        }
    }, [view, arcadeMode]);

    // Cleanup al desmontar
    useEffect(() => {
        return () => {
            gameRunningRef.current = false;
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, []);

    // Global Key Listener Switcher
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            // Prevent scrolling on Space
            if (e.key === ' ' && (view === 'lesson' || view === 'arcade-game')) {
                e.preventDefault();
            }

            if (view === 'lesson') handleLessonKey(e);
            if (view === 'arcade-game') handleArcadeKey(e);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [view, handleLessonKey, handleArcadeKey]);


    /**
     * --- RENDERS ---
     */

    const renderMainMenu = () => (
        <div className="flex flex-col items-center gap-8 animate-fade-in w-full max-w-4xl mx-auto">
            <div className="text-center space-y-2">
                <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 tracking-tighter filter drop-shadow-lg" style={{ fontFamily: 'Lexend, sans-serif' }}>
                    {APP_TITLE}
                </h1>
                <h2 className="text-2xl font-bold text-slate-400 tracking-widest uppercase">{t('subtitle')}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                {/* Panel Misiones */}
                <div className="bg-slate-800/80 backdrop-blur p-6 rounded-3xl border-2 border-slate-700 hover:border-cyan-500 transition-all hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                    <h2 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                        <Rocket className="animate-pulse" /> {t('academyMissions')}
                    </h2>
                    <div className="grid grid-cols-4 gap-2">
                        {CURRICULUM.map((l, idx) => (
                            <button
                                key={l.id}
                                onClick={() => startLesson(idx)}
                                className="aspect-square rounded-xl flex items-center justify-center font-bold text-lg transition-all relative overflow-hidden group bg-cyan-600 text-white hover:bg-cyan-500 hover:scale-105 shadow-lg"
                                title={`${t(`missions.${l.id}.title`)} - ${t(`missions.${l.id}.desc`)}`}
                            >
                                {l.id}
                            </button>
                        ))}
                    </div>
                    <p className="text-slate-400 mt-4 text-sm">{t('accessGranted')}</p>
                </div>

                {/* Panel Arcade */}
                <div className="bg-slate-800/80 backdrop-blur p-6 rounded-3xl border-2 border-slate-700 hover:border-pink-500 transition-all hover:shadow-[0_0_30px_rgba(236,72,153,0.2)]">
                    <h2 className="text-2xl font-bold text-pink-400 mb-4 flex items-center gap-2">
                        <Zap className="animate-bounce" /> {t('arcadeZone')}
                    </h2>
                    <div className="flex flex-col gap-4">
                        <button onClick={() => startArcade('letters')} className="bg-slate-700 hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 hover:text-white p-4 rounded-xl flex items-center justify-between group transition-all transform hover:-translate-y-1">
                            <div className="flex items-center gap-3">
                                <Flame size={20} className="text-pink-400 group-hover:text-white" />
                                <span className="font-bold">{t('meteorShower')}</span>
                            </div>
                            <span className="text-xs bg-slate-900 px-2 py-1 rounded text-slate-400 group-hover:text-white border border-slate-600">{t('letters')}</span>
                        </button>
                        <button onClick={() => startArcade('words')} className="bg-slate-700 hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 hover:text-white p-4 rounded-xl flex items-center justify-between group transition-all transform hover:-translate-y-1">
                            <div className="flex items-center gap-3">
                                <ShieldAlert size={20} className="text-purple-400 group-hover:text-white" />
                                <span className="font-bold">{t('planetaryDefense')}</span>
                            </div>
                            <span className="text-xs bg-slate-900 px-2 py-1 rounded text-slate-400 group-hover:text-white border border-slate-600">{t('words')}</span>
                        </button>
                    </div>
                    <p className="text-slate-400 mt-4 text-sm">{t('survivalMode')}</p>
                </div>
            </div>

            {/* Hand Placement Recommendation */}
            <div className="mt-8 bg-slate-800/60 backdrop-blur p-6 rounded-3xl border-2 border-slate-700/50 flex flex-col items-center max-w-2xl w-full">
                <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5" fill="currentColor" />
                    {t('agilityRecommendation')}
                </h3>
                <div className="relative w-full aspect-[2/1] max-h-48 rounded-xl overflow-hidden border-2 border-slate-600">
                    <NextImage
                        src="/keyboard_hands.png"
                        alt={t('handsPositionAlt')}
                        fill
                        className="object-cover"
                    />
                </div>
                <p className="text-slate-400 text-sm mt-3 text-center">
                    {t.rich('fingerPlacement', {
                        k1: (chunks: React.ReactNode) => <span className="text-yellow-400 font-bold">{chunks}</span>,
                        k2: (chunks: React.ReactNode) => <span className="text-yellow-400 font-bold">{chunks}</span>
                    })}
                </p>
            </div>
        </div>
    );

    const renderLesson = () => {
        const currentLevel = CURRICULUM[levelIndex];
        const currentChar = lessonText[input.length] || '';

        // Cálculo métricas en vivo
        const timeElapsedMin = startTime ? (Date.now() - startTime) / 60000 : 0;
        const currentWpm = timeElapsedMin > 0 ? Math.round((input.length / 5) / timeElapsedMin) : 0;
        const currentAcc = input.length > 0 ? Math.max(0, Math.round(((input.length - errors) / input.length) * 100)) : 100;

        return (
            <div className="w-full max-w-5xl mx-auto flex flex-col items-center animate-fade-in">
                {/* HUD */}
                <div className="flex w-full justify-between items-end mb-6 px-4">
                    <button onClick={() => setView('menu')} className="text-slate-500 hover:text-white flex items-center gap-2 transition-colors"><RotateCcw size={16} /> {t('abortMission')}</button>
                    <div className="text-center">
                        <h2 className="text-xl text-cyan-400 font-bold">{t(`missions.${currentLevel.id}.title`)}</h2>
                        <p className="text-slate-500 text-sm">{t(`missions.${currentLevel.id}.desc`)}</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-slate-800 px-4 py-1 rounded-lg border border-slate-700">
                            <Tooltip content={t('wpmTooltip')}>
                                <div className="cursor-help">
                                    <span className="text-slate-400 text-xs block border-b border-dotted border-slate-500 w-fit">{t('speed')}</span>
                                    <span className="text-xl font-bold text-white">{currentWpm} <span className="text-xs text-slate-500">WPM</span></span>
                                </div>
                            </Tooltip>
                        </div>
                        <div className="bg-slate-800 px-4 py-1 rounded-lg border border-slate-700">
                            <span className="text-slate-400 text-xs block">{t('accuracy')}</span>
                            <span className="text-xl font-bold text-white">{currentAcc}%</span>
                        </div>
                    </div>
                </div>

                {/* Typing Area */}
                <div className="relative bg-slate-900 p-8 rounded-3xl border-4 border-slate-700 shadow-2xl w-full text-center min-h-[200px] flex items-center justify-center flex-wrap gap-y-4">
                    {lessonText.split('').map((char, i) => {
                        let status = 'pending';
                        if (i < input.length) status = input[i].toLowerCase() === char.toLowerCase() ? 'correct' : 'incorrect';
                        // Mostrar cursor en el siguiente
                        return <Letter key={i} char={char} status={status} isActive={i === input.length} />;
                    })}
                </div>

                <VirtualKeyboard activeKey={currentChar} t={t} />
            </div>
        );
    };

    const renderArcadeGame = () => (
        <div className="relative w-full h-[80vh] bg-slate-950 rounded-3xl overflow-hidden border-4 border-slate-800 shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]">
            {/* Fondo Estrellado Simple */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900 via-slate-950 to-slate-950"></div>

            {/* HUD Arcade */}
            <div className="absolute top-4 left-4 right-4 flex justify-between z-20">
                <div className="flex gap-1 bg-slate-900/50 p-2 rounded-xl backdrop-blur-sm border border-slate-800">
                    {[...Array(3)].map((_, i) => (
                        <Heart key={i} fill={i < lives ? "#ec4899" : "none"} className={i < lives ? "text-pink-500 drop-shadow-[0_0_5px_rgba(236,72,153,0.5)]" : "text-slate-700"} />
                    ))}
                </div>
                <div className="text-3xl font-black text-white drop-shadow-md tracking-widest">{score} <span className="text-sm font-normal text-slate-400">PTS</span></div>
                <button onClick={() => { gameRunningRef.current = false; setView('menu'); }} className="bg-slate-800/50 hover:bg-red-500/20 hover:text-red-400 text-white p-2 rounded-lg transition-colors border border-slate-700"><RotateCcw size={20} /></button>
            </div>

            {/* Falling Items */}
            {fallingItems.map(item => (
                <div
                    key={item.id}
                    className={`
                    absolute font-bold px-4 py-2 rounded-full border shadow-lg transition-transform flex items-center justify-center
                    ${arcadeMode === 'words' ? 'bg-indigo-900/80 border-indigo-500 text-indigo-100' : 'bg-pink-900/80 border-pink-500 text-pink-100 w-12 h-12'}
                `}
                    style={{
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                        borderColor: arcadeMode === 'words' && arcadeInput && item.text.toLowerCase().startsWith(arcadeInput.toLowerCase()) ? '#fbbf24' : undefined,
                        boxShadow: arcadeMode === 'words' && arcadeInput && item.text.toLowerCase().startsWith(arcadeInput.toLowerCase()) ? '0 0 15px rgba(251, 191, 36, 0.4)' : undefined
                    }}
                >
                    {item.text}
                </div>
            ))}

            {/* Input Display (Solo para modo palabras) */}
            {arcadeMode === 'words' && (
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="bg-slate-900/90 backdrop-blur px-8 py-3 rounded-2xl border-2 border-yellow-500/50 text-2xl text-yellow-400 font-mono shadow-xl min-w-[200px] text-center flex items-center justify-center gap-2">
                        <span className="text-slate-500 text-sm absolute top-1 left-3">TARGET</span>
                        {arcadeInput}<span className="animate-pulse w-2 h-6 bg-yellow-400 block"></span>
                    </div>
                </div>
            )}

            {/* Zona de peligro visual */}
            <div className="absolute bottom-0 w-full h-2 bg-gradient-to-r from-red-500 via-pink-500 to-red-500 opacity-50 blur-sm"></div>
            <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-red-900/20 to-transparent pointer-events-none"></div>
        </div>
    );

    const renderResults = () => (
        <div className="flex flex-col items-center justify-center animate-pop-in min-h-[50vh] text-center">
            {score > 0 ? (
                // Arcade Result
                <>
                    <div className="relative">
                        <ShieldAlert size={100} className="text-red-500 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                        <Flame size={40} className="text-yellow-500 absolute -bottom-2 -right-2 animate-bounce" />
                    </div>
                    <h2 className="text-5xl font-black text-white mb-2 tracking-tight">{t('shipDestroyed')}</h2>
                    <p className="text-slate-400 text-xl mb-8">{t('finalScore')} <span className="text-yellow-400 font-bold text-3xl ml-2">{score}</span></p>
                </>
            ) : (
                // Lesson Result
                <>
                    {lessonResult === 'won' ?
                        <div className="relative">
                            <Trophy size={100} className="text-yellow-400 mb-6 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                            <Star size={40} className="text-white absolute -top-2 -right-4 animate-spin-slow" fill="currentColor" />
                        </div>
                        :
                        <Skull size={100} className="text-slate-600 mb-6" />
                    }

                    <h2 className="text-5xl font-black text-white mb-2 tracking-tight">
                        {lessonResult === 'won' ? t('missionAccomplished') : t('missionFailed')}
                    </h2>

                    <div className="grid grid-cols-2 gap-4 mt-6 mb-4 w-full max-w-sm">
                        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                            <div className="text-slate-500 text-xs font-bold uppercase mb-1">{t('speed')}</div>
                            <div className="text-3xl font-bold text-white">{wpm} <span className="text-sm text-slate-400">WPM</span></div>
                            <div className="text-xs text-yellow-500 mt-1 font-mono">{t('avg')} {careerStats.avgWpm}</div>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                            <div className="text-slate-500 text-xs font-bold uppercase mb-1">{t('accuracy')}</div>
                            <div className="text-3xl font-bold text-white">{accuracy}%</div>
                            <div className="text-xs text-yellow-500 mt-1 font-mono">{t('avg')} {careerStats.avgAcc}%</div>
                        </div>
                    </div>

                    <div className="text-slate-500 text-sm mb-8">
                        {t('totalGames')} <span className="text-slate-300 font-bold">{careerStats.gamesPlayed}</span>
                    </div>

                    <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 mb-8 w-full max-w-sm">
                        <div className="text-slate-500 text-xs font-bold uppercase mb-1">{t('xpEarned')}</div>
                        <div className="text-3xl font-bold text-yellow-400">+{lessonResult === 'won' ? 50 : 0}</div>
                    </div>
                </>
            )}

            <button
                onClick={() => { setScore(0); setView('menu'); }}
                className="bg-cyan-600 hover:bg-cyan-500 text-white py-4 px-10 rounded-2xl font-bold transition-all shadow-lg hover:shadow-cyan-500/25 hover:-translate-y-1 active:scale-95 flex items-center gap-2"
            >
                <RotateCcw size={20} /> {t('backToBase')}
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-cyan-500/30 overflow-hidden flex flex-col">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;700;900&display=swap');
        .animate-pop-in { animation: pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        @keyframes pop { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .animate-fade-in { animation: fade 0.5s ease-out; }
        @keyframes fade { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
      `}</style>

            {view !== 'lesson' && view !== 'arcade-game' && (
                <nav className="p-4 flex justify-between items-center bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 border-b border-slate-800/50">
                    <Link href="/games">
                        <div className="flex items-center gap-2 cursor-pointer group">
                            <div className="p-2 rounded-lg bg-slate-800 text-slate-400 group-hover:bg-slate-700 transition-colors">
                                <RotateCcw size={20} className="transform rotate-180" />
                            </div>
                            <span className="font-bold text-slate-400 group-hover:text-white transition-colors hidden md:block">{t('back')}</span>
                        </div>
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="bg-gradient-to-tr from-cyan-500 to-blue-600 p-2 rounded-lg">
                            <Rocket className="text-white" size={20} />
                        </div>
                        <span className="font-bold text-white tracking-wider hidden md:block">{APP_TITLE}</span>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-800/80 rounded-full px-5 py-2 border border-slate-700">
                        <span className="text-xs text-slate-400 uppercase mr-2 font-bold tracking-widest hidden sm:inline">{t('pilot')}</span>
                        <span className="text-yellow-400 font-bold flex items-center gap-2 text-lg filter drop-shadow-sm"><Star size={16} fill="currentColor" /> {xp}</span>
                    </div>
                </nav>
            )}

            <main className="flex-1 container mx-auto px-4 py-8 flex flex-col justify-center relative">
                {/* Decorative Background Elements */}
                {view === 'menu' && (
                    <>
                        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-20 right-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
                    </>
                )}

                {view === 'menu' && renderMainMenu()}
                {view === 'lesson' && renderLesson()}
                {view === 'arcade-game' && renderArcadeGame()}
                {view === 'results' && renderResults()}
            </main>
        </div>
    );
}
