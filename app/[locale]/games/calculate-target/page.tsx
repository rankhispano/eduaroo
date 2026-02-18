'use client';

import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { RefreshCcw, ArrowRight, Trophy, Home } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

// --- CONFIGURACIÓN DE NIVELES ---
type Operator = "+" | "-" | "×" | "÷";

const generateLevel = (levelIdx: number) => {
    const levelNum = levelIdx + 1;
    let numItems = 2;
    let maxNumber = 10;
    let allowedOps: Operator[] = ['+']; // Start very simple

    // Difficulty Curve (Easier start, <100 until level 12)
    if (levelNum >= 3) { maxNumber = 20; allowedOps.push('-'); }
    if (levelNum >= 5) { numItems = 3; maxNumber = 50; }
    if (levelNum >= 8) { allowedOps.push('×'); }
    if (levelNum >= 10) { maxNumber = 90; } // Still under 100

    // Level 12+: Increase complexity
    if (levelNum >= 12) { numItems = 4; maxNumber = 150; allowedOps.push('÷'); }
    if (levelNum >= 16) { numItems = 5; maxNumber = 250; }

    // Start with a random number
    let current = Math.floor(Math.random() * 10) + 1;
    const start = current;
    const hand: number[] = [];

    // Construct the target
    for (let i = 0; i < numItems; i++) {
        let success = false;
        let attempts = 0;

        while (!success && attempts < 20) {
            const op = allowedOps[Math.floor(Math.random() * allowedOps.length)];
            const val = Math.floor(Math.random() * (maxNumber - 1)) + 2;

            let next = current;
            if (op === '+') next += val;
            if (op === '-') next -= val;
            if (op === '×') next *= val;
            if (op === '÷') {
                if (val !== 0 && current % val === 0) next /= val;
                else { attempts++; continue; }
            }

            // Validity checks: positive, integer, not too huge
            if (next > 0 && Number.isInteger(next) && next <= 1000) {
                current = next;
                hand.push(val);
                success = true;
            }
            attempts++;
        }

        if (!success) {
            // Fallback: simple addition
            current += 1;
            hand.push(1);
        }
    }

    return { id: levelNum, target: current, start, hand };
};

type GameState = {
    currentValue: number;
    hand: number[];
    history: number[];
};

