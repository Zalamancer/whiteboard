"use client";

import React from "react";
import { useProjectStore } from "@/store/useProjectStore";
import type { WhiteboardElement } from "@/store/types";

interface Props {
  element: WhiteboardElement;
}

export const TransformControls: React.FC<Props> = ({ element }) => {
  const updateElement = useProjectStore((s) => s.updateElement);

  const update = (patch: Partial<WhiteboardElement>) => {
    updateElement(element.id, patch);
  };

  return (
    <div className="space-y-2 py-2">
      <label className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
        Transform
      </label>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[9px] text-[var(--text-muted)]">X</label>
          <input
            type="number"
            value={Math.round(element.position.x)}
            onChange={(e) =>
              update({ position: { ...element.position, x: Number(e.target.value) } })
            }
            className="w-full rounded bg-[var(--surface-light)] px-2 py-1 text-xs text-[var(--foreground)]"
          />
        </div>
        <div>
          <label className="text-[9px] text-[var(--text-muted)]">Y</label>
          <input
            type="number"
            value={Math.round(element.position.y)}
            onChange={(e) =>
              update({ position: { ...element.position, y: Number(e.target.value) } })
            }
            className="w-full rounded bg-[var(--surface-light)] px-2 py-1 text-xs text-[var(--foreground)]"
          />
        </div>
        <div>
          <label className="text-[9px] text-[var(--text-muted)]">Width</label>
          <input
            type="number"
            value={Math.round(element.size.width)}
            onChange={(e) =>
              update({ size: { ...element.size, width: Number(e.target.value) } })
            }
            className="w-full rounded bg-[var(--surface-light)] px-2 py-1 text-xs text-[var(--foreground)]"
          />
        </div>
        <div>
          <label className="text-[9px] text-[var(--text-muted)]">Height</label>
          <input
            type="number"
            value={Math.round(element.size.height)}
            onChange={(e) =>
              update({ size: { ...element.size, height: Number(e.target.value) } })
            }
            className="w-full rounded bg-[var(--surface-light)] px-2 py-1 text-xs text-[var(--foreground)]"
          />
        </div>
      </div>
      <div>
        <label className="text-[9px] text-[var(--text-muted)]">
          Rotation ({element.rotation})
        </label>
        <input
          type="range"
          min={-180}
          max={180}
          value={element.rotation}
          onChange={(e) => update({ rotation: Number(e.target.value) })}
          className="w-full"
        />
      </div>
      <div>
        <label className="text-[9px] text-[var(--text-muted)]">
          Opacity ({(element.opacity * 100).toFixed(0)}%)
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={element.opacity * 100}
          onChange={(e) => update({ opacity: Number(e.target.value) / 100 })}
          className="w-full"
        />
      </div>
    </div>
  );
};
