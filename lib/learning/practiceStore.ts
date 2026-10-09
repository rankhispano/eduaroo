'use client';

// Perfiles y progreso de práctica de cada niño. Se guarda solo en el navegador (sin cuentas).
// Los campos de primer nivel (name, cursoId, topics...) son los del perfil activo; el resto de
// perfiles se guardan en `profiles` y se intercambian al cambiar de perfil, junto con su XP,
// racha y logros del store de gamificación.

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { calculateNextReview } from '@/lib/learning/spacedRepetition';
import { useGamificationStore, type GamificationState } from '@/lib/gamification/store';
import { starsFor } from '@/lib/curriculum/steps';
import type { CursoId } from '@/src/types';

export interface TopicProgress {
    stars: 1 | 2 | 3;
    bestScore: number; // 0-100
    attempts: number;
    lastPlayedAt: string;
}

// Un fallo vuelve en el repaso del día; tras acertarlo varias veces seguidas desaparece
export interface MistakeItem {
    setKey: string;
    stepId: string;
    box: number;
    nextReview: string; // AAAA-MM-DD
}

export const REVIEW_BOXES_TO_MASTER = 3;

export interface StepAnswer {
    setKey: string;
    stepId: string;
    correct: boolean;
}

// XP, estrellas, racha, logros... de un perfil guardado
type GamificationSnapshot = Partial<GamificationState>;

export interface ProfileData {
    id: string;
    name: string;
    mascot: string;
    cursoId: CursoId | null;
    topics: Record<string, TopicProgress>;
    lastTopicKey: string | null;
    mistakes: Record<string, MistakeItem>;
    gamification?: GamificationSnapshot;
}

export type ProfileSummary = Pick<ProfileData, 'id' | 'name' | 'mascot' | 'cursoId'>;

interface PracticeState {
    hydrated: boolean;
    activeProfileId: string;
    profiles: Record<string, ProfileData>; // perfiles no activos
    name: string;
    mascot: string;
    cursoId: CursoId | null;
    topics: Record<string, TopicProgress>;
    lastTopicKey: string | null;
    mistakes: Record<string, MistakeItem>;
    setCurso: (cursoId: CursoId | null) => void;
    setName: (name: string) => void;
    setMascot: (mascot: string) => void;
    recordTopicResult: (setKey: string, correct: number, total: number) => void;
    recordAnswers: (answers: StepAnswer[]) => void;
    addProfile: (data: { name: string; mascot: string; cursoId: CursoId | null }) => void;
    switchProfile: (id: string) => void;
    removeProfile: (id: string) => void;
}

const newId = () => `p${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

function gamificationSnapshot(): GamificationSnapshot {
    return Object.fromEntries(
        Object.entries(useGamificationStore.getState()).filter(([, v]) => typeof v !== 'function'),
    ) as GamificationSnapshot;
}

function loadGamification(snapshot?: GamificationSnapshot) {
    if (snapshot) useGamificationStore.setState(snapshot);
    else useGamificationStore.getState().resetProgress();
}

const EMPTY_PROGRESS = { topics: {}, lastTopicKey: null, mistakes: {} };

// Lista de todos los perfiles (el activo con sus datos en vivo) en orden de creación
export function listProfiles(state: Pick<PracticeState, 'activeProfileId' | 'profiles' | 'name' | 'mascot' | 'cursoId'>): ProfileSummary[] {
    const active: ProfileSummary = { id: state.activeProfileId, name: state.name, mascot: state.mascot, cursoId: state.cursoId };
    const others = Object.values(state.profiles).map(({ id, name, mascot, cursoId }) => ({ id, name, mascot, cursoId }));
    return [active, ...others].sort((a, b) => a.id.localeCompare(b.id));
}

const today = () => new Date().toISOString().split('T')[0];
export const mistakeKey = (setKey: string, stepId: string) => `${setKey}#${stepId}`;

