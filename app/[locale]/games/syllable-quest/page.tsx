'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Play,
    RotateCcw,
    Home,
    Volume2,
    VolumeX,
    Check,
    Heart,
    Trophy,
    HelpCircle,
    Clock
} from 'lucide-react';
import { Link } from '@/i18n/navigation';

import styles from './page.module.css';

// --- DATA & CONFIGURATION ---

const LANGUAGES = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' }
];

const WORD_DB: Record<string, { word: string; splits: number[]; difficulty: number }[]> = {
    es: [
        { word: "SOL", splits: [], difficulty: 1 },           // SOL
        { word: "PAN", splits: [], difficulty: 1 },           // PAN
        { word: "CASA", splits: [2], difficulty: 1 },         // CA-SA
        { word: "LUNA", splits: [2], difficulty: 1 },         // LU-NA
        { word: "GATO", splits: [2], difficulty: 1 },         // GA-TO
        { word: "PERRO", splits: [2], difficulty: 1 },        // PE-RRO
        { word: "AMIGO", splits: [1, 3], difficulty: 2 },     // A-MI-GO
        { word: "TOMATE", splits: [2, 4], difficulty: 2 },    // TO-MA-TE
        { word: "AVENTURA", splits: [1, 4, 6], difficulty: 3 }, // A-VEN-TU-RA
        { word: "MARIPOSA", splits: [2, 4, 6], difficulty: 3 }, // MA-RI-PO-SA
        { word: "ELEFANTE", splits: [1, 3, 6], difficulty: 3 }, // E-LE-FAN-TE
        { word: "BICICLETA", splits: [2, 4, 7], difficulty: 3 }, // BI-CI-CLE-TA
        { word: "COMPUTADORA", splits: [3, 5, 7, 9], difficulty: 3 } // COM-PU-TA-DO-RA
    ],
    en: [
        { word: "CAT", splits: [], difficulty: 1 },           // CAT
        { word: "DOG", splits: [], difficulty: 1 },           // DOG
        { word: "SUN", splits: [], difficulty: 1 },           // SUN
        { word: "APPLE", splits: [2], difficulty: 1 },        // AP-PLE
        { word: "HAPPY", splits: [3], difficulty: 1 },        // HAP-PY
        { word: "TABLE", splits: [2], difficulty: 1 },        // TA-BLE
        { word: "TIGER", splits: [2], difficulty: 2 },        // TI-GER
        { word: "BANANA", splits: [2, 4], difficulty: 2 },    // BA-NA-NA
        { word: "GALAXY", splits: [3, 5], difficulty: 2 },    // GAL-AX-Y
        { word: "COMPUTER", splits: [3, 5], difficulty: 3 },  // COM-PU-TER
        { word: "ELEPHANT", splits: [3, 4], difficulty: 3 },  // EL-E-PHANT (Standard: el-e-phant)
        { word: "ADVENTURE", splits: [2, 5], difficulty: 3 }, // AD-VEN-TURE
        { word: "BASKETBALL", splits: [3, 6], difficulty: 3 } // BAS-KET-BALL
    ],
    pt: [
        { word: "MÃO", splits: [], difficulty: 1 },           // MÃO
        { word: "SOL", splits: [], difficulty: 1 },           // SOL
        { word: "BOLA", splits: [2], difficulty: 1 },         // BO-LA
        { word: "GATO", splits: [2], difficulty: 1 },         // GA-TO
        { word: "CASA", splits: [2], difficulty: 1 },         // CA-SA
        { word: "ESCOLA", splits: [2, 4], difficulty: 2 },    // ES-CO-LA
        { word: "JANELA", splits: [2, 4], difficulty: 2 },    // JA-NE-LA
        { word: "CARRO", splits: [3], difficulty: 2 },        // CAR-RO
        { word: "AMIGO", splits: [1, 3], difficulty: 2 },     // A-MI-GO
        { word: "CHOCOLATE", splits: [3, 5, 7], difficulty: 3 }, // CHO-CO-LA-TE
        { word: "FELICIDADE", splits: [2, 4, 6, 8], difficulty: 3 }, // FE-LI-CI-DA-DE
        { word: "COMPUTADOR", splits: [3, 5, 7], difficulty: 3 } // COM-PU-TA-DOR
    ],
    fr: [
        { word: "CHAT", splits: [], difficulty: 1 },          // CHAT
        { word: "EAU", splits: [], difficulty: 1 },           // EAU
        { word: "PAIN", splits: [], difficulty: 1 },          // PAIN
        { word: "ROUGE", splits: [], difficulty: 1 },         // ROUGE
        { word: "MERCI", splits: [3], difficulty: 2 },        // MER-CI
        { word: "PETIT", splits: [2], difficulty: 2 },        // PE-TIT
        { word: "AMOUR", splits: [1], difficulty: 2 },        // A-MOUR
        { word: "BONJOUR", splits: [3], difficulty: 2 },      // BON-JOUR
        { word: "PAPILLON", splits: [2, 5], difficulty: 3 },  // PA-PIL-LON
        { word: "ÉLÉPHANT", splits: [1, 3, 5], difficulty: 3 }, // É-LÉ-PHANT
        { word: "FANTASTIQUE", splits: [3, 6, 8], difficulty: 3 } // FAN-TAS-TIQUE
    ],
    it: [
        { word: "BLU", splits: [], difficulty: 1 },           // BLU
        { word: "RE", splits: [], difficulty: 1 },            // RE
        { word: "CANE", splits: [2], difficulty: 1 },         // CA-NE
        { word: "SOLE", splits: [2], difficulty: 1 },         // SO-LE
        { word: "PIZZA", splits: [3], difficulty: 1 },        // PIZ-ZA
        { word: "PASTA", splits: [3], difficulty: 1 },        // PAS-TA
        { word: "AMORE", splits: [1, 3], difficulty: 2 },     // A-MO-RE
        { word: "ALBERO", splits: [2, 4], difficulty: 2 },    // AL-BE-RO
        { word: "GELATO", splits: [2, 4], difficulty: 2 },    // GE-LA-TO
        { word: "SPAGHETTI", splits: [3, 6], difficulty: 3 }, // SPA-GHET-TI
        { word: "MERAVIGLIOSO", splits: [2, 4, 6, 9], difficulty: 3 }, // ME-RA-VI-GLIO-SO
        { word: "POMODORO", splits: [2, 4, 6], difficulty: 3 } // PO-MO-DO-RO
    ]
};

