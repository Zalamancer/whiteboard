import { interpolate } from "remotion";
import { evolvePath, getLength, getPointAtLength, getTangentAtLength } from "@remotion/paths";

export function getDrawProgress(
  frame: number,
  startFrame: number,
  drawSpeed: number
): number {
  const localFrame = frame - startFrame;
  return interpolate(localFrame, [0, drawSpeed], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export function getEvolvedPath(progress: number, path: string) {
  return evolvePath(progress, path);
}

export function getPointAtProgress(
  path: string,
  progress: number
): { x: number; y: number } {
  const length = getLength(path);
  const point = getPointAtLength(path, length * progress);
  return { x: point.x, y: point.y };
}

export function getTangentAtProgress(
  path: string,
  progress: number
): number {
  const length = getLength(path);
  const clampedLength = Math.min(Math.max(length * progress, 0.001), length - 0.001);
  const tangent = getTangentAtLength(path, clampedLength);
  return Math.atan2(tangent.y, tangent.x) * (180 / Math.PI);
}
