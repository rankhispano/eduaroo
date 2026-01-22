'use client';

import { useState, useRef, useEffect } from 'react';
import FractionVisual from './FractionVisual';

interface MatchingPair {
    id: number;
    numerator: number;
    denominator: number;
}

interface MatchingExerciseProps {
    pairs: MatchingPair[];
    onUpdate: (connections: Record<number, number>) => void; // visualId -> fractionId
    showResults: boolean;
}

export default function MatchingExercise({ pairs, onUpdate, showResults }: MatchingExerciseProps) {
    // We'll shuffle visual and fraction sides so they don't line up directly
    // But we need to keep track of their original pair IDs to validate
    const [visualItems, setVisualItems] = useState<MatchingPair[]>([]);
    const [fractionItems, setFractionItems] = useState<MatchingPair[]>([]);

    const [selectedVisual, setSelectedVisual] = useState<number | null>(null);
    const [connections, setConnections] = useState<Record<number, number>>({}); // visualId -> fractionId

    const containerRef = useRef<HTMLDivElement>(null);
    const [svgLines, setSvgLines] = useState<{ x1: number, y1: number, x2: number, y2: number, color: string }[]>([]);

    useEffect(() => {
        // Shuffle on mount or when pairs change
        setVisualItems([...pairs].sort(() => Math.random() - 0.5));
        setFractionItems([...pairs].sort(() => Math.random() - 0.5));
        setConnections({});
        setSelectedVisual(null);
    }, [pairs]);

    // Handle drawing lines
    useEffect(() => {
        if (!containerRef.current) return;

        const newLines = Object.entries(connections).map(([visId, fracId]) => {
            const vEl = document.getElementById(`visual-${visId}`);
            const fEl = document.getElementById(`fraction-${fracId}`);

            if (!vEl || !fEl || !containerRef.current) return null;

            const containerRect = containerRef.current.getBoundingClientRect();
            const vRect = vEl.getBoundingClientRect();
            const fRect = fEl.getBoundingClientRect();

            // Color logic for results
            let color = "#3b82f6"; // brand-blue default
            if (showResults) {
                // Check if correct match
                // Since we use the same pair ID for both, if visId == fracId it's correct (assuming IDs are unique per pair)
                // Keys are strings in Object.entries, values are numbers.
                color = parseInt(visId) === fracId ? "#22c55e" : "#ef4444";
            }

            return {
                x1: vRect.right - containerRect.left,
                y1: vRect.top + vRect.height / 2 - containerRect.top,
                x2: fRect.left - containerRect.left,
                y2: fRect.top + fRect.height / 2 - containerRect.top,
                color
            };
        }).filter(Boolean) as any[];

        setSvgLines(newLines);
    }, [connections, visualItems, fractionItems, showResults]);

    // Also re-calculate lines on window resize
    useEffect(() => {
        const handleResize = () => {
            // Force re-render of lines logic
            setConnections(prev => ({ ...prev }));
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    const handleVisualClick = (id: number) => {
        if (showResults) return;
        setSelectedVisual(id);
        // Remove existing connection if any
        const next = { ...connections };
        delete next[id];
        setConnections(next);
        onUpdate(next);
    };

    const handleFractionClick = (id: number) => {
        if (showResults) return;
        if (selectedVisual !== null) {
            const next = { ...connections, [selectedVisual]: id };
            setConnections(next);
            onUpdate(next);
            setSelectedVisual(null);
        }
    };

    return (
        <div className="relative flex justify-between gap-16 p-4" ref={containerRef}>
            {/* SVG Overlay */}
            <svg className="absolute inset-0 pointer-events-none w-full h-full" style={{ zIndex: 10 }}>
                {svgLines.map((line, i) => (
                    <line
                        key={i}
                        x1={line.x1} y1={line.y1}
                        x2={line.x2} y2={line.y2}
                        stroke={line.color}
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                ))}
                {selectedVisual !== null && (
                    // Maybe add a line following cursor? Simplified: just highlighting selected node
                    null
                )}
            </svg>

            {/* Left Column: Visuals */}
            <div className="flex flex-col gap-8 w-1/3">
                {visualItems.map((item) => {
                    const isSelected = selectedVisual === item.id;
                    const isConnected = connections[item.id] !== undefined;

                    return (
                        <div
                            key={item.id}
                            id={`visual-${item.id}`}
                            onClick={() => handleVisualClick(item.id)}
                            className={`
                    flex items-center justify-center p-4 rounded-xl border-2 bg-white dark:bg-gray-800 cursor-pointer transition-all z-20
                    ${isSelected ? 'border-brand-blue ring-2 ring-brand-blue/20' : 'border-gray-200 dark:border-gray-700 hover:border-brand-blue/50'}
                    ${isConnected && !isSelected ? 'border-brand-blue/50' : ''}
                  `}
                        >
                            <FractionVisual
                                numerator={item.numerator}
                                denominator={item.denominator}
                                type="circle"
                                size={80}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Right Column: Fractions */}
            <div className="flex flex-col gap-8 w-1/3">
                {fractionItems.map((item) => {
                    // Find if this is a target of any connection
                    const isConnected = Object.values(connections).includes(item.id);

                    return (
                        <div
                            key={item.id}
                            id={`fraction-${item.id}`}
                            onClick={() => handleFractionClick(item.id)}
                            className={`
                     flex items-center justify-center p-6 rounded-xl border-2 bg-white dark:bg-gray-800 cursor-pointer transition-all z-20 h-[116px]
                     ${isConnected ? 'border-brand-blue/50' : 'border-gray-200 dark:border-gray-700 hover:border-brand-blue/50'}
                   `}
                        >
                            <div className="flex flex-col items-center text-3xl font-bold font-mono text-gray-800 dark:text-gray-200">
                                <span>{item.numerator}</span>
                                <span className="w-full h-0.5 bg-current my-1"></span>
                                <span>{item.denominator}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
