'use client';

import { motion } from 'framer-motion';
import { Lock, Play, Check, Star, Clock, ChevronRight } from 'lucide-react';
import {
    MicroLesson,
    LessonStatus,
    LESSON_TYPE_CONFIG,
    formatDuration,
    canStartLesson,
} from '@/lib/learning/microLessonSystem';

interface MicroLessonCardProps {
    lesson: MicroLesson;
    index: number;
    locale?: string;
    onStart?: (lesson: MicroLesson) => void;
}

export default function MicroLessonCard({
    lesson,
    index,
    locale = 'es',
    onStart,
}: MicroLessonCardProps) {
    const config = LESSON_TYPE_CONFIG[lesson.type];
    const isSpanish = locale === 'es';
    const title = isSpanish ? lesson.titleEs : lesson.titleEn;
    const description = isSpanish ? lesson.descriptionEs : lesson.descriptionEn;
    const canStart = canStartLesson(lesson);

    // Status-specific styling
    const getStatusStyles = (): { opacity: string; cursor: string; ring: string } => {
        switch (lesson.status) {
            case 'locked':
                return { opacity: 'opacity-50', cursor: 'cursor-not-allowed', ring: '' };
            case 'available':
                return { opacity: '', cursor: 'cursor-pointer', ring: 'ring-2 ring-emerald-500 ring-offset-2' };
            case 'in_progress':
                return { opacity: '', cursor: 'cursor-pointer', ring: 'ring-2 ring-yellow-500 ring-offset-2' };
            case 'completed':
                return { opacity: '', cursor: 'cursor-pointer', ring: '' };
            case 'mastered':
                return { opacity: '', cursor: 'cursor-pointer', ring: 'ring-2 ring-purple-500 ring-offset-2' };
            default:
                return { opacity: '', cursor: 'cursor-pointer', ring: '' };
        }
    };

    const statusStyles = getStatusStyles();

    // Status badge
    const renderStatusBadge = () => {
        switch (lesson.status) {
            case 'locked':
                return (
                    <div className="bg-gray-400 text-white p-2 rounded-full">
                        <Lock className="w-4 h-4" />
                    </div>
                );
            case 'available':
                return (
                    <div className="bg-emerald-500 text-white p-2 rounded-full animate-pulse">
                        <Play className="w-4 h-4" />
                    </div>
                );
            case 'in_progress':
                return (
                    <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        En curso
                    </div>
                );
            case 'completed':
                return (
                    <div className="bg-blue-500 text-white p-2 rounded-full">
                        <Check className="w-4 h-4" />
                    </div>
                );
            case 'mastered':
                return (
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-full">
                        <Star className="w-4 h-4 fill-white" />
                    </div>
                );
        }
    };

    const handleClick = () => {
        if (canStart && onStart) {
            onStart(lesson);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={handleClick}
            className={`relative flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 transition-all hover:shadow-lg ${statusStyles.opacity} ${statusStyles.cursor} ${statusStyles.ring}`}
        >
            {/* Lesson number indicator */}
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300">
                {index + 1}
            </div>

            {/* Connector line to next lesson */}
            {index < 5 && (
                <div className="absolute left-9 top-full w-0.5 h-4 bg-gray-200 dark:bg-gray-700" />
            )}

            {/* Content */}
            <div className="flex-grow min-w-0">
                {/* Type badge */}
                <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gradient-to-r ${config.colorClass} text-white text-xs font-medium mb-1`}>
                    <span>{config.emoji}</span>
                    <span className="capitalize">{lesson.type}</span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-gray-900 dark:text-white truncate">
                    {title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {description}
                </p>

                {/* Meta info */}
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-400 dark:text-gray-500">
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDuration(lesson.durationMinutes)}
                    </span>
                    <span>{lesson.exerciseCount} ejercicios</span>
                    <span className="flex items-center gap-1">
                        +{lesson.xpReward} XP
                    </span>
                    <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        {lesson.starsReward}
                    </span>
                </div>

                {/* Score if completed */}
                {lesson.score !== undefined && (
                    <div className="mt-2">
                        <div className="flex items-center gap-2">
                            <div className="flex-grow h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${lesson.score >= 90 ? 'bg-purple-500' : lesson.score >= 70 ? 'bg-blue-500' : 'bg-orange-500'}`}
                                    style={{ width: `${lesson.score}%` }}
                                />
                            </div>
                            <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                                {lesson.score}%
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Status badge */}
            <div className="flex-shrink-0">
                {renderStatusBadge()}
            </div>

            {/* Arrow for available lessons */}
            {canStart && (
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
            )}
        </motion.div>
    );
}

// Unit progress header
export function UnitProgressHeader({
    title,
    progress,
    lessonsCompleted,
    totalLessons,
}: {
    title: string;
    progress: number;
    lessonsCompleted: number;
    totalLessons: number;
}) {
    return (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-6 mb-6">
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
            <div className="flex items-center gap-4">
                <div className="flex-grow">
                    <div className="h-3 bg-white/30 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-white"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        />
                    </div>
                </div>
                <div className="text-white/80 text-sm font-medium whitespace-nowrap">
                    {lessonsCompleted}/{totalLessons} completadas
                </div>
            </div>
        </div>
    );
}
