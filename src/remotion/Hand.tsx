import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import type { WhiteboardElement } from "@/store/types";
import { getHandPosition } from "./animations/handFollower";

interface Props {
  elements: WhiteboardElement[];
}

export const Hand: React.FC<Props> = React.memo(({ elements }) => {
  const frame = useCurrentFrame();
  const handState = getHandPosition(elements, frame);

  if (!handState.visible) return null;

  // Smoothly fade in/out the hand
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
      {/* SVG hand with pen */}
      <svg viewBox="0 0 60 60" width="60" height="60">
        {/* Pen tip */}
        <line
          x1="10"
          y1="30"
          x2="2"
          y2="42"
          stroke="#333"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Pen body */}
        <rect
          x="8"
          y="20"
          width="6"
          height="22"
          rx="1.5"
          fill="#2563eb"
          stroke="#1d4ed8"
          strokeWidth="0.5"
        />
        {/* Hand */}
        <ellipse cx="28" cy="26" rx="16" ry="12" fill="#f5d0a9" stroke="#d4a574" strokeWidth="0.5" />
        {/* Thumb */}
        <ellipse cx="14" cy="22" rx="5" ry="4" fill="#f5d0a9" stroke="#d4a574" strokeWidth="0.5" transform="rotate(-20 14 22)" />
        {/* Fingers gripping */}
        <ellipse cx="16" cy="18" rx="4" ry="3.5" fill="#f5d0a9" stroke="#d4a574" strokeWidth="0.5" transform="rotate(-10 16 18)" />
        <ellipse cx="20" cy="16" rx="4" ry="3" fill="#f5d0a9" stroke="#d4a574" strokeWidth="0.5" />
      </svg>
    </div>
  );
});

Hand.displayName = "Hand";
