'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Play, RotateCcw, ChevronRight, ChevronLeft, Check, Trophy, Volume2, VolumeX, Menu, X, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';

// --- DATA & CONFIGURATION ---

const LEVELS = [
    {
        id: 1,
        color: "bg-red-500",
        target: [
            "00000000",
            "01100110",
            "11111111",
            "11111111",
            "11111111",
            "01111110",
            "00111100",
            "00011000"
        ]
    },
    {
        id: 2,
        color: "bg-purple-500",
        target: [
            "00111100",
            "01111110",
            "11111111",
            "11011101",
            "11111111",
            "11111111",
            "10100101",
            "00000000"
        ]
    },
    {
        id: 3,
        color: "bg-blue-500",
        target: [
            "00000001",
            "00000010",
            "00000100",
            "00001000",
            "00011000",
            "00101100",
            "01000110",
            "11000011"
        ]
    },
    {
        id: 4,
        color: "bg-yellow-400",
        target: [
            "00111100",
            "01000010",
            "10100101",
            "10000001",
            "10100101",
            "10011001",
            "01000010",
            "00111100"
        ]
    },
    {
        id: 5,
        color: "bg-orange-500",
        target: [
            "00000000",
            "00000000",
            "01111110",
            "01000011",
            "01000010",
            "01111100",
            "00111000",
            "00000000"
        ]
    },
    {
        id: 6,
        color: "bg-green-600",
        target: [
            "00000000",
            "00000000",
            "00100100",
            "00100100",
            "00011000",
            "00111100",
            "00100100",
            "00000000"
        ]
    },
    {
        id: 7,
        color: "bg-sky-500",
        target: [
            "00000000",
            "00100000",
            "00100100",
            "00100100",
            "11111110",
            "01111100",
            "00111000",
            "00000000"
        ]
    },
    {
        id: 8,
        color: "bg-emerald-600",
        target: [
            "00001000",
            "00011100",
            "00111110",
            "01111111",
            "00001000",
            "00001000",
            "00001000",
            "01111111"
        ]
    },
    {
        id: 9,
        color: "bg-yellow-500",
        target: [
            "00000000",
            "00111000",
            "01110000",
            "00111110",
            "00111110",
            "00011100",
            "00000000",
            "00000000"
        ]
    },
    {
        id: 10,
        color: "bg-indigo-500",
        target: [
            "00001000",
            "00011000",
            "00111100",
            "01111110",
            "11000011",
            "10100101",
            "10111101",
            "11111111"
        ]
    },
    {
        id: 11,
        color: "bg-pink-500",
        target: [
            "00000100",
            "00000100",
            "00000100",
            "00000100",
            "00000110",
            "00111110",
            "00111100",
            "00000000"
        ]
    },
    {
        id: 12,
        color: "bg-lime-500",
        target: [
            "00111100",
            "01111110",
            "11011011",
            "11111111",
            "00100100",
            "01011010",
            "10000001",
            "00000000"
        ]
    },
    {
        id: 13,
        color: "bg-teal-500",
        target: [
            "00000000",
            "00000000",
            "01110111",
            "10001000",
            "10111011",
            "01110111",
            "00000000",
            "00000000"
        ]
    },
    {
        id: 14,
        color: "bg-amber-500",
        target: [
            "00011000",
            "00100100",
            "00100100",
            "00011000",
            "00001000",
            "00001000",
            "00011000",
            "00010100"
        ]
    },
    {
        id: 15,
        color: "bg-cyan-400",
        target: [
            "00001000",
            "00011100",
            "00111110",
            "01111111",
            "00111110",
            "00011100",
            "00001000",
            "00000000"
        ]
    },
    {
        id: 16,
        color: "bg-red-600",
        target: [
            "00001000",
            "00001100",
            "00001110",
            "11111111",
            "11111111",
            "00001110",
            "00001100",
            "00001000"
        ]
    },
    {
        id: 17,
        color: "bg-violet-500",
        target: [
            "00000000",
            "00111100",
            "01111110",
            "11111111",
            "00001000",
            "00001000",
            "01001000",
            "01110000"
        ]
    },
    {
        id: 18,
        color: "bg-fuchsia-500",
        target: [
            "00001000",
            "00111110",
            "00001000",
            "01111111",
            "01011010",
            "01011010",
            "01111111",
            "00000000"
        ]
    },
    {
        id: 19,
        color: "bg-yellow-400",
        target: [
            "00000000",
            "10000001",
            "11000011",
            "10100101",
            "10111101",
            "11111111",
            "01111110",
            "00000000"
        ]
    },
    {
        id: 20,
        color: "bg-slate-400",
        target: [
            "00111100",
            "01000010",
            "10011001",
            "10000001",
            "10011001",
            "10100101",
            "11000011",
            "00111100"
        ]
    },
    {
        id: 21,
        color: "bg-pink-400",
        target: [
            "00000000",
            "01100110",
            "11111111",
            "11111111",
            "01111110",
            "00011000",
            "00111100",
            "00011000"
        ]
    }
];

// --- COMPONENTS ---

