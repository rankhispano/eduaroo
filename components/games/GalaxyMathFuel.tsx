'use client';

import { useTranslations } from 'next-intl';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Fuel,
    Rocket,
    Zap,
    Brain,
    Play,
    Trophy,
    ChevronLeft,
    LayoutGrid,
    Heart,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

// --- TIPOS Y CONSTANTES ---

type GameState = 'MENU' | 'PLAYING' | 'PAUSED_FEEDBACK' | 'GAME_OVER';
type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
type TableSelection = 'MIXED' | number;

interface FallingObject {
    id: number;
    lane: 0 | 1 | 2; // 0: Izquierda, 1: Centro, 2: Derecha
    y: number; // Porcentaje vertical
    value: number;
    isCorrect: boolean;
}

interface MathProblem {
    numA: number;
    numB: number;
    operation: string;
    result: number;
}

// Configuración de Dificultad
const DIFFICULTY_CONFIG = {
    EASY: { baseSpeed: 12, spawnInterval: 2500, showHint: true, label: 'Cadete' },
    MEDIUM: { baseSpeed: 20, spawnInterval: 2000, showHint: false, label: 'Piloto' },
    HARD: { baseSpeed: 30, spawnInterval: 1500, showHint: false, label: 'Comandante' }
};

// Carriles visuales
const LANES = [16.66, 50, 83.33];