export const usePracticeStore = create<PracticeState>()(
    persist(
        (set, get) => ({
            hydrated: false,
            activeProfileId: 'p0',
            profiles: {},
            name: '',
            mascot: 'roo',
            cursoId: null,
            topics: {},
            lastTopicKey: null,
            mistakes: {},

            setCurso: (cursoId) => set({ cursoId }),
            setName: (name) => set({ name: name.slice(0, 20) }),
            setMascot: (mascot) => set({ mascot }),

            recordTopicResult: (setKey, correct, total) =>
                set((state) => {
                    const prev = state.topics[setKey];
                    const stars = starsFor(correct, total);
                    const score = total > 0 ? Math.round((correct / total) * 100) : 0;
                    return {
                        lastTopicKey: setKey,
                        topics: {
                            ...state.topics,
                            // Repetir siempre puede mejorar la nota, nunca bajarla
                            [setKey]: {
                                stars: prev ? (Math.max(prev.stars, stars) as 1 | 2 | 3) : stars,
                                bestScore: Math.max(prev?.bestScore ?? 0, score),
                                attempts: (prev?.attempts ?? 0) + 1,
                                lastPlayedAt: new Date().toISOString(),
                            },
                        },
                    };
                }),

            recordAnswers: (answers) =>
                set((state) => {
                    const mistakes = { ...state.mistakes };
                    for (const { setKey, stepId, correct } of answers) {
                        const key = mistakeKey(setKey, stepId);
                        const item = mistakes[key];
                        if (!correct) {
                            mistakes[key] = { setKey, stepId, box: 1, nextReview: calculateNextReview(1) };
                        } else if (item) {
                            const box = item.box + 1;
                            if (box > REVIEW_BOXES_TO_MASTER) delete mistakes[key];
                            else mistakes[key] = { ...item, box, nextReview: calculateNextReview(box) };
                        }
                    }
                    return { mistakes };
                }),

            // Guarda el perfil activo y carga otro (progreso de práctica + XP, racha y logros)
            switchProfile: (id) => {
                const state = get();
                if (id === state.activeProfileId || !state.profiles[id]) return;
                const current: ProfileData = {
                    id: state.activeProfileId,
                    name: state.name,
                    mascot: state.mascot,
                    cursoId: state.cursoId,
                    topics: state.topics,
                    lastTopicKey: state.lastTopicKey,
                    mistakes: state.mistakes,
                    gamification: gamificationSnapshot(),
                };
                const target = state.profiles[id];
                const profiles = { ...state.profiles, [current.id]: current };
                delete profiles[id];
                loadGamification(target.gamification);
                set({
                    profiles,
                    activeProfileId: target.id,
                    name: target.name,
                    mascot: target.mascot,
                    cursoId: target.cursoId,
                    topics: target.topics,
                    lastTopicKey: target.lastTopicKey,
                    mistakes: target.mistakes,
                });
            },

            addProfile: ({ name, mascot, cursoId }) => {
                const id = newId();
                set((state) => ({ profiles: { ...state.profiles, [id]: { id, name: name.slice(0, 20), mascot, cursoId, ...EMPTY_PROGRESS } } }));
                get().switchProfile(id);
            },

            removeProfile: (id) => {
                const state = get();
                if (id !== state.activeProfileId) {
                    const profiles = { ...state.profiles };
                    delete profiles[id];
                    set({ profiles });
                    return;
                }
                // Borrar el perfil activo: se pasa al siguiente o se deja uno vacío
                const next = Object.keys(state.profiles)[0];
                if (next) {
                    get().switchProfile(next);
                    const profiles = { ...get().profiles };
                    delete profiles[id];
                    set({ profiles });
                } else {
                    useGamificationStore.getState().resetProgress();
                    set({ name: '', mascot: 'roo', cursoId: null, ...EMPTY_PROGRESS });
                }
            },
        }),
        {
            name: 'eduaroo-practice',
            storage: createJSONStorage(() => localStorage),
            // Se rehidrata en el cliente (PracticeStoreHydrator) para que el primer render coincida con el servidor
            skipHydration: true,
            partialize: (state) => {
                const { hydrated, ...rest } = state;
                void hydrated; // no se guarda: solo indica si ya se ha leído el navegador
                return rest;
            },
            onRehydrateStorage: () => () => usePracticeStore.setState({ hydrated: true }),
        },
    ),
);

export function getDueMistakes(mistakes: Record<string, MistakeItem>, max = 10): MistakeItem[] {
    const now = today();
    return Object.values(mistakes)
        .filter((m) => m.nextReview <= now)
        .sort((a, b) => a.nextReview.localeCompare(b.nextReview))
        .slice(0, max);
}
