'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Clock, AlertTriangle } from 'lucide-react';

interface LessonTimerProps {
    durationMinutes: number;
    onTimeUp?: () => void;
    onTick?: (remainingSeconds: number) => void;
    autoStart?: boolean;
    showWarningAt?: number; // Seconds remaining to show warning
}

export default function LessonTimer({
    durationMinutes,
    onTimeUp,
    onTick,
    autoStart = false,
    showWarningAt = 60,
}: LessonTimerProps) {
    const totalSeconds = durationMinutes * 60;
    const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);
    const [isRunning, setIsRunning] = useState(autoStart);
    const [showWarning, setShowWarning] = useState(false);

    // Calculate progress
    const progress = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
    const isWarning = remainingSeconds <= showWarningAt && remainingSeconds > 0;
    const isTimeUp = remainingSeconds <= 0;

    // Format time as MM:SS
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Timer effect
    useEffect(() => {
        if (!isRunning || isTimeUp) return;

        const interval = setInterval(() => {
            setRemainingSeconds((prev) => {
                const next = prev - 1;
                onTick?.(next);

                if (next <= 0) {
                    setIsRunning(false);
                    onTimeUp?.();
                    return 0;
                }
                return next;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, isTimeUp, onTick, onTimeUp]);

    // Warning effect
    useEffect(() => {
        if (isWarning && !showWarning) {
            setShowWarning(true);
        }
    }, [isWarning, showWarning]);

    const toggleTimer = useCallback(() => {
        setIsRunning((prev) => !prev);
    }, []);

    const resetTimer = useCallback(() => {
        setRemainingSeconds(totalSeconds);
        setIsRunning(false);
        setShowWarning(false);
    }, [totalSeconds]);

    // Get color based on time remaining
    const getTimerColor = () => {
        if (isTimeUp) return 'text-red-500';
        if (isWarning) return 'text-orange-500';
        return 'text-emerald-500';
    };

    const getProgressColor = () => {
        if (isTimeUp) return 'bg-red-500';
        if (isWarning) return 'bg-orange-500';
        return 'bg-emerald-500';
    };

    return (
        <div className="relative">
            {/* Timer display */}
            <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-md">
                {/* Play/Pause button */}
                <button
                    onClick={toggleTimer}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isRunning
                            ? 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                            : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                        }`}
                >
                    {isRunning ? (
                        <Pause className="w-4 h-4" />
                    ) : (
                        <Play className="w-4 h-4 ml-0.5" />
                    )}
                </button>

                {/* Time display */}
                <div className="flex items-center gap-2">
                    <Clock className={`w-4 h-4 ${getTimerColor()}`} />
                    <span className={`font-mono font-bold text-lg ${getTimerColor()}`}>
                        {formatTime(remainingSeconds)}
                    </span>
                </div>

                {/* Progress bar */}
                <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                        className={`h-full ${getProgressColor()}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            {/* Warning popup */}
            <AnimatePresence>
                {showWarning && !isTimeUp && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-orange-500 text-white px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2 whitespace-nowrap"
                    >
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm font-medium">¡Queda 1 minuto!</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Compact version for headers
export function MiniTimer({
    remainingSeconds,
    totalSeconds,
}: {
    remainingSeconds: number;
    totalSeconds: number;
}) {
    const progress = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
    const isWarning = remainingSeconds <= 60;

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex items-center gap-2">
            <div className={`font-mono text-sm font-bold ${isWarning ? 'text-orange-500' : 'text-gray-600 dark:text-gray-400'}`}>
                {formatTime(remainingSeconds)}
            </div>
            <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all duration-300 ${isWarning ? 'bg-orange-500' : 'bg-emerald-500'}`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