// --- TYPES ---

type GameState = 'menu' | 'tutorial' | 'playing' | 'gameover';

// --- COMPONENTS ---

export default function SyllableQuestGame() {
    const [gameState, setGameState] = useState<GameState>('menu');
    const [language, setLanguage] = useState('es');
    const [soundEnabled, setSoundEnabled] = useState(true);

    // Game Session State
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(5);
    const [timeLeft, setTimeLeft] = useState(60);
    const [activeWords, setActiveWords] = useState<typeof WORD_DB['es']>([]);

    // Setup game
    const startGame = () => {
        // Shuffle and pick words for the selected language
        const words = [...WORD_DB[language]].sort(() => 0.5 - Math.random());
        setActiveWords(words);
        setCurrentWordIndex(0);
        setScore(0);
        setLives(5);
        setTimeLeft(60);
        setGameState('tutorial'); // Show tutorial first
    };

    const handleGameOver = useCallback(() => {
        setGameState('gameover');
    }, []);

    // Timer logic
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (gameState === 'playing' && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        handleGameOver();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [gameState, timeLeft, handleGameOver]);

    const toggleSound = () => setSoundEnabled(!soundEnabled);

    return (
        <div className="min-h-screen bg-stone-800 font-sans select-none overflow-hidden flex items-center justify-center relative">
            {/* Background Texture (Simulated Blackboard) */}
            <div className="absolute inset-0 bg-[#2F5D48] opacity-100"
                style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <div className="absolute inset-0 bg-black opacity-20 pointer-events-none"
                style={{ boxShadow: 'inset 0 0 100px rgba(0,0,0,0.9)' }}></div>

            {/* Main Container */}
            <div className="relative w-full max-w-5xl h-[90vh] md:h-[800px] border-[16px] border-[#8B5A2B] rounded-xl shadow-2xl bg-[#264D3B] overflow-hidden flex flex-col">

                {/* Wood Texture on Border */}
                <div className="absolute inset-0 border-[16px] border-[#8B5A2B] pointer-events-none z-50 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"></div>

                {/* Global Header (Visible in Game) */}
                {gameState === 'playing' && (
                    <div className="flex justify-between items-center p-6 text-white z-20">
                        <div className="flex gap-4">
                            <button onClick={() => setGameState('menu')} className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition">
                                <Home size={24} />
                            </button>
                            <button onClick={toggleSound} className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition">
                                {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
                            </button>
                        </div>

                        <div className="flex gap-8 items-center bg-black/20 px-6 py-2 rounded-full border border-white/10">
                            <div className="flex items-center gap-2">
                                <Clock className="text-yellow-400" size={20} />
                                <span className="text-2xl font-bold font-mono">{timeLeft}s</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Trophy className="text-yellow-400" size={20} />
                                <span className="text-2xl font-bold font-mono">{score.toString().padStart(2, '0')}</span>
                            </div>
                        </div>

                        <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Heart
                                    key={i}
                                    size={24}
                                    className={`${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-500 fill-gray-900'} drop-shadow-md transition-all duration-300`}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* --- SCREENS --- */}

                {gameState === 'menu' && (
                    <div className={`w-full h-full ${styles.animateFadeIn}`}>
                        <MenuScreen
                            onStart={startGame}
                            language={language}
                            setLanguage={setLanguage}
                        />
                    </div>
                )}

                {gameState === 'tutorial' && (
                    <TutorialScreen
                        onClose={() => setGameState('playing')}
                        language={language}
                    />
                )}

                {gameState === 'playing' && activeWords.length > 0 && (
                    <GameLevel
                        currentWord={activeWords[currentWordIndex]}
                        onSuccess={(points) => {
                            setScore(s => s + points);
                            if (currentWordIndex < activeWords.length - 1) {
                                setTimeout(() => setCurrentWordIndex(i => i + 1), 1000);
                            } else {
                                handleGameOver();
                            }
                        }}
                        onFail={() => {
                            setLives(l => {
                                if (l <= 1) {
                                    handleGameOver();
                                    return 0;
                                }
                                return l - 1;
                            });
                        }}
                        language={language}
                    />
                )}

                {gameState === 'gameover' && (
                    <GameOverScreen
                        score={score}
                        onRestart={startGame}
                        onHome={() => setGameState('menu')}
                    />
                )}
            </div>

            {/* Styles for game animations injected via useEffect */}
        </div>
    );
}

// --- SUB-COMPONENTS ---

function MenuScreen({ onStart, language, setLanguage }: { onStart: () => void, language: string, setLanguage: (l: string) => void }) {
    return (
        <div className="flex flex-col items-center justify-center h-full z-10 text-white space-y-8">

            {/* Home Navigation button added to menu as well for easy exit if needed, though mostly for consistent feel */}
            <div className="absolute top-6 left-6">
                <Link href="/games" className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition flex items-center gap-2">
                    <Home size={24} />
                    <span className="font-bold">Exit</span>
                </Link>
            </div>

            <div className="text-center space-y-2">
                <h1 className="text-5xl md:text-8xl font-bold text-[#FFD700] drop-shadow-[4px_4px_0_rgba(0,0,0,0.5)]" style={{ fontFamily: 'Comic Sans MS, sans-serif' }}>
                    Syllable Quest
                </h1>
                <p className="text-2xl text-gray-200 opacity-90">La Aventura de las Sílabas</p>
            </div>

            <div className="grid grid-cols-5 gap-2 md:gap-4 bg-black/20 p-4 rounded-xl border border-white/10">
                {LANGUAGES.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`flex flex-col items-center p-3 rounded-lg transition-all transform hover:scale-105 ${language === lang.code
                            ? 'bg-yellow-500/90 text-black shadow-lg scale-110'
                            : 'bg-white/10 hover:bg-white/20'
                            }`}
                    >
                        <span className="text-3xl mb-1">{lang.flag}</span>
                        <span className="text-xs font-bold uppercase">{lang.code}</span>
                    </button>
                ))}
            </div>

            <button
                onClick={onStart}
                className="group relative px-12 py-6 bg-orange-500 rounded-2xl shadow-[0_8px_0_#9a3412] active:shadow-[0_4px_0_#9a3412] active:translate-y-1 transition-all"
            >
                <div className="flex items-center gap-4 text-3xl font-black uppercase tracking-wider">
                    <Play fill="white" size={32} />
                    Jugar
                </div>
                {/* Shine effect */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                    <div className={`absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:${styles.animateShine}`} />
                </div>
            </button>
        </div>
    );
}

