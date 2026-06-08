"use client";

import React from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { useProjectStore } from "@/store/useProjectStore";
import { TransformControls } from "./TransformControls";
import { AnimationControls } from "./AnimationControls";
import { StyleControls } from "./StyleControls";
import { AIEditInput } from "../ai/AIEditInput";

export const PropertiesPanel: React.FC = () => {
  const selectedIds = useEditorStore((s) => s.selectedElementIds);
  const elements = useProjectStore((s) => s.project.elements);
  const updateProject = useProjectStore((s) => s.updateProject);
  const project = useProjectStore((s) => s.project);
  const removeElement = useProjectStore((s) => s.removeElement);
  const duplicateElement = useProjectStore((s) => s.duplicateElement);

  const selectedElement = elements.find((el) => el.id === selectedIds[0]);

  if (!selectedElement) {
    return (
      <div className="space-y-4 p-3">
        <div>
          <label className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
            Project Settings
          </label>
        </div>
        <div>
          <label className="text-[10px] text-[var(--text-muted)]">
            Background
          </label>
          <div className="mt-1 flex gap-2">
            <input
              type="color"
              value={project.backgroundColor}
              onChange={(e) => updateProject({ backgroundColor: e.target.value })}
              className="h-7 w-7 cursor-pointer rounded border border-[var(--border)]"
            />
            <input
              type="text"
              value={project.backgroundColor}
              onChange={(e) => updateProject({ backgroundColor: e.target.value })}
              className="flex-1 rounded bg-[var(--surface-light)] px-2 py-1 text-xs text-[var(--foreground)]"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-[10px] text-[var(--text-muted)]">Width</label>
            <input
              type="number"
              value={project.width}
              onChange={(e) => updateProject({ width: Number(e.target.value) })}
              className="w-full rounded bg-[var(--surface-light)] px-2 py-1 text-xs text-[var(--foreground)]"
            />
          </div>
          <div className="flex-1">
            <label className="text-[10px] text-[var(--text-muted)]">
              Height
            </label>
            <input
              type="number"
              value={project.height}
              onChange={(e) => updateProject({ height: Number(e.target.value) })}
              className="w-full rounded bg-[var(--surface-light)] px-2 py-1 text-xs text-[var(--foreground)]"
            />
          </div>
        </div>
        <div>
          <label className="text-[10px] text-[var(--text-muted)]">FPS</label>
          <input
            type="number"
            value={project.fps}
            onChange={(e) => updateProject({ fps: Number(e.target.value) })}
            min={1}
            max={60}
            className="w-full rounded bg-[var(--surface-light)] px-2 py-1 text-xs text-[var(--foreground)]"
          />
        </div>
        <p className="text-[10px] text-[var(--text-muted)]">
          {elements.length} element{elements.length !== 1 ? "s" : ""} in project
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1 p-3">
      {/* Element header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium capitalize text-[var(--foreground)]">
          {selectedElement.type.replace("-", " ")}
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => duplicateElement(selectedElement.id)}
            className="rounded p-1 text-[var(--text-muted)] hover:bg-[var(--surface-light)] hover:text-[var(--foreground)]"
            title="Duplicate"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="4" y="4" width="8" height="8" rx="1" />
              <path d="M10 4V2H2V10H4" />
            </svg>
          </button>
          <button
            onClick={() => removeElement(selectedElement.id)}
            className="rounded p-1 text-[var(--danger)] hover:bg-[var(--surface-light)]"
            title="Delete"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 4H11L10 13H4L3 4Z" />
              <line x1="1" y1="4" x2="13" y2="4" />
              <path d="M5 4V2H9V4" />
            </svg>
          </button>
        </div>
      </div>

      <div className="h-px bg-[var(--border)]" />
      <TransformControls element={selectedElement} />
      <div className="h-px bg-[var(--border)]" />
      <AnimationControls element={selectedElement} />
      <div className="h-px bg-[var(--border)]" />
      <StyleControls element={selectedElement} />
      <div className="h-px bg-[var(--border)]" />
      <AIEditInput element={selectedElement} />
    </div>
  );
};
