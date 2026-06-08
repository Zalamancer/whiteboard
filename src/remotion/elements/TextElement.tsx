import React, { useMemo } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { evolvePath } from "@remotion/paths";
import type { WhiteboardElement, TextData, VideoStyle } from "@/store/types";
import { getStyleDefinition } from "@/lib/video-styles";
import { computeAnimation } from "@/lib/animations";

interface Props {
  element: WhiteboardElement;
  videoStyle?: string;
}

export const TextElement: React.FC<Props> = React.memo(({ element, videoStyle }) => {
  const frame = useCurrentFrame();
  const data = element.data as TextData;
  const styleDef = getStyleDefinition((videoStyle as VideoStyle) || "classic-whiteboard");

  const localFrame = frame - element.startFrame;
  if (localFrame < 0) return null;

  const isDrawAnimation = element.animationType === "draw";

  const drawProgress = isDrawAnimation
    ? interpolate(localFrame, [0, element.drawSpeed], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  // Style-specific SVG filter for path-based text
  const svgFilter = styleDef.svgFilterId ? `url(#${styleDef.svgFilterId})` : undefined;

  // Style-specific text shadow for neon and colorful-flat
  const textShadow = styleDef.glowEffect
    ? `0 0 10px ${data.color}, 0 0 20px ${data.color}, 0 0 40px ${data.color}`
    : videoStyle === "colorful-flat"
      ? "2px 2px 4px rgba(0,0,0,0.1)"
      : undefined;

  // If we have generated paths, animate them like SVG paths (draw mode only)
  if (
    isDrawAnimation &&
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
          <g filter={svgFilter}>
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
          </g>
        </svg>
      </div>
    );
  }

  // Compute animation for all non-draw types
  const anim = !isDrawAnimation
    ? computeAnimation(element.animationType, localFrame, element.drawSpeed, element.opacity)
    : { opacity: element.opacity, transform: "none", clipPath: undefined, textRevealProgress: undefined };

  // Typewriter effect: show partial text
  const displayContent = useMemo(() => {
    if (anim.textRevealProgress !== undefined && anim.textRevealProgress < 1) {
      const totalChars = data.content.length;
      const charsToShow = Math.floor(totalChars * anim.textRevealProgress);
      return data.content.slice(0, charsToShow);
    }
    return data.content;
  }, [anim.textRevealProgress, data.content]);

  // Fallback: render as regular text
  return (
    <div
      style={{
        position: "absolute",
        left: element.position.x,
        top: element.position.y,
        width: element.size.width,
        height: element.size.height,
        transform: `rotate(${element.rotation}deg) ${anim.transform !== "none" ? anim.transform : ""}`.trim(),
        transformOrigin: "center center",
        opacity: anim.opacity,
        clipPath: anim.clipPath,
        fontFamily: data.fontFamily,
        fontSize: data.fontSize,
        fontWeight: data.fontWeight,
        color: data.color,
        textAlign: data.textAlign,
        lineHeight: 1.2,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        textShadow,
      }}
    >
      {displayContent}
    </div>
  );
});

TextElement.displayName = "TextElement";
