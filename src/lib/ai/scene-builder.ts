import type { WhiteboardElement, CameraKeyframe, VideoStyle, AnimationType } from "@/store/types";
import { matchIcon } from "./icon-matcher";
import { getStyleDefinition } from "@/lib/video-styles";

interface ScriptScene {
  title: string;
  narration: string;
  visualDescriptions: string[];
  duration: number; // seconds
}

interface Script {
  title: string;
  scenes: ScriptScene[];
}

const FPS = 30;
const CANVAS_W = 1920;
const CANVAS_H = 1080;
const SCENE_WIDTH = 1800;
const SCENE_PADDING = 200;

/**
 * Convert an AI-generated script into WhiteboardElement[] with proper timing and layout.
 * Each scene is laid out horizontally across a wide canvas, with camera keyframes panning between scenes.
 * Now supports style-aware generation — colors, animations, and defaults adapt to the chosen video style.
 */
export function buildProjectFromScript(
  script: Script,
  availableIcons: string[],
  videoStyle: VideoStyle = "classic-whiteboard",
  iconSvgFetcher?: (name: string) => Promise<string>
): {
  elements: WhiteboardElement[];
  cameraKeyframes: CameraKeyframe[];
  totalFrames: number;
  canvasWidth: number;
} {
  const styleDef = getStyleDefinition(videoStyle);

  // Style-aware color scheme
  const titleColor = styleDef.defaultTextColor;
  const bodyColor = videoStyle === "neon-dark" ? "#ffffff" : videoStyle === "blackboard" ? "#f5f5f5" : "#34495e";
  const labelColor = videoStyle === "neon-dark" ? "#cccccc" : videoStyle === "blackboard" ? "#b2bec3" : "#7f8c8d";
  const narrationColor = videoStyle === "neon-dark" ? "#888888" : videoStyle === "blackboard" ? "#636e72" : "#95a5a6";
  const arrowColor = videoStyle === "neon-dark" ? "#ff00ff" : videoStyle === "blackboard" ? "#74b9ff" : "#3498db";
  const iconStrokeColor = styleDef.defaultStrokeColor;
  const defaultAnim: AnimationType = styleDef.defaultAnimation;

  const elements: WhiteboardElement[] = [];
  const cameraKeyframes: CameraKeyframe[] = [];

  let currentFrame = 0;
  let zIndex = 0;
  const canvasWidth = script.scenes.length * (SCENE_WIDTH + SCENE_PADDING);

  for (let sceneIdx = 0; sceneIdx < script.scenes.length; sceneIdx++) {
    const scene = script.scenes[sceneIdx];
    const sceneX = sceneIdx * (SCENE_WIDTH + SCENE_PADDING);
    const sceneDurationFrames = scene.duration * FPS;

    // Camera keyframe — pan to this scene
    cameraKeyframes.push({
      id: `cam-scene-${sceneIdx}`,
      frame: currentFrame,
      x: -(sceneX),
      y: 0,
      scale: 1,
      easing: sceneIdx === 0 ? "linear" : "ease-in-out",
    });

    // Scene title text
    elements.push({
      id: `scene-${sceneIdx}-title`,
      type: "text",
      position: { x: sceneX + 100, y: 60 },
      size: { width: 600, height: 80 },
      rotation: 0,
      startFrame: currentFrame,
      durationFrames: sceneDurationFrames + 60,
      animationType: defaultAnim,
      drawSpeed: 20,
      opacity: 1,
      zIndex: zIndex++,
      locked: false,
      visible: true,
      data: {
        type: "text",
        content: scene.title,
        fontFamily: "Georgia, serif",
        fontSize: 48,
        fontWeight: 700,
        color: titleColor,
        textAlign: "left",
      },
    });

    currentFrame += 15;

    // Layout visual elements in a grid within the scene
    const visuals = scene.visualDescriptions;
    const cols = Math.min(visuals.length, 3);
    const rows = Math.ceil(visuals.length / cols);
    const cellW = (SCENE_WIDTH - 200) / cols;
    const cellH = (CANVAS_H - 250) / rows;

    for (let i = 0; i < visuals.length; i++) {
      const desc = visuals[i];
      const col = i % cols;
      const row = Math.floor(i / cols);

      const elemX = sceneX + 100 + col * cellW + cellW * 0.1;
      const elemY = 160 + row * cellH + cellH * 0.05;
      const elemW = cellW * 0.8;
      const elemH = cellH * 0.6;

      // Check if this is a text description
      const isText =
        desc.toLowerCase().startsWith("text:") ||
        desc.toLowerCase().startsWith("label:") ||
        desc.toLowerCase().startsWith("title:");

      if (isText) {
        const textContent = desc.replace(/^(text|label|title):\s*/i, "");
        elements.push({
          id: `scene-${sceneIdx}-visual-${i}`,
          type: "text",
          position: { x: elemX, y: elemY + elemH * 0.3 },
          size: { width: elemW, height: elemH * 0.5 },
          rotation: 0,
          startFrame: currentFrame,
          durationFrames: sceneDurationFrames,
          animationType: defaultAnim,
          drawSpeed: 25,
          opacity: 1,
          zIndex: zIndex++,
          locked: false,
          visible: true,
          data: {
            type: "text",
            content: textContent,
            fontFamily: "Georgia, serif",
            fontSize: 36,
            fontWeight: 600,
            color: bodyColor,
            textAlign: "center",
          },
        });
      } else if (
        desc.toLowerCase().includes("arrow") ||
        desc.toLowerCase().includes("connector")
      ) {
        // Arrow/connector shape
        elements.push({
          id: `scene-${sceneIdx}-visual-${i}`,
          type: "shape",
          position: { x: elemX + elemW * 0.1, y: elemY + elemH * 0.3 },
          size: { width: elemW * 0.8, height: 60 },
          rotation: 0,
          startFrame: currentFrame,
          durationFrames: sceneDurationFrames,
          animationType: "draw",
          drawSpeed: 30,
          opacity: 1,
          zIndex: zIndex++,
          locked: false,
          visible: true,
          data: {
            type: "shape",
            shapeType: "arrow",
            strokeColor: arrowColor,
            strokeWidth: 3,
            fillColor: arrowColor,
          },
        });
      } else {
        // Icon — match to Tabler icon name
        const iconName = matchIcon(desc, availableIcons);
        elements.push({
          id: `scene-${sceneIdx}-visual-${i}`,
          type: "svg-path",
          position: { x: elemX + (elemW - 180) / 2, y: elemY },
          size: { width: 180, height: 180 },
          rotation: 0,
          startFrame: currentFrame,
          durationFrames: sceneDurationFrames,
          animationType: "draw",
          drawSpeed: 50,
          opacity: 1,
          zIndex: zIndex++,
          locked: false,
          visible: true,
          data: {
            type: "svg-path",
            paths: [], // Will be filled when icon SVG is fetched
            strokeColor: iconStrokeColor,
            strokeWidth: 3,
            fillColor: "transparent",
            fillOpacity: 0,
            viewBox: "0 0 24 24",
            // Store icon name for later fetching
            _iconName: iconName,
          } as never,
        });

        // Add label under icon
        elements.push({
          id: `scene-${sceneIdx}-label-${i}`,
          type: "text",
          position: { x: elemX, y: elemY + 190 },
          size: { width: elemW, height: 50 },
          rotation: 0,
          startFrame: currentFrame + 20,
          durationFrames: sceneDurationFrames,
          animationType: defaultAnim,
          drawSpeed: 15,
          opacity: 1,
          zIndex: zIndex++,
          locked: false,
          visible: true,
          data: {
            type: "text",
            content: desc.replace(/icon$/i, "").trim(),
            fontFamily: "Georgia, serif",
            fontSize: 24,
            fontWeight: 400,
            color: labelColor,
            textAlign: "center",
          },
        });
      }

      currentFrame += 30; // Stagger elements
    }

    // Add narration text at bottom of scene
    elements.push({
      id: `scene-${sceneIdx}-narration`,
      type: "text",
      position: { x: sceneX + 100, y: CANVAS_H - 150 },
      size: { width: SCENE_WIDTH - 200, height: 100 },
      rotation: 0,
      startFrame: currentFrame - 15,
      durationFrames: sceneDurationFrames,
      animationType: defaultAnim,
      drawSpeed: 20,
      opacity: 0.6,
      zIndex: zIndex++,
      locked: false,
      visible: true,
      data: {
        type: "text",
        content: scene.narration,
        fontFamily: "Georgia, serif",
        fontSize: 20,
        fontWeight: 400,
        color: narrationColor,
        textAlign: "center",
      },
    });

    // Add gap between scenes
    currentFrame += 45;
  }

  return {
    elements,
    cameraKeyframes,
    totalFrames: currentFrame + 90, // Extra frames at end
    canvasWidth,
  };
}
