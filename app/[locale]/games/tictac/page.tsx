'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, RotateCcw, Check, Trophy, HelpCircle, Pause } from 'lucide-react';
import { useTranslations } from 'next-intl';

// --- Types ---
const GAME_STATE = {
    START: 'START',
    PLAYING: 'PLAYING',
    FEEDBACK: 'FEEDBACK',
    FINISHED: 'FINISHED',
};

// --- Utils ---

// Generar una hora aleatoria
const generateRandomTime = () => {
    const h = Math.floor(Math.random() * 12) + 1; // 1-12
    const m = Math.floor(Math.random() * 60);     // 0-59
    const s = Math.floor(Math.random() * 60);     // 0-59
    return { h, m, s };
};

// Formatear hora para el display digital (01:05:09)
const formatTime = ({ h, m, s }: { h: number; m: number; s: number }) => {
    const hh = h.toString().padStart(2, '0');
    const mm = m.toString().padStart(2, '0');
    const ss = s.toString().padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
};

// Convertir tiempo a grados ideales
const timeToDegrees = ({ h, m, s }: { h: number; m: number; s: number }) => {
    // Segundos: 6 grados por segundo (360 / 60)
    const sDeg = s * 6;

    // Minutos: 6 grados por minuto + pequeño avance por segundos
    const mDeg = (m * 6) + (s * 0.1);

    // Horas: 30 grados por hora (360 / 12) + avance proporcional por minutos
    const hBase = (h % 12) * 30;
    const hPlusM = m * 0.5; // 30 grados / 60 minutos = 0.5 grados por minuto
    const hDeg = hBase + hPlusM;

    return { hDeg, mDeg, sDeg };
};

// Normalizar grados a 0-360
const normalizeAngle = (angle: number) => {
    let a = angle % 360;
    if (a < 0) a += 360;
    return a;
};

// --- Components ---