function TutorialScreen({ onClose, language }: { onClose: () => void, language: string }) {
    const instructions: Record<string, string> = {
        es: "Separa las sílabas correctamente",
        en: "Separate the syllables correctly",
        pt: "Separe as sílabas corretamente",
        fr: "Séparez les syllabes correctement",
        it: "Separa correttamente le sillabe"
    };

    const subtext: Record<string, string> = {
        es: "Haz clic entre las letras para cortar",
        en: "Click between letters to cut",
        pt: "Clique entre as letras para cortar",
        fr: "Cliquez entre les lettres pour couper",
        it: "Clicca tra le lettere per tagliare"
    };

    return (
        <div className={`absolute inset-0 z-30 bg-black/80 flex flex-col items-center justify-center text-white p-8 text-center backdrop-blur-sm ${styles.animateFadeIn}`}>
            <HelpCircle size={64} className="text-yellow-400 mb-6 animate-bounce" />
            <h2 className="text-4xl font-bold mb-4 font-mono">{instructions[language]}</h2>
            <p className="text-xl mb-12 text-gray-300 max-w-lg">{subtext[language]}</p>

            {/* Demo Graphic */}
            <div className="flex items-center gap-1 text-5xl font-bold mb-12 opacity-80">
                <span>B</span>
                <span>A</span>
                <div className="w-4 h-12 bg-yellow-400 rounded-full mx-1 animate-pulse shadow-[0_0_15px_rgba(250,204,21,0.6)]"></div>
                <span>N</span>
                <span>A</span>
                <div className="w-4 h-12 bg-gray-600 rounded-full mx-1 opacity-30 border border-white/20"></div>
                <span>N</span>
                <span>A</span>
            </div>

            <button
                onClick={onClose}
                className="px-8 py-3 bg-green-600 rounded-xl text-xl font-bold shadow-[0_6px_0_#14532d] hover:bg-green-500 active:shadow-[0_3px_0_#14532d] active:translate-y-1 transition-all"
            >
                {language === 'en' ? 'Got it!' : '¡Entendido!'}
            </button>
        </div>
    );
}

