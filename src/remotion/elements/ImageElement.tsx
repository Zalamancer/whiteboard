import React, { useMemo } from "react";
import { useCurrentFrame, interpolate, Img } from "remotion";
import type { WhiteboardElement, ImageData } from "@/store/types";

interface Props {
  element: WhiteboardElement;
}

/**
 * Serpentine zigzag path — the "brush" traces this path with a fat round stroke
 * to progressively reveal the image, like a marker coloring it in.
 */
function generateBrushPath(width: number, height: number, rows: number): string {
  const rowH = height / rows;
  const parts: string[] = [];

  for (let i = 0; i < rows; i++) {
    const y = rowH * i + rowH / 2;
    if (i === 0) {
      parts.push(`M -10 ${y}`);
    }
    if (i % 2 === 0) {
      parts.push(`L ${width + 10} ${y}`);
    } else {
      parts.push(`L -10 ${y}`);
    }
    // vertical connector to next row
    if (i < rows - 1) {
      const nextY = rowH * (i + 1) + rowH / 2;
      if (i % 2 === 0) {
        parts.push(`L ${width + 10} ${nextY}`);
      } else {
        parts.push(`L -10 ${nextY}`);
      }
    }
  }
  return parts.join(" ");
}

function getBrushPathLength(width: number, height: number, rows: number): number {
  const rowH = height / rows;
  // +20 per row for the overshoot on each side
  return rows * (width + 20) + (rows - 1) * rowH;
}

export const ImageElement: React.FC<Props> = React.memo(({ element }) => {
  const frame = useCurrentFrame();
  const data = element.data as ImageData;

  const rows = 12;

  const brushPath = useMemo(
    () => generateBrushPath(element.size.width, element.size.height, rows),
    [element.size.width, element.size.height]
  );

  const totalLen = useMemo(
    () => getBrushPathLength(element.size.width, element.size.height, rows),
    [element.size.width, element.size.height]
  );

  const maskId = useMemo(() => `brush-mask-${element.id}`, [element.id]);

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

  const w = element.size.width;
  const h = element.size.height;
  const rowH = h / rows;
  // Brush stroke thick enough to fully cover each row — with round caps it bleeds a bit extra which is perfect
  const brushSize = rowH * 1.15;

  if (element.animationType === "draw") {
    const offset = totalLen * (1 - drawProgress);

    return (
      <div
        style={{
          position: "absolute",
          left: element.position.x,
          top: element.position.y,
          width: w,
          height: h,
          transform: `rotate(${element.rotation}deg)`,
          opacity: element.opacity,
          overflow: "hidden",
        }}
      >
        <svg
          width={w}
          height={h}
          viewBox={`0 0 ${w} ${h}`}
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <defs>
            {/* The brush-stroke mask: white = visible, black = hidden */}
            <mask id={maskId}>
              <rect x={-20} y={-20} width={w + 40} height={h + 40} fill="black" />
              <path
                d={brushPath}
                fill="none"
                stroke="white"
                strokeWidth={brushSize}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={totalLen}
                strokeDashoffset={offset}
              />
            </mask>
          </defs>

          {/* Render the image inside SVG, masked by the brush stroke */}
          <image
            href={data.src}
            x={0}
            y={0}
            width={w}
            height={h}
            preserveAspectRatio={
              data.objectFit === "cover" ? "xMidYMid slice" : "xMidYMid meet"
            }
            mask={`url(#${maskId})`}
          />
        </svg>
      </div>
    );
  }

  // Non-draw animations
  return (
    <div
      style={{
        position: "absolute",
        left: element.position.x,
        top: element.position.y,
        width: w,
        height: h,
        transform: `rotate(${element.rotation}deg)`,
        opacity,
        overflow: "hidden",
      }}
    >
      <Img
        src={data.src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: data.objectFit,
        }}
      />
    </div>
  );
});

ImageElement.displayName = "ImageElement";
