import { create } from "zustand";

export type ActiveTool = "select" | "pan" | "text" | "shape";

interface EditorState {
  selectedElementIds: string[];
  activeTool: ActiveTool;
  canvasZoom: number;
  canvasOffset: { x: number; y: number };
  isPlaying: boolean;
  currentFrame: number;
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;

  selectElement: (id: string, multi?: boolean) => void;
  clearSelection: () => void;
  setTool: (tool: ActiveTool) => void;
  setCurrentFrame: (frame: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setCanvasZoom: (zoom: number) => void;
  setCanvasOffset: (offset: { x: number; y: number }) => void;
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  selectedElementIds: [],
  activeTool: "select",
  canvasZoom: 1,
  canvasOffset: { x: 0, y: 0 },
  isPlaying: false,
  currentFrame: 0,
  leftSidebarOpen: true,
  rightSidebarOpen: true,

  selectElement: (id, multi) =>
    set((state) => {
      if (multi) {
        const already = state.selectedElementIds.includes(id);
        return {
          selectedElementIds: already
            ? state.selectedElementIds.filter((eid) => eid !== id)
            : [...state.selectedElementIds, id],
        };
      }
      return { selectedElementIds: [id] };
    }),

  clearSelection: () => set({ selectedElementIds: [] }),
  setTool: (tool) => set({ activeTool: tool }),
  setCurrentFrame: (frame) => set({ currentFrame: frame }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setCanvasZoom: (zoom) => set({ canvasZoom: Math.max(0.1, Math.min(3, zoom)) }),
  setCanvasOffset: (offset) => set({ canvasOffset: offset }),
  toggleLeftSidebar: () =>
    set((state) => ({ leftSidebarOpen: !state.leftSidebarOpen })),
  toggleRightSidebar: () =>
    set((state) => ({ rightSidebarOpen: !state.rightSidebarOpen })),
}));
