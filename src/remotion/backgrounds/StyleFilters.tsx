import React from "react";
import type { VideoStyle } from "@/store/types";

interface Props {
  style: VideoStyle;
}

/**
 * Renders SVG filter definitions used by element renderers for style-specific effects.
 * These are global <defs> that elements reference via filter="url(#filter-id)".
 */
export const StyleFilters: React.FC<Props> = ({ style }) => {
  return (
    <svg
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Chalk texture filter — rough, grainy strokes */}
        {style === "blackboard" && (
          <filter id="chalk-texture" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.6"
              numOctaves="4"
              seed="5"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="3"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feTurbulence
              type="fractalNoise"
              baseFrequency="1.2"
              numOctaves="3"
              seed="8"
              result="roughNoise"
            />
            <feComposite
              in="displaced"
              in2="roughNoise"
              operator="in"
              result="chalky"
            />
            {/* Blend the rough chalk with the original for a balance */}
            <feMerge>
              <feMergeNode in="displaced" />
              <feMergeNode in="chalky" />
            </feMerge>
          </filter>
        )}

        {/* Pencil texture filter — subtle wobble */}
        {style === "sketch-notebook" && (
          <filter id="pencil-texture" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.3"
              numOctaves="2"
              seed="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="1.5"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        )}

        {/* Neon glow filter — colored glow around strokes */}
        {style === "neon-dark" && (
          <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
            {/* First pass: blur the source for the glow */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur2" />
            {/* Layer: original sharp + inner glow + outer glow */}
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}

        {/* Drop shadow for colorful-flat style */}
        {style === "colorful-flat" && (
          <filter id="flat-shadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="3" dy="3" stdDeviation="2" floodColor="rgba(0,0,0,0.12)" />
          </filter>
        )}
      </defs>
    </svg>
  );
};
