"use client";

import React, { forwardRef, useMemo } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { WhiteboardComposition } from "@/remotion/WhiteboardComposition";
import type { Project } from "@/store/types";

interface PlayerWrapperProps {
  project: Project;
  durationInFrames: number;
}

/** Max preview dimensions for different aspect ratios */
const MAX_PREVIEW_WIDTH = 800;
const MAX_PREVIEW_HEIGHT = 520;

export const PlayerWrapper = forwardRef<PlayerRef, PlayerWrapperProps>(
  ({ project, durationInFrames }, ref) => {
    const { previewWidth, previewHeight } = useMemo(() => {
      const aspectRatio = project.width / project.height;
      let w = MAX_PREVIEW_WIDTH;
      let h = w / aspectRatio;

      // If height exceeds max, scale down from height
      if (h > MAX_PREVIEW_HEIGHT) {
        h = MAX_PREVIEW_HEIGHT;
        w = h * aspectRatio;
      }

      return { previewWidth: Math.round(w), previewHeight: Math.round(h) };
    }, [project.width, project.height]);

    return (
      <Player
        ref={ref}
        component={WhiteboardComposition}
        inputProps={project}
        durationInFrames={durationInFrames}
        compositionWidth={project.width}
        compositionHeight={project.height}
        fps={project.fps}
        style={{
          width: previewWidth,
          height: previewHeight,
        }}
        controls
        autoPlay={false}
        loop
        clickToPlay
        acknowledgeRemotionLicense
      />
    );
  }
);

PlayerWrapper.displayName = "PlayerWrapper";
