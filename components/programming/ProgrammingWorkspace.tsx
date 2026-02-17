'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MicroLesson } from '@/lib/learning/microLessonSystem';
import { getPhaseUrlForLesson } from '@/lib/learning/programmingLessons';
import { Play, RotateCcw, Trash2, ArrowLeft, Check, Code, HelpCircle, Plus, CornerDownRight } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

// ----------------------------------------------------------------------
// Block Definitions & Types
// ----------------------------------------------------------------------

type BlockType = 'motion' | 'event' | 'control' | 'looks' | 'sound' | 'sensing' | 'operator' | 'variable';

interface BlockDef {
    id: string;
    type: BlockType;
    labelKey: string;
    isContainer?: boolean;
    defaultParams?: Record<string, any>;
}

const BLOCKS: Record<string, BlockDef> = {
    // --- MOTION (S1) ---
    'mover_derecha': { id: 'mover_derecha', type: 'motion', labelKey: 'blocks.mover_derecha' },
    'mover_izquierda': { id: 'mover_izquierda', type: 'motion', labelKey: 'blocks.mover_izquierda' },
    'mover_arriba': { id: 'mover_arriba', type: 'motion', labelKey: 'blocks.mover_arriba' },
    'mover_abajo': { id: 'mover_abajo', type: 'motion', labelKey: 'blocks.mover_abajo' },
    'girar_derecha_90': { id: 'girar_derecha_90', type: 'motion', labelKey: 'blocks.girar_derecha_90' },
    'girar_izquierda_90': { id: 'girar_izquierda_90', type: 'motion', labelKey: 'blocks.girar_izquierda_90' },
    'ir_a': { id: 'ir_a', type: 'motion', labelKey: 'blocks.ir_a' },
    'ir_a_aleatorio': { id: 'ir_a_aleatorio', type: 'motion', labelKey: 'blocks.ir_a_aleatorio' },
    'rebotar': { id: 'rebotar', type: 'motion', labelKey: 'blocks.rebotar' },
    'apuntar_hacia': { id: 'apuntar_hacia', type: 'motion', labelKey: 'blocks.apuntar_hacia' },

    // --- LOOKS (S1, S2) ---
    'borrar_todo': { id: 'borrar_todo', type: 'looks', labelKey: 'blocks.borrar_todo' },
    'bajar_lapiz': { id: 'bajar_lapiz', type: 'looks', labelKey: 'blocks.bajar_lapiz' },
    'subir_lapiz': { id: 'subir_lapiz', type: 'looks', labelKey: 'blocks.subir_lapiz' },
    'color_rojo': { id: 'color_rojo', type: 'looks', labelKey: 'blocks.color_rojo' },
    'color_azul': { id: 'color_azul', type: 'looks', labelKey: 'blocks.color_azul' },
    'color_verde': { id: 'color_verde', type: 'looks', labelKey: 'blocks.color_verde' },
    'decir': { id: 'decir', type: 'looks', labelKey: 'blocks.decir', defaultParams: { text: "¡Hola!" } },
    'cambiar_disfraz': { id: 'cambiar_disfraz', type: 'looks', labelKey: 'blocks.cambiar_disfraz' },
    'cambiar_fondo': { id: 'cambiar_fondo', type: 'looks', labelKey: 'blocks.cambiar_fondo' },
    'esconder': { id: 'esconder', type: 'looks', labelKey: 'blocks.esconder' },
    'mostrar': { id: 'mostrar', type: 'looks', labelKey: 'blocks.mostrar' },
    'cambiar_tamaño': { id: 'cambiar_tamaño', type: 'looks', labelKey: 'blocks.cambiar_tamaño' },
    'efecto_fantasma': { id: 'efecto_fantasma', type: 'looks', labelKey: 'blocks.efecto_fantasma' },

    // --- CONTROL (S2, S3) ---
    'repetir': { id: 'repetir', type: 'control', labelKey: 'blocks.repetir', isContainer: true, defaultParams: { count: 4 } },
    'por_siempre': { id: 'por_siempre', type: 'control', labelKey: 'blocks.por_siempre', isContainer: true },
    'si': { id: 'si', type: 'control', labelKey: 'blocks.si', isContainer: true },
    'si_sino': { id: 'si_sino', type: 'control', labelKey: 'blocks.si_sino', isContainer: true },
    'esperar': { id: 'esperar', type: 'control', labelKey: 'blocks.esperar', defaultParams: { seconds: 1 } },
    'detener_todo': { id: 'detener_todo', type: 'control', labelKey: 'blocks.detener_todo' },
    'crear_clon': { id: 'crear_clon', type: 'control', labelKey: 'blocks.crear_clon' },
    'eliminar_clon': { id: 'eliminar_clon', type: 'control', labelKey: 'blocks.eliminar_clon' },

    // --- EVENTS (S2) ---
    'bandera_verde': { id: 'bandera_verde', type: 'event', labelKey: 'blocks.bandera_verde' },
    'al_presionar_tecla': { id: 'al_presionar_tecla', type: 'event', labelKey: 'blocks.al_presionar_tecla' },
    'al_hacer_click': { id: 'al_hacer_click', type: 'event', labelKey: 'blocks.al_hacer_click' },
    'al_recibir_mensaje': { id: 'al_recibir_mensaje', type: 'event', labelKey: 'blocks.al_recibir_mensaje' },
    'enviar_mensaje': { id: 'enviar_mensaje', type: 'event', labelKey: 'blocks.enviar_mensaje' },
    'al_comenzar_como_clon': { id: 'al_comenzar_como_clon', type: 'event', labelKey: 'blocks.al_comenzar_como_clon' },

    // --- SOUND (S2 placeholder) ---
    'tocar_nota': { id: 'tocar_nota', type: 'sound', labelKey: 'blocks.tocar_nota' },
    'tocar_sonido': { id: 'tocar_sonido', type: 'sound', labelKey: 'blocks.tocar_sonido' },

    // --- SENSING (S3) ---
    'tocando_borde': { id: 'tocando_borde', type: 'sensing', labelKey: 'blocks.tocando_borde' },
    'tocando_puntero': { id: 'tocando_puntero', type: 'sensing', labelKey: 'blocks.tocando_puntero' },
    'tocando_color': { id: 'tocando_color', type: 'sensing', labelKey: 'blocks.tocando_color' },
    'tocando_objeto': { id: 'tocando_objeto', type: 'sensing', labelKey: 'blocks.tocando_objeto' },
    'distancia_a': { id: 'distancia_a', type: 'sensing', labelKey: 'blocks.distancia_a' },
    'preguntar': { id: 'preguntar', type: 'sensing', labelKey: 'blocks.preguntar' },
    'tecla_presionada': { id: 'tecla_presionada', type: 'sensing', labelKey: 'blocks.tecla_presionada' },

    // --- OPERATORS (S3) ---
    'operador_suma': { id: 'operador_suma', type: 'operator', labelKey: 'blocks.operador_suma' },
    'operador_resta': { id: 'operador_resta', type: 'operator', labelKey: 'blocks.operador_resta' },
    'operador_mayor': { id: 'operador_mayor', type: 'operator', labelKey: 'blocks.operador_mayor' },
    'operador_menor': { id: 'operador_menor', type: 'operator', labelKey: 'blocks.operador_menor' },
    'operador_igual': { id: 'operador_igual', type: 'operator', labelKey: 'blocks.operador_igual' },
    'operador_y': { id: 'operador_y', type: 'operator', labelKey: 'blocks.operador_y' },
    'operador_o': { id: 'operador_o', type: 'operator', labelKey: 'blocks.operador_o' },
    'aleatorio': { id: 'aleatorio', type: 'operator', labelKey: 'blocks.aleatorio' },

    // --- VARIABLES (S4) ---
    'crear_variable': { id: 'crear_variable', type: 'variable', labelKey: 'blocks.crear_variable' },
    'fijar_variable': { id: 'fijar_variable', type: 'variable', labelKey: 'blocks.fijar_variable' },
    'cambiar_variable': { id: 'cambiar_variable', type: 'variable', labelKey: 'blocks.cambiar_variable' },
    'mostrar_variable': { id: 'mostrar_variable', type: 'variable', labelKey: 'blocks.mostrar_variable' },
    'esconder_variable': { id: 'esconder_variable', type: 'variable', labelKey: 'blocks.esconder_variable' },

    // --- FUNCTIONS (S4) ---
    'definir_bloque': { id: 'definir_bloque', type: 'control', labelKey: 'blocks.definir_bloque', isContainer: true },
    'usar_bloque': { id: 'usar_bloque', type: 'control', labelKey: 'blocks.usar_bloque' },
    'parametro': { id: 'parametro', type: 'variable', labelKey: 'blocks.parametro' },
};

