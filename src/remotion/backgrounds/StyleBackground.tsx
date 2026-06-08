import React from "react";
import type { VideoStyle } from "@/store/types";
import { getStyleDefinition } from "@/lib/video-styles";

interface Props {
  style: VideoStyle;
  width: number;
  height: number;
}

/** Renders style-specific background patterns and textures */
export const StyleBackground: React.FC<Props> = ({ style, width, height }) => {
  const def = getStyleDefinition(style);

  if (def.backgroundPattern === "none") return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width,
        height,
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {def.backgroundPattern === "paper" && <PaperTexture width={width} height={height} />}
      {def.backgroundPattern === "chalkboard" && <ChalkboardTexture width={width} height={height} />}
      {def.backgroundPattern === "lined" && <LinedNotebook width={width} height={height} />}
      {def.backgroundPattern === "grid" && <GridPattern width={width} height={height} />}
      {def.backgroundPattern === "dots" && <DotsPattern width={width} height={height} />}
    </div>
  );
};

function PaperTexture({ width, height }: { width: number; height: number }) {
  return (
    <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="paper-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.08" />
          </feComponentTransfer>
        </filter>
      </defs>
      <rect width={width} height={height} fill="transparent" filter="url(#paper-noise)" />
    </svg>
  );
}

function ChalkboardTexture({ width, height }: { width: number; height: number }) {
  return (
    <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="chalk-dust">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" seed="2" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.06" />
          </feComponentTransfer>
        </filter>
        {/* Subtle green tint gradient typical of chalkboards */}
        <linearGradient id="chalk-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2d4a3e" stopOpacity="0.15" />
          <stop offset="50%" stopColor="transparent" stopOpacity="0" />
          <stop offset="100%" stopColor="#2d4a3e" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <rect width={width} height={height} fill="url(#chalk-gradient)" />
      <rect width={width} height={height} fill="white" filter="url(#chalk-dust)" />
      {/* Subtle border/frame like a real chalkboard */}
      <rect
        x="30"
        y="30"
        width={width - 60}
        height={height - 60}
        fill="none"
        stroke="rgba(255,255,255,0.03)"
        strokeWidth="2"
        rx="4"
      />
    </svg>
  );
}

function LinedNotebook({ width, height }: { width: number; height: number }) {
  const lineSpacing = 40;
  const lines: React.ReactNode[] = [];

  // Horizontal ruled lines
  for (let y = 80; y < height; y += lineSpacing) {
    lines.push(
      <line
        key={`h-${y}`}
        x1={80}
        y1={y}
        x2={width - 40}
        y2={y}
        stroke="#c8b8a0"
        strokeWidth="1"
        opacity="0.4"
      />
    );
  }

  return (
    <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="notebook-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.04" />
          </feComponentTransfer>
        </filter>
      </defs>
      {/* Paper grain */}
      <rect width={width} height={height} fill="white" filter="url(#notebook-grain)" />
      {/* Margin line (red, left side) */}
      <line x1={72} y1={0} x2={72} y2={height} stroke="#e87461" strokeWidth="2" opacity="0.35" />
      {/* Ruled lines */}
      {lines}
      {/* Hole punches */}
      <circle cx={36} cy={height * 0.25} r={12} fill="none" stroke="#d0c0a0" strokeWidth="1.5" opacity="0.3" />
      <circle cx={36} cy={height * 0.5} r={12} fill="none" stroke="#d0c0a0" strokeWidth="1.5" opacity="0.3" />
      <circle cx={36} cy={height * 0.75} r={12} fill="none" stroke="#d0c0a0" strokeWidth="1.5" opacity="0.3" />
    </svg>
  );
}

function GridPattern({ width, height }: { width: number; height: number }) {
  const cellSize = 60;
  const lines: React.ReactNode[] = [];

  // Vertical lines
  for (let x = cellSize; x < width; x += cellSize) {
    lines.push(
      <line key={`v-${x}`} x1={x} y1={0} x2={x} y2={height} stroke="#e0e0e6" strokeWidth="0.5" opacity="0.5" />
    );
  }
  // Horizontal lines
  for (let y = cellSize; y < height; y += cellSize) {
    lines.push(
      <line key={`h-${y}`} x1={0} y1={y} x2={width} y2={y} stroke="#e0e0e6" strokeWidth="0.5" opacity="0.5" />
    );
  }

  return (
    <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg">
      {lines}
    </svg>
  );
}

function DotsPattern({ width, height }: { width: number; height: number }) {
  const spacing = 50;
  const dots: React.ReactNode[] = [];

  for (let x = spacing; x < width; x += spacing) {
    for (let y = spacing; y < height; y += spacing) {
      dots.push(
        <circle key={`d-${x}-${y}`} cx={x} cy={y} r={1} fill="rgba(255,255,255,0.08)" />
      );
    }
  }

  return (
    <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg">
      {dots}
    </svg>
  );
}
