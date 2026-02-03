'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Lock, Check, ShoppingBag, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useGamificationStore } from '@/lib/gamification/store';
import {
    AvatarPart,
    AvatarCategory,
    DEFAULT_AVATAR_PARTS,
    getItemsByCategory,
    canAfford
} from '@/lib/gamification/avatarSystem';

export default function AvatarBuilder() {
    const t = useTranslations('Store');
    const stars = useGamificationStore((s) => s.stars);
    const [avatarParts, setAvatarParts] = useState<AvatarPart[]>(DEFAULT_AVATAR_PARTS);
    const [activeCategory, setActiveCategory] = useState<AvatarCategory>('head');
    const [showPurchaseSuccess, setShowPurchaseSuccess] = useState(false);
    const [purchasedItem, setPurchasedItem] = useState<AvatarPart | null>(null);

    const categories: AvatarCategory[] = ['head', 'face', 'body', 'accessory', 'background'];
    const categoryItems = getItemsByCategory(avatarParts, activeCategory);
    const addStars = useGamificationStore((s) => s.addStars);

    const equippedItems = categories.map(cat =>
        avatarParts.find(p => p.category === cat && p.equipped)
    );

    const handlePurchase = (item: AvatarPart) => {
        if (!canAfford(stars, item)) return;

        addStars(-item.cost);

        setAvatarParts(prev => prev.map(p => {
            if (p.id === item.id) {
                return { ...p, unlocked: true, equipped: true };
            }
            if (p.category === item.category && p.equipped) {
                return { ...p, equipped: false };
            }
            return p;
        }));

        setPurchasedItem(item);
        setShowPurchaseSuccess(true);
        setTimeout(() => setShowPurchaseSuccess(false), 2000);
    };

    const handleEquip = (item: AvatarPart) => {
        if (!item.unlocked) return;

        setAvatarParts(prev => prev.map(p => {
            if (p.id === item.id) {
                return { ...p, equipped: true };
            }
            if (p.category === item.category && p.id !== item.id) {
                return { ...p, equipped: false };
            }
            return p;
        }));
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="w-8 h-8" />
                        <div>
                            <h2 className="text-2xl font-bold">{t('title')}</h2>
                            <p className="text-white/80">{t('subtitle')}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                        <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                        <span className="font-bold text-xl">{stars}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row">
                {/* Avatar Preview */}
                <div className="md:w-1/3 p-6 bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center justify-center">
                    <div className="relative w-40 h-40 mb-4">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-6xl">
                            {equippedItems[4]?.emoji || '🔵'}
                        </div>

                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-6xl relative">
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-4xl">
                                    {equippedItems[0]?.emoji}
                                </span>
                                <span>{equippedItems[1]?.emoji || '😊'}</span>
                                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-3xl">
                                    {equippedItems[2]?.emoji}
                                </span>
                                <span className="absolute -right-6 top-1/2 -translate-y-1/2 text-3xl">
                                    {equippedItems[3]?.emoji}
                                </span>
                            </div>
                        </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-center">
                        {t('avatarMessage')}
                    </p>
                </div>

                {/* Category tabs and items */}
                <div className="md:w-2/3 p-6">
                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${activeCategory === cat
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <span>{t(`categories.${cat}`)}</span>
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {categoryItems.map((item) => {
                            const isEquipped = item.equipped;
                            const isUnlocked = item.unlocked;
                            const affordable = canAfford(stars, item);

                            return (
                                <motion.button
                                    key={item.id}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => isUnlocked ? handleEquip(item) : handlePurchase(item)}
                                    disabled={!isUnlocked && !affordable}
                                    className={`relative aspect-square rounded-xl flex flex-col items-center justify-center p-2 transition-all ${isEquipped
                                            ? 'bg-purple-100 dark:bg-purple-900/40 ring-2 ring-purple-500'
                                            : isUnlocked
                                                ? 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                : affordable
                                                    ? 'bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/40'
                                                    : 'bg-gray-100 dark:bg-gray-800 opacity-50 cursor-not-allowed'
                                        }`}
                                >
                                    <span className="text-3xl mb-1">{item.emoji}</span>
                                    <span className="text-xs text-gray-600 dark:text-gray-400 text-center line-clamp-1">
                                        {item.nameEs}
                                    </span>

                                    {isEquipped && (
                                        <div className="absolute top-1 right-1 bg-purple-500 rounded-full p-1">
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                    )}

                                    {!isUnlocked && (
                                        <div className="absolute top-1 right-1 flex items-center gap-1 bg-gray-200 dark:bg-gray-700 rounded-full px-1.5 py-0.5">
                                            {affordable ? (
                                                <>
                                                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                                    <span className="text-xs font-medium">{item.cost}</span>
                                                </>
                                            ) : (
                                                <Lock className="w-3 h-3 text-gray-400" />
                                            )}
                                        </div>
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showPurchaseSuccess && purchasedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center"
                        >
                            <div className="text-6xl mb-4">{purchasedItem.emoji}</div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                {t('unlocked')}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {purchasedItem.nameEs}
                            </p>
                            <Sparkles className="w-6 h-6 text-yellow-500 mx-auto mt-4 animate-bounce" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