export default function BitBloxPage() {
    const t = useTranslations('GamesPage.bitBloxMessages');
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [grid, setGrid] = useState<number[][]>(Array(8).fill(Array(8).fill(0)));
    const [isWon, setIsWon] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [showMenu, setShowMenu] = useState(false);

    const currentLevel = LEVELS[currentLevelIndex];

    // Initialize grid on level change
    useEffect(() => {
        resetLevel();
    }, [currentLevelIndex]);

    const playSound = (type: string) => {
        if (!soundEnabled) return;
        // Sound simulation would go here
    };

    const resetLevel = () => {
        setGrid(Array(8).fill(Array(8).fill(0)));
        setIsWon(false);
    };

    const toggleCell = (rowIndex: number, colIndex: number) => {
        if (isWon) return;

        const newGrid = grid.map((row, r) =>
            row.map((cell, c) => {
                if (r === rowIndex && c === colIndex) {
                    return cell === 0 ? 1 : 0;
                }
                return cell;
            })
        );

        setGrid(newGrid);
        playSound('click');
        checkWinCondition(newGrid);
    };

    const checkWinCondition = (currentGrid: number[][]) => {
        const currentBinaryStrings = currentGrid.map(row => row.join(''));
        const isComplete = currentBinaryStrings.every((str, idx) => str === currentLevel.target[idx]);

        if (isComplete) {
            setIsWon(true);
            playSound('win');
        }
    };

    const nextLevel = () => {
        if (currentLevelIndex < LEVELS.length - 1) {
            setCurrentLevelIndex(prev => prev + 1);
        }
    };

    const prevLevel = () => {
        if (currentLevelIndex > 0) {
            setCurrentLevelIndex(prev => prev - 1);
        }
    };

    const isRowCorrect = (rowIndex: number) => {
        const rowString = grid[rowIndex].join('');
        return rowString === currentLevel.target[rowIndex];
    };

    // Helper to get localized level name
    const getLevelName = (id: number) => {
        return t(`levelNames.l${id}`);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-purple-500 selection:text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">

            {/* Header / Nav */}
            <nav className="w-full max-w-4xl flex justify-between items-center mb-6 z-10">
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="bg-green-600 hover:bg-green-500 p-3 rounded-xl shadow-[0_4px_0_rgb(21,128,61)] active:shadow-none active:translate-y-1 transition-all"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className={`p-3 rounded-xl shadow-[0_4px_0_rgba(0,0,0,0.3)] active:shadow-none active:translate-y-1 transition-all ${soundEnabled ? 'bg-blue-600 hover:bg-blue-500 shadow-[0_4px_0_rgb(37,99,235)]' : 'bg-slate-700'}`}
                    >
                        {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                    </button>
                </div>

                <div className="bg-slate-800 px-6 py-2 rounded-2xl border-2 border-slate-700 shadow-lg flex items-center gap-2">
                    <div className="bg-gradient-to-tr from-green-400 to-blue-500 w-8 h-8 rounded-lg flex items-center justify-center font-black text-slate-900 text-lg">B</div>
                    <h1 className="text-xl md:text-2xl font-bold tracking-wider text-white">BIT<span className="text-green-400">BLOX</span></h1>
                </div>

                <div className="text-right">
                    <div className="text-xs text-slate-400 uppercase font-bold">{t('level')}</div>
                    <div className="text-2xl font-bold text-yellow-400">{currentLevelIndex + 1} / {LEVELS.length}</div>
                </div>
            </nav>

            {/* Main Game Area */}
            <main className="flex flex-col md:flex-row gap-8 items-center justify-center w-full max-w-5xl z-10">

                {/* Left Control - Level Indicator */}
                <div className="hidden md:flex flex-col items-center gap-4">
                    <button
                        onClick={prevLevel}
                        disabled={currentLevelIndex === 0}
                        className="p-4 rounded-full bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft size={32} />
                    </button>
                    <div className="text-[8rem] font-black text-slate-700 leading-none select-none drop-shadow-2xl font-mono opacity-50">
                        {currentLevel.id}
                    </div>
                    <div className="text-slate-500 font-bold text-center w-28 leading-tight">{getLevelName(currentLevel.id)}</div>
                </div>

                {/* The Grid */}
                <div className="bg-slate-800 p-3 rounded-xl shadow-2xl border-4 border-slate-700 relative">
                    <div className="grid grid-cols-8 gap-1 md:gap-2">
                        {grid.map((row, rowIndex) => (
                            row.map((cell, colIndex) => (
                                <button
                                    key={`${rowIndex}-${colIndex}`}
                                    onClick={() => toggleCell(rowIndex, colIndex)}
                                    className={`
                    w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 
                    rounded-md transition-all duration-200 
                    border-2 
                    flex items-center justify-center
                    ${cell === 1
                                            ? `${currentLevel.color} border-transparent shadow-[inset_0_-4px_rgba(0,0,0,0.2)]`
                                            : 'bg-slate-100 hover:bg-white border-slate-300'
                                        }
                  `}
                                    aria-label={`Fila ${rowIndex}, Columna ${colIndex}, valor actual ${cell}`}
                                >
                                </button>
                            ))
                        ))}
                    </div>
                    {/* Row Indicators for Success */}
                    <div className="absolute -right-6 top-3 bottom-3 flex flex-col justify-between py-1">
                        {grid.map((_, idx) => (
                            <div key={idx} className="h-8 sm:h-10 md:h-12 lg:h-14 flex items-center">
                                {isRowCorrect(idx) && <Check size={20} className="text-green-500 animate-in zoom-in" />}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Binary Codes (The "Instructions") */}
                <div className="flex flex-col gap-1 md:gap-2 font-mono text-lg md:text-xl font-bold tracking-widest bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm">
                    <div className="text-center text-xs text-slate-400 mb-2 uppercase tracking-normal font-sans">{t('binaryCode')}</div>
                    {currentLevel.target.map((code, index) => {
                        const isDone = isRowCorrect(index);
                        return (
                            <div
                                key={index}
                                className={`
                  flex items-center justify-between gap-4 px-4 py-1.5 rounded-lg transition-colors duration-300
                  ${isDone ? 'bg-green-500/20 text-green-400' : 'text-slate-400'}
                  h-8 sm:h-10 md:h-12 lg:h-14
                `}
                            >
                                <span>{code}</span>
                                {isDone && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-spin-once" />}
                            </div>
                        );
                    })}
                </div>

                {/* Mobile Nav Controls (Visible only on small screens) */}
                <div className="flex md:hidden justify-between w-full max-w-xs mt-4">
                    <button onClick={prevLevel} disabled={currentLevelIndex === 0} className="p-3 bg-slate-700 rounded-lg disabled:opacity-50"><ChevronLeft /></button>
                    <span className="font-bold text-xl self-center">{getLevelName(currentLevel.id)}</span>
                    <button onClick={nextLevel} disabled={currentLevelIndex === LEVELS.length - 1} className="p-3 bg-slate-700 rounded-lg disabled:opacity-50"><ChevronRight /></button>
                </div>

            </main>

            {/* Footer Controls */}
            <div className="mt-8 flex gap-4">
                <button
                    onClick={resetLevel}
                    className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-400 rounded-xl font-bold shadow-[0_4px_0_rgb(185,28,28)] active:shadow-none active:translate-y-1 transition-all text-white"
                >
                    <RotateCcw className="w-5 h-5" />
                    {t('restart')}
                </button>
            </div>

            {/* Victory Modal Overlay */}
            {isWon && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-slate-800 p-8 rounded-3xl border-4 border-yellow-400 text-center max-w-sm w-full shadow-2xl transform animate-bounce-in">
                        <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-900 shadow-lg">
                            <Trophy size={40} strokeWidth={3} />
                        </div>
                        <h2 className="text-3xl font-black text-white mb-2">{t('great')}</h2>
                        <p className="text-slate-300 mb-6">{t('drawingCompleted')}</p>

                        <div className="flex flex-col gap-3">
                            {currentLevelIndex < LEVELS.length - 1 ? (
                                <button
                                    onClick={() => {
                                        nextLevel();
                                        setIsWon(false);
                                    }}
                                    className="w-full py-4 bg-green-500 hover:bg-green-400 text-white rounded-xl font-bold text-lg shadow-[0_4px_0_rgb(21,128,61)] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2"
                                >
                                    {t('nextLevel')} <ChevronRight size={24} strokeWidth={3} />
                                </button>
                            ) : (
                                <div className="p-4 bg-slate-700 rounded-xl text-yellow-300 font-bold">
                                    {t('gameCompleted')}
                                </div>
                            )}

                            <button
                                onClick={() => setIsWon(false)}
                                className="text-slate-400 hover:text-white font-semibold py-2"
                            >
                                {t('viewDrawing')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Menu Modal */}
            {showMenu && (
                <div className="absolute inset-0 z-50 bg-slate-900/95 flex flex-col p-8 overflow-y-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-green-400">{t('levelsTitle')}</h2>
                        <button onClick={() => setShowMenu(false)} className="p-2 bg-slate-800 rounded-full"><X /></button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto w-full">
                        {LEVELS.map((level, idx) => (
                            <button
                                key={level.id}
                                onClick={() => {
                                    setCurrentLevelIndex(idx);
                                    setShowMenu(false);
                                }}
                                className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all
                  ${currentLevelIndex === idx ? 'border-green-400 bg-slate-800' : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800'}
                `}
                            >
                                <div className={`w-8 h-8 rounded-md flex items-center justify-center font-bold text-white ${level.color}`}>
                                    {level.id}
                                </div>
                                <div className="text-left flex-1">
                                    <div className="font-bold text-sm text-white">{getLevelName(level.id)}</div>
                                </div>
                                {idx < currentLevelIndex && <Check className="text-green-500 w-5 h-5" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Styles for animation */}
            <style>{`
        @keyframes bounce-in {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); }
        }
        @keyframes spin-once {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .animate-spin-once {
          animation: spin-once 0.6s ease-out forwards;
        }
      `}</style>
        </div>
    );
}
