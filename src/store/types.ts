export type ElementType = "svg-path" | "text" | "image" | "shape";
export type AnimationType =
  | "draw"
  | "fade-in"
  | "none"
  | "slide-in-left"
  | "slide-in-right"
  | "slide-in-bottom"
  | "pop"
  | "typewriter"
  | "wipe-left"
  | "stamp";
export type EasingType =
  | "linear"
  | "ease-in"
  | "ease-out"
  | "ease-in-out"
  | "spring";
export type AudioTrackType = "background" | "voiceover" | "sfx";

export type VideoStyle =
  | "classic-whiteboard"
  | "blackboard"
  | "colorful-flat"
  | "sketch-notebook"
  | "neon-dark"
  | "corporate-clean";

export type AspectRatio = "16:9" | "9:16" | "1:1" | "4:3";

export interface SVGPathData {
  type: "svg-path";
  paths: string[];
  strokeColor: string;
  strokeWidth: number;
  fillColor: string;
  fillOpacity: number;
  viewBox: string;
}

export interface TextData {
  type: "text";
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  textAlign: "left" | "center" | "right";
  generatedPaths?: string[];
}

export interface ImageData {
  type: "image";
  src: string;
  outlinePath?: string;
  objectFit: "contain" | "cover" | "fill";
}

export interface ShapeData {
  type: "shape";
  shapeType: "rect" | "circle" | "ellipse" | "arrow" | "line" | "star";
  strokeColor: string;
  strokeWidth: number;
  fillColor: string;
  cornerRadius?: number;
  generatedPath?: string;
}

export type ElementData = SVGPathData | TextData | ImageData | ShapeData;

export interface WhiteboardElement {
  id: string;
  type: ElementType;
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation: number;
  startFrame: number;
  durationFrames: number;
  animationType: AnimationType;
  drawSpeed: number;
  opacity: number;
  zIndex: number;
  locked: boolean;
  visible: boolean;
  data: ElementData;
}

export interface CameraKeyframe {
  id: string;
  frame: number;
  x: number;
  y: number;
  scale: number;
  easing: EasingType;
}

export interface AudioTrack {
  id: string;
  type: AudioTrackType;
  name: string;
  src: string;
  startFrame: number;
  durationFrames: number;
  volume: number;
  fadeInFrames: number;
  fadeOutFrames: number;
}

export interface Project {
  id: string;
  name: string;
  width: number;
  height: number;
  fps: number;
  backgroundColor: string;
  videoStyle: VideoStyle;
  aspectRatio: AspectRatio;
  elements: WhiteboardElement[];
  cameraKeyframes: CameraKeyframe[];
  audioTracks: AudioTrack[];
}
