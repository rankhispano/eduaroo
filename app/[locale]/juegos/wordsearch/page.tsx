'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, RefreshCw, ArrowLeft, Star, Grid, Utensils, Laptop, GraduationCap, Dog, Palette, Dumbbell, Rocket } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';

// --- CONFIGURACIÓN DE DATOS ---

interface CategoryConfig {
    id: string;
    color: string;
    highlight: string;
    icon: React.ReactElement<any>;
}

const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
    animals: {
        id: 'animals',
        color: 'text-orange-600',
        highlight: '#f97316', // Orange-500
        icon: <Dog className="w-6 h-6" />
    },
    food: {
        id: 'food',
        color: 'text-red-600',
        highlight: '#ef4444', // Red-500
        icon: <Utensils className="w-6 h-6" />
    },
    school: {
        id: 'school',
        color: 'text-yellow-600',
        highlight: '#eab308', // Yellow-500
        icon: <GraduationCap className="w-6 h-6" />
    },
    tech: {
        id: 'tech',
        color: 'text-blue-600',
        highlight: '#3b82f6', // Blue-500
        icon: <Laptop className="w-6 h-6" />
    },
    colors: {
        id: 'colors',
        color: 'text-pink-600',
        highlight: '#ec4899', // Pink-500
        icon: <Palette className="w-6 h-6" />
    },
    sports: {
        id: 'sports',
        color: 'text-emerald-600',
        highlight: '#10b981', // Emerald-500
        icon: <Dumbbell className="w-6 h-6" />
    }
};

const WORD_DB: Record<string, Record<string, string[]>> = {
    es: {
        animals: [
            'PERRO', 'GATO', 'LEON', 'TIGRE', 'ELEFANTE', 'JIRAFA', 'MONO', 'OSO',
            'ZEBRA', 'PANDA', 'KOALA', 'LOBO', 'ZORRO', 'CANGURO', 'DELFIN',
            'BALLENA', 'AGUILA', 'BUHO', 'PINGUINO', 'TORTUGA', 'CABALLO', 'VACA'
        ],
        food: [
            'PIZZA', 'PASTA', 'ARROZ', 'PAN', 'QUESO', 'HUEVO', 'POLLO', 'CARNE',
            'PESCADO', 'FRUTA', 'MANZANA', 'PERA', 'PLATANO', 'UVA', 'MELON',
            'SANDIA', 'LECHE', 'YOGUR', 'HELADO', 'GALLETA', 'TARTA', 'CHOCOLATE'
        ],
        school: [
            'LAPIZ', 'GOMA', 'LIBRO', 'PAPEL', 'TIJERAS', 'REGLA', 'MOCHILA',
            'MAPA', 'GLOBO', 'PIZARRON', 'TIZA', 'MESA', 'SILLA', 'AULA',
            'PATIO', 'RECREO', 'EXAMEN', 'NOTA', 'ESTUCHE', 'COLORES'
        ],
        tech: [
            'BITS', 'BYTES', 'CARGADOR', 'CAMARA', 'CODIGO', 'DATOS', 'LCD',
            'NUBE', 'PORTATIL', 'RATON', 'TECLADO', 'USB', 'WIFI', 'ROBOT',
            'PANTALLA', 'INTERNET', 'APP', 'GAMER', 'PIXEL', 'VIRUS'
        ],
        colors: [
            'ROJO', 'AZUL', 'VERDE', 'AMARILLO', 'NARANJA', 'ROSA', 'VIOLETA',
            'MORADO', 'NEGRO', 'BLANCO', 'GRIS', 'MARRON', 'DORADO', 'PLATEADO',
            'CELESTE', 'TURQUESA', 'MAGENTA', 'LILA', 'BEIGE', 'INDIGO'
        ],
        sports: [
            'FUTBOL', 'BALON', 'GOL', 'TENIS', 'RED', 'RAQUETA', 'NATACION',
            'PISCINA', 'CORRER', 'META', 'CARRERA', 'SALTO', 'EQUIPO', 'JUGADOR',
            'ARBITRO', 'SILBATO', 'COPA', 'MEDALLA', 'GIMNASIO', 'KARATE'
        ]
    },
    en: {
        animals: [
            'DOG', 'CAT', 'LION', 'TIGER', 'ELEPHANT', 'GIRAFFE', 'MONKEY', 'BEAR',
            'ZEBRA', 'PANDA', 'KOALA', 'WOLF', 'FOX', 'KANGAROO', 'DOLPHIN',
            'WHALE', 'EAGLE', 'OWL', 'PENGUIN', 'TURTLE', 'HORSE', 'COW'
        ],
        food: [
            'PIZZA', 'PASTA', 'RICE', 'BREAD', 'CHEESE', 'EGG', 'CHICKEN', 'MEAT',
            'FISH', 'FRUIT', 'APPLE', 'PEAR', 'BANANA', 'GRAPE', 'MELON',
            'WATERMELON', 'MILK', 'YOGURT', 'ICECREAM', 'COOKIE', 'CAKE', 'CHOCOLATE'
        ],
        school: [
            'PENCIL', 'ERASER', 'BOOK', 'PAPER', 'SCISSORS', 'RULER', 'BACKPACK',
            'MAP', 'GLOBE', 'BOARD', 'CHALK', 'DESK', 'CHAIR', 'CLASS',
            'PLAYGROUND', 'RECESS', 'EXAM', 'GRADE', 'PENCILCASE', 'COLORS'
        ],
        tech: [
            'BITS', 'BYTES', 'CHARGER', 'CAMERA', 'CODE', 'DATA', 'LCD',
            'CLOUD', 'LAPTOP', 'MOUSE', 'KEYBOARD', 'USB', 'WIFI', 'ROBOT',
            'SCREEN', 'INTERNET', 'APP', 'GAMER', 'PIXEL', 'VIRUS'
        ],
        colors: [
            'RED', 'BLUE', 'GREEN', 'YELLOW', 'ORANGE', 'PINK', 'VIOLET',
            'PURPLE', 'BLACK', 'WHITE', 'GRAY', 'BROWN', 'GOLD', 'SILVER',
            'CYAN', 'TURQUOISE', 'MAGENTA', 'LILAC', 'BEIGE', 'INDIGO'
        ],
        sports: [
            'SOCCER', 'BALL', 'GOAL', 'TENNIS', 'NET', 'RACKET', 'SWIMMING',
            'POOL', 'RUNNING', 'FINISH', 'RACE', 'JUMP', 'TEAM', 'PLAYER',
            'REFEREE', 'WHISTLE', 'CUP', 'MEDAL', 'GYM', 'KARATE'
        ]
    }
};

