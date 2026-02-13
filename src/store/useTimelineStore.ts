import { create } from "zustand";

interface TimelineState {
  pixelsPerFrame: number;
  scrollLeft: number;
  scrollTop: number;
  snapToGrid: boolean;
  snapInterval: number;

  setZoom: (ppf: number) => void;
  setScroll: (left: number, top: number) => void;
  setSnapToGrid: (snap: boolean) => void;
}

export const useTimelineStore = create<TimelineState>((set) => ({
  pixelsPerFrame: 3,
  scrollLeft: 0,
  scrollTop: 0,
  snapToGrid: true,
  snapInterval: 1,

  setZoom: (ppf) => set({ pixelsPerFrame: Math.max(0.5, Math.min(20, ppf)) }),
  setScroll: (left, top) => set({ scrollLeft: left, scrollTop: top }),
  setSnapToGrid: (snap) => set({ snapToGrid: snap }),
}));
