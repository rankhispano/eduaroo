'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, X, Trophy } from 'lucide-react';
import {
    ReviewItem,
    initializeFractionReviewItems,
    getDailyReviewItems,
    onCorrectAnswer,
    onIncorrectAnswer
} from '@/lib/learning/spacedRepetition';
import { useGamificationStore } from '@/lib/gamification/store';
import { useTranslations } from 'next-intl';

export default function DailyReview() {
    const t = useTranslations('DailyReview');
    const tGlobal = useTranslations();
    const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
    const [dailySession, setDailySession] = useState<ReviewItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Gamification hooks
    const addXP = useGamificationStore(s => s.addXP);
    const addStars = useGamificationStore(s => s.addStars);

    // Load items on mount
    useEffect(() => {
        const saved = localStorage.getItem('eduaroo_review_items');
        if (saved) {
            setReviewItems(JSON.parse(saved));
        } else {
            // Initialize with sample data if empty
            const initial = initializeFractionReviewItems();
            setReviewItems(initial);
            localStorage.setItem('eduaroo_review_items', JSON.stringify(initial));
        }
    }, []);

    // Start session
    const startSession = () => {
        const due = getDailyReviewItems(reviewItems, 5);
        if (due.length > 0) {
            setDailySession(due);
            setCurrentIndex(0);
            setCompleted(false);
            setIsOpen(true);
        }
    };

    const handleAnswer = (answer: string) => {
        const currentItem = dailySession[currentIndex];
        const correct = answer === currentItem.correctAnswer; // In real app, this would be more flexible

        setIsCorrect(correct);
        setShowResult(true);

        setTimeout(() => {
            // Update item logic
            const updatedItems = reviewItems.map(item => {
                if (item.id === currentItem.id) {
                    return correct ? onCorrectAnswer(item) : onIncorrectAnswer(item);
                }
                return item;
            });

            setReviewItems(updatedItems);
            localStorage.setItem('eduaroo_review_items', JSON.stringify(updatedItems));

            if (currentIndex < dailySession.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setShowResult(false);
            } else {
                setCompleted(true);
                // Rewards for completing review
                addXP(50);
                addStars(2);
            }
        }, 1500);
    };

    // For this demo, we'll use multiple choice options generated from other answers
    const getOptions = () => {
        if (dailySession.length === 0) return [];
        const current = dailySession[currentIndex];
        const otherAnswers = reviewItems
            .filter(i => i.id !== current.id)
            .map(i => i.correctAnswer)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

        return [current.correctAnswer, ...otherAnswers].sort(() => Math.random() - 0.5);
    };

    if (!isOpen) {
        // Widget view
        const dueCount = getDailyReviewItems(reviewItems, 5).length;
        if (dueCount === 0) return null;

        return (
            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startSession}
                className="bg-gradient-to-r from-violet-500 to-fuchsia-600 rounded-2xl p-6 text-white cursor-pointer shadow-lg relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Brain size={100} />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-6 h-6" />
                        <h3 className="font-bold text-lg">{t('widgetTitle')}</h3>
                    </div>
                    <p className="text-white/90 text-sm mb-4">
                        {t('subtitle', { count: dueCount })}
                    </p>
                    <button className="bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg text-sm font-bold w-full">
                        {t('start')}
                    </button>
                </div>
            </motion.div>
        );
    }

    // Modal view
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="bg-violet-600 p-4 flex justify-between items-center text-white">
                    <div className="flex items-center gap-2">
                        <Brain className="w-5 h-5" />
                        <span className="font-bold">{t('modalTitle')}</span>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 min-h-[400px] flex flex-col items-center justify-center">
                    {completed ? (
                        <div className="text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6"
                            >
                                <Trophy className="w-12 h-12 text-yellow-500" />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                {t('completedTitle')}
                            </h2>
                            <p className="text-gray-500 mb-6">
                                {t('completedDesc')}
                            </p>
                            <div className="flex gap-4 justify-center">
                                <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-bold">
                                    +50 XP
                                </div>
                                <div className="bg-yellow-50 text-yellow-600 px-4 py-2 rounded-xl font-bold">
                                    +2 ⭐
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="mt-8 bg-violet-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-violet-700 transition-colors"
                            >
                                {t('awesome')}
                            </button>
                        </div>
                    ) : (
                        <div className="w-full">
                            {/* Progress info */}
                            <div className="flex justify-between text-sm text-gray-400 mb-8">
                                <span>{t('questionProgress', { current: currentIndex + 1, total: dailySession.length })}</span>
                                <span>{t('streak', { streak: dailySession[currentIndex].streak })}</span>
                            </div>

                            {/* Question */}
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-8">
                                {dailySession[currentIndex].questionKey
                                    ? tGlobal(dailySession[currentIndex].questionKey)
                                    : dailySession[currentIndex].question}
                            </h3>

                            {/* Options */}
                            <div className="grid grid-cols-1 gap-3">
                                {getOptions().map((opt, idx) => (
                                    <button
                                        key={idx}
                                        disabled={showResult}
                                        onClick={() => handleAnswer(opt)}
                                        className={`
                                            p-4 rounded-xl border-2 font-bold text-lg transition-all
                                            ${showResult && opt === dailySession[currentIndex].correctAnswer
                                                ? 'bg-green-100 border-green-500 text-green-700'
                                                : showResult && opt !== dailySession[currentIndex].correctAnswer && !isCorrect
                                                    ? 'opacity-50'
                                                    : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-violet-500 hover:text-violet-600'
                                            }
                                        `}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>

                            {/* Feedback Overlay */}
                            <AnimatePresence>
                                {showResult && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className={`mt-6 text-center font-bold text-xl ${isCorrect ? 'text-green-500' : 'text-red-500'}`}
                                    >
                                        {isCorrect ? t('correct') : t('incorrect')}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
