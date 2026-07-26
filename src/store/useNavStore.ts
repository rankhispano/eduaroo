'use client';

import { create } from 'zustand';

interface NavStore {
  cursoActivo: string | null;
  asignaturaActiva: string | null;
  setCurso: (curso: string) => void;
  setAsignatura: (asig: string) => void;
  reset: () => void;
}

export const useNavStore = create<NavStore>((set) => ({
  cursoActivo: null,
  asignaturaActiva: null,
  setCurso: (curso) => set({ cursoActivo: curso, asignaturaActiva: null }),
  setAsignatura: (asig) => set({ asignaturaActiva: asig }),
  reset: () => set({ cursoActivo: null, asignaturaActiva: null }),
}));
