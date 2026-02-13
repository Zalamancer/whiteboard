import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { evolvePath } from "@remotion/paths";
import type { WhiteboardElement, SVGPathData } from "@/store/types";

interface Props {
  element: WhiteboardElement;
}

export const SVGPathElement: React.FC<Props> = React.memo(({ element }) => {
  const frame = useCurrentFrame();
  const data = element.data as SVGPathData;

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
      }}
    >
      <svg
        viewBox={data.viewBox || `0 0 ${element.size.width} ${element.size.height}`}
        width="100%"
        height="100%"
        style={{ overflow: "visible" }}
      >
        {data.paths.map((pathD, i) => {
          const evolved =
            element.animationType === "draw"
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
      </svg>
    </div>
  );
});

SVGPathElement.displayName = "SVGPathElement";