const BLOCK_COLORS: Record<BlockType, string> = {
    'motion': 'bg-blue-500 border-blue-600 shadow-blue-200 dark:shadow-blue-900',
    'event': 'bg-yellow-400 border-yellow-500 text-yellow-900 shadow-yellow-200 dark:shadow-yellow-900',
    'control': 'bg-amber-500 border-amber-600 shadow-amber-200 dark:shadow-amber-900',
    'looks': 'bg-purple-500 border-purple-600 shadow-purple-200 dark:shadow-purple-900',
    'sound': 'bg-pink-500 border-pink-600 shadow-pink-200 dark:shadow-pink-900',
    'sensing': 'bg-cyan-500 border-cyan-600 shadow-cyan-200 dark:shadow-cyan-900',
    'operator': 'bg-green-500 border-green-600 shadow-green-200 dark:shadow-green-900',
    'variable': 'bg-orange-600 border-orange-700 shadow-orange-300 dark:shadow-orange-900',
};

// ----------------------------------------------------------------------
// Data Structure for Script
// ----------------------------------------------------------------------

interface ScriptItem {
    instanceId: string;
    blockId: string;
    params?: Record<string, any>;
    children?: ScriptItem[];
}

// ----------------------------------------------------------------------
// Workspace Component
// ----------------------------------------------------------------------

