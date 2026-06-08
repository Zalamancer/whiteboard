import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { evolvePath } from "@remotion/paths";
import type { WhiteboardElement, SVGPathData, VideoStyle } from "@/store/types";
import { getStyleDefinition } from "@/lib/video-styles";
import { computeAnimation } from "@/lib/animations";

interface Props {
  element: WhiteboardElement;
  videoStyle?: string;
}

export const SVGPathElement: React.FC<Props> = React.memo(({ element, videoStyle }) => {
  const frame = useCurrentFrame();
  const data = element.data as SVGPathData;
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

  // Compute animation for non-draw types
  const anim = !isDrawAnimation
    ? computeAnimation(element.animationType, localFrame, element.drawSpeed, element.opacity)
    : { opacity: element.opacity, transform: "none", clipPath: undefined };

  // Style-specific SVG filter
  const svgFilter = styleDef.svgFilterId ? `url(#${styleDef.svgFilterId})` : undefined;

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
      }}
    >
      <svg
        viewBox={data.viewBox || `0 0 ${element.size.width} ${element.size.height}`}
        width="100%"
        height="100%"
        style={{ overflow: "visible" }}
      >
        <g filter={svgFilter}>
          {data.paths.map((pathD, i) => {
            const evolved = isDrawAnimation
              ? evolvePath(drawProgress, pathD)
              : null;

            return (
              <path
                key={i}
                d={pathD}
                stroke={data.strokeColor}
                strokeWidth={data.strokeWidth}
                fill={drawProgress >= 1 ? data.fillColor : "none"}
                fillOpacity={drawProgress >= 1 ? data.fillOpacity : 0}
                strokeDasharray={evolved?.strokeDasharray}
                strokeDashoffset={evolved?.strokeDashoffset}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
});

SVGPathElement.displayName = "SVGPathElement";
