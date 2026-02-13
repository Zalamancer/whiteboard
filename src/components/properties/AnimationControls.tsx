"use client";

import React from "react";
import { useProjectStore } from "@/store/useProjectStore";
import type { WhiteboardElement, AnimationType } from "@/store/types";

interface Props {
  element: WhiteboardElement;
}

export const AnimationControls: React.FC<Props> = ({ element }) => {
  const updateElement = useProjectStore((s) => s.updateElement);
  const fps = useProjectStore((s) => s.project.fps);

  const update = (patch: Partial<WhiteboardElement>) => {
    updateElement(element.id, patch);
  };

  return (
    <div className="space-y-2 py-2">
      <label className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
        Animation
      </label>
      <div>
        <label className="text-[9px] text-[var(--text-muted)]">Type</label>
        <select
          value={element.animationType}
          onChange={(e) =>
            update({ animationType: e.target.value as AnimationType })
          }
          className="w-full rounded bg-[var(--surface-light)] px-2 py-1 text-xs text-[var(--foreground)]"
        >
          <option value="draw">Draw</option>
          <option value="fade-in">Fade In</option>
          <option value="none">None</option>
        </select>
      </div>
      <div>
        <label className="text-[9px] text-[var(--text-muted)]">
          Speed: {element.drawSpeed} frames (
          {(element.drawSpeed / fps).toFixed(1)}s)
        </label>
        <input
          type="range"
          min={5}
          max={300}
          value={element.drawSpeed}
          onChange={(e) => update({ drawSpeed: Number(e.target.value) })}
          className="w-full"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[9px] text-[var(--text-muted)]">
            Start Frame
          </label>
          <input
            type="number"
            value={element.startFrame}
            min={0}
            onChange={(e) => update({ startFrame: Number(e.target.value) })}
            className="w-full rounded bg-[var(--surface-light)] px-2 py-1 text-xs text-[var(--foreground)]"
          />
        </div>
        <div>
          <label className="text-[9px] text-[var(--text-muted)]">
            Duration
          </label>
          <input
            type="number"
            value={element.durationFrames}
            min={1}
            onChange={(e) =>
              update({ durationFrames: Number(e.target.value) })
            }
            className="w-full rounded bg-[var(--surface-light)] px-2 py-1 text-xs text-[var(--foreground)]"
          />
        </div>
      </div>
    </div>
  );
};
