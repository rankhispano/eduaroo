'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Star, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ExerciseFeedbackProps {
    isCorrect: boolean | null;
    show: boolean;
    onComplete?: () => void;
    message?: string;
    solution?: React.ReactNode;
}

// Confetti particle component
function ConfettiParticle({ delay, color }: { delay: number; color: string }) {
    return (
        <motion.div
            className="absolute w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
            initial={{
                opacity: 1,
                scale: 0,
                x: 0,
                y: 0,
            }}
            animate={{
                opacity: [1, 1, 0],
                scale: [0, 1, 0.5],
                x: (Math.random() - 0.5) * 200,
                y: (Math.random() - 0.5) * 200,
                rotate: Math.random() * 360,
            }}
            transition={{
                duration: 0.8,
                delay,
                ease: "easeOut"
            }}
        />
    );
}

// Stars burst for correct answers
function StarsBurst() {
    const colors = ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#45B7D1'];

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible">
            {Array.from({ length: 12 }).map((_, i) => (
                <ConfettiParticle
                    key={i}
                    delay={i * 0.05}
                    color={colors[i % colors.length]}
                />
            ))}
        </div>
    );
}

export default function ExerciseFeedback({
    isCorrect,
    show,
    onComplete,
    message,
    solution
}: ExerciseFeedbackProps) {
    const [showParticles, setShowParticles] = useState(false);

    useEffect(() => {
        if (show && isCorrect) {
            setShowParticles(true);
            const timer = setTimeout(() => setShowParticles(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [show, isCorrect]);

    useEffect(() => {
        if (show && onComplete) {
            const timer = setTimeout(onComplete, 1500);
            return () => clearTimeout(timer);
        }
    }, [show, onComplete]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Overlay */}
                    <motion.div
                        className={`absolute inset-0 ${isCorrect
                            ? 'bg-green-500/10'
                            : 'bg-red-500/10'
                            }`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* Icon and message */}
                    <motion.div
                        className="relative flex flex-col items-center gap-4"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        {showParticles && <StarsBurst />}

                        {isCorrect ? (
                            <>
                                <motion.div
                                    className="relative"
                                    animate={{
                                        scale: [1, 1.2, 1],
                                    }}
                                    transition={{ duration: 0.5, repeat: 1 }}
                                >
                                    <CheckCircle className="w-24 h-24 text-green-500 drop-shadow-lg" />
                                    <motion.div
                                        className="absolute -top-2 -right-2"
                                        initial={{ scale: 0, rotate: -45 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                                    </motion.div>
                                </motion.div>
                                <motion.p
                                    className="text-2xl font-bold text-green-600 dark:text-green-400"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    {message || '¡Correcto! 🎉'}
                                </motion.p>
                            </>
                        ) : (
                            <>
                                <motion.div
                                    animate={{
                                        x: [0, -10, 10, -10, 10, 0],
                                    }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <XCircle className="w-24 h-24 text-red-500 drop-shadow-lg" />
                                </motion.div>
                                <motion.p
                                    className="text-2xl font-bold text-red-600 dark:text-red-400"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    {message || '¡Inténtalo de nuevo!'}
                                </motion.p>
                                {solution && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="mt-2 text-center"
                                    >
                                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Solución correcta:</p>
                                        <div className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-1">
                                            {solution}
                                        </div>
                                    </motion.div>
                                )}
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Inline feedback for individual exercises (smaller version)
export function InlineFeedback({
    isCorrect,
    show
}: {
    isCorrect: boolean | null;
    show: boolean;
}) {
    return (
        <AnimatePresence>
            {show && isCorrect !== null && (
                <motion.div
                    className="absolute -right-2 -top-2"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                >
                    {isCorrect ? (
                        <div className="bg-green-500 rounded-full p-1">
                            <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                    ) : (
                        <div className="bg-red-500 rounded-full p-1">
                            <XCircle className="w-5 h-5 text-white" />
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// XP gain animation
export function XPGainAnimation({
    amount,
    show
}: {
    amount: number;
    show: boolean;
}) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="fixed top-20 right-8 flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full shadow-lg z-50"
                    initial={{ opacity: 0, y: 50, scale: 0.5 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <Sparkles className="w-5 h-5" />
                    <span className="font-bold text-lg">+{amount} XP</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
