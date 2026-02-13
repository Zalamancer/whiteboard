import { interpolate, Easing } from "remotion";
import type { CameraKeyframe, EasingType } from "@/store/types";

export interface CameraTransform {
  x: number;
  y: number;
  scale: number;
}

function easingToFunction(easing: EasingType) {
  switch (easing) {
    case "linear":
      return Easing.linear;
    case "ease-in":
      return Easing.in(Easing.cubic);
    case "ease-out":
      return Easing.out(Easing.cubic);
    case "ease-in-out":
      return Easing.inOut(Easing.cubic);
    case "spring":
      return Easing.bezier(0.25, 0.1, 0.25, 1);
    default:
      return Easing.inOut(Easing.cubic);
  }
}

export function getCameraTransformAtFrame(
  keyframes: CameraKeyframe[],
  frame: number
): CameraTransform {
  if (keyframes.length === 0) {
    return { x: 0, y: 0, scale: 1 };
  }

  const sorted = [...keyframes].sort((a, b) => a.frame - b.frame);

  // Before first keyframe
  if (frame <= sorted[0].frame) {
    return { x: sorted[0].x, y: sorted[0].y, scale: sorted[0].scale };
  }

  // After last keyframe
  if (frame >= sorted[sorted.length - 1].frame) {
    const last = sorted[sorted.length - 1];
    return { x: last.x, y: last.y, scale: last.scale };
  }

  // Find surrounding keyframes
  let prev = sorted[0];
  let next = sorted[1];
  for (let i = 0; i < sorted.length - 1; i++) {
    if (frame >= sorted[i].frame && frame < sorted[i + 1].frame) {
      prev = sorted[i];
      next = sorted[i + 1];
      break;
    }
  }

  const easing = easingToFunction(next.easing);

  const x = interpolate(frame, [prev.frame, next.frame], [prev.x, next.x], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const y = interpolate(frame, [prev.frame, next.frame], [prev.y, next.y], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scale = interpolate(
    frame,
    [prev.frame, next.frame],
    [prev.scale, next.scale],
    {
      easing,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return { x, y, scale };
}