interface Props {
    lesson: MicroLesson;
    lang: string;
}

export default function ProgrammingWorkspace({ lesson, lang }: Props) {
    const router = useRouter();
    const t = useTranslations('ProgrammingWorkspace');
    const tl = useTranslations();

    // Calculate return URL
    const returnUrl = getPhaseUrlForLesson(lesson.id);

    // STATE
    const [script, setScript] = useState<ScriptItem[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [roverPos, setRoverPos] = useState({ x: 2, y: 2, angle: 90 });
    const [roverScale, setRoverScale] = useState(1);
    const [roverOpacity, setRoverOpacity] = useState(1);
    const [trail, setTrail] = useState<{ x: number, y: number, color: string }[]>([]);
    const [feedback, setFeedback] = useState<'none' | 'success' | 'fail'>('none');
    const [showHint, setShowHint] = useState(false);
    const [speechBubble, setSpeechBubble] = useState<string | null>(null);
    const [activeContainerId, setActiveContainerId] = useState<string | null>(null);
    const [goalPos, setGoalPos] = useState({ x: 3, y: 2 });

    // Define lesson goals and validation logic
    const getLessonGoal = (lessonId: string): { goalX: number, goalY: number, goalAngle?: number, description: string } => {
        // Mapping of lesson IDs to their objectives
        const goals: Record<string, { goalX: number, goalY: number, goalAngle?: number, description: string }> = {
            'prog_s1_l1': { goalX: 3, goalY: 2, description: t('goals.reach_coords', { x: 3, y: 2 }) },
            'prog_s1_l2': { goalX: 1, goalY: 2, description: t('goals.reach_coords', { x: 1, y: 2 }) },
            'prog_s1_l3': { goalX: 4, goalY: 2, description: t('goals.reach_coords', { x: 4, y: 2 }) },
            'prog_s1_l4': { goalX: 2, goalY: 1, description: t('goals.reach_coords', { x: 2, y: 1 }) },
            'prog_s1_l5': { goalX: 2, goalY: 3, description: t('goals.reach_coords', { x: 2, y: 3 }) },
            'prog_s1_l6': { goalX: 4, goalY: 0, description: t('goals.reach_coords', { x: 4, y: 0 }) },
            'prog_s1_l7': { goalX: 4, goalY: 2, description: t('goals.zigzag') },
            'prog_s1_l8': { goalX: 2, goalY: 2, description: t('goals.start_pos') },
            'prog_s1_l9': { goalX: 2, goalY: 2, description: t('goals.clear_code') },
            'prog_s1_l10': { goalX: 4, goalY: 1, description: t('goals.dodge_rock') },
        };
        return goals[lessonId] || { goalX: 3, goalY: 2, description: t('goals.complete_challenge') };
    };

    // Initial State Reset
    useEffect(() => {
        resetStage();
        setScript([]);
        setFeedback('none');
        setActiveContainerId(null);
        const goal = getLessonGoal(lesson.id);
        setGoalPos({ x: goal.goalX, y: goal.goalY });
    }, [lesson.id]);

    const resetStage = () => {
        setRoverPos({ x: 2, y: 2, angle: 90 });
        setRoverScale(1);
        setRoverOpacity(1);
        setTrail([]);
        setSpeechBubble(null);
        setIsPlaying(false);
    };

    // ----------------------------------------------------------------------
    // Execution Logic (Recursive)
    // ----------------------------------------------------------------------

    const runScript = async () => {
        if (isPlaying) return;
        setIsPlaying(true);
        resetStage();

        await new Promise(r => setTimeout(r, 500));

        // Execution Context
        let ctx = {
            pos: { x: 2, y: 2, angle: 90 },
            scale: 1,
            opacity: 1,
            penDown: false,
            color: 'blue',
            trail: [] as typeof trail
        };

        // Recursive executor
        const executeItems = async (items: ScriptItem[]) => {
            for (const item of items) {
                if (!isPlaying && document.hidden) return; // Basic break check

                // Execute Block Logic
                await executeBlock(item, ctx);

                // Update React State
                setRoverPos({ ...ctx.pos });
                setRoverScale(ctx.scale);
                setRoverOpacity(ctx.opacity);

                // Wait for animation step (unless it's 'Esperar' which handles its own wait)
                if (item.blockId !== 'esperar') {
                    await new Promise(r => setTimeout(r, 500));
                }
            }
        };

        const executeBlock = async (item: ScriptItem, context: typeof ctx) => {
            const blockId = item.blockId;

            // MOTION
            if (blockId === 'mover_derecha') context.pos.x = Math.min(4, context.pos.x + 1);
            else if (blockId === 'mover_izquierda') context.pos.x = Math.max(0, context.pos.x - 1);
            else if (blockId === 'mover_arriba') context.pos.y = Math.max(0, context.pos.y - 1);
            else if (blockId === 'mover_abajo') context.pos.y = Math.min(4, context.pos.y + 1);
            else if (blockId === 'girar_derecha_90') context.pos.angle += 90;
            else if (blockId === 'girar_izquierda_90') context.pos.angle -= 90;
            else if (blockId === 'ir_a') { context.pos.x = 0; context.pos.y = 0; }
            else if (blockId === 'ir_a_aleatorio') { context.pos.x = Math.floor(Math.random() * 5); context.pos.y = Math.floor(Math.random() * 5); }

            // LOOKS
            else if (blockId === 'bajar_lapiz') context.penDown = true;
            else if (blockId === 'subir_lapiz') context.penDown = false;
            else if (blockId === 'color_rojo') context.color = 'red';
            else if (blockId === 'color_azul') context.color = 'blue';
            else if (blockId === 'color_verde') context.color = 'green';
            else if (blockId === 'borrar_todo') { context.trail = []; setTrail([]); }
            else if (blockId === 'decir') {
                setSpeechBubble(t('blocks.decir').split("'")[1] || "Hola!");
                await new Promise(r => setTimeout(r, 1000));
                setSpeechBubble(null);
            }
            else if (blockId === 'cambiar_tamaño') context.scale = context.scale === 1 ? 1.5 : 1;
            else if (blockId === 'efecto_fantasma') context.opacity = context.opacity === 1 ? 0.5 : 1;
            else if (blockId === 'esconder') context.opacity = 0;
            else if (blockId === 'mostrar') context.opacity = 1;


            // CONTROL
            else if (blockId === 'esperar') {
                await new Promise(r => setTimeout(r, 1000));
            }
            else if (blockId === 'repetir' && item.children) {
                const count = item.params?.count || 4;
                for (let i = 0; i < count; i++) {
                    await executeItems(item.children);
                }
            }
            else if (blockId === 'por_siempre' && item.children) {
                // Simulation limit
                for (let i = 0; i < 10; i++) {
                    await executeItems(item.children);
                }
            }
            // Simple mock for Conditionals (always true for MVP unless we implement real sensors)
            else if ((blockId === 'si' || blockId === 'si_sino') && item.children) {
                // Determine condition result... hardcoded true for now to allow flow
                const condition = true;
                if (condition) {
                    await executeItems(item.children);
                }
            }
        };

        if (script.length > 0) {
            await executeItems(script);
        }

        setIsPlaying(false);
        checkWinCondition(ctx.pos, script);
    };

    const checkWinCondition = (finalPos: typeof roverPos, executedScript: ScriptItem[]) => {
        // Get lesson goal
        const goal = getLessonGoal(lesson.id);

        // Validation: must have code AND must reach the goal position
        if (executedScript.length > 0 && finalPos.x === goal.goalX && finalPos.y === goal.goalY) {
            setFeedback('success');
        } else {
            setFeedback('fail');
        }
    };

    // ----------------------------------------------------------------------
    // Script Management
    // ----------------------------------------------------------------------

    const addToScript = (blockId: string) => {
        if (isPlaying) return;

        const blockDef = BLOCKS[blockId];
        const newBlock: ScriptItem = {
            instanceId: Math.random().toString(36).substr(2, 9),
            blockId,
            params: blockDef?.defaultParams ? { ...blockDef.defaultParams } : undefined,
            children: blockDef?.isContainer ? [] : undefined
        };

        if (activeContainerId === null) {
            setScript([...script, newBlock]);
        } else {
            const addToContainer = (items: ScriptItem[]): ScriptItem[] => {
                return items.map(item => {
                    if (item.instanceId === activeContainerId) {
                        return { ...item, children: [...(item.children || []), newBlock] };
                    } else if (item.children) {
                        return { ...item, children: addToContainer(item.children) };
                    }
                    return item;
                });
            };
            setScript(addToContainer(script));
        }
        setFeedback('none');
    };

    const removeFromScript = (targetId: string) => {
        if (isPlaying) return;
        const removeRecursive = (items: ScriptItem[]): ScriptItem[] => {
            return items.filter(item => item.instanceId !== targetId).map(item => ({
                ...item,
                children: item.children ? removeRecursive(item.children) : undefined
            }));
        };
        setScript(removeRecursive(script));
        if (targetId === activeContainerId) setActiveContainerId(null);
    };

    // ----------------------------------------------------------------------
    // Recursive Rendering Component
    // ----------------------------------------------------------------------

    const BlockList = ({ items, depth = 0 }: { items: ScriptItem[], depth?: number }) => {
        return (
            <AnimatePresence>
                {items.map((item, idx) => {
                    const block = BLOCKS[item.blockId];
                    const label = block ? tl(`ProgrammingWorkspace.${block.labelKey}`) : item.blockId;
                    const isActiveContainer = activeContainerId === item.instanceId;

                    return (
                        <motion.div
                            key={item.instanceId}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="relative mb-2 select-none"
                        >
                            <div
                                className={`
                                    ${BLOCK_COLORS[block?.type || 'control']}
                                    text-white font-bold py-2 px-3 rounded-lg shadow-sm border-b-4 
                                    cursor-pointer flex items-center gap-2 group relative transition-all
                                    ${isActiveContainer ? 'ring-4 ring-yellow-400 scale-[1.02]' : ''}
                                `}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (block?.isContainer) {
                                        setActiveContainerId(isActiveContainer ? null : item.instanceId);
                                    }
                                }}
                            >
                                <span className="text-xs opacity-50 bg-black/20 px-1.5 rounded">{idx + 1}</span>
                                <span>{label || item.blockId}</span>

                                {block?.isContainer && (
                                    <CornerDownRight className={`w-4 h-4 ml-auto transition-transform ${isActiveContainer ? 'rotate-90' : ''}`} />
                                )}

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFromScript(item.instanceId);
                                    }}
                                    className="ml-auto p-1 hover:bg-white/20 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            {block?.isContainer && (
                                <div className="ml-4 pl-2 border-l-4 border-gray-300/50 dark:border-gray-600/50 min-h-[40px] mt-1">
                                    {item.children && item.children.length > 0 ? (
                                        <BlockList items={item.children} depth={depth + 1} />
                                    ) : (
                                        <div
                                            className={`text-xs text-gray-400 italic p-2 rounded cursor-pointer ${isActiveContainer ? 'bg-yellow-50 dark:bg-yellow-900/10 ring-2 ring-yellow-400/50' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveContainerId(item.instanceId);
                                            }}
                                        >
                                            {t('tapToAdd')}
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        );
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 text-sm md:text-base selection:bg-none">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b p-4 shadow-sm flex items-center justify-between shrink-0 z-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.push(returnUrl)} className="p-2 hover:bg-gray-100 rounded-full dark:hover:bg-gray-700">
                        <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>
                    <div>
                        <div className="text-xs text-gray-400 font-medium mb-0.5 uppercase tracking-wider hidden sm:block">
                            {tl('Navigation.programming')} • {tl(`Navigation.ProgrammingNavigation.section${lesson.unitId.split('_')[1].replace('s', '')}`)}
                        </div>
                        <h1 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                            <Code className="w-5 h-5 text-violet-500" />
                            {tl(lesson.titleKey)}
                        </h1>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowHint(!showHint)}
                        className="bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-full font-medium text-xs flex items-center gap-1 hover:bg-yellow-200"
                    >
                        <HelpCircle className="w-3 h-3" />
                        {t('hint')}
                    </button>
                </div>
            </div>

            {/* Hint */}
            <AnimatePresence>
                {showHint && (
                    <motion.div
                        initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                        className="bg-yellow-50 dark:bg-yellow-900/20 p-4 text-center border-b border-yellow-100 text-yellow-800 dark:text-yellow-200 text-sm overflow-hidden"
                    >
                        {lesson.hintKey && tl(lesson.hintKey)}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Area */}
            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                {/* TOOLBOX */}
                <div className="w-full md:w-64 bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto p-4 gap-3 shrink-0 order-3 md:order-1 h-24 md:h-auto items-center md:items-stretch no-scrollbar">
                    {lesson.requiredBlocks?.map(bId => {
                        const block = BLOCKS[bId];
                        const label = block ? tl(`ProgrammingWorkspace.${block.labelKey}`) : bId;
                        if (!block) return null;
                        return (
                            <motion.button
                                key={bId}
                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={() => addToScript(bId)}
                                className={`${BLOCK_COLORS[block.type]} text-white font-bold py-2 px-4 rounded-lg shadow-md border-b-4 text-xs md:text-sm whitespace-nowrap flex items-center gap-2 justify-center md:justify-start`}
                            >
                                <Plus className="w-4 h-4 hidden md:block" /> {label || bId}
                            </motion.button>
                        );
                    })}
                </div>

                {/* SCRIPT AREA */}
                <div className="flex-1 bg-gray-50/50 dark:bg-black/20 p-6 overflow-y-auto relative order-2 md:order-2 flex flex-col items-center"
                    onClick={() => setActiveContainerId(null)}
                >
                    <div className="w-full max-w-md bg-white dark:bg-gray-800 min-h-[400px] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex flex-col gap-2 relative transition-colors"
                        style={{ borderColor: activeContainerId ? '#fbbf24' : '' }}
                    >
                        {script.length === 0 && (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-center p-8 border-2 border-dashed border-gray-100 dark:border-gray-700/50 rounded-xl">
                                <Code className="w-12 h-12 mb-3 opacity-20" />
                                <p className="font-medium mb-1">{t('dragBlocks')}</p>
                            </div>
                        )}
                        <BlockList items={script} />
                    </div>
                </div>

                {/* STAGE & CONTROLS */}
                <div className="w-full md:w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4 flex flex-col items-center justify-start gap-4 shrink-0 order-1 md:order-3 z-20 shadow-lg md:shadow-none">

                    {/* Grid Canvas */}
                    <div className="relative w-64 h-64 bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden border-4 border-slate-200 dark:border-slate-700 shadow-inner grid grid-cols-5 grid-rows-5 select-none scale-100">
                        {Array.from({ length: 25 }).map((_, i) => (
                            <div key={i} className="border-r border-b border-slate-200/50 dark:border-slate-700/50" />
                        ))}

                        {/* Speech Bubble */}
                        <AnimatePresence>
                            {speechBubble && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.5 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}
                                    className="absolute z-50 bg-white border-2 border-black rounded-lg px-2 py-1 text-xs font-bold text-black whitespace-nowrap"
                                    style={{
                                        left: `${Math.min(80, Math.max(10, roverPos.x * 20))}%`,
                                        top: `${Math.max(5, roverPos.y * 20 - 15)}%`,
                                        transform: 'translateX(-50%)'
                                    }}
                                >
                                    {speechBubble}
                                    <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-b-2 border-r-2 border-black rotate-45"></div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Goal */}
                        <div className="absolute w-1/5 h-1/5 flex items-center justify-center text-2xl" style={{ left: `${goalPos.x * 20}%`, top: `${goalPos.y * 20}%` }}>🚩</div>

                        {/* Rover */}
                        <motion.div
                            className="absolute w-1/5 h-1/5 flex items-center justify-center z-10 transition-transform"
                            animate={{
                                left: `${roverPos.x * 20}%`,
                                top: `${roverPos.y * 20}%`,
                                rotate: roverPos.angle - 90,
                                scale: roverScale,
                                opacity: roverOpacity
                            }}
                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        >
                            <span className="text-3xl filter drop-shadow-lg">🤖</span>
                        </motion.div>
                    </div>

                    <div className="flex gap-4 w-full justify-center">
                        <button
                            onClick={runScript}
                            disabled={isPlaying || script.length === 0}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white shadow-lg transform transition-all active:scale-95 ${isPlaying ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 hover:shadow-green-500/30'}`}
                        >
                            {isPlaying ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" /> : <Play className="w-4 h-4" />}
                            {t('run')}
                        </button>
                        <button
                            onClick={resetStage}
                            disabled={isPlaying}
                            className="p-3 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 transition-colors"
                        >
                            <RotateCcw className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Success/Fail Feedback Modal */}
                    <AnimatePresence>
                        {feedback !== 'none' && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                            >
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0, y: 20 }}
                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                    exit={{ scale: 0.8, opacity: 0, y: 20 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center max-w-sm w-full"
                                >
                                    {feedback === 'success' ? (
                                        <>
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                                                className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                                            >
                                                <Check className="w-10 h-10" />
                                            </motion.div>
                                            <h3 className="text-3xl font-black text-gray-800 dark:text-white mb-2">
                                                {t('successTitle')}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
                                                {t('successDesc')}
                                            </p>
                                            <button
                                                onClick={() => router.push(returnUrl)}
                                                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all active:scale-95"
                                            >
                                                {t('continue')}
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                                                className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4"
                                            >
                                                <span className="text-3xl">🤔</span>
                                            </motion.div>
                                            <h2 className="text-2xl font-black text-rose-600 mb-2">
                                                {t('failTitle')}
                                            </h2>
                                            <p className="text-gray-600 dark:text-gray-300 mb-6 font-medium">
                                                {t('failDesc', { goal: getLessonGoal(lesson.id).description })}
                                            </p>
                                            <button
                                                onClick={() => { setFeedback('none'); resetStage(); }}
                                                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-black py-4 rounded-2xl shadow-lg border-b-4 border-rose-700 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2"
                                            >
                                                <RotateCcw className="w-5 h-5" />
                                                {t('restart')}
                                            </button>
                                        </>
                                    )}
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