const GRID_SIZE = { rows: 10, cols: 12 };
const WORDS_TO_FIND = 10;

interface GridCell {
    char: string;
}

interface Coords {
    row: number;
    col: number;
}

interface Selection {
    start: Coords;
    end: Coords;
    cells: Coords[];
}

interface FoundSequence {
    start: Coords;
    end: Coords;
    color: string;
}

const SuperWordSearch = () => {
    const t = useTranslations('GamesPage.wordSearchMessages');
    const locale = useLocale();
    const [currentCategory, setCurrentCategory] = useState<string | null>(null);
    const [grid, setGrid] = useState<GridCell[][]>([]);
    const [targetWords, setTargetWords] = useState<string[]>([]);
    const [foundWords, setFoundWords] = useState<string[]>([]);
    const [foundSequences, setFoundSequences] = useState<FoundSequence[]>([]);
    const [selection, setSelection] = useState<Selection | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [score, setScore] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // --- LÓGICA DEL JUEGO ---

    const generateGrid = useCallback((words: string[]) => {
        const newGrid: GridCell[][] = Array(GRID_SIZE.rows).fill(null).map(() =>
            Array(GRID_SIZE.cols).fill(null).map(() => ({ char: '' }))
        );

        const placeWord = (word: string) => {
            const directions = [[0, 1], [1, 0], [1, 1], [-1, 1]];
            let placed = false;
            let attempts = 0;

            while (!placed && attempts < 100) {
                const dir = directions[Math.floor(Math.random() * directions.length)];
                const row = Math.floor(Math.random() * GRID_SIZE.rows);
                const col = Math.floor(Math.random() * GRID_SIZE.cols);

                if (canPlace(word, row, col, dir, newGrid)) {
                    for (let i = 0; i < word.length; i++) {
                        const r = row + i * dir[0];
                        const c = col + i * dir[1];
                        newGrid[r][c] = { char: word[i] };
                    }
                    placed = true;
                }
                attempts++;
            }
        };

        const canPlace = (word: string, row: number, col: number, dir: number[], grid: GridCell[][]) => {
            for (let i = 0; i < word.length; i++) {
                const r = row + i * dir[0];
                const c = col + i * dir[1];
                if (r < 0 || r >= GRID_SIZE.rows || c < 0 || c >= GRID_SIZE.cols) return false;
                const cell = grid[r][c];
                if (cell.char !== '' && cell.char !== word[i]) return false;
            }
            return true;
        };

        [...words].sort((a, b) => b.length - a.length).forEach(placeWord);

        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (let r = 0; r < GRID_SIZE.rows; r++) {
            for (let c = 0; c < GRID_SIZE.cols; c++) {
                if (newGrid[r][c].char === '') {
                    newGrid[r][c] = { char: alphabet[Math.floor(Math.random() * alphabet.length)] };
                }
            }
        }
        setGrid(newGrid);
    }, []);

    const startGame = (categoryId: string) => {
        if (!CATEGORY_CONFIG[categoryId]) return;

        setCurrentCategory(categoryId);
        const langData = WORD_DB[locale as keyof typeof WORD_DB] || WORD_DB.es;
        const categoryWords = [...(langData[categoryId] || [])];

        const selectedWords: string[] = [];
        while (selectedWords.length < WORDS_TO_FIND && categoryWords.length > 0) {
            const randomIndex = Math.floor(Math.random() * categoryWords.length);
            selectedWords.push(categoryWords[randomIndex]);
            categoryWords.splice(randomIndex, 1);
        }

        setTargetWords(selectedWords);
        generateGrid(selectedWords);
        setFoundWords([]);
        setFoundSequences([]);
        setSelection(null);
        setGameWon(false);
        setScore(0);
    };

    // --- INTERACCIÓN ---

    const getCellCoords = (e: React.MouseEvent | React.TouchEvent | any) => {
        if (!containerRef.current) return null;
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
        const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

        // Ahora que el ref está en el contenedor interno, rect.width es exactamente el ancho del grid
        const col = Math.floor((x / rect.width) * GRID_SIZE.cols);
        const row = Math.floor((y / rect.height) * GRID_SIZE.rows);

        const clampedRow = Math.max(0, Math.min(row, GRID_SIZE.rows - 1));
        const clampedCol = Math.max(0, Math.min(col, GRID_SIZE.cols - 1));

        return { row: clampedRow, col: clampedCol };
    };

    const handleStart = (e: any) => {
        if (gameWon) return;
        const coords = getCellCoords(e);
        if (coords) {
            setIsDragging(true);
            setSelection({ start: coords, end: coords, cells: [coords] });
        }
    };

    const handleMove = (e: any) => {
        if (!isDragging || !selection) return;
        const coords = getCellCoords(e);

        if (coords && (coords.row !== selection.end.row || coords.col !== selection.end.col)) {
            setSelection(prev => prev ? ({ ...prev, end: coords }) : null);
        }
    };

    const handleEnd = () => {
        if (!isDragging || !selection) return;
        setIsDragging(false);

        const { start, end } = selection;
        const dr = end.row - start.row;
        const dc = end.col - start.col;

        let finalEnd = { ...end };
        const absDr = Math.abs(dr);
        const absDc = Math.abs(dc);

        if (absDr > absDc * 2) {
            finalEnd.col = start.col;
        } else if (absDc > absDr * 2) {
            finalEnd.row = start.row;
        } else {
            const steps = Math.max(absDr, absDc);
            finalEnd.row = start.row + (Math.sign(dr) * steps);
            finalEnd.col = start.col + (Math.sign(dc) * steps);
        }

        if (finalEnd.row < 0 || finalEnd.row >= GRID_SIZE.rows || finalEnd.col < 0 || finalEnd.col >= GRID_SIZE.cols) {
            setSelection(null);
            return;
        }

        const steps = Math.max(Math.abs(finalEnd.row - start.row), Math.abs(finalEnd.col - start.col));
        const rowStep = steps === 0 ? 0 : (finalEnd.row - start.row) / steps;
        const colStep = steps === 0 ? 0 : (finalEnd.col - start.col) / steps;

        let selectedWord = '';
        for (let i = 0; i <= steps; i++) {
            const r = Math.round(start.row + i * rowStep);
            const c = Math.round(start.col + i * colStep);
            if (grid[r] && grid[r][c]) {
                selectedWord += grid[r][c].char;
            }
        }

        const reversedWord = selectedWord.split('').reverse().join('');
        const isValid = targetWords.includes(selectedWord) && !foundWords.includes(selectedWord);
        const isReverseValid = targetWords.includes(reversedWord) && !foundWords.includes(reversedWord);

        if (isValid || isReverseValid) {
            const wordFound = isValid ? selectedWord : reversedWord;

            if (currentCategory) {
                setFoundSequences(prev => [...prev, {
                    start,
                    end: finalEnd,
                    color: CATEGORY_CONFIG[currentCategory].highlight
                }]);
            }

            setFoundWords(prev => {
                const newFound = [...prev, wordFound];
                if (newFound.length === targetWords.length) setGameWon(true);
                return newFound;
            });
            setScore(s => s + 100);
        }

        setSelection(null);
    };

    const activeTheme = currentCategory ? CATEGORY_CONFIG[currentCategory] : null;

    return (
        <div className="min-h-screen bg-indigo-950 text-white font-sans selection:bg-none p-4 select-none">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&display=swap');
        body { font-family: 'Fredoka', sans-serif; }
      `}</style>

            <div className="max-w-6xl mx-auto">

                {/* --- MENU PRINCIPAL --- */}
                {!currentCategory && (
                    <div className="flex flex-col items-center justify-center min-h-[80vh] animate-fade-in relative">

                        {/* Back Button */}
                        <div className="absolute top-0 left-0">
                            <Link href="/games" className="flex items-center gap-2 text-indigo-300 hover:text-white transition-colors bg-indigo-900/50 px-4 py-2 rounded-xl">
                                <ArrowLeft size={20} /> {t('back')}
                            </Link>
                        </div>

                        <div className="text-center mb-12 mt-12 md:mt-0">
                            <div className="inline-block p-4 rounded-full bg-yellow-400 shadow-lg mb-4 animate-bounce">
                                <Rocket className="w-16 h-16 text-indigo-900" />
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 pb-2">
                                {t('title')}
                            </h1>
                            <p className="text-xl text-indigo-200 mt-4">{t('subtitle')}</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
                            {Object.values(CATEGORY_CONFIG).map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => startGame(cat.id)}
                                    className={`
                    bg-white group relative overflow-hidden p-6 rounded-3xl transition-all duration-300 
                    hover:scale-105 hover:shadow-2xl hover:shadow-white/20 border-b-8 border-black/10
                    flex flex-col items-center justify-center gap-4 h-48
                  `}
                                >
                                    <div className={`p-4 rounded-full ${cat.color} bg-opacity-10 mb-2`}>
                                        {React.cloneElement(cat.icon, { className: `w-10 h-10 ${cat.color}` })}
                                    </div>
                                    <span className={`text-2xl font-bold ${cat.color}`}>
                                        {t(`categories.${cat.id}`)}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- JUEGO ACTIVO --- */}
                {currentCategory && activeTheme && (
                    <div className="animate-fade-in">
                        {/* Header del Juego */}
                        <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-indigo-900/50 p-4 rounded-3xl border border-indigo-800">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setCurrentCategory(null)}
                                    className="bg-indigo-800 hover:bg-indigo-700 p-3 rounded-xl transition-colors"
                                >
                                    <ArrowLeft className="w-6 h-6" />
                                </button>
                                <div className="flex items-center gap-3">
                                    <div className={`text-white p-2 rounded-lg shadow-lg`} style={{ backgroundColor: activeTheme.highlight }}>
                                        {activeTheme.icon}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">{t(`categories.${activeTheme.id}`)}</h2>
                                        <p className="text-indigo-300 text-sm">{t('levelExplorer')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="bg-indigo-950 px-6 py-2 rounded-2xl border border-indigo-800 flex flex-col items-center">
                                    <span className="text-xs text-indigo-400 font-bold">{t('score')}</span>
                                    <span className="text-2xl font-bold text-yellow-400">{score}</span>
                                </div>
                                <div className="bg-indigo-950 px-6 py-2 rounded-2xl border border-indigo-800 flex flex-col items-center">
                                    <span className="text-xs text-indigo-400 font-bold">{t('progress')}</span>
                                    <span className="text-2xl font-bold text-emerald-400">{foundWords.length}/{targetWords.length}</span>
                                </div>
                            </div>
                        </header>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Tablero */}
                            <div className="lg:col-span-8">
                                {/* Contenedor Visual (Tarjeta blanca con padding) */}
                                <div className="bg-white rounded-3xl p-4 shadow-2xl border-b-8 border-indigo-900">

                                    {/* Área Lógica del Tablero (Grid + SVG) */}
                                    {/* Importante: relative y sin padding para que (0,0) sea exacto */}
                                    <div
                                        ref={containerRef}
                                        className="relative overflow-hidden cursor-crosshair touch-none"
                                        onMouseDown={handleStart}
                                        onMouseMove={handleMove}
                                        onMouseUp={handleEnd}
                                        onMouseLeave={handleEnd}
                                        onTouchStart={handleStart}
                                        onTouchMove={handleMove}
                                        onTouchEnd={handleEnd}
                                    >
                                        {/* CAPA DE DIBUJO SVG (Marcador) */}
                                        <svg
                                            className="absolute inset-0 w-full h-full pointer-events-none z-10"
                                            viewBox={`0 0 ${GRID_SIZE.cols} ${GRID_SIZE.rows}`}
                                            preserveAspectRatio="none"
                                        >
                                            {/* Palabras ya encontradas */}
                                            {foundSequences.map((seq, i) => (
                                                <line
                                                    key={i}
                                                    x1={seq.start.col + 0.5}
                                                    y1={seq.start.row + 0.5}
                                                    x2={seq.end.col + 0.5}
                                                    y2={seq.end.row + 0.5}
                                                    stroke={seq.color}
                                                    strokeWidth="0.85"
                                                    strokeLinecap="round"
                                                    opacity="0.5"
                                                />
                                            ))}

                                            {/* Selección actual (mientras arrastras) */}
                                            {selection && (
                                                <line
                                                    x1={selection.start.col + 0.5}
                                                    y1={selection.start.row + 0.5}
                                                    x2={selection.end.col + 0.5}
                                                    y2={selection.end.row + 0.5}
                                                    stroke={activeTheme.highlight}
                                                    strokeWidth="0.85"
                                                    strokeLinecap="round"
                                                    opacity="0.5"
                                                />
                                            )}
                                        </svg>

                                        {/* CAPA DE LETRAS */}
                                        <div
                                            className="grid gap-0 relative z-20"
                                            style={{ gridTemplateColumns: `repeat(${GRID_SIZE.cols}, minmax(0, 1fr))` }}
                                        >
                                            {grid.length > 0 && grid.map((row, rIdx) =>
                                                row.map((cell, cIdx) => (
                                                    <div
                                                        key={`${rIdx}-${cIdx}`}
                                                        className="aspect-square flex items-center justify-center text-xl sm:text-3xl font-bold text-slate-800 leading-none"
                                                    >
                                                        {cell.char}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Lista de Palabras */}
                            <div className="lg:col-span-4 space-y-4">
                                <div className="bg-indigo-900/80 rounded-3xl p-6 border border-indigo-800 h-full">
                                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-yellow-400">
                                        <Grid className="w-5 h-5" />
                                        {t('wordsToFind')}
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {targetWords.map((word) => (
                                            <div
                                                key={word}
                                                className={`
                          px-3 py-2 rounded-lg font-bold text-sm flex items-center justify-between transition-all border
                          ${foundWords.includes(word)
                                                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 line-through decoration-2 opacity-50'
                                                        : 'bg-indigo-950 text-white border-indigo-800 shadow-sm'
                                                    }
                        `}
                                            >
                                                {word}
                                                {foundWords.includes(word) && <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de Victoria */}
                {gameWon && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
                        <div className="bg-white text-indigo-900 p-8 rounded-[2rem] max-w-md w-full text-center border-b-8 border-indigo-200 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500" />

                            <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-bounce">
                                <Trophy className="w-12 h-12 text-white" />
                            </div>

                            <h2 className="text-4xl font-black mb-2">{t('fantastic')}</h2>
                            <p className="text-indigo-400 font-medium mb-8">{t('categoryCompleted')} {t(`categories.${activeTheme?.id}`)}</p>

                            <div className="bg-indigo-50 rounded-2xl p-6 mb-8 flex justify-between items-center">
                                <div className="text-left">
                                    <p className="text-xs uppercase font-bold text-indigo-400">{t('scoreLabel')}</p>
                                    <p className="text-3xl font-black text-indigo-900">{score}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs uppercase font-bold text-indigo-400">{t('time')}</p>
                                    <p className="text-3xl font-black text-indigo-900">{t('genial')}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={() => currentCategory && startGame(currentCategory)}
                                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-transform active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                    {t('playAgainContext')}
                                </button>
                                <button
                                    onClick={() => setCurrentCategory(null)}
                                    className="w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-bold py-4 rounded-xl transition-transform active:scale-95"
                                >
                                    {t('backToMenu')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SuperWordSearch;
