"use client";

import React, { useState, useEffect } from 'react';
import { Send, RefreshCw, Trophy, Info, Lightbulb } from 'lucide-react';

export default function CyberSegmentsPage() {
    const [targetNumber, setTargetNumber] = useState(0);
    const [segments, setSegments] = useState<Record<string, boolean>>({
        a: false, b: false, c: false, d: false, e: false, f: false, g: false
    });
    const [score, setScore] = useState(0);
    const [message, setMessage] = useState('');
    const [gameState, setGameState] = useState<'playing' | 'success' | 'error'>('playing'); // playing, success, error
    const [showLabels, setShowLabels] = useState(true);

    // Tabla de verdad para números de 7 segmentos
    const TRUTH_TABLE: Record<number, string[]> = {
        0: ['a', 'b', 'c', 'd', 'e', 'f'],
        1: ['b', 'c'],
        2: ['a', 'b', 'd', 'e', 'g'],
        3: ['a', 'b', 'c', 'd', 'g'],
        4: ['b', 'c', 'f', 'g'],
        5: ['a', 'c', 'd', 'f', 'g'],
        6: ['a', 'c', 'd', 'e', 'f', 'g'],
        7: ['a', 'b', 'c'],
        8: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
        9: ['a', 'b', 'c', 'd', 'f', 'g'],
    };

    // Definición de geometrías de los segmentos (SVG Paths)
    // Centrados horizontalmente en un ancho de 120 unidades (centro x=60)
    const SEGMENT_PATHS: Record<string, string> = {
        a: "M 20,10 L 30,0 L 90,0 L 100,10 L 90,20 L 30,20 Z",
        b: "M 100,10 L 110,20 L 110,90 L 100,100 L 90,90 L 90,20 Z",
        c: "M 100,110 L 110,120 L 110,190 L 100,200 L 90,190 L 90,120 Z",
        d: "M 20,200 L 30,190 L 90,190 L 100,200 L 90,210 L 30,210 Z",
        e: "M 20,110 L 30,120 L 30,190 L 20,200 L 10,190 L 10,120 Z",
        f: "M 20,10 L 30,20 L 30,90 L 20,100 L 10,90 L 10,20 Z",
        g: "M 20,105 L 30,95 L 90,95 L 100,105 L 90,115 L 30,115 Z"
    };

    // Coordenadas para las etiquetas de texto
    const LABEL_COORDS: Record<string, { x: number, y: number }> = {
        a: { x: 60, y: 10 },
        b: { x: 105, y: 55 },
        c: { x: 105, y: 155 },
        d: { x: 60, y: 200 },
        e: { x: 15, y: 155 },
        f: { x: 15, y: 55 },
        g: { x: 60, y: 105 }
    };

    useEffect(() => {
        generateNewChallenge();
    }, []);

    const generateNewChallenge = () => {
        const nextNum = Math.floor(Math.random() * 10);
        // Evitar repetir si es posible
        if (nextNum === targetNumber) {
            setTargetNumber((nextNum + 1) % 10);
        } else {
            setTargetNumber(nextNum);
        }
        // Reiniciar segmentos a apagado
        setSegments({ a: false, b: false, c: false, d: false, e: false, f: false, g: false });
        setGameState('playing');
        setMessage('');
    };

    const toggleSegment = (segmentKey: string) => {
        if (gameState === 'success') return;
        setSegments(prev => ({ ...prev, [segmentKey]: !prev[segmentKey] }));
        setGameState('playing');
        setMessage('');
    };

    const checkAnswer = () => {
        const requiredSegments = TRUTH_TABLE[targetNumber];
        const activeSegments = Object.keys(segments).filter(key => segments[key]);
        const isCorrect = requiredSegments.length === activeSegments.length &&
            requiredSegments.every(seg => segments[seg]);

        if (isCorrect) {
            setScore(prev => prev + 10);
            setGameState('success');
            setMessage('¡Correcto! ¡Muy bien!');
            setTimeout(generateNewChallenge, 2000);
        } else {
            setGameState('error');
            setMessage('Ups, no coincide. ¡Revisa el patrón!');
        }
    };

    // Componente Reutilizable de Display 7 Segmentos (SVG)
    const SevenSegmentDigit = ({ activeMap, colorOn, colorOff, showLabels = false, className = "" }: { activeMap: Record<string, boolean>, colorOn: string, colorOff: string, showLabels?: boolean, className?: string }) => {
        return (
            <svg viewBox="0 0 120 220" className={`overflow-visible ${className}`}>
                {Object.keys(SEGMENT_PATHS).map((key) => {
                    const isActive = activeMap[key];
                    return (
                        <g key={key}>
                            <path
                                d={SEGMENT_PATHS[key]}
                                className="transition-all duration-200 ease-out"
                                fill={isActive ? colorOn : colorOff}
                                filter={isActive ? `drop-shadow(0 0 8px ${colorOn}80)` : ''}
                                stroke={isActive ? 'rgba(255,255,255,0.4)' : 'none'}
                                strokeWidth={isActive ? 1 : 0}
                            />
                            {showLabels && (
                                <text
                                    x={LABEL_COORDS[key].x}
                                    y={LABEL_COORDS[key].y}
                                    fill={isActive ? "#78350f" : "#94a3b8"}
                                    className="text-[10px] font-bold select-none pointer-events-none"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                >
                                    {key.toUpperCase()}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>
        );
    };

    // Generar mapa de segmentos activos para el número objetivo
    const getTargetSegmentsMap = (num: number) => {
        const activeList = TRUTH_TABLE[num] || [];
        const map: Record<string, boolean> = { a: false, b: false, c: false, d: false, e: false, f: false, g: false };
        activeList.forEach(k => map[k] = true);
        return map;
    };

    return (
        <div className="min-h-screen bg-slate-900 font-sans flex items-center justify-center p-2 md:p-6 overflow-hidden">

            {/* Container Principal */}
            <div className="relative w-full max-w-5xl bg-slate-800 rounded-[2rem] shadow-2xl overflow-visible border border-slate-700 flex flex-col md:flex-row">

                {/* LADO IZQUIERDO: Display 7-Segmentos PRINCIPAL */}
                <div className="relative z-10 flex-1 p-6 md:p-10 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-700 bg-slate-800/90 rounded-t-[2rem] md:rounded-l-[2rem] md:rounded-tr-none">

                    <div className="bg-slate-900 p-6 rounded-xl border-4 border-slate-600 shadow-xl relative">
                        {/* Tornillos decorativos */}
                        <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-slate-700 flex items-center justify-center"><div className="w-1 h-2 bg-slate-800 rotate-45"></div></div>
                        <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-slate-700 flex items-center justify-center"><div className="w-1 h-2 bg-slate-800 rotate-45"></div></div>
                        <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-slate-700 flex items-center justify-center"><div className="w-1 h-2 bg-slate-800 rotate-45"></div></div>
                        <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-slate-700 flex items-center justify-center"><div className="w-1 h-2 bg-slate-800 rotate-45"></div></div>

                        {/* Display Principal - Usando el componente reutilizable */}
                        <SevenSegmentDigit
                            activeMap={segments}
                            colorOn="#fbbf24" // Amber-400
                            colorOff="#334155" // Slate-700
                            showLabels={showLabels}
                            className="w-[180px] h-[300px] md:w-[220px] md:h-[360px]"
                        />
                    </div>

                    <button
                        onClick={() => setShowLabels(!showLabels)}
                        className="mt-4 flex items-center gap-2 text-slate-400 text-xs hover:text-white transition-colors"
                    >
                        <Info size={14} /> {showLabels ? "Ocultar Etiquetas" : "Mostrar Etiquetas"}
                    </button>
                </div>

                {/* LADO DERECHO: Panel de Control */}
                <div className="relative z-20 flex-1 bg-slate-50 p-6 md:p-8 flex flex-col rounded-b-[2rem] md:rounded-r-[2rem] md:rounded-bl-none">

                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2 bg-slate-200 px-4 py-1.5 rounded-full shadow-inner">
                            <Trophy className="text-yellow-600" size={20} />
                            <span className="font-bold text-slate-700 text-lg">{score}</span>
                        </div>
                        <button
                            onClick={generateNewChallenge}
                            className="p-2 bg-white rounded-full hover:bg-slate-100 shadow-sm border border-slate-200 text-slate-600 transition-all hover:rotate-180 duration-500"
                            title="Nuevo Reto"
                        >
                            <RefreshCw size={20} />
                        </button>
                    </div>

                    {/* OBJETIVO - Ahora estilo LED 7 segmentos */}
                    <div className="flex flex-col items-center mb-8 bg-slate-100 p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <p className="text-slate-500 font-bold text-sm mb-4 text-center uppercase tracking-wide">
                            Objetivo: Formar el número
                        </p>
                        {/* Display Objetivo Miniatura */}
                        <div className="bg-slate-200/50 p-3 rounded-lg">
                            <SevenSegmentDigit
                                activeMap={getTargetSegmentsMap(targetNumber)}
                                colorOn="#06b6d4" // Cyan-500 (similar a la imagen del 9)
                                colorOff="#cbd5e1" // Slate-300 (apagados muy sutiles)
                                showLabels={false}
                                className="w-16 h-24 drop-shadow-sm" // Tamaño más pequeño
                            />
                        </div>
                    </div>

                    {/* Panel de Interruptores (Inputs) - SIN PUNTOS DE COLORES NI CABLES */}
                    <div className="bg-slate-800 rounded-xl p-4 md:p-6 shadow-xl mb-6 relative border-t-4 border-slate-600">
                        {/* Etiqueta estilo Breadboard */}
                        <div className="absolute top-2 left-3 text-[10px] text-slate-400 font-mono tracking-widest">DIGITAL INPUTS</div>

                        <div className="grid grid-cols-7 gap-2 mt-4">
                            {['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((key) => {
                                return (
                                    <div key={key} className="flex flex-col items-center gap-2">
                                        <button
                                            onClick={() => toggleSegment(key)}
                                            className={`
                        w-full aspect-square rounded-lg font-mono font-bold text-lg md:text-xl transition-all duration-100 
                        border-2 flex items-center justify-center shadow-lg
                        ${segments[key]
                                                    ? 'bg-amber-400 border-amber-600 text-amber-900 translate-y-1 shadow-[0_0_10px_rgba(251,191,36,0.5)]'
                                                    : 'bg-white border-slate-300 text-slate-400 -translate-y-0.5 hover:bg-slate-50'}
                      `}
                                        >
                                            {segments[key] ? '1' : '0'}
                                        </button>

                                        <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                                            {key}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Botón Acción */}
                    <div className="mt-auto">
                        <button
                            onClick={checkAnswer}
                            disabled={gameState === 'success'}
                            className={`
                w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg
                ${gameState === 'success'
                                    ? 'bg-green-500 text-white cursor-default ring-4 ring-green-200'
                                    : gameState === 'error'
                                        ? 'bg-red-500 text-white animate-pulse'
                                        : 'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95'}
              `}
                        >
                            {gameState === 'success' ? (
                                <>¡SISTEMA ACTIVADO! <Lightbulb size={20} /></>
                            ) : (
                                <>VERIFICAR CÓDIGO <Send size={20} /></>
                            )}
                        </button>

                        <div className={`h-6 text-center mt-2 font-medium text-sm transition-opacity duration-300 ${message ? 'opacity-100' : 'opacity-0'}`}>
                            <span className={gameState === 'error' ? 'text-red-500' : 'text-green-600'}>
                                {message}
                            </span>
                        </div>
                    </div>

                </div>
            </div>

            {/* Fondo decorativo de cuadrícula */}
            <div className="fixed inset-0 pointer-events-none opacity-5"
                style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            </div>
        </div>
    );
}
