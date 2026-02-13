import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { evolvePath } from "@remotion/paths";
import type { WhiteboardElement, TextData } from "@/store/types";

interface Props {
  element: WhiteboardElement;
}

export const TextElement: React.FC<Props> = React.memo(({ element }) => {
  const frame = useCurrentFrame();
  const data = element.data as TextData;

  const localFrame = frame - element.startFrame;
  if (localFrame < 0) return null;

  const drawProgress =
    element.animationType === "draw"
      ? interpolate(localFrame, [0, element.drawSpeed], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  const opacity =
    element.animationType === "fade-in"
      ? interpolate(localFrame, [0, element.drawSpeed], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : element.opacity;

  // If we have generated paths, animate them like SVG paths
  if (
    element.animationType === "draw" &&
    data.generatedPaths &&
    data.generatedPaths.length > 0
  ) {
    return (
      <div
        style={{
          position: "absolute",
          left: element.position.x,
          top: element.position.y,
          width: element.size.width,
          height: element.size.height,
          transform: `rotate(${element.rotation}deg)`,
          opacity: element.opacity,
        }}
      >
        <svg
          viewBox={`0 0 ${element.size.width} ${element.size.height}`}
          width="100%"
          height="100%"
        >
          {data.generatedPaths.map((pathD, i) => {
            const evolved = evolvePath(drawProgress, pathD);
            return (
              <path
                key={i}
                d={pathD}
                stroke={data.color}
                strokeWidth={2}
                fill={drawProgress >= 1 ? data.color : "none"}
                fillOpacity={drawProgress >= 1 ? 1 : 0}
                strokeDasharray={evolved.strokeDasharray}
                strokeDashoffset={evolved.strokeDashoffset}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            );
          })}
        </svg>
      </div>
    );
  }

  // Fallback: render as regular text
  return (
    <div
      style={{
        position: "absolute",
        left: element.position.x,
        top: element.position.y,
        width: element.size.width,
        height: element.size.height,
        transform: `rotate(${element.rotation}deg)`,
        opacity,
        fontFamily: data.fontFamily,
        fontSize: data.fontSize,
        fontWeight: data.fontWeight,
        color: data.color,
        textAlign: data.textAlign,
        lineHeight: 1.2,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      {data.content}
    </div>
  );
});

TextElement.displayName = "TextElement";