export default function GalaxyMathFuel() {
    // --- ESTADO DEL JUEGO ---
    const [gameState, setGameState] = useState<GameState>('MENU');
    const [difficulty, setDifficulty] = useState<Difficulty>('EASY');
    const [selectedTable, setSelectedTable] = useState<TableSelection>('MIXED');

    // Estado de UI del Menú
    const [isConfigOpen, setIsConfigOpen] = useState(false);

    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [highScores, setHighScores] = useState<Record<string, number>>({});

    const t = useTranslations('GalaxyMathFuel');

    const [shipLane, setShipLane] = useState<0 | 1 | 2>(1);
    const [feedbackMessage, setFeedbackMessage] = useState<{
        text: string;
        type: 'success' | 'error' | 'missed';
    } | null>(null);
    const [currentProblem, setCurrentProblem] = useState<MathProblem>({
        numA: 0,
        numB: 0,
        operation: 'x',
        result: 0
    });
    const [fallingObjects, setFallingObjects] = useState<FallingObject[]>([]);

    // Refs
    const requestRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(0);
    const lastSpawnTimeRef = useRef<number>(0);
    const speedMultiplierRef = useRef<number>(1);
    const gameContainerRef = useRef<HTMLDivElement>(null);

    // --- LÓGICA DE PUNTUACIÓN ---
    const getHighScoreKey = useCallback(() => {
        return selectedTable === 'MIXED' ? 'MIXED' : `T-${selectedTable}`;
    }, [selectedTable]);

    const getCurrentHighScore = useCallback(() => {
        const key = getHighScoreKey();
        return highScores[key] || 0;
    }, [highScores, getHighScoreKey]);

    // --- LÓGICA MATEMÁTICA ---

    const generateProblem = useCallback(() => {
        let numA, numB;

        if (selectedTable === 'MIXED') {
            numA = Math.floor(Math.random() * 9) + 2;
            numB = Math.floor(Math.random() * 9) + 2;
        } else {
            numA = selectedTable;
            numB = Math.floor(Math.random() * 10) + 1;
        }

        const result = numA * numB;
        setCurrentProblem({ numA, numB, operation: 'x', result });
        return result;
    }, [selectedTable]);

    const spawnObjects = useCallback((correctResult: number) => {
        const id = Date.now();

        const wrongAnswers = new Set<number>();
        while (wrongAnswers.size < 2) {
            const range = correctResult > 50 ? 20 : 10;
            const offset = Math.floor(Math.random() * range) - range / 2;
            const val = correctResult + offset;
            if (val > 0 && val !== correctResult) wrongAnswers.add(val);
        }
        const wrongArray = Array.from(wrongAnswers);

        const lanes = [0, 1, 2].sort(() => Math.random() - 0.5);

        const newObjects: FallingObject[] = [
            { id: id + 1, lane: lanes[0] as 0 | 1 | 2, y: -25, value: correctResult, isCorrect: true },
            { id: id + 2, lane: lanes[1] as 0 | 1 | 2, y: -25, value: wrongArray[0], isCorrect: false },
            { id: id + 3, lane: lanes[2] as 0 | 1 | 2, y: -25, value: wrongArray[1], isCorrect: false }
        ];

        setFallingObjects(prev => [...prev, ...newObjects]);
    }, []);

    // --- CONTROLES ---

    const moveLeft = useCallback(() => {
        if (gameState !== 'PLAYING') return;
        setShipLane(prev => (prev > 0 ? prev - 1 : 0) as 0 | 1 | 2);
    }, [gameState]);

    const moveRight = useCallback(() => {
        if (gameState !== 'PLAYING') return;
        setShipLane(prev => (prev < 2 ? prev + 1 : 2) as 0 | 1 | 2);
    }, [gameState]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft' || e.key === 'a') moveLeft();
            if (e.key === 'ArrowRight' || e.key === 'd') moveRight();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [moveLeft, moveRight]);

    // --- GESTIÓN DE VIDAS Y GAME OVER ---

    const handleLoseLife = useCallback(
        (reason: 'wrong' | 'missed') => {
            setLives(prevLives => {
                const newLives = prevLives - 1;

                if (newLives <= 0) {
                    setGameState('GAME_OVER');
                    const key = getHighScoreKey();
                    if (score > (highScores[key] || 0)) {
                        setHighScores(prev => ({ ...prev, [key]: score }));
                    }
                    return 0;
                }

                // Si quedan vidas, pausamos momentáneamente
                setGameState('PAUSED_FEEDBACK');

                const msgText =
                    reason === 'wrong'
                        ? `${currentProblem.numA} x ${currentProblem.numB} = ${currentProblem.result}`
                        : t('feedback.fuelEscaped');

                setFeedbackMessage({ text: msgText, type: reason === 'wrong' ? 'error' : 'missed' });

                setTimeout(() => {
                    setGameState('PLAYING');
                    setFeedbackMessage(null);
                    setFallingObjects([]);
                    const newResult = generateProblem();
                    spawnObjects(newResult);
                }, 2000);

                return newLives;
            });
        },
        [currentProblem, generateProblem, spawnObjects, score, highScores, getHighScoreKey]
    );

    const handleCollision = useCallback(
        (obj: FallingObject) => {
            if (obj.isCorrect) {
                // ACIERTO
                setScore(s => s + 10);
                setFeedbackMessage({ text: t('feedback.good'), type: 'success' });
                speedMultiplierRef.current += 0.01;

                setFallingObjects([]);
                const newResult = generateProblem();
                spawnObjects(newResult);

                setTimeout(() => setFeedbackMessage(null), 500);
            } else {
                // FALLO (Choque con incorrecto)
                handleLoseLife('wrong');
            }
        },
        [generateProblem, spawnObjects, handleLoseLife]
    );

    // --- BUCLE DE JUEGO ---

    const update = useCallback(
        (time: number) => {
            if (gameState !== 'PLAYING') {
                lastTimeRef.current = time;
                requestRef.current = requestAnimationFrame(update);
                return;
            }

            const deltaTime = (time - lastTimeRef.current) / 1000;
            lastTimeRef.current = time;

            // 1. Spawning
            if (fallingObjects.length === 0 && time - lastSpawnTimeRef.current > 500) {
                const newResult = generateProblem();
                spawnObjects(newResult);
                lastSpawnTimeRef.current = time;
            }

            // 2. Mover Objetos
            setFallingObjects(prevObjects => {
                const speed = DIFFICULTY_CONFIG[difficulty].baseSpeed * speedMultiplierRef.current;

                const nextObjects = prevObjects
                    .map(obj => ({ ...obj, y: obj.y + speed * deltaTime }))
                    .filter(obj => obj.y < 120);

                // 3. Colisiones
                const hitObject = nextObjects.find(
                    obj => obj.y > 75 && obj.y < 88 && obj.lane === shipLane
                );

                if (hitObject) {
                    handleCollision(hitObject);
                    return [];
                }

                // 4. Perder vida si se escapa la correcta
                const missedCorrect = prevObjects.find(obj => obj.isCorrect && obj.y > 110);
                if (missedCorrect) {
                    handleLoseLife('missed');
                    return [];
                }

                return nextObjects;
            });

            requestRef.current = requestAnimationFrame(update);
        },
        [
            gameState,
            difficulty,
            shipLane,
            fallingObjects.length,
            generateProblem,
            spawnObjects,
            handleCollision,
            handleLoseLife
        ]
    );

    useEffect(() => {
        requestRef.current = requestAnimationFrame(update);
        return () => cancelAnimationFrame(requestRef.current);
    }, [update]);

    // --- HELPERS ---

    const startGame = (diff: Difficulty) => {
        setDifficulty(diff);
        setScore(0);
        setLives(3);
        setShipLane(1);
        setFallingObjects([]);
        speedMultiplierRef.current = 1;

        const firstResult = generateProblem();
        spawnObjects(firstResult);

        setGameState('PLAYING');
        lastTimeRef.current = performance.now();
    };

    const returnToMenu = () => {
        setGameState('MENU');
        setFallingObjects([]);
    };

    // --- RENDERIZADO ---

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans overflow-hidden select-none relative touch-none">
            {/* FONDO ANIMADO */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-950 to-black"></div>
                {/* Estrellas simples */}
                <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full opacity-80" />
                <div className="absolute top-1/4 right-1/4 w-1 h-1 bg-white rounded-full opacity-60" />
                <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-purple-300 rounded-full blur-[1px] animate-pulse" />
            </div>

            {/* --- HUD DE JUEGO --- */}
            {gameState !== 'MENU' && (
                <header className="absolute top-0 left-0 w-full p-4 z-50 flex justify-between items-start bg-gradient-to-b from-black/90 to-transparent pb-12">
                    {/* Botón Volver */}
                    <button
                        onClick={returnToMenu}
                        className="absolute top-4 left-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-50 pointer-events-auto"
                        aria-label={t('gameOver.menu')}
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <div className="flex flex-col w-full items-center mt-2 pointer-events-none">
                        <div className="flex items-center gap-4 scale-110">
                            <div className="text-5xl md:text-6xl font-black text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)] tracking-wider">
                                {currentProblem.numA}{' '}
                                <span className="text-white text-4xl">×</span> {currentProblem.numB}
                            </div>
                        </div>
                    </div>

                    {/* Panel derecho: Vidas y Puntos */}
                    <div className="absolute top-4 right-4 flex flex-col items-end pointer-events-none gap-2">
                        {/* Vidas */}
                        <div className="flex gap-1">
                            {[...Array(3)].map((_, i) => (
                                <Heart
                                    key={i}
                                    size={24}
                                    className={`${i < lives ? 'fill-red-500 text-red-500' : 'fill-slate-800 text-slate-700'}`}
                                />
                            ))}
                        </div>

                        <div>
                            <span className="text-[10px] text-slate-400 uppercase font-bold block text-right">
                                {t('points')}
                            </span>
                            <span className="text-3xl font-mono font-bold text-green-400">{score}</span>
                        </div>
                    </div>
                </header>
            )}

            {/* --- ÁREA DE JUEGO --- */}
            {gameState !== 'MENU' && gameState !== 'GAME_OVER' && (
                <div
                    ref={gameContainerRef}
                    className="absolute inset-0 z-10 overflow-hidden max-w-2xl mx-auto border-x border-white/5 bg-white/5"
                >
                    {/* Carriles */}
                    <div className="absolute inset-0 grid grid-cols-3 pointer-events-none">
                        <div className="border-r border-white/5 h-full"></div>
                        <div className="border-r border-white/5 h-full"></div>
                        <div></div>
                    </div>

                    {/* Feedback Overlay */}
                    {feedbackMessage && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
                            <div
                                className={`text-center px-4 transform scale-110 ${feedbackMessage.type === 'success' ? 'text-green-400' : 'text-red-500'
                                    }`}
                            >
                                {feedbackMessage.type !== 'success' && (
                                    <div className="text-6xl mb-4">💥</div>
                                )}
                                <h2 className="text-4xl md:text-5xl font-black stroke-black drop-shadow-2xl mb-4 leading-tight">
                                    {feedbackMessage.text}
                                </h2>
                                {feedbackMessage.type !== 'success' && lives > 0 && (
                                    <div className="text-white text-xl animate-pulse mt-4">
                                        {t('feedback.careful', { lives })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* OBJETOS (BIDONES) */}
                    {fallingObjects.map(obj => (
                        <div
                            key={obj.id}
                            className="absolute w-28 h-32 -ml-14 transition-transform duration-75"
                            style={{ left: `${LANES[obj.lane]}%`, top: `${obj.y}%` }}
                        >
                            <div
                                className={`relative w-full h-full flex flex-col items-center justify-center ${difficulty === 'EASY' && obj.isCorrect
                                    ? 'drop-shadow-[0_0_20px_rgba(250,204,21,0.6)]'
                                    : ''
                                    }`}
                            >
                                {/* NÚMERO (Más grande) */}
                                <div className="absolute z-20 top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center border-2 border-white/20 shadow-xl">
                                    <span className="text-4xl font-black text-white tracking-tighter">
                                        {obj.value}
                                    </span>
                                </div>

                                {/* ICONO (Animado) */}
                                <div className="w-full h-full text-orange-500 animate-[wiggle_1s_ease-in-out_infinite] opacity-100">
                                    <Fuel size="100%" strokeWidth={1} fill="rgba(249, 115, 22, 0.3)" />
                                </div>

                                {/* Ayuda visual Fácil */}
                                {difficulty === 'EASY' && obj.isCorrect && (
                                    <div className="absolute inset-0 rounded-2xl border-4 border-yellow-400/70 animate-pulse"></div>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* NAVE */}
                    <div
                        className="absolute bottom-12 w-24 h-24 -ml-12 transition-all duration-300 ease-out z-30"
                        style={{ left: `${LANES[shipLane]}%` }}
                    >
                        <div className="relative w-full h-full flex items-center justify-center">
                            {/* Fuego del motor */}
                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-8 h-20 bg-gradient-to-t from-transparent via-orange-500 to-yellow-400 blur-md animate-pulse opacity-90 rounded-b-full"></div>
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4 h-12 bg-white blur-sm"></div>

                            {/* Nave */}
                            <div className="transform -rotate-45 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]">
                                <Rocket className="w-24 h-24 text-blue-400" fill="#0f172a" strokeWidth={1.5} />
                            </div>
                        </div>
                    </div>

                    {/* Controles Táctiles */}
                    <div className="absolute inset-0 flex z-40">
                        <div className="absolute inset-0 grid grid-cols-3 z-40">
                            <div
                                className="h-full active:bg-blue-500/5 transition-colors cursor-pointer"
                                onPointerDown={() => setShipLane(0)}
                            ></div>
                            <div
                                className="h-full active:bg-blue-500/5 transition-colors cursor-pointer"
                                onPointerDown={() => setShipLane(1)}
                            ></div>
                            <div
                                className="h-full active:bg-blue-500/5 transition-colors cursor-pointer"
                                onPointerDown={() => setShipLane(2)}
                            ></div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MENÚ PRINCIPAL --- */}
            {gameState === 'MENU' && (
                <div className="absolute inset-0 z-50 flex flex-col bg-slate-900/95 backdrop-blur-xl overflow-y-auto">
                    <div className="p-6 pb-2 text-center animate-in zoom-in duration-500 max-w-2xl mx-auto w-full">
                        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 mb-2">
                            {t('title')}
                        </h1>
                        <p className="text-slate-400">{t('subtitle')}</p>
                    </div>

                    <div className="flex-1 w-full max-w-xl mx-auto p-6 pt-2 flex flex-col gap-6">
                        {/* SECCIÓN 1: CONFIGURACIÓN COLAPSABLE */}
                        <div className="bg-slate-800/50 rounded-2xl border border-white/5 overflow-hidden transition-all duration-300">
                            {/* Cabecera / Botón Toggle */}
                            <button
                                onClick={() => setIsConfigOpen(!isConfigOpen)}
                                className="w-full p-4 flex items-center justify-between bg-slate-800 hover:bg-slate-750 transition-colors text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                                        <LayoutGrid size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-400 font-bold uppercase tracking-wider">
                                            {t('currentMission')}
                                        </div>
                                        <div className="text-white font-bold text-lg">
                                            {selectedTable === 'MIXED'
                                                ? t('mixedMode')
                                                : t('tableMode', { n: selectedTable })}
                                        </div>
                                    </div>
                                </div>
                                {isConfigOpen ? (
                                    <ChevronUp className="text-slate-400" />
                                ) : (
                                    <ChevronDown className="text-slate-400" />
                                )}
                            </button>

                            {/* Contenido Desplegable */}
                            {isConfigOpen && (
                                <div className="p-4 border-t border-white/5 animate-in slide-in-from-top-2 duration-200">
                                    {/* Botón Mezcla */}
                                    <button
                                        onClick={() => setSelectedTable('MIXED')}
                                        className={`w-full p-3 mb-4 rounded-xl font-bold text-lg transition-all flex items-center justify-between ${selectedTable === 'MIXED'
                                            ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-400'
                                            : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                                            }`}
                                    >
                                        <span>{t('mixedMode')}</span>
                                        <div className="text-xs bg-white/20 px-2 py-1 rounded">
                                            {t('record')}: {highScores['MIXED'] || 0}
                                        </div>
                                    </button>

                                    {/* Grid de Tablas */}
                                    <div className="grid grid-cols-5 gap-2">
                                        {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
                                            <button
                                                key={num}
                                                onClick={() => setSelectedTable(num)}
                                                className={`aspect-square rounded-lg font-bold text-lg flex flex-col items-center justify-center transition-all relative ${selectedTable === num
                                                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-110 z-10'
                                                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                                                    }`}
                                            >
                                                {num}
                                                {highScores[`T-${num}`] > 0 && (
                                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border border-slate-900" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                    {typeof selectedTable === 'number' && (
                                        <div className="mt-2 text-right text-xs text-yellow-400 font-mono">
                                            {t('bestScore')}: {highScores[`T-${selectedTable}`] || 0}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* SECCIÓN 2: ELEGIR DIFICULTAD Y JUGAR */}
                        <div className="grid gap-3">
                            <div className="text-slate-300 font-bold uppercase text-sm tracking-wider mb-1 px-1">
                                {t('launch')}
                            </div>
                            {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map(level => (
                                <button
                                    key={level}
                                    onClick={() => startGame(level)}
                                    className={`group relative p-4 rounded-xl border border-white/5 bg-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-4 ${level === 'EASY' ? 'hover:border-green-500/50' : ''
                                        } ${level === 'MEDIUM' ? 'hover:border-yellow-500/50' : ''} ${level === 'HARD' ? 'hover:border-red-500/50' : ''
                                        }`}
                                >
                                    <div
                                        className={`p-3 rounded-full ${level === 'EASY' ? 'bg-green-500/10 text-green-400' : ''
                                            } ${level === 'MEDIUM' ? 'bg-yellow-500/10 text-yellow-400' : ''} ${level === 'HARD' ? 'bg-red-500/10 text-red-400' : ''
                                            }`}
                                    >
                                        {level === 'EASY' ? (
                                            <Zap size={24} />
                                        ) : level === 'HARD' ? (
                                            <Brain size={24} />
                                        ) : (
                                            <Rocket size={24} />
                                        )}
                                    </div>

                                    <div className="text-left flex-1">
                                        <div className="text-lg font-bold text-white">
                                            {t(`difficulties.${level}.label`)}
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            {t(`difficulties.${level}.desc`)}
                                        </div>
                                    </div>

                                    <Play className="opacity-0 group-hover:opacity-100 transition-opacity text-white" fill="white" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* --- PANTALLA GAME OVER --- */}
            {gameState === 'GAME_OVER' && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-6 text-center animate-in fade-in">
                    <Trophy size={80} className="text-yellow-400 mb-6 animate-bounce" />
                    <h2 className="text-4xl font-black text-white mb-2 uppercase">{t('gameOver.title')}</h2>
                    <p className="text-slate-400 mb-6">{t('gameOver.desc')}</p>

                    <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 my-4 w-full max-w-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full bg-slate-700 py-1 text-xs font-bold text-slate-300 uppercase tracking-widest">
                            {selectedTable === 'MIXED' ? t('mixedMode') : t('tableMode', { n: selectedTable })}
                        </div>

                        <div className="text-slate-400 text-sm uppercase mb-1 mt-4">{t('gameOver.finalScore')}</div>
                        <div className="text-6xl font-bold text-white mb-6">{score}</div>

                        <div className="flex items-center justify-center gap-2 text-slate-500 text-sm uppercase">
                            <Trophy size={14} className="text-yellow-500" />
                            {t('record')}:{' '}
                            <span className="text-yellow-500 font-bold">{getCurrentHighScore()}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 w-full max-w-xs">
                        <button
                            onClick={() => startGame(difficulty)}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold text-xl transition-all w-full shadow-lg shadow-blue-900/50"
                        >
                            {t('gameOver.retry')}
                        </button>
                        <button
                            onClick={returnToMenu}
                            className="text-slate-400 hover:text-white py-3 transition-colors text-sm uppercase font-bold tracking-widest"
                        >
                            {t('gameOver.menu')}
                        </button>
                    </div>
                </div>
            )}

            {/* Estilos globales */}
            <style>{`
                @keyframes wiggle {
                    0%, 100% {
                        transform: rotate(-2deg);
                    }
                    50% {
                        transform: rotate(2deg);
                    }
                }
            `}</style>
        </div>
    );
}
