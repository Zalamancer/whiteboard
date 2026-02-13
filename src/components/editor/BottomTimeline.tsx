"use client";

import React from "react";
import { useProjectStore } from "@/store/useProjectStore";
import { useEditorStore } from "@/store/useEditorStore";
import { useTimelineStore } from "@/store/useTimelineStore";

const TRACK_HEIGHT = 28;
const LABEL_WIDTH = 130;

const TYPE_COLORS: Record<string, string> = {
  "svg-path": "#3b82f6",
  text: "#22c55e",
  image: "#f97316",
  shape: "#a855f7",
};

export const BottomTimeline: React.FC = () => {
  const elements = useProjectStore((s) => s.project.elements);
  const fps = useProjectStore((s) => s.project.fps);
  const getTotalDuration = useProjectStore((s) => s.getTotalDuration);
  const currentFrame = useEditorStore((s) => s.currentFrame);
  const selectedIds = useEditorStore((s) => s.selectedElementIds);
  const selectElement = useEditorStore((s) => s.selectElement);
  const pixelsPerFrame = useTimelineStore((s) => s.pixelsPerFrame);
  const setZoom = useTimelineStore((s) => s.setZoom);

  const totalDuration = getTotalDuration();
  const sortedElements = [...elements].sort((a, b) => a.zIndex - b.zIndex);
  const totalWidth = totalDuration * pixelsPerFrame;

  return (
    <div className="flex h-[200px] shrink-0 flex-col border-t border-[var(--border)] bg-[var(--surface)]">
      {/* Timeline header */}
      <div className="flex h-7 shrink-0 items-center justify-between border-b border-[var(--border)] px-3">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          Timeline
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(pixelsPerFrame - 0.5)}
            className="text-[10px] text-[var(--text-muted)] hover:text-[var(--foreground)]"
          >
            -
          </button>
          <span className="text-[10px] text-[var(--text-muted)]">
            {pixelsPerFrame.toFixed(1)}px/f
          </span>
          <button
            onClick={() => setZoom(pixelsPerFrame + 0.5)}
            className="text-[10px] text-[var(--text-muted)] hover:text-[var(--foreground)]"
          >
            +
          </button>
        </div>
      </div>

      {/* Timeline body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Track labels */}
        <div
          className="shrink-0 overflow-y-auto border-r border-[var(--border)]"
          style={{ width: LABEL_WIDTH }}
        >
          {/* Ruler spacer */}
          <div className="h-5 border-b border-[var(--border)]" />
          {sortedElements.map((el) => (
            <div
              key={el.id}
              className="flex items-center border-b border-[var(--border)] px-2"
              style={{
                height: TRACK_HEIGHT,
                background: selectedIds.includes(el.id)
                  ? "var(--surface-light)"
                  : "transparent",
              }}
              onClick={() => selectElement(el.id)}
            >
              <div
                className="mr-2 h-2 w-2 rounded-full"
                style={{ backgroundColor: TYPE_COLORS[el.type] || "#888" }}
              />
              <span className="truncate text-[10px] text-[var(--foreground)]">
                {el.data.type === "text"
                  ? (el.data as { content: string }).content.slice(0, 15)
                  : el.type}
              </span>
            </div>
          ))}
        </div>

        {/* Timeline tracks with ruler */}
        <div className="relative flex-1 overflow-auto">
          {/* Ruler */}
          <div className="sticky top-0 z-10 h-5 border-b border-[var(--border)] bg-[var(--surface)]">
            <svg width={totalWidth} height={20}>
              {Array.from(
                { length: Math.ceil(totalDuration / fps) + 1 },
                (_, i) => {
                  const x = i * fps * pixelsPerFrame;
                  return (
                    <g key={i}>
                      <line
                        x1={x}
                        y1={0}
                        x2={x}
                        y2={20}
                        stroke="var(--border)"
                        strokeWidth={1}
                      />
                      <text
                        x={x + 3}
                        y={13}
                        fill="var(--text-muted)"
                        fontSize={9}
                        fontFamily="monospace"
                      >
                        {i}s
                      </text>
                    </g>
                  );
                }
              )}
            </svg>
          </div>

          {/* Track rows */}
          <div style={{ width: totalWidth, position: "relative" }}>
            {sortedElements.map((el, idx) => (
              <div
                key={el.id}
                className="relative border-b border-[var(--border)]"
                style={{ height: TRACK_HEIGHT }}
              >
                {/* Clip */}
                <div
                  className="absolute top-1 cursor-pointer rounded"
                  style={{
                    left: el.startFrame * pixelsPerFrame,
                    width: el.durationFrames * pixelsPerFrame,
                    height: TRACK_HEIGHT - 4,
                    backgroundColor: TYPE_COLORS[el.type] || "#888",
                    opacity: selectedIds.includes(el.id) ? 1 : 0.6,
                    border: selectedIds.includes(el.id)
                      ? "1px solid white"
                      : "1px solid transparent",
                  }}
                  onClick={() => selectElement(el.id)}
                >
                  {/* Draw speed indicator */}
                  <div
                    className="absolute left-0 top-0 rounded-l"
                    style={{
                      width: Math.min(
                        el.drawSpeed * pixelsPerFrame,
                        el.durationFrames * pixelsPerFrame
                      ),
                      height: "100%",
                      backgroundColor: "rgba(255,255,255,0.2)",
                    }}
                  />
                </div>
              </div>
            ))}

            {/* Playhead */}
            <div
              className="absolute top-0 z-20"
              style={{
                left: currentFrame * pixelsPerFrame,
                height: sortedElements.length * TRACK_HEIGHT,
              }}
            >
              <div className="h-full w-px bg-red-500" />
              <div
                className="absolute -left-1 -top-5 h-3 w-2 bg-red-500"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
