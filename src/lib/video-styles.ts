import type { VideoStyle, AspectRatio } from "@/store/types";

export interface VideoStyleDefinition {
  id: VideoStyle;
  name: string;
  description: string;
  /** Default background color for the canvas */
  backgroundColor: string;
  /** SVG filter ID applied to stroke elements (or null for clean rendering) */
  svgFilterId: string | null;
  /** Default stroke color for new elements */
  defaultStrokeColor: string;
  /** Default text color */
  defaultTextColor: string;
  /** Default fill color for shapes */
  defaultFillColor: string;
  /** Whether to show the animated hand cursor */
  showHand: boolean;
  /** Hand variant: pen, chalk, pencil */
  handVariant: "pen" | "chalk" | "pencil";
  /** Default animation type for new elements */
  defaultAnimation: "draw" | "fade-in" | "none";
  /** Whether to apply a glow effect on strokes (neon style) */
  glowEffect: boolean;
  /** Stroke roughness: 0 = clean, 1 = slight wobble, 2 = chalk rough */
  strokeRoughness: 0 | 1 | 2;
  /** Background pattern type */
  backgroundPattern: "none" | "paper" | "chalkboard" | "lined" | "grid" | "dots";
  /** Thumbnail colors for the style picker [bg, stroke, accent] */
  thumbnailColors: [string, string, string];
}

export const VIDEO_STYLES: Record<VideoStyle, VideoStyleDefinition> = {
  "classic-whiteboard": {
    id: "classic-whiteboard",
    name: "Classic Whiteboard",
    description: "Clean white background with hand-drawn pen animation",
    backgroundColor: "#FFFFFF",
    svgFilterId: null,
    defaultStrokeColor: "#333333",
    defaultTextColor: "#2c3e50",
    defaultFillColor: "#333333",
    showHand: true,
    handVariant: "pen",
    defaultAnimation: "draw",
    glowEffect: false,
    strokeRoughness: 0,
    backgroundPattern: "paper",
    thumbnailColors: ["#FFFFFF", "#333333", "#3498db"],
  },
  blackboard: {
    id: "blackboard",
    name: "Blackboard",
    description: "Dark chalkboard with chalk-style drawing",
    backgroundColor: "#2d3436",
    svgFilterId: "chalk-texture",
    defaultStrokeColor: "#FFFFFF",
    defaultTextColor: "#f5f5f5",
    defaultFillColor: "#FFFFFF",
    showHand: true,
    handVariant: "chalk",
    defaultAnimation: "draw",
    glowEffect: false,
    strokeRoughness: 2,
    backgroundPattern: "chalkboard",
    thumbnailColors: ["#2d3436", "#FFFFFF", "#74b9ff"],
  },
  "colorful-flat": {
    id: "colorful-flat",
    name: "Colorful Flat",
    description: "Modern flat design with bold colors and smooth animations",
    backgroundColor: "#f8f9fa",
    svgFilterId: null,
    defaultStrokeColor: "#2d3436",
    defaultTextColor: "#2d3436",
    defaultFillColor: "#6c5ce7",
    showHand: false,
    handVariant: "pen",
    defaultAnimation: "fade-in",
    glowEffect: false,
    strokeRoughness: 0,
    backgroundPattern: "none",
    thumbnailColors: ["#f8f9fa", "#6c5ce7", "#00cec9"],
  },
  "sketch-notebook": {
    id: "sketch-notebook",
    name: "Sketch Notebook",
    description: "Lined notebook paper with pencil-style sketching",
    backgroundColor: "#faf3e0",
    svgFilterId: "pencil-texture",
    defaultStrokeColor: "#5d4e37",
    defaultTextColor: "#3d3425",
    defaultFillColor: "#5d4e37",
    showHand: true,
    handVariant: "pencil",
    defaultAnimation: "draw",
    glowEffect: false,
    strokeRoughness: 1,
    backgroundPattern: "lined",
    thumbnailColors: ["#faf3e0", "#5d4e37", "#e17055"],
  },
  "neon-dark": {
    id: "neon-dark",
    name: "Neon Dark",
    description: "Dark background with glowing neon-colored strokes",
    backgroundColor: "#0a0a0a",
    svgFilterId: "neon-glow",
    defaultStrokeColor: "#00ff88",
    defaultTextColor: "#ffffff",
    defaultFillColor: "#00ff88",
    showHand: false,
    handVariant: "pen",
    defaultAnimation: "draw",
    glowEffect: true,
    strokeRoughness: 0,
    backgroundPattern: "dots",
    thumbnailColors: ["#0a0a0a", "#00ff88", "#ff00ff"],
  },
  "corporate-clean": {
    id: "corporate-clean",
    name: "Corporate Clean",
    description: "Professional white layout with subtle grid and clean icons",
    backgroundColor: "#FFFFFF",
    svgFilterId: null,
    defaultStrokeColor: "#1a1a2e",
    defaultTextColor: "#1a1a2e",
    defaultFillColor: "#4a6cf7",
    showHand: false,
    handVariant: "pen",
    defaultAnimation: "fade-in",
    glowEffect: false,
    strokeRoughness: 0,
    backgroundPattern: "grid",
    thumbnailColors: ["#FFFFFF", "#1a1a2e", "#4a6cf7"],
  },
};

export const ASPECT_RATIOS: Record<AspectRatio, { width: number; height: number; label: string }> = {
  "16:9": { width: 1920, height: 1080, label: "Landscape (16:9)" },
  "9:16": { width: 1080, height: 1920, label: "Vertical (9:16)" },
  "1:1": { width: 1080, height: 1080, label: "Square (1:1)" },
  "4:3": { width: 1440, height: 1080, label: "Classic (4:3)" },
};

export function getStyleDefinition(style: VideoStyle): VideoStyleDefinition {
  return VIDEO_STYLES[style] || VIDEO_STYLES["classic-whiteboard"];
}

export function getAspectDimensions(ratio: AspectRatio): { width: number; height: number } {
  const def = ASPECT_RATIOS[ratio];
  return { width: def.width, height: def.height };
}
