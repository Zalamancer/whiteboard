import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import type { WhiteboardElement } from "@/store/types";
import { getHandPosition } from "./animations/handFollower";

interface Props {
  elements: WhiteboardElement[];
  handVariant?: "pen" | "chalk" | "pencil";
}

export const Hand: React.FC<Props> = React.memo(({ elements, handVariant = "pen" }) => {
  const frame = useCurrentFrame();
  const handState = getHandPosition(elements, frame);

  if (!handState.visible) return null;

  const activeElement = elements.find(
    (el) =>
      el.visible &&
      el.animationType === "draw" &&
      frame >= el.startFrame &&
      frame < el.startFrame + el.drawSpeed
  );

  if (!activeElement) return null;

  const localFrame = frame - activeElement.startFrame;
  const fadeIn = interpolate(localFrame, [0, 3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    localFrame,
    [activeElement.drawSpeed - 3, activeElement.drawSpeed],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const handOpacity = Math.min(fadeIn, fadeOut);

  return (
    <div
      style={{
        position: "absolute",
        left: handState.x - 10,
        top: handState.y - 30,
        width: 60,
        height: 60,
        transform: `rotate(${handState.rotation + 30}deg)`,
        transformOrigin: "10px 30px",
        opacity: handOpacity,
        pointerEvents: "none",
        zIndex: 10000,
      }}
    >
      {handVariant === "pen" && <PenHand />}
      {handVariant === "chalk" && <ChalkHand />}
      {handVariant === "pencil" && <PencilHand />}
    </div>
  );
});

Hand.displayName = "Hand";

/** Original pen hand SVG */
function PenHand() {
  return (
    <svg viewBox="0 0 60 60" width="60" height="60">
      {/* Pen tip */}
      <line x1="10" y1="30" x2="2" y2="42" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
      {/* Pen body */}
      <rect x="8" y="20" width="6" height="22" rx="1.5" fill="#2563eb" stroke="#1d4ed8" strokeWidth="0.5" />
      {/* Hand */}
      <ellipse cx="28" cy="26" rx="16" ry="12" fill="#f5d0a9" stroke="#d4a574" strokeWidth="0.5" />
      {/* Thumb */}
      <ellipse cx="14" cy="22" rx="5" ry="4" fill="#f5d0a9" stroke="#d4a574" strokeWidth="0.5" transform="rotate(-20 14 22)" />
      {/* Fingers gripping */}
      <ellipse cx="16" cy="18" rx="4" ry="3.5" fill="#f5d0a9" stroke="#d4a574" strokeWidth="0.5" transform="rotate(-10 16 18)" />
      <ellipse cx="20" cy="16" rx="4" ry="3" fill="#f5d0a9" stroke="#d4a574" strokeWidth="0.5" />
    </svg>
  );
}

/** Chalk hand — holding a small chalk stick, lighter colors */
function ChalkHand() {
  return (
    <svg viewBox="0 0 60 60" width="60" height="60">
      {/* Chalk tip — rounded, white */}
      <rect x="6" y="28" width="8" height="16" rx="3" fill="#f0f0f0" stroke="#ccc" strokeWidth="0.5" />
      {/* Chalk dust at tip */}
      <circle cx="10" cy="44" r="2" fill="rgba(255,255,255,0.4)" />
      {/* Hand */}
      <ellipse cx="28" cy="26" rx="16" ry="12" fill="#f5d0a9" stroke="#d4a574" strokeWidth="0.5" />
      {/* Thumb wrapping chalk */}
      <ellipse cx="14" cy="24" rx="5" ry="4" fill="#f5d0a9" stroke="#d4a574" strokeWidth="0.5" transform="rotate(-15 14 24)" />
      {/* Fingers */}
      <ellipse cx="16" cy="19" rx="4" ry="3.5" fill="#f5d0a9" stroke="#d4a574" strokeWidth="0.5" transform="rotate(-10 16 19)" />
      <ellipse cx="20" cy="17" rx="4" ry="3" fill="#f5d0a9" stroke="#d4a574" strokeWidth="0.5" />
    </svg>
  );
}

/** Pencil hand — holding a yellow pencil */
function PencilHand() {
  return (
    <svg viewBox="0 0 60 60" width="60" height="60">
      {/* Pencil tip (graphite) */}
      <polygon points="10,42 7,36 13,36" fill="#4a4a4a" />
      {/* Pencil wood */}
      <polygon points="7,36 5,28 15,28 13,36" fill="#d4a55a" stroke="#b8913e" strokeWidth="0.3" />
      {/* Pencil body */}
      <rect x="5" y="16" width="10" height="12" rx="0.5" fill="#ffd93d" stroke="#e6b800" strokeWidth="0.5" />
      {/* Pencil eraser band */}
      <rect x="5" y="14" width="10" height="3" rx="0.5" fill="#c0c0c0" stroke="#999" strokeWidth="0.3" />
      {/* Eraser */}
      <rect x="6" y="11" width="8" height="4" rx="1" fill="#e8836b" stroke="#c66" strokeWidth="0.3" />
      {/* Hand */}
      <ellipse cx="28" cy="24" rx="16" ry="12" fill="#f5d0a9" stroke="#d4a574" strokeWidth="0.5" />
      {/* Thumb */}
      <ellipse cx="14" cy="21" rx="5" ry="4" fill="#f5d0a9" stroke="#d4a574" strokeWidth="0.5" transform="rotate(-20 14 21)" />
      {/* Fingers */}
      <ellipse cx="16" cy="17" rx="4" ry="3.5" fill="#f5d0a9" stroke="#d4a574" strokeWidth="0.5" transform="rotate(-10 16 17)" />
      <ellipse cx="20" cy="15" rx="4" ry="3" fill="#f5d0a9" stroke="#d4a574" strokeWidth="0.5" />
    </svg>
  );
}
