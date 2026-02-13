import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { CameraKeyframe } from "@/store/types";
import { getCameraTransformAtFrame } from "./animations/cameraInterpolation";

interface Props {
  keyframes: CameraKeyframe[];
  children: React.ReactNode;
}

export const Camera: React.FC<Props> = ({ keyframes, children }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const { x, y, scale } = getCameraTransformAtFrame(keyframes, frame);

  return (
    <div
      style={{
        width,
        height,
        position: "absolute",
        top: 0,
        left: 0,
        transform: `scale(${scale}) translate(${-x}px, ${-y}px)`,
        transformOrigin: `${width / 2}px ${height / 2}px`,
      }}
    >
      {children}
    </div>
  );
};
