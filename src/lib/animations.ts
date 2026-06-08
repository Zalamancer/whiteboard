import { interpolate, spring, Easing } from "remotion";
import type { AnimationType } from "@/store/types";

/**
 * Computes animation properties for an element based on its animation type.
 * Returns opacity, transform, and clipPath values to apply to the element wrapper.
 */
export function computeAnimation(
  animationType: AnimationType,
  localFrame: number,
  drawSpeed: number,
  baseOpacity: number,
  fps: number = 30
): {
  opacity: number;
  transform: string;
  clipPath?: string;
  /** For typewriter: fraction of text to show (0-1) */
  textRevealProgress?: number;
} {
  switch (animationType) {
    case "draw":
      // Handled specially by each element renderer (SVG path animation)
      return { opacity: baseOpacity, transform: "none" };

    case "fade-in": {
      const opacity = interpolate(localFrame, [0, drawSpeed], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      return { opacity, transform: "none" };
    }

    case "slide-in-left": {
      const progress = interpolate(localFrame, [0, drawSpeed], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      });
      const translateX = interpolate(progress, [0, 1], [-200, 0]);
      const opacity = interpolate(localFrame, [0, Math.min(drawSpeed * 0.3, 10)], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      return { opacity, transform: `translateX(${translateX}px)` };
    }

    case "slide-in-right": {
      const progress = interpolate(localFrame, [0, drawSpeed], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      });
      const translateX = interpolate(progress, [0, 1], [200, 0]);
      const opacity = interpolate(localFrame, [0, Math.min(drawSpeed * 0.3, 10)], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      return { opacity, transform: `translateX(${translateX}px)` };
    }

    case "slide-in-bottom": {
      const progress = interpolate(localFrame, [0, drawSpeed], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      });
      const translateY = interpolate(progress, [0, 1], [150, 0]);
      const opacity = interpolate(localFrame, [0, Math.min(drawSpeed * 0.3, 10)], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      return { opacity, transform: `translateY(${translateY}px)` };
    }

    case "pop": {
      // Spring bounce: scale 0 → 1.1 → 1.0
      const spr = spring({
        frame: localFrame,
        fps,
        config: {
          damping: 10,
          stiffness: 150,
          mass: 0.6,
        },
      });
      const scale = interpolate(spr, [0, 1], [0, 1]);
      const opacity = interpolate(localFrame, [0, 3], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      return { opacity, transform: `scale(${scale})` };
    }

    case "typewriter": {
      const progress = interpolate(localFrame, [0, drawSpeed], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      return {
        opacity: baseOpacity,
        transform: "none",
        textRevealProgress: progress,
      };
    }

    case "wipe-left": {
      const progress = interpolate(localFrame, [0, drawSpeed], [0, 100], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.cubic),
      });
      return {
        opacity: baseOpacity,
        transform: "none",
        clipPath: `inset(0 ${100 - progress}% 0 0)`,
      };
    }

    case "stamp": {
      // Quick scale from 1.5 → 1.0 with opacity 0 → 1
      const duration = Math.min(drawSpeed, 15);
      const progress = interpolate(localFrame, [0, duration], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.exp),
      });
      const scale = interpolate(progress, [0, 1], [1.5, 1]);
      const opacity = interpolate(progress, [0, 0.3, 1], [0, 1, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      return { opacity, transform: `scale(${scale})` };
    }

    case "none":
    default:
      return { opacity: baseOpacity, transform: "none" };
  }
}

/**
 * Animation type metadata for the UI picker
 */
export const ANIMATION_TYPES: {
  value: AnimationType;
  label: string;
  description: string;
  category: "reveal" | "motion" | "special";
}[] = [
  { value: "draw", label: "Draw", description: "Hand-drawn stroke animation", category: "reveal" },
  { value: "fade-in", label: "Fade In", description: "Smooth opacity fade", category: "reveal" },
  { value: "wipe-left", label: "Wipe Left", description: "Reveal with left-to-right wipe", category: "reveal" },
  { value: "slide-in-left", label: "Slide Left", description: "Slide in from the left", category: "motion" },
  { value: "slide-in-right", label: "Slide Right", description: "Slide in from the right", category: "motion" },
  { value: "slide-in-bottom", label: "Slide Up", description: "Slide up from below", category: "motion" },
  { value: "pop", label: "Pop", description: "Spring bounce scale effect", category: "motion" },
  { value: "stamp", label: "Stamp", description: "Quick stamp-down effect", category: "motion" },
  { value: "typewriter", label: "Typewriter", description: "Characters appear one by one (text only)", category: "special" },
  { value: "none", label: "None", description: "Appear instantly", category: "special" },
];
