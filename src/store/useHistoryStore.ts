import { create } from "zustand";
import type { Project } from "./types";

const MAX_HISTORY = 50;

interface HistoryState {
  past: Project[];
  future: Project[];
  pushState: (project: Project) => void;
  undo: (currentProject: Project) => Project | null;
  redo: (currentProject: Project) => Project | null;
  canUndo: () => boolean;
  canRedo: () => boolean;
  clear: () => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  past: [],
  future: [],

  pushState: (project) => {
    set((state) => ({
      past: [...state.past.slice(-MAX_HISTORY), structuredClone(project)],
      future: [],
    }));
  },

  undo: (currentProject) => {
    const { past } = get();
    if (past.length === 0) return null;
    const previous = past[past.length - 1];
    set((state) => ({
      past: state.past.slice(0, -1),
      future: [...state.future, structuredClone(currentProject)],
    }));
    return previous;
  },

  redo: (currentProject) => {
    const { future } = get();
    if (future.length === 0) return null;
    const next = future[future.length - 1];
    set((state) => ({
      future: state.future.slice(0, -1),
      past: [...state.past, structuredClone(currentProject)],
    }));
    return next;
  },

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,
  clear: () => set({ past: [], future: [] }),
}));
