import React from "react";
import { Composition } from "remotion";
import { WhiteboardComposition } from "./WhiteboardComposition";
import type { Project } from "@/store/types";

// Default props for the composition registration
const defaultProps: Project = {
  id: "default",
  name: "Untitled",
  width: 1920,
  height: 1080,
  fps: 30,
  backgroundColor: "#FFFFFF",
  elements: [],
  cameraKeyframes: [],
  audioTracks: [],
};

export const Root: React.FC = () => {
  return (
    <Composition
      id="WhiteboardVideo"
      component={WhiteboardComposition}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={defaultProps as unknown as Record<string, unknown>}
    />
  );
};
