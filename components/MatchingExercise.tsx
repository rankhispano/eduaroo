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
    const [svgLines, setSvgLines] = useState<{ x1: number, y1: number, x2: number, y2: number, color: string, width?: number, dash?: number }[]>([]);

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

        const newLines: { x1: number, y1: number, x2: number, y2: number, color: string, width: number, dash: number }[] = [];

        // 1. Draw User Connections
        Object.entries(connections).forEach(([visId, fracId]) => {
            const vEl = document.getElementById(`visual-${visId}`);
            const fEl = document.getElementById(`fraction-${fracId}`);
            if (!vEl || !fEl || !containerRef.current) return;

            const containerRect = containerRef.current.getBoundingClientRect();
            const vRect = vEl.getBoundingClientRect();
            const fRect = fEl.getBoundingClientRect();

            let color = "#3b82f6"; // Default Blue
            if (showResults) {
                // Correct if IDs match
                color = parseInt(visId) === fracId ? "#22c55e" : "#ef4444";
            }

            newLines.push({
                x1: vRect.right - containerRect.left,
                y1: vRect.top + vRect.height / 2 - containerRect.top,
                x2: fRect.left - containerRect.left,
                y2: fRect.top + fRect.height / 2 - containerRect.top,
                color,
                width: 3,
                dash: 0
            });
        });

        // 2. Draw Missing Correct Connections (if showing results)
        if (showResults) {
            pairs.forEach(pair => {
                const visId = pair.id;
                const fracId = pair.id; // Correct matching is same ID

                // If user ALREADY connected this correctly, we technically don't need to draw it again, 
                // but drawing it again in green is harmless (overlaps).
                // However, let's prioritize showing the solution lines. 
                // A common pattern is: User line (Red/Green) + Solution line (Green Dashed or underneath).
                // Let's draw correct green lines underneath if not already matched correctly.

                // If the user made the correct connection, we already drew a green solid line above.
                // If the user did NOT make this connection (missed or connected wrong), we should show where it SHOULD go.

                const userConnectedTo = connections[visId];
                if (userConnectedTo === fracId) return; // Already correctly connected by user

                const vEl = document.getElementById(`visual-${visId}`);
                const fEl = document.getElementById(`fraction-${fracId}`);
                if (!vEl || !fEl || !containerRef.current) return;

                const containerRect = containerRef.current.getBoundingClientRect();
                const vRect = vEl.getBoundingClientRect();
                const fRect = fEl.getBoundingClientRect();

                newLines.unshift({ // Add to beginning to render BEHIND user lines
                    x1: vRect.right - containerRect.left,
                    y1: vRect.top + vRect.height / 2 - containerRect.top,
                    x2: fRect.left - containerRect.left,
                    y2: fRect.top + fRect.height / 2 - containerRect.top,
                    color: "#22c55e", // Green
                    width: 2,
                    dash: 5 // Dashed to distinguish "Solution" from "User Answer"
                });
            });
        }

        setSvgLines(newLines);
    }, [connections, visualItems, fractionItems, showResults, pairs]);

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
                        strokeWidth={line.width || 3}
                        strokeDasharray={line.dash || 0}
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
