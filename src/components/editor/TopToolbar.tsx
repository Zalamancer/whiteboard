"use client";

import React, { useCallback, useState } from "react";
import { useProjectStore } from "@/store/useProjectStore";
import { useEditorStore } from "@/store/useEditorStore";
import { useHistoryStore } from "@/store/useHistoryStore";
import { saveProject, loadProjectFromFile } from "@/lib/export";
import { ExportDialog } from "./ExportDialog";

export const TopToolbar: React.FC = () => {
  const [exportOpen, setExportOpen] = useState(false);
  const project = useProjectStore((s) => s.project);
  const setProject = useProjectStore((s) => s.setProject);
  const updateProject = useProjectStore((s) => s.updateProject);
  const toggleLeft = useEditorStore((s) => s.toggleLeftSidebar);
  const toggleRight = useEditorStore((s) => s.toggleRightSidebar);
  const leftOpen = useEditorStore((s) => s.leftSidebarOpen);
  const rightOpen = useEditorStore((s) => s.rightSidebarOpen);

  const undoFn = useHistoryStore((s) => s.undo);
  const redoFn = useHistoryStore((s) => s.redo);
  const pushState = useHistoryStore((s) => s.pushState);

  const handleSave = useCallback(() => {
    saveProject(project);
  }, [project]);

  const handleLoad = useCallback(async () => {
    try {
      const loaded = await loadProjectFromFile();
      setProject(loaded);
    } catch {
      // User cancelled or invalid file
    }
  }, [setProject]);

  const handleUndo = useCallback(() => {
    const prev = undoFn();
    if (prev) setProject(prev);
  }, [undoFn, setProject]);

  const handleRedo = useCallback(() => {
    const next = redoFn();
    if (next) setProject(next);
  }, [redoFn, setProject]);

  return (
    <div className="flex h-12 shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-4">
      <div className="flex items-center gap-2">
        <button
          onClick={toggleLeft}
          className="flex h-7 w-7 items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--surface-light)] hover:text-[var(--foreground)]"
          title="Toggle assets panel"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="2" width="5" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" fill={leftOpen ? "currentColor" : "none"} fillOpacity={0.2} />
            <rect x="8" y="2" width="7" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </button>
        <div className="h-4 w-px bg-[var(--border)]" />
        <span className="text-sm font-semibold text-[var(--foreground)]">
          Whiteboard Studio
        </span>
        <div className="h-4 w-px bg-[var(--border)]" />
        {/* Undo/Redo */}
        <button
          onClick={handleUndo}
          className="flex h-7 w-7 items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--surface-light)] hover:text-[var(--foreground)]"
          title="Undo (Cmd+Z)"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 5L1 7L3 9" />
            <path d="M1 7H9C11 7 13 8.5 13 11" />
          </svg>
        </button>
        <button
          onClick={handleRedo}
          className="flex h-7 w-7 items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--surface-light)] hover:text-[var(--foreground)]"
          title="Redo (Cmd+Shift+Z)"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M11 5L13 7L11 9" />
            <path d="M13 7H5C3 7 1 8.5 1 11" />
          </svg>
        </button>
      </div>

      {/* Project name (editable) */}
      <input
        type="text"
        value={project.name}
        onChange={(e) => updateProject({ name: e.target.value })}
        className="max-w-[200px] bg-transparent text-center text-xs text-[var(--text-muted)] outline-none focus:text-[var(--foreground)]"
      />

      <div className="flex items-center gap-2">
        <button
          onClick={handleSave}
          className="rounded px-2.5 py-1.5 text-[10px] font-medium text-[var(--text-muted)] hover:bg-[var(--surface-light)] hover:text-[var(--foreground)]"
          title="Save project"
        >
          Save
        </button>
        <button
          onClick={handleLoad}
          className="rounded px-2.5 py-1.5 text-[10px] font-medium text-[var(--text-muted)] hover:bg-[var(--surface-light)] hover:text-[var(--foreground)]"
          title="Load project"
        >
          Load
        </button>
        <div className="h-4 w-px bg-[var(--border)]" />
        <button
          onClick={() => setExportOpen(true)}
          className="rounded bg-[var(--primary)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[var(--primary-hover)]"
          title="Export video"
        >
          Export
        </button>
        <ExportDialog open={exportOpen} onClose={() => setExportOpen(false)} />
        <div className="h-4 w-px bg-[var(--border)]" />
        <button
          onClick={toggleRight}
          className="flex h-7 w-7 items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--surface-light)] hover:text-[var(--foreground)]"
          title="Toggle properties panel"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="2" width="7" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <rect x="10" y="2" width="5" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" fill={rightOpen ? "currentColor" : "none"} fillOpacity={0.2} />
          </svg>
        </button>
      </div>
    </div>
  );
};