function GameLevel({ currentWord, onSuccess, onFail, language }: { currentWord: { word: string, splits: number[] }, onSuccess: (points: number) => void, onFail: () => void, language: string }) {
    const [userSplits, setUserSplits] = useState<boolean[]>([]); // Array of booleans
    const [status, setStatus] = useState<'active' | 'correct' | 'incorrect'>('active');

    // Reset state when word changes
    useEffect(() => {
        // Initialize splits array based on word length - 1 (spaces between letters)
        // "CASA" (4 letters) -> 3 spaces: C_A_S_A
        setUserSplits(new Array(currentWord.word.length - 1).fill(false));
        setStatus('active');
    }, [currentWord]);

    const toggleSplit = (index: number) => {
        if (status !== 'active') return;
        const newSplits = [...userSplits];
        newSplits[index] = !newSplits[index];
        setUserSplits(newSplits);
    };

    const checkAnswer = () => {
        // Generate the user's split indices
        const currentSplitIndices = userSplits
            .map((isSplit, index) => isSplit ? index + 1 : null)
            .filter((val): val is number => val !== null); // Indices where splits are true

        // Compare with correct splits
        const isCorrect = JSON.stringify(currentSplitIndices) === JSON.stringify(currentWord.splits);

        if (isCorrect) {
            setStatus('correct');
            onSuccess(100);
        } else {
            setStatus('incorrect');
            // Shake effect timeout
            setTimeout(() => {
                setStatus('active');
            }, 800);
            onFail();
        }
    };

    const letters = currentWord.word.split('');

    return (
        <div className={`flex-1 flex flex-col items-center justify-center z-10 w-full ${styles.animateFadeIn}`}>

            {/* Word Rendering Area */}
            <div className={`
        flex items-center justify-center flex-wrap gap-y-8 px-4 py-12 mb-8
        transition-transform duration-300
        ${status === 'incorrect' ? styles.animateShake : ''}
        ${status === 'correct' ? 'scale-110' : ''}
      `}>
                {letters.map((letter, index) => (
                    <React.Fragment key={index}>
                        {/* The Letter */}
                        <div className="text-6xl md:text-8xl font-bold text-white drop-shadow-md font-mono relative">
                            {letter}
                        </div>

                        {/* The Interaction Space (Between letters) */}
                        {index < letters.length - 1 && (
                            <button
                                onClick={() => toggleSplit(index)}
                                className={`
                  mx-2 md:mx-4 w-6 h-16 md:h-24 rounded-full transition-all duration-200 flex items-center justify-center
                  hover:bg-white/10 focus:outline-none
                  ${userSplits[index]
                                        ? 'bg-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)] scale-110'
                                        : 'bg-white/5 border border-white/10 hover:border-white/30 scale-90'}
                `}
                            >
                                {userSplits[index] && <div className="w-1 h-12 bg-yellow-600/50 rounded-full"></div>}
                            </button>
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Feedback Message */}
            <div className="h-16 mb-8 flex items-center justify-center">
                {status === 'correct' && (
                    <div className="bg-green-500 text-white px-6 py-2 rounded-full font-bold text-xl animate-bounce flex items-center gap-2">
                        <Check size={24} /> ¡Correcto! / Great!
                    </div>
                )}
                {status === 'incorrect' && (
                    <div className="bg-red-500 text-white px-6 py-2 rounded-full font-bold text-xl flex items-center gap-2">
                        <VolumeX size={24} /> ¡Ups! / Oops!
                    </div>
                )}
            </div>

            {/* Action Button */}
            <button
                onClick={checkAnswer}
                disabled={status !== 'active'}
                className={`
          px-16 py-5 rounded-2xl text-2xl font-black tracking-wider uppercase transition-all
          shadow-[0_8px_0_rgba(0,0,0,0.3)]
          ${status === 'active'
                        ? 'bg-orange-500 text-white hover:bg-orange-400 hover:-translate-y-1 active:translate-y-1 active:shadow-[0_4px_0_rgba(0,0,0,0.3)]'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'}
        `}
            >
                CHECK
            </button>

            <div className="mt-8 text-white/40 text-sm font-mono">
                {language.toUpperCase()} MODE
            </div>
        </div>
    );
}

function GameOverScreen({ score, onRestart, onHome }: { score: number, onRestart: () => void, onHome: () => void }) {
    return (
        <div className={`flex flex-col items-center justify-center h-full z-10 text-white ${styles.animateZoomIn}`}>
            <Trophy size={80} className="text-yellow-400 mb-6 drop-shadow-lg" />
            <h2 className="text-5xl font-bold mb-2">Game Over!</h2>
            <p className="text-2xl mb-8 opacity-90">Puntuación Final</p>

            <div className="bg-white/10 p-6 rounded-2xl border-2 border-white/20 mb-12 backdrop-blur-sm">
                <span className="text-7xl font-mono font-bold text-yellow-300">{score}</span>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={onHome}
                    className="p-4 bg-gray-600 rounded-xl hover:bg-gray-500 transition shadow-[0_4px_0_#374151]"
                >
                    <Home size={32} />
                </button>
                <button
                    onClick={onRestart}
                    className="px-8 py-4 bg-green-600 rounded-xl text-xl font-bold flex items-center gap-2 shadow-[0_6px_0_#14532d] hover:bg-green-500 active:translate-y-1 active:shadow-[0_3px_0_#14532d] transition"
                >
                    <RotateCcw size={24} />
                    Jugar Otra vez
                </button>
            </div>
        </div>
    );
}
