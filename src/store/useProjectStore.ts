import { create } from "zustand";
import type { Project, WhiteboardElement, AudioTrack, CameraKeyframe } from "./types";

function createDemoElements(): WhiteboardElement[] {
  return [
    {
      id: "demo-lightbulb",
      type: "svg-path",
      position: { x: 200, y: 200 },
      size: { width: 300, height: 400 },
      rotation: 0,
      startFrame: 0,
      durationFrames: 180,
      animationType: "draw",
      drawSpeed: 60,
      opacity: 1,
      zIndex: 0,
      locked: false,
      visible: true,
      data: {
        type: "svg-path",
        paths: [
          "M 150 40 C 80 40 30 100 30 160 C 30 220 80 260 100 290 L 100 330 L 200 330 L 200 290 C 220 260 270 220 270 160 C 270 100 220 40 150 40 Z",
          "M 100 340 L 200 340 L 200 360 L 100 360 Z",
          "M 110 370 L 190 370 L 190 390 L 110 390 Z",
          "M 130 400 L 170 400 L 160 420 L 140 420 Z",
          "M 150 100 L 150 180",
          "M 110 140 L 150 180 L 190 140",
        ],
        strokeColor: "#333333",
        strokeWidth: 4,
        fillColor: "#FFD700",
        fillOpacity: 0.3,
        viewBox: "0 0 300 430",
      },
    },
    {
      id: "demo-star",
      type: "shape",
      position: { x: 700, y: 250 },
      size: { width: 250, height: 250 },
      rotation: 0,
      startFrame: 70,
      durationFrames: 180,
      animationType: "draw",
      drawSpeed: 50,
      opacity: 1,
      zIndex: 1,
      locked: false,
      visible: true,
      data: {
        type: "shape",
        shapeType: "star",
        strokeColor: "#e74c3c",
        strokeWidth: 4,
        fillColor: "#e74c3c",
      },
    },
    {
      id: "demo-text",
      type: "text",
      position: { x: 1100, y: 300 },
      size: { width: 500, height: 200 },
      rotation: 0,
      startFrame: 130,
      durationFrames: 180,
      animationType: "fade-in",
      drawSpeed: 30,
      opacity: 1,
      zIndex: 2,
      locked: false,
      visible: true,
      data: {
        type: "text",
        content: "Whiteboard\nStudio",
        fontFamily: "Georgia, serif",
        fontSize: 72,
        fontWeight: 700,
        color: "#2c3e50",
        textAlign: "center",
      },
    },
    {
      id: "demo-arrow",
      type: "shape",
      position: { x: 520, y: 380 },
      size: { width: 160, height: 60 },
      rotation: 0,
      startFrame: 100,
      durationFrames: 180,
      animationType: "draw",
      drawSpeed: 30,
      opacity: 1,
      zIndex: 3,
      locked: false,
      visible: true,
      data: {
        type: "shape",
        shapeType: "arrow",
        strokeColor: "#3498db",
        strokeWidth: 3,
        fillColor: "#3498db",
      },
    },
    {
      id: "demo-circle",
      type: "shape",
      position: { x: 1200, y: 600 },
      size: { width: 200, height: 200 },
      rotation: 0,
      startFrame: 170,
      durationFrames: 180,
      animationType: "draw",
      drawSpeed: 45,
      opacity: 1,
      zIndex: 4,
      locked: false,
      visible: true,
      data: {
        type: "shape",
        shapeType: "circle",
        strokeColor: "#27ae60",
        strokeWidth: 4,
        fillColor: "#27ae60",
      },
    },
  ];
}

function createDefaultProject(): Project {
  return {
    id: "default",
    name: "Untitled Project",
    width: 1920,
    height: 1080,
    fps: 30,
    backgroundColor: "#FFFFFF",
    elements: createDemoElements(),
    cameraKeyframes: [],
    audioTracks: [],
  };
}