export default function TicTacMaestro() {
    const t = useTranslations('GamesPage.tictacMaestroMessages');
    const [gameState, setGameState] = useState(GAME_STATE.START);
    const [targetTime, setTargetTime] = useState({ h: 10, m: 10, s: 30 });
    const [hands, setHands] = useState({ h: 0, m: 0, s: 0 });
    const [score, setScore] = useState(0);
    const [questionCount, setQuestionCount] = useState(1);
    const totalQuestions = 6; // CAMBIO: Aumentado a 6 preguntas
    const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; success: boolean } | null>(null);
    const [accuracy, setAccuracy] = useState(0);

    // Inicializar juego
    const startGame = () => {
        setScore(0);
        setQuestionCount(1);
        nextRound();
        setGameState(GAME_STATE.PLAYING);
    };

    const nextRound = () => {
        const newTime = generateRandomTime();
        setTargetTime(newTime);
        // Reiniciar manecillas a las 12
        setHands({ h: 0, m: 0, s: 0 });
        setFeedbackMessage(null);
        setGameState(GAME_STATE.PLAYING);
    };

    // Lógica de validación
    const checkAnswer = () => {
        const targetDegs = timeToDegrees(targetTime);

        const diff = (a: number, b: number) => {
            let d = Math.abs(a - b);
            return d > 180 ? 360 - d : d;
        };

        const hDiff = diff(normalizeAngle(hands.h), normalizeAngle(targetDegs.hDeg));
        const mDiff = diff(normalizeAngle(hands.m), normalizeAngle(targetDegs.mDeg));
        const sDiff = diff(normalizeAngle(hands.s), normalizeAngle(targetDegs.sDeg));

        let message = "";
        let isPerfect = false;

        // Calcular precisión (0 a 100)
        const totalError = hDiff + mDiff + sDiff;
        const calculatedAccuracy = Math.max(0, 100 - (totalError * 0.5));
        const finalScore = Math.round(calculatedAccuracy);

        setAccuracy(finalScore);

        // Mensajes de feedback cualitativo
        if (finalScore >= 95) {
            message = t('excellent');
            isPerfect = true;
        } else if (finalScore >= 80) {
            message = t('good');
        } else if (finalScore >= 50) {
            message = t('fair');
        } else {
            message = t('needsPractice');
        }

        // CAMBIO: La puntuación suma lo que saca en precisión
        setScore(prev => prev + finalScore);
        setFeedbackMessage({ text: message, success: isPerfect });
        setGameState(GAME_STATE.FEEDBACK);
    };

    const handleNextLevel = () => {
        if (questionCount >= totalQuestions) {
            setGameState(GAME_STATE.FINISHED);
        } else {
            setQuestionCount(prev => prev + 1);
            nextRound();
        }
    };

    return (
        <div className="min-h-screen w-full font-sans overflow-hidden bg-[#FFF8D6] relative selection:bg-none select-none">
            <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-in {
            0% { opacity: 0; transform: scale(0.3); }
            50% { opacity: 1; transform: scale(1.05); }
            70% { transform: scale(0.9); }
            100% { transform: scale(1); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
        .animate-bounce-in {
            animation: bounce-in 0.8s cubic-bezier(0.215, 0.610, 0.355, 1.000) both;
        }
      `}</style>

            {/* Background Pattern */}
            <div
                className="absolute inset-0 opacity-100 pointer-events-none"
                style={{
                    background: `conic-gradient(from 0deg at 50% 50%, #ffeaa7 0deg 20deg, #fdcb6e 20deg 40deg, #ffeaa7 40deg 60deg, #fdcb6e 60deg 80deg, #ffeaa7 80deg 100deg, #fdcb6e 100deg 120deg, #ffeaa7 120deg 140deg, #fdcb6e 140deg 160deg, #ffeaa7 160deg 180deg, #fdcb6e 180deg 200deg, #ffeaa7 200deg 220deg, #fdcb6e 220deg 240deg, #ffeaa7 240deg 260deg, #fdcb6e 260deg 280deg, #ffeaa7 280deg 300deg, #fdcb6e 300deg 320deg, #ffeaa7 320deg 340deg, #fdcb6e 340deg 360deg)`,
                    filter: 'blur(60px)',
                    opacity: 0.4
                }}
            />

            {/* Main Container */}
            <div className="relative z-10 container mx-auto px-4 py-4 h-screen flex flex-col items-center justify-center">

                {/* --- SCREEN: START --- */}
                {gameState === GAME_STATE.START && (
                    <div className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border-[6px] border-yellow-400 text-center max-w-lg animate-fade-in-up">
                        <h1 className="text-5xl font-extrabold text-[#0984e3] mb-6 drop-shadow-sm tracking-tight" style={{ textShadow: '2px 2px 0px #74b9ff' }}>
                            {t('title')}
                        </h1>
                        <div className="bg-blue-50 p-6 rounded-2xl mb-8 border-2 border-blue-100">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
                                <HelpCircle className="w-6 h-6 text-[#0984e3]" /> {t('instructionsTitle')}
                            </h2>
                            <p
                                className="text-lg text-gray-700 leading-relaxed font-medium"
                                dangerouslySetInnerHTML={{ __html: t('instructions') }}
                            />
                        </div>
                        <button
                            onClick={startGame}
                            className="bg-gradient-to-b from-gray-700 to-black text-white text-2xl font-bold py-4 px-16 rounded-xl shadow-xl transform transition hover:scale-105 active:scale-95 border-b-[6px] border-gray-900"
                        >
                            {t('start')}
                        </button>
                    </div>
                )}

                {/* --- SCREEN: PLAYING & FEEDBACK --- */}
                {(gameState === GAME_STATE.PLAYING || gameState === GAME_STATE.FEEDBACK) && (
                    <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-center gap-12 animate-fade-in-up">

                        {/* Left Panel: Stats & Target */}
                        <div className="flex-1 flex flex-col items-center md:items-start space-y-8 order-2 md:order-1 max-w-sm w-full">

                            {/* Question Counter */}
                            <div className="bg-[#00cec9] text-black px-6 py-2 rounded-lg text-xl font-black shadow-[4px_4px_0px_rgba(0,0,0,0.2)] border-2 border-black -rotate-2 transform self-start">
                                {t('question')}: <span className="text-white drop-shadow-md">{questionCount}</span> / {totalQuestions}
                            </div>

                            {/* Digital Clock Target */}
                            <div className="bg-black p-4 rounded-xl shadow-2xl border-[5px] border-gray-700 w-full relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
                                <p className="text-white text-xs text-center mb-3 font-bold uppercase tracking-widest opacity-80">{t('setHandsTo')}</p>
                                <div className="bg-[#f1f2f6] rounded-lg p-6 flex items-center justify-center shadow-inner border-[3px] border-[#dfe6e9]">
                                    <span className="font-mono text-5xl md:text-6xl font-black text-[#2d3436] tracking-widest drop-shadow-sm">
                                        {formatTime(targetTime)}
                                    </span>
                                </div>
                            </div>

                            {/* Score */}
                            <div className="text-center md:text-left w-full">
                                <h3 className="text-2xl font-bold text-[#0984e3] drop-shadow-sm mb-2 font-outline-2">{t('scoreLabel')}</h3>
                                <div className="text-4xl font-black text-white bg-[#0984e3] px-8 py-3 rounded-2xl shadow-lg inline-block border-b-4 border-[#074f8a]">
                                    {score}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-2 w-full">
                                {gameState === GAME_STATE.PLAYING ? (
                                    <button
                                        onClick={checkAnswer}
                                        className="w-full bg-gradient-to-b from-[#00b894] to-[#006266] text-white text-2xl font-black py-4 px-10 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition border-b-[6px] border-[#00383a]"
                                    >
                                        {t('check')}
                                    </button>
                                ) : (
                                    <div className="flex flex-col gap-4 w-full">
                                        <div className={`p-4 rounded-xl text-center border-[3px] shadow-sm ${feedbackMessage?.success ? 'bg-green-100 border-green-500 text-green-900' : 'bg-red-50 border-red-400 text-red-900'}`}>
                                            <p className="font-bold text-xl">{feedbackMessage?.text}</p>
                                            <p className="text-sm mt-1 font-semibold opacity-80">{t('pointsEarned', { points: accuracy })}</p>
                                        </div>
                                        <button
                                            onClick={handleNextLevel}
                                            className="w-full bg-gradient-to-b from-[#0984e3] to-[#0652dd] text-white text-xl font-bold py-4 px-10 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition border-b-[6px] border-[#032e85] flex items-center justify-center gap-2"
                                        >
                                            {t('nextLevel')} <Play size={24} fill="currentColor" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Panel: The Interactive Clock (SVG) */}
                        <div className="flex-none order-1 md:order-2 flex justify-center p-4">
                            <InteractiveClock
                                hands={hands}
                                setHands={setHands}
                                isLocked={gameState === GAME_STATE.FEEDBACK}
                            />
                        </div>
                    </div>
                )}

                {/* --- SCREEN: FINISHED --- */}
                {gameState === GAME_STATE.FINISHED && (
                    <div className="bg-white p-12 rounded-[2rem] shadow-2xl border-[8px] border-yellow-400 text-center animate-bounce-in max-w-xl">
                        <div className="bg-yellow-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-yellow-300">
                            <Trophy className="w-20 h-20 text-yellow-500 drop-shadow-md" fill="currentColor" />
                        </div>
                        <h2 className="text-5xl font-black text-gray-800 mb-4">{t('congrats')}</h2>
                        <p className="text-2xl text-gray-600 mb-8 font-medium">{t('completed')}</p>
                        <div className="text-8xl font-black text-[#0984e3] mb-10 drop-shadow-md tracking-tighter">
                            {score}
                        </div>
                        <button
                            onClick={startGame}
                            className="w-full bg-gradient-to-b from-purple-500 to-purple-800 text-white text-2xl font-bold py-5 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition border-b-[6px] border-purple-900 flex items-center justify-center gap-3"
                        >
                            <RotateCcw size={28} /> {t('playAgain')}
                        </button>
                    </div>
                )}

                {/* Helper UI controls */}
                <div className="absolute bottom-6 right-6 flex gap-3 z-50">
                    <button className="bg-black text-white p-3 rounded-full hover:bg-gray-800 transition shadow-xl border-[3px] border-white transform hover:scale-110">
                        <HelpCircle size={28} />
                    </button>
                    <button className="bg-black text-white p-3 rounded-full hover:bg-gray-800 transition shadow-xl border-[3px] border-white transform hover:scale-110">
                        <Pause size={28} />
                    </button>
                </div>

            </div>
        </div>
    );
}

// --- CLOCK COMPONENT (SVG REWRITE) ---

interface InteractiveClockProps {
    hands: { h: number; m: number; s: number };
    setHands: React.Dispatch<React.SetStateAction<{ h: number; m: number; s: number }>>;
    isLocked: boolean;
}

const InteractiveClock = ({ hands, setHands, isLocked }: InteractiveClockProps) => {
    const svgRef = useRef<SVGSVGElement>(null);

    // Constants for SVG drawing
    const SIZE = 400; // SVG ViewBox Size
    const CENTER = SIZE / 2;
    const RADIUS = SIZE / 2 - 20; // 20px padding

    // Calculate angle from center
    const getAngle = (clientX: number, clientY: number) => {
        if (!svgRef.current) return 0;
        const rect = svgRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Math.atan2(dy, dx) gives angle in radians from X-axis
        const dx = clientX - centerX;
        const dy = clientY - centerY;
        let rad = Math.atan2(dy, dx);
        let deg = rad * (180 / Math.PI);

        deg += 90;

        if (deg < 0) deg += 360;
        return deg;
    };

    const handlePointerDown = (e: React.PointerEvent, handType: 'h' | 'm' | 's') => {
        if (isLocked) return;
        e.preventDefault();
        e.stopPropagation();
        const target = e.target as Element;
        target.setPointerCapture(e.pointerId);

        const onPointerMove = (moveEvent: PointerEvent) => {
            const newAngle = getAngle(moveEvent.clientX, moveEvent.clientY);
            setHands(prev => ({ ...prev, [handType]: newAngle }));
        };

        const onPointerUp = (upEvent: PointerEvent) => {
            target.releasePointerCapture(upEvent.pointerId);
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
        };

        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
    };

    // Generate Ticks
    const ticks = useMemo(() => {
        const items = [];
        for (let i = 0; i < 60; i++) {
            const isHour = i % 5 === 0;
            const angle = i * 6; // 6 degrees per minute
            const length = isHour ? 25 : 10;
            const width = isHour ? 6 : 2;
            const color = "black";

            items.push(
                <line
                    key={i}
                    x1={CENTER}
                    y1={40} // Start inside rim
                    x2={CENTER}
                    y2={40 + length}
                    stroke={color}
                    strokeWidth={width}
                    strokeLinecap="round"
                    transform={`rotate(${angle} ${CENTER} ${CENTER})`}
                />
            );
        }
        return items;
    }, []);

    // Generate Numbers
    const numbers = useMemo(() => {
        const items = [];
        for (let i = 1; i <= 12; i++) {
            const angle = i * 30;
            const rad = (angle - 90) * (Math.PI / 180);
            const r = RADIUS - 55; // Distance from center
            const x = CENTER + r * Math.cos(rad);
            const y = CENTER + r * Math.sin(rad);

            items.push(
                <text
                    key={i}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="48"
                    fontWeight="900"
                    fill="#1a1a1a"
                    style={{ fontFamily: 'sans-serif' }}
                >
                    {i}
                </text>
            );
        }
        return items;
    }, []);

    return (
        <div className="relative drop-shadow-2xl">
            <svg
                ref={svgRef}
                width="450"
                height="450"
                viewBox={`0 0 ${SIZE} ${SIZE}`}
                className="w-[320px] h-[320px] md:w-[500px] md:h-[500px] touch-none select-none"
            >
                {/* 1. CLOCK BODY */}
                <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="#d63031" />
                <circle cx={CENTER} cy={CENTER} r={RADIUS - 20} fill="white" stroke="#c0392b" strokeWidth="2" />

                {/* 2. FACE MARKINGS */}
                <g>{ticks}</g>
                <g>{numbers}</g>

                {/* 3. HANDS (Sin filtros complejos para asegurar visibilidad) */}

                {/* HOUR HAND */}
                <g transform={`rotate(${hands.h} ${CENTER} ${CENTER})`} className="drop-shadow-md">
                    <line
                        x1={CENTER}
                        y1={CENTER}
                        x2={CENTER}
                        y2={CENTER - 90}
                        stroke="black"
                        strokeWidth="16"
                        strokeLinecap="round"
                    />
                    {/* Interaction Zone */}
                    <rect
                        x={CENTER - 25}
                        y={CENTER - 110}
                        width="50"
                        height="130"
                        fill="transparent"
                        className="cursor-grab active:cursor-grabbing"
                        onPointerDown={(e: any) => handlePointerDown(e, 'h')}
                    />
                </g>

                {/* MINUTE HAND */}
                <g transform={`rotate(${hands.m} ${CENTER} ${CENTER})`} className="drop-shadow-md">
                    <line
                        x1={CENTER}
                        y1={CENTER}
                        x2={CENTER}
                        y2={CENTER - 140}
                        stroke="black"
                        strokeWidth="10"
                        strokeLinecap="round"
                    />
                    <rect
                        x={CENTER - 20}
                        y={CENTER - 160}
                        width="40"
                        height="180"
                        fill="transparent"
                        className="cursor-grab active:cursor-grabbing"
                        onPointerDown={(e: any) => handlePointerDown(e, 'm')}
                    />
                </g>

                {/* SECOND HAND */}
                <g transform={`rotate(${hands.s} ${CENTER} ${CENTER})`} className="drop-shadow-md">
                    <line
                        x1={CENTER}
                        y1={CENTER + 30}
                        x2={CENTER}
                        y2={CENTER - 150}
                        stroke="#d63031"
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                    <circle cx={CENTER} cy={CENTER - 110} r="6" fill="#d63031" />
                    <rect
                        x={CENTER - 15}
                        y={CENTER - 160}
                        width="30"
                        height="200"
                        fill="transparent"
                        className="cursor-grab active:cursor-grabbing"
                        onPointerDown={(e: any) => handlePointerDown(e, 's')}
                    />
                </g>

                {/* 4. CENTER PIN */}
                <circle cx={CENTER} cy={CENTER} r="12" fill="#0984e3" stroke="black" strokeWidth="4" />

            </svg>
        </div>
    );
};