const CalculateTargetPage = () => {
    const t = useTranslations('GamesPage.calculateTargetMessages');
    const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
    const [gameState, setGameState] = useState<GameState>({
        currentValue: 0,
        hand: [],
        history: [],
    });
    const [feedback, setFeedback] = useState<"neutral" | "error">("neutral");
    const [isCompleted, setIsCompleted] = useState(false);
    const [activeOp, setActiveOp] = useState<Operator | null>(null); // Operador resaltado durante el drag
    const [isDragging, setIsDragging] = useState(false); // Estado para saber si hay un drag activo

    const opRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const [levelData, setLevelData] = useState(() => generateLevel(0));

    // Initialize level on mount and when level changes
    useEffect(() => {
        const newLevel = generateLevel(currentLevelIdx);
        setLevelData(newLevel);

        setGameState({
            currentValue: newLevel.start,
            hand: [...newLevel.hand],
            history: [],
        });
        setIsCompleted(false);
        setFeedback("neutral");
        setActiveOp(null);
        setIsDragging(false);
    }, [currentLevelIdx]);

    const resetLevel = () => {
        setGameState({
            currentValue: levelData.start,
            hand: [...levelData.hand],
            history: [],
        });
        setIsCompleted(false);
        setFeedback("neutral");
        setActiveOp(null);
        setIsDragging(false);
    };

    const calculate = (a: number, b: number, op: Operator): number | null => {
        switch (op) {
            case "+": return a + b;
            case "-": return a - b;
            case "×": return a * b;
            case "÷":
                if (b === 0 || a % b !== 0) return null;
                return a / b;
            default: return null;
        }
    };

    // Función para detectar en qué operador está el número
    const getDetectedOp = (x: number, y: number): Operator | null => {
        for (const op in opRefs.current) {
            const el = opRefs.current[op];
            if (!el) continue;
            const rect = el.getBoundingClientRect();
            if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                return op as Operator;
            }
        }
        return null;
    };

    const handleDragStart = () => {
        setIsDragging(true);
    };

    const handleDrag = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const op = getDetectedOp(info.point.x, info.point.y);
        setActiveOp(op);
    };

    const handleDropLogic = (val: number, x: number, y: number) => {
        const detectedOp = getDetectedOp(x, y);
        setActiveOp(null);
        setIsDragging(false);

        if (detectedOp) {
            const result = calculate(gameState.currentValue, val, detectedOp);

            if (result === null) {
                setFeedback("error");
                setTimeout(() => setFeedback("neutral"), 600);
            } else {
                // Éxito: El número se "consume"
                const indexToRemove = gameState.hand.indexOf(val);
                const nextHand = [...gameState.hand];
                nextHand.splice(indexToRemove, 1);

                setGameState({
                    currentValue: result,
                    hand: nextHand,
                    history: [...gameState.history, gameState.currentValue],
                });

                if (result === levelData.target) {
                    setIsCompleted(true);
                    confetti({
                        particleCount: 150,
                        spread: 70,
                        origin: { y: 0.6 },
                        colors: ['#F59E0B', '#10B981', '#3B82F6']
                    });
                }
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFBF0] font-sans flex flex-col items-center p-6 text-slate-800 select-none touch-none overflow-hidden">

            {/* CABECERA */}
            <header className="w-full max-w-lg flex justify-between items-center mb-8">
                <Link href="/games">
                    <div className="p-3 bg-white rounded-2xl shadow-sm border-b-4 border-slate-100 cursor-pointer">
                        <Home className="w-6 h-6 text-slate-400" />
                    </div>
                </Link>
                <div className="bg-white px-6 py-2 rounded-full shadow-sm border-b-4 border-slate-100 font-black text-slate-400 uppercase text-sm tracking-widest">
                    {t('level')} {currentLevelIdx + 1}
                </div>
                <div onClick={resetLevel} className="p-3 bg-white rounded-2xl shadow-sm border-b-4 border-slate-100 cursor-pointer group">
                    <RefreshCcw className="w-6 h-6 text-slate-400 group-hover:rotate-180 transition-transform duration-500" />
                </div>
            </header>

            {/* TABLERO OBJETIVO */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white px-10 py-6 rounded-[32px] shadow-sm border-b-8 border-orange-100 mb-12 flex flex-col items-center min-w-[200px]"
            >
                <span className="text-xs font-black text-orange-400 uppercase tracking-widest mb-1">{t('target')}</span>
                <div className="text-6xl font-black text-slate-700">{levelData.target}</div>
            </motion.div>

            {/* ÁREA DE JUEGO (LA CRUZ) */}
            <div className="relative w-80 h-80 mb-16 flex items-center justify-center">

                <OperatorZone
                    op="×"
                    position="top"
                    isActive={activeOp === "×"}
                    isDragging={isDragging}
                    refEl={(el) => (opRefs.current["×"] = el)}
                />
                <OperatorZone
                    op="+"
                    position="right"
                    isActive={activeOp === "+"}
                    isDragging={isDragging}
                    refEl={(el) => (opRefs.current["+"] = el)}
                />
                <OperatorZone
                    op="-"
                    position="left"
                    isActive={activeOp === "-"}
                    isDragging={isDragging}
                    refEl={(el) => (opRefs.current["-"] = el)}
                />
                <OperatorZone
                    op="÷"
                    position="bottom"
                    isActive={activeOp === "÷"}
                    isDragging={isDragging}
                    refEl={(el) => (opRefs.current["÷"] = el)}
                />

                {/* Valor Actual Central */}
                <motion.div
                    key={gameState.currentValue}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{
                        scale: 1,
                        opacity: 1,
                        x: feedback === "error" ? [0, -10, 10, -10, 10, 0] : 0
                    }}
                    className={`text-7xl font-black z-10 transition-colors duration-300 ${isCompleted ? "text-emerald-500" : feedback === "error" ? "text-red-500" : "text-slate-700"
                        }`}
                >
                    {gameState.currentValue}
                </motion.div>

                <div className="absolute inset-0 border-4 border-slate-50 rounded-full -z-10 scale-110" />
            </div>

            {/* MANO DEL JUGADOR */}
            <div className="flex flex-wrap justify-center gap-6 min-h-[120px] max-w-md">
                <AnimatePresence mode="popLayout">
                    {gameState.hand.map((num, idx) => (
                        <DraggableNumber
                            key={`${currentLevelIdx}-${idx}-${num}`}
                            value={num}
                            onDragStart={handleDragStart}
                            onDrag={handleDrag}
                            onDropLogic={handleDropLogic}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {/* MODAL DE VICTORIA */}
            <AnimatePresence>
                {isCompleted && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6 z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white p-8 rounded-[40px] shadow-2xl flex flex-col items-center text-center max-w-sm w-full border-b-[12px] border-emerald-100"
                        >
                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                                <Trophy className="w-10 h-10 text-emerald-500" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-800 mb-2">{t('great')}</h2>
                            <p className="text-slate-500 mb-8 font-medium">{t('levelCompleted')}</p>

                            <button
                                onClick={() => {
                                    if (currentLevelIdx < 19) setCurrentLevelIdx(prev => prev + 1);
                                    else setCurrentLevelIdx(0);
                                }}
                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 px-8 rounded-2xl flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all text-lg"
                            >
                                {currentLevelIdx < 19 ? t('next') : t('restart')}
                                <ArrowRight className="w-6 h-6" />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
        body { background-color: #FFFBF0; overflow: hidden; }
      `}</style>
        </div>
    );
};

// --- SUB-COMPONENTES ---

type OperatorZoneProps = {
    op: string;
    position: "top" | "bottom" | "left" | "right";
    isActive: boolean;
    isDragging: boolean;
    refEl: (el: HTMLDivElement | null) => void;
};

const OperatorZone = ({ op, position, isActive, isDragging, refEl }: OperatorZoneProps) => {
    const positions = {
        top: "top-0 left-1/2 -translate-x-1/2 -translate-y-8",
        bottom: "bottom-0 left-1/2 -translate-x-1/2 translate-y-8",
        left: "top-1/2 left-0 -translate-x-8 -translate-y-1/2",
        right: "top-1/2 right-0 translate-x-8 -translate-y-1/2",
    };

    // Lógica de colores dinámica
    let borderClass = "border-slate-200 bg-white/50 text-slate-800"; // Negro/Oscuro por defecto
    let scale = 1;

    if (isActive) {
        borderClass = "border-orange-400 bg-orange-50 text-orange-400 shadow-lg";
        scale = 1.15;
    } else if (isDragging) {
        borderClass = "border-slate-300 bg-slate-50 text-slate-400"; // Grisáceo al arrastrar
    }

    return (
        <motion.div
            ref={refEl}
            animate={{ scale }}
            className={`absolute ${positions[position]} w-24 h-24 rounded-[32px] border-4 border-dashed flex items-center justify-center text-5xl font-black transition-colors duration-200 z-0 ${borderClass}`}
        >
            {op}
        </motion.div>
    );
};

type DraggableNumberProps = {
    value: number;
    onDragStart: () => void;
    onDrag: (e: any, info: PanInfo) => void;
    onDropLogic: (val: number, x: number, y: number) => void;
}

const DraggableNumber = forwardRef<HTMLDivElement, DraggableNumberProps>(({ value, onDragStart, onDrag, onDropLogic }, ref) => {
    return (
        <motion.div
            ref={ref}
            layout
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0, opacity: 0, transition: { duration: 0.2 } }}
            drag
            dragSnapToOrigin
            dragElastic={0.1}
            whileDrag={{ scale: 1.2, zIndex: 100 }}
            onDragStart={onDragStart}
            onDrag={onDrag}
            onDragEnd={(e, info) => onDropLogic(value, info.point.x, info.point.y)}
            className="w-20 h-20 bg-orange-400 text-white rounded-[24px] shadow-[0_8px_0_0_#D97706] active:shadow-none active:translate-y-2 flex items-center justify-center text-3xl font-black cursor-grab touch-none"
        >
            {value}
        </motion.div>
    );
});

DraggableNumber.displayName = "DraggableNumber";

export default CalculateTargetPage;
