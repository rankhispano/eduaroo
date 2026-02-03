'use client';

import { motion } from 'framer-motion';
import { Star, Trophy } from 'lucide-react';

interface ProgressBarProps {
    current: number;
    total: number;
    showStars?: boolean;
    label?: string;
    className?: string;
}

export default function ProgressBar({
    current,
    total,
    showStars = true,
    label,
    className = ''
}: ProgressBarProps) {
    const percentage = Math.min((current / total) * 100, 100);
    const isComplete = current >= total;

    // Calculate star milestones (25%, 50%, 75%, 100%)
    const milestones = [25, 50, 75, 100];
    const earnedStars = milestones.filter(m => percentage >= m).length;

    return (
        <div className={`w-full ${className}`}>
            {/* Label and counter */}
            <div className="flex justify-between items-center mb-2">
                {label && (
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {label}
                    </span>
                )}
                <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                    {current}/{total}
                </span>
            </div>

            {/* Progress bar container */}
            <div className="relative">
                {/* Background bar */}
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    {/* Animated fill */}
                    <motion.div
                        className={`h-full rounded-full ${isComplete
                                ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                                : 'bg-gradient-to-r from-blue-400 to-indigo-500'
                            }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                </div>

                {/* Star milestones */}
                {showStars && (
                    <div className="absolute inset-0 flex items-center">
                        {milestones.map((milestone, index) => (
                            <div
                                key={milestone}
                                className="absolute transform -translate-x-1/2"
                                style={{ left: `${milestone}%` }}
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{
                                        scale: percentage >= milestone ? 1 : 0.7,
                                        opacity: percentage >= milestone ? 1 : 0.3
                                    }}
                                    transition={{
                                        delay: percentage >= milestone ? 0.3 + index * 0.1 : 0,
                                        type: "spring",
                                        stiffness: 300
                                    }}
                                >
                                    {milestone === 100 ? (
                                        <Trophy
                                            className={`w-5 h-5 ${isComplete
                                                    ? 'text-yellow-400 fill-yellow-400'
                                                    : 'text-gray-400'
                                                }`}
                                        />
                                    ) : (
                                        <Star
                                            className={`w-4 h-4 ${percentage >= milestone
                                                    ? 'text-yellow-400 fill-yellow-400'
                                                    : 'text-gray-400'
                                                }`}
                                        />
                                    )}
                                </motion.div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Celebration message */}
            {isComplete && (
                <motion.div
                    className="mt-2 text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">
                        ¡Ejercicio completado! 🎉
                    </span>
                </motion.div>
            )}
        </div>
    );
}

// Mini progress indicator for exercise cards
export function MiniProgress({
    current,
    total
}: {
    current: number;
    total: number;
}) {
    const percentage = (current / total) * 100;

    return (
        <div className="flex items-center gap-2">
            <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
                {current}/{total}
            </span>
        </div>
    );
}

// Circular progress for dashboards
export function CircularProgress({
    percentage,
    size = 80,
    strokeWidth = 8,
    label
}: {
    percentage: number;
    size?: number;
    strokeWidth?: number;
    label?: string;
}) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={size} height={size} className="-rotate-90">
                {/* Background circle */}
                <circle
                    className="text-gray-200 dark:text-gray-700"
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                {/* Progress circle */}
                <motion.circle
                    className="text-emerald-500"
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{
                        strokeDasharray: circumference,
                    }}
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-gray-700 dark:text-gray-200">
                    {Math.round(percentage)}%
                </span>
                {label && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {label}
                    </span>
                )}
            </div>
        </div>
    );
}
