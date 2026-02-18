'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Rocket, Stars, Brain, Binary, Calculator, Gamepad2, SquareAsterisk } from 'lucide-react';
import { useState } from 'react';

type Category = 'all' | 'math' | 'logic' | 'language' | 'arcade';

export default function GamesList() {
    const t = useTranslations('GamesPage');
    const [selectedCategory, setSelectedCategory] = useState<Category>('all');

    const GAMES = [
        {
            id: 'galaxy-math-fuel',
            category: 'math',
            icon: <Rocket className="w-20 h-20" />,
            titleKey: 'galaxyMathFuelTitle',
            tagKey: 'galaxyMathFuelTag',
            descKey: 'galaxyMathFuelDesc',
            color: 'blue',
            gradient: 'from-blue-500/40'
        },
        {
            id: 'calculate-target',
            category: 'math',
            icon: <div>123</div>,
            titleKey: 'calculateTargetTitle',
            tagKey: 'calculateTargetTag',
            descKey: 'calculateTargetDesc',
            color: 'amber',
            gradient: 'from-amber-500/40'
        },
        {
            id: 'cyber-segments',
            category: 'logic',
            icon: <div>8.</div>,
            titleKey: 'cyberSegmentsTitle',
            tagKey: 'cyberSegmentsTag',
            descKey: 'cyberSegmentsDesc',
            color: 'emerald',
            gradient: 'from-emerald-500/40'
        },
        {
            id: 'bitblox',
            category: 'logic',
            icon: <div>10</div>,
            titleKey: 'bitBloxTitle',
            tagKey: 'bitBloxTag',
            descKey: 'bitBloxDesc',
            color: 'indigo',
            gradient: 'from-blue-600/40'
        },
        {
            id: 'astro-type',
            category: 'language',
            icon: <div>🚀</div>,
            titleKey: 'astroTypeTitle',
            tagKey: 'astroTypeTag',
            descKey: 'astroTypeDesc',
            color: 'cyan',
            gradient: 'from-cyan-500/40'
        },
        {
            id: 'syllable-quest',
            category: 'language',
            icon: <div>Abc</div>,
            titleKey: 'syllableQuestTitle',
            tagKey: 'syllableQuestTag',
            descKey: 'syllableQuestDesc',
            color: 'orange',
            gradient: 'from-orange-500/40'
        },
        {
            id: 'geominds',
            category: 'logic',
            icon: <div>🧩</div>,
            titleKey: 'geoMindsTitle',
            tagKey: 'geoMindsTag',
            descKey: 'geoMindsDesc',
            color: 'teal',
            gradient: 'from-teal-500/40'
        },
        {
            id: 'tictac',
            category: 'math',
            icon: <div>⏰</div>,
            titleKey: 'tictacTitle',
            tagKey: 'tictacTag',
            descKey: 'tictacDesc',
            color: 'blue',
            gradient: 'from-blue-500/40'
        },
        {
            id: 'wordsearch',
            category: 'language',
            icon: <div>🔎</div>,
            titleKey: 'wordSearchTitle',
            tagKey: 'wordSearchTag',
            descKey: 'wordSearchDesc',
            color: 'indigo',
            gradient: 'from-indigo-500/40'
        },
    ];

    const filteredGames = selectedCategory === 'all'
        ? GAMES
        : GAMES.filter(g => g.category === selectedCategory);

    const categories: { id: Category; icon: React.ReactNode }[] = [
        { id: 'all', icon: <Stars size={18} /> },
        { id: 'math', icon: <Calculator size={18} /> },
        { id: 'logic', icon: <Brain size={18} /> },
        { id: 'language', icon: <SquareAsterisk size={18} /> },
    ];

    return (
        <>
            {/* Filter Bar */}
            <div className="flex flex-wrap gap-3 mb-8 justify-center md:justify-start">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`
                            flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all duration-300
                            ${selectedCategory === cat.id
                                ? 'bg-gradient-to-r from-brand-blue to-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-brand-blue border border-gray-200 dark:border-slate-700'}
                        `}
                    >
                        {cat.icon}
                        {t(`categories.${cat.id}`)}
                    </button>
                ))}
            </div>

            {/* Games Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
                {filteredGames.map((game) => (
                    <Link
                        key={game.id}
                        href={game.id === 'geominds' ? '/games/geominds' : `/games/${game.id}`}
                        className="group relative flex flex-col overflow-hidden rounded-3xl bg-white dark:bg-slate-900 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-blue/10 border border-gray-100 dark:border-slate-800"
                    >
                        {/* Image Header */}
                        <div className={`relative h-48 w-full bg-gradient-to-br ${game.gradient} flex items-center justify-center overflow-hidden`}>
                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />

                            {/* Glowing effect behind image */}
                            <div className={`absolute w-32 h-32 bg-${game.color}-400/30 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700`} />

                            <img
                                src={`/games/${game.id}.png`}
                                alt={t(game.titleKey)}
                                className="relative w-40 h-40 object-contain drop-shadow-2xl transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                            />
                        </div>

                        {/* Content */}
                        <div className="flex flex-col flex-1 p-6 relative">
                            <div className="mb-4">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-${game.color}-100 dark:bg-${game.color}-900/30 text-${game.color}-600 dark:text-${game.color}-400 mb-2`}>
                                    {t(game.tagKey).split('•')[0].trim()}
                                </span>
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white leading-tight mb-2 group-hover:text-brand-blue transition-colors">
                                    {t(game.titleKey)}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3">
                                    {t(game.descKey)}
                                </p>
                            </div>

                            <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100 dark:border-slate-800">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Jugar ahora</span>
                                <div className={`w-10 h-10 rounded-full bg-${game.color}-100 dark:bg-${game.color}-900/30 flex items-center justify-center text-${game.color}-600 dark:text-${game.color}-400 group-hover:bg-${game.color}-600 group-hover:text-black transition-all duration-300`}>
                                    <Gamepad2 size={20} />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {filteredGames.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    <p className="text-xl">No hay juegos en esta categoría todavía.</p>
                </div>
            )}
        </>
    );
}
