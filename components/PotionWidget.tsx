'use client';

import { useGamificationStore } from '@/lib/gamification/store';
import { FlaskConical } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PotionWidget() {
    const retryPotions = useGamificationStore(s => s.retryPotions);
    const maxRetryPotions = useGamificationStore(s => s.maxRetryPotions);

    return (
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="relative">
                <FlaskConical className={`w-5 h-5 ${retryPotions > 0 ? 'text-pink-500' : 'text-gray-300'}`} />
                {retryPotions > 0 && (
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -top-1 -right-1 w-2 h-2 bg-pink-400 rounded-full"
                    />
                )}
            </div>
            <span className={`font-bold text-sm ${retryPotions > 0 ? 'text-pink-600 dark:text-pink-400' : 'text-gray-400'}`}>
                {retryPotions}/{maxRetryPotions}
            </span>
        </div>
    );
}
