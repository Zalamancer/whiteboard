import type { WhiteboardElement } from "@/store/types";
import { getDrawProgress, getPointAtProgress, getTangentAtProgress } from "./drawAnimation";

export interface HandState {
  x: number;
  y: number;
  rotation: number;
  visible: boolean;
}

export function getHandPosition(
  elements: WhiteboardElement[],
  frame: number
): HandState {
  const drawingElements = elements
    .filter(
      (el) =>
        el.visible &&
        el.animationType === "draw" &&
        frame >= el.startFrame &&
        frame < el.startFrame + el.drawSpeed
    )
    .sort((a, b) => b.zIndex - a.zIndex);

  if (drawingElements.length === 0) {
    return { x: 0, y: 0, rotation: 0, visible: false };
  }

  const el = drawingElements[0];
  const progress = getDrawProgress(frame, el.startFrame, el.drawSpeed);

  // For image elements, the hand traces a scanning pattern across the image
  if (el.data.type === "image") {
    return getImageHandPosition(el, progress);
  }

  let primaryPath: string | null = null;
  if (el.data.type === "svg-path" && el.data.paths.length > 0) {
    primaryPath = el.data.paths[0];
  } else if (el.data.type === "text" && el.data.generatedPaths?.length) {
    primaryPath = el.data.generatedPaths[0];
  } else if (el.data.type === "shape" && el.data.generatedPath) {
    primaryPath = el.data.generatedPath;
  }

  if (!primaryPath) {
    return { x: el.position.x, y: el.position.y, rotation: 0, visible: true };
  }

  try {
    const point = getPointAtProgress(primaryPath, progress);
    const angle = getTangentAtProgress(primaryPath, progress);

    // Scale point from SVG viewBox to element size on canvas
    const scaleX = el.size.width / getSVGViewBoxWidth(el);
    const scaleY = el.size.height / getSVGViewBoxHeight(el);

    return {
      x: el.position.x + point.x * scaleX,
      y: el.position.y + point.y * scaleY,
      rotation: angle,
      visible: true,
    };
  } catch {
    return { x: el.position.x, y: el.position.y, rotation: 0, visible: true };
  }
}

/**
 * For image elements, the hand follows the same serpentine scan path
 * as the SVG mask in ImageElement.tsx — the hand "colors in" the image
 * row by row, left-right then right-left, like a marker.
 */
function getImageHandPosition(
  el: WhiteboardElement,
  progress: number
): HandState {
  const rows = 12; // Must match ImageElement rows
  const w = el.size.width;
  const h = el.size.height;
  const rowH = h / rows;

  // Total path length: rows * (width+20) for overshoot + (rows-1) * rowH for vertical drops
  const totalLength = rows * (w + 20) + (rows - 1) * rowH;
  const currentDist = progress * totalLength;

  // Walk along the serpentine path to find the current position
  let remaining = currentDist;

  for (let i = 0; i < rows; i++) {
    const y = rowH * i + rowH / 2;

    // Horizontal segment for this row
    if (remaining <= w) {
      const frac = remaining / w;
      let x: number;
      let rotation: number;

      if (i % 2 === 0) {
        // Left to right
        x = w * frac;
        rotation = 0;
      } else {
        // Right to left
        x = w * (1 - frac);
        rotation = 180;
      }

      return {
        x: el.position.x + x,
        y: el.position.y + y,
        rotation,
        visible: true,
      };
    }

    remaining -= w;

    // Vertical drop to next row
    if (i < rows - 1) {
      if (remaining <= rowH) {
        const frac = remaining / rowH;
        const nextY = rowH * (i + 1) + rowH / 2;
        const yPos = y + (nextY - y) * frac;
        const xPos = i % 2 === 0 ? w : 0;

        return {
          x: el.position.x + xPos,
          y: el.position.y + yPos,
          rotation: 90,
          visible: true,
        };
      }
      remaining -= rowH;
    }
  }

  // Fallback: end of path
  const lastY = rowH * (rows - 1) + rowH / 2;
  return {
    x: el.position.x + ((rows - 1) % 2 === 0 ? w : 0),
    y: el.position.y + lastY,
    rotation: 0,
    visible: true,
  };
}

function getSVGViewBoxWidth(el: WhiteboardElement): number {
  if (el.data.type === "svg-path" && el.data.viewBox) {
    const parts = el.data.viewBox.split(/\s+/);
    return parseFloat(parts[2]) || el.size.width;
  }
  return el.size.width;
}

function getSVGViewBoxHeight(el: WhiteboardElement): number {
  if (el.data.type === "svg-path" && el.data.viewBox) {
    const parts = el.data.viewBox.split(/\s+/);
    return parseFloat(parts[3]) || el.size.height;
  }
  return el.size.height;
}
