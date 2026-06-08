"use client";

import React from "react";
import { useProjectStore } from "@/store/useProjectStore";
import type { WhiteboardElement, AnimationType } from "@/store/types";
import { ANIMATION_TYPES } from "@/lib/animations";

interface Props {
  element: WhiteboardElement;
}

export const AnimationControls: React.FC<Props> = ({ element }) => {
  const updateElement = useProjectStore((s) => s.updateElement);
  const fps = useProjectStore((s) => s.project.fps);

  const isTextElement = element.data.type === "text";

  const update = (patch: Partial<WhiteboardElement>) => {
    updateElement(element.id, patch);
  };

  // Filter animations: typewriter only for text elements
  const availableAnimations = ANIMATION_TYPES.filter(
    (a) => a.value !== "typewriter" || isTextElement
  );

  // Group animations by category
  const revealAnims = availableAnimations.filter((a) => a.category === "reveal");
  const motionAnims = availableAnimations.filter((a) => a.category === "motion");
  const specialAnims = availableAnimations.filter((a) => a.category === "special");

  return (
    <div className="space-y-2 py-2">
      <label className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
        Animation
      </label>

      {/* Animation type grid */}
      <div className="space-y-1.5">
        <div className="text-[8px] font-medium uppercase tracking-wider text-zinc-600">
          Reveal
        </div>
        <div className="grid grid-cols-3 gap-1">
          {revealAnims.map((a) => (
            <button
              key={a.value}
              onClick={() => update({ animationType: a.value })}
              className={`rounded px-1.5 py-1 text-[9px] transition-colors ${
                element.animationType === a.value
                  ? "bg-green-500/20 text-green-400 ring-1 ring-green-500/30"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300"
              }`}
              title={a.description}
            >
              {a.label}
            </button>
          ))}
        </div>

        <div className="text-[8px] font-medium uppercase tracking-wider text-zinc-600">
          Motion
        </div>
        <div className="grid grid-cols-3 gap-1">
          {motionAnims.map((a) => (
            <button
              key={a.value}
              onClick={() => update({ animationType: a.value })}
              className={`rounded px-1.5 py-1 text-[9px] transition-colors ${
                element.animationType === a.value
                  ? "bg-green-500/20 text-green-400 ring-1 ring-green-500/30"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300"
              }`}
              title={a.description}
            >
              {a.label}
            </button>
          ))}
        </div>

        <div className="text-[8px] font-medium uppercase tracking-wider text-zinc-600">
          Special
        </div>
        <div className="grid grid-cols-3 gap-1">
          {specialAnims.map((a) => (
            <button
              key={a.value}
              onClick={() => update({ animationType: a.value })}
              className={`rounded px-1.5 py-1 text-[9px] transition-colors ${
                element.animationType === a.value
                  ? "bg-green-500/20 text-green-400 ring-1 ring-green-500/30"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300"
              }`}
              title={a.description}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Speed slider */}
      {element.animationType !== "none" && (
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
      )}

      {/* Timing controls */}
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
