'use client';

import { motion } from 'framer-motion';
import { Lock, Star, Play } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { LearningUnit } from '@/lib/learning/microLessonSystem';
import { useEffect, useRef, useState, useMemo } from 'react';
import { useLocale } from 'next-intl';

interface UnitPathMapProps {
    units: LearningUnit[];
    basePath: string; // e.g. /learning/math/grade4
}

// Config for the path layout
const CONFIG = {
    CANVAS_WIDTH: 600,
    NODE_SIZE: 100, // Slightly smaller to fit mobile better if scaled
    ROW_HEIGHT: 180,
    OFFSET_X: 140, // Distance from center
    START_Y: 80,
};

export default function UnitPathMap({ units, basePath }: UnitPathMapProps) {
    const locale = useLocale();
    const totalHeight = CONFIG.START_Y + (units.length - 1) * CONFIG.ROW_HEIGHT + 200; // Extra padding at bottom
    const centerX = CONFIG.CANVAS_WIDTH / 2;

    // Helper to get coordinates for a node index
    const getCoordinates = (index: number) => {
        const isLeft = index % 2 === 0;
        const x = isLeft ? centerX - CONFIG.OFFSET_X : centerX + CONFIG.OFFSET_X;
        const y = CONFIG.START_Y + index * CONFIG.ROW_HEIGHT;
        return { x, y };
    };

    // Memoize path string to ensure consistency
    const pathD = useMemo(() => generatePathD(units.length, centerX), [units.length, centerX]);
    const pathRef = useRef<SVGPathElement>(null);
    const [kangarooPos, setKangarooPos] = useState({ x: 0, y: 0, angle: 0 });
    const [isMovingForward, setIsMovingForward] = useState(true);
    const [spriteFrame, setSpriteFrame] = useState(0);

    // Use refs for animation state to avoid closure staleness in rAF
    const spriteFrameRef = useRef(0);
    const accumulatedTimeRef = useRef(0);
    const lastTimeRef = useRef(0);

    // Sprite Loop
    useEffect(() => {
        const interval = setInterval(() => {
            setSpriteFrame(prev => {
                const next = (prev + 1) % 6;
                spriteFrameRef.current = next; // Sync ref
                return next;
            });
        }, 120); // 120ms per frame
        return () => clearInterval(interval);
    }, []);

    // Movement Loop
    useEffect(() => {
        const path = pathRef.current;
        if (!path) return;

        let animationFrameId: number;
        const duration = 15000; // 15 seconds for one way traversal (slow and steady)

        const animate = (time: number) => {
            if (!lastTimeRef.current) lastTimeRef.current = time;
            const deltaTime = time - lastTimeRef.current;
            lastTimeRef.current = time;

            // Only advance if allowed by frame
            // Frames 0 and 5 are "ground" frames where we shouldn't slide
            const currentFrame = spriteFrameRef.current;
            const shouldMove = currentFrame !== 0 && currentFrame !== 5;

            if (shouldMove) {
                accumulatedTimeRef.current += deltaTime;
            }

            // Calculate raw progress (0 to 1) based on time and direction
            // const elapsed = time - startTime; // OLD

            const cycleProgress = (accumulatedTimeRef.current % (duration * 2)) / duration; // 0 -> 2

            // 0 -> 1: Forward
            // 1 -> 2: Backward
            const forward = cycleProgress < 1;
            const progress = forward ? cycleProgress : 2 - cycleProgress;

            const length = path.getTotalLength();
            const point = path.getPointAtLength(length * progress);

            setKangarooPos(prev => {
                const isFacingRight = point.x > prev.x;
                // Only update facing if there's significant movement to avoid jitter
                const stableFacing = Math.abs(point.x - prev.x) > 0.5 ? isFacingRight : (prev.angle === 0);

                return {
                    x: point.x,
                    y: point.y,
                    angle: stableFacing ? 0 : 180 // 0 = Right, 180 = Left (via transform)
                };
            });

            setIsMovingForward(forward);

            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, [pathD]);

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="relative w-full" style={{ paddingBottom: `${(totalHeight / CONFIG.CANVAS_WIDTH) * 100}%` }}>
                <div className="absolute inset-0 w-full h-full">
                    {/* SVG Connector Path & Overlay */}
                    <svg
                        viewBox={`0 0 ${CONFIG.CANVAS_WIDTH} ${totalHeight}`}
                        className="w-full h-full"
                        preserveAspectRatio="xMidYMin meet"
                    >
                        {/* Background Path (Gray) */}
                        <path
                            d={pathD}
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="12"
                            strokeLinecap="round"
                            className="dark:stroke-gray-700"
                        />
                        {/* Progress Path (Blue Dashed) */}
                        <path
                            ref={pathRef} // Reference this used for calculation
                            d={pathD}
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray="12 12"
                            className="opacity-30"
                        />
                    </svg>

                    {/* Animated Kangaroo */}
                    {kangarooPos.x !== 0 && (
                        <div
                            className="absolute pointer-events-none z-20"
                            style={{
                                left: `${(kangarooPos.x / CONFIG.CANVAS_WIDTH) * 100}%`,
                                top: `${(kangarooPos.y / totalHeight) * 100}%`,
                                transform: 'translate(-50%, -80%)', // Shift up so feet act as anchor
                                // We separate the flip transform to inner div or combine
                            }}
                        >
                            <div
                                style={{
                                    transform: `scaleX(${kangarooPos.angle === 0 ? 1 : -1})`, // Flip horizontally
                                    transition: 'transform 0.1s'
                                }}
                            >
                                <div
                                    style={{
                                        width: '64px', // 32 * 2
                                        height: '64px', // 32 * 2
                                        backgroundImage: 'url(/kangaroo-sprite.png)',
                                        backgroundPosition: `-${spriteFrame * 32 * 2}px 0px`, // Row 0 is Hop
                                        backgroundSize: `${192 * 2}px ${96 * 2}px`,
                                        imageRendering: 'pixelated',
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Nodes Layer */}
                    {units.map((unit, index) => {
                        const { x, y } = getCoordinates(index);
                        const status = unit.status;
                        const isLocked = status === 'locked';
                        const isCompleted = status === 'completed';
                        const isAvailable = status === 'available';

                        return (
                            <motion.div
                                key={unit.id}
                                initial={{ opacity: 0, scale: 0, y: 20 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="absolute"
                                style={{
                                    left: `${(x / CONFIG.CANVAS_WIDTH) * 100}%`,
                                    top: `${(y / totalHeight) * 100}%`,
                                }}
                            >
                                <div className="relative flex flex-col items-center" style={{ transform: 'translate(-50%, -50%)' }}>
                                    {/* Link Container - strictly centered on the coordinate if we account for the label offset? 
                                        Actually, simpler: Wrapper is at X,Y. 
                                        We want the center of the CIRCLE to be at X,Y.
                                        So we shift the whole group up by (label_height / 2)? No, that varies.
                                        
                                        Better approach:
                                        Wrapper is at X,Y.
                                        Circle is absolute centered at 0,0.
                                        Label is absolute below.
                                    */}
                                </div>

                                {/* 
                                    Correct Strategy: 
                                    The motion.div is positioned at {x,y} (top-left of the div).
                                    We want the CENTER of the Link (Circle) to be at {x,y}.
                                    So we don't use a flex container for layout that affects centering.
                                */}

                                <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-40 pointer-events-none">
                                    {/* Pointer events none on wrapper to avoid blocking clicks, allow on children */}
                                    <Link
                                        href={!isLocked ? `${basePath}/${unit.id.split('_').pop()}` : '#'}
                                        className={`
                                            pointer-events-auto
                                            relative flex items-center justify-center w-24 h-24 rounded-full border-8 shadow-lg z-10
                                            transition-transform duration-300 hover:scale-105 active:scale-95
                                            bg-white dark:bg-gray-800
                                            ${isLocked
                                                ? 'border-gray-300 dark:border-gray-700 grayscale cursor-not-allowed'
                                                : isCompleted
                                                    ? 'border-yellow-400 cursor-pointer'
                                                    : 'border-brand-blue hover:border-blue-400 cursor-pointer animate-pulse-slow'
                                            }
                                        `}
                                    >
                                        <span className="text-4xl select-none">
                                            {isLocked ? '🔒' : unit.iconEmoji}
                                        </span>

                                        {/* Status Badge */}
                                        <div className="absolute -bottom-2 z-20">
                                            {isLocked && <div className="bg-gray-500 p-1.5 rounded-full ring-4 ring-white dark:ring-black"><Lock className="w-3 h-3 text-white" /></div>}
                                            {isAvailable && <div className="bg-brand-blue p-1.5 rounded-full ring-4 ring-white dark:ring-black animate-bounce"><Play className="w-3 h-3 text-white fill-current" /></div>}
                                            {isCompleted && <div className="bg-yellow-500 p-1.5 rounded-full ring-4 ring-white dark:ring-black"><Star className="w-3 h-3 text-white fill-current" /></div>}
                                        </div>
                                    </Link>

                                    {/* Special Link for Word Problems in Fractions (Grade 4) */}
                                    {unit.id === 'math_g4_fractions' && !isLocked && (
                                        <Link
                                            href={`${basePath}/fractions/problems`}
                                            className="absolute -top-4 right-2 pointer-events-auto z-30 w-12 h-12 rounded-full bg-blue-200 border-4 border-white dark:border-gray-900 shadow-xl flex items-center justify-center hover:scale-110 transition-transform hover:bg-blue-400"
                                            title={locale === 'es' ? "Problemas de Matemáticas" : "Math Word Problems"}
                                        >
                                            <span className="text-xl">🧮</span>
                                        </Link>
                                    )}

                                    {/* Title Label (Average visual centering relative to path) */}
                                    <div className={`
                                        mt-4 px-3 py-1.5 rounded-xl font-bold text-sm text-center shadow-md border z-0 pointer-events-auto
                                        ${isLocked
                                            ? 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                                            : 'bg-white text-gray-800 border-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600'
                                        }
                                    `}>
                                        {locale === 'en' ? unit.titleEn : unit.titleEs}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function generatePathD(count: number, centerX: number): string {
    const { START_Y, ROW_HEIGHT, OFFSET_X } = CONFIG;
    const leftX = centerX - OFFSET_X;
    const rightX = centerX + OFFSET_X;

    let path = `M ${leftX} ${START_Y}`;

    for (let i = 0; i < count - 1; i++) {
        const isEven = i % 2 === 0;
        const currentY = START_Y + i * ROW_HEIGHT;
        const nextY = START_Y + (i + 1) * ROW_HEIGHT;

        // Coordinates
        const startX = isEven ? leftX : rightX;
        const endX = isEven ? rightX : leftX;

        // Control points for smooth S-curve
        const cp1x = startX;
        const cp1y = currentY + ROW_HEIGHT * 0.5;
        const cp2x = endX;
        const cp2y = nextY - ROW_HEIGHT * 0.5;

        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${nextY}`;
    }

    return path;
}
