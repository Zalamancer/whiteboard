import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { evolvePath } from "@remotion/paths";
import type { WhiteboardElement, ShapeData, VideoStyle } from "@/store/types";
import { getStyleDefinition } from "@/lib/video-styles";
import { computeAnimation } from "@/lib/animations";

interface Props {
  element: WhiteboardElement;
  videoStyle?: string;
}

function generateShapePath(
  shapeType: ShapeData["shapeType"],
  width: number,
  height: number,
  cornerRadius?: number
): string {
  const r = cornerRadius || 0;

  switch (shapeType) {
    case "rect": {
      if (r > 0) {
        return `M ${r} 0 L ${width - r} 0 Q ${width} 0 ${width} ${r} L ${width} ${height - r} Q ${width} ${height} ${width - r} ${height} L ${r} ${height} Q 0 ${height} 0 ${height - r} L 0 ${r} Q 0 0 ${r} 0 Z`;
      }
      return `M 0 0 L ${width} 0 L ${width} ${height} L 0 ${height} Z`;
    }
    case "circle": {
      const cx = width / 2;
      const cy = height / 2;
      const rx = width / 2;
      const ry = height / 2;
      return `M ${cx} ${cy - ry} A ${rx} ${ry} 0 1 1 ${cx} ${cy + ry} A ${rx} ${ry} 0 1 1 ${cx} ${cy - ry} Z`;
    }
    case "ellipse": {
      const ecx = width / 2;
      const ecy = height / 2;
      const erx = width / 2;
      const ery = height / 2;
      return `M ${ecx} ${ecy - ery} A ${erx} ${ery} 0 1 1 ${ecx} ${ecy + ery} A ${erx} ${ery} 0 1 1 ${ecx} ${ecy - ery} Z`;
    }
    case "arrow": {
      const midY = height / 2;
      const headSize = Math.min(width * 0.3, height * 0.4);
      return `M 0 ${midY} L ${width - headSize} ${midY} L ${width - headSize} ${midY - headSize} L ${width} ${midY} L ${width - headSize} ${midY + headSize} L ${width - headSize} ${midY}`;
    }
    case "line": {
      return `M 0 ${height / 2} L ${width} ${height / 2}`;
    }
    case "star": {
      const cx2 = width / 2;
      const cy2 = height / 2;
      const outerR = Math.min(width, height) / 2;
      const innerR = outerR * 0.38;
      const points = 5;
      let d = "";
      for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? outerR : innerR;
        const angle = (Math.PI / points) * i - Math.PI / 2;
        const x = cx2 + radius * Math.cos(angle);
        const y = cy2 + radius * Math.sin(angle);
        d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
      }
      return d + " Z";
    }
    default:
      return `M 0 0 L ${width} 0 L ${width} ${height} L 0 ${height} Z`;
  }
}

export const ShapeElement: React.FC<Props> = React.memo(({ element, videoStyle }) => {
  const frame = useCurrentFrame();
  const data = element.data as ShapeData;
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

  const pathD =
    data.generatedPath ||
    generateShapePath(
      data.shapeType,
      element.size.width,
      element.size.height,
      data.cornerRadius
    );

  const evolved = isDrawAnimation ? evolvePath(drawProgress, pathD) : null;

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
        viewBox={`0 0 ${element.size.width} ${element.size.height}`}
        width="100%"
        height="100%"
        style={{ overflow: "visible" }}
      >
        <g filter={svgFilter}>
          <path
            d={pathD}
            stroke={data.strokeColor}
            strokeWidth={data.strokeWidth}
            fill={drawProgress >= 1 ? data.fillColor : "none"}
            fillOpacity={drawProgress >= 1 ? 1 : 0}
            strokeDasharray={evolved?.strokeDasharray}
            strokeDashoffset={evolved?.strokeDashoffset}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  );
});

ShapeElement.displayName = "ShapeElement";
