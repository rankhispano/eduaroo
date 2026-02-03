'use client';

import { useState, useRef, useEffect } from 'react';
import FractionVisual from '@/components/math/shared/FractionVisual';

interface MatchingPair {
    id: number;
    // For fractions
    numerator?: number;
    denominator?: number;
    // For text/generic
    left?: string;
    right?: string;
}

interface MatchingExerciseProps {
    pairs: MatchingPair[];
    onUpdate: (connections: Record<number, number>) => void; // visualId -> fractionId
    showResults: boolean;
    leftType?: 'fraction' | 'text';
    rightType?: 'fraction' | 'text';
}

export default function MatchingExercise({
    pairs,
    onUpdate,
    showResults,
    leftType = 'fraction',
    rightType = 'fraction'
}: MatchingExerciseProps) {
    // We'll shuffle left and right sides so they don't line up directly
    // But we need to keep track of their original pair IDs to validate
    const [leftItems, setLeftItems] = useState<MatchingPair[]>([]);
    const [rightItems, setRightItems] = useState<MatchingPair[]>([]);

    // State for a pending selection from either side
    // visualId -> fractionId (left -> right)
    const [connections, setConnections] = useState<Record<number, number>>({});
    const [pendingSelection, setPendingSelection] = useState<{ id: number, side: 'left' | 'right' } | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const [svgLines, setSvgLines] = useState<{ x1: number, y1: number, x2: number, y2: number, color: string, width?: number, dash?: number }[]>([]);

    useEffect(() => {
        // Shuffle on mount or when pairs change
        setLeftItems([...pairs].sort(() => Math.random() - 0.5));
        setRightItems([...pairs].sort(() => Math.random() - 0.5));
        setConnections({});
        setPendingSelection(null);
    }, [pairs]);

    // Handle drawing lines
    useEffect(() => {
        if (!containerRef.current) return;

        const newLines: { x1: number, y1: number, x2: number, y2: number, color: string, width: number, dash: number }[] = [];

        // 1. Draw User Connections
        Object.entries(connections).forEach(([leftId, rightId]) => {
            const lEl = document.getElementById(`left-${leftId}`);
            const rEl = document.getElementById(`right-${rightId}`);
            if (!lEl || !rEl || !containerRef.current) return;

            const containerRect = containerRef.current.getBoundingClientRect();
            const lRect = lEl.getBoundingClientRect();
            const rRect = rEl.getBoundingClientRect();

            let color = "#3b82f6"; // Default Blue
            if (showResults) {
                // Correct if IDs match
                color = parseInt(leftId) === rightId ? "#22c55e" : "#ef4444";
            }

            newLines.push({
                x1: lRect.right - containerRect.left,
                y1: lRect.top + lRect.height / 2 - containerRect.top,
                x2: rRect.left - containerRect.left,
                y2: rRect.top + rRect.height / 2 - containerRect.top,
                color,
                width: 3,
                dash: 0
            });
        });

        // 2. Draw Missing Correct Connections (if showing results)
        if (showResults) {
            pairs.forEach(pair => {
                const leftId = pair.id;
                const rightId = pair.id; // Correct matching is same ID

                const userConnectedTo = connections[leftId];
                if (userConnectedTo === rightId) return; // Already correctly connected by user

                const lEl = document.getElementById(`left-${leftId}`);
                const rEl = document.getElementById(`right-${rightId}`);
                if (!lEl || !rEl || !containerRef.current) return;

                const containerRect = containerRef.current.getBoundingClientRect();
                const lRect = lEl.getBoundingClientRect();
                const rRect = rEl.getBoundingClientRect();

                newLines.unshift({ // Add to beginning to render BEHIND user lines
                    x1: lRect.right - containerRect.left,
                    y1: lRect.top + lRect.height / 2 - containerRect.top,
                    x2: rRect.left - containerRect.left,
                    y2: rRect.top + rRect.height / 2 - containerRect.top,
                    color: "#22c55e", // Green
                    width: 2,
                    dash: 5 // Dashed to distinguish "Solution" from "User Answer"
                });
            });
        }

        setSvgLines(newLines);
    }, [connections, leftItems, rightItems, showResults, pairs]);

    // Also re-calculate lines on window resize
    useEffect(() => {
        const handleResize = () => {
            // Force re-render of lines logic
            setConnections(prev => ({ ...prev }));
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleItemClick = (id: number, side: 'left' | 'right') => {
        if (showResults) return;

        // 1. If we click an item that is already connected, remove its connection
        if (side === 'left') {
            if (connections[id] !== undefined) {
                const next = { ...connections };
                delete next[id];
                setConnections(next);
                onUpdate(next);
            }
        } else {
            // Find left ID that connects to this right ID
            const leftId = Object.keys(connections).find(key => connections[parseInt(key)] === id);
            if (leftId) {
                const next = { ...connections };
                delete next[parseInt(leftId)];
                setConnections(next);
                onUpdate(next);
            }
        }

        // 2. Interaction logic
        if (!pendingSelection) {
            // Nothing selected yet, set this as pending
            setPendingSelection({ id, side });
        } else if (pendingSelection.side === side) {
            // Clicked same side again, switch selection or toggle
            if (pendingSelection.id === id) {
                setPendingSelection(null);
            } else {
                setPendingSelection({ id, side });
            }
        } else {
            // Clicked opposite side! Create connection
            const leftId = side === 'left' ? id : pendingSelection.id;
            const rightId = side === 'right' ? id : pendingSelection.id;

            // Ensure mutual exclusivity: remove existing connections for these specific IDs
            const next = { ...connections };

            // Remove any existing connection for this left item
            delete next[leftId];

            // Remove any existing connection targeting this right item
            const existingLeftId = Object.keys(next).find(key => next[parseInt(key)] === rightId);
            if (existingLeftId) {
                delete next[parseInt(existingLeftId)];
            }

            // Set new connection
            next[leftId] = rightId;
            setConnections(next);
            onUpdate(next);
            setPendingSelection(null);
        }
    };

    const handleLeftClick = (id: number) => handleItemClick(id, 'left');
    const handleRightClick = (id: number) => handleItemClick(id, 'right');

    const isSelected = (id: number, side: 'left' | 'right') =>
        pendingSelection?.id === id && pendingSelection?.side === side;

    const renderContent = (item: MatchingPair, type: 'fraction' | 'text', side: 'left' | 'right') => {
        if (type === 'fraction') {
            if (side === 'left') {
                // Visual
                return (
                    <FractionVisual
                        numerator={item.numerator || 1}
                        denominator={item.denominator || 2}
                        type="circle"
                        size={80}
                    />
                );
            } else {
                // Number
                return (
                    <div className="flex flex-col items-center text-3xl font-bold font-mono text-gray-800 dark:text-gray-200">
                        <span>{item.numerator}</span>
                        <span className="w-full h-0.5 bg-current my-1"></span>
                        <span>{item.denominator}</span>
                    </div>
                );
            }
        } else {
            // Text Content
            const text = side === 'left' ? item.left : item.right;
            return (
                <div className="text-xl font-bold text-gray-700 dark:text-gray-200">
                    {text}
                </div>
            );
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
            </svg>

            {/* Left Column */}
            <div className="flex flex-col gap-8 w-1/3">
                {leftItems.map((item) => {
                    const active = isSelected(item.id, 'left');
                    const isConnected = connections[item.id] !== undefined;

                    return (
                        <div
                            key={item.id}
                            id={`left-${item.id}`}
                            onClick={() => handleLeftClick(item.id)}
                            className={`
                    flex items-center justify-center p-4 rounded-xl border-2 bg-white dark:bg-gray-800 cursor-pointer transition-all z-20 min-h-[100px]
                    ${active ? 'border-brand-blue ring-2 ring-brand-blue/20' : 'border-gray-200 dark:border-gray-700 hover:border-brand-blue/50'}
                    ${isConnected && !active ? 'border-brand-blue/50' : ''}
                  `}
                        >
                            {renderContent(item, leftType, 'left')}
                        </div>
                    );
                })}
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-8 w-1/3">
                {rightItems.map((item) => {
                    const isConnected = Object.values(connections).includes(item.id);
                    const active = isSelected(item.id, 'right');

                    return (
                        <div
                            key={item.id}
                            id={`right-${item.id}`}
                            onClick={() => handleRightClick(item.id)}
                            className={`
                     flex items-center justify-center p-6 rounded-xl border-2 bg-white dark:bg-gray-800 cursor-pointer transition-all z-20 min-h-[100px]
                     ${active ? 'border-brand-blue ring-2 ring-brand-blue/20' : isConnected ? 'border-brand-blue/50' : 'border-gray-200 dark:border-gray-700 hover:border-brand-blue/50'}
                   `}
                        >
                            {renderContent(item, rightType, 'right')}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

