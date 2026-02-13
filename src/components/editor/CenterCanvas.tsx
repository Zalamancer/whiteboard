"use client";

import React, { useRef, useCallback, useEffect } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { WhiteboardComposition } from "@/remotion/WhiteboardComposition";
import { useProjectStore } from "@/store/useProjectStore";
import { useEditorStore } from "@/store/useEditorStore";

export const CenterCanvas: React.FC = () => {
  const project = useProjectStore((s) => s.project);
  const getTotalDuration = useProjectStore((s) => s.getTotalDuration);
  const setCurrentFrame = useEditorStore((s) => s.setCurrentFrame);
  const setIsPlaying = useEditorStore((s) => s.setIsPlaying);
  const isPlaying = useEditorStore((s) => s.isPlaying);
  const currentFrame = useEditorStore((s) => s.currentFrame);
  const selectedIds = useEditorStore((s) => s.selectedElementIds);
  const selectElement = useEditorStore((s) => s.selectElement);
  const clearSelection = useEditorStore((s) => s.clearSelection);
  const playerRef = useRef<PlayerRef>(null);

  // Sync frame updates from Player to store
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const handleFrameUpdate = (e: { detail: { frame: number } }) => {
      setCurrentFrame(e.detail.frame);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    player.addEventListener("frameupdate", handleFrameUpdate as never);
    player.addEventListener("play", handlePlay as never);
    player.addEventListener("pause", handlePause as never);

    return () => {
      player.removeEventListener("frameupdate", handleFrameUpdate as never);
      player.removeEventListener("play", handlePlay as never);
      player.removeEventListener("pause", handlePause as never);
    };
  }, [setCurrentFrame, setIsPlaying]);

  // Handle click on the canvas area for element selection
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const scaleX = project.width / rect.width;
      const scaleY = project.height / rect.height;
      const canvasX = (e.clientX - rect.left) * scaleX;
      const canvasY = (e.clientY - rect.top) * scaleY;

      // Hit test against elements (reverse z-order, top first)
      const sortedElements = [...project.elements]
        .filter((el) => el.visible)
        .sort((a, b) => b.zIndex - a.zIndex);

      for (const el of sortedElements) {
        if (
          canvasX >= el.position.x &&
          canvasX <= el.position.x + el.size.width &&
          canvasY >= el.position.y &&
          canvasY <= el.position.y + el.size.height
        ) {
          selectElement(el.id, e.shiftKey);
          return;
        }
      }
      clearSelection();
    },
    [project, selectElement, clearSelection]
  );

  const totalDuration = getTotalDuration();
  const fps = project.fps;
  const currentTime = (currentFrame / fps).toFixed(1);
  const totalTime = (totalDuration / fps).toFixed(1);

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-[var(--background)]">
      {/* Canvas area */}
      <div
        className="relative overflow-hidden rounded-lg shadow-2xl"
        style={{ maxWidth: "100%", maxHeight: "calc(100% - 48px)" }}
      >
        <div onClick={handleCanvasClick} className="relative">
          <Player
            ref={playerRef}
            component={WhiteboardComposition}
            inputProps={project}
            durationInFrames={totalDuration}
            compositionWidth={project.width}
            compositionHeight={project.height}
            fps={fps}
            style={{
              width: 800,
              height: 450,
            }}
            controls
            autoPlay={false}
            loop
            clickToPlay
            acknowledgeRemotionLicense
          />
          {/* Selection overlay indicators */}
          {selectedIds.map((id) => {
            const el = project.elements.find((e) => e.id === id);
            if (!el) return null;
            const scaleX = 800 / project.width;
            const scaleY = 450 / project.height;
            return (
              <div
                key={id}
                style={{
                  position: "absolute",
                  left: el.position.x * scaleX,
                  top: el.position.y * scaleY,
                  width: el.size.width * scaleX,
                  height: el.size.height * scaleY,
                  border: "2px solid var(--primary)",
                  borderRadius: 2,
                  pointerEvents: "none",
                  boxShadow: "0 0 0 1px rgba(108, 99, 255, 0.3)",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Playback controls */}
      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={() => {
            const player = playerRef.current;
            if (!player) return;
            if (isPlaying) {
              player.pause();
            } else {
              player.play();
            }
          }}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
        >
          {isPlaying ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <rect x="1" y="1" width="4" height="10" rx="1" />
              <rect x="7" y="1" width="4" height="10" rx="1" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M2 1 L10 6 L2 11 Z" />
            </svg>
          )}
        </button>
        <span className="font-mono text-xs text-[var(--text-muted)]">
          {currentTime}s / {totalTime}s (frame {currentFrame})
        </span>
        <button
          onClick={() => {
            playerRef.current?.seekTo(0);
          }}
          className="text-xs text-[var(--text-muted)] hover:text-[var(--foreground)]"
        >
          Reset
        </button>
      </div>
    </div>
  );
};