interface ProjectState {
  project: Project;
  setProject: (project: Project) => void;
  updateProject: (patch: Partial<Project>) => void;
  addElement: (element: WhiteboardElement) => void;
  updateElement: (id: string, patch: Partial<WhiteboardElement>) => void;
  removeElement: (id: string) => void;
  duplicateElement: (id: string) => WhiteboardElement | null;
  reorderElement: (id: string, newZIndex: number) => void;
  addAudioTrack: (track: AudioTrack) => void;
  updateAudioTrack: (id: string, patch: Partial<AudioTrack>) => void;
  removeAudioTrack: (id: string) => void;
  addCameraKeyframe: (keyframe: CameraKeyframe) => void;
  updateCameraKeyframe: (id: string, patch: Partial<CameraKeyframe>) => void;
  removeCameraKeyframe: (id: string) => void;
  getTotalDuration: () => number;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  project: createDefaultProject(),

  setProject: (project) => set({ project }),

  updateProject: (patch) =>
    set((state) => ({
      project: { ...state.project, ...patch },
    })),

  addElement: (element) =>
    set((state) => ({
      project: {
        ...state.project,
        elements: [...state.project.elements, element],
      },
    })),

  updateElement: (id, patch) =>
    set((state) => ({
      project: {
        ...state.project,
        elements: state.project.elements.map((el) =>
          el.id === id ? { ...el, ...patch } : el
        ),
      },
    })),

  removeElement: (id) =>
    set((state) => ({
      project: {
        ...state.project,
        elements: state.project.elements.filter((el) => el.id !== id),
      },
    })),

  duplicateElement: (id) => {
    const state = get();
    const source = state.project.elements.find((el) => el.id === id);
    if (!source) return null;
    const clone: WhiteboardElement = {
      ...source,
      id: crypto.randomUUID(),
      position: { x: source.position.x + 20, y: source.position.y + 20 },
      zIndex: state.project.elements.length,
    };
    set((s) => ({
      project: {
        ...s.project,
        elements: [...s.project.elements, clone],
      },
    }));
    return clone;
  },

  reorderElement: (id, newZIndex) =>
    set((state) => ({
      project: {
        ...state.project,
        elements: state.project.elements.map((el) =>
          el.id === id ? { ...el, zIndex: newZIndex } : el
        ),
      },
    })),

  addAudioTrack: (track) =>
    set((state) => ({
      project: {
        ...state.project,
        audioTracks: [...state.project.audioTracks, track],
      },
    })),

  updateAudioTrack: (id, patch) =>
    set((state) => ({
      project: {
        ...state.project,
        audioTracks: state.project.audioTracks.map((t) =>
          t.id === id ? { ...t, ...patch } : t
        ),
      },
    })),

  removeAudioTrack: (id) =>
    set((state) => ({
      project: {
        ...state.project,
        audioTracks: state.project.audioTracks.filter((t) => t.id !== id),
      },
    })),

  addCameraKeyframe: (keyframe) =>
    set((state) => ({
      project: {
        ...state.project,
        cameraKeyframes: [...state.project.cameraKeyframes, keyframe].sort(
          (a, b) => a.frame - b.frame
        ),
      },
    })),

  updateCameraKeyframe: (id, patch) =>
    set((state) => ({
      project: {
        ...state.project,
        cameraKeyframes: state.project.cameraKeyframes
          .map((k) => (k.id === id ? { ...k, ...patch } : k))
          .sort((a, b) => a.frame - b.frame),
      },
    })),

  removeCameraKeyframe: (id) =>
    set((state) => ({
      project: {
        ...state.project,
        cameraKeyframes: state.project.cameraKeyframes.filter(
          (k) => k.id !== id
        ),
      },
    })),

  getTotalDuration: () => {
    const { project } = get();
    const elementMax = project.elements.reduce(
      (max, el) => Math.max(max, el.startFrame + el.durationFrames),
      0
    );
    const audioMax = project.audioTracks.reduce(
      (max, t) => Math.max(max, t.startFrame + t.durationFrames),
      0
    );
    return Math.max(elementMax, audioMax, 300);
  },
}));
