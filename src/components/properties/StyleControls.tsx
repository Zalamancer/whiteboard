"use client";

import React from "react";
import { useProjectStore } from "@/store/useProjectStore";
import type { WhiteboardElement, SVGPathData, ShapeData, TextData } from "@/store/types";

interface Props {
  element: WhiteboardElement;
}

export const StyleControls: React.FC<Props> = ({ element }) => {
  const updateElement = useProjectStore((s) => s.updateElement);

  const updateData = (dataPatch: Record<string, unknown>) => {
    updateElement(element.id, {
      data: { ...element.data, ...dataPatch } as WhiteboardElement["data"],
    });
  };

  if (element.data.type === "svg-path") {
    const data = element.data as SVGPathData;
    return (
      <div className="space-y-2 py-2">
        <label className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
          Style
        </label>
        <div>
          <label className="text-[9px] text-[var(--text-muted)]">Stroke</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={data.strokeColor}
              onChange={(e) => updateData({ strokeColor: e.target.value })}
              className="h-6 w-6 cursor-pointer rounded border border-[var(--border)]"
            />
            <input
              type="number"
              value={data.strokeWidth}
              min={0.5}
              max={20}
              step={0.5}
              onChange={(e) => updateData({ strokeWidth: Number(e.target.value) })}
              className="w-16 rounded bg-[var(--surface-light)] px-2 py-1 text-xs text-[var(--foreground)]"
            />
          </div>
        </div>
        <div>
          <label className="text-[9px] text-[var(--text-muted)]">Fill</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={data.fillColor === "transparent" ? "#000000" : data.fillColor}
              onChange={(e) => updateData({ fillColor: e.target.value, fillOpacity: 0.3 })}
              className="h-6 w-6 cursor-pointer rounded border border-[var(--border)]"
            />
            <label className="flex items-center gap-1 text-[9px] text-[var(--text-muted)]">
              <input
                type="range"
                min={0}
                max={100}
                value={data.fillOpacity * 100}
                onChange={(e) => updateData({ fillOpacity: Number(e.target.value) / 100 })}
                className="w-16"
              />
              {(data.fillOpacity * 100).toFixed(0)}%
            </label>
          </div>
        </div>
      </div>
    );
  }

  if (element.data.type === "shape") {
    const data = element.data as ShapeData;
    return (
      <div className="space-y-2 py-2">
        <label className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
          Style
        </label>
        <div>
          <label className="text-[9px] text-[var(--text-muted)]">Stroke</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={data.strokeColor}
              onChange={(e) => updateData({ strokeColor: e.target.value })}
              className="h-6 w-6 cursor-pointer rounded border border-[var(--border)]"
            />
            <input
              type="number"
              value={data.strokeWidth}
              min={0.5}
              max={20}
              step={0.5}
              onChange={(e) => updateData({ strokeWidth: Number(e.target.value) })}
              className="w-16 rounded bg-[var(--surface-light)] px-2 py-1 text-xs text-[var(--foreground)]"
            />
          </div>
        </div>
        <div>
          <label className="text-[9px] text-[var(--text-muted)]">Fill</label>
          <input
            type="color"
            value={data.fillColor}
            onChange={(e) => updateData({ fillColor: e.target.value })}
            className="h-6 w-6 cursor-pointer rounded border border-[var(--border)]"
          />
        </div>
      </div>
    );
  }

  if (element.data.type === "text") {
    const data = element.data as TextData;
    return (
      <div className="space-y-2 py-2">
        <label className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
          Text Style
        </label>
        <div>
          <label className="text-[9px] text-[var(--text-muted)]">Content</label>
          <textarea
            value={data.content}
            onChange={(e) => updateData({ content: e.target.value })}
            rows={2}
            className="w-full rounded bg-[var(--surface-light)] px-2 py-1 text-xs text-[var(--foreground)]"
          />
        </div>
        <div>
          <label className="text-[9px] text-[var(--text-muted)]">Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={data.color}
              onChange={(e) => updateData({ color: e.target.value })}
              className="h-6 w-6 cursor-pointer rounded border border-[var(--border)]"
            />
            <input
              type="text"
              value={data.color}
              onChange={(e) => updateData({ color: e.target.value })}
              className="flex-1 rounded bg-[var(--surface-light)] px-2 py-1 text-xs text-[var(--foreground)]"
            />
          </div>
        </div>
        <div>
          <label className="text-[9px] text-[var(--text-muted)]">Font Size</label>
          <input
            type="number"
            value={data.fontSize}
            min={8}
            max={200}
            onChange={(e) => updateData({ fontSize: Number(e.target.value) })}
            className="w-full rounded bg-[var(--surface-light)] px-2 py-1 text-xs text-[var(--foreground)]"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="py-2">
      <p className="text-[10px] text-[var(--text-muted)]">No style options for this element type.</p>
    </div>
  );
};
